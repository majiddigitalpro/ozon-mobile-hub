import { Link } from "@tanstack/react-router";
import { Home, MapPin, MessageCircle, Smartphone, Wrench } from "lucide-react";

import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/phones", label: "Phones", icon: Smartphone, exact: false },
  { to: "/repair", label: "Repair", icon: Wrench, exact: false },
] as const;

export function MobileTabBar() {
  const { branch } = useBranch();

  return (
    <nav
      aria-label="Quick actions"
      className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium text-muted-foreground transition-colors data-[status=active]:text-electric"
            >
              <Icon aria-hidden="true" className="size-5" />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={waLink(waMessages.general, branch.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium text-whatsapp"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            WhatsApp
          </a>
        </li>
        <li>
          <Link
            to="/stores"
            className="flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium text-muted-foreground transition-colors data-[status=active]:text-electric"
          >
            <MapPin aria-hidden="true" className="size-5" />
            Stores
          </Link>
        </li>
      </ul>
    </nav>
  );
}
