import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import TokenAnimation from "@/components/concepts/TokenAnimation";
import EmbeddingAnimation from "@/components/concepts/EmbeddingAnimation";
import LogitsAnimation from "@/components/concepts/LogitsAnimation";
import SoftmaxAnimation from "@/components/concepts/SoftmaxAnimation";
import TransformerAnimation from "@/components/concepts/TransformerAnimation";
import TrainingAnimation from "@/components/concepts/TrainingAnimation";
import LLMAnimation from "@/components/concepts/LLMAnimation";
import PromptAnimation from "@/components/concepts/PromptAnimation";
import PromptingAnimation from "@/components/concepts/PromptingAnimation";
import ContextAnimation from "@/components/concepts/ContextAnimation";
import ContextWindowAnimation from "@/components/concepts/ContextWindowAnimation";
import HallucinationsAnimation from "@/components/concepts/HallucinationsAnimation";

const concepts = [
  { id: 1, component: TokenAnimation, category: "Fundamentals" },
  { id: 2, component: EmbeddingAnimation, category: "Fundamentals" },
  { id: 3, component: LogitsAnimation, category: "Neural Networks" },
  { id: 4, component: SoftmaxAnimation, category: "Neural Networks" },
  { id: 5, component: TransformerAnimation, category: "Neural Networks" },
  { id: 6, component: TrainingAnimation, category: "Neural Networks" },
  { id: 7, component: LLMAnimation, category: "Large Language Models" },
  { id: 8, component: PromptAnimation, category: "Using AI" },
  { id: 9, component: PromptingAnimation, category: "Using AI" },
  { id: 10, component: ContextAnimation, category: "Using AI" },
  { id: 11, component: ContextWindowAnimation, category: "Limitations" },
  { id: 12, component: HallucinationsAnimation, category: "Limitations" },
];

const categoryColors: Record<string, string> = {
  "Fundamentals": "bg-primary/10 text-primary border-primary/30",
  "Neural Networks": "bg-accent/10 text-accent border-accent/30",
  "Large Language Models": "bg-success/10 text-success border-success/30",
  "Using AI": "bg-warning/10 text-warning border-warning/30",
  "Limitations": "bg-destructive/10 text-destructive border-destructive/30",
};

const Index = () => {
  const groupedConcepts = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = [];
    }
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, typeof concepts>);

  const categoryOrder = ["Fundamentals", "Neural Networks", "Large Language Models", "Using AI", "Limitations"];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden py-16 px-4"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
          >
            <Brain className="w-10 h-10 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
          >
            Learn AI Concepts
            <span className="block text-primary">Visually</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Interactive animations that teach you how AI and Large Language Models work. 
            Click "Start" on each concept to see it come alive!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categoryOrder.map((category, index) => (
              <motion.span
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[category]}`}
              >
                {category}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* Concepts Grid */}
      <main className="max-w-6xl mx-auto px-4">
        {categoryOrder.map((category, categoryIndex) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${categoryColors[category]}`}>
                {category}
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">
                {groupedConcepts[category]?.length} concepts
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {groupedConcepts[category]?.map((concept, index) => {
                const Component = concept.component;
                return (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Component />
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-8 px-4"
      >
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Made with love to help you understand AI</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;