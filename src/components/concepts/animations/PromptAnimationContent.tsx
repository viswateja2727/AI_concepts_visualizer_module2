import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const PromptAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const promptParts = [
    { type: "role", text: "You are a helpful assistant", color: "bg-primary" },
    { type: "context", text: "that knows about cooking", color: "bg-accent" },
    { type: "task", text: "Help me make pasta", color: "bg-success" },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [4800, 4800, 4800, 4000, 3200];
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
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-success" /> : <Pause className="w-5 h-5 text-success" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Prompt building */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">Building a prompt:</p>
        {promptParts.map((part, index) => (
          <motion.div key={part.type} initial={{ opacity: 0, x: -20, height: 0 }} animate={step >= index + 1 ? { opacity: 1, x: 0, height: "auto" } : {}} transition={{ duration: 0.6 }} className="overflow-hidden">
            <div className="flex items-center gap-3">
              <span className={`${part.color} text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase shadow-md`}>{part.type}</span>
              <span className="font-mono text-sm bg-muted px-4 py-3 rounded-xl flex-1 shadow-inner">{part.text}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Combined prompt */}
      {step >= 4 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-2">
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

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">📝 A prompt is the <strong>starting point</strong> for AI. It sets the role, context, and task!</p>
        </motion.div>
      )}
    </div>
  );
};

export default PromptAnimationContent;
