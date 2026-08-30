import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, Search, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "./Logo";
import { BranchSwitcher } from "./BranchSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/phones", label: "Phones" },
  { to: "/accessories", label: "Accessories" },
  { to: "/repair", label: "Repair" },
  { to: "/offers", label: "Offers" },
  { to: "/stores", label: "Stores" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { branch } = useBranch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-border shadow-sm" : "bg-background",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-18">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:text-electric"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="icon" aria-label="Search phones">
            <Link to="/phones" search={{ q: "" }}>
              <Search />
            </Link>
          </Button>
          <BranchSwitcher compact />
          <Button asChild variant="quiet" size="default">
            <Link to="/phones">Explore Phones</Link>
          </Button>
          <Button asChild variant="hero" size="default">
            <Link to="/repair/book">Book a Repair</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Button asChild variant="whatsapp" size="icon" aria-label="Chat with Ozon Mobiles on WhatsApp">
            <a href={waLink(waMessages.general, branch.id)} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
            </a>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/repair/book">
              <Wrench />
              Repair
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <Logo />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                  >
                    <X />
                  </Button>
                </div>
                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
                  {NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      activeOptions={{ exact: item.to === "/" }}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 font-display text-base font-semibold text-foreground transition-colors hover:bg-secondary data-[status=active]:text-electric"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 border-t border-border px-3 pt-4">
                    <p className="eyebrow mb-2 text-muted-foreground">Your Ozon Mobiles</p>
                    <BranchSwitcher />
                  </div>
                </nav>
                <div className="space-y-2 border-t border-border p-4">
                  <Button asChild variant="hero" size="lg" className="w-full">
                    <Link to="/repair/book" onClick={() => setOpen(false)}>
                      Book a Repair
                    </Link>
                  </Button>
                  <Button asChild variant="quiet" size="lg" className="w-full">
                    <Link to="/phones" onClick={() => setOpen(false)}>
                      Explore Phones
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="w-full">
                    <a href={`tel:${branch.tel}`}>
                      <Phone />
                      Call {branch.shortName}
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
