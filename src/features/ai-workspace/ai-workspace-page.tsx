import { FileText, Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiService, type AIAnalysisRequest, type AIChatMessage } from "@/lib/ai/service";
import { cn, formatCurrency } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";

const analysisTypes: { type: AIAnalysisRequest["type"]; label: string }[] = [
  { type: "summary", label: "Executive Summary" },
  { type: "requirements", label: "Requirements" },
  { type: "deadlines", label: "Deadlines" },
  { type: "risk", label: "Risk Analysis" },
  { type: "compliance", label: "Compliance" },
  { type: "fit", label: "Fit Score" },
];

const suggestedPrompts = [
  "What are the mandatory certifications?",
  "When is the proposal due?",
  "Summarise the evaluation criteria.",
  "What are the biggest compliance risks?",
];

export function AIWorkspacePage() {
  const { opportunities } = useWorkspace();
  const [selectedOpp, setSelectedOpp] = useState(opportunities[0]?.id ?? "");
  const [analysisType, setAnalysisType] = useState<AIAnalysisRequest["type"]>("summary");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me anything about your uploaded RFP documents. I can help with requirements, deadlines, compliance, and proposal drafting.",
      timestamp: new Date(),
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const runAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const result = await aiService.analyzeDocument({
        documentId: selectedOpp,
        type: analysisType,
      });
      setAnalysisResult(result.content);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatLoading) return;

    const userMessage: AIChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await aiService.chat([selectedOpp], trimmed);
      setMessages((prev) => [...prev, response]);
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    void ask(chatInput);
  };

  const selectedOpportunity = opportunities.find((o) => o.id === selectedOpp);

  return (
    <PageShell
      title="AI Workspace"
      description="Analyse RFPs, extract requirements, and chat with your documents"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "AI Workspace" }]}
    >
      <div className="mb-6">
        <Label className="text-sm font-medium">Working context</Label>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Choose the opportunity the AI should reason about.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Select opportunity">
          {opportunities.slice(0, 5).map((opp) => (
            <Button
              key={opp.id}
              variant={selectedOpp === opp.id ? "default" : "outline"}
              size="sm"
              aria-pressed={selectedOpp === opp.id}
              onClick={() => {
                setSelectedOpp(opp.id);
                setAnalysisResult(null);
              }}
            >
              <FileText className="size-3.5" aria-hidden="true" />
              {opp.title.length > 40 ? `${opp.title.slice(0, 40)}…` : opp.title}
            </Button>
          ))}
        </div>
      </div>

      {selectedOpportunity && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{selectedOpportunity.title}</p>
              <p className="text-xs text-muted-foreground">
                {selectedOpportunity.agency} · {formatCurrency(selectedOpportunity.value)} · Due{" "}
                {selectedOpportunity.deadline.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant="success">{selectedOpportunity.fitScore}% fit</Badge>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Document Chat</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="flex h-[480px] flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chat with documents</CardTitle>
              <CardDescription>
                Ask questions about requirements, deadlines, and evaluation criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden pt-0">
              <ScrollArea
                className="flex-1 pr-4"
                viewportProps={{
                  tabIndex: 0,
                  role: "log",
                  "aria-label": "Conversation",
                  "aria-live": "polite",
                  "aria-relevant": "additions",
                }}
              >
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "max-w-[85%] rounded-lg px-4 py-3 text-sm",
                        msg.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {msg.citations.map((cite) => (
                            <Badge key={cite} variant="outline" className="text-[10px]">
                              {cite}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Analyzing documents…
                    </div>
                  )}
                </div>
              </ScrollArea>
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
                  {suggestedPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto whitespace-normal py-1.5 text-left"
                      disabled={chatLoading}
                      onClick={() => void ask(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              )}
              <form onSubmit={sendMessage} className="flex gap-2">
                <Label htmlFor="ai-chat-input" className="sr-only">
                  Ask a question about the selected opportunity
                </Label>
                <Input
                  id="ai-chat-input"
                  placeholder="Ask about deadlines, requirements, compliance…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <Button type="submit" size="icon" disabled={chatLoading || !chatInput.trim()}>
                  <Send className="size-4" aria-hidden="true" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Run AI analysis</CardTitle>
              <CardDescription>
                Extract structured insights from the selected RFP document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {analysisTypes.map(({ type, label }) => (
                  <Button
                    key={type}
                    variant={analysisType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType(type)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <Button onClick={runAnalysis} disabled={analysisLoading}>
                {analysisLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" aria-hidden="true" />
                    Run analysis
                  </>
                )}
              </Button>
              {analysisResult && (
                <div
                  className="rounded-lg border border-border bg-muted/50 p-4"
                  role="region"
                  aria-live="polite"
                  aria-label="AI analysis result"
                >
                  <p className="text-sm leading-relaxed">{analysisResult}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Confidence: 89% · Sources: RFP Section C, L, M · Review before use
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
