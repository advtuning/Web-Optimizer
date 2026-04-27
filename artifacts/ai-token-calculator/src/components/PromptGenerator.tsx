import { useState } from "react";
import { Copy, Wand2, Check } from "lucide-react";
import templatesData from "@/data/promptTemplates.json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function PromptGenerator() {
  const templates = templatesData.templates;
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [promptText, setPromptText] = useState(templates[0].template);
  const [copied, setCopied] = useState(false);

  const handleTemplateSelect = (template: any) => {
    setActiveTemplate(template);
    setPromptText(template.template);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 container max-w-6xl px-4 mx-auto">
      <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
        
        <div className="lg:col-span-4 space-y-6">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/20 text-primary bg-primary/5">
              <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Bonus Tool
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">System Prompts</h2>
            <p className="text-muted-foreground">
              A collection of production-tested system prompts and templates to get the most out of your token budget.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(t)}
                className={`text-left px-4 py-3 rounded-lg border transition-all ${
                  activeTemplate.id === t.id 
                    ? "bg-primary/5 border-primary/30 text-foreground font-medium shadow-sm" 
                    : "bg-background border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-border"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-border/60 shadow-md bg-card/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CodeBracketIcon className="w-4 h-4 text-muted-foreground" />
                  {activeTemplate.name}
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleCopy}
                  className="h-8 shadow-sm transition-all"
                >
                  {copied ? (
                    <><Check className="w-4 h-4 mr-1.5 text-green-500" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-1.5" /> Copy Prompt</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm p-6 leading-relaxed bg-transparent"
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>
        
      </div>
    </section>
  );
}

function CodeBracketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
