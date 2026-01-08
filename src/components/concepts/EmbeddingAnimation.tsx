import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Binary, Play } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Sphere } from "@react-three/drei";
import * as THREE from "three";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

interface WordPointProps {
  position: [number, number, number];
  color: string;
  label: string;
  visible: boolean;
  delay: number;
}

const WordPoint = ({ position, color, label, visible, delay }: WordPointProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setScale(1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [visible, delay]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[0.3, 32, 32]} position={position} scale={scale}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Sphere>
      {scale > 0 && (
        <Text
          position={[position[0], position[1] + 0.6, position[2]]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="bottom"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const VectorSpace = ({ step }: { step: number }) => {
  const words = [
    { word: "King", position: [1.5, 1, 0] as [number, number, number], color: "#3b82f6" },
    { word: "Queen", position: [1.2, 0.8, 0.5] as [number, number, number], color: "#ec4899" },
    { word: "Man", position: [1, -0.5, -0.3] as [number, number, number], color: "#22c55e" },
    { word: "Woman", position: [0.7, -0.3, 0.2] as [number, number, number], color: "#f59e0b" },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Axes */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-3, 0, 0, 3, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -2, 0, 0, 2, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -2, 0, 0, 2])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>

      {words.map((item, index) => (
        <WordPoint
          key={item.word}
          position={item.position}
          color={item.color}
          label={item.word}
          visible={step >= 3}
          delay={index * 400}
        />
      ))}

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const EmbeddingAnimation = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const words = [
    { word: "King", vector: [0.8, 0.2, 0.9], color: "bg-primary" },
    { word: "Queen", vector: [0.7, 0.9, 0.85], color: "bg-accent" },
    { word: "Man", vector: [0.75, 0.1, 0.3], color: "bg-success" },
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
    
    const delays = [500, 1500, 2500, 3500];
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
    <motion.div 
      className="concept-card relative overflow-hidden"
      layout
    >
      <FloatingDecorations variant="bubbles" count={5} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shadow-lg">
            <Binary className="w-7 h-7 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">Embedding</h3>
            <p className="text-muted-foreground text-sm">Turning words into numbers</p>
          </div>
          
          {!isStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleStart}
              className="btn-start flex items-center gap-2 text-sm px-4 py-2"
            >
              <Play className="w-4 h-4" />
              Start Embedding
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
              className="space-y-6"
            >
              <div className="animation-container flex-col gap-6 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-2xl">
                {/* Words to embed */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  {words.map((item, index) => (
                    <motion.div
                      key={item.word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.3, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className={`${item.color} text-primary-foreground px-4 py-3 rounded-xl font-bold text-lg mb-3 shadow-lg`}>
                        {item.word}
                      </div>
                      
                      {step >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2, duration: 0.5 }}
                          className="text-3xl"
                        >
                          ↓
                        </motion.div>
                      )}

                      {step >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                          className="font-mono text-xs bg-muted p-3 rounded-xl mt-2 shadow-inner"
                        >
                          [{item.vector.join(", ")}]
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* 3D Vector space visualization */}
                {step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-4 h-64 shadow-inner w-full"
                  >
                    <p className="text-sm text-muted-foreground mb-2 text-center font-semibold">
                      3D Vector Space (drag to rotate!):
                    </p>
                    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D...</div>}>
                      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
                        <VectorSpace step={step} />
                      </Canvas>
                    </Suspense>
                  </motion.div>
                )}

                {/* Explanation */}
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg w-full"
                  >
                    <p className="text-base text-foreground">
                      🎯 Similar words are <strong>close together</strong> in vector space! "King" and "Queen" are near each other because they share royal meanings.
                    </p>
                  </motion.div>
                )}

                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
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

export default EmbeddingAnimation;
