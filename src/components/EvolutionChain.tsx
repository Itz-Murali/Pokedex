import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { usePokemon, useEvolutionChain, getIdFromUrl } from '@/hooks/usePokemon';
import { usePokedex } from '@/context/PokedexContext';
import { EvolutionLink } from '@/types/pokemon';

interface EvolutionStageProps {
  name: string;
  level?: number;
  trigger?: string;
  item?: string;
  onClick: () => void;
  isSelected: boolean;
}

const EvolutionStage: React.FC<EvolutionStageProps> = ({ 
  name, 
  level, 
  trigger,
  item,
  onClick,
  isSelected 
}) => {
  const pokemonId = name.toLowerCase();
  const { data: pokemon } = usePokemon(pokemonId);
  const { isShiny } = usePokedex();

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-secondary rounded-full animate-pulse" />
        <div className="h-3 w-12 bg-secondary rounded mt-2" />
      </div>
    );
  }

  const imageUrl = isShiny
    ? pokemon.sprites.front_shiny
    : pokemon.sprites.front_default;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
        isSelected ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-secondary'
      }`}
    >
      <div className="w-16 h-16 relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      <p className="font-semibold text-xs capitalize mt-1">{name}</p>
      {level && (
        <p className="text-[10px] text-muted-foreground">Lv. {level}</p>
      )}
      {item && (
        <p className="text-[10px] text-muted-foreground capitalize">{item.replace('-', ' ')}</p>
      )}
      {trigger && trigger !== 'level-up' && !item && (
        <p className="text-[10px] text-muted-foreground capitalize">{trigger.replace('-', ' ')}</p>
      )}
    </motion.button>
  );
};

interface EvolutionChainViewProps {
  evolutionChainUrl: string;
}

const EvolutionChainView: React.FC<EvolutionChainViewProps> = ({ evolutionChainUrl }) => {
  const { data: evolutionData, isLoading } = useEvolutionChain(evolutionChainUrl);
  const { selectedPokemonId, setSelectedPokemonId } = usePokedex();

  const evolutionStages = useMemo(() => {
    if (!evolutionData) return [];

    const stages: Array<{
      name: string;
      level?: number;
      trigger?: string;
      item?: string;
      id: number;
    }> = [];

    const parseChain = (chain: EvolutionLink) => {
      const id = getIdFromUrl(chain.species.url);
      const details = chain.evolution_details[0];
      
      stages.push({
        name: chain.species.name,
        level: details?.min_level,
        trigger: details?.trigger?.name,
        item: details?.item?.name,
        id,
      });

      chain.evolves_to.forEach(parseChain);
    };

    parseChain(evolutionData.chain);
    return stages;
  }, [evolutionData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (evolutionStages.length <= 1) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">This Pokémon does not evolve.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap py-2">
      {evolutionStages.map((stage, index) => (
        <motion.div
          key={stage.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          <EvolutionStage
            name={stage.name}
            level={stage.level}
            trigger={stage.trigger}
            item={stage.item}
            isSelected={selectedPokemonId === stage.id}
            onClick={() => setSelectedPokemonId(stage.id)}
          />
          {index < evolutionStages.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default EvolutionChainView;
