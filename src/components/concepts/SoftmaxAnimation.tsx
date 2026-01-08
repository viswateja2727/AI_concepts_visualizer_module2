import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Percent, Play, ArrowRight, Pause } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const SoftmaxAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const data = [
    { word: "sunny", logit: 3.2, probability: 0.58 },
    { word: "cloudy", logit: 2.4, probability: 0.26 },
    { word: "rainy", logit: 1.1, probability: 0.07 },
    { word: "stormy", logit: -0.5, probability: 0.01 },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 0) => {
    const delays = [1000, 1500, 2000, 2000];
    let cumulativeDelay = 0;
    
    for (let i = startStep; i < 5; i++) {
      const targetStep = i;
      cumulativeDelay += delays[Math.min(i - 1, delays.length - 1)] || 1000;
      
      const timeout = setTimeout(() => {
        setStep(targetStep);
      }, cumulativeDelay);
      
      timeoutsRef.current.push(timeout);
    }
  }, []);

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

  const isComplete = step >= 4;

  return (
    <motion.div 
      className="concept-card relative overflow-hidden"
      layout
    >
      <FloatingDecorations variant="stars" count={5} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center shadow-lg">
            <Percent className="w-7 h-7 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Softmax</h3>
            <p className="text-muted-foreground text-sm">Converting scores to percentage chances</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Apply Softmax
            </motion.button>
          ) : !isComplete ? (
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
              className="space-y-6"
            >
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-success/5 via-transparent to-primary/5 rounded-2xl">
                {/* Mathematical Formula */}
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center w-full"
                  >
                    <p className="text-sm text-muted-foreground mb-3">Softmax Formula:</p>
                    <div className="bg-card px-6 py-4 rounded-xl border-2 border-success/30 inline-block shadow-lg">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <span className="font-serif italic">P</span>
                        <span>(</span>
                        <span className="font-serif italic">i</span>
                        <span>)</span>
                        <span className="mx-2">=</span>
                        <div className="flex flex-col items-center">
                          <div className="border-b-2 border-foreground px-4 pb-1">
                            <span className="font-serif italic">e</span>
                            <sup className="text-sm">logit(i)</sup>
                          </div>
                          <div className="pt-1">
                            <span className="text-lg">Σ</span>
                            <span className="font-serif italic"> e</span>
                            <sup className="text-sm">logit(j)</sup>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-xs text-muted-foreground mt-3"
                    >
                      e ≈ 2.718 (Euler's number)
                    </motion.p>
                  </motion.div>
                )}

                {/* Transformation visualization */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-7 gap-2 items-center w-full"
                  >
                    {/* Logits column */}
                    <div className="col-span-3 space-y-2">
                      <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">Logits</p>
                      {data.map((item, index) => (
                        <motion.div
                          key={`logit-${item.word}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2, duration: 0.5 }}
                          className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2"
                        >
                          <span className="text-sm font-medium">{item.word}</span>
                          <span className="font-mono text-sm ml-auto font-bold">{item.logit}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Arrow */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="col-span-1 flex justify-center"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <ArrowRight className="w-8 h-8 text-success" />
                        </motion.div>
                        <span className="text-xs text-success font-bold">softmax</span>
                      </div>
                    </motion.div>

                    {/* Probabilities column */}
                    <div className="col-span-3 space-y-2">
                      <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">Probabilities</p>
                      {step >= 3 &&
                        data.map((item, index) => (
                          <motion.div
                            key={`prob-${item.word}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.3, duration: 0.5 }}
                            className="flex items-center gap-2 bg-success/10 rounded-xl px-3 py-2"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.probability * 100}%` }}
                              transition={{ delay: index * 0.3 + 0.5, duration: 0.8 }}
                              className="h-3 bg-gradient-to-r from-success to-success/70 rounded-full"
                            />
                            <span className="font-mono text-sm font-bold ml-auto text-success">
                              {(item.probability * 100).toFixed(0)}%
                            </span>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Sum verification */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/40 rounded-2xl p-4 w-full"
                  >
                    <p className="text-sm text-foreground text-center">
                      🔢 <strong>58% + 26% + 7% + 1% = 100%</strong>
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      All probabilities always sum to exactly 100%!
                    </p>
                  </motion.div>
                )}

                {/* Key insight */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg w-full"
                  >
                    <p className="text-base text-foreground">
                      ✨ Now the model can <strong>sample</strong> from these probabilities to pick the next word!
                    </p>
                  </motion.div>
                )}

                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
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

export default SoftmaxAnimation;
