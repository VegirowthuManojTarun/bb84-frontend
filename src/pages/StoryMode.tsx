import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { HackathonFooter } from "@/components/HackathonFooter";
import { ArrowUp, ArrowRight, ArrowUpRight, ArrowDownRight, Play, SkipForward, SkipBack, RotateCw } from "lucide-react";

type AnimationStep = 
  | "intro"
  | "alice-encodes" 
  | "photon-travels"
  | "eve-intercepts"
  | "bob-measures"
  | "classical-discussion"
  | "key-extraction";

interface PhotonState {
  bit: 0 | 1;
  basis: "+" | "x";
  isIntercepted: boolean;
  position: number; // 0 to 100
}

export default function StoryMode() {
  const [currentStep, setCurrentStep] = useState<AnimationStep>("intro");
  const [eveEnabled, setEveEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [photon, setPhoton] = useState<PhotonState | null>(null);
  const [aliceBases, setAliceBases] = useState<string>("");
  const [bobBases, setBobBases] = useState<string>("");
  const [matchingBases, setMatchingBases] = useState<boolean[]>([]);

  const steps: AnimationStep[] = [
    "intro",
    "alice-encodes", 
    "photon-travels",
    ...(eveEnabled ? ["eve-intercepts" as const] : []),
    "bob-measures",
    "classical-discussion",
    "key-extraction"
  ];

  const stepTexts = {
    intro: "Welcome to the BB84 Quantum Key Distribution Protocol! Let's see how Alice and Bob can share a secret key securely.",
    "alice-encodes": "Alice generates random bits and encodes them into photons using random polarization bases (+ or ×).",
    "photon-travels": "The encoded photon travels through the quantum channel towards Bob.",
    "eve-intercepts": "Eve intercepts the photon! She measures it with her own random basis, potentially disturbing it.",
    "bob-measures": "Bob measures the photon with his own randomly chosen basis. If it matches Alice's, he gets the correct bit.",
    "classical-discussion": "Alice and Bob publicly compare their measurement bases over a classical channel.",
    "key-extraction": eveEnabled 
      ? "High error rate detected! Eve's interference is revealed. In practice, they would abort or use error correction."
      : "Perfect match! Alice and Bob now share a secure key that no one else knows."
  };

  const getPhotonArrow = (bit: 0 | 1, basis: "+" | "x") => {
    if (basis === "+") {
      return bit === 0 ? ArrowUp : ArrowRight;
    } else {
      return bit === 0 ? ArrowUpRight : ArrowDownRight;
    }
  };

  const getPhotonColor = (bit: 0 | 1, basis: "+" | "x") => {
    if (basis === "+") {
      return bit === 0 ? "text-blue-400" : "text-green-400";
    } else {
      return bit === 0 ? "text-purple-400" : "text-orange-400";
    }
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const playAnimation = async () => {
    setIsPlaying(true);
    setCurrentStep("intro");
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setCurrentStep("intro");
    setPhoton(null);
    setAliceBases("");
    setBobBases("");
    setMatchingBases([]);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (currentStep === "alice-encodes") {
      setPhoton({
        bit: Math.random() > 0.5 ? 1 : 0,
        basis: Math.random() > 0.5 ? "x" : "+",
        isIntercepted: false,
        position: 0
      });
    }

    if (currentStep === "photon-travels" && photon) {
      const interval = setInterval(() => {
        setPhoton(prev => prev ? { ...prev, position: Math.min(prev.position + 2, 100) } : null);
      }, 50);
      return () => clearInterval(interval);
    }

    if (currentStep === "eve-intercepts" && photon && eveEnabled) {
      setTimeout(() => {
        setPhoton(prev => prev ? { 
          ...prev, 
          isIntercepted: true,
          bit: Math.random() > 0.5 ? 1 : 0, // Random bit after wrong measurement
          position: 50 
        } : null);
      }, 500);
    }

    if (currentStep === "classical-discussion") {
      const alice = "+×+×+";
      const bob = "×+×+×";
      setAliceBases(alice);
      setBobBases(bob);
      setMatchingBases(alice.split('').map((a, i) => a === bob[i]));
    }
  }, [currentStep, photon, eveEnabled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            BB84 Story Mode
          </h1>
          <p className="text-xl text-muted-foreground">
            How Quantum Key Distribution Works
          </p>
        </motion.div>

        {/* Main Animation Stage */}
        <Card className="p-8 mb-8 bg-card/50 backdrop-blur">
          <div className="relative h-80 w-full">
            {/* Alice */}
            <motion.div 
              className="absolute left-8 top-1/2 -translate-y-1/2 text-center"
              animate={{ scale: currentStep === "alice-encodes" ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl mb-2">👩‍💻</div>
              <div className="text-sm font-medium text-foreground">Alice</div>
              {currentStep === "alice-encodes" && photon && (
                <motion.div
                  className="mt-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const ArrowComponent = getPhotonArrow(photon.bit, photon.basis);
                    return (
                      <ArrowComponent 
                        className={`w-6 h-6 mx-auto ${getPhotonColor(photon.bit, photon.basis)}`}
                      />
                    );
                  })()}
                  <div className="text-xs text-muted-foreground">
                    Bit: {photon.bit}, Basis: {photon.basis}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Bob */}
            <motion.div 
              className="absolute right-8 top-1/2 -translate-y-1/2 text-center"
              animate={{ scale: currentStep === "bob-measures" ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl mb-2">👨‍💻</div>
              <div className="text-sm font-medium text-foreground">Bob</div>
            </motion.div>

            {/* Eve */}
            {eveEnabled && (
              <motion.div 
                className="absolute top-4 left-1/2 -translate-x-1/2 text-center"
                animate={{ 
                  scale: currentStep === "eve-intercepts" ? 1.2 : 1,
                  y: currentStep === "eve-intercepts" ? 10 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-1">🕵️‍♀️</div>
                <div className="text-xs font-medium text-destructive">Eve</div>
              </motion.div>
            )}

            {/* Quantum Channel */}
            <div className="absolute top-1/2 left-20 right-20 -translate-y-1/2">
              <motion.div 
                className="h-1 bg-gradient-to-r from-primary via-primary-glow to-primary rounded-full"
                animate={{ 
                  boxShadow: [
                    "0 0 10px hsl(var(--primary))",
                    "0 0 20px hsl(var(--primary))",
                    "0 0 10px hsl(var(--primary))"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="text-xs text-center mt-1 text-muted-foreground">
                Quantum Channel
              </div>
            </div>

            {/* Classical Channel */}
            <div className="absolute top-3/4 left-20 right-20 -translate-y-1/2">
              <div className="h-0.5 border-t-2 border-dashed border-muted-foreground/50" />
              <div className="text-xs text-center mt-1 text-muted-foreground">
                Classical Channel
              </div>
            </div>

            {/* Traveling Photon */}
            <AnimatePresence>
              {photon && currentStep !== "intro" && (
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${20 + (photon.position * 0.6)}%` }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    rotate: photon.isIntercepted ? [0, 15, -15, 0] : 0
                  }}
                  exit={{ scale: 0 }}
                  transition={{ 
                    scale: { duration: 0.2 },
                    rotate: photon.isIntercepted ? { duration: 0.3, repeat: 2 } : {}
                  }}
                >
                  {(() => {
                    const ArrowComponent = getPhotonArrow(photon.bit, photon.basis);
                    return (
                      <div className="relative">
                        <ArrowComponent 
                          className={`w-8 h-8 ${getPhotonColor(photon.bit, photon.basis)} drop-shadow-lg`}
                        />
                        {/* Glow effect */}
                        <motion.div
                          className="absolute inset-0 -m-1 rounded-full"
                          animate={{
                            boxShadow: [
                              "0 0 8px currentColor",
                              "0 0 16px currentColor",
                              "0 0 8px currentColor"
                            ]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Speech Bubbles for Classical Discussion */}
            {currentStep === "classical-discussion" && (
              <>
                <motion.div 
                  className="absolute left-8 bottom-16 bg-card border rounded-lg p-2 max-w-32"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xs text-foreground">My bases:</div>
                  <div className="font-mono text-sm">{aliceBases}</div>
                </motion.div>

                <motion.div 
                  className="absolute right-8 bottom-16 bg-card border rounded-lg p-2 max-w-32"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="text-xs text-foreground">My bases:</div>
                  <div className="font-mono text-sm">{bobBases}</div>
                </motion.div>

                <motion.div 
                  className="absolute left-1/2 bottom-8 -translate-x-1/2 bg-card border rounded-lg p-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="text-xs text-foreground mb-1">Matching bases:</div>
                  <div className="flex gap-1">
                    {matchingBases.map((match, i) => (
                      <div 
                        key={i}
                        className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                          match ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Final Key Display */}
            {currentStep === "key-extraction" && (
              <motion.div 
                className="absolute left-1/2 top-1/4 -translate-x-1/2 bg-card border rounded-lg p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {eveEnabled ? (
                  <div className="text-destructive">
                    <div className="text-2xl mb-2">⚠️</div>
                    <div className="text-sm font-medium">High Error Rate!</div>
                    <div className="text-xs">Possible eavesdropping detected</div>
                  </div>
                ) : (
                  <div className="text-success">
                    <div className="text-2xl mb-2">🔒</div>
                    <div className="text-sm font-medium">Secure Key Established!</div>
                    <div className="text-xs font-mono">10110100</div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </Card>

        {/* Narration Text */}
        <Card className="p-6 mb-6 bg-card/50 backdrop-blur">
          <motion.p 
            className="text-center text-foreground text-lg leading-relaxed"
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {stepTexts[currentStep]}
          </motion.p>
        </Card>

        {/* Controls */}
        <Card className="p-6 bg-card/50 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={playAnimation}
                disabled={isPlaying}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                {isPlaying ? "Playing..." : "Play Animation"}
              </Button>
              
              <Button
                onClick={resetAnimation}
                variant="outline"
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={prevStep}
                variant="outline"
                size="sm"
                disabled={steps.indexOf(currentStep) === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground px-2">
                {steps.indexOf(currentStep) + 1} / {steps.length}
              </span>
              
              <Button
                onClick={nextStep}
                variant="outline"
                size="sm"
                disabled={steps.indexOf(currentStep) === steps.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Eve Toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="eve-toggle"
                checked={eveEnabled}
                onCheckedChange={(checked) => {
                  setEveEnabled(checked as boolean);
                  resetAnimation();
                }}
              />
              <label htmlFor="eve-toggle" className="text-sm text-foreground">
                Enable Eve (Eavesdropper)
              </label>
            </div>
          </div>
        </Card>
      </main>

      <HackathonFooter />
    </div>
  );
}