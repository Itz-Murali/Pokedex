import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { usePokemon } from '@/hooks/usePokemon';
import { usePokedex } from '@/context/PokedexContext';
import { TYPE_COLORS } from '@/types/pokemon';
import Confetti from './Confetti';

interface PokemonCardProps {
  id: number;
  onClick: () => void;
  isSelected: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, onClick, isSelected }) => {
  const { data: pokemon, isLoading } = usePokemon(id);
  const { isFavorite, toggleFavorite, isShiny } = usePokedex();
  const favorite = isFavorite(id);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  if (isLoading || !pokemon) {
    return (
      <div className="pokemon-card animate-pulse">
        <div className="aspect-square bg-secondary rounded-xl mb-3" />
        <div className="h-3 bg-secondary rounded w-1/3 mx-auto mb-2" />
        <div className="h-4 bg-secondary rounded w-2/3 mx-auto" />
      </div>
    );
  }

  const imageUrl = isShiny 
    ? pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny
    : pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  const primaryType = pokemon.types[0]?.type.name || 'normal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`pokemon-card relative group ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* Confetti */}
      <Confetti trigger={confettiTrigger} originX={85} originY={10} />

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!favorite) {
            setConfettiTrigger(prev => prev + 1);
          }
          toggleFavorite(id);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
      </button>

      {/* Type-based Background Gradient */}
      <div 
        className={`absolute inset-0 rounded-2xl opacity-10 ${TYPE_COLORS[primaryType]}`}
      />

      {/* Pokemon Image */}
      <div className="relative aspect-square mb-2">
        <motion.img
          key={isShiny ? 'shiny' : 'normal'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          src={imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-md"
          loading="lazy"
        />
      </div>

      {/* Pokemon Info */}
      <div className="text-center relative">
        <span className="number-badge">
          #{String(pokemon.id).padStart(4, '0')}
        </span>
        <h3 className="font-semibold text-foreground capitalize mt-1 text-sm">
          {pokemon.name.replace('-', ' ')}
        </h3>
        <div className="flex gap-1 justify-center mt-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`type-badge text-[10px] py-0.5 px-2 ${TYPE_COLORS[t.type.name]}`}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PokemonCard;
