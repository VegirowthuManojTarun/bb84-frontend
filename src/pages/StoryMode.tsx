import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { HackathonFooter } from "@/components/HackathonFooter";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Users,
  MessageSquare,
  Lock,
  Key,
  Shield,
  Eye,
  Zap,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const STORY_SCENES = [
  {
    id: "problem",
    title: "The Problem: Insecure Communication",
    narration: "Without security, Eve can listen to or tamper with messages between Alice and Bob.",
    duration: 4000
  },
  {
    id: "symmetric",
    title: "Symmetric Cryptography",
    narration: "Symmetric cryptography works with shared keys, but how do they share the key securely?",
    duration: 4000
  },
  {
    id: "asymmetric",
    title: "Asymmetric Cryptography",
    narration: "Asymmetric cryptography uses public/private keys but is vulnerable to quantum computers.",
    duration: 4000
  },
  {
    id: "bb84-intro",
    title: "Enter BB84",
    narration: "BB84 uses quantum mechanics to send random photons as bits with quantum security.",
    duration: 4000
  },
  {
    id: "photon-transmission",
    title: "Photon Transmission",
    narration: "Alice sends photons in random bases across the quantum channel to Bob.",
    duration: 5000
  },
  {
    id: "eve-interception",
    title: "Eve's Interception",
    narration: "If Eve tries to measure photons, she disturbs their quantum state.",
    duration: 4000
  },
  {
    id: "bob-measures",
    title: "Bob Measures",
    narration: "Bob chooses random bases to measure incoming photons from Alice.",
    duration: 4000
  },
  {
    id: "basis-comparison",
    title: "Classical Channel Comparison",
    narration: "Alice and Bob compare only their bases (not bits) over a public channel.",
    duration: 4000
  },
  {
    id: "error-detection",
    title: "Error Detection",
    narration: "Too many mismatches reveal Eve's presence; low errors mean the channel is secure.",
    duration: 4000
  },
  {
    id: "shared-key",
    title: "Final Shared Key",
    narration: "Alice and Bob now have an identical secure key for encrypted communication.",
    duration: 4000
  },
  {
    id: "conclusion",
    title: "BB84 = Quantum-Safe Key Distribution",
    narration: "BB84 provides secure, detects eavesdropping, and is quantum-safe cryptography.",
    duration: 4000
  }
];

