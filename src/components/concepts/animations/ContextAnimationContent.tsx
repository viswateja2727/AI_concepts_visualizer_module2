import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const ContextAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const conversation = [
    { role: "user", text: "My name is Alex" },
    { role: "ai", text: "Nice to meet you, Alex!" },
    { role: "user", text: "What's my name?" },
    { role: "ai", text: "Your name is Alex! (I remember from our conversation)" },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [4000, 4000, 4000, 4000, 4800, 4000];
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
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-primary" /> : <Pause className="w-5 h-5 text-primary" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Chat messages */}
      <div className="space-y-3 max-h-[250px] overflow-auto">
        {conversation.map((msg, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={step >= index + 1 ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.5 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${msg.role === "user" ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none border-2 border-border"}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Context visualization */}
      {step >= 5 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2 text-center">What AI sees (the context):</p>
          <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1 shadow-inner">
            {conversation.slice(0, -1).map((msg, index) => (
              <motion.p key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.15 }} className={msg.role === "user" ? "text-primary" : "text-muted-foreground"}>
                [{msg.role}]: {msg.text}
              </motion.p>
            ))}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-primary">
              [user]: What's my name? ← <span className="text-success font-bold">Current</span>
            </motion.p>
          </div>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">💭 Context = <strong>all previous messages</strong> sent to the AI!</p>
        </motion.div>
      )}
    </div>
  );
};

export default ContextAnimationContent;
