import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  type: 'heart' | 'sparkle' | 'ribbon';
  delay: number;
}

interface ConfettiProps {
  trigger: number;
  originX?: number;
  originY?: number;
}

const COLORS = [
  '#FF6B6B', // Coral red
  '#FFE66D', // Yellow
  '#4ECDC4', // Teal
  '#FF69B4', // Hot pink
  '#A78BFA', // Purple
  '#34D399', // Green
];

const Confetti: React.FC<ConfettiProps> = ({ trigger, originX = 50, originY = 50 }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 250,
        y: Math.random() * -200 - 50,
        rotation: Math.random() * 1080 - 540,
        scale: Math.random() * 0.6 + 0.7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: (['heart', 'sparkle', 'ribbon'] as const)[Math.floor(Math.random() * 3)],
        delay: Math.random() * 0.15,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => setPieces([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const renderShape = (piece: ConfettiPiece) => {
    if (piece.type === 'heart') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={piece.color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
    }
    if (piece.type === 'sparkle') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={piece.color}>
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      );
    }
    // Ribbon
    return (
      <div
        style={{
          width: '8px',
          height: '24px',
          background: `linear-gradient(180deg, ${piece.color} 0%, ${piece.color}88 100%)`,
          borderRadius: '4px',
        }}
      />
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              left: `${originX}%`,
              top: `${originY}%`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0, 
              rotate: 0,
              opacity: 1 
            }}
            animate={{
              x: piece.x,
              y: piece.y + 200,
              scale: piece.scale,
              rotate: piece.rotation,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              delay: piece.delay,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 1, times: [0, 0.7, 1] },
            }}
          >
            {renderShape(piece)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
