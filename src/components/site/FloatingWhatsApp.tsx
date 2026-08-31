import { MessageCircle } from "lucide-react";

import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const { branch } = useBranch();

  return (
    <a
      href={waLink(waMessages.general, branch.id)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${branch.name} on WhatsApp`}
      className="fixed bottom-[4.75rem] right-4 z-40 inline-flex size-12 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
    >
      <MessageCircle aria-hidden="true" className="size-6" />
    </a>
  );
}
