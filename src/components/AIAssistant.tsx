import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, X } from 'lucide-react';
import { useGame } from './GameContext'; // 1. Import the useGame hook

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface KnowledgeEntry {
  answer: string;
  followUp: string[];
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(['initial']);
  const [showNudge, setShowNudge] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { unlockAchievement } = useGame(); // 2. Get the unlock function from context

  const knowledge: Record<string, KnowledgeEntry> = {
    'initial': {
      answer: "Hi! I'm Bipul's AI assistant. I have been trained on his resume and projects. Feel free to ask me anything about his skills, experience, or specific project details.",
      followUp: ['objective', 'projects', 'skills']
    },
    'objective': {
      answer: "Bipul is an enthusiastic full-stack developer passionate about crafting user-friendly interfaces and efficient backend systems. He's eager to contribute to a dynamic, tech-driven team where he can continue to grow his skills.",
      followUp: ['skills', 'projects', 'contact']
    },
    'skills': {
      answer: "Bipul's expertise is in the MERN stack. For the frontend, he uses React, Next.js, and Tailwind CSS. For the backend, he builds RESTful APIs with Node.js and Express.js, connected to MongoDB or MySQL databases.",
      followUp: ['frontend_deep_dive', 'backend_deep_dive', 'projects']
    },
    'frontend_deep_dive': {
        answer: "On the frontend, he uses React and Next.js for building scalable UIs. He's skilled in state management and uses Tailwind CSS for styling. For data visualization, he has experience with Chart.js and Swiper.js for interactive components.",
        followUp: ['backend_deep_dive', 'projects', 'education']
    },
    'backend_deep_dive': {
        answer: "His backend skills are centered on Node.js and Express.js for creating RESTful APIs. He's comfortable with both MongoDB (NoSQL) and MySQL (SQL) for data persistence and has used Firebase for services like authentication.",
        followUp: ['frontend_deep_dive', 'devops', 'contact']
    },
    'devops': {
        answer: "Bipul has experience deploying applications to a variety of modern platforms, including Vercel and Netlify for frontends, and Render for full-stack applications. He also has experience with Hostinger.",
        followUp: ['skills', 'projects', 'achievements']
    },
    'projects': {
      answer: "He has built several key full-stack projects, including 'VeritasVault' (a blockchain credential verifier), 'Photoshare' (a social app), 'Digital Memory Lane', and a 'Country Data Visualiser'. Which one interests you most?",
      followUp: ['veritasvault', 'photoshare', 'memory_lane', 'data_visualiser']
    },
    'veritasvault': {
      answer: "VeritasVault is a universal credential verifier using blockchain technology. It's designed to enhance security and eliminate forgery by making records immutable. The tech stack includes Blockchain, Ledger, React, and Node.js.",
      followUp: ['photoshare', 'veritasvault_challenge', 'skills']
    },
    'veritasvault_challenge': {
        answer: "A key challenge in VeritasVault was integrating with various ledger technologies while ensuring data privacy on a potentially public blockchain. It was a great learning experience in dApp development and smart contracts.",
        followUp: ['photoshare', 'memory_lane', 'contact']
    },
    'photoshare': {
      answer: "Photoshare is a distraction-free photo sharing app built with Next.js, MongoDB, and Firebase. It focuses on sharing moments and opinions without the usual social media noise. A major challenge was optimizing image loading for performance.",
      followUp: ['veritasvault', 'memory_lane', 'skills']
    },
    'memory_lane': {
      answer: "Digital Memory Lane is a full-stack app using the MERN stack (MongoDB, Express, React, Node) plus Firebase and Tailwind CSS. It features RESTful APIs for efficient data handling and a responsive, accessible UI.",
      followUp: ['data_visualiser', 'skills', 'education']
    },
    'data_visualiser': {
      answer: "The Country Data Visualiser is a tool for real-time search and comparison of metrics like GDP. It was built with React, Node.js, and MongoDB, and uses Chart.js and Swiper.js for smooth, interactive data visualization.",
      followUp: ['veritasvault', 'certifications', 'contact']
    },
    'education': {
      answer: "He is currently pursuing his Master of Computer Applications (MCA) from Chandigarh University. He also holds a Bachelor of Computer Application (BCA) from Manipal University with an 8.63 CGPA, and a B.Sc. in Mathematics.",
      followUp: ['certifications', 'achievements', 'skills']
    },
    'certifications': {
      answer: "Bipul is an IBM Certified Full Stack Developer. He has also completed certifications in React.js from Infosys Springboard and multiple courses on Generative AI, including LangChain and LLMs.",
      followUp: ['achievements', 'projects', 'objective']
    },
    'achievements': {
      answer: "A key achievement was placing in the Top 5 at the PET Hackathon hosted by Punjab Engineering College in April 2024, showcasing his problem-solving and teamwork skills.",
      followUp: ['education', 'skills', 'contact']
    },
    'contact': {
      answer: "You can reach Bipul via email at bipulnandan276@gmail.com, or connect with him on GitHub (bipul276) and LinkedIn (bipul-nandan-0510a9328). He's always open to new opportunities!",
      followUp: ['objective', 'projects', 'skills']
    },
    'fallback': {
      answer: "That's a great question. I can tell you more about his skills in React and Node.js, or details about his projects like VeritasVault. What are you interested in?",
      followUp: ['skills', 'projects', 'education']
    }
  };
  
  const suggestionsDB: Record<string, string> = {
      'initial': "Where should we start?",
      'objective': "What's his career objective?",
      'skills': "What are his main skills?",
      'frontend_deep_dive': "Tell me more about his frontend skills.",
      'backend_deep_dive': "What about his backend skills?",
      'devops': "How does he deploy his apps?",
      'projects': "Show me his projects.",
      'veritasvault': "Tell me about VeritasVault.",
      'veritasvault_challenge': "What was a challenge in that project?",
      'photoshare': "What is Photoshare?",
      'memory_lane': "Tell me about Digital Memory Lane.",
      'data_visualiser': "What is the Country Data Visualiser?",
      'education': "What's his education?",
      'certifications': "Any certifications?",
      'achievements': "What are his achievements?",
      'contact': "How can I contact him?",
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        text: knowledge['initial'].answer,
        sender: 'ai',
        timestamp: new Date()
      }]);
      setCurrentSuggestions(knowledge['initial'].followUp);
    }
  }, []);

  useEffect(() => {
    if (isMinimized) {
      const nudgeTimer = setTimeout(() => setShowNudge(true), 2000);
      const hideNudgeTimer = setTimeout(() => setShowNudge(false), 7000);
      return () => {
        clearTimeout(nudgeTimer);
        clearTimeout(hideNudgeTimer);
      };
    } else {
      setShowNudge(false);
    }
  }, [isMinimized]);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        (viewport as HTMLElement).scrollTop = (viewport as HTMLElement).scrollHeight;
      }, 100);
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): KnowledgeEntry => {
    const message = userMessage.toLowerCase().trim();
    const keywords: Record<string, string[]> = {
        'veritasvault': ['veritasvault', 'blockchain', 'credential'],
        'photoshare': ['photoshare', 'photo'],
        'memory_lane': ['memory', 'lane'],
        'data_visualiser': ['data', 'visualiser', 'country', 'chart'],
        'veritasvault_challenge': ['challenge', 'difficult', 'hard part'],
        'objective': ['objective', 'goal', 'career'],
        'skills': ['skill', 'tech', 'stack', 'language', 'proficient'],
        'frontend_deep_dive': ['front-end', 'frontend', 'react', 'next.js', 'tailwind'],
        'backend_deep_dive': ['back-end', 'backend', 'node', 'express', 'api'],
        'devops': ['deploy', 'hosting', 'vercel', 'render'],
        'projects': ['project', 'work', 'built'],
        'education': ['education', 'degree', 'college', 'university', 'school'],
        'certifications': ['certification', 'certificate', 'course', 'ibm'],
        'achievements': ['achievement', 'hackathon', 'winner'],
        'contact': ['contact', 'hire', 'email', 'linkedin', 'github'],
    };

    const matchedKey = Object.keys(keywords).find(key =>
        keywords[key as keyof typeof keywords].some(k => message.includes(k))
    );

    if (matchedKey && knowledge[matchedKey]) {
        return knowledge[matchedKey];
    }
    return knowledge['fallback'];
  };

  const processMessage = (text: string) => {
    // 3. Call the unlock function when a message is processed
    unlockAchievement('ai-chat');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseEntry = getAIResponse(text);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseEntry.answer,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setCurrentSuggestions(aiResponseEntry.followUp);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    processMessage(inputValue);
  };

  const handleSuggestionClick = (suggestionKey: string) => {
    const suggestionText = suggestionsDB[suggestionKey];
    if (suggestionText) {
        processMessage(suggestionText);
    }
  };

  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.div key="minimized-wrapper" className="fixed bottom-4 right-4 z-50 flex items-end gap-2">
           <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-card p-2 px-4 rounded-lg shadow-lg text-sm mb-2"
              >
                <p>How can I help you?</p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Button onClick={() => setIsMinimized(false)} aria-label="Open AI Assistant" className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg text-white">
              <Bot className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="maximized" 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 50 }} 
          className="fixed inset-y-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
          <Card className="shadow-2xl border-purple-200 dark:border-purple-800 flex flex-col h-full overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="relative"><Bot className="h-6 w-6" /><div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-purple-500" /></div>
                  AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} aria-label="Minimize AI Assistant" className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"><X className="h-4 w-4" /></Button>
              </div>
            </CardHeader>

            <div className="flex flex-col flex-grow bg-card min-h-0">
              <ScrollArea ref={scrollAreaRef} className="flex-grow">
                <div className="space-y-4 p-4">
                  {messages.map((message) => (
                    <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender === 'ai' && (<Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0"><AvatarFallback className="text-white bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>)}
                      <div className={`max-w-[80%] rounded-lg p-3 text-sm ${message.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-muted'}`}><p className="whitespace-pre-wrap">{message.text}</p></div>
                      {message.sender === 'user' && (<Avatar className="w-8 h-8 bg-blue-600 flex-shrink-0"><AvatarFallback className="text-white bg-transparent"><User className="h-4 w-4" /></AvatarFallback></Avatar>)}
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500"><AvatarFallback className="text-white bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
                      <div className="bg-muted rounded-lg p-3 flex items-center"><div className="flex gap-1"><div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" /><div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '0.2s' }} /></div></div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border flex-shrink-0">
                {!isTyping && currentSuggestions.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentSuggestions.map((key) => (
                        <Button key={key} variant="outline" size="sm" onClick={() => handleSuggestionClick(key)} className="text-xs h-auto py-1 px-2">{suggestionsDB[key]}</Button>
                      ))}
                    </div>
                  </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                  <div className="flex gap-2">
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask another question..." className="flex-1" />
                    <Button type="submit" disabled={!inputValue.trim() || isTyping} size="icon"><Send className="h-4 w-4" /></Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
