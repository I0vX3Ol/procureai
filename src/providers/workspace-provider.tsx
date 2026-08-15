import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  notifications as seedNotifications,
  opportunities as seedOpportunities,
  currentUser,
} from "@/data/mock-data";
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
  const [opportunities, setOpportunities] = useState<Opportunity[]>(seedOpportunities);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);

  const moveOpportunity = useCallback((id: string, stage: PipelineStage) => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stage, status: statusForStage[stage] } : item,
      ),
    );
  }, []);

  const addNote = useCallback((id: string, body: string) => {
    const note: OpportunityNote = {
      id: crypto.randomUUID(),
      author: currentUser.name,
      body,
      createdAt: new Date(),
    };
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: [note, ...item.notes] } : item)),
    );
  }, []);

  const updateProbability = useCallback((id: string, probability: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(probability)));
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, probability: clamped } : item)),
    );
  }, []);

  const markNotificationRead = useCallback((id: string, read: boolean) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read } : item)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
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
