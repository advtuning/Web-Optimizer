import { Separator } from "@/components/ui/separator";

export function SeoContent() {
  return (
    <section className="py-16 md:py-24 bg-card border-t border-border/40">
      <div className="container max-w-4xl px-4 mx-auto prose dark:prose-invert prose-headings:font-bold prose-h2:tracking-tight prose-a:text-primary">
        <div className="text-center mb-12 not-prose">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Understanding AI Token Costs</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about pricing for LLMs and AI APIs.</p>
        </div>

        <article>
          <h3>What are AI tokens?</h3>
          <p>
            In the context of Large Language Models (LLMs) like OpenAI's GPT-4 or Anthropic's Claude, a <strong>token</strong> is a fundamental unit of data processed by the algorithm. You can think of tokens as pieces of words. Before an AI processes your text, it breaks it down into these chunks.
          </p>
          <p>
            As a general rule of thumb for English text, <strong>1 token is approximately 4 characters</strong>, or about 0.75 words. This means 100 tokens roughly equals 75 words. For example, the word "hamburger" might be broken into three tokens: "ham", "bur", and "ger", while a short, common word like "apple" might be a single token.
          </p>
          <p>
            When you use an AI API, you are billed based on the total number of tokens processed. This includes both the <em>input tokens</em> (the prompt you send to the model) and the <em>output tokens</em> (the response the model generates).
          </p>
        </article>

        <Separator className="my-10" />

        <article>
          <h3>How much do AI models cost?</h3>
          <p>
            AI API pricing is typically structured around a "cost per 1,000 tokens" (or sometimes per 1 million tokens). Prices vary significantly depending on the model's capabilities, speed, and the provider. Generally, output tokens are priced higher than input tokens because generating text requires more computational power than reading it.
          </p>
          <p>
            <strong>Flagship models</strong> (like GPT-4o or Claude 3.5 Sonnet) are designed for complex reasoning, coding, and nuanced tasks. They typically cost between $2.50 to $15.00 per 1 million input tokens.
          </p>
          <p>
            <strong>Budget models</strong> (like GPT-4o-mini or Claude 3 Haiku) are optimized for speed and high-volume tasks. These are dramatically cheaper, often costing as little as $0.15 to $0.25 per 1 million input tokens, making them ideal for tasks like classifying data, summarizing short text, or running simple chatbots.
          </p>
        </article>

        <Separator className="my-10" />

        <article>
          <h3>How to estimate token usage for your app</h3>
          <p>
            Estimating your AI API costs requires understanding your application's typical workflow. First, calculate the average size of a user prompt (including any system instructions or retrieved context you inject behind the scenes). Then, estimate the average length of the AI's response.
          </p>
          <p>
            For example, if you build a customer support chatbot, a typical interaction might involve 1,500 input tokens (the user's question plus your company's documentation) and generate a 500-token response. Using our AI token calculator, you can plug in these numbers alongside your expected monthly user volume to forecast your exact infrastructure spend.
          </p>
          <p>
            To optimize costs, consider using cheaper models for routing and classification, and reserve flagship models only for complex generation. Techniques like prompt caching (now supported by Anthropic and Google) can also significantly reduce the cost of repetitive input tokens.
          </p>
        </article>

      </div>
    </section>
  );
}
