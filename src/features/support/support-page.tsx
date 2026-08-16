import { BookOpen, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { faqItems } from "@/data/marketing-content";

export function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both fields before sending");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent", {
        description: "We'll get back to you within one business day.",
      });
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 500);
  }

  return (
    <PageShell
      title="Support"
      description="Find answers, browse documentation, or reach the ProcureAI team directly."
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Support" }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="size-5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Documentation</CardTitle>
              <CardDescription>
                Guides for setup, integrations, and the AI workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast.info("Documentation", {
                    description: "Opening the ProcureAI knowledge base…",
                  })
                }
              >
                Browse docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageCircle className="size-5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Live chat</CardTitle>
              <CardDescription>Chat with our team, Monday to Friday, 9am–6pm ET.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast.info("Live chat", {
                    description: "Connecting you to the next available agent…",
                  })
                }
              >
                Start chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="size-5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Email us</CardTitle>
              <CardDescription>
                support@procureai.com · replies within 1 business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@procureai.com">Send an email</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact support</CardTitle>
              <CardDescription>
                Send us a message and we&apos;ll follow up by email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input
                    id="support-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="What do you need help with?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-message">Message</Label>
                  <Textarea
                    id="support-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Describe your issue or question in detail…"
                    className="min-h-32"
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  <Send className="size-4" aria-hidden="true" />
                  {submitting ? "Sending…" : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Frequently asked questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {faqItems.map((item) => (
                  <details key={item.question} className="group py-4 first:pt-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span
                        className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
