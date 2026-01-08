import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Ghost, AlertCircle } from "lucide-react";

const HallucinationsAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const examples = [{ question: "Who invented the telephone?", correct: "Alexander Graham Bell in 1876", hallucinated: "Thomas Edison invented it in 1890" }];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [1000, 2000, 2000, 2000, 2000, 2000];
    let cumulativeDelay = 0;

    for (let i = startStep; i <= 6; i++) {
      cumulativeDelay += delays[i - 1] || 1000;
      const timeout = setTimeout(() => setStep(i), cumulativeDelay);
      timeoutsRef.current.push(timeout);
    }
  }, []);

  useEffect(() => {
    runAnimation(1);
    return () => clearAllTimeouts();
  }, [runAnimation, clearAllTimeouts]);

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
    setStep(0);
    setIsPaused(false);
    runAnimation(1);
  };

  const isComplete = step >= 6;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isComplete && (
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-destructive" /> : <Pause className="w-5 h-5 text-destructive" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Example */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-muted/30 rounded-xl p-4 space-y-3">
          <p className="font-mono text-sm text-primary">Q: {examples[0].question}</p>
          <div className="grid grid-cols-2 gap-3">
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-success/10 border-2 border-success/30 rounded-lg p-3">
                <p className="text-xs text-success font-bold mb-1">✓ Correct</p>
                <p className="text-xs">{examples[0].correct}</p>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-3 relative">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute -top-2 -right-2">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Why does this happen?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>• AI predicts based on patterns, not facts</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>• No real-time fact checking</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>• Training data may have errors or gaps</motion.li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* How to prevent */}
      {step >= 5 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
          <p className="text-sm font-bold text-foreground mb-2">🛡️ How to reduce hallucinations:</p>
          <div className="grid grid-cols-2 gap-2">
            {["Verify facts", "Ask for sources", "Use RAG", "Lower temperature"].map((tip, index) => (
              <motion.div key={tip} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-lg px-3 py-2 text-xs font-medium text-center shadow-sm">
                {tip}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">👻 Hallucinations are <strong>confident but wrong</strong> outputs!</p>
        </motion.div>
      )}
    </div>
  );
};

export default HallucinationsAnimationContent;
