import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, Zap, Cpu, CircleDollarSign, Sliders, Search } from "lucide-react";
import modelsData from "@/data/models.json";
import projectsData from "@/data/projects.json";
import { getModelCostTier, modelAverageCost } from "@/lib/cost-tier";
import { useCurrency } from "@/contexts/CurrencyContext";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export function HeroCalculator() {
  const models = modelsData.models;
  const projects = projectsData.projects;

  const sortedModels = useMemo(() => {
    return [...models].sort(
      (a, b) =>
        modelAverageCost(a.input_cost_per_1k, a.output_cost_per_1k) -
        modelAverageCost(b.input_cost_per_1k, b.output_cost_per_1k)
    );
  }, [models]);

  const [selectedModelId, setSelectedModelId] = useState(sortedModels[0].id);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [mode, setMode] = useState<"project" | "custom">("project");
  const [customInputTokens, setCustomInputTokens] = useState<number>(1000);
  const [customOutputTokens, setCustomOutputTokens] = useState<number>(500);
  const [customMonthlyVolume, setCustomMonthlyVolume] = useState<number>(1000);

  const model = models.find(m => m.id === selectedModelId) || models[0];
  const project = projects.find(p => p.id === selectedProjectId) || projects[0];
  const modelTier = getModelCostTier(model.input_cost_per_1k, model.output_cost_per_1k);

  const inputTokens = mode === "project" ? project.estimated_input_tokens : customInputTokens;
  const outputTokens = mode === "project" ? project.estimated_output_tokens : customOutputTokens;
  const monthlyVolume = mode === "project" ? project.monthly_volume : customMonthlyVolume;

  const calculateCost = (inputTokens: number, outputTokens: number, inputCost: number, outputCost: number) => {
    return (inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost);
  };

  const costUsd = calculateCost(
    inputTokens,
    outputTokens,
    model.input_cost_per_1k,
    model.output_cost_per_1k
  );

  const { format, currency, rateStatus, rate } = useCurrency();

  // Monthly cost projection
  const monthlyCostUsd = costUsd * monthlyVolume;

  return (
    <section id="hero-calculator" className="w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-chart-4/20 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="container max-w-5xl px-4 mx-auto relative z-10">
        <div className="text-center mb-10 space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-background/50 backdrop-blur font-medium border-primary/20 text-primary">
            <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" /> Free AI API Cost Estimator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance text-foreground">
            Calculate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-4">AI Token Costs</span> <br className="hidden sm:block" /> in Seconds.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Estimate pricing for OpenAI, Claude, Gemini, and more. Select a project and model to see instant API costs.
          </p>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-2xl shadow-primary/5 border-primary/10 overflow-hidden bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {/* Configuration Side */}
            <div className="p-6 md:p-8 md:col-span-2 flex flex-col gap-6 bg-muted/10">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Select Model
                </label>
                <Popover open={modelPickerOpen} onOpenChange={setModelPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={modelPickerOpen}
                      className="w-full justify-between bg-background h-12 text-left font-normal border-border/50 shadow-sm hover-elevate"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded font-mono text-[11px] font-bold ${modelTier.bgClass} ${modelTier.textClass}`}
                          aria-label={`${modelTier.label} cost tier`}
                          title={`${modelTier.label} pricing tier`}
                        >
                          {modelTier.symbol}
                        </span>
                        <div className="flex flex-col items-start truncate">
                          <span className="truncate">{model.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{model.provider}</span>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput
                          placeholder={`Search ${sortedModels.length} models...`}
                          className="border-0 focus:ring-0 h-11"
                        />
                      </div>
                      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between border-b bg-muted/30">
                        <span>Sorted: cheap to premium</span>
                        <span className="font-mono normal-case tracking-normal text-muted-foreground/70">avg $/1K</span>
                      </div>
                      <CommandList className="max-h-[320px]">
                        <CommandEmpty>No matching model found.</CommandEmpty>
                        <CommandGroup>
                          {sortedModels.map(m => {
                            const tier = getModelCostTier(m.input_cost_per_1k, m.output_cost_per_1k);
                            const avg = modelAverageCost(m.input_cost_per_1k, m.output_cost_per_1k);
                            return (
                              <CommandItem
                                key={m.id}
                                value={`${m.name} ${m.provider} ${tier.label}`}
                                onSelect={() => {
                                  setSelectedModelId(m.id);
                                  setModelPickerOpen(false);
                                }}
                                className="flex items-center gap-2 cursor-pointer py-2"
                              >
                                <span
                                  className={`inline-flex items-center justify-center h-5 min-w-6 px-1.5 rounded font-mono text-[10px] font-bold ${tier.bgClass} ${tier.textClass} flex-shrink-0`}
                                >
                                  {tier.symbol}
                                </span>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="truncate text-sm">{m.name}</span>
                                  <span className="text-[10px] text-muted-foreground truncate">{m.provider}</span>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground tabular-nums flex-shrink-0">
                                  ${avg < 0.001 ? avg.toFixed(5) : avg.toFixed(4)}
                                </span>
                                {selectedModelId === m.id && <Check className="w-4 h-4 ml-1 flex-shrink-0 text-primary" />}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <Tabs value={mode} onValueChange={(v) => setMode(v as "project" | "custom")} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="project" className="text-xs">
                    <CircleDollarSign className="w-3.5 h-3.5 mr-1.5" />
                    Example Project
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs">
                    <Sliders className="w-3.5 h-3.5 mr-1.5" />
                    Custom Tokens
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="project" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <CircleDollarSign className="w-4 h-4 text-primary" />
                      Select Example Project
                      <span className="ml-auto text-[10px] font-normal text-muted-foreground tabular-nums">
                        {projects.length} ideas
                      </span>
                    </label>
                    <Popover open={projectPickerOpen} onOpenChange={setProjectPickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={projectPickerOpen}
                          className="w-full justify-between bg-background h-12 text-left font-normal border-border/50 shadow-sm hover-elevate"
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                              {project.category}
                            </span>
                            <div className="flex flex-col items-start truncate min-w-0">
                              <span className="truncate">{project.name}</span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                ~{(project.estimated_input_tokens + project.estimated_output_tokens).toLocaleString()} tokens/req
                              </span>
                            </div>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput
                              placeholder="Search 100+ project ideas..."
                              className="border-0 focus:ring-0 h-11"
                            />
                          </div>
                          <CommandList className="max-h-[320px]">
                            <CommandEmpty>No matching project found.</CommandEmpty>
                            <CommandGroup>
                              {projects.map(p => (
                                <CommandItem
                                  key={p.id}
                                  value={`${p.name} ${p.category} ${p.description}`}
                                  onSelect={() => {
                                    setSelectedProjectId(p.id);
                                    setProjectPickerOpen(false);
                                  }}
                                  className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-[9px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                                        {p.category}
                                      </span>
                                      <span className="font-medium text-sm truncate">{p.name}</span>
                                    </div>
                                    {selectedProjectId === p.id && (
                                      <Check className="w-4 h-4 ml-2 flex-shrink-0 text-primary" />
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {p.description}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-1">Input Tokens</div>
                      <div className="font-mono text-sm font-semibold bg-background border border-border/50 rounded-md px-3 py-1.5 inline-block w-full">
                        {project.estimated_input_tokens.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-1">Output Tokens</div>
                      <div className="font-mono text-sm font-semibold bg-background border border-border/50 rounded-md px-3 py-1.5 inline-block w-full">
                        {project.estimated_output_tokens.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Input Tokens</label>
                      <Input
                        type="number"
                        min={0}
                        value={customInputTokens}
                        onChange={(e) => setCustomInputTokens(Math.max(0, Number(e.target.value) || 0))}
                        className="font-mono bg-background h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Output Tokens</label>
                      <Input
                        type="number"
                        min={0}
                        value={customOutputTokens}
                        onChange={(e) => setCustomOutputTokens(Math.max(0, Number(e.target.value) || 0))}
                        className="font-mono bg-background h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Monthly Requests</label>
                    <Input
                      type="number"
                      min={0}
                      value={customMonthlyVolume}
                      onChange={(e) => setCustomMonthlyVolume(Math.max(0, Number(e.target.value) || 0))}
                      className="font-mono bg-background h-11"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: "1K", value: 1000 },
                      { label: "5K", value: 5000 },
                      { label: "10K", value: 10000 },
                      { label: "50K", value: 50000 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setCustomInputTokens(preset.value);
                          setCustomOutputTokens(Math.round(preset.value / 2));
                        }}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-background border border-border/50 hover-elevate"
                      >
                        {preset.label} in
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Display Side */}
            <div className="p-6 md:p-10 md:col-span-3 flex flex-col justify-center bg-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold tracking-tight text-muted-foreground">Estimated Cost</h3>
                <Badge
                  variant="secondary"
                  className={`${modelTier.bgClass} ${modelTier.textClass} ring-1 ${modelTier.ringClass} font-mono uppercase tracking-wider text-[10px]`}
                >
                  <span className="font-bold mr-1">{modelTier.symbol}</span>
                  {modelTier.label} model
                </Badge>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Cost per Request</div>
                  <motion.div
                    key={`${costUsd}-${currency}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground font-mono"
                  >
                    {format(costUsd, { decimals: costUsd < 0.0001 ? 5 : 4 })}
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-1 font-mono">
                    {currency === "USD"
                      ? `≈ £${(costUsd * rate).toFixed(costUsd < 0.0001 ? 5 : 4)} GBP (${rateStatus === "live" ? "live rate" : "est."})`
                      : `≈ $${costUsd.toFixed(costUsd < 0.0001 ? 5 : 4)} USD`}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Monthly Estimate</div>
                    <div className="flex items-baseline gap-2">
                      <motion.div
                        key={`${monthlyCostUsd}-${currency}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold font-mono"
                      >
                        {format(monthlyCostUsd, { decimals: 2 })}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">/mo</div>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Assumed Volume</div>
                    <div className="font-mono text-sm font-semibold bg-background border border-border/50 rounded-md px-3 py-1.5 inline-block shadow-sm">
                      {monthlyVolume.toLocaleString()} reqs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
