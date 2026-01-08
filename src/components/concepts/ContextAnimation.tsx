import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Play } from "lucide-react";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

const ContextAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const conversation = [
    { role: "user", text: "My name is Alex" },
    { role: "ai", text: "Nice to meet you, Alex!" },
    { role: "user", text: "What's my name?" },
    { role: "ai", text: "Your name is Alex! (I remember from our conversation)" },
  ];

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    setStep(0);
    timeoutsRef.current = [];
    
    const delays = [500, 1500, 2500, 3500, 4500, 5500];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => setStep(i + 1), delay);
      timeoutsRef.current.push(t);
    });
  };

  const handleReset = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    setIsStarted(false);
    setStep(0);
  };

  return (
    <motion.div className="concept-card relative overflow-hidden" layout>
      <FloatingDecorations variant="bubbles" count={6} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Context</h3>
            <p className="text-muted-foreground text-sm">AI's conversation memory</p>
          </div>
          
          {!isStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Start Conversation
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
              <div className="animation-container flex-col gap-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl">
                {/* Chat messages */}
                <div className="space-y-3 w-full max-h-[250px] overflow-auto">
                  {conversation.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={step >= index + 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                      transition={{ duration: 0.5 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none border-2 border-border"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Context visualization */}
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 w-full"
                  >
                    <p className="text-xs text-muted-foreground mb-2 text-center">
                      What AI sees (the context):
                    </p>
                    <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1 shadow-inner">
                      {conversation.slice(0, -1).map((msg, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.15 }}
                          className={msg.role === "user" ? "text-primary" : "text-muted-foreground"}
                        >
                          [{msg.role}]: {msg.text}
                        </motion.p>
                      ))}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-primary"
                      >
                        [user]: What's my name? ← <span className="text-success font-bold">Current</span>
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {/* Explanation */}
                {step >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3 w-full"
                  >
                    <div className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
                      <p className="text-base text-foreground">
                        💭 Context = <strong>all previous messages</strong> sent to the AI. 
                        This is how it "remembers" your conversation!
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

export default ContextAnimation;
