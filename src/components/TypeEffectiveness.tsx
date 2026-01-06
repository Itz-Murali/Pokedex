import { useMemo } from 'react';
import { useTypeRelations } from '@/hooks/usePokemon';
import { TYPE_COLORS } from '@/types/pokemon';

interface TypeEffectivenessProps {
  types: string[];
}

interface TypeMultiplier {
  type: string;
  multiplier: number;
}

const TypeEffectiveness: React.FC<TypeEffectivenessProps> = ({ types }) => {
  const type1Query = useTypeRelations(types[0]);
  const type2Query = useTypeRelations(types[1] || '');

  const effectiveness = useMemo(() => {
    const multipliers: Record<string, number> = {};

    const applyRelations = (relations: typeof type1Query.data) => {
      if (!relations) return;

      relations.double_damage_from.forEach((t) => {
        multipliers[t.name] = (multipliers[t.name] || 1) * 2;
      });
      relations.half_damage_from.forEach((t) => {
        multipliers[t.name] = (multipliers[t.name] || 1) * 0.5;
      });
      relations.no_damage_from.forEach((t) => {
        multipliers[t.name] = 0;
      });
    };

    applyRelations(type1Query.data);
    if (types[1]) {
      applyRelations(type2Query.data);
    }

    return multipliers;
  }, [type1Query.data, type2Query.data, types]);

  const weaknesses: TypeMultiplier[] = [];
  const resistances: TypeMultiplier[] = [];
  const immunities: TypeMultiplier[] = [];

  Object.entries(effectiveness).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      immunities.push({ type, multiplier });
    } else if (multiplier > 1) {
      weaknesses.push({ type, multiplier });
    } else if (multiplier < 1) {
      resistances.push({ type, multiplier });
    }
  });

  weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  resistances.sort((a, b) => a.multiplier - b.multiplier);

  if (type1Query.isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-secondary rounded w-1/4" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-secondary rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {weaknesses.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">Weak To</h4>
          <div className="flex gap-1.5 flex-wrap">
            {weaknesses.map(({ type, multiplier }) => (
              <span
                key={type}
                className={`type-badge ${TYPE_COLORS[type]} flex items-center gap-1 text-[11px]`}
              >
                {type}
                <span className="opacity-75 text-[10px]">{multiplier}×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {resistances.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">Resistant To</h4>
          <div className="flex gap-1.5 flex-wrap">
            {resistances.map(({ type, multiplier }) => (
              <span
                key={type}
                className={`type-badge ${TYPE_COLORS[type]} flex items-center gap-1 text-[11px]`}
              >
                {type}
                <span className="opacity-75 text-[10px]">{multiplier}×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {immunities.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Immune To</h4>
          <div className="flex gap-1.5 flex-wrap">
            {immunities.map(({ type }) => (
              <span
                key={type}
                className={`type-badge ${TYPE_COLORS[type]} text-[11px]`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeEffectiveness;
