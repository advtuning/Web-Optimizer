export type CostTier = "cheap" | "moderate" | "expensive";

export interface CostTierMeta {
  tier: CostTier;
  label: string;
  symbol: string;
  textClass: string;
  bgClass: string;
  ringClass: string;
}

export function getModelCostTier(inputCostPer1k: number, outputCostPer1k: number): CostTierMeta {
  const avg = (inputCostPer1k + outputCostPer1k) / 2;
  if (avg < 0.002) {
    return {
      tier: "cheap",
      label: "Cheap",
      symbol: "$",
      textClass: "text-emerald-500 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10",
      ringClass: "ring-emerald-500/30",
    };
  }
  if (avg < 0.012) {
    return {
      tier: "moderate",
      label: "Moderate",
      symbol: "$$",
      textClass: "text-amber-500 dark:text-amber-400",
      bgClass: "bg-amber-500/10",
      ringClass: "ring-amber-500/30",
    };
  }
  return {
    tier: "expensive",
    label: "Premium",
    symbol: "$$$",
    textClass: "text-rose-500 dark:text-rose-400",
    bgClass: "bg-rose-500/10",
    ringClass: "ring-rose-500/30",
  };
}

export function modelAverageCost(inputCostPer1k: number, outputCostPer1k: number): number {
  return (inputCostPer1k + outputCostPer1k) / 2;
}
