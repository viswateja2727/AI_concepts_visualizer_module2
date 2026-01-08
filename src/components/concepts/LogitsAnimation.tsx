import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Play, Volume2, VolumeX, Pause, Brain, Calculator } from "lucide-react";
import { useNarration } from "@/hooks/useNarration";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const LogitsAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const { speak, stop, togglePause, isSpeaking, isPaused } = useNarration();

  const neuronWeights = [
    { word: "sunny", weights: [0.9, 0.8, 0.7], bias: 0.5, result: 3.2 },
    { word: "rainy", weights: [0.3, 0.4, 0.2], bias: 0.2, result: 1.1 },
    { word: "cloudy", weights: [0.6, 0.7, 0.5], bias: 0.3, result: 2.4 },
    { word: "stormy", weights: [0.1, 0.2, 0.1], bias: -0.9, result: -0.5 },
  ];

  const inputFeatures = ["temperature", "humidity", "pressure"];

  const narrations = [
    "Let's understand logits! Logits are raw scores that come from the neural network before they become probabilities.",
    "Imagine we're predicting the next word after 'The weather today is'. The AI looks at patterns it learned.",
    "The AI uses weights and biases for each possible word. Weights show how important each input feature is.",
    "Let me show you how the score for 'sunny' is calculated. We multiply inputs by weights and add the bias!",
    "Higher scores mean the AI is more confident. Notice how 'sunny' has the highest score of 3.2! Negative scores like 'stormy' mean the AI thinks it's unlikely."
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
            speak(narrations[2], () => {
              setTimeout(() => {
                setStep(3);
                speak(narrations[3], () => {
                  setTimeout(() => {
                    setStep(4);
                    speak(narrations[4]);
                  }, 2000);
                });
              }, 2000);
            });
          }, 1500);
        });
      }, 1000);
    });
  };

  const handleReset = () => {
    stop();
    setIsStarted(false);
    setStep(0);
  };

  const maxLogit = Math.max(...neuronWeights.map((l) => l.result));

  return (
    <motion.div 
      className="concept-card relative overflow-hidden"
      layout
    >
      <FloatingDecorations variant="shapes" count={4} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Logits</h3>
            <p className="text-muted-foreground text-sm">Raw output scores before normalization</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Show Logits
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={togglePause}
                className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center hover:bg-warning/20 transition-colors"
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-warning" />
                ) : (
                  <Pause className="w-5 h-5 text-warning" />
                )}
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center"
              >
                {isSpeaking && !isPaused ? (
                  <Volume2 className="w-5 h-5 text-warning animate-pulse" />
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
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-warning/5 via-transparent to-primary/5 rounded-2xl">
                {/* Context */}
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center w-full"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Predicting next word for:</p>
                    <div className="font-mono text-lg bg-card px-6 py-3 rounded-xl border-2 border-primary/30 inline-block shadow-lg">
                      "The weather today is ___"
                    </div>
                  </motion.div>
                )}

                {/* Show how weights work */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-muted/30 rounded-xl p-4 w-full"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-primary" />
                      <p className="text-sm font-semibold">Neural Network Weights:</p>
                    </div>
                    <div className="flex gap-4 justify-center mb-3">
                      {inputFeatures.map((feature, i) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="bg-primary/20 px-3 py-2 rounded-lg text-xs font-mono"
                        >
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Calculation example */}
                {step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20 w-full"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="w-5 h-5 text-accent" />
                      <p className="text-sm font-semibold">Calculating "sunny" score:</p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="font-mono text-sm bg-card/80 rounded-lg p-3 text-center"
                    >
                      <p className="mb-2">
                        (0.9 × temp) + (0.8 × humid) + (0.7 × press) + 0.5
                      </p>
                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        className="text-success font-bold text-lg"
                      >
                        = 3.2 (Logit Score!)
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Logit bars */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3 w-full"
                  >
                    <p className="text-sm text-muted-foreground text-center font-semibold">All Logit Scores:</p>
                    {neuronWeights.map((item, index) => (
                      <motion.div
                        key={item.word}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <span className="font-mono text-sm w-16 text-right font-semibold">{item.word}</span>
                        <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${((item.result + 1) / (maxLogit + 1.5)) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.3 }}
                            className={`h-full rounded-full flex items-center justify-end pr-2 ${
                              item.result === maxLogit
                                ? "bg-gradient-to-r from-success to-success/80"
                                : item.result < 0
                                ? "bg-gradient-to-r from-destructive/60 to-destructive/40"
                                : "bg-gradient-to-r from-primary/70 to-primary/50"
                            }`}
                          />
                        </div>
                        <span className="font-mono text-sm w-12 font-bold">
                          {item.result > 0 ? "+" : ""}{item.result}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Key insight */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg w-full"
                  >
                    <p className="text-base text-foreground">
                      ✨ Higher logit = more confident! "sunny" wins with <strong>+3.2</strong>. Negative scores mean unlikely predictions.
                    </p>
                  </motion.div>
                )}

                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-center w-full"
                  >
                    <button onClick={handleReset} className="text-base text-primary hover:underline font-semibold">
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

export default LogitsAnimation;
