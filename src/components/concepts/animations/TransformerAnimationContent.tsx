import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const TransformerAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const tokens = ["The", "cat", "sat", "on", "the", "mat"];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [1400, 2000, 2500, 2000, 1800];
    let cumulativeDelay = 0;

    for (let i = startStep; i <= 5; i++) {
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

  const isComplete = step >= 5;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isComplete && (
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-primary" /> : <Pause className="w-5 h-5 text-primary" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Input tokens */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Input tokens:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {tokens.map((token, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-md"
              >
                {token}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Self-attention visualization */}
      {step >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-muted/30 rounded-xl p-4">
          <p className="text-sm text-muted-foreground text-center mb-3">Self-Attention: Each word "looks at" others</p>
          <div className="relative flex justify-center gap-4 py-4">
            {tokens.slice(0, 4).map((token, index) => (
              <motion.div key={index} className="relative z-10 bg-accent text-primary-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-lg" animate={{ scale: step >= 3 ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                {token}
              </motion.div>
            ))}
            {step >= 3 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <motion.line initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 0.8 }} x1="25%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-primary" />
                <motion.line initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 0.8, delay: 0.2 }} x1="25%" y1="50%" x2="75%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-accent" />
              </svg>
            )}
          </div>
        </motion.div>
      )}

      {/* Output */}
      {step >= 4 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Enriched representations:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {tokens.map((token, index) => (
              <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-r from-success to-success/80 text-primary-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                {token}+context
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">🔄 Transformers use <strong>self-attention</strong> to understand word relationships!</p>
        </motion.div>
      )}
    </div>
  );
};

export default TransformerAnimationContent;
