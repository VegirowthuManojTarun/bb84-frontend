import { motion } from "framer-motion";
import { Basis, Bit } from "@/types/bb84";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Check, X } from "lucide-react";

interface BobPanelProps {
  bases: Basis[];
  measurements: (Bit | null)[];
  aliceBases: Basis[];
  currentRound: number;
  isActive: boolean;
  onBasisChoice?: (basis: Basis) => void;
  isManualMode?: boolean;
}

export const BobPanel = ({
  bases,
  measurements,
  aliceBases,
  currentRound,
  isActive,
  onBasisChoice,
  isManualMode = false,
}: BobPanelProps) => {
  const basesMatch = (index: number) => {
    return (
      aliceBases[index] && bases[index] && aliceBases[index] === bases[index]
    );
  };

  return (
    <Card className="h-full glass border-bob/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-bob">
          <User className="w-5 h-5" />
          Bob
          <Badge variant="outline" className="border-bob/50 text-bob">
            Receiver
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Quantum Measurement
        </div>

        {/* Manual basis selection for current round */}
        {isManualMode && isActive && currentRound < bases.length && (
          <div className="p-3 border border-bob/30 rounded-lg bg-bob/5">
            <div className="text-sm font-medium mb-2">
              Choose basis for round {currentRound + 1}:
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBasisChoice?.("+")}
                className="border-bob/50 hover:bg-bob/10"
              >
                + (Rectilinear)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBasisChoice?.("x")}
                className="border-bob/50 hover:bg-bob/10"
              >
                × (Diagonal)
              </Button>
            </div>
          </div>
        )}

        {/* Current measurement info */}
        {bases.length > 0 && currentRound < bases.length && (
          <div className="p-3 bg-bob/5 border border-bob/20 rounded-lg">
            <div className="text-sm font-medium text-bob mb-2">
              Current Measurement (Round {currentRound + 1})
            </div>
            <div className="space-y-2 text-sm">
              <div>Chosen Basis: <span className="font-mono">
                {bases[currentRound]} ({bases[currentRound] === "+" ? "Rectilinear" : "Diagonal"})
              </span></div>
              {measurements[currentRound] !== null && (
                <div>Measured Bit: <span className="font-mono">{measurements[currentRound]}</span></div>
              )}
              {aliceBases[currentRound] && (
                <div className={`font-medium ${
                  basesMatch(currentRound) ? "text-green-600" : "text-red-600"
                }`}>
                  {basesMatch(currentRound) ? "✓ Basis Match" : "✗ Basis Mismatch"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Measured: {measurements.filter(m => m !== null).length}/{bases.length} photons
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <motion.div 
              className="bg-bob h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${(measurements.filter(m => m !== null).length / Math.max(bases.length, 1)) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {bases.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Polarizer filters incoming photons</div>
            <div>Correct basis → reliable measurement</div>
            <div>Wrong basis → random result</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
