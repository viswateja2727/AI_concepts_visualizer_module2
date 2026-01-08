import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Scissors, Binary, BarChart3, Percent, Layers, GraduationCap, MessageSquare, Sparkle, MessageCircle, Maximize2, Ghost } from "lucide-react";
import ConceptCard from "@/components/concepts/ConceptCard";
import ConceptModal from "@/components/concepts/ConceptModal";
import TokenAnimationContent from "@/components/concepts/animations/TokenAnimationContent";
import EmbeddingAnimationContent from "@/components/concepts/animations/EmbeddingAnimationContent";
import LogitsAnimationContent from "@/components/concepts/animations/LogitsAnimationContent";
import SoftmaxAnimationContent from "@/components/concepts/animations/SoftmaxAnimationContent";
import TransformerAnimationContent from "@/components/concepts/animations/TransformerAnimationContent";
import TrainingAnimationContent from "@/components/concepts/animations/TrainingAnimationContent";
import LLMAnimationContent from "@/components/concepts/animations/LLMAnimationContent";
import PromptAnimationContent from "@/components/concepts/animations/PromptAnimationContent";
import PromptingAnimationContent from "@/components/concepts/animations/PromptingAnimationContent";
import ContextAnimationContent from "@/components/concepts/animations/ContextAnimationContent";
import ContextWindowAnimationContent from "@/components/concepts/animations/ContextWindowAnimationContent";
import HallucinationsAnimationContent from "@/components/concepts/animations/HallucinationsAnimationContent";

const concepts = [
  { id: 1, title: "Token", shortDescription: "Breaking text into pieces that AI can understand and process.", fullDescription: "A token is the smallest unit of text that AI models process. Words, punctuation, and even parts of words can be tokens. Understanding tokenization is key to understanding how AI reads text.", icon: Scissors, iconColor: "text-primary", iconBgColor: "bg-primary/20", buttonText: "See Tokenization", category: "Fundamentals", examples: ["'Hello' might be 1 token", "Punctuation like '!' is a token"], animationComponent: <TokenAnimationContent /> },
  { id: 2, title: "Embedding", shortDescription: "Turning words into numbers that capture meaning.", fullDescription: "Embeddings convert words into vectors (lists of numbers) where similar words are close together in mathematical space. This allows AI to understand relationships between words.", icon: Binary, iconColor: "text-accent", iconBgColor: "bg-accent/20", buttonText: "See Embedding", category: "Fundamentals", examples: ["King and Queen are close in vector space", "Cat and Dog share similar vectors"], animationComponent: <EmbeddingAnimationContent /> },
  { id: 3, title: "Logits", shortDescription: "Raw prediction scores before probabilities.", fullDescription: "Logits are the raw, unnormalized scores that a neural network outputs before they're converted to probabilities. Higher logits mean the model thinks that option is more likely.", icon: BarChart3, iconColor: "text-warning", iconBgColor: "bg-warning/20", buttonText: "See Logits", category: "Neural Networks", examples: ["Higher score = more likely word", "Can be positive or negative numbers"], animationComponent: <LogitsAnimationContent /> },
  { id: 4, title: "Softmax", shortDescription: "Converting scores into probabilities.", fullDescription: "Softmax is a function that converts logits into probabilities that sum to 100%. It makes the highest scores stand out more while keeping everything as valid probabilities.", icon: Percent, iconColor: "text-accent", iconBgColor: "bg-accent/20", buttonText: "See Softmax", category: "Neural Networks", examples: ["Logits [2.5, 1.8] become [65%, 35%]", "All probabilities sum to 100%"], animationComponent: <SoftmaxAnimationContent /> },
  { id: 5, title: "Transformer", shortDescription: "The architecture behind modern AI.", fullDescription: "Transformers use 'attention' to let each word look at all other words in a sentence. This helps AI understand context and relationships, making it the foundation of models like GPT.", icon: Layers, iconColor: "text-primary", iconBgColor: "bg-primary/20", buttonText: "See Transformer", category: "Neural Networks", examples: ["Powers ChatGPT and similar models", "Uses self-attention mechanism"], animationComponent: <TransformerAnimationContent /> },
  { id: 6, title: "Training", shortDescription: "Teaching AI with lots of examples.", fullDescription: "Training is how AI learns patterns from data. By showing millions of examples and adjusting its parameters to reduce errors, the model gradually improves at making predictions.", icon: GraduationCap, iconColor: "text-accent", iconBgColor: "bg-accent/20", buttonText: "See Training", category: "Neural Networks", examples: ["Learning from millions of texts", "Reducing errors over many epochs"], animationComponent: <TrainingAnimationContent /> },
  { id: 7, title: "LLM", shortDescription: "Large Language Models that predict text.", fullDescription: "LLMs are AI models trained on massive amounts of text. They work by predicting the next most likely token based on all previous tokens, generating text one piece at a time.", icon: Brain, iconColor: "text-primary", iconBgColor: "bg-primary/20", buttonText: "See LLM", category: "Large Language Models", examples: ["ChatGPT, Claude, Gemini", "Predicts one word at a time"], animationComponent: <LLMAnimationContent /> },
  { id: 8, title: "Prompt", shortDescription: "The instruction you give to AI.", fullDescription: "A prompt is your starting instruction to the AI. It typically includes a role (who the AI should be), context (background info), and a task (what you want done).", icon: MessageSquare, iconColor: "text-success", iconBgColor: "bg-success/20", buttonText: "See Prompt", category: "Using AI", examples: ["'You are a helpful assistant'", "'Summarize this article'"], animationComponent: <PromptAnimationContent /> },
  { id: 9, title: "Prompting", shortDescription: "The art of crafting effective instructions.", fullDescription: "Prompting is the skill of writing clear, specific instructions that get the best results from AI. Good prompts are specific, include examples, and set clear output formats.", icon: Sparkle, iconColor: "text-accent", iconBgColor: "bg-accent/20", buttonText: "Learn Prompting", category: "Using AI", examples: ["Be specific about what you want", "Provide examples in your prompt"], animationComponent: <PromptingAnimationContent /> },
  { id: 10, title: "Context", shortDescription: "AI's conversation memory.", fullDescription: "Context is all the previous messages and information the AI has access to during a conversation. It's how AI 'remembers' what you talked about earlier.", icon: MessageCircle, iconColor: "text-primary", iconBgColor: "bg-primary/20", buttonText: "See Context", category: "Using AI", examples: ["AI remembers your name from earlier", "Previous messages inform responses"], animationComponent: <ContextAnimationContent /> },
  { id: 11, title: "Context Window", shortDescription: "Maximum memory capacity of AI.", fullDescription: "The context window is the maximum amount of text an AI can 'see' at once. When exceeded, older content is forgotten. Modern models have windows of 4K to 128K+ tokens.", icon: Maximize2, iconColor: "text-warning", iconBgColor: "bg-warning/20", buttonText: "See Window", category: "Limitations", examples: ["GPT-4 has 128K token window", "Older messages get 'forgotten'"], animationComponent: <ContextWindowAnimationContent /> },
  { id: 12, title: "Hallucinations", shortDescription: "When AI generates false information.", fullDescription: "Hallucinations occur when AI confidently generates incorrect or made-up information. This happens because AI predicts based on patterns, not actual knowledge of facts.", icon: Ghost, iconColor: "text-destructive", iconBgColor: "bg-destructive/20", buttonText: "See Hallucinations", category: "Limitations", examples: ["Making up fake citations", "Inventing historical 'facts'"], animationComponent: <HallucinationsAnimationContent /> },
];

