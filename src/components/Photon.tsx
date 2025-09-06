import { motion } from "framer-motion";
import { PhotonData, Basis } from "@/types/bb84";
import { cn } from "@/lib/utils";

interface PhotonProps {
  photon: PhotonData;
  onAnimationComplete?: () => void;
  speed: "slow" | "normal" | "fast";
  aliceBasis?: Basis | null;
  bobBasis?: Basis | null;
  eveBasis?: Basis | null;
  eveEnabled?: boolean;
}

const SPEED_MAP = {
  slow: 1.4,
  normal: 0.8,
  fast: 0.4,
};

export const Photon = ({ 
  photon, 
  onAnimationComplete, 
  speed, 
  aliceBasis, 
  bobBasis, 
  eveBasis, 
  eveEnabled = false 
}: PhotonProps) => {
  const { bit, basis } = photon;
  
  // Get photon arrow based on bit and basis
  const getPhotonArrow = () => {
    let direction = "";
    let rotation = 0;
    
    if (basis === "+") {
      direction = bit === 0 ? "↑" : "→";
      rotation = bit === 0 ? 0 : 90;
    } else {
      direction = bit === 0 ? "↗" : "↘";
      rotation = bit === 0 ? 45 : 135;
    }

    return (
      <div 
        className={cn(
          "text-2xl font-bold select-none leading-none flex items-center justify-center",
          "drop-shadow-lg filter",
          basis === "+" ? (bit === 0 ? "text-blue-400" : "text-yellow-400") : (bit === 0 ? "text-red-400" : "text-green-400")
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {direction}
      </div>
    );
  };

  return (
    <motion.div
      className="absolute w-8 h-8 flex items-center justify-center"
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
      }}
      transition={{
        x: {
          duration: SPEED_MAP[speed],
          ease: "linear"
        },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      onAnimationComplete={onAnimationComplete}
      style={{
        top: "50%",
        left: 0,
        right: 0
      }}
    >
      {/* Main photon arrow with glow effect */}
      <motion.div
        className="relative"
        animate={{
          filter: photon.isIntercepted 
            ? ["drop-shadow(0 0 8px #ef4444)", "drop-shadow(0 0 4px #ef4444)", "drop-shadow(0 0 8px #ef4444)"]
            : "drop-shadow(0 0 4px currentColor)"
        }}
        transition={{
          filter: photon.isIntercepted ? {
            duration: 0.3,
            repeat: 2,
            repeatType: "reverse"
          } : {}
        }}
      >
        {getPhotonArrow()}
      </motion.div>

      {/* Photon trail effect */}
      <motion.div
        className={cn(
          "absolute w-12 h-1 -left-8 top-1/2 -translate-y-1/2 opacity-40 blur-sm rounded-full",
          basis === "+" ? (bit === 0 ? "bg-blue-400" : "bg-yellow-400") : (bit === 0 ? "bg-red-400" : "bg-green-400")
        )}
        animate={{ 
          scaleX: [0.3, 1, 0.3],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.div>
  );
};