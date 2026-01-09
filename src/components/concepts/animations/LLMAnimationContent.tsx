import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, RotateCcw } from "lucide-react";

const LLMAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const appendedWordsRef = useRef<Set<number>>(new Set());

  const inputPrompt = "The capital of France is";
  const generatedWords = ["Paris", ".", " It", " is", " known", " for", " the", " Eiffel", " Tower", "."];

  const clearAll = () => {
    // Ensure any previously-started browser TTS is fully stopped
    window.speechSynthesis?.cancel();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runAnimation = () => {
    clearAll();
    setStep(0);
    setDisplayedText("");
    appendedWordsRef.current = new Set();

    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => {
      setStep(2);
      let currentStep = 2;
      intervalRef.current = setInterval(() => {
        currentStep++;
        if (currentStep >= generatedWords.length + 4) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        setStep(currentStep);
      }, 600);
    }, 1800);

    timeoutsRef.current = [t1, t2];
  };

  useEffect(() => {
    runAnimation();
    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step < 3) return;
    const wordIndex = step - 3;
    if (wordIndex < generatedWords.length && !appendedWordsRef.current.has(wordIndex)) {
      appendedWordsRef.current.add(wordIndex);
      setDisplayedText((prev) => prev + generatedWords[wordIndex]);
    }
  }, [step]);

  const handleReset = () => runAnimation();
  const isComplete = step >= generatedWords.length + 4;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [step]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Flow visualization */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={step >= 1 ? { opacity: 1, x: 0 } : {}} className="bg-muted rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Input</p>
          <p className="font-mono text-sm">{inputPrompt}</p>
        </motion.div>

        {step >= 1 && (
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="text-primary text-2xl">
            →
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={step >= 2 ? { opacity: 1, scale: 1 } : {}}
          className={`relative bg-primary/10 border-2 border-primary rounded-2xl p-4 ${step >= 2 && step < generatedWords.length + 3 ? "animate-pulse" : ""}`}
        >
          <Brain className="w-10 h-10 text-primary mx-auto mb-1" />
          <p className="text-sm font-bold text-center">LLM</p>
          {step >= 3 && step < generatedWords.length + 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-ping" />}
        </motion.div>

        {step >= 2 && (
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="text-primary text-2xl">
            →
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, x: 20 }} animate={step >= 2 ? { opacity: 1, x: 0 } : {}} className="bg-success/10 border-2 border-success/30 rounded-xl px-4 py-3 text-center min-w-[120px]">
          <p className="text-xs text-muted-foreground mb-1">Output</p>
          <p className="font-mono text-sm text-success font-bold">{displayedText || "..."}</p>
        </motion.div>
      </div>

      {/* Token by token */}
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Predicting one token at a time:</p>
          <div className="bg-card rounded-xl p-4 font-mono text-base shadow-inner">
            <span className="text-muted-foreground">{inputPrompt}</span>
            <span className="text-success font-bold">{displayedText}</span>
            {step < generatedWords.length + 3 && <span className="animate-pulse text-primary">▊</span>}
          </div>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">🤖 LLMs predict <strong>one token at a time</strong> based on all previous tokens!</p>
        </motion.div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default LLMAnimationContent;
