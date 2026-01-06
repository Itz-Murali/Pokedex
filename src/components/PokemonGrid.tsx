import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import PokemonCard from './PokemonCard';
import { usePokedex } from '@/context/PokedexContext';
import { usePokemonList, getIdFromUrl } from '@/hooks/usePokemon';
import pokeballImg from '@/assets/pokeball.png';

const ITEMS_PER_PAGE = 40;

interface PokemonGridProps {
  onTotalChange?: (total: number) => void;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ onTotalChange }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const { 
    selectedPokemonId, 
    setSelectedPokemonId, 
    searchQuery,
    showFavoritesOnly,
    favorites 
  } = usePokedex();
  
  const { data: pokemonList, isLoading } = usePokemonList(1025, 0);

  const filteredPokemon = useMemo(() => {
    if (!pokemonList) return [];
    
    let pokemonData = pokemonList.results.map((pokemon, index) => ({
      id: getIdFromUrl(pokemon.url),
      name: pokemon.name
    }));

    // Filter by favorites
    if (showFavoritesOnly) {
      pokemonData = pokemonData.filter((p) => favorites.includes(p.id));
    }

    // Filter by search query
    if (searchQuery) {
      // Remove # symbol and trim whitespace
      const cleanedQuery = searchQuery.replace(/^#/, '').toLowerCase().trim();
      const numQuery = parseInt(cleanedQuery, 10);

      if (!isNaN(numQuery) && cleanedQuery.match(/^\d+$/)) {
        // Pure number search - exact match or ID contains
        pokemonData = pokemonData.filter((p) => p.id === numQuery || String(p.id).includes(cleanedQuery));
      } else {
        // Name search
        pokemonData = pokemonData.filter((p) => p.name.includes(cleanedQuery));
      }
    }

    return pokemonData.map(p => p.id);
  }, [pokemonList, searchQuery, showFavoritesOnly, favorites]);

  // Report total to parent
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(pokemonList?.results.length || 0);
    }
  }, [pokemonList, onTotalChange]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, showFavoritesOnly]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredPokemon.length));
  }, [filteredPokemon.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPokemon.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, visibleCount, filteredPokemon.length]);

  const visiblePokemon = filteredPokemon.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPokemon.length;

  if (isLoading) {
    return (
      <div className="glass-card min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <motion.img 
            src={pokeballImg} 
            alt="Loading"
            className="w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="text-muted-foreground font-medium">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (filteredPokemon.length === 0) {
    return (
      <div className="glass-card min-h-[300px] flex items-center justify-center p-8">
        <div className="text-center">
          <img src={pokeballImg} alt="" className="w-20 h-20 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium text-foreground mb-1">
            {showFavoritesOnly ? 'No favorite Pokémon yet!' : 'No Pokémon found'}
          </p>
          <p className="text-sm text-muted-foreground">
            {showFavoritesOnly 
              ? 'Click the heart icon on any Pokémon to add it to favorites.' 
              : 'Try a different search term.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visiblePokemon.map((id, index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.5) }}
          >
            <PokemonCard
              id={id}
              isSelected={selectedPokemonId === id}
              onClick={() => setSelectedPokemonId(id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Infinite scroll loader */}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <motion.img 
            src={pokeballImg} 
            alt="Loading more"
            className="w-10 h-10 opacity-50"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

export default PokemonGrid;
