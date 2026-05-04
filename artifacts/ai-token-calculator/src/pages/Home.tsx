import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroCalculator } from "@/components/HeroCalculator";
import { ModelPicker } from "@/components/ModelPicker";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { ManualCalculator } from "@/components/ManualCalculator";
import { PromptGenerator } from "@/components/PromptGenerator";
import { SeoContent } from "@/components/SeoContent";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Header />
      <main className="flex-1 flex flex-col">
        <HeroCalculator />
        <div className="py-6 px-4">
          <AdSlot className="max-w-[728px] h-[90px]" />
        </div>
        <ModelPicker />
        <ProjectLibrary />
        <div className="py-6 px-4 flex justify-center">
          <AdSlot className="w-[300px] max-w-[300px] h-[250px]" />
        </div>
        <ManualCalculator />
        <PromptGenerator />
        <SeoContent />
      </main>
      <Footer />
    </div>
  );
}
