import { Link } from "@tanstack/react-router";
import { ExternalLink, KeyRound, Save, ShieldCheck } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fetchProfile, updateProfile } from "@/lib/remote-data";
import { useTheme } from "@/providers/theme-provider";
import { BillingCard } from "@/features/settings/billing-card";

interface NotificationPrefs {
  deadlineAlerts: boolean;
  aiActivity: boolean;
  weeklyDigest: boolean;
  teamMentions: boolean;
}

const accentOptions = [
  { value: "indigo", label: "Indigo", swatch: "oklch(0.45 0.14 250)" },
  { value: "teal", label: "Teal", swatch: "oklch(0.5 0.11 190)" },
  { value: "violet", label: "Violet", swatch: "oklch(0.48 0.16 300)" },
];

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    void fetchProfile().then((profile) => {
      if (cancelled || !profile) return;
      setName(profile.name);
      setEmail(profile.email);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const [title, setTitle] = useState("Director of Capture");
  const [orgName, setOrgName] = useState("Acme Procurement Group");
  const [orgDomain, setOrgDomain] = useState("acme-procurement.com");
  const [accent, setAccent] = useState("indigo");
  const [density, setDensity] = useState("comfortable");
  const [tone, setTone] = useState("formal");
  const [creativity, setCreativity] = useState([35]);
  const [citations, setCitations] = useState(true);
  const [autoAnalyse, setAutoAnalyse] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [boilerplate, setBoilerplate] = useState(
    "Acme Procurement Group delivers secure cloud modernisation for federal and state agencies, with a FedRAMP High authorised platform and twelve completed agency migrations.",
  );
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    deadlineAlerts: true,
    aiActivity: true,
    weeklyDigest: false,
    teamMentions: true,
  });

  const creativityId = useId();

  function togglePref(key: keyof NotificationPrefs, label: string) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(`${label} ${next[key] ? "enabled" : "disabled"}`);
      return next;
    });
  }

  function saved(message: string) {
    return (event: React.FormEvent) => {
      event.preventDefault();
      toast.success(message);
    };
  }

  return (
    <PageShell
      title="Settings"
      description="Account, organisation, appearance, AI, and security preferences"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Settings" }]}
    >
      <Tabs defaultValue="profile" className="max-w-5xl">
        <div className="overflow-x-auto">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organization">Organisation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="billing">
          <BillingCard />
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>How you appear to teammates across the workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saved("Profile updated")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Full name</Label>
                  <Input
                    id="settings-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-title">Job title</Label>
                  <Input
                    id="settings-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    autoComplete="organization-title"
                  />
                </div>
                <Button type="submit">
                  <Save className="size-4" aria-hidden="true" />
                  Save changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organisation</CardTitle>
              <CardDescription>
                Company details used on proposals and vendor registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saved("Organisation updated")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Legal name</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(event) => setOrgName(event.target.value)}
                    autoComplete="organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-domain">Primary domain</Label>
                  <Input
                    id="org-domain"
                    value={orgDomain}
                    onChange={(event) => setOrgDomain(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-boilerplate">Company boilerplate</Label>
                  <Textarea
                    id="org-boilerplate"
                    value={boilerplate}
                    onChange={(event) => setBoilerplate(event.target.value)}
                    className="min-h-28"
                  />
                  <p className="text-xs text-muted-foreground">
                    Reused by the proposal builder when drafting executive summaries.
                  </p>
                </div>
                <Button type="submit">
                  <Save className="size-4" aria-hidden="true" />
                  Save organisation
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team and integrations</CardTitle>
              <CardDescription>Manage people and connected systems</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/app/organization">Manage team members</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/app/integrations">Manage integrations</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Theme, accent colour, and layout density</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <fieldset>
                <legend className="text-sm font-medium">Theme</legend>
                <p className="mt-1 text-sm text-muted-foreground">
                  System follows your operating system setting.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["light", "dark", "system"] as const).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={theme === option ? "default" : "outline"}
                      aria-pressed={theme === option}
                      onClick={() => setTheme(option)}
                      className="capitalize"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <Separator />

              <fieldset>
                <legend className="text-sm font-medium">Accent colour</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {accentOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      size="sm"
                      variant={accent === option.value ? "default" : "outline"}
                      aria-pressed={accent === option.value}
                      onClick={() => {
                        setAccent(option.value);
                        toast.success(`Accent set to ${option.label}`);
                      }}
                    >
                      <span
                        className="size-3 rounded-full border border-border"
                        style={{ background: option.swatch }}
                        aria-hidden="true"
                      />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="density">Layout density</Label>
                <Select value={density} onValueChange={setDensity}>
                  <SelectTrigger id="density" className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <PreferenceRow
                id="deadlineAlerts"
                label="Deadline alerts"
                description="Get notified when opportunity deadlines are approaching"
                checked={prefs.deadlineAlerts}
                onCheckedChange={() => togglePref("deadlineAlerts", "Deadline alerts")}
              />
              <Separator />
              <PreferenceRow
                id="aiActivity"
                label="AI activity"
                description="Updates when AI completes document analysis or drafting"
                checked={prefs.aiActivity}
                onCheckedChange={() => togglePref("aiActivity", "AI activity")}
              />
              <Separator />
              <PreferenceRow
                id="weeklyDigest"
                label="Weekly digest"
                description="A summary of pipeline changes sent every Monday"
                checked={prefs.weeklyDigest}
                onCheckedChange={() => togglePref("weeklyDigest", "Weekly digest")}
              />
              <Separator />
              <PreferenceRow
                id="teamMentions"
                label="Team mentions"
                description="When a teammate assigns you a task or mentions you"
                checked={prefs.teamMentions}
                onCheckedChange={() => togglePref("teamMentions", "Team mentions")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI preferences</CardTitle>
              <CardDescription>
                How ProcureAI drafts, rewrites, and analyses on your behalf
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ai-tone">Writing tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="ai-tone" className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal — federal evaluator</SelectItem>
                    <SelectItem value="plain">Plain language</SelectItem>
                    <SelectItem value="technical">Technical and detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={creativityId}>Drafting creativity</Label>
                <Slider
                  id={creativityId}
                  value={creativity}
                  onValueChange={setCreativity}
                  max={100}
                  step={5}
                  className="max-w-xs"
                  aria-valuetext={`${creativity[0]} percent`}
                />
                <p className="text-xs text-muted-foreground">
                  {creativity[0]}% — lower values stay closer to your source documents.
                </p>
              </div>

              <Separator />

              <PreferenceRow
                id="ai-citations"
                label="Require source citations"
                description="Every generated passage cites the document and page it came from"
                checked={citations}
                onCheckedChange={() => {
                  setCitations((prev) => !prev);
                  toast.success(`Citations ${citations ? "disabled" : "enabled"}`);
                }}
              />
              <Separator />
              <PreferenceRow
                id="ai-auto"
                label="Analyse documents on upload"
                description="Run requirement and deadline extraction as soon as a file is added"
                checked={autoAnalyse}
                onCheckedChange={() => {
                  setAutoAnalyse((prev) => !prev);
                  toast.success(`Automatic analysis ${autoAnalyse ? "disabled" : "enabled"}`);
                }}
              />

              <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                Model credentials are held server-side and never exposed to the browser. Connect a
                provider from{" "}
                <Link
                  to="/app/integrations"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Integrations
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saved("Password updated")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    aria-describedby="new-password-hint"
                  />
                  <p id="new-password-hint" className="text-xs text-muted-foreground">
                    At least 12 characters, including a number and a symbol.
                  </p>
                </div>
                <Button type="submit">
                  <KeyRound className="size-4" aria-hidden="true" />
                  Update password
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
                Account protection
              </CardTitle>
              <CardDescription>Multi-factor authentication and active sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <PreferenceRow
                id="two-factor"
                label="Two-factor authentication"
                description="Require a one-time code from your authenticator app at sign-in"
                checked={twoFactor}
                onCheckedChange={() => {
                  setTwoFactor((prev) => !prev);
                  toast.success(
                    twoFactor
                      ? "Two-factor authentication disabled"
                      : "Two-factor authentication enabled",
                  );
                }}
              />
              <Separator />
              <div className="py-3">
                <h3 className="text-sm font-medium">Active sessions</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center justify-between gap-3">
                    <span>
                      macOS · San Francisco, CA
                      <span className="block text-xs text-muted-foreground">Current session</span>
                    </span>
                    <Badge variant="success">Active</Badge>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>
                      iOS · Sacramento, CA
                      <span className="block text-xs text-muted-foreground">
                        Last active 2 days ago
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success("Session revoked")}
                    >
                      Revoke
                      <span className="sr-only"> iOS session in Sacramento</span>
                    </Button>
                  </li>
                </ul>
              </div>
              <Separator />
              <div className="py-3">
                <h3 className="text-sm font-medium">Compliance</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  SOC 2 Type II certified. Data encrypted at rest and in transit.
                </p>
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link to="/app/support">
                    Request the security package
                    <ExternalLink className="ml-1 size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  const descriptionId = `${id}-description`;

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p id={descriptionId} className="mt-0.5 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-describedby={descriptionId}
      />
    </div>
  );
}
