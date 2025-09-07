import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Atom, BookOpen, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-2"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Atom className="w-6 h-6 text-primary-foreground" />
              </div>
            </Button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">
                QKD Demonstration Simulator
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                BB84 Protocol Implementation
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              variant={location.pathname === "/story" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/story")}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Story Mode
            </Button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};