import { useState } from "react";
import { Search, Info } from "lucide-react";
import modelsData from "@/data/models.json";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModelPicker() {
  const [search, setSearch] = useState("");
  const models = modelsData.models;

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.provider.toLowerCase().includes(search.toLowerCase()) ||
    m.use_cases.some(uc => uc.toLowerCase().includes(search.toLowerCase()))
  );

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'medium': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'slow': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'flagship': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'budget': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'reasoning': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 bg-muted/10 border-y border-border/40">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Model Pricing Directory</h2>
            <p className="text-muted-foreground">Compare API costs per 1K tokens across all major providers.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search models, providers, use cases..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px] font-semibold text-foreground">Model</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Input ($/1K)</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Output ($/1K)</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Context</TableHead>
                  <TableHead className="font-semibold text-foreground">Capabilities</TableHead>
                  <TableHead className="font-semibold text-foreground">Use Cases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No models found matching "{search}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModels.map((model) => (
                    <TableRow key={model.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-foreground transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{model.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <span className="text-xs text-muted-foreground">{model.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        ${model.input_cost_per_1k.toFixed(5).replace(/\.?0+$/, '')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        ${model.output_cost_per_1k.toFixed(5).replace(/\.?0+$/, '')}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {(model.context_window / 1000).toFixed(0)}k
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider px-1.5 py-0 rounded-sm ${getSpeedColor(model.speed)}`}>
                            {model.speed}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider px-1.5 py-0 rounded-sm ${getTierColor(model.tier)}`}>
                            {model.tier}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {model.use_cases.slice(0, 2).map(uc => (
                            <span key={uc} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                              {uc}
                            </span>
                          ))}
                          {model.use_cases.length > 2 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50 opacity-70">
                              +{model.use_cases.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
