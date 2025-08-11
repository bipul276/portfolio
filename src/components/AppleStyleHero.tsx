import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Button } from "./ui/button";
import { Code, Download, Mail, ArrowDown } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AppleStyleHeroProps {
  onScrollToSection: (sectionId: string) => void;
}

export function AppleStyleHero({ onScrollToSection }: AppleStyleHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Tech stack rotation state
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  
  const techStack = [
    { name: 'React', color: '#61DAFB', icon: '⚛️' },
    { name: 'TypeScript', color: '#3178C6', icon: 'TS' },
    { name: 'Node.js', color: '#339933', icon: '🟢' },
    { name: 'MongoDB', color: '#4DB33D', icon: '🍃' }, 
    { name: 'Next.js', color: '#000000', icon: '▲' },
    { name: 'Firebase', color: '#FFCA28', icon: '🔥' }  
  ];

  // Cycle through tech stack
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTechIndex((prev) => (prev + 1) % techStack.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [techStack.length]);

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.8]), springConfig);

  // Text reveal animations
  const titleY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -100]), springConfig);
  const titleOpacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0]), springConfig);
  
  const subtitleY = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, -80]), springConfig);
  const subtitleOpacity = useSpring(useTransform(scrollYProgress, [0.1, 0.3], [1, 0]), springConfig);
  
  // Profile image animations
  const profileScale = useSpring(useTransform(scrollYProgress, [0, 0.4], [1, 1.2]), springConfig);
  const profileY = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, -150]), springConfig);
  const profileOpacity = useSpring(useTransform(scrollYProgress, [0.2, 0.4], [1, 0]), springConfig);

  // --- SIMPLIFIED BUTTON ANIMATIONS ---
  // The buttons are now part of the main content that fades out.
  // They will be visible from the start and fade smoothly with the rest of the hero.
  const contentY = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, -150]), springConfig);
  const contentOpacity = useSpring(useTransform(scrollYProgress, [0.2, 0.5], [1, 0]), springConfig);


  return (
    <div id="home" ref={heroRef} className="relative min-h-[200vh]">
      {/* Sticky Hero Content */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Theme-Aware Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          {/* Light Mode Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/20 dark:hidden" />
          
          {/* Dark Mode Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950 hidden dark:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 hidden dark:block" />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 dark:bg-blue-400/60 rounded-full"
              style={{ top: `${20 + (i * 10)}%`, left: `${10 + (i * 12)}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-0.5 h-0.5 bg-blue-400/30 dark:bg-purple-400/40 rounded-full"
              style={{ top: `${30 + (i * 8)}%`, right: `${15 + (i * 10)}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="relative z-10 flex items-center justify-center min-h-screen px-4"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Profile Image Section */}
            <motion.div 
              className="mb-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <div className="relative w-48 h-48 mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/20 dark:border-gray-700/50 relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                    <ImageWithFallback 
                      src="/profilepic.jpg"
                      alt="Bipul Nandan - Full Stack Developer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div 
                    className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full shadow-lg border-4 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: techStack[currentTechIndex]?.color || '#6366f1' }}
                    key={currentTechIndex}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.6 }}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{techStack[currentTechIndex]?.icon}</div>
                      <div className="text-xs leading-none">{techStack[currentTechIndex]?.name}</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-white/5" />
                </div>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke={techStack[currentTechIndex]?.color || '#6366f1'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: (currentTechIndex + 1) / techStack.length }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ pathLength: (currentTechIndex + 1) / techStack.length, opacity: 0.6 }}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Currently working with</div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                        index === currentTechIndex 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                          : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                      }`}
                      animate={{ scale: index === currentTechIndex ? 1.05 : 1, y: index === currentTechIndex ? -2 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tech.icon} {tech.name}
                    </motion.div>
                  ))}
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mt-8 mb-4 text-gray-900 dark:text-white leading-none">
                Bipul Nandan
              </h1>
              <div className="flex justify-center mb-8">
                <div className="px-6 py-2 bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 rounded-full shadow-lg text-sm">
                  <span>Full Stack Developer</span>
                </div>
              </div>
            </motion.div>

            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl font-light text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Creating exceptional digital experiences with{" "}
              <span className="text-blue-600 dark:text-blue-400 font-normal">modern technologies</span>
              {" "}and innovative solutions
            </motion.h2>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <Button 
                size="lg" 
                onClick={() => onScrollToSection('projects')} 
                className="px-8 py-3 text-base bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                View My Work
              </Button>
              <Button 
                variant="outline" size="lg"
                className="px-8 py-3 text-base rounded-full border-2 border-gray-300 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="/Bipul_resume.pdf" download="Bipul_Nandan_Resume.pdf" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
              <Button 
                variant="ghost" size="lg"
                className="px-8 py-3 text-base rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="mailto:bipulnandan276@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => onScrollToSection('about')}
              >
                <span className="text-sm mb-2">Scroll to explore</span>
                <ArrowDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Visual Effects */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5" 
               style={{
                 backgroundImage: `linear-gradient(var(--grid-line-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line-color) 1px, transparent 1px)`,
                 backgroundSize: '60px 60px',
                 '--grid-line-color': 'rgba(0, 0, 0, 0.05)'
               } as React.CSSProperties} 
          />
        </motion.div>
        <style>{`.dark { --grid-line-color: rgba(255, 255, 255, 0.1); }`}</style>
      </div>

      {/* Transition Buffer */}
      <div className="h-screen bg-gradient-to-t from-background to-blue-50/20 dark:to-indigo-950/20" />
    </div>
  );
}
