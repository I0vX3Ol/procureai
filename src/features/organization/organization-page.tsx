import { Building2, Mail, Shield, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/layout/page-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Capture Manager" | "Proposal Writer" | "Viewer";
}

const initialTeam: TeamMember[] = [
  { id: "mem-1", name: "Alex Chen", email: "alex@acme-procurement.com", role: "Admin" },
  {
    id: "mem-2",
    name: "Priya Raman",
    email: "priya@acme-procurement.com",
    role: "Capture Manager",
  },
  {
    id: "mem-3",
    name: "Jordan Vale",
    email: "jordan@acme-procurement.com",
    role: "Proposal Writer",
  },
  { id: "mem-4", name: "Sam Rivera", email: "sam@acme-procurement.com", role: "Viewer" },
];

const roleVariant: Record<TeamMember["role"], "default" | "secondary" | "outline"> = {
  Admin: "default",
  "Capture Manager": "secondary",
  "Proposal Writer": "secondary",
  Viewer: "outline",
};

export function OrganizationPage() {
  const [team, setTeam] = useState(initialTeam);
  const [inviteEmail, setInviteEmail] = useState("");

  function handleInvite(event: React.FormEvent) {
    event.preventDefault();
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Enter an email address to send an invite");
      return;
    }
    const name = email.split("@")[0]?.replace(/[._]/g, " ") ?? email;
    setTeam((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role: "Viewer",
      },
    ]);
    toast.success("Invitation sent", { description: email });
    setInviteEmail("");
  }

  function handleRemove(id: string) {
    const member = team.find((item) => item.id === id);
    setTeam((prev) => prev.filter((item) => item.id !== id));
    if (member) toast.success("Member removed", { description: member.name });
  }

  return (
    <PageShell
      title="Organization"
      description="Manage your company profile, team members, and access roles."
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Organization" }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" aria-hidden="true" />
            </div>
            <CardTitle className="text-base">Company profile</CardTitle>
            <CardDescription>Acme Procurement Group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="mt-0.5 font-medium">Professional · 25 seats</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground">NAICS codes</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge variant="outline">541511</Badge>
                <Badge variant="outline">541512</Badge>
                <Badge variant="outline">541519</Badge>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground">Certifications</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge variant="outline">SDVOSB</Badge>
                <Badge variant="outline">ISO 27001</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invite a teammate</CardTitle>
              <CardDescription>
                They&apos;ll receive an email invitation to join your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Label htmlFor="invite-email" className="sr-only">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="teammate@company.com"
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit">
                  <UserPlus className="size-4" aria-hidden="true" />
                  Send invite
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team members</CardTitle>
              <CardDescription>{team.length} people have access to this workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {team.map((member) => (
                  <li key={member.id} className="flex items-center gap-3 py-3">
                    <Avatar className="size-9">
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{member.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant={roleVariant[member.role]}>
                      {member.role === "Admin" && (
                        <Shield className="mr-1 size-3" aria-hidden="true" />
                      )}
                      {member.role}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(member.id)}
                      disabled={member.role === "Admin"}
                      aria-label={`Remove ${member.name}`}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
