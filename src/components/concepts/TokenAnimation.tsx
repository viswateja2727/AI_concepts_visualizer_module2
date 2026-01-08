import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Play, Volume2, VolumeX, Pause } from "lucide-react";
import { useNarration } from "@/hooks/useNarration";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const TokenAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [animationPaused, setAnimationPaused] = useState(false);
  const { speak, stop, togglePause, isSpeaking, isPaused } = useNarration();
  const intervalRef = useState<NodeJS.Timeout | null>(null);

  const sentence = "Hello, how are you today?";
  const tokens = ["Hello", ",", " how", " are", " you", " today", "?"];

  const narrations = [
    "Let's learn about tokens! Tokens are small pieces of text that AI can understand.",
    "Here is our sentence: Hello, how are you today?",
    "Now watch as we break it into tokens!",
    "Each token is like a puzzle piece. The AI reads one piece at a time.",
    "We created 7 tokens! AI processes text piece by piece, not as whole sentences."
  ];

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const handleStart = () => {
    setIsStarted(true);
    setStep(0);
    
    speak(narrations[0], () => {
      setTimeout(() => {
        setStep(1);
        speak(narrations[1], () => {
          setTimeout(() => {
            setStep(2);
            speak(narrations[2]);
            let tokenStep = 2;
            const tokenInterval = setInterval(() => {
              tokenStep++;
              setStep(tokenStep);
              if (tokenStep >= tokens.length + 2) {
                clearInterval(tokenInterval);
                setTimeout(() => {
                  speak(narrations[4]);
                }, 500);
              }
            }, 1500);
          }, 1000);
        });
      }, 800);
    });
  };

  const handleReset = () => {
    stop();
    setIsStarted(false);
    setStep(0);
    setAnimationPaused(false);
  };

  const handleTogglePause = () => {
    togglePause();
    setAnimationPaused(!animationPaused);
  };

  return (
    <motion.div 
      className="concept-card relative overflow-hidden"
      layout
      animate={{ 
        height: isStarted ? "auto" : "auto"
      }}
    >
      <FloatingDecorations variant="mixed" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
            <Scissors className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Token</h3>
            <p className="text-muted-foreground text-sm">Breaking text into pieces</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Start Tokenizing
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleTogglePause}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-primary" />
                ) : (
                  <Pause className="w-5 h-5 text-primary" />
                )}
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                {isSpeaking && !isPaused ? (
                  <Volume2 className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
              </motion.div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isStarted && (
            <motion.div
              key="animation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl">
                {/* Original sentence */}
                <div className="text-center w-full">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground mb-3"
                  >
                    Original Text:
                  </motion.p>
                  <motion.div
                    className="font-mono text-xl bg-card px-6 py-4 rounded-xl border-2 border-primary/30 inline-block shadow-lg"
                    animate={step >= 2 ? { opacity: 0.6, scale: 0.95 } : { opacity: 1, scale: 1 }}
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
                    className="text-center w-full"
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
                            duration: 0.8 
                          }}
                          className="font-mono bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-xl text-lg shadow-lg hover:scale-110 transition-transform cursor-default"
                        >
                          "{token}"
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Explanation */}
                {step >= tokens.length + 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg w-full"
                  >
                    <p className="text-base text-foreground">
                      🎉 <strong>7 tokens</strong> created! AI processes text piece by piece, not as whole sentences.
                    </p>
                  </motion.div>
                )}

                {step >= tokens.length + 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center w-full"
                  >
                    <button
                      onClick={handleReset}
                      className="text-base text-primary hover:underline font-semibold"
                    >
                      ↻ Try again
                    </button>
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

export default TokenAnimation;
