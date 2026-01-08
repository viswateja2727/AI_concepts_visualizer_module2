import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Play, AlertTriangle } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const ContextWindowAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [tokens, setTokens] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxTokens = 16;
  const allTokens = [
    "Hello", ",", " I", " am", " writing", " a", " very", " long",
    " message", " to", " demonstrate", " the", " context", " window", " limit", " here",
    " but", " this", " will", " be", " cut", " off", "!"
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    setStep(0);
    setTokens([]);

    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      if (currentIndex < allTokens.length) {
        setTokens((prev) => [...prev, allTokens[currentIndex]]);
        currentIndex++;
        if (currentIndex === maxTokens) {
          setStep(1);
        }
      } else {
        setStep(2);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 400);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsStarted(false);
    setStep(0);
    setTokens([]);
  };

  return (
    <motion.div className="concept-card relative overflow-hidden" layout>
      <FloatingDecorations variant="shapes" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center shadow-lg">
            <Maximize2 className="w-7 h-7 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Context Window</h3>
            <p className="text-muted-foreground text-sm">Maximum memory capacity of AI</p>
          </div>
          
          {!isStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Fill Window
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isStarted && (
            <motion.div
              key="animation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="animation-container flex-col gap-4 bg-gradient-to-br from-warning/5 via-transparent to-destructive/5 rounded-2xl">
                {/* Context window capacity */}
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground mb-2">
                    Context Window: <span className="font-bold">{Math.min(tokens.length, maxTokens)}</span> / {maxTokens} tokens
                  </p>
                  <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className={`h-full transition-colors ${
                        tokens.length >= maxTokens ? "bg-destructive" : "bg-gradient-to-r from-primary to-primary/80"
                      }`}
                      animate={{ width: `${(Math.min(tokens.length, maxTokens) / maxTokens) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Token visualization */}
                <div className="bg-muted/30 rounded-xl p-4 min-h-[100px] w-full">
                  <p className="text-xs text-muted-foreground mb-2">Tokens in memory:</p>
                  <div className="flex flex-wrap gap-1">
                    {tokens.slice(0, maxTokens).map((token, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2 py-0.5 rounded text-xs font-mono shadow-sm"
                      >
                        {token}
                      </motion.span>
                    ))}
                  </div>

                  {/* Overflow tokens */}
                  {tokens.length > maxTokens && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 pt-3 border-t-2 border-destructive/30"
                    >
                      <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold">Overflow! These tokens are lost:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tokens.slice(maxTokens).map((token, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.5, scale: 1 }}
                            className="bg-destructive/30 text-destructive px-2 py-0.5 rounded text-xs font-mono line-through"
                          >
                            {token}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Warning */}
                {step >= 1 && tokens.length >= maxTokens && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-warning/10 border-2 border-warning/30 rounded-xl p-3 flex items-center gap-3 w-full"
                  >
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      <strong>Window full!</strong> New tokens will push old ones out.
                    </p>
                  </motion.div>
                )}

                {/* Explanation */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3 w-full"
                  >
                    <div className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
                      <p className="text-base text-foreground">
                        📏 Real LLMs have context windows of <strong>4K-128K+ tokens</strong>. 
                        When exceeded, oldest content is forgotten!
                      </p>
                    </div>

                    <div className="text-center">
                      <button onClick={handleReset} className="text-base text-primary hover:underline font-semibold">
                        ↻ Try again
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContextWindowAnimation;
