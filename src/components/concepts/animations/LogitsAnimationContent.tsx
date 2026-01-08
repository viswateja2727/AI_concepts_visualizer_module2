import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const LogitsAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const logits = [
    { word: "cat", value: 2.5, color: "bg-primary" },
    { word: "dog", value: 1.8, color: "bg-accent" },
    { word: "bird", value: 0.3, color: "bg-success" },
    { word: "fish", value: -0.5, color: "bg-warning" },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [3200, 4000, 4000, 4800];
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [step]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isComplete && (
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center hover:bg-warning/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-warning" /> : <Pause className="w-5 h-5 text-warning" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Input context */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Context: "I have a pet"</p>
          <p className="text-sm text-muted-foreground">What word comes next?</p>
        </motion.div>
      )}

      {/* Logits bars */}
      {step >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Raw logits (unnormalized scores):</p>
          {logits.map((item, index) => (
            <motion.div key={item.word} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }} className="flex items-center gap-3">
              <span className="w-12 text-right font-mono text-sm">{item.word}</span>
              <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                <motion.div
                  className={`h-full ${item.color} flex items-center justify-end pr-2`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(10, ((item.value + 1) / 3.5) * 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <span className="text-xs text-primary-foreground font-bold">{item.value}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Explanation */}
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 text-center">
          <p className="text-sm text-foreground">Higher logit = more likely word. But these aren't probabilities yet!</p>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">📊 Logits are <strong>raw prediction scores</strong> before becoming probabilities!</p>
        </motion.div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default LogitsAnimationContent;
