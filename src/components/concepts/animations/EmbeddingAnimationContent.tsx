import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Sphere } from "@react-three/drei";
import * as THREE from "three";

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
      const timeout = setTimeout(() => setScale(1), delay);
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
        <Text position={[position[0], position[1] + 0.6, position[2]]} fontSize={0.25} color="white" anchorX="center" anchorY="bottom">
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
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([-3, 0, 0, 3, 0, 0])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, -2, 0, 0, 2, 0])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, 0, -2, 0, 0, 2])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      {words.map((item, index) => (
        <WordPoint key={item.word} position={item.position} color={item.color} label={item.word} visible={step >= 3} delay={index * 400} />
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const EmbeddingAnimationContent = () => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const words = [
    { word: "King", vector: [0.8, 0.2, 0.9], color: "bg-primary" },
    { word: "Queen", vector: [0.7, 0.9, 0.85], color: "bg-accent" },
    { word: "Man", vector: [0.75, 0.1, 0.3], color: "bg-success" },
  ];

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback((startStep: number = 1) => {
    const delays = [500, 1000, 1000, 1000];
    let cumulativeDelay = 0;

    for (let i = startStep; i <= 4; i++) {
      cumulativeDelay += delays[i - 1] || 1000;
      const timeout = setTimeout(() => setStep(i), cumulativeDelay);
      timeoutsRef.current.push(timeout);
    }
  }, []);

  useEffect(() => {
    runAnimation(1);
    return () => clearAllTimeouts();
  }, [runAnimation, clearAllTimeouts]);

  const handlePause = () => {
    if (!isPaused) {
      clearAllTimeouts();
      setIsPaused(true);
    } else {
      setIsPaused(false);
      runAnimation(step + 1);
    }
  };

  const handleReset = () => {
    clearAllTimeouts();
    setStep(0);
    setIsPaused(false);
    runAnimation(1);
  };

  const isComplete = step >= 4;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isComplete && (
          <button onClick={handlePause} className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
            {isPaused ? <Play className="w-5 h-5 text-accent" /> : <Pause className="w-5 h-5 text-accent" />}
          </button>
        )}
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Words to embed */}
      <div className="grid grid-cols-3 gap-4">
        {words.map((item, index) => (
          <motion.div key={item.word} initial={{ opacity: 0, y: 20 }} animate={step >= 1 ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.3, duration: 0.6 }} className="text-center">
            <div className={`${item.color} text-primary-foreground px-4 py-3 rounded-xl font-bold text-lg mb-3 shadow-lg`}>{item.word}</div>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.2, duration: 0.5 }} className="text-3xl">
                ↓
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }} className="font-mono text-xs bg-muted p-3 rounded-xl mt-2 shadow-inner">
                [{item.vector.join(", ")}]
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 3D Vector space */}
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-4 h-64 shadow-inner">
          <p className="text-sm text-muted-foreground mb-2 text-center font-semibold">3D Vector Space (drag to rotate!):</p>
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D...</div>}>
            <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
              <VectorSpace step={step} />
            </Canvas>
          </Suspense>
        </motion.div>
      )}

      {/* Explanation */}
      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/40 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-base text-foreground">🎯 Similar words are <strong>close together</strong> in vector space!</p>
        </motion.div>
      )}
    </div>
  );
};

export default EmbeddingAnimationContent;
