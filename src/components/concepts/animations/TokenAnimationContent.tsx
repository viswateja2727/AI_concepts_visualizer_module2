import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const TokenAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const sentence = "Hello, how are you today?";
  const tokens = ["Hello", ",", " how", " are", " you", " today", "?"];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback(
    (startStep: number = 0) => {
      let cumulativeDelay = 0;
      const totalSteps = tokens.length + 3;

      for (let i = startStep; i < totalSteps; i++) {
        const targetStep = i;
        cumulativeDelay += i < 3 ? 4000 : 2000;

        const timeout = setTimeout(() => {
          setStep(targetStep);
        }, cumulativeDelay);

        timeoutsRef.current.push(timeout);
      }
    },
    [tokens.length]
  );

  useEffect(() => {
    // Auto-start
    setStep(1);
    runAnimation(2);
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
    setStep(1);
    setIsPaused(false);
    runAnimation(2);
  };

  const isComplete = step >= tokens.length + 2;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isComplete && (
          <button
            onClick={handlePause}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-primary" />
            ) : (
              <Pause className="w-5 h-5 text-primary" />
            )}
          </button>
        )}
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Original sentence */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">Original Text:</p>
        <motion.div
          className="font-mono text-xl bg-card px-6 py-4 rounded-xl border-2 border-primary/30 inline-block shadow-lg"
          animate={
            step >= 2
              ? { opacity: 0.6, scale: 0.95 }
              : { opacity: 1, scale: 1 }
          }
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
          className="text-center"
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
                  duration: 0.8,
                }}
                className="font-mono bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-xl text-lg shadow-lg"
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
          className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg"
        >
          <p className="text-base text-foreground">
            🎉 <strong>7 tokens</strong> created! AI processes text piece by
            piece, not as whole sentences.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TokenAnimationContent;
