import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TYPE_COLORS } from '@/types/pokemon';
import { useMoveDetails } from '@/hooks/usePokemon';
import type { PokemonMove } from '@/types/pokemon';

interface MoveItemProps {
  move: PokemonMove;
}

const MoveItem: React.FC<MoveItemProps> = ({ move }) => {
  const { data: moveDetails, isLoading } = useMoveDetails(move.move.url);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-secondary/50 animate-pulse">
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    );
  }

  if (!moveDetails) return null;

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
      <span className={`type-badge text-[9px] py-0.5 px-2 ${TYPE_COLORS[moveDetails.type.name]}`}>
        {moveDetails.type.name}
      </span>
      <span className="text-sm font-medium capitalize flex-1 text-foreground">
        {move.move.name.replace(/-/g, ' ')}
      </span>
      {moveDetails.power && (
        <span className="text-xs font-bold text-muted-foreground tabular-nums">
          {moveDetails.power}
        </span>
      )}
    </div>
  );
};

interface MovesListProps {
  moves: PokemonMove[];
}

const MovesList: React.FC<MovesListProps> = ({ moves }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedMoves = useMemo(() => {
    return showAll ? moves.slice(0, 30) : moves.slice(0, 6);
  }, [moves, showAll]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
        {displayedMoves.map((move) => (
          <motion.div
            key={move.move.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <MoveItem move={move} />
          </motion.div>
        ))}
      </div>
      
      {moves.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showAll ? 'Show Less' : `Show More (${moves.length - 6} more)`}
        </button>
      )}
    </div>
  );
};

export default MovesList;
