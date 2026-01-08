import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Check, X } from "lucide-react";

const PromptingAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const techniques = [
    { name: "Be Specific", bad: "Write about dogs", good: "Write a 100-word paragraph about golden retrievers as family pets", icon: "🎯" },
    { name: "Give Examples", bad: "Translate words", good: "Translate: Hello→Hola, Goodbye→Adiós, Thank you→", icon: "📋" },
    { name: "Set Format", bad: "List countries", good: "List 5 European countries as a numbered list with capitals", icon: "📝" },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [3000, 3000, 3000, 2400];
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

      <p className="text-sm text-muted-foreground text-center">Key prompting techniques:</p>

      {techniques.map((technique, index) => (
        <motion.div key={technique.name} initial={{ opacity: 0, y: 20 }} animate={step >= index + 1 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="bg-muted/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{technique.icon}</span>
            <span className="font-bold text-sm">{technique.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <X className="w-3 h-3 text-destructive" />
                <span className="text-xs text-destructive font-bold">Vague</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{technique.bad}</p>
            </div>
            <div className="bg-success/10 border-2 border-success/30 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Check className="w-3 h-3 text-success" />
                <span className="text-xs text-success font-bold">Better</span>
              </div>
              <p className="font-mono text-xs">{technique.good}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">✨ Good prompting = <strong>specific, formatted, with examples</strong>!</p>
        </motion.div>
      )}
    </div>
  );
};

export default PromptingAnimationContent;
