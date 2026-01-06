import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
          <span className="digital-text text-5xl text-accent">?</span>
        </div>
        <h1 className="mb-2 text-6xl font-display text-accent">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          This Pokémon could not be found!
        </p>
        <a 
          href="/" 
          className="pokedex-button-primary inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Pokédex
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;