export const StoryMode = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eveEnabled, setEveEnabled] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [photons, setPhotons] = useState<Array<{id: number, bit: number, basis: string, position: number}>>([]);

  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isPlaying || !hasStarted) return;
    
    const timer = setTimeout(() => {
      if (currentScene < STORY_SCENES.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, STORY_SCENES[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying, hasStarted]);

  // Generate photons for transmission scenes
  useEffect(() => {
    if (currentScene === 4 && isPlaying) { // photon-transmission scene
      const newPhotons = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        bit: Math.random() > 0.5 ? 1 : 0,
        basis: Math.random() > 0.5 ? "+" : "x",
        position: 0
      }));
      setPhotons(newPhotons);
    }
  }, [currentScene, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSkip = () => {
    setCurrentScene(STORY_SCENES.length - 1);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setIsPlaying(false);
    setHasStarted(false);
    setPhotons([]);
  };

  const getPhotonArrow = (bit: number, basis: string) => {
    if (basis === "+") {
      return bit === 0 ? "↑" : "→";
    } else {
      return bit === 0 ? "↗" : "↘";
    }
  };

  const getPhotonColor = (bit: number, basis: string) => {
    if (basis === "+") {
      return bit === 0 ? "text-blue-400" : "text-yellow-400";
    } else {
      return bit === 0 ? "text-red-400" : "text-green-400";
    }
  };

  const renderScene = () => {
    const scene = STORY_SCENES[currentScene];
    
    switch (scene.id) {
      case "problem":
        return (
          <div className="relative w-full h-96 flex items-center justify-between px-8">
            {/* Alice */}
            <motion.div 
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <span className="text-alice font-semibold">Alice</span>
            </motion.div>

            {/* Communication Line */}
            <div className="flex-1 relative mx-8">
              <div className="h-px bg-border w-full relative">
                {/* Message */}
                <motion.div
                  className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                  initial={{ x: "0%", y: "-150%" }}
                  animate={{ x: eveEnabled ? "40%" : "100%", y: "-150%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                >
                  HELLO
                </motion.div>

                {/* Eve in the middle (if enabled) */}
                {eveEnabled && (
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="w-12 h-12 bg-eve rounded-full flex items-center justify-center -translate-y-8">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-eve text-sm font-semibold -translate-y-4">Eve</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bob */}
            <motion.div 
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-bob rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <span className="text-bob font-semibold">Bob</span>
            </motion.div>
          </div>
        );

      case "symmetric":
        return (
          <div className="relative w-full h-96 flex items-center justify-center">
            <motion.div 
              className="flex items-center space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Alice with key */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <span className="text-alice font-semibold">Alice</span>
              </div>

              {/* Shared lock */}
              <motion.div
                className="p-4 bg-muted rounded-lg border"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-12 h-12 text-primary" />
              </motion.div>

              {/* Bob with key */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-bob rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <span className="text-bob font-semibold">Bob</span>
              </div>
            </motion.div>
          </div>
        );

      case "bb84-intro":
        return (
          <div className="relative w-full h-96">
            {/* Quantum channel background */}
            <motion.div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1 }}
            />

            <div className="flex items-center justify-between px-8 h-full">
              {/* Alice */}
              <motion.div 
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="text-alice font-semibold">Alice</span>
              </motion.div>

              {/* Photon generation */}
              <div className="flex-1 relative mx-8">
                {isPlaying && Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 left-0 text-2xl font-bold"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ 
                      x: [0, 100, 200, 300, 400], 
                      opacity: [0, 1, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <span className={i % 2 === 0 ? "text-blue-400" : "text-yellow-400"}>
                      {i % 2 === 0 ? "↑" : "→"}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Bob */}
              <motion.div 
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-16 h-16 bg-bob rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <span className="text-bob font-semibold">Bob</span>
              </motion.div>
            </div>
          </div>
        );

      case "photon-transmission":
        return (
          <div className="relative w-full h-96">
            {/* Quantum channel */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full" />

            <div className="flex items-center justify-between px-8 h-full">
              {/* Alice with polarizer */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="text-alice font-semibold">Alice</span>
                {/* Alice's polarizer slit */}
                <div className="w-8 h-12 bg-muted border-2 border-alice rounded-sm flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-alice rounded-full" />
                </div>
              </div>

              {/* Animated photons */}
              <div className="flex-1 relative mx-8">
                {isPlaying && photons.map((photon, i) => (
                  <motion.div
                    key={photon.id}
                    className="absolute top-1/2 -translate-y-1/2 left-0 text-3xl font-bold drop-shadow-lg"
                    initial={{ x: 0, opacity: 0, scale: 0.8 }}
                    animate={{ 
                      x: [0, "100%"], 
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 1, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 4,
                      delay: i * 0.8,
                      ease: "linear"
                    }}
                  >
                    <span className={getPhotonColor(photon.bit, photon.basis)}>
                      {getPhotonArrow(photon.bit, photon.basis)}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Bob with polarizer */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-bob rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <span className="text-bob font-semibold">Bob</span>
                {/* Bob's polarizer slit */}
                <div className="w-8 h-12 bg-muted border-2 border-bob rounded-sm flex items-center justify-center">
                  <motion.div 
                    className="w-6 h-0.5 bg-bob rounded-full"
                    animate={{ rotate: [0, 45, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "basis-comparison":
        return (
          <div className="relative w-full h-96">
            <div className="flex items-center justify-between px-8 h-full">
              {/* Alice */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <span className="text-alice font-semibold">Alice</span>
                <motion.div 
                  className="bg-alice/20 border border-alice rounded-lg p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-xs font-mono">My bases:</div>
                  <div className="text-sm font-mono">+, x, +, x, +</div>
                </motion.div>
              </div>

              {/* Classical channel (dashed line) */}
              <div className="flex-1 relative mx-8">
                <motion.div
                  className="h-px border-t-2 border-dashed border-muted-foreground w-full"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  Classical Channel
                </div>
              </div>

              {/* Bob */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-bob rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <span className="text-bob font-semibold">Bob</span>
                <motion.div 
                  className="bg-bob/20 border border-bob rounded-lg p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-xs font-mono">My bases:</div>
                  <div className="text-sm font-mono">x, x, +, x, +</div>
                </motion.div>
              </div>
            </div>

            {/* Matching basis indicators */}
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {["mismatch", "mismatch", "match", "mismatch", "match"].map((type, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                    type === "match" ? "bg-success" : "bg-muted"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </motion.div>
          </div>
        );

      case "shared-key":
        return (
          <div className="relative w-full h-96 flex items-center justify-center">
            <motion.div 
              className="flex items-center space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Alice with key */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <span className="text-alice font-semibold">Alice</span>
                <motion.div 
                  className="bg-success/20 border border-success rounded-lg p-3 font-mono text-lg"
                  animate={{ 
                    boxShadow: ["0 0 0px hsl(var(--success))", "0 0 20px hsl(var(--success))", "0 0 0px hsl(var(--success))"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  101101
                </motion.div>
              </div>

              {/* Shared lock */}
              <motion.div
                className="p-6 bg-success/20 border border-success rounded-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-16 h-16 text-success" />
              </motion.div>

              {/* Bob with key */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-bob rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <span className="text-bob font-semibold">Bob</span>
                <motion.div 
                  className="bg-success/20 border border-success rounded-lg p-3 font-mono text-lg"
                  animate={{ 
                    boxShadow: ["0 0 0px hsl(var(--success))", "0 0 20px hsl(var(--success))", "0 0 0px hsl(var(--success))"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  101101
                </motion.div>
              </div>
            </motion.div>
          </div>
        );

      case "conclusion":
        return (
          <div className="relative w-full h-96 flex flex-col items-center justify-center space-y-8">
            <motion.h2 
              className="text-4xl font-bold text-center bg-gradient-to-r from-primary via-primary-glow to-alice bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              BB84 = Quantum-Safe Key Distribution
            </motion.h2>

            <motion.div 
              className="grid grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <span className="text-success font-semibold">Secure</span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <span className="text-primary font-semibold">Detects Eve</span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-alice rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="text-alice font-semibold">Quantum-Safe</span>
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">{scene.title}</h3>
              <p className="text-muted-foreground">Scene visualization coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-8 p-4 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-alice bg-clip-text text-transparent">
              BB84 Story Mode
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              An animated journey through quantum cryptography. Watch how Alice and Bob use quantum mechanics 
              to detect eavesdropping and establish secure communication.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <Button onClick={handlePlay} className="gap-2">
                  <Play className="w-4 h-4" />
                  {hasStarted ? "Resume" : "Start Story"}
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline" className="gap-2">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              )}
              
              <Button onClick={handleSkip} variant="outline" className="gap-2">
                <SkipForward className="w-4 h-4" />
                Skip to End
              </Button>
              
              <Button onClick={handleRestart} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={eveEnabled}
                onCheckedChange={setEveEnabled}
                id="eve-toggle"
              />
              <label htmlFor="eve-toggle" className="text-sm font-medium">
                Include Eve's attacks
              </label>
            </div>
          </motion.div>

          {/* Progress indicator */}
          <motion.div 
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentScene + 1} of {STORY_SCENES.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentScene + 1) / STORY_SCENES.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Main Animation Area */}
          <Card className="min-h-[500px]">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  {renderScene()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Narration Box */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{STORY_SCENES[currentScene].title}</h3>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentScene}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {STORY_SCENES[currentScene].narration}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Scene navigation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {STORY_SCENES.map((scene, index) => (
              <Button
                key={scene.id}
                variant={index === currentScene ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentScene(index)}
                className="text-xs"
              >
                {index + 1}
              </Button>
            ))}
          </motion.div>
        </div>
      </div>
      
      <HackathonFooter />
    </div>
  );
};