import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Play, Pause } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const PromptAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const pausedAtRef = useRef<number | null>(null);
  const remainingTimesRef = useRef<{ delay: number; action: () => void }[]>([]);

  const promptParts = [
    { type: "role", text: "You are a helpful assistant", color: "bg-primary" },
    { type: "context", text: "that knows about cooking", color: "bg-accent" },
    { type: "task", text: "Help me make pasta", color: "bg-success" },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const scheduleStep = useCallback((action: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      action();
    }, delay);
    timeoutsRef.current.push(timeout);
    return { delay, action };
  }, []);

  const runAnimation = useCallback((startStep: number = 0) => {
    const delays = [1500, 1500, 1500, 1200, 1000];
    let cumulativeDelay = 0;
    
    remainingTimesRef.current = [];
    
    for (let i = startStep; i < 6; i++) {
      const targetStep = i;
      const stepDelay = i === startStep ? 0 : delays[Math.min(i - 1, delays.length - 1)];
      cumulativeDelay += stepDelay;
      
      const scheduled = scheduleStep(() => {
        setStep(targetStep);
      }, cumulativeDelay);
      
      remainingTimesRef.current.push(scheduled);
    }
    
    pausedAtRef.current = Date.now();
  }, [scheduleStep]);

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
    pausedAtRef.current = Date.now();
  };

  const handlePause = () => {
    if (!isPaused) {
      // Pause: clear all pending timeouts and save remaining times
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
    remainingTimesRef.current = [];
    pausedAtRef.current = null;
  };

  return (
    <motion.div className="concept-card relative overflow-hidden" layout>
      <FloatingDecorations variant="mixed" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Prompt</h3>
            <p className="text-muted-foreground text-sm">Initial instruction to AI</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Show Prompt
            </motion.button>
          ) : step < 5 ? (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handlePause}
              className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-success" />
              ) : (
                <Pause className="w-5 h-5 text-success" />
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
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-success/5 via-transparent to-primary/5 rounded-2xl">
                {/* Prompt building */}
                <div className="space-y-3 w-full">
                  <p className="text-sm text-muted-foreground text-center">Building a prompt:</p>
                  
                  {promptParts.map((part, index) => (
                    <motion.div
                      key={part.type}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={
                        step >= index + 1
                          ? { opacity: 1, x: 0, height: "auto" }
                          : {}
                      }
                      transition={{ duration: 0.6 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`${part.color} text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase shadow-md`}
                        >
                          {part.type}
                        </span>
                        <span className="font-mono text-sm bg-muted px-4 py-3 rounded-xl flex-1 shadow-inner">
                          {part.text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Combined prompt */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-2 w-full"
                  >
                    <p className="text-sm text-muted-foreground text-center">Complete Prompt:</p>
                    <div className="bg-card border-2 border-border rounded-xl p-4 shadow-lg">
                      <p className="font-mono text-sm leading-relaxed">
                        <span className="text-primary">"You are a helpful assistant</span>
                        <span className="text-accent"> that knows about cooking.</span>
                        <span className="text-success"> Help me make pasta."</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Explanation */}
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3 w-full"
                  >
                    <div className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
                      <p className="text-base text-foreground">
                        📝 A prompt is the <strong>starting point</strong> for AI. 
                        It sets the role, context, and task!
                      </p>
                    </div>

                    <div className="text-center">
                      <button onClick={handleReset} className="text-base text-primary hover:underline font-semibold">
                        ↻ Try again
                      </button>
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

export default PromptAnimation;
