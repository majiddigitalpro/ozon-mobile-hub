import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export function FinalCta() {
  const { branchId } = useBranch();

  return (
    <section className="surface-dark section-y hairline-grid">
      <div className="shell text-center">
        <h2 className="text-balance text-2xl font-extrabold text-navy-foreground sm:text-3xl md:text-[2.4rem]">
          Need a New Phone or a Quick Repair?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-navy-foreground/70 sm:text-base">
          From choosing your next smartphone to getting your current one working again, Ozon Mobiles
          is here to help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/phones">Explore Phones</Link>
          </Button>
          <Button asChild variant="onDark" size="lg">
            <Link to="/repair/book">Book a Repair</Link>
          </Button>
          <Button asChild variant="whatsapp" size="lg">
            <a href={waLink(waMessages.general, branchId)} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
