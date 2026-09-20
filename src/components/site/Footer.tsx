import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "./Logo";
import { BRANCHES } from "@/data/branches";
import { waLink, waMessages } from "@/lib/whatsapp";

const explore = [
  { to: "/phones", label: "Phones" },
  { to: "/accessories", label: "Accessories" },
  { to: "/repair", label: "Repair" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
] as const;

const services = [
  { to: "/repair", label: "iPhone Repair" },
  { to: "/repair", label: "Android Repair" },
  { to: "/repair", label: "Screen Replacement" },
  { to: "/repair", label: "Battery Replacement" },
  { to: "/accessories", label: "Phone Accessories" },
] as const;

export function Footer() {
  return (
    <footer className="glass-stage pb-20 pt-0 lg:pb-7">
      <div className="shell">
      <div className="glass-panel overflow-hidden">
      <div className="grid gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:grid-cols-5 lg:px-12 lg:py-14">
        <div className="lg:col-span-2">
          <Logo onDark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
            Smartphones, accessories and expert iPhone &amp; Android repair in Triprayar and
            Chavakkad. Good phones, fair value and service you can come back to.
          </p>
          <a
            href={waLink(waMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Chat with Ozon Mobiles
          </a>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="eyebrow text-cyan">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {explore.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-navy-foreground/75 transition-colors hover:text-navy-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="eyebrow text-cyan">
            Services
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-navy-foreground/75 transition-colors hover:text-navy-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-cyan">Stores &amp; Contact</h2>
          <ul className="mt-4 space-y-5 text-sm">
            {BRANCHES.map((b) => (
              <li key={b.id}>
                <Link
                  to="/stores/$branch"
                  params={{ branch: b.slug }}
                  className="font-display font-semibold text-navy-foreground hover:text-cyan"
                >
                  {b.shortName}
                </Link>
                <p className="mt-1 text-navy-foreground/60">{b.address}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <a
                    href={`tel:${b.tel}`}
                    className="inline-flex items-center gap-1.5 text-navy-foreground/80 hover:text-cyan"
                  >
                    <Phone aria-hidden="true" className="size-3.5" />
                    {b.phoneDisplay}
                  </a>
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-navy-foreground/80 hover:text-cyan"
                  >
                    <MapPin aria-hidden="true" className="size-3.5" />
                    Directions
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10 bg-navy-deep/20">
        <div className="flex flex-col gap-3 px-6 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-12">
          <p>© {new Date().getFullYear()} Ozon Mobiles. All About Mobiles.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-navy-foreground">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-navy-foreground">
              Terms &amp; Conditions
            </a>
            <Link to="/auth" className="hover:text-navy-foreground">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
      </div>
      </div>
    </footer>
  );
}
