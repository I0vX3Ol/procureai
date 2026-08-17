import { useState } from "react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cancelSubscription,
  openBillingPortal,
  resumeSubscription,
  startCheckout,
  useCheckoutReturn,
  useSubscription,
} from "@/lib/subscription";
import { PLANS, type Plan } from "@/lib/plans";

/**
 * Plan selection and current subscription state.
 *
 * Prices are duplicated here as display copy only — the amount actually charged
 * comes from the Stripe price id configured on the Worker, never from anything
 * the browser sends. The checkout endpoint accepts a plan slug and looks the
 * price up server-side for exactly that reason.
 */

const PLAN_COPY: Record<Plan, { name: string; price: string; blurb: string; features: string[] }> =
  {
    starter: {
      name: "Starter",
      price: "$199",
      blurb: "For small teams getting started with procurement intelligence.",
      features: [
        "Up to 5 team members",
        "50 opportunities per month",
        "AI document analysis",
        "Basic pipeline tracking",
        "Email support",
      ],
    },
    professional: {
      name: "Professional",
      price: "$299",
      blurb: "For growing teams that need analytics and integrations.",
      features: [
        "Everything in Starter",
        "Unlimited opportunities",
        "Advanced analytics",
        "Integrations",
        "Priority support",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: "$499",
      blurb: "For multi-team procurement organisations.",
      features: [
        "Everything in Professional",
        "Unlimited seats",
        "API access",
        "Audit logs",
        "Dedicated onboarding",
      ],
    },
  };

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Payment overdue",
  canceled: "Cancelled",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
};

export function BillingCard() {
  const { subscription, loading, entitled, plan } = useSubscription();
  const { settling } = useCheckoutReturn();
  const [pending, setPending] = useState<Plan | null>(null);
  const [busy, setBusy] = useState<"cancel" | "resume" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (kind: "cancel" | "resume" | "portal") => {
    setError(null);
    setNotice(null);
    setBusy(kind);
    try {
      if (kind === "portal") {
        await openBillingPortal();
        return;
      }
      if (kind === "cancel") {
        await cancelSubscription();
        setNotice("Your plan will end when the current period does. You keep access until then.");
      } else {
        await resumeSubscription();
        setNotice("Your subscription will continue as normal.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const onSubscribe = async (next: Plan) => {
    setError(null);
    setPending(next);
    try {
      await startCheckout(next);
      // startCheckout navigates away on success; nothing to do here.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setPending(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          {loading
            ? "Checking your subscription…"
            : entitled && subscription
              ? `Your organisation is on the ${PLAN_COPY[plan as Plan]?.name ?? plan} plan.`
              : "Choose a plan to unlock ProcureAI."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {subscription && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <Badge variant={entitled ? "default" : "secondary"}>
              {STATUS_LABEL[subscription.status] ?? subscription.status}
            </Badge>

            {subscription.current_period_end && (
              <span className="text-sm text-muted-foreground">
                {subscription.status === "trialing"
                  ? "Trial ends"
                  : subscription.cancel_at_period_end
                    ? "Ends"
                    : "Renews"}{" "}
                <time dateTime={subscription.current_period_end}>
                  {new Date(subscription.current_period_end).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            )}

            {subscription.status === "past_due" && (
              <span className="text-sm text-muted-foreground">
                We could not take the last payment. Access stays on while Stripe retries.
              </span>
            )}
          </div>
        )}

        {settling && (
          <p role="status" className="text-sm text-muted-foreground">
            Payment received — activating your subscription. This usually takes a few seconds.
          </p>
        )}

        {notice && (
          <p role="status" className="text-sm font-medium text-sage-deep">
            {notice}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        {entitled && subscription && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" disabled={busy !== null} onClick={() => run("portal")}>
              {busy === "portal" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Opening…
                </>
              ) : (
                "Manage payment method"
              )}
            </Button>

            {subscription.cancel_at_period_end ? (
              <Button variant="outline" disabled={busy !== null} onClick={() => run("resume")}>
                {busy === "resume" ? "Resuming…" : "Resume subscription"}
              </Button>
            ) : (
              <Button variant="ghost" disabled={busy !== null} onClick={() => run("cancel")}>
                {busy === "cancel" ? "Cancelling…" : "Cancel subscription"}
              </Button>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((key) => {
            const copy = PLAN_COPY[key];
            const isCurrent = entitled && plan === key;

            return (
              <div key={key} className="flex flex-col rounded-lg border border-border p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{copy.name}</h3>
                  {isCurrent && <Badge variant="outline">Current</Badge>}
                </div>

                <p className="mt-2">
                  <span className="text-2xl font-semibold">{copy.price}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>

                <p className="mt-2 text-sm text-muted-foreground">{copy.blurb}</p>

                <ul className="mt-4 flex-1 space-y-2">
                  {copy.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-5 w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || pending !== null || loading}
                  onClick={() => onSubscribe(key)}
                >
                  {pending === key ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Redirecting…
                    </>
                  ) : isCurrent ? (
                    "Current plan"
                  ) : (
                    <>
                      {/* First-timers get the 14-day trial the landing page
                          promises; anyone who has subscribed before (even if
                          currently cancelled) is resubscribing, not trialling. */}
                      {!subscription
                        ? `Start free trial — ${copy.name}`
                        : `${entitled ? "Switch to" : "Resubscribe to"} ${copy.name}`}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Payments are handled by Stripe — we never see your card details. Charges appear on your
          statement as <strong>NEXUDEL* PROCUREAI</strong>.
        </p>
      </CardContent>
    </Card>
  );
}
