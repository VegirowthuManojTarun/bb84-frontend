import { motion } from "framer-motion";
import { PhotonData } from "@/types/bb84";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PhotonProps {
  photon: PhotonData;
  onAnimationComplete?: () => void;
  speed: "slow" | "normal" | "fast";
}

const SPEED_MAP = {
  slow: 1.4,
  normal: 0.8,
  fast: 0.4,
};

export const Photon = ({ photon, onAnimationComplete, speed }: PhotonProps) => {
  const { bit, basis } = photon;
  
  // Get arrow component and color based on bit and basis
  const getPhotonArrow = () => {
    let ArrowComponent;
    let colorClass;
    let glowColor;

    // Determine arrow direction based on bit and basis
    if (basis === "+") {
      if (bit === 0) {
        ArrowComponent = ArrowUp; // ↑ vertical
        colorClass = "text-alice";
        glowColor = "hsl(var(--alice))";
      } else {
        ArrowComponent = ArrowRight; // → horizontal  
        colorClass = "text-warning";
        glowColor = "hsl(var(--warning))";
      }
    } else {
      if (bit === 0) {
        ArrowComponent = ArrowUpRight; // ↗ 45°
        colorClass = "text-destructive";
        glowColor = "hsl(var(--destructive))";
      } else {
        ArrowComponent = ArrowDownRight; // ↘ 135°
        colorClass = "text-success";
        glowColor = "hsl(var(--success))";
      }
    }

    return (
      <motion.div
        className={cn("relative", colorClass)}
        animate={{ 
          rotate: photon.isIntercepted ? [0, 15, -15, 0] : 0,
          filter: photon.isIntercepted 
            ? [`drop-shadow(0 0 16px ${glowColor}) drop-shadow(0 0 8px ${glowColor})`, `drop-shadow(0 0 20px hsl(var(--destructive))) drop-shadow(0 0 12px hsl(var(--eve)))`, `drop-shadow(0 0 16px ${glowColor}) drop-shadow(0 0 8px ${glowColor})`]
            : `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 6px ${glowColor})`
        }}
        transition={{ 
          rotate: photon.isIntercepted ? { duration: 0.3, repeat: 2 } : {},
          filter: { duration: 0.2 }
        }}
      >
        <ArrowComponent 
          className="w-8 h-8 md:w-10 md:h-10" 
          strokeWidth={3}
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`
          }}
        />
      </motion.div>
    );
  };

  return (
    <motion.div
      className="absolute"
      initial={{ 
        x: "0%", 
        opacity: 0, 
        scale: 0.8,
        y: "-50%"
      }}
      animate={{ 
        x: "100%", 
        opacity: 1, 
        scale: 1,
        backgroundColor: photon.isIntercepted ? "#ef4444" : undefined
      }}
      transition={{
        x: {
          duration: SPEED_MAP[speed],
          ease: "linear"
        },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        backgroundColor: photon.isIntercepted ? {
          duration: 0.2,
          repeat: 2,
          repeatType: "reverse"
        } : {}
      }}
      onAnimationComplete={onAnimationComplete}
      style={{
        top: "50%",
        left: 0,
        right: 0
      }}
    >
      {getPhotonArrow()}
      
      {/* Quantum shimmer trail effect */}
      <motion.div
        className="absolute inset-0 w-8 h-1 -left-6 top-1/2 -translate-y-1/2 opacity-40 blur-sm rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${
            basis === "+" 
              ? (bit === 0 ? "hsl(var(--alice))" : "hsl(var(--warning))") 
              : (bit === 0 ? "hsl(var(--destructive))" : "hsl(var(--success))")
          }40, transparent)`
        }}
        animate={{ 
          scaleX: [0.5, 1, 0.5],
          opacity: [0.2, 0.6, 0.2] 
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      
      {/* Quantum glow effect */}
      <motion.div
        className="absolute inset-0 -m-1 rounded-full pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 4px currentColor20",
            "0 0 8px currentColor40", 
            "0 0 4px currentColor20"
          ]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
};