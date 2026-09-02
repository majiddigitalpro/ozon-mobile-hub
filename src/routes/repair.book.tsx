import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeading } from "@/components/site/Bits";
import { BRANCHES } from "@/data/branches";
import { REPAIR_PROBLEMS } from "@/data/repairs";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/repair/book")({
  head: () => ({
    meta: [
      { title: "Book a Phone Repair | Ozon Mobiles Triprayar & Chavakkad" },
      {
        name: "description",
        content:
          "Request repair assistance from Ozon Mobiles in a few steps — tell us your device, the problem and your preferred branch, and our team will contact you.",
      },
      { property: "og:title", content: "Book a Phone Repair | Ozon Mobiles" },
      {
        property: "og:description",
        content: "A short repair request form, or WhatsApp a technician straight away.",
      },
      { property: "og:url", content: "/repair/book" },
    ],
    links: [{ rel: "canonical", href: "/repair/book" }],
  }),
  component: BookRepairPage,
});

type Errors = Partial<Record<"model" | "problem" | "name" | "phone", string>>;

function BookRepairPage() {
  const { branchId, setBranchId } = useBranch();
  const [deviceType, setDeviceType] = useState("iPhone");
  const [model, setModel] = useState("");
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferred, setPreferred] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!model.trim()) e.model = "Please tell us the device or model.";
    if (!problem) e.problem = "Please choose the problem.";
    if (!name.trim()) e.name = "Please enter your name.";
    if (!/^[0-9+\s-]{8,15}$/.test(phone.trim()))
      e.phone = "Enter a valid phone or WhatsApp number.";
    return e;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  };

  const summaryMessage =
    `Hi Ozon Mobiles, I need help with a phone repair. My device is ${model || "[model]"}` +
    ` (${deviceType}). The issue is ${problem || "[problem]"}.` +
    ` Name: ${name || "-"}. Branch: ${BRANCHES.find((b) => b.id === branchId)?.shortName}.` +
    (preferred ? ` Preferred time: ${preferred}.` : "") +
    (notes ? ` Notes: ${notes}` : "");

  if (submitted) {
    return (
      <section className="section-y">
        <div className="shell max-w-xl">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-whatsapp" />
            <h1 className="mt-4 text-2xl font-extrabold">Thanks! Your repair request has been received.</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Our team will contact you shortly on {phone}. For the fastest response, send us the
              same details on WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={waLink(summaryMessage, branchId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  WhatsApp Ozon Mobiles
                </a>
              </Button>
              <Button asChild variant="quiet" size="lg">
                <Link to="/repair">Back to repair services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-y">
      <div className="shell grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <SectionHeading
            eyebrow="Repair request"
            title="Request repair assistance"
            body="Seven quick questions — no appointment system, no waiting on a form. We'll come back to you with the next step."
          />

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
            <fieldset>
              <legend className="text-sm font-semibold">1. Device type</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["iPhone", "Android", "Other"].map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={deviceType === d ? "hero" : "quiet"}
                    onClick={() => setDeviceType(d)}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor="model" className="text-sm font-semibold">
                2. Device / model
              </Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. iPhone 13, Galaxy A54, Redmi Note 12"
                aria-invalid={Boolean(errors.model)}
                aria-describedby={errors.model ? "model-error" : undefined}
                className="mt-2 h-11"
              />
              {errors.model && (
                <p id="model-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                  {errors.model}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">3. Problem</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {REPAIR_PROBLEMS.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="sm"
                    variant={problem === p ? "hero" : "quiet"}
                    onClick={() => setProblem(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              {errors.problem && (
                <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                  {errors.problem}
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">4. Preferred branch</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {BRANCHES.map((b) => (
                  <Button
                    key={b.id}
                    type="button"
                    variant={branchId === b.id ? "hero" : "quiet"}
                    onClick={() => setBranchId(b.id)}
                  >
                    {b.shortName}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">
                  5. Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="mt-2 h-11"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold">
                  6. Phone / WhatsApp number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="mt-2 h-11"
                />
                {errors.phone && (
                  <p id="phone-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="preferred" className="text-sm font-semibold">
                7. Preferred time / date <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Select value={preferred} onValueChange={setPreferred}>
                <SelectTrigger id="preferred" className="mt-2 h-11">
                  <SelectValue placeholder="Any time is fine" />
                </SelectTrigger>
                <SelectContent>
                  {["Today", "Tomorrow", "This week", "Morning", "Afternoon", "Evening"].map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-semibold">
                Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="When it started, what you've already tried, etc."
                className="mt-2 min-h-24"
              />
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
              Request Repair Assistance
            </Button>
            <p className="text-xs text-muted-foreground">
              We only use these details to contact you about this repair.
            </p>
          </form>
        </div>

        <aside className="lg:pt-16">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl bg-tint-blue p-6">
              <h2 className="font-display text-lg font-extrabold">Prefer to talk now?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Send us the details on WhatsApp and a technician will reply.
              </p>
              <Button asChild variant="whatsapp" size="lg" className="mt-4 w-full">
                <a href={waLink(summaryMessage, branchId)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  WhatsApp a Technician
                </a>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-bold">Good to know</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Selected repairs can be completed in as little as 1 hour, depending on the device and parts availability.</li>
                <li>We explain the diagnosis and the repair before starting.</li>
                <li>Both branches handle iPhone and Android devices.</li>
              </ul>
              <Button asChild variant="ghost" size="sm" className="mt-4">
                <Link to="/repair">See repair services</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
