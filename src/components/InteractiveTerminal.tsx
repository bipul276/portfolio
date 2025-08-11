import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { useGame } from "./GameContext";

// --- TYPES ---
interface Command {
  input: string;
  output: string;
  type: 'success' | 'error' | 'info';
}

interface CommandDefinition {
  output?: string;
  handler?: () => Promise<string>;
  type: 'success' | 'error' | 'info';
}

// --- API FETCHING LOGIC ---
async function getGitHubStats(): Promise<string> {
  const username = 'bipul276';
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error('Failed to fetch user data from GitHub API.');
    const userData = await userRes.json();

    const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!repoRes.ok) throw new Error('Failed to fetch repository data.');
    const repoData = await repoRes.json();
    
    const projectCount = repoData.filter((repo: any) => !repo.fork).length;

    return `🔗 GitHub Profile: https://github.com/${username}

📊 Live Stats:
• ${userData.public_repos} public repositories
• ${projectCount} original projects
• Actively contributing to open source`;

  } catch (error) {
    console.error("GitHub API Error:", error);
    return 'Error: Could not fetch GitHub stats. The API rate limit may have been reached.';
  }
}

export function InteractiveTerminal() {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { unlockAchievement } = useGame();

  // --- PERSONALIZED COMMAND DEFINITIONS ---
  const availableCommands: { [key: string]: CommandDefinition } = {
    help: {
      output: `Available commands:
• about - Learn more about me
• skills - View my technical skills
• projects - List my key projects
• education - View my educational background
• contact - Get my contact information
• github - View my GitHub profile stats
• clear - Clear terminal`,
      type: 'info'
    },
    about: {
      output: `👨‍💻 Bipul Nandan - Full Stack Developer

An enthusiastic developer passionate about crafting user-friendly interfaces and efficient backend systems. Eager to contribute to a dynamic, tech-driven team and continuously grow my skills.`,
      type: 'success'
    },
    skills: {
      output: `🚀 Technical Skills:

• Frontend: React, Next.js, Tailwind CSS, Chart.js, Swiper.js
• Backend: Node.js, Express.js (RESTful APIs)
• Databases: MongoDB, MySQL
• Other: Firebase, Blockchain, Ledger, Git, Vercel/Netlify/Render`,
      type: 'success'
    },
    projects: {
      output: `📁 Key Projects:

1. VeritasVault - A universal credential verifier using blockchain.
2. Photoshare - A distraction-free photo sharing social app.
3. Digital Memory Lane - A full-stack MERN application.
4. Country Data Visualiser - A real-time data comparison tool.`,
      type: 'success'
    },
    education: {
        output: `🎓 Education:

• Master of Computer Applications (MCA) from Chandigarh University (Ongoing)
• Bachelor of Computer Application (BCA) from Manipal University (8.63 CGPA)
• B.Sc. in Mathematics from L.N.M.U., Darbhanga`,
        type: 'success'
    },
    contact: {
      output: `📧 Contact Information:

• Email: bipulnandan276@gmail.com
• LinkedIn: linkedin.com/in/bipul-nandan-0510a9328
• GitHub: github.com/bipul276
• Location: Mohali, India`,
      type: 'success'
    },
    github: {
      handler: getGitHubStats,
      type: 'success'
    },
    clear: {
      output: '',
      type: 'info'
    }
  };

  useEffect(() => {
    // Initial welcome message
    setHistory([{
      input: '',
      output: `Welcome to Bipul Nandan's Interactive Portfolio Terminal!
Type 'help' to see available commands.`,
      type: 'info'
    }]);
  }, []);

  useEffect(() => {
    // Auto-scroll logic
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    const commandData = availableCommands[cmd];
    
    if (commandData) {
      const outputText = commandData.handler ? await commandData.handler() : commandData.output || '';
      // Update history with the actual output
      setHistory(prev => prev.map(h => h.input === command ? { ...h, output: outputText, type: commandData.type } : h));
    } else {
      // Update history for "command not found"
      setHistory(prev => prev.map(h => h.input === command ? { ...h, output: `Command not found: ${command}. Type 'help' for available commands.`, type: 'error' } : h));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const commandToExecute = currentInput.trim();
    if (!commandToExecute) return;

    unlockAchievement('terminal-user');
    
    // Add the command to history immediately for a better UX
    setHistory(prev => [...prev, { input: commandToExecute, output: '', type: 'success' }]);
    setCurrentInput('');
    setIsTyping(true);

    await executeCommand(commandToExecute);
    
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleInputClick = () => {
    inputRef.current?.focus();
  };

  return (
    <Card className="bg-black text-green-400 font-mono h-96 overflow-hidden flex flex-col">
      <CardHeader className="p-2 border-b border-gray-700 flex-shrink-0">
        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          Terminal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow overflow-hidden" onClick={handleInputClick}>
        <div 
          ref={terminalRef}
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800"
        >
          {history.map((entry, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              {entry.input && (
                <div className="flex items-center gap-2 text-green-400">
                    <span className="text-blue-400">bipulnandan-dev@portfolio:~$</span>
                    <span>{entry.input}</span>
                </div>
              )}
              {entry.output && (
                <pre className={`whitespace-pre-wrap ${
                  entry.type === 'error' ? 'text-red-400' : 
                  entry.type === 'info' ? 'text-blue-400' : 
                  'text-green-400'
                }`}>
                  {entry.output}
                </pre>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2">
              <span className="text-blue-400">bipulnandan-dev@portfolio:~$</span>
              <span className="animate-pulse">Executing...</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">bipulnandan-dev@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-green-400"
                placeholder=""
                autoFocus
                disabled={isTyping}
              />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
