import { Link, useNavigate } from '@tanstack/react-router'
import { Bot } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password')
      return
    }
    setLoading(true)
    setTimeout(() => {
      toast.success('Welcome back!')
      navigate({ to: '/app' })
    }, 600)
  }

  return (
    <main
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 px-4"
    >
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bot className="size-5" aria-hidden="true" />
        </div>
        <span className="text-lg font-semibold tracking-tight">ProcureAI</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() =>
                    toast.info('Check your email', {
                      description: 'If an account exists for that email, a reset link is on its way.',
                    })
                  }
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Start free trial
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
