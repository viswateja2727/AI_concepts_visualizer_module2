import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const TrainingAnimationContent = () => {
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.5);
  const [accuracy, setAccuracy] = useState(10);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const examples = [
    { input: "The sky is", target: "blue" },
    { input: "Dogs like to", target: "play" },
    { input: "Water is", target: "wet" },
  ];

  const runTraining = useCallback(() => {
    setEpoch(0);
    setLoss(2.5);
    setAccuracy(10);
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      setEpoch((prev) => {
        const newEpoch = prev + 1;
        if (newEpoch >= 10) {
          setIsComplete(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return newEpoch;
      });
      setLoss((prev) => Math.max(0.15, prev * 0.7));
      setAccuracy((prev) => Math.min(95, prev + Math.random() * 12 + 5));
    }, 800);
  }, []);

  useEffect(() => {
    runTraining();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runTraining]);

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    runTraining();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Training examples */}
      <div>
        <p className="text-sm text-muted-foreground text-center mb-3">Training Examples:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {examples.map((ex, index) => (
            <motion.div
              key={index}
              animate={{ opacity: epoch > 0 ? [0.5, 1, 0.5] : 1, scale: epoch > 0 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.8, delay: index * 0.15, repeat: epoch > 0 && !isComplete ? Infinity : 0 }}
              className="bg-muted/50 rounded-xl px-4 py-2 text-sm font-mono"
            >
              <span className="text-muted-foreground">{ex.input}</span>
              <span className="text-success font-bold"> → {ex.target}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Loss (Error)</p>
          <motion.p key={loss} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-2xl font-bold ${loss < 0.5 ? "text-success" : loss < 1 ? "text-warning" : "text-destructive"}`}>
            {loss.toFixed(2)}
          </motion.p>
          <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-destructive rounded-full" animate={{ width: `${(loss / 2.5) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
          <motion.p key={accuracy} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-2xl font-bold ${accuracy > 80 ? "text-success" : accuracy > 50 ? "text-warning" : "text-muted-foreground"}`}>
            {accuracy.toFixed(0)}%
          </motion.p>
          <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-success rounded-full" animate={{ width: `${accuracy}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Epoch: <span className="font-bold text-primary">{epoch}</span> / 10
        </p>
        <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(epoch / 10) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">🎓 <strong>Training complete!</strong> The model learned patterns from data.</p>
        </motion.div>
      )}
    </div>
  );
};

export default TrainingAnimationContent;
