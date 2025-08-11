import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Calendar, Code, Download, Menu, X, Terminal, Trophy } from "lucide-react";

// Import custom components
import { GameProvider, useGame } from './components/GameContext';
import { SkillsVisualization } from './components/SkillsVisualization';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { ProjectShowcase } from './components/ProjectShowcase';
import { GitHubStats } from './components/GitHubStats';
import { ThemeToggle } from './components/ThemeToggle';
import { AIAssistant } from './components/AIAssistant';
import { LiveCodePlayground } from './components/LiveCodePlayground';
import { GameifiedExperience } from './components/GameifiedExperience';
import { FloatingElements } from './components/FloatingElements';
import { AppleStyleHero } from './components/AppleStyleHero';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  // Get all necessary functions from the game context
  const { trackSectionVisit, trackResumeDownload, trackProfessionalLinkClick } = useGame();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'playground', 'github', 'achievements', 'terminal', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
        trackSectionVisit(currentSection); 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackSectionVisit]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'playground', label: 'Playground' },
    { id: 'github', label: 'GitHub' },
    { id: 'achievements', label: 'Game' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'contact', label: 'Contact' }
  ];

  // Wrapper functions to trigger achievements
  const handleResumeDownload = () => {
    trackResumeDownload();
  };

  const handleLinkedInClick = () => {
    trackProfessionalLinkClick();
  };
  
  const handleEmailClick = () => {
	trackProfessionalLinkClick();
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <FloatingElements />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Bipul Nandan
            </motion.h1>
            
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className={`text-sm font-medium transition-colors relative ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeSection"
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <div className="hidden md:flex space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <a href="https://github.com/bipul276" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github className="h-4 w-4" /></a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://www.linkedin.com/in/bipul-nandan-0510a9328" onClick={handleLinkedInClick} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="lg:hidden mt-4 pt-4 border-t"
            >
              <div className="flex flex-col space-y-3">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <main>
        <section id="home">
            <AppleStyleHero onScrollToSection={scrollToSection} />
        </section>

        <section id="about" className="py-20 bg-muted/30 relative z-10">
            <div className="container mx-auto px-4">
                <motion.div 
                    className="max-w-6xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">I'm a passionate full-stack developer with a Computer Science degree and hands-on experience in modern web technologies. My journey in software development has been driven by curiosity and a desire to solve real-world problems through elegant code.</p>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">I specialize in React, Node.js, and cloud technologies, with a strong focus on creating scalable, maintainable applications. I'm particularly interested in developer experience, performance optimization, and emerging technologies like AI/ML integration.</p>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">When I'm not coding, you'll find me contributing to open source projects or exploring new frameworks and tools that push the boundaries of web development.</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mohali, India</div>
                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Available for hire</div>
                            </div>
                            <div className="flex gap-4">
                                <Badge variant="secondary" className="px-3 py-1">Problem Solver</Badge>
                                <Badge variant="secondary" className="px-3 py-1">Team Player</Badge>
                                <Badge variant="secondary" className="px-3 py-1">Fast Learner</Badge>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Card>
                                <CardHeader><CardTitle>Education & Achievements</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold">Bachelor in Computer Application</h4>
                                        <p className="text-sm text-muted-foreground">Manipal University, Jaipur(Online)</p>
                                        <p className="text-sm text-muted-foreground">2021 - 2024 | GPA: 8.63/10</p>
                                        <h4 className="font-semibold mt-4">Bachelor in Mathematics</h4>
                                        <p className="text-sm text-muted-foreground">L.N.M.U., Darbhanga(Regular)</p>
                                        <p className="text-sm text-muted-foreground">2020 - 2023 | Honours: Mathematics</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="font-semibold">Key Achievements</h4>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                            <li>5 Star on Hackerrank in Java, Problem Solving, SQL</li>
                                            <li>PEC Hackathon</li>
                                            <li>IBM Full Stack Web Developer Coursera</li>
                                        </ul>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="font-semibold">Relevant Coursework</h4>
                                        <p className="text-sm text-muted-foreground">React.js - Infosys Springboard, GenAI Summarisation with LangChain, Generative AI, LLMs, AI Agents, Curson AI, Data Structure</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>

        <section id="skills" className="py-20 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
                <SkillsVisualization />
            </div>
        </section>

        <section id="projects" className="py-20 bg-muted/30 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
                <ProjectShowcase />
            </div>
        </section>

        <section id="playground" className="py-20 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2"><Code className="h-8 w-8" /> Live Code Playground</h2>
                <LiveCodePlayground />
            </div>
        </section>

        <section id="github" className="py-20 bg-muted/30 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2"><Github className="h-8 w-8" /> GitHub Analytics</h2>
                <GitHubStats username="bipul276" />
            </div>
        </section>

        <section id="achievements" className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2"><Trophy className="h-8 w-8" /> Achievement System</h2>
            <GameifiedExperience />
          </div>
        </section>

        <section id="terminal" className="py-20 bg-muted/30 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2"><Terminal className="h-8 w-8" /> Interactive Terminal</h2>
                <InteractiveTerminal />
                <p className="text-center text-sm text-muted-foreground mt-4">Try commands like: help, about, skills, projects, contact</p>
            </div>
        </section>

        <section id="contact" className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Let's Build Something Amazing Together</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">I'm always excited about new opportunities and connecting with fellow developers. Whether you have a project in mind or just want to chat about technology, I'd love to hear from you!</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <a href="mailto:bipulnandan276@gmail.com" onClick={handleEmailClick} className="block h-full">
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                      <Mail className="h-8 w-8 mb-4 text-primary" />
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">bipulnandan276@gmail.com</p>
                    </CardContent>
                  </a>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <a href='https://www.linkedin.com/in/bipul-nandan-0510a9328' onClick={handleLinkedInClick} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                      <Linkedin className="h-8 w-8 mb-4 text-primary" />
                      <h3 className="font-semibold mb-1">LinkedIn</h3>
                      <p className="text-sm text-muted-foreground">Connect professionally</p>
                    </CardContent>
                  </a>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <a href='https://github.com/bipul276' target="_blank" rel="noopener noreferrer" className="block h-full">
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                      <Github className="h-8 w-8 mb-4 text-primary" />
                      <h3 className="font-semibold mb-1">GitHub</h3>
                      <p className="text-sm text-muted-foreground">View my code</p>
                    </CardContent>
                  </a>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="mailto:bipulnandan276@gmail.com" onClick={handleEmailClick} className="flex items-center gap-2"><Mail className="h-4 w-4" /> Send Email</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://www.linkedin.com/in/bipul-nandan-0510a9328" onClick={handleLinkedInClick} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> Connect on LinkedIn</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/Bipul_resume.pdf" download="Bipul_Nandan_resume.pdf" onClick={handleResumeDownload} className="flex items-center gap-2"><Download className="h-4 w-4" /> Download Resume</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">&copy; 2025 Bipul Nandan. All Rights Reserved.</p>
                <div className="flex items-center space-x-4">
                    <a href="https://github.com/bipul276" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                    <a href="https://www.linkedin.com/in/bipul-nandan-0510a9328" target="_blank" rel="noopener noreferrer" onClick={handleLinkedInClick} className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                    <a href="mailto:bipulnandan276@gmail.com" onClick={handleEmailClick} className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
                </div>
            </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
}

// The main App component now wraps everything with the GameProvider
export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
