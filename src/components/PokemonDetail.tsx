import { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Ruler, Weight } from 'lucide-react';
import { usePokemon, usePokemonSpecies } from '@/hooks/usePokemon';
import { usePokedex } from '@/context/PokedexContext';
import { TYPE_COLORS } from '@/types/pokemon';
import StatBar from './StatBar';
import EvolutionChainView from './EvolutionChain';
import TypeEffectiveness from './TypeEffectiveness';
import MovesList from './MovesList';
import Confetti from './Confetti';
import pokeballImg from '@/assets/pokeball.png';

const PokemonDetail: React.FC = () => {
  const { 
    selectedPokemonId, 
    setSelectedPokemonId, 
    isShiny, 
    soundEnabled,
    isFavorite,
    toggleFavorite 
  } = usePokedex();
  
  const { data: pokemon, isLoading } = usePokemon(selectedPokemonId || 0);
  const { data: species } = usePokemonSpecies(selectedPokemonId || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const favorite = selectedPokemonId ? isFavorite(selectedPokemonId) : false;

  // Play cry when pokemon loads
  useEffect(() => {
    if (soundEnabled && pokemon?.cries?.latest) {
      audioRef.current = new Audio(pokemon.cries.latest);
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [pokemon?.id, soundEnabled]);

  const description = useMemo(() => {
    if (!species) return '';
    const entry = species.flavor_text_entries.find(
      (e) => e.language.name === 'en'
    );
    return entry?.flavor_text.replace(/\f|\n/g, ' ') || '';
  }, [species]);

  const genus = useMemo(() => {
    if (!species) return '';
    const entry = species.genera.find((g) => g.language.name === 'en');
    return entry?.genus || '';
  }, [species]);

  if (!selectedPokemonId) {
    return (
      <div className="glass-card min-h-[500px] flex items-center justify-center p-8">
        <div className="text-center">
          <img src={pokeballImg} alt="" className="w-24 h-24 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-muted-foreground">
            Select a Pokémon to view details
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !pokemon) {
    return (
      <div className="glass-card min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <motion.img 
            src={pokeballImg} 
            alt="Loading"
            className="w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="text-muted-foreground font-medium">Loading Pokémon data...</p>
        </div>
      </div>
    );
  }

  const imageUrl = isShiny
    ? pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny
    : pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  const types = pokemon.types.map((t) => t.type.name);
  const primaryType = types[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pokemon.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-card overflow-hidden"
      >
        {/* Close Button (Mobile) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedPokemonId(null);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-card hover:bg-secondary shadow-md z-20 lg:hidden transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Header with Background */}
        <div className={`relative p-6 pb-20 ${TYPE_COLORS[primaryType]} bg-opacity-20`}>
          <div className="absolute inset-0 opacity-10">
            <div className={`absolute inset-0 ${TYPE_COLORS[primaryType]}`} />
          </div>
          
          {/* Decorative Pokeball */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-10 translate-x-1/4 -translate-y-1/4">
            <img src={pokeballImg} alt="" className="w-full h-full" />
          </div>

          <div className="relative z-10">
            <span className="number-badge">
              #{String(pokemon.id).padStart(4, '0')}
            </span>
            <div className="flex items-center gap-3 mt-2">
              <h2 className="text-2xl md:text-3xl font-bold capitalize text-foreground">
                {pokemon.name.replace('-', ' ')}
              </h2>
              <motion.button
                onClick={() => {
                  if (!favorite) {
                    setConfettiTrigger(prev => prev + 1);
                  }
                  toggleFavorite(pokemon.id);
                }}
                whileTap={{ scale: 0.85 }}
                className="p-2 rounded-full bg-card/80 hover:bg-card shadow-sm transition-colors relative"
              >
                <Confetti trigger={confettiTrigger} originX={50} originY={50} />
                <motion.div
                  initial={false}
                  animate={favorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-5 h-5 transition-colors duration-300 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                </motion.div>
              </motion.button>
            </div>
            {genus && (
              <p className="text-sm text-muted-foreground mt-1">{genus}</p>
            )}
            <div className="flex gap-2 mt-3">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`type-badge ${TYPE_COLORS[t.type.name]}`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pokemon Image - Overlapping */}
        <div className="relative -mt-16 mb-4 flex justify-center">
          <motion.img
            key={isShiny ? 'shiny' : 'normal'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={imageUrl}
            alt={pokemon.name}
            className="w-40 h-40 object-contain drop-shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
          {/* Height & Weight */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded-lg bg-secondary">
                <Ruler className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Height</p>
                <p className="font-semibold">{(pokemon.height / 10).toFixed(1)}m</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded-lg bg-secondary">
                <Weight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Weight</p>
                <p className="font-semibold">{(pokemon.weight / 10).toFixed(1)}kg</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="bg-secondary/50 rounded-xl p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Stats */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Base Stats</h3>
            <div className="space-y-2.5">
              {pokemon.stats.map((stat) => (
                <StatBar
                  key={stat.stat.name}
                  name={stat.stat.name}
                  value={stat.base_stat}
                />
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Abilities</h3>
            <div className="flex gap-2 flex-wrap">
              {pokemon.abilities.map((a) => (
                <span
                  key={a.ability.name}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                    a.is_hidden
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {a.ability.name.replace('-', ' ')}
                  {a.is_hidden && <span className="text-[10px] ml-1 opacity-70">(Hidden)</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Type Effectiveness */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Type Matchups</h3>
            <TypeEffectiveness types={types} />
          </div>

          {/* Evolution Chain */}
          {species?.evolution_chain?.url && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Evolution</h3>
              <EvolutionChainView evolutionChainUrl={species.evolution_chain.url} />
            </div>
          )}

          {/* Moves */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Moves</h3>
            <MovesList moves={pokemon.moves} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PokemonDetail;
