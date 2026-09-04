import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | Ozon Mobiles" },
      {
        name: "description",
        content:
          "Sign in to the Ozon Mobiles staff area to manage the phone catalogue, accessories and offers.",
      },
      { property: "og:title", content: "Staff Sign In | Ozon Mobiles" },
      {
        property: "og:description",
        content: "Ozon Mobiles staff area for managing products, accessories and offers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin", replace: true });
        else toast.success("Check your email to confirm your account, then sign in.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <section className="section-y">
      <div className="shell max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <p className="eyebrow text-electric">Staff area</p>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            {mode === "signin" ? "Sign in to manage products" : "Create a staff account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only Ozon Mobiles staff with admin access can add or edit phones, accessories and
            offers.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="quiet" size="lg" className="w-full" onClick={onGoogle}>
            Continue with Google
          </Button>

          <button
            type="button"
            className="mt-5 w-full text-sm font-semibold text-electric hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Need a staff account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </section>
  );
}
