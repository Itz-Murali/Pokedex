import { motion } from 'framer-motion';

interface StatBarProps {
  name: string;
  value: number;
  maxValue?: number;
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const getStatColor = (value: number): string => {
  if (value >= 150) return 'bg-purple-500';
  if (value >= 120) return 'bg-emerald-500';
  if (value >= 90) return 'bg-green-500';
  if (value >= 60) return 'bg-amber-500';
  if (value >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

const StatBar: React.FC<StatBarProps> = ({ name, value, maxValue = 255 }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const color = getStatColor(value);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground w-16">
        {STAT_LABELS[name] || name}
      </span>
      <span className="text-sm font-bold text-foreground w-8 text-right tabular-nums">
        {value}
      </span>
      <div className="stat-bar flex-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className={`stat-bar-fill ${color}`}
        />
      </div>
    </div>
  );
};

export default StatBar;
