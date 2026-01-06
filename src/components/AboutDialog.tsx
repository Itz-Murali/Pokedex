import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Heart, Sparkles, Code2, Zap, BookOpen } from 'lucide-react';
import pokeballImg from '@/assets/pokeball.png';

const VERSION = "v2.0";

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Magical floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/30"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: window.innerHeight + 20,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: -20,
                  x: Math.random() * window.innerWidth
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10, 
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className="relative w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl pointer-events-none" />
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header with logo */}
            <div className="relative pt-8 pb-6 px-6 text-center">
              <motion.div 
                className="flex items-center justify-center gap-3 mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.img 
                  src={pokeballImg} 
                  alt="Pokeball" 
                  className="w-12 h-12 md:w-14 md:h-14"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-display">
                  Pokédex
                </h2>
                <span className="ml-2 text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {VERSION}
                </span>
              </motion.div>
              <motion.p 
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your ultimate Pokémon companion
              </motion.p>
            </div>

            {/* About content */}
            <div className="px-6 pb-6 space-y-4">
              {/* About text */}
              <motion.div 
                className="p-4 rounded-2xl bg-muted/30 border border-border/30"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">About</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A modern, interactive Pokédex built with love. Explore over 1000 Pokémon, 
                  view their stats, evolutions, moves, and type effectiveness. 
                  Toggle shiny sprites, play cries, and save your favorites!
                </p>
              </motion.div>

              {/* Features & Credits - Side by side on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Features */}
                <motion.div 
                  className="grid grid-cols-2 gap-2 content-start"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { icon: Sparkles, text: "Shiny Sprites" },
                    { icon: Heart, text: "Favorites" },
                    { icon: Zap, text: "Type Analysis" },
                    { icon: Code2, text: "Evolution Data" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-primary/5 border border-primary/10">
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Credits */}
                <motion.div 
                  className="p-4 rounded-2xl bg-muted/30 border border-border/30"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Credits
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pokémon Data</span>
                      <a 
                        href="https://pokeapi.co" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        PokéAPI
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Sprites</span>
                      <span className="text-foreground font-medium">PokéAPI Sprites</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Icons</span>
                      <span className="text-foreground font-medium">Lucide Icons</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Developer */}
              <motion.div 
                className="text-center py-4 rounded-2xl bg-muted/30 border border-border/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <p className="text-xs text-muted-foreground mb-2">Developed with ❤️ by</p>
                <motion.p 
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent font-display tracking-wide"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Murali
                </motion.p>
              </motion.div>

              {/* Links row - side by side on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Professor Eevee Story */}
                <motion.a
                  href="https://journey-of-professor-eevee.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      Journey of Professor Eevee
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      A dream-inspired Pokémon story ✨
                    </p>
                  </div>
                </motion.a>

                {/* GitHub button */}
                <motion.a
                  href="https://github.com/Itz-Murali/Pokedex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-foreground text-background rounded-2xl font-semibold hover:opacity-90 transition-opacity group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View Source Code
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutDialog;
