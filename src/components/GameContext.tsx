import React, { createContext, useContext, useState, useEffect } from 'react';
import type{  ReactNode } from 'react';
import { Trophy,  Zap, Code, Target, Brain,  Coffee, GitBranch, Sparkles, Briefcase, Network, Download } from 'lucide-react';

// --- INTERFACES ---
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: 'exploration' | 'interaction' | 'hidden' | 'professional';
}

interface UserStats {
  level: number;
  experience: number;
  nextLevelXP: number;
  achievementsUnlocked: number;
  isMaxLevel: boolean;
  startTime: number; // Session start time
  completionTime?: number; // Time in seconds for this session
  bestCompletionTime?: number; // Best time ever, from localStorage
}

interface GameContextType {
  userStats: UserStats;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  trackSectionVisit: (sectionId: string) => void;
  trackProjectView: () => void;
  trackResumeDownload: () => void;
  trackProfessionalLinkClick: () => void;
  showAchievement: Achievement | null;
}

// --- INITIAL DATA ---
const initialAchievements: Achievement[] = [
    { id: 'first-visit', title: 'Welcome Explorer', description: 'Visited the portfolio for the first time', icon: Trophy, unlocked: false, rarity: 'common', points: 10, category: 'exploration' },
    { id: 'terminal-user', title: 'Command Line Hero', description: 'Used the interactive terminal', icon: Code, unlocked: false, rarity: 'rare', points: 25, category: 'interaction' },
    { id: 'code-runner', title: 'Code Executor', description: 'Ran code in the live playground', icon: Zap, unlocked: false, rarity: 'rare', points: 30, category: 'interaction' },
    { id: 'ai-chat', title: 'AI Conversationalist', description: 'Had a conversation with the AI assistant', icon: Brain, unlocked: false, rarity: 'common', points: 15, category: 'interaction' },
    { id: 'section-explorer', title: 'Portfolio Navigator', description: 'Visited all main sections of the portfolio', icon: Target, unlocked: false, rarity: 'epic', points: 50, category: 'exploration' },
    { id: 'night-owl', title: 'Night Owl', description: 'Enabled dark mode', icon: Coffee, unlocked: false, rarity: 'common', points: 5, category: 'interaction' },
    { id: 'github-stalker', title: 'GitHub Stalker', description: 'Explored the GitHub stats section', icon: GitBranch, unlocked: false, rarity: 'rare', points: 20, category: 'exploration' },
    { id: 'project-inspector', title: 'Project Inspector', description: 'Viewed the details of a project', icon: Briefcase, unlocked: false, rarity: 'rare', points: 25, category: 'exploration' },
    { id: 'career-minded', title: 'Career Minded', description: 'Downloaded the resume', icon: Download, unlocked: false, rarity: 'epic', points: 40, category: 'professional' },
    { id: 'networker', title: 'The Networker', description: 'Clicked a professional link (LinkedIn/Email)', icon: Network, unlocked: false, rarity: 'rare', points: 20, category: 'professional' },
    { id: 'hidden-gem', title: 'Completionist', description: 'You unlocked all other achievements!', icon: Sparkles, unlocked: false, rarity: 'legendary', points: 100, category: 'hidden' },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// --- PROVIDER COMPONENT ---
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    experience: 0,
    nextLevelXP: 100,
    achievementsUnlocked: 0,
    isMaxLevel: false,
    startTime: Date.now(), // Set start time on initial render
  });
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_visitedSections, setVisitedSections] = useState<Set<string>>(new Set());

  // On mount, unlock first achievement and load best time
  useEffect(() => {
    const bestTime = localStorage.getItem('bestCompletionTime');
    if (bestTime) {
        setUserStats(prev => ({ ...prev, bestCompletionTime: parseFloat(bestTime) }));
    }
    const timer = setTimeout(() => unlockAchievement('first-visit'), 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle leveling up and max level
  useEffect(() => {
    const maxExperience = initialAchievements
        .filter(a => a.category !== 'hidden')
        .reduce((sum, a) => sum + a.points, 0);

    if (userStats.experience >= maxExperience && !userStats.isMaxLevel) {
        setUserStats(prev => ({ ...prev, isMaxLevel: true }));
    }

    const newLevel = Math.floor(userStats.experience / 100) + 1;
    const nextLevelXP = newLevel * 100;
    if (newLevel > userStats.level) {
      setUserStats(prev => ({ ...prev, level: newLevel, nextLevelXP }));
    }
  }, [userStats.experience, userStats.level, userStats.isMaxLevel]);

  const unlockAchievement = (id: string) => {
    setAchievements(prevAchievements => {
      const achievement = prevAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const updatedAchievement = { ...achievement, unlocked: true, unlockedAt: new Date() };
        
        setUserStats(prevStats => ({
          ...prevStats,
          experience: prevStats.experience + achievement.points,
          achievementsUnlocked: prevStats.achievementsUnlocked + 1,
        }));

        setShowAchievement(updatedAchievement);
        setTimeout(() => setShowAchievement(null), 4000);
        
        const newAchievements = prevAchievements.map(a => (a.id === id ? updatedAchievement : a));

        const allOthersUnlocked = newAchievements
            .filter(a => a.category !== 'hidden')
            .every(a => a.unlocked);

        const hiddenGem = newAchievements.find(a => a.id === 'hidden-gem');
        if (allOthersUnlocked && hiddenGem && !hiddenGem.unlocked) {
            const completionTime = (Date.now() - userStats.startTime) / 1000;
            const currentBestTime = parseFloat(localStorage.getItem('bestCompletionTime') || '99999');
            
            let newBestTime = userStats.bestCompletionTime;
            if (completionTime < currentBestTime) {
                localStorage.setItem('bestCompletionTime', completionTime.toString());
                newBestTime = completionTime;
            }

            setUserStats(prev => ({ ...prev, completionTime, bestCompletionTime: newBestTime }));

            setTimeout(() => unlockAchievement('hidden-gem'), 2000);
        }

        return newAchievements;
      }
      return prevAchievements;
    });
  };

  const trackSectionVisit = (sectionId: string) => {
    setVisitedSections(prev => {
        const newSet = new Set(prev);
        newSet.add(sectionId);
        const requiredSections = ['about', 'skills', 'projects', 'github', 'terminal'];
        if (requiredSections.every(sec => newSet.has(sec))) {
            unlockAchievement('section-explorer');
        }
        return newSet;
    });
  };

  const trackProjectView = () => unlockAchievement('project-inspector');
  const trackResumeDownload = () => unlockAchievement('career-minded');
  const trackProfessionalLinkClick = () => unlockAchievement('networker');

  const value = {
    userStats,
    achievements,
    unlockAchievement,
    trackSectionVisit,
    trackProjectView,
    trackResumeDownload,
    trackProfessionalLinkClick,
    showAchievement,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
