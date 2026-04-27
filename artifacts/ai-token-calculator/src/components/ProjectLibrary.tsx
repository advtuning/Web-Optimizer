import { useState } from "react";
import { ArrowUpRight, Code, BookOpen, Briefcase, Bot, Megaphone, Stethoscope, BarChart } from "lucide-react";
import projectsData from "@/data/projects.json";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ProjectLibrary() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...projectsData.categories];
  const projects = projectsData.projects;

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'low': return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] font-semibold">LOW</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] font-semibold">MED</Badge>;
      case 'high': return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-semibold">HIGH</Badge>;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Developer Tools': return <Code className="w-4 h-4" />;
      case 'Content': return <BookOpen className="w-4 h-4" />;
      case 'SaaS': return <Briefcase className="w-4 h-4" />;
      case 'Chatbot': return <Bot className="w-4 h-4" />;
      case 'Marketing': return <Megaphone className="w-4 h-4" />;
      case 'Data': return <BarChart className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const scrollToHero = () => {
    const el = document.getElementById("hero-calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 container max-w-6xl px-4 mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Project Token Library</h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Not sure how many tokens your app will use? Browse 50+ real-world examples to get a baseline for your own projects.
        </p>
      </div>

      <div className="mb-8 relative">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full transition-all ${
                  activeCategory === category 
                    ? "shadow-md" 
                    : "bg-background hover:bg-muted"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.slice(0, 12).map((project) => (
          <Card key={project.id} className="flex flex-col bg-card hover:border-primary/40 transition-colors shadow-sm hover:shadow-md group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md w-fit">
                  {getCategoryIcon(project.category)}
                  {project.category}
                </div>
                {getComplexityBadge(project.complexity)}
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pb-4">
              <div className="flex items-center justify-between text-sm bg-muted/30 p-3 rounded-lg border border-border/40">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs font-medium">Avg. Request</span>
                  <span className="font-mono font-semibold">{(project.estimated_input_tokens + project.estimated_output_tokens).toLocaleString()} <span className="text-[10px] text-muted-foreground font-sans">tkns</span></span>
                </div>
                <div className="h-8 w-px bg-border/60"></div>
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground text-xs font-medium">Volume</span>
                  <span className="font-mono font-semibold">{project.monthly_volume.toLocaleString()} <span className="text-[10px] text-muted-foreground font-sans">/mo</span></span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5 group-hover:bg-primary/10 transition-colors" onClick={scrollToHero}>
                Calculate Cost <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredProjects.length > 12 && (
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="rounded-full shadow-sm">
            Load More Projects
          </Button>
        </div>
      )}
    </section>
  );
}
