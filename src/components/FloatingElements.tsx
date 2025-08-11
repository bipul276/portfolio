import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Code, Sparkles, Zap, Star, Brain, Rocket } from 'lucide-react';

interface FloatingIcon {
  id: number;
  Icon: any;
  x: number;
  y: number;
  delay: number;
  duration: number;
  scale: number;
  opacity: number;
}

export function FloatingElements() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  const iconComponents = [Code, Sparkles, Zap, Star, Brain, Rocket];

  useEffect(() => {
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      
      for (let i = 0; i < 8; i++) {
        newIcons.push({
          id: i,
          Icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 10 + Math.random() * 10,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
      
      setIcons(newIcons);
    };

    generateIcons();
    window.addEventListener('resize', generateIcons);
    
    return () => window.removeEventListener('resize', generateIcons);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          initial={{ 
            x: icon.x, 
            y: icon.y,
            scale: 0,
            rotate: 0,
            opacity: 0
          }}
          animate={{ 
            x: icon.x + (Math.random() - 0.5) * 200,
            y: icon.y - 100,
            scale: icon.scale,
            rotate: 360,
            opacity: icon.opacity
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <icon.Icon 
            className="h-8 w-8 text-blue-500/20 dark:text-blue-400/20" 
          />
        </motion.div>
      ))}
    </div>
  );
}