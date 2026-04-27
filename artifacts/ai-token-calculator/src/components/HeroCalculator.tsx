import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Check, Zap, Cpu, CircleDollarSign } from "lucide-react";
import modelsData from "@/data/models.json";
import projectsData from "@/data/projects.json";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// GBP conversion rate
const GBP_RATE = 0.79;

export function HeroCalculator() {
  const models = modelsData.models;
  const projects = projectsData.projects;

  const [selectedModelId, setSelectedModelId] = useState(models[0].id);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);

  const model = models.find(m => m.id === selectedModelId) || models[0];
  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  const calculateCost = (inputTokens: number, outputTokens: number, inputCost: number, outputCost: number) => {
    return (inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost);
  };

  const costUsd = calculateCost(
    project.estimated_input_tokens,
    project.estimated_output_tokens,
    model.input_cost_per_1k,
    model.output_cost_per_1k
  );

  const costGbp = costUsd * GBP_RATE;

  // Monthly cost (assuming the volume in the project)
  const monthlyCostUsd = costUsd * project.monthly_volume;

  // Cost tier indicator
  const getCostTier = (cost: number) => {
    if (cost < 0.01) return { label: "Cheap", color: "bg-green-500/15 text-green-700 dark:text-green-400" };
    if (cost < 0.05) return { label: "Moderate", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" };
    return { label: "Expensive", color: "bg-red-500/15 text-red-700 dark:text-red-400" };
  };

  const costTier = getCostTier(costUsd);

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-background h-12 text-left font-normal border-border/50 shadow-sm hover-elevate">
                      <div className="flex flex-col items-start truncate">
                        <span className="truncate">{model.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{model.provider}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-[300px] overflow-y-auto">
                    {Array.from(new Set(models.map(m => m.provider))).map(provider => (
                      <div key={provider}>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">{provider}</DropdownMenuLabel>
                        {models.filter(m => m.provider === provider).map(m => (
                          <DropdownMenuItem 
                            key={m.id} 
                            onClick={() => setSelectedModelId(m.id)}
                            className="flex justify-between cursor-pointer"
                          >
                            <span>{m.name}</span>
                            {selectedModelId === m.id && <Check className="w-4 h-4" />}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-primary" />
                  Select Example Project
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-background h-12 text-left font-normal border-border/50 shadow-sm hover-elevate">
                      <div className="flex flex-col items-start truncate">
                        <span className="truncate">{project.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate">~{project.estimated_input_tokens + project.estimated_output_tokens} tokens/req</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-[300px] overflow-y-auto">
                    {projects.slice(0, 15).map(p => (
                      <DropdownMenuItem 
                        key={p.id} 
                        onClick={() => setSelectedProjectId(p.id)}
                        className="flex flex-col items-start py-2 cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{p.name}</span>
                          {selectedProjectId === p.id && <Check className="w-4 h-4 ml-2 flex-shrink-0" />}
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-1">{p.description}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-auto pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
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
            </div>

            {/* Display Side */}
            <div className="p-6 md:p-10 md:col-span-3 flex flex-col justify-center bg-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold tracking-tight text-muted-foreground">Estimated Cost</h3>
                <Badge className={costTier.color} variant="secondary">
                  {costTier.label}
                </Badge>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Cost per Request</div>
                  <div className="flex items-baseline gap-3">
                    <motion.div 
                      key={costUsd}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground font-mono"
                    >
                      ${costUsd < 0.0001 ? costUsd.toFixed(5) : costUsd.toFixed(4)}
                    </motion.div>
                    <div className="text-xl md:text-2xl text-muted-foreground font-mono">
                      / £{(costGbp < 0.0001 ? costGbp.toFixed(5) : costGbp.toFixed(4))}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Monthly Estimate</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold font-mono">${monthlyCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="text-sm text-muted-foreground">/mo</div>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Assumed Volume</div>
                    <div className="font-mono text-sm font-semibold bg-background border border-border/50 rounded-md px-3 py-1.5 inline-block shadow-sm">
                      {project.monthly_volume.toLocaleString()} reqs
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
