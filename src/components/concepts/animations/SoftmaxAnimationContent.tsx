import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const SoftmaxAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const data = [
    { word: "cat", logit: 2.5, probability: 0.65 },
    { word: "dog", logit: 1.8, probability: 0.25 },
    { word: "bird", logit: 0.3, probability: 0.07 },
    { word: "fish", logit: -0.5, probability: 0.03 },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [800, 1200, 1200, 1000];
    let cumulativeDelay = 0;

    for (let i = startStep; i <= 4; i++) {
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

  const isComplete = step >= 4;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isComplete && (
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-accent" /> : <Pause className="w-5 h-5 text-accent" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Logits */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Logits (raw scores):</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {data.map((item) => (
              <div key={item.word} className="bg-muted rounded-lg px-3 py-2 text-center">
                <p className="font-mono text-sm">{item.word}</p>
                <p className="font-bold text-primary">{item.logit}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Softmax transformation */}
      {step >= 2 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="inline-block bg-gradient-to-r from-accent to-accent/80 text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg">
            Softmax(x) = eˣ / Σeˣ
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-4xl mt-4">
            ↓
          </motion.div>
        </motion.div>
      )}

      {/* Probabilities */}
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Probabilities (sum = 100%):</p>
          {data.map((item, index) => (
            <motion.div key={item.word} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.15 }} className="flex items-center gap-3">
              <span className="w-12 text-right font-mono text-sm">{item.word}</span>
              <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-success to-success/80 flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.probability * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                >
                  <span className="text-xs text-primary-foreground font-bold">{(item.probability * 100).toFixed(0)}%</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">🔢 Softmax converts logits into <strong>probabilities that sum to 100%</strong>!</p>
        </motion.div>
      )}
    </div>
  );
};

export default SoftmaxAnimationContent;
