import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Copy, Palette, Zap, Sparkles, Code2 } from 'lucide-react';
import { useGame } from './GameContext'; // 1. Import the useGame hook

interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'css';
  code: string;
  category: 'animation' | 'interaction' | 'visualization';
}

export function LiveCodePlayground() {
  const [selectedExample, setSelectedExample] = useState<string>('particle-system');
  const [currentCode, setCurrentCode] = useState<string>('');
  const [outputMessage, setOutputMessage] = useState<string>('');
  const outputRef = useRef<HTMLIFrameElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const { unlockAchievement } = useGame(); // 2. Get the unlock function from context

  const codeExamples: CodeExample[] = [
    {
      id: 'particle-system',
      title: 'Interactive Particles',
      description: 'A particle system that reacts to mouse movement.',
      language: 'javascript',
      category: 'interaction',
      code: `// This script is wrapped in a function that returns a cleanup method.
return (canvas) => {
  let animationId;
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 300;

  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.01;
      this.size = Math.random() * 3 + 1;
      this.color = \`hsl(\${Math.random() * 60 + 200}, 70%, 60%)\`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.98; this.vy *= 0.98;
      this.life -= this.decay;
      return this.life > 0;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];
  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    for(let i = 0; i < 2; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  };
  canvas.addEventListener('mousemove', handleMouseMove);

  function animate() {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.update() && (p.draw(ctx), true));
    animationId = requestAnimationFrame(animate);
  }
  animate();

  // Return a cleanup function to be called when the script is stopped
  return () => {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener('mousemove', handleMouseMove);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
};`
    },
    {
      id: 'data-visualization',
      title: 'Animated Bar Chart',
      description: 'A simple bar chart with D3.js-style animations. Click to reset.',
      language: 'javascript',
      category: 'visualization',
      code: `// This script is wrapped in a function that returns a cleanup method.
return (canvas) => {
  let animationId;
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 300;

  const data = [
    { label: 'React', value: 85, color: '#61dafb' },
    { label: 'JS', value: 90, color: '#f7df1e' },
    { label: 'TS', value: 80, color: '#3178c6' },
    { label: 'Node', value: 75, color: '#339933' },
    { label: 'Python', value: 70, color: '#3776ab' }
  ];
  let animationProgress = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = 50;
    const spacing = 25;
    data.forEach((item, i) => {
      const x = spacing + i * (barWidth + spacing);
      const barHeight = (item.value / 100) * (canvas.height - 50) * animationProgress;
      const y = canvas.height - 30 - barHeight;
      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, canvas.height - 10);
    });
  }

  function animate() {
    if (animationProgress < 1) animationProgress += 0.02;
    draw();
    animationId = requestAnimationFrame(animate);
  }
  animate();

  const handleClick = () => { animationProgress = 0; };
  canvas.addEventListener('click', handleClick);

  // Return a cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener('click', handleClick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
};`
    },
    {
      id: 'neural-network',
      title: 'Neural Network Viz',
      description: 'An interactive visualization of a neural network. Neurons react to the mouse.',
      language: 'javascript',
      category: 'visualization',
      code: `// This script is wrapped in a function that returns a cleanup method.
return (canvas) => {
  let animationId;
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 300;
  let mouse = { x: -100, y: -100 };

  class Neuron {
    constructor(x, y) { this.x = x; this.y = y; this.ox = x; this.oy = y; }
    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        this.x += dx / dist * 2;
        this.y += dy / dist * 2;
      } else {
        this.x += (this.ox - this.x) * 0.1;
        this.y += (this.oy - this.y) * 0.1;
      }
    }
    draw(ctx) {
      const pulse = Math.sin(Date.now() * 0.005 + this.x * 0.01) * 0.5 + 0.5;
      const radius = 5 + pulse * 3;
      ctx.fillStyle = \`rgba(74, 144, 226, \${0.5 + pulse * 0.5})\`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const layers = [4, 5, 3];
  const neurons = [];
  layers.forEach((count, i) => {
    for (let j = 0; j < count; j++) {
      const x = 50 + i * 150;
      const y = 50 + j * 50;
      neurons.push(new Neuron(x, y));
    }
  });

  const handleMouseMove = e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };
  canvas.addEventListener('mousemove', handleMouseMove);

  function animate() {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    neurons.forEach(n => { n.update(); n.draw(ctx); });
    animationId = requestAnimationFrame(animate);
  }
  animate();

  // Return a cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener('mousemove', handleMouseMove);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
};`
    },
    {
      id: 'morphing-shapes',
      title: 'Morphing Shapes',
      description: 'CSS animations with complex transformations. Hover over the shape.',
      language: 'css',
      category: 'animation',
      code: `.shape-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #1a1a2e;
}
.morphing-shape {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #e94560, #16213e);
  animation: morph 8s ease-in-out infinite;
  transition: transform 0.3s ease, border-radius 0.3s ease;
}
.morphing-shape:hover {
  transform: scale(1.2) rotate(45deg);
  border-radius: 50%;
}
@keyframes morph {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(180deg) scale(1.1); }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}`
    }
  ];

  useEffect(() => {
    const example = codeExamples.find(ex => ex.id === selectedExample);
    if (example) {
      setCurrentCode(example.code);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      setOutputMessage('');
    }
  }, [selectedExample]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const runCode = () => {
    // 3. Call the unlock function when code is run
    unlockAchievement('code-runner');

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    try {
      const example = codeExamples.find(ex => ex.id === selectedExample);
      if (!example) return;

      if (example.language === 'javascript') {
        const canvas = document.getElementById('playground-canvas') as HTMLCanvasElement;
        if (!canvas) {
          setOutputMessage('Error: Canvas element not found.');
          return;
        }
        
        const wrapperFunction = new Function(currentCode)();
        const cleanup = wrapperFunction(canvas);
        cleanupRef.current = cleanup;

      } else if (example.language === 'css') {
        const htmlContent = `<!DOCTYPE html><html><head><style>html, body { margin:0; height: 100%; } ${currentCode}</style></head><body><div class="shape-container"><div class="morphing-shape"></div></div></body></html>`;
        if (outputRef.current) {
          outputRef.current.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
        }
      }
      setOutputMessage('Code executed successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setOutputMessage(`Error: ${message}`);
    }
  };

  const resetCode = () => {
    const example = codeExamples.find(ex => ex.id === selectedExample);
    if (example) {
      setCurrentCode(example.code);
      setOutputMessage('');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setOutputMessage('Code copied to clipboard!');
  };

  const currentExample = codeExamples.find(ex => ex.id === selectedExample);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-[#0d1117] border-gray-800">
          <CardHeader className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-white border-b border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg"><Code2 className="h-6 w-6" /> Live Code Playground</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Experiment with real code examples showcasing advanced web development techniques.</p>
              </div>
              <Badge variant="outline" className="border-purple-400 text-purple-400">Interactive</Badge>
            </div>
          </CardHeader>

          <div className="p-4 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedExample} onValueChange={setSelectedExample}>
                <SelectTrigger className="w-full sm:w-64 bg-[#161b22] border-gray-700">
                  <SelectValue placeholder="Select an example" />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-gray-700 text-white">
                  {codeExamples.map(example => (
                    <SelectItem key={example.id} value={example.id}>
                      <div className="flex items-center gap-2">
                        {example.category === 'visualization' && <Palette className="h-4 w-4 text-blue-400" />}
                        {example.category === 'animation' && <Zap className="h-4 w-4 text-yellow-400" />}
                        {example.category === 'interaction' && <Sparkles className="h-4 w-4 text-pink-400" />}
                        {example.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button onClick={runCode} className="bg-green-600 hover:bg-green-700 text-white"><Play className="h-4 w-4 mr-2" /> Run Code</Button>
                <Button variant="outline" className="bg-[#161b22] border-gray-700" onClick={resetCode}><RotateCcw className="h-4 w-4" /></Button>
                <Button variant="outline" className="bg-[#161b22] border-gray-700" onClick={copyCode}><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
            {currentExample && (
              <div className="mt-3">
                <p className="text-sm text-gray-400">{currentExample.description}</p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 bg-[#010409]">
            {/* Code Editor */}
            <div className="flex flex-col">
              <div className="p-2 text-sm font-medium text-gray-400 border-b border-r border-gray-800">Code Editor</div>
              <div className="p-2 flex-grow border-r border-gray-800">
                <textarea
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  className="w-full h-[400px] font-mono text-sm bg-[#0d1117] text-gray-300 p-4 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col">
              <div className="p-2 text-sm font-medium text-gray-400 border-b border-gray-800">Live Output</div>
              <div className="p-2 flex-grow flex items-center justify-center">
                {currentExample?.language === 'javascript' ? (
                  <canvas id="playground-canvas" width={400} height={300} className="border border-gray-700 rounded-md" />
                ) : (
                  <iframe ref={outputRef} className="w-full h-[400px] border border-gray-700 rounded-md" title="CSS Output" />
                )}
              </div>
              {outputMessage && (
                <div className="p-2 border-t border-gray-800 text-xs font-mono text-gray-500">
                  <span className={outputMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}>
                    {'>'} {outputMessage}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
