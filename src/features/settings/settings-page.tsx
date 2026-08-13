import { KeyRound, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { currentUser } from '@/data/mock-data'
import { useTheme } from '@/providers/theme-provider'

interface NotificationPrefs {
  deadlineAlerts: boolean
  aiActivity: boolean
  weeklyDigest: boolean
  teamMentions: boolean
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    deadlineAlerts: true,
    aiActivity: true,
    weeklyDigest: false,
    teamMentions: true,
  })

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault()
    toast.success('Profile updated')
  }

  function togglePref(key: keyof NotificationPrefs) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      toast.success(next[key] ? 'Notification enabled' : 'Notification disabled')
      return next
    })
  }

  function handleChangePassword(event: React.FormEvent) {
    event.preventDefault()
    toast.success('Password updated')
  }

  return (
    <PageShell
      title="Settings"
      description="Manage your account, notification preferences, and security."
      breadcrumbs={[{ label: 'Workspace', href: '/app' }, { label: 'Settings' }]}
    >
      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Full name</Label>
                  <Input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-theme">Appearance</Label>
                  <div className="flex gap-2" id="settings-theme" role="group" aria-label="Theme">
                    {(['light', 'dark', 'system'] as const).map((option) => (
                      <Button
                        key={option}
                        type="button"
                        size="sm"
                        variant={theme === option ? 'default' : 'outline'}
                        aria-pressed={theme === option}
                        onClick={() => setTheme(option)}
                        className="capitalize"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="submit">
                  <Save className="size-4" aria-hidden="true" />
                  Save changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationRow
                id="deadlineAlerts"
                label="Deadline alerts"
                description="Get notified when opportunity deadlines are approaching"
                checked={prefs.deadlineAlerts}
                onCheckedChange={() => togglePref('deadlineAlerts')}
              />
              <Separator />
              <NotificationRow
                id="aiActivity"
                label="AI activity"
                description="Updates when AI completes document analysis or drafting"
                checked={prefs.aiActivity}
                onCheckedChange={() => togglePref('aiActivity')}
              />
              <Separator />
              <NotificationRow
                id="weeklyDigest"
                label="Weekly digest"
                description="A summary of pipeline changes sent every Monday"
                checked={prefs.weeklyDigest}
                onCheckedChange={() => togglePref('weeklyDigest')}
              />
              <Separator />
              <NotificationRow
                id="teamMentions"
                label="Team mentions"
                description="When a teammate assigns you a task or mentions you"
                checked={prefs.teamMentions}
                onCheckedChange={() => togglePref('teamMentions')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input id="current-password" type="password" autoComplete="current-password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" autoComplete="new-password" required minLength={8} />
                </div>
                <Button type="submit">
                  <KeyRound className="size-4" aria-hidden="true" />
                  Update password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

function NotificationRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
