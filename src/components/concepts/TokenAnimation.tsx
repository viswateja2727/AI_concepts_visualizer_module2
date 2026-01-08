import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Play, Pause } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const TokenAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const sentence = "Hello, how are you today?";
  const tokens = ["Hello", ",", " how", " are", " you", " today", "?"];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 0) => {
    let cumulativeDelay = 0;
    const totalSteps = tokens.length + 3; // step 1 (sentence), step 2 (tokenizing), steps 3-9 (tokens), step 10 (done)
    
    for (let i = startStep; i < totalSteps; i++) {
      const targetStep = i;
      cumulativeDelay += i < 3 ? 1000 : 500;
      
      const timeout = setTimeout(() => {
        setStep(targetStep);
      }, cumulativeDelay);
      
      timeoutsRef.current.push(timeout);
    }
  }, [tokens.length]);

  const handleStart = () => {
    setIsStarted(true);
    setStep(1);
    setIsPaused(false);
    clearAllTimeouts();
    runAnimation(2);
  };

  const handlePause = () => {
    if (!isPaused) {
      clearAllTimeouts();
      setIsPaused(true);
    } else {
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

  const isComplete = step >= tokens.length + 2;

  return (
    <motion.div 
      className="concept-card relative overflow-hidden"
      layout
    >
      <FloatingDecorations variant="mixed" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
            <Scissors className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Token</h3>
            <p className="text-muted-foreground text-sm">Breaking text into pieces</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Start Tokenizing
            </motion.button>
          ) : !isComplete ? (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handlePause}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-primary" />
              ) : (
                <Pause className="w-5 h-5 text-primary" />
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
              className="space-y-6"
            >
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl">
                {/* Original sentence */}
                <div className="text-center w-full">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground mb-3"
                  >
                    Original Text:
                  </motion.p>
                  <motion.div
                    className="font-mono text-xl bg-card px-6 py-4 rounded-xl border-2 border-primary/30 inline-block shadow-lg"
                    animate={step >= 2 ? { opacity: 0.6, scale: 0.95 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {sentence}
                  </motion.div>
                </div>

                {/* Tokenization process */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center w-full"
                  >
                    <p className="text-sm text-muted-foreground mb-4">Tokens:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {tokens.map((token, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0, y: -30, rotateX: -90 }}
                          animate={
                            step >= index + 3
                              ? { opacity: 1, scale: 1, y: 0, rotateX: 0 }
                              : {}
                          }
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            duration: 0.8 
                          }}
                          className="font-mono bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-xl text-lg shadow-lg hover:scale-110 transition-transform cursor-default"
                        >
                          "{token}"
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Explanation */}
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg w-full"
                  >
                    <p className="text-base text-foreground">
                      🎉 <strong>7 tokens</strong> created! AI processes text piece by piece, not as whole sentences.
                    </p>
                  </motion.div>
                )}

                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center w-full"
                  >
                    <button
                      onClick={handleReset}
                      className="text-base text-primary hover:underline font-semibold"
                    >
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

export default TokenAnimation;
