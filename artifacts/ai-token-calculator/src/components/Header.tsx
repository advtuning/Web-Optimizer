import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { CurrencyToggle } from "@/components/CurrencyToggle";

export function Header() {
  const scrollToCalculator = () => {
    const el = document.getElementById("hero-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <Button size="sm" onClick={scrollToCalculator} className="font-semibold shadow-sm">
            Calculate now
          </Button>
        </div>
      </div>
    </header>
  );
}
