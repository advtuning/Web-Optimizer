import { Link } from "wouter";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const scrollToCalculator = () => {
    const el = document.getElementById("hero-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Calculator className="w-4 h-4 text-primary" />
          </div>
          AITokenCalculator
        </Link>
        <Button size="sm" onClick={scrollToCalculator} className="font-semibold shadow-sm">
          Calculate now
        </Button>
      </div>
    </header>
  );
}
