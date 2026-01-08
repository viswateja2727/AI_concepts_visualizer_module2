import { motion } from "framer-motion";

interface FloatingDecorationsProps {
  variant?: "stars" | "bubbles" | "shapes" | "clouds" | "mixed";
  count?: number;
}

const FloatingDecorations = ({ variant = "mixed", count = 8 }: FloatingDecorationsProps) => {
  const decorations = Array.from({ length: count }, (_, i) => i);

  const colors = [
    "bg-primary/15",
    "bg-accent/15", 
    "bg-success/15",
    "bg-warning/15",
    "bg-primary/10",
    "bg-accent/10",
    "bg-success/10",
    "bg-warning/10"
  ];
  
  const positions = [
    { top: "5%", left: "3%" },
    { top: "15%", right: "5%" },
    { bottom: "10%", left: "8%" },
    { bottom: "20%", right: "3%" },
    { top: "35%", left: "2%" },
    { top: "55%", right: "4%" },
    { top: "75%", left: "5%" },
    { bottom: "5%", right: "8%" },
  ];

  const sizes = ["w-6 h-6", "w-8 h-8", "w-5 h-5", "w-10 h-10", "w-7 h-7", "w-4 h-4", "w-9 h-9", "w-6 h-6"];

  const getShape = (index: number) => {
    const shapeType = index % 6;
    const color = colors[index % colors.length];
    const size = sizes[index % sizes.length];
    const position = positions[index % positions.length];
    const delay = index * 0.3;
    const duration = 5 + (index % 4);

    // Star
    if (shapeType === 0 || variant === "stars") {
      return (
        <motion.div
          key={index}
          className={`absolute ${size}`}
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-warning/50">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      );
    }

    // Circle/Bubble
    if (shapeType === 1 || variant === "bubbles") {
      return (
        <motion.div
          key={index}
          className={`absolute ${size} rounded-full ${color} backdrop-blur-sm border border-white/20`}
          style={position}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            y: [-5, -20, -5],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay
          }}
        />
      );
    }

    // Cloud
    if (shapeType === 2 || variant === "clouds") {
      return (
        <motion.div
          key={index}
          className="absolute"
          style={position}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            x: [-10, 15, -10]
          }}
          transition={{
            duration: duration + 3,
            repeat: Infinity,
            delay
          }}
        >
          <svg className={`${size} text-white/30`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </motion.div>
      );
    }

    // Heart
    if (shapeType === 3) {
      return (
        <motion.div
          key={index}
          className={`absolute ${size}`}
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-accent/40">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      );
    }

    // Diamond
    if (shapeType === 4) {
      return (
        <motion.div
          key={index}
          className={`absolute ${size} ${color} rotate-45 rounded-lg backdrop-blur-sm`}
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
            rotate: [45, 135, 45]
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay
          }}
        />
      );
    }

    // Triangle
    return (
      <motion.div
        key={index}
        className="absolute"
        style={position}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.15, 1],
          rotate: [0, 30, 0]
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay
        }}
      >
        <svg className={`${size} text-success/40`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      </motion.div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {decorations.map(getShape)}
    </div>
  );
};

export default FloatingDecorations;