const categoryColors: Record<string, string> = {
  Fundamentals: "bg-primary/10 text-primary border-primary/30",
  "Neural Networks": "bg-accent/10 text-accent border-accent/30",
  "Large Language Models": "bg-success/10 text-success border-success/30",
  "Using AI": "bg-warning/10 text-warning border-warning/30",
  Limitations: "bg-destructive/10 text-destructive border-destructive/30",
};

const Index = () => {
  const [selectedConcept, setSelectedConcept] = useState<typeof concepts[0] | null>(null);

  const groupedConcepts = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) acc[concept.category] = [];
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, typeof concepts>);

  const categoryOrder = ["Fundamentals", "Neural Networks", "Large Language Models", "Using AI", "Limitations"];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Brain className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Learn AI Concepts
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the world of Artificial Intelligence through interactive animations!
          </motion.p>
        </div>
      </motion.header>

      {/* Concepts Grid */}
      <main className="max-w-6xl mx-auto px-4">
        {categoryOrder.map((category, categoryIndex) => (
          <motion.section key={category} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + categoryIndex * 0.1 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${categoryColors[category]}`}>{category}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{groupedConcepts[category]?.length} concepts</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedConcepts[category]?.map((concept, index) => (
                <motion.div key={concept.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                  <ConceptCard title={concept.title} shortDescription={concept.shortDescription} icon={concept.icon} iconColor={concept.iconColor} iconBgColor={concept.iconBgColor} buttonText={concept.buttonText} onSeeClick={() => setSelectedConcept(concept)} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </main>

      {/* Modal */}
      <ConceptModal isOpen={!!selectedConcept} onClose={() => setSelectedConcept(null)} title={selectedConcept?.title || ""} category={selectedConcept?.category || ""} icon={selectedConcept?.icon || Brain} iconColor={selectedConcept?.iconColor || ""} iconBgColor={selectedConcept?.iconBgColor || ""} fullDescription={selectedConcept?.fullDescription || ""} examples={selectedConcept?.examples || []} animationComponent={selectedConcept?.animationComponent} />

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center py-8 px-4">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Made with love to help you understand AI</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
