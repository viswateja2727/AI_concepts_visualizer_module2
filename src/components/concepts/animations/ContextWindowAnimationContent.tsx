import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, AlertTriangle } from "lucide-react";

const ContextWindowAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [tokens, setTokens] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxTokens = 16;
  const allTokens = ["Hello", ",", " I", " am", " writing", " a", " very", " long", " message", " to", " demonstrate", " the", " context", " window", " limit", " here", " but", " this", " will", " be", " cut", " off", "!"];

  const clearAll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const runAnimation = useCallback(() => {
    clearAll();
    setStep(0);
    setTokens([]);

    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      if (currentIndex < allTokens.length) {
        setTokens((prev) => [...prev, allTokens[currentIndex]]);
        currentIndex++;
        if (currentIndex === maxTokens) setStep(1);
      } else {
        setStep(2);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1600);
  }, [clearAll, allTokens.length, maxTokens]);

  useEffect(() => {
    runAnimation();
    return () => clearAll();
  }, [runAnimation, clearAll]);

  const handleReset = () => runAnimation();
  const isComplete = step >= 2;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Context window capacity */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Context Window: <span className="font-bold">{Math.min(tokens.length, maxTokens)}</span> / {maxTokens} tokens
        </p>
        <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
          <motion.div className={`h-full transition-colors ${tokens.length >= maxTokens ? "bg-destructive" : "bg-gradient-to-r from-primary to-primary/80"}`} animate={{ width: `${(Math.min(tokens.length, maxTokens) / maxTokens) * 100}%` }} />
        </div>
      </div>

      {/* Token visualization */}
      <div className="bg-muted/30 rounded-xl p-4 min-h-[100px]">
        <p className="text-xs text-muted-foreground mb-2">Tokens in memory:</p>
        <div className="flex flex-wrap gap-1">
          {tokens.slice(0, maxTokens).map((token, index) => (
            <motion.span key={index} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2 py-0.5 rounded text-xs font-mono shadow-sm">
              {token}
            </motion.span>
          ))}
        </div>

        {/* Overflow tokens */}
        {tokens.length > maxTokens && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 pt-3 border-t-2 border-destructive/30">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold">Overflow! These tokens are lost:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tokens.slice(maxTokens).map((token, index) => (
                <motion.span key={index} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }} className="bg-destructive/30 text-destructive px-2 py-0.5 rounded text-xs font-mono line-through">
                  {token}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Warning */}
      {step >= 1 && tokens.length >= maxTokens && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-warning/10 border-2 border-warning/30 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-sm text-foreground">
            <strong>Window full!</strong> New tokens will push old ones out.
          </p>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">📏 Real LLMs have context windows of <strong>4K-128K+ tokens</strong>!</p>
        </motion.div>
      )}
    </div>
  );
};

export default ContextWindowAnimationContent;
