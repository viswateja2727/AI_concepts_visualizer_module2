import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Play, Volume2, VolumeX, Pause, Zap } from "lucide-react";
import { useNarration } from "@/hooks/useNarration";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const TransformerAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [activeLayer, setActiveLayer] = useState(-1);
  const [showExample, setShowExample] = useState(false);
  const { speak, stop, togglePause, isSpeaking, isPaused } = useNarration();

  const inputText = "The cat sat";
  const tokens = ["The", "cat", "sat"];

  const layers = [
    { 
      name: "Embedding Layer", 
      description: "Convert words to numbers",
      example: "The → [0.2, 0.8, ...], cat → [0.9, 0.3, ...], sat → [0.5, 0.7, ...]",
      detail: "Each word becomes a vector of hundreds of numbers!"
    },
    { 
      name: "Self-Attention", 
      description: "Find word relationships",
      example: "'cat' pays attention to 'The' and 'sat' to understand context",
      detail: "The model learns that 'cat' is the subject doing the 'sitting'"
    },
    { 
      name: "Feed Forward", 
      description: "Transform each position",
      example: "Apply mathematical transformations to each word's numbers",
      detail: "Like a mini neural network for each word position"
    },
    { 
      name: "Layer Normalization", 
      description: "Stabilize the values",
      example: "Keep numbers in a good range: not too big, not too small",
      detail: "Prevents numbers from exploding or vanishing"
    },
    { 
      name: "Self-Attention (Layer 2)", 
      description: "Deeper understanding",
      example: "'sat' now understands it's about a cat sitting, not a chair",
      detail: "Multiple attention layers build richer understanding"
    },
    { 
      name: "Feed Forward (Layer 2)", 
      description: "More transformations",
      example: "Combine all the learned relationships",
      detail: "The model is getting closer to understanding"
    },
    { 
      name: "Output Layer", 
      description: "Generate predictions",
      example: "Predict next word: 'on', 'down', 'quietly' with different scores",
      detail: "Finally ready to suggest what comes next!"
    },
  ];

  const narrations = [
    "Let's explore transformer layers! Transformers are the building blocks of modern AI like ChatGPT.",
    `We'll process the sentence: "${inputText}". Watch as it flows through each layer.`,
    "First, the embedding layer converts each word into a list of numbers.",
    "Now self-attention! Each word looks at other words to understand relationships. 'Cat' pays attention to 'The' and 'sat'.",
    "The feed forward layer applies math transformations to refine the understanding.",
    "Layer normalization keeps all numbers stable and balanced.",
    "Another round of self-attention for deeper understanding!",
    "More feed forward processing to combine everything we've learned.",
    "Finally, the output layer predicts what word might come next! Data flowed through 7 layers. Real AI models have 32 to 128 layers!"
  ];

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const handleStart = () => {
    setIsStarted(true);
    setActiveLayer(-1);
    setShowExample(false);
    
    speak(narrations[0], () => {
      setTimeout(() => {
        speak(narrations[1], () => {
          setShowExample(true);
          let current = -1;
          
          const processNextLayer = () => {
            current++;
            setActiveLayer(current);
            
            if (current < layers.length) {
              setTimeout(() => {
                speak(narrations[current + 2], () => {
                  setTimeout(processNextLayer, 1500);
                });
              }, 800);
            }
          };
          
          setTimeout(processNextLayer, 1000);
        });
      }, 500);
    });
  };

  const handleReset = () => {
    stop();
    setIsStarted(false);
    setActiveLayer(-1);
    setShowExample(false);
  };

  return (
    <motion.div 
      className="concept-card relative overflow-hidden"
      layout
    >
      <FloatingDecorations variant="shapes" count={4} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
            <Layers className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Transformer Layers</h3>
            <p className="text-muted-foreground text-sm">Processing blocks in neural networks</p>
          </div>
          
          {!isStarted ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Start Processing
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={togglePause}
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
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl max-h-[500px] overflow-y-auto">
                {/* Input tokens */}
                {showExample && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center w-full"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Input:</p>
                    <div className="inline-flex items-center gap-2 bg-muted px-4 py-3 rounded-xl shadow-lg">
                      {tokens.map((token, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-mono text-sm"
                        >
                          {token}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Layers */}
                <div className="relative space-y-3 w-full">
                  {layers.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0.3, x: -20 }}
                      animate={{
                        opacity: activeLayer >= index ? 1 : 0.3,
                        x: activeLayer >= index ? 0 : -10,
                        scale: activeLayer === index ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        activeLayer >= index
                          ? "bg-gradient-to-r from-primary/15 to-primary/5 border-primary/40 shadow-lg"
                          : "bg-muted/30 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Layer number */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            activeLayer >= index
                              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Layer info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{layer.name}</p>
                          <p className="text-xs text-muted-foreground">{layer.description}</p>
                          
                          {/* Example for active layer */}
                          {activeLayer === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.5 }}
                              className="mt-3 bg-card/80 rounded-lg p-3 border border-primary/20"
                            >
                              <div className="flex items-start gap-2">
                                <Zap className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-mono text-foreground">{layer.example}</p>
                                  <p className="text-xs text-muted-foreground mt-1 italic">{layer.detail}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Status indicator */}
                        {activeLayer === index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-success rounded-full animate-pulse shadow-lg flex-shrink-0"
                          />
                        )}

                        {activeLayer > index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-success text-lg flex-shrink-0"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>

                      {/* Connection line */}
                      {index < layers.length - 1 && (
                        <div
                          className={`absolute left-[1.9rem] top-full w-1 h-3 transition-colors rounded-full ${
                            activeLayer > index ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Output */}
                {activeLayer >= layers.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4 w-full"
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-success/20 border-2 border-success/40 px-6 py-3 rounded-xl shadow-lg">
                        <span className="text-sm font-semibold">Output:</span>
                        <span className="font-mono text-sm font-bold text-success">Predictions ready!</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
                      <p className="text-base text-foreground">
                        🧠 Data flows through <strong>7 layers</strong>, each adding more understanding. 
                        Modern AI models have <strong>32-128+ layers</strong>!
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

export default TransformerAnimation;
