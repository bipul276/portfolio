import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Search, Calendar, Users, Star, GitBranch } from 'lucide-react';
import { useGame } from './GameContext'; // 1. Import the useGame hook

// Interface for a single project
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  category: string;
  liveDemo?: string;
  github: string;
  status: 'completed' | 'in-progress' | 'maintained';
  features: string[];
  challenges: string[];
  learnings: string[];
  stats?: {
    stars: number;
    forks: number;
    commits: number;
    contributors: number;
  };
  timeline: string;
}

// --- GitHub API Fetching Logic ---
async function fetchGitHubStats(repoUrl: string): Promise<Project['stats']> {
  const defaultStats = { stars: 0, forks: 0, commits: 0, contributors: 0 };
  if (!repoUrl || repoUrl === '#') return defaultStats;

  const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!match) return defaultStats;
  const repoPath = match[1];

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`);
    if (!repoRes.ok) throw new Error(`Repo data fetch failed: ${repoRes.status}`);
    const repoData = await repoRes.json();

    const contributorsRes = await fetch(`https://api.github.com/repos/${repoPath}/contributors`);
    let contributorsCount = 0;
    if (contributorsRes.ok) {
      const contributorsData = await contributorsRes.json();
      contributorsCount = contributorsData.length;
    }
    
    return {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      commits: 0, // Placeholder
      contributors: contributorsCount,
    };
  } catch (error) {
    console.error(`Failed to fetch stats for ${repoPath}:`, error);
    return defaultStats;
  }
}

const projectsData: Project[] = [
    {
      id: '1',
      title: 'Certnet',
      description: 'A universal credential verifier using blockchain technology.',
      longDescription: 'VeritasVault leverages blockchain for enhanced security and immutability, eliminating forgery and tampering of credentials. It provides instant, efficient, and cost-effective verification, reducing administrative overhead and empowering individuals with lifelong control over their universally accessible certificates.',
      image: '/certnet.png',
      techStack: ['Blockchain', 'Ledger', 'React.js', 'Express.js', 'Node.js'],
      category: 'fullstack',
      github: 'https://github.com/bipul276/certnet',
      status: 'in-progress',
      features: ['Enhanced Security & Immutability', 'Instant & Efficient Verification', 'Significant Cost Reduction', 'Global Accessibility & Portability'],
      challenges: ['Integrating with various ledger technologies', 'Ensuring data privacy on a public blockchain', 'Designing a user-friendly interface for a complex system'],
      learnings: ['Decentralized application (dApp) development', 'Smart contract implementation', 'Cryptographic principles', 'Advanced security protocols'],
      timeline: 'Jul 2024 - Present'
    },
    {
      id: '2',
      title: 'Photoshare',
      description: 'A photo sharing app focused on sharing opinions without distractions.',
      longDescription: 'Photoshare is a minimalist social media application designed for users to share moments and discover photos from around the world. The core focus is on the visual content and user opinions, stripping away distracting elements for a pure photo-sharing experience.',
      image: '/digimora.png',
      techStack: ['Next.js', 'REST APIs', 'MongoDB', 'Firebase', 'Tailwind CSS'],
      category: 'fullstack',
      github: 'https://github.com/bipul276/digimora',
      status: 'in-progress',
      features: ['Distraction-free photo sharing', 'User authentication via Firebase', 'Explore and Home feeds', 'Opinion and commenting system', 'Responsive design for all devices'],
      challenges: ['Optimizing image loading for performance', 'Building a scalable backend with REST APIs', 'Implementing a real-time feedback system'],
      learnings: ['Server-side rendering with Next.js', 'Firebase authentication and storage integration', 'Advanced Tailwind CSS techniques', 'NoSQL database modeling'],
      timeline: 'Jul 2024 - Present'
    },
    {
      id: '3',
      title: 'Digital Memory Lane',
      description: 'An application for efficient handling and display of memory data.',
      longDescription: 'Digital Memory Lane allows users to store and browse their memories through a responsive and accessible user interface. It features efficient data handling via a custom RESTful API and a clean UI built with React and Tailwind CSS.',
      image: '/virtualmemorylane.png',
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Firebase', 'Tailwind CSS'],
      category: 'fullstack',
      liveDemo: 'https://www.digitalmemorylane.com/',
      github: 'https://github.com/bipul276/virmemorylane',
      status: 'completed',
      features: ['RESTful APIs for memory data handling', 'Responsive and accessible UI', 'User authentication with Firebase', 'Secure data storage in MongoDB'],
      challenges: ['Designing an intuitive user experience for browsing memories', 'Ensuring efficient data retrieval and display', 'Optimizing for accessibility standards'],
      learnings: ['Building robust REST APIs with Express.js', 'State management in React for complex UIs', 'Integrating Firebase services in a MERN stack application'],
      timeline: '4 months'
    },
    {
      id: '4',
      title: 'Country Data Visualiser',
      description: 'A real-time tool to search and compare key country metrics.',
      longDescription: 'This tool provides a dynamic way to explore and compare country data, such as GDP and life expectancy. It features real-time search and smooth, interactive charts and visual components for an engaging user experience.',
      image: '/countrydatav.png',
      techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Chart.js', 'Swiper.js'],
      category: 'fullstack',
      github: 'https://github.com/bipul276/countrydatavisualiser',
      status: 'completed',
      features: ['Real-time search and comparison of country data', 'Interactive charts with Chart.js', 'Smooth navigation with Swiper.js', 'Responsive design for data visualization'],
      challenges: ['Fetching and processing large datasets in real-time', 'Creating interactive and mobile-friendly charts', 'Ensuring smooth performance during data updates'],
      learnings: ['Data visualization with Chart.js', 'Integrating third-party libraries like Swiper.js in React', 'Handling real-time data streams', 'Frontend performance optimization'],
      timeline: '3 months'
    }
  ];

