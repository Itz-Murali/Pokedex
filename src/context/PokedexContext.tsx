import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

interface PokedexContextType {
  selectedPokemonId: number | null;
  setSelectedPokemonId: (id: number | null) => void;
  isShiny: boolean;
  toggleShiny: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  showFavoritesOnly: boolean;
  toggleFavoritesOnly: () => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

export const PokedexProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const toggleShiny = useCallback(() => setIsShiny((prev) => !prev), []);
  const toggleSound = useCallback(() => setSoundEnabled((prev) => !prev), []);
  const toggleFavoritesOnly = useCallback(() => setShowFavoritesOnly((prev) => !prev), []);

  return (
    <PokedexContext.Provider
      value={{
        selectedPokemonId,
        setSelectedPokemonId,
        isShiny,
        toggleShiny,
        soundEnabled,
        toggleSound,
        showFavoritesOnly,
        toggleFavoritesOnly,
        favorites,
        toggleFavorite,
        isFavorite,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
};

export const usePokedex = () => {
  const context = useContext(PokedexContext);
  if (!context) {
    throw new Error('usePokedex must be used within a PokedexProvider');
  }
  return context;
};
