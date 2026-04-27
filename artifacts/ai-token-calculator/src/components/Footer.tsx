import { Link } from "wouter";
import { Calculator } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/10">
      <div className="container mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Calculator className="w-4 h-4 text-primary" />
            </div>
            AITokenCalculator
          </Link>
          <p className="text-muted-foreground text-sm text-center md:text-left max-w-xs">
            The free, instant AI token calculator and API cost estimator for developers and indie hackers.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2 text-sm">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} AITokenCalculator. All rights reserved.
          </p>
          <p className="text-muted-foreground/70 text-xs text-center md:text-right max-w-xs mt-2">
            Disclaimer: All prices stored locally and may change. Verify with each provider (OpenAI, Anthropic, Google, etc.) before making financial decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
