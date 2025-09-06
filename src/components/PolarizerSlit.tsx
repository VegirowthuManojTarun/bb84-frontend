import { motion } from "framer-motion";
import { Basis } from "@/types/bb84";
import { cn } from "@/lib/utils";

interface PolarizerSlitProps {
  basis: Basis | null;
  position: "alice" | "bob" | "eve";
  isActive: boolean;
  className?: string;
}

export const PolarizerSlit = ({ 
  basis, 
  position, 
  isActive, 
  className 
}: PolarizerSlitProps) => {
  // Get rotation based on basis
  const getRotation = () => {
    if (!basis) return 0;
    if (basis === "+") return 0; // Vertical/horizontal
    return 45; // Diagonal for x basis
  };

  // Get color based on position
  const getColor = () => {
    switch (position) {
      case "alice":
        return "bg-alice";
      case "bob":
        return "bg-bob";
      case "eve":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Slit housing */}
      <div className="w-8 h-12 bg-muted border-2 border-border rounded-sm flex items-center justify-center">
        {/* Polarizer lines */}
        <motion.div
          className="relative w-6 h-6"
          animate={{ 
            rotate: getRotation(),
            scale: isActive ? 1.1 : 1 
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Multiple lines to show polarization */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-full h-0.5 rounded-full",
                getColor(),
                isActive ? "opacity-100" : "opacity-50"
              )}
              style={{
                top: `${20 + i * 15}%`,
                left: 0,
              }}
              animate={{
                opacity: isActive ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{
                duration: 1,
                repeat: isActive ? Infinity : 0,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Basis label */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono bg-background/80 px-1 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: basis ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {basis || "?"}
      </motion.div>

      {/* Activity indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
};