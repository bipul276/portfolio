import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
  description: string;
}

export function SkillsVisualization() {
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [animatedLevels, setAnimatedLevels] = useState<{[key: string]: number}>({});

  const skillCategories: Record<string, SkillCategory> = {
    frontend: {
      title: 'Frontend Development',
      icon: '🎨',
      description: 'Creating beautiful and interactive user interfaces',
      skills: [
        { name: 'React/Next.js', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'Tailwind CSS', level: 80 },
        { name: 'Bootstrap', level: 92 },
        { name: 'JavaScript (ES6+)', level: 88},
        { name: 'WordPress', level: 75 },
        { name: 'Chart.js', level: 86 },
        { name: 'Swiper.js', level: 87 }
      ]
    },
    backend: {
      title: 'Backend Development',
      icon: '⚙️',
      description: 'Building robust and scalable server-side applications',
      skills: [
        { name: 'Node.js/Express', level: 85},
        { name: 'MySQL', level: 82 },
        { name: 'MongoDB', level: 78 },
        { name: 'REST APIs', level: 88 },
        { name: 'GraphQL', level: 70 }
      ]
    },
    devops: {
      title: 'DevOps & Tools',
      icon: '🚀',
      description: 'Deployment, monitoring, and development tools',
      skills: [
        { name: 'Git/GitHub', level: 92 },
        { name: 'Docker', level: 75},
        { name: 'Firebase', level: 70 },
        { name: 'CI/CD', level: 68},
        { name: 'Hostinger', level: 80},
        { name: 'Render', level: 94 },
        { name: 'Jest', level: 78 },
        { name: 'Vercel/Netlify', level: 81 },
      ]
    }
  };

  useEffect(() => {
    const newAnimatedLevels: {[key: string]: number} = {};
    skillCategories[selectedCategory].skills.forEach(skill => {
      newAnimatedLevels[skill.name] = 0;
    });
    setAnimatedLevels(newAnimatedLevels);

    const timer = setTimeout(() => {
      skillCategories[selectedCategory].skills.forEach(skill => {
        setTimeout(() => {
          setAnimatedLevels(prev => ({ ...prev, [skill.name]: skill.level }));
        }, Math.random() * 500);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="w-full">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(skillCategories).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(skillCategories).map(([key, category]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            
                          </div>
                          <Badge variant="outline">{skill.level}%</Badge>
                        </div>
                        <Progress 
                          value={animatedLevels[skill.name] || 0} 
                          className="h-2"
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}