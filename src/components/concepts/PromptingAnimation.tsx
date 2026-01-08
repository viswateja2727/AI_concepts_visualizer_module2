import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play, Check, X, Pause } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const PromptingAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const techniques = [
    {
      name: "Be Specific",
      bad: "Write about dogs",
      good: "Write a 100-word paragraph about golden retrievers as family pets",
      icon: "🎯",
    },
    {
      name: "Give Examples",
      bad: "Translate words",
      good: "Translate: Hello→Hola, Goodbye→Adiós, Thank you→",
      icon: "📋",
    },
    {
      name: "Set Format",
      bad: "List countries",
      good: "List 5 European countries as a numbered list with capitals",
      icon: "📝",
    },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 0) => {
    const delays = [1500, 1500, 1500, 1200, 1000];
    let cumulativeDelay = 0;
    
    for (let i = startStep; i < 6; i++) {
      const targetStep = i;
      const stepDelay = i === startStep ? 0 : delays[Math.min(i - 1, delays.length - 1)];
      cumulativeDelay += stepDelay;
      
      const timeout = setTimeout(() => {
        setStep(targetStep);
      }, cumulativeDelay);
      
      timeoutsRef.current.push(timeout);
    }
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    setStep(0);
    setIsPaused(false);
    clearAllTimeouts();
    
    // Start animation with step 1 after initial delay
    const timeout = setTimeout(() => {
      setStep(1);
      runAnimation(2);
    }, 1200);
    timeoutsRef.current.push(timeout);
  };

  const handlePause = () => {
    if (!isPaused) {
      // Pause: clear all pending timeouts
      clearAllTimeouts();
      setIsPaused(true);
    } else {
      // Resume: restart from current step
      setIsPaused(false);
      runAnimation(step + 1);
    }
  };

  const handleReset = () => {
    clearAllTimeouts();
    setIsStarted(false);
    setStep(0);
    setIsPaused(false);
  };

  return (
    <motion.div className="concept-card relative overflow-hidden" layout>
      <FloatingDecorations variant="stars" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Prompting</h3>
            <p className="text-muted-foreground text-sm">Art of crafting AI instructions</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Learn Prompting
            </motion.button>
          ) : step < 5 ? (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handlePause}
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-accent" />
              ) : (
                <Pause className="w-5 h-5 text-accent" />
              )}
            </motion.button>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {isStarted && (
            <motion.div
              key="animation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="animation-container flex-col gap-4 bg-gradient-to-br from-accent/5 via-transparent to-warning/5 rounded-2xl">
                <p className="text-sm text-muted-foreground text-center">Key prompting techniques:</p>

                {techniques.map((technique, index) => (
                  <motion.div
                    key={technique.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={step >= index + 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="bg-muted/30 rounded-xl p-4 space-y-3 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{technique.icon}</span>
                      <span className="font-bold text-sm">{technique.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <X className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive font-bold">Vague</span>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">{technique.bad}</p>
                      </div>

                      <div className="bg-success/10 border-2 border-success/30 rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Check className="w-3 h-3 text-success" />
                          <span className="text-xs text-success font-bold">Better</span>
                        </div>
                        <p className="font-mono text-xs">{technique.good}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Summary */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg w-full"
                  >
                    <p className="text-base text-foreground">
                      ✨ Good prompting = <strong>specific, formatted, with examples</strong>. 
                      Better prompts lead to better AI responses!
                    </p>
                  </motion.div>
                )}

                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center w-full"
                  >
                    <button onClick={handleReset} className="text-base text-primary hover:underline font-semibold">
                      ↻ Try again
                    </button>
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

export default PromptingAnimation;
