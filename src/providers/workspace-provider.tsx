import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchNotifications,
  fetchOpportunities,
  fetchProfile,
  persistAllNotificationsRead,
  persistNotificationRead,
  persistOpportunityNote,
  persistOpportunityProbability,
  persistOpportunityStage,
} from "@/lib/remote-data";
import type { Notification, Opportunity, OpportunityNote, PipelineStage } from "@/types";

/**
 * Client-side workspace state shared across modules.
 *
 * Mutations are local to the session today; the interface mirrors what a server
 * mutation layer would expose, so swapping in real API calls is a drop-in change
 * for consumers.
 */
interface WorkspaceContextValue {
  opportunities: Opportunity[];
  notifications: Notification[];
  unreadCount: number;
  moveOpportunity: (id: string, stage: PipelineStage) => void;
  addNote: (id: string, body: string) => void;
  updateProbability: (id: string, probability: number) => void;
  markNotificationRead: (id: string, read: boolean) => void;
  markAllNotificationsRead: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

/** Keeps `status` consistent whenever an opportunity is moved between stages. */
const statusForStage: Record<PipelineStage, Opportunity["status"]> = {
  discovery: "discovered",
  qualification: "qualified",
  proposal: "in_progress",
  review: "in_progress",
  submitted: "submitted",
  awarded: "won",
};

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [authorName, setAuthorName] = useState("You");

  useEffect(() => {
    let cancelled = false;
    void fetchOpportunities().then((records) => {
      if (!cancelled) setOpportunities(records);
    });
    void fetchNotifications().then((records) => {
      if (!cancelled) setNotifications(records as Notification[]);
    });
    void fetchProfile().then((profile) => {
      if (!cancelled && profile?.name) setAuthorName(profile.name);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const moveOpportunity = useCallback((id: string, stage: PipelineStage) => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stage, status: statusForStage[stage] } : item,
      ),
    );
    void persistOpportunityStage(id, stage);
  }, []);

  const addNote = useCallback(
    (id: string, body: string) => {
      const note: OpportunityNote = {
        id: crypto.randomUUID(),
        author: authorName,
        body,
        createdAt: new Date(),
      };
      setOpportunities((prev) =>
        prev.map((item) => (item.id === id ? { ...item, notes: [note, ...item.notes] } : item)),
      );
      void persistOpportunityNote(id, note);
    },
    [authorName],
  );

  const updateProbability = useCallback((id: string, probability: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(probability)));
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, probability: clamped } : item)),
    );
    void persistOpportunityProbability(id, clamped);
  }, []);

  const markNotificationRead = useCallback((id: string, read: boolean) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read } : item)));
    void persistNotificationRead(id, read);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    void persistAllNotificationsRead();
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      opportunities,
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      moveOpportunity,
      addNote,
      updateProbability,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      opportunities,
      notifications,
      moveOpportunity,
      addNote,
      updateProbability,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return context;
}
