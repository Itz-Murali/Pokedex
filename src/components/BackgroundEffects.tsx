import { motion } from 'framer-motion';
import pokeballImg from '@/assets/pokeball.png';

const BackgroundEffects: React.FC = () => {
  // Generate random particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 3,
  }));

  // Floating pokeballs with smaller sizes and random wandering
  const pokeballs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 16, // 16-36px (smaller)
    left: Math.random() * 90 + 5,
    top: Math.random() * 90 + 5,
    duration: Math.random() * 15 + 20, // 20-35s slow movement
    rotationDuration: Math.random() * 8 + 12, // 12-20s rotation
    delay: Math.random() * 5,
    xRange: (Math.random() - 0.5) * 200, // Random X movement range
    yRange: (Math.random() - 0.5) * 200, // Random Y movement range
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--pokedex-blue))]/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Floating Pokeballs with random wandering and rotation */}
      {pokeballs.map((ball) => (
        <motion.div
          key={ball.id}
          className="absolute opacity-[0.015]"
          style={{
            width: ball.size,
            height: ball.size,
            left: `${ball.left}%`,
            top: `${ball.top}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.015,
            x: [0, ball.xRange, -ball.xRange / 2, ball.xRange / 3, 0],
            y: [0, ball.yRange / 2, ball.yRange, -ball.yRange / 3, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: ball.delay },
            x: { duration: ball.duration, repeat: Infinity, ease: "easeInOut" },
            y: { duration: ball.duration * 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <motion.img
            src={pokeballImg}
            alt=""
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: ball.rotationDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}

      {/* Sparkle particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30 animate-sparkle"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: particle.delay }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
