import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PokedexProvider, usePokedex } from '@/context/PokedexContext';
import PokedexHeader from '@/components/PokedexHeader';
import PokemonGrid from '@/components/PokemonGrid';
import PokemonDetail from '@/components/PokemonDetail';
import ScrollToTop from '@/components/ScrollToTop';
import BackgroundEffects from '@/components/BackgroundEffects';

const PokedexContent: React.FC = () => {
  const { setSelectedPokemonId, selectedPokemonId } = usePokedex();
  const [totalPokemon, setTotalPokemon] = useState(1025);

  const handleRandomPokemon = useCallback(() => {
    const randomId = Math.floor(Math.random() * totalPokemon) + 1;
    setSelectedPokemonId(randomId);
  }, [setSelectedPokemonId, totalPokemon]);

  return (
    <div className="min-h-screen hero-bg relative">
      {/* Animated Background */}
      <BackgroundEffects />

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <PokedexHeader onRandomPokemon={handleRandomPokemon} totalPokemon={totalPokemon} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* Pokemon Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <PokemonGrid onTotalChange={setTotalPokemon} />
          </motion.div>

          {/* Pokemon Detail - Desktop always visible */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <PokemonDetail />
            </div>
          </div>

          {/* Pokemon Detail - Mobile Overlay with animations */}
          <AnimatePresence>
            {selectedPokemonId && (
              <motion.div
                key="mobile-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedPokemonId(null);
                  }
                }}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full max-w-md max-h-[90vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PokemonDetail />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer spacer */}
        <div className="pb-8" />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <PokedexProvider>
      <PokedexContent />
    </PokedexProvider>
  );
};

export default Index;
