import { motion } from "framer-motion";
import { QubitData } from "@/types/bb84";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface AlicePanelProps {
  qubits: QubitData[];
  currentRound: number;
  isActive: boolean;
}

export const AlicePanel = ({ qubits, currentRound, isActive }: AlicePanelProps) => {
  return (
    <Card className="h-full glass border-alice/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-alice">
          <User className="w-5 h-5" />
          Alice
          <Badge variant="outline" className="border-alice/50 text-alice">
            Sender
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Quantum State Preparation
        </div>
        
        {/* Current qubit info */}
        {qubits.length > 0 && currentRound < qubits.length && (
          <div className="p-3 bg-alice/5 border border-alice/20 rounded-lg">
            <div className="text-sm font-medium text-alice mb-2">
              Current Qubit (Round {currentRound + 1})
            </div>
            <div className="space-y-2 text-sm">
              <div>Bit Value: <span className="font-mono">{qubits[currentRound]?.bit}</span></div>
              <div>Basis: <span className="font-mono">
                {qubits[currentRound]?.basis} ({qubits[currentRound]?.basis === "+" ? "Rectilinear" : "Diagonal"})
              </span></div>
              <div>Polarization: <span className="font-mono">
                {qubits[currentRound]?.basis === "+" 
                  ? (qubits[currentRound]?.bit === 0 ? "↑ Vertical" : "→ Horizontal")
                  : (qubits[currentRound]?.bit === 0 ? "↗ 45°" : "↘ 135°")
                }
              </span></div>
            </div>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Progress: {Math.min(currentRound + (isActive ? 1 : 0), qubits.length)}/{qubits.length} qubits
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <motion.div 
              className="bg-alice h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${(Math.min(currentRound + (isActive ? 1 : 0), qubits.length) / Math.max(qubits.length, 1)) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {qubits.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Arrows show photon polarization states</div>
            <div>+ basis: ↑↓ (vertical/horizontal)</div>
            <div>× basis: ↗↘ (diagonal orientations)</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};