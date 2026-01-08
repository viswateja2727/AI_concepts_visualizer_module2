import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Lightbulb } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  fullDescription: string;
  examples: string[];
  animationComponent: ReactNode;
}

const ConceptModal = ({
  isOpen,
  onClose,
  title,
  category,
  icon: Icon,
  iconColor,
  iconBgColor,
  fullDescription,
  examples,
  animationComponent,
}: ConceptModalProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  const handleClose = () => {
    setShowAnimation(false);
    onClose();
  };

  const handleStartLearning = () => {
    setShowAnimation(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl max-h-[90vh] bg-card rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-border flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground">{category}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {!showAnimation ? (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    {/* Decorative circles */}
                    <div className="absolute top-20 right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-32 left-4 w-20 h-20 bg-success/10 rounded-full blur-2xl" />

                    {/* Center icon */}
                    <div className="flex flex-col items-center text-center relative z-10 py-8">
                      <div
                        className={`w-20 h-20 rounded-2xl ${iconBgColor} flex items-center justify-center mb-6`}
                      >
                        <Icon className={`w-10 h-10 ${iconColor}`} />
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Ready to learn about {title}?
                      </h3>

                      <p className="text-muted-foreground max-w-md mb-8">
                        {fullDescription}
                      </p>

                      <motion.button
                        onClick={handleStartLearning}
                        className="btn-start flex items-center gap-2 px-8 py-3 text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="w-5 h-5" />
                        Start Learning
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="animation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    {animationComponent}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Examples footer */}
            <div className="p-4 bg-muted/30 border-t border-border flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">
                  Real-world examples:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <span
                    key={index}
                    className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-muted-foreground"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConceptModal;
