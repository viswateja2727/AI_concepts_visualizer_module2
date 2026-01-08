import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const LLMAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const inputPrompt = "The capital of France is";
  const generatedWords = ["Paris", ".", " It", " is", " known", " for", " the", " Eiffel", " Tower", "."];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isStarted || step < 3) return;
    const wordIndex = step - 3;
    if (wordIndex < generatedWords.length) {
      setDisplayedText((prev) => prev + generatedWords[wordIndex]);
    }
  }, [step, isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    setStep(0);
    setDisplayedText("");
    
    setTimeout(() => {
      setStep(1);
      setTimeout(() => {
        setStep(2);
        let currentStep = 2;
        intervalRef.current = setInterval(() => {
          currentStep++;
          setStep(currentStep);
          if (currentStep >= generatedWords.length + 4) {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }, 600);
      }, 1000);
    }, 800);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsStarted(false);
    setStep(0);
    setDisplayedText("");
  };

  return (
    <motion.div className="concept-card relative overflow-hidden" layout>
      <FloatingDecorations variant="bubbles" count={4} />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">LLM</h3>
            <p className="text-muted-foreground text-sm">Pattern prediction machine</p>
          </div>
          
          {!isStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Start Predicting
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isStarted && (
            <motion.div
              key="animation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="animation-container flex-col gap-4 bg-gradient-to-br from-primary/5 via-transparent to-success/5 rounded-2xl">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={step >= 1 ? { opacity: 1, x: 0 } : {}} className="bg-muted rounded-xl px-4 py-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Input</p>
                    <p className="font-mono text-sm">{inputPrompt}</p>
                  </motion.div>
                  {step >= 1 && <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="text-primary text-2xl">→</motion.div>}
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={step >= 2 ? { opacity: 1, scale: 1 } : {}} className={`relative bg-primary/10 border-2 border-primary rounded-2xl p-4 ${step >= 2 && step < generatedWords.length + 3 ? "animate-pulse" : ""}`}>
                    <Brain className="w-10 h-10 text-primary mx-auto mb-1" />
                    <p className="text-sm font-bold text-center">LLM</p>
                    {step >= 3 && step < generatedWords.length + 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-ping" />}
                  </motion.div>
                  {step >= 2 && <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="text-primary text-2xl">→</motion.div>}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={step >= 2 ? { opacity: 1, x: 0 } : {}} className="bg-success/10 border-2 border-success/30 rounded-xl px-4 py-3 text-center min-w-[120px]">
                    <p className="text-xs text-muted-foreground mb-1">Output</p>
                    <p className="font-mono text-sm text-success font-bold">{displayedText || "..."}</p>
                  </motion.div>
                </div>

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

                {step >= generatedWords.length + 4 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
                      <p className="text-base text-foreground">🤖 LLMs predict <strong>one token at a time</strong> based on all previous tokens!</p>
                    </div>
                    <div className="text-center">
                      <button onClick={handleReset} className="text-base text-primary hover:underline font-semibold">↻ Try again</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LLMAnimation;