export function ProjectShowcase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [projectStats, setProjectStats] = useState<{ [key: string]: Project['stats'] }>({});
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { trackProjectView } = useGame(); // 2. Get the tracking function

  useEffect(() => {
    const fetchAllProjectStats = async () => {
      setIsLoadingStats(true);
      const statsPromises = projectsData.map(p => fetchGitHubStats(p.github));
      const allStats = await Promise.all(statsPromises);
      
      const statsMap = projectsData.reduce((acc, project, index) => {
        acc[project.id] = allStats[index];
        return acc;
      }, {} as { [key: string]: Project['stats'] });

      setProjectStats(statsMap);
      setIsLoadingStats(false);
    };

    fetchAllProjectStats();
  }, []);

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'devops', label: 'DevOps' }
  ];

  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'maintained': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleViewDetails = (project: Project) => {
    // 3. Call the tracking function when the user clicks the button
    trackProjectView();
    setOpenProject({ ...project, stats: projectStats[project.id] });
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects, technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => {
          const stats = projectStats[project.id];
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image+Error'; }} />
                  <div title={project.status.replace('-', ' ')} className="absolute top-3 right-3"><div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)} ring-2 ring-white`} /></div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="flex-1">{project.title}</CardTitle>
                    <div className="flex gap-1">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Button variant="ghost" size="icon"><Github className="h-4 w-4" /></Button></a>
                      {project.liveDemo && project.liveDemo !== '#' && (
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                          <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                        </a>
                      )}
                    </div>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map(tech => (<Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>))}
                  </div>
                  <div className="flex-grow" />
                  <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-4">
                      {isLoadingStats ? (
                        <span className="text-xs">Loading stats...</span>
                      ) : stats ? (
                        <>
                          <span className="flex items-center gap-1.5" title={`${stats.stars} stars`}>
                            <Star className="h-3.5 w-3.5 text-yellow-500" />{stats.stars}
                          </span>
                          <span className="flex items-center gap-1.5" title={`${stats.forks} forks`}>
                            <GitBranch className="h-3.5 w-3.5 text-blue-500" />{stats.forks}
                          </span>
                        </>
                      ) : null}
                    </div>
                    {/* Use the new handler function here */}
                    <Button variant="outline" onClick={() => handleViewDetails(project)}>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground"><p>No projects found matching your criteria.</p></div>
      )}

      {/* Dialog with dynamic stats */}
      <Dialog open={!!openProject} onOpenChange={(isOpen) => !isOpen && setOpenProject(null)}>
        {openProject && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl flex items-center gap-3">{openProject.title}<span title={openProject.status} className={`w-3 h-3 rounded-full ${getStatusColor(openProject.status)}`}/></DialogTitle>
                  <DialogDescription className="mt-1">{openProject.longDescription}</DialogDescription>
                </div>
                <div className="flex gap-2">
                  <a href={openProject.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Button variant="outline" size="icon"><Github className="h-4 w-4" /></Button></a>
                  {openProject.liveDemo && openProject.liveDemo !== '#' && (
                    <a href={openProject.liveDemo} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                      <Button variant="outline" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                  )}
                </div>
              </div>
            </DialogHeader>
            <div className="p-6">
              <Tabs defaultValue="overview" className="mt-2">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="challenges">Learnings</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="overview" className="space-y-6">
                    <img src={openProject.image.replace('400x200', '800x400')} alt={openProject.title} className="w-full h-64 object-cover rounded-lg border" onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image+Error'; }} />
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">{openProject.techStack.map(tech => (<Badge key={tech} variant="secondary">{tech}</Badge>))}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Project Timeline</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />{openProject.timeline}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="features" className="space-y-3">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">{openProject.features.map((feature, idx) => (<li key={idx} className="text-sm flex items-start gap-3"><span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" /><span>{feature}</span></li>))}</ul>
                  </TabsContent>
                  <TabsContent value="challenges" className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Technical Challenges</h4>
                      <ul className="space-y-2 mb-4">{openProject.challenges.map((challenge, idx) => (<li key={idx} className="text-sm flex items-start gap-3"><span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" /><span>{challenge}</span></li>))}</ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Key Learnings</h4>
                      <ul className="space-y-2">{openProject.learnings.map((learning, idx) => (<li key={idx} className="text-sm flex items-start gap-3"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" /><span>{learning}</span></li>))}</ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="stats">
                    {isLoadingStats ? <p>Loading stats...</p> : openProject.stats ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="text-center"><CardHeader className="p-4"><Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" /><CardTitle>{openProject.stats.stars}</CardTitle><CardDescription>Stars</CardDescription></CardHeader></Card>
                        <Card className="text-center"><CardHeader className="p-4"><GitBranch className="h-6 w-6 mx-auto mb-2 text-blue-500" /><CardTitle>{openProject.stats.forks}</CardTitle><CardDescription>Forks</CardDescription></CardHeader></Card>
                        <Card className="text-center"><CardHeader className="p-4"><div className="h-6 w-6 mx-auto mb-2 text-green-500"><svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full"><path d="M10.5 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"></path><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0"></path></svg></div><CardTitle>{openProject.stats.commits}</CardTitle><CardDescription>Commits</CardDescription></CardHeader></Card>
                        <Card className="text-center"><CardHeader className="p-4"><Users className="h-6 w-6 mx-auto mb-2 text-purple-500" /><CardTitle>{openProject.stats.contributors}</CardTitle><CardDescription>Contributors</CardDescription></CardHeader></Card>
                      </div>
                    ) : <p>Stats could not be loaded.</p>}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
