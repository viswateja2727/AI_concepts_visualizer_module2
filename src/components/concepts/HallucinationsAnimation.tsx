import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Play, AlertCircle } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const HallucinationsAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const examples = [
    {
      question: "Who invented the telephone?",
      correct: "Alexander Graham Bell in 1876",
      hallucinated: "Thomas Edison invented it in 1890",
    },
  ];

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    setStep(0);
    timeoutsRef.current = [];
    
    const delays = [500, 1500, 2500, 3500, 4500, 5500];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => setStep(i + 1), delay);
      timeoutsRef.current.push(t);
    });
  };

  const handleReset = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    setIsStarted(false);
    setStep(0);
  };

  return (
    <motion.div className="concept-card relative overflow-hidden" layout>
      <FloatingDecorations variant="clouds" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shadow-lg">
            <Ghost className="w-7 h-7 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Hallucinations</h3>
            <p className="text-muted-foreground text-sm">AI generating false information</p>
          </div>
          
          {!isStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              See Hallucinations
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
              <div className="animation-container flex-col gap-4 bg-gradient-to-br from-destructive/5 via-transparent to-warning/5 rounded-2xl">
                {/* Example 1 */}
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-muted/30 rounded-xl p-4 space-y-3 w-full"
                  >
                    <p className="font-mono text-sm text-primary">Q: {examples[0].question}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {step >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="bg-success/10 border-2 border-success/30 rounded-lg p-3"
                        >
                          <p className="text-xs text-success font-bold mb-1">✓ Correct</p>
                          <p className="text-xs">{examples[0].correct}</p>
                        </motion.div>
                      )}
                      
                      {step >= 3 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-3 relative"
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -top-2 -right-2"
                          >
                            <Ghost className="w-5 h-5 text-destructive" />
                          </motion.div>
                          <p className="text-xs text-destructive font-bold mb-1">✗ Hallucination</p>
                          <p className="text-xs line-through opacity-70">{examples[0].hallucinated}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Why it happens */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 w-full"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-foreground mb-1">Why does this happen?</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            • AI predicts based on patterns, not facts
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            • No real-time fact checking
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            • Training data may have errors or gaps
                          </motion.li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* How to prevent */}
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 w-full"
                  >
                    <p className="text-sm font-bold text-foreground mb-2">🛡️ How to reduce hallucinations:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Verify facts", "Ask for sources", "Use RAG", "Lower temperature"].map((tip, index) => (
                        <motion.div
                          key={tip}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card rounded-lg px-3 py-2 text-xs font-medium text-center shadow-sm"
                        >
                          {tip}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Summary */}
                {step >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3 w-full"
                  >
                    <div className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
                      <p className="text-base text-foreground">
                        👻 Hallucinations are <strong>confident but wrong</strong> outputs. 
                        Always verify important AI-generated information!
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

export default HallucinationsAnimation;
