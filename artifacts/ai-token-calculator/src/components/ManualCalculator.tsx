import { useState, useMemo } from "react";
import { Calculator, SlidersHorizontal } from "lucide-react";
import modelsData from "@/data/models.json";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getModelCostTier, modelAverageCost } from "@/lib/cost-tier";
import { useCurrency } from "@/contexts/CurrencyContext";

export function ManualCalculator() {
  const { format, currency, rateStatus } = useCurrency();
  const models = modelsData.models;
  const sortedModels = useMemo(
    () =>
      [...models].sort(
        (a, b) =>
          modelAverageCost(a.input_cost_per_1k, a.output_cost_per_1k) -
          modelAverageCost(b.input_cost_per_1k, b.output_cost_per_1k)
      ),
    [models]
  );
  const [modelId, setModelId] = useState(sortedModels[0].id);
  const [inTokens, setInTokens] = useState<string>("5000");
  const [outTokens, setOutTokens] = useState<string>("1500");
  const [volume, setVolume] = useState<string>("10000");
  
  const [calculated, setCalculated] = useState({
    costUsd: 0,
    monthlyUsd: 0
  });

  const handleCalculate = () => {
    const model = models.find(m => m.id === modelId) || models[0];
    const inT = parseFloat(inTokens) || 0;
    const outT = parseFloat(outTokens) || 0;
    const vol = parseFloat(volume) || 0;

    const costUsd = (inT / 1000 * model.input_cost_per_1k) + (outT / 1000 * model.output_cost_per_1k);
    
    setCalculated({
      costUsd,
      monthlyUsd: costUsd * vol
    });
  };

  // Run calculation initially
  useState(() => {
    handleCalculate();
  });

  return (
    <section className="py-16 md:py-24 bg-muted/5 border-t border-border/40">
      <div className="container max-w-4xl px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Advanced Cost Calculator</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Input exact token counts and traffic volumes to forecast your monthly API infrastructure spend.
          </p>
        </div>

        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="model-select" className="text-sm font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    AI Model
                  </Label>
                  <Select value={modelId} onValueChange={setModelId}>
                    <SelectTrigger id="model-select" className="bg-background h-12 shadow-sm">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[340px]">
                      {sortedModels.map(m => {
                        const tier = getModelCostTier(m.input_cost_per_1k, m.output_cost_per_1k);
                        return (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center justify-center h-5 min-w-6 px-1.5 rounded font-mono text-[10px] font-bold ${tier.bgClass} ${tier.textClass}`}
                                title={`${tier.label} pricing tier`}
                              >
                                {tier.symbol}
                              </span>
                              <span>{m.name}</span>
                              <span className="text-[10px] text-muted-foreground ml-1">{m.provider}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="in-tokens">Input Tokens</Label>
                    <Input 
                      id="in-tokens"
                      type="number" 
                      value={inTokens}
                      onChange={(e) => setInTokens(e.target.value)}
                      className="font-mono bg-background shadow-sm h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="out-tokens">Output Tokens</Label>
                    <Input 
                      id="out-tokens"
                      type="number" 
                      value={outTokens}
                      onChange={(e) => setOutTokens(e.target.value)}
                      className="font-mono bg-background shadow-sm h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">Requests per Month</Label>
                  <Input 
                    id="volume"
                    type="number" 
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="font-mono bg-background shadow-sm h-11"
                  />
                </div>

                <Button 
                  onClick={handleCalculate} 
                  className="w-full h-12 text-base font-semibold shadow-md active-elevate-2 transition-all hover:-translate-y-0.5"
                >
                  <Calculator className="mr-2 w-5 h-5" /> Calculate Projection
                </Button>
              </div>

              {/* Results */}
              <div className="flex flex-col justify-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Per Request Cost</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground font-mono text-lg">{currency === "GBP" ? "£" : "$"}</span>
                    <span className="text-4xl font-bold font-mono tracking-tight text-foreground">
                      {format(calculated.costUsd, { decimals: calculated.costUsd < 0.001 ? 5 : 4 }).replace(/^[$£]/, "")}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    {currency === "GBP" ? "≈ " + format(calculated.costUsd, { decimals: 4 }).replace("£", "$") + " USD" : ""}
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Monthly Projection</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-primary font-mono text-2xl">{currency === "GBP" ? "£" : "$"}</span>
                    <span className="text-5xl md:text-6xl font-black font-mono tracking-tighter text-primary">
                      {format(calculated.monthlyUsd, { decimals: 2 }).replace(/^[$£]/, "")}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    per month{rateStatus === "live" ? " · live rate" : rateStatus === "fallback" ? " · est. rate" : ""}
                  </div>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
