import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CurrencyToggle() {
  const { currency, toggle, rateStatus, rate } = useCurrency();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggle}
          aria-label={`Switch to ${currency === "USD" ? "GBP" : "USD"}`}
          className="relative flex items-center gap-0.5 h-8 rounded-full bg-muted border border-border/60 px-1 text-xs font-mono font-semibold select-none hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className={`relative z-10 px-2.5 py-1 rounded-full transition-colors duration-200 ${
              currency === "USD" ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            $ USD
          </span>
          <span
            className={`relative z-10 px-2.5 py-1 rounded-full transition-colors duration-200 ${
              currency === "GBP" ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            £ GBP
          </span>
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute top-1 bottom-1 rounded-full bg-primary"
            style={{
              left: currency === "USD" ? "4px" : "calc(50%)",
              right: currency === "GBP" ? "4px" : "calc(50%)",
            }}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {rateStatus === "loading" && "Fetching live rate…"}
        {rateStatus === "live" && (
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-emerald-500" />
            Live rate: 1 USD = {rate.toFixed(4)} GBP
          </span>
        )}
        {rateStatus === "fallback" && `Fallback rate: 1 USD = ${rate.toFixed(4)} GBP`}
      </TooltipContent>
    </Tooltip>
  );
}
