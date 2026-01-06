import { motion } from 'framer-motion';
import { Search, Shuffle, Sparkles, Heart, Volume2, VolumeX, Moon, Sun, Info } from 'lucide-react';
import { usePokedex } from '@/context/PokedexContext';
import pokeballImg from '@/assets/pokeball.png';
import { useEffect, useState } from 'react';
import AboutDialog from './AboutDialog';

interface PokedexHeaderProps {
  onRandomPokemon: () => void;
  totalPokemon: number;
}

const PokedexHeader: React.FC<PokedexHeaderProps> = ({ onRandomPokemon, totalPokemon }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    isShiny, 
    toggleShiny, 
    soundEnabled, 
    toggleSound,
    showFavoritesOnly,
    toggleFavoritesOnly,
    favorites
  } = usePokedex();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return (
    <>
      <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      
      <header className="relative overflow-hidden">
        {/* About Icon - Top Left */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAboutOpen(true)}
          className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 group"
        >
          <Info className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.button>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 -translate-y-1/2 translate-x-1/3">
          <img src={pokeballImg} alt="" className="w-full h-full pokeball-float" />
        </div>

      <div className="relative z-10 py-8 md:py-12">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.img 
            src={pokeballImg} 
            alt="Pokeball" 
            className="w-12 h-12 md:w-14 md:h-14"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Pokédex
            </h1>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl overflow-hidden shadow-lg group-focus-within:border-primary/50 group-focus-within:shadow-primary/10 transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-primary/10 border-r border-border/30">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or #number..."
                className="flex-1 h-14 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base font-medium"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="flex items-center justify-center w-10 h-10 mr-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-lg font-bold">×</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRandomPokemon}
            className="btn-primary flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Random</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleShiny}
            className={`btn-secondary flex items-center gap-2 ${isShiny ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : ''}`}
          >
            <Sparkles className={`w-4 h-4 ${isShiny ? 'text-amber-500' : ''}`} />
            <span className="hidden sm:inline">Shiny</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleSound}
            className={`btn-secondary flex items-center gap-2 ${soundEnabled ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : ''}`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Sound</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleFavoritesOnly}
            className={`btn-secondary flex items-center gap-2 ${showFavoritesOnly ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' : ''}`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full font-medium">
                {favorites.length}
              </span>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleDarkMode}
            className="btn-secondary flex items-center gap-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </motion.button>
        </div>
        </div>
      </header>
    </>
  );
};

export default PokedexHeader;
