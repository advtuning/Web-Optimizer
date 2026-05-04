import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Currency = "USD" | "GBP";

interface CurrencyContextValue {
  currency: Currency;
  toggle: () => void;
  rate: number;
  rateStatus: "loading" | "live" | "fallback";
  format: (usdAmount: number, opts?: { decimals?: number; compact?: boolean }) => string;
  symbol: string;
}

const FALLBACK_RATE = 0.79;
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rate, setRate] = useState(FALLBACK_RATE);
  const [rateStatus, setRateStatus] = useState<"loading" | "live" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.frankfurter.app/latest?from=USD&to=GBP")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && typeof data?.rates?.GBP === "number") {
          setRate(data.rates.GBP);
          setRateStatus("live");
        } else {
          if (!cancelled) setRateStatus("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setRateStatus("fallback");
      });
    return () => { cancelled = true; };
  }, []);

  const toggle = useCallback(() => {
    setCurrency((c) => (c === "USD" ? "GBP" : "USD"));
  }, []);

  const symbol = currency === "USD" ? "$" : "£";

  const format = useCallback(
    (usdAmount: number, { decimals, compact = false }: { decimals?: number; compact?: boolean } = {}) => {
      const value = currency === "GBP" ? usdAmount * rate : usdAmount;
      const locale = currency === "GBP" ? "en-GB" : "en-US";

      if (compact) {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          notation: "compact",
          maximumFractionDigits: 2,
        }).format(value);
      }

      const autoDecimals = decimals ?? (value < 0.01 ? 5 : 2);

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: autoDecimals,
        maximumFractionDigits: autoDecimals,
      }).format(value);
    },
    [currency, rate]
  );

  return (
    <CurrencyContext.Provider value={{ currency, toggle, rate, rateStatus, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
