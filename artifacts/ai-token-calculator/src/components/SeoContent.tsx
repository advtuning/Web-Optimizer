import { Separator } from "@/components/ui/separator";

export function SeoContent() {
  return (
    <section className="py-16 md:py-24 bg-card border-t border-border/40">
      <div className="container max-w-4xl px-4 mx-auto prose dark:prose-invert prose-headings:font-bold prose-h2:tracking-tight prose-a:text-primary">
        <div className="text-center mb-12 not-prose">
          <h2 className="text-3xl font-bold tracking-tight mb-4">AI Token Cost Calculator</h2>
          <p className="text-muted-foreground text-lg">Estimate API spend for OpenAI, Claude, Gemini, and open-source models.</p>
        </div>

        <article>
          <h3>What does this calculator do?</h3>
          <p>
            The AI Token Calculator helps you estimate the cost of prompts and completions across major large language models. Enter token counts, pick a model, and forecast monthly API spend before you ship.
          </p>
          <p>
            It is useful for startups, SaaS products, internal tools, and AI features where you need a quick estimate of cost per request, per user, or per month.
          </p>
        </article>

        <Separator className="my-10" />

        <article>
          <h3>How do AI token prices work?</h3>
          <p>
            Providers usually charge separately for input tokens and output tokens. Faster or more capable models often cost more, while smaller models can be much cheaper for routing, classification, and simple chat.
          </p>
          <p>
            As a rough guide, 1,000 tokens is often around 750 words in English, though the exact count varies by language, formatting, and model tokenizer.
          </p>
        </article>

        <Separator className="my-10" />

        <article>
          <h3>How can I reduce AI API costs?</h3>
          <p>
            Reduce prompt size, use cheaper models for simple tasks, cache repeated context, and route only complex requests to premium models. Those changes can cut spend dramatically.
          </p>
          <p>
            If you are launching an AI product, this calculator can help you estimate pricing, margins, and usage limits before production.
          </p>
        </article>

      </div>
    </section>
  );
}
