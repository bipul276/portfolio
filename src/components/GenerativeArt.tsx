import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Palette, RotateCcw, Download, Play, Pause, Sparkles } from 'lucide-react';

interface ArtConfig {
  pattern: 'fractal' | 'waves' | 'particles' | 'mandala' | 'flow-field';
  speed: number;
  complexity: number;
  colorScheme: 'rainbow' | 'ocean' | 'fire' | 'purple' | 'monochrome';
  interactive: boolean;
}

export function GenerativeArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [config, setConfig] = useState<ArtConfig>({
    pattern: 'flow-field',
    speed: 5,
    complexity: 50,
    colorScheme: 'rainbow',
    interactive: true
  });

  // Animation state
  const [time, setTime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colorSchemes = {
    rainbow: [(t: number, i: number) => `hsl(${(t * 0.5 + i * 20) % 360}, 70%, 60%)`],
    ocean: [(t: number, i: number) => `hsl(${180 + Math.sin(t * 0.01 + i) * 60}, 70%, ${50 + Math.sin(i) * 20}%)`],
    fire: [(t: number, i: number) => `hsl(${Math.sin(t * 0.01 + i) * 60 + 20}, 90%, ${60 + Math.sin(i) * 20}%)`],
    purple: [(t: number, i: number) => `hsl(${280 + Math.sin(t * 0.01 + i) * 40}, 70%, ${50 + Math.sin(i) * 30}%)`],
    monochrome: [(t: number, i: number) => `hsl(0, 0%, ${30 + Math.sin(t * 0.01 + i) * 40}%)`]
  };

  const patterns = {
    'fractal': (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      const centerX = width / 2 + Math.sin(t * 0.002) * 50;
      const centerY = height / 2 + Math.cos(t * 0.003) * 30;
      
      for (let i = 0; i < config.complexity; i++) {
        const angle = (i / config.complexity) * Math.PI * 2 + t * 0.01 * config.speed;
        const radius = Math.sin(i * 0.1 + t * 0.005) * 100 + 150;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const branchAngle = angle + Math.sin(t * 0.01 + i) * 0.5;
        const branchLength = 30 + Math.sin(t * 0.01 + i) * 20;
        
        const endX = x + Math.cos(branchAngle) * branchLength;
        const endY = y + Math.sin(branchAngle) * branchLength;
        
        ctx.strokeStyle = colorSchemes[config.colorScheme][0](t, i);
        ctx.lineWidth = 2 + Math.sin(t * 0.01 + i) * 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    },

    'waves': (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      const waveCount = Math.floor(config.complexity / 10) + 1;
      
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.strokeStyle = colorSchemes[config.colorScheme][0](t, w * 50);
        ctx.lineWidth = 3;
        
        for (let x = 0; x < width; x += 2) {
          const frequency = 0.01 + w * 0.005;
          const amplitude = 50 + w * 20;
          const phase = t * 0.01 * config.speed + w * Math.PI / 3;
          
          const y = height / 2 + 
                   Math.sin(x * frequency + phase) * amplitude +
                   Math.sin(x * frequency * 2 + phase * 1.5) * amplitude * 0.5;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },

    'particles': (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      const particleCount = config.complexity * 2;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = Math.sin(t * 0.01 * config.speed + i * 0.1) * 150 + 200;
        
        const x = width / 2 + Math.cos(angle + t * 0.005) * radius;
        const y = height / 2 + Math.sin(angle + t * 0.005) * radius;
        
        const size = 3 + Math.sin(t * 0.02 + i) * 2;
        
        ctx.fillStyle = colorSchemes[config.colorScheme][0](t, i);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Trails
        const trailLength = 5;
        for (let j = 1; j <= trailLength; j++) {
          const trailT = t - j * 100;
          const trailRadius = Math.sin(trailT * 0.01 * config.speed + i * 0.1) * 150 + 200;
          const trailX = width / 2 + Math.cos(angle + trailT * 0.005) * trailRadius;
          const trailY = height / 2 + Math.sin(angle + trailT * 0.005) * trailRadius;
          
          ctx.globalAlpha = (trailLength - j) / trailLength * 0.5;
          ctx.beginPath();
          ctx.arc(trailX, trailY, size * (trailLength - j) / trailLength, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    },

    'mandala': (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const layers = Math.floor(config.complexity / 10) + 3;
      
      for (let layer = 0; layer < layers; layer++) {
        const petals = 6 + layer * 2;
        const radius = 50 + layer * 30;
        
        for (let petal = 0; petal < petals; petal++) {
          const angle = (petal / petals) * Math.PI * 2 + t * 0.001 * config.speed;
          const petalRadius = radius + Math.sin(t * 0.01 + layer + petal) * 20;
          
          const x = centerX + Math.cos(angle) * petalRadius;
          const y = centerY + Math.sin(angle) * petalRadius;
          
          // Draw petal
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          ctx.strokeStyle = colorSchemes[config.colorScheme][0](t, layer * petals + petal);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 15, 5 + Math.sin(t * 0.02 + petal) * 3, 0, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.restore();
        }
      }
    },

    'flow-field': (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      const gridSize = Math.max(10, 50 - config.complexity / 3);
      const cols = Math.floor(width / gridSize);
      const rows = Math.floor(height / gridSize);
      
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const posX = x * gridSize + gridSize / 2;
          const posY = y * gridSize + gridSize / 2;
          
          // Calculate flow field angle
          const angle = Math.sin(posX * 0.01 + t * 0.001 * config.speed) * 
                       Math.cos(posY * 0.01 + t * 0.002 * config.speed) * Math.PI * 2;
          
          const length = 10 + Math.sin(posX * 0.02 + posY * 0.02 + t * 0.01) * 5;
          
          const endX = posX + Math.cos(angle) * length;
          const endY = posY + Math.sin(angle) * length;
          
          // Mouse interaction
          if (config.interactive) {
            const mouseDistance = Math.sqrt(
              Math.pow(posX - mousePos.x, 2) + Math.pow(posY - mousePos.y, 2)
            );
            const mouseInfluence = Math.max(0, 1 - mouseDistance / 100);
            const mouseAngle = Math.atan2(mousePos.y - posY, mousePos.x - posX);
            
            const finalAngle = angle + mouseAngle * mouseInfluence * 0.5;
            const finalLength = length * (1 + mouseInfluence);
            
            const finalEndX = posX + Math.cos(finalAngle) * finalLength;
            const finalEndY = posY + Math.sin(finalAngle) * finalLength;
            
            ctx.strokeStyle = colorSchemes[config.colorScheme][0](t, x + y * cols);
            ctx.lineWidth = 1 + mouseInfluence * 2;
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(finalEndX, finalEndY);
            ctx.stroke();
          } else {
            ctx.strokeStyle = colorSchemes[config.colorScheme][0](t, x + y * cols);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!isPlaying) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      patterns[config.pattern](ctx, canvas.width, canvas.height, time);

      setTime(prev => prev + config.speed);
      animationRef.current = requestAnimationFrame(animate);
      return () => {
  
};
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, isPlaying, time, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetArt = () => {
    setTime(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadArt = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `generative-art-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Generative Art Studio
            </CardTitle>
            <p className="text-pink-100">
              Interactive creative coding demonstrations with real-time parameter control
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Controls */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pattern</label>
                <Select 
                  value={config.pattern} 
                  onValueChange={(value) => setConfig(prev => ({ ...prev, pattern: value as ArtConfig['pattern'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fractal">Fractal Tree</SelectItem>
                    <SelectItem value="waves">Wave Interference</SelectItem>
                    <SelectItem value="particles">Particle System</SelectItem>
                    <SelectItem value="mandala">Sacred Geometry</SelectItem>
                    <SelectItem value="flow-field">Flow Field</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Scheme</label>
                <Select 
                  value={config.colorScheme} 
                  onValueChange={(value) => setConfig(prev => ({ ...prev, colorScheme: value as ArtConfig['colorScheme'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rainbow">Rainbow</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Speed: {config.speed}</label>
                <Slider
                  value={[config.speed]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, speed: value[0] }))}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Complexity: {config.complexity}</label>
                <Slider
                  value={[config.complexity]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, complexity: value[0] }))}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button onClick={togglePlayPause} variant="outline" className="flex items-center gap-2">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={resetArt} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={downloadArt} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Badge variant={config.interactive ? "default" : "secondary"} className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {config.interactive ? 'Interactive Mode' : 'Static Mode'}
              </Badge>
            </div>

            {/* Canvas */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full max-w-full h-auto cursor-crosshair"
                onMouseMove={config.interactive ? handleMouseMove : undefined}
              />
              
              {config.interactive && (
                <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                  Move mouse to interact
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Current Pattern:</strong> {config.pattern.replace('-', ' ')} - 
                This demonstrates advanced {config.pattern === 'flow-field' ? 'vector field mathematics' : 
                config.pattern === 'fractal' ? 'recursive algorithms' :
                config.pattern === 'particles' ? 'particle physics simulation' :
                config.pattern === 'mandala' ? 'geometric pattern generation' :
                'wave interference patterns'} using HTML5 Canvas and mathematical functions.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}