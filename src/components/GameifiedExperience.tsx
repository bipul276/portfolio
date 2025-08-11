import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Timer, ChevronsUp } from 'lucide-react';

// Import the hook to use the game context
import { useGame } from './GameContext';

export function GameifiedExperience() {
  // Get all state and data from the global context
  const { userStats, achievements, showAchievement } = useGame();

  const getRarityColor = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-600';
      case 'rare': return 'text-blue-600 border-blue-400 dark:text-blue-400 dark:border-blue-500';
      case 'epic': return 'text-purple-600 border-purple-400 dark:text-purple-400 dark:border-purple-500';
      case 'legendary': return 'text-yellow-500 border-yellow-400 dark:text-yellow-400 dark:border-yellow-500';
    }
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle>Your Progress</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="text-lg">
                  {userStats.isMaxLevel ? 'Max Level' : `Level ${userStats.level}`}
                </Badge>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1 text-muted-foreground">
                    <span>{userStats.isMaxLevel ? 'Congratulations!' : `XP: ${userStats.experience}`}</span>
                    <span>{userStats.isMaxLevel ? '100%' : `Next Level: ${userStats.nextLevelXP}`}</span>
                  </div>
                  <Progress 
                    value={userStats.isMaxLevel ? 100 : ((userStats.experience - (userStats.level - 1) * 100) / 100) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <Tabs defaultValue="achievements">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="achievements">Achievements ({userStats.achievementsUnlocked}/{achievements.length})</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>

                <TabsContent value="achievements" className="mt-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {sortedAchievements.map(achievement => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: achievement.unlocked ? 1 : 0.5 }}
                        className={`p-4 border rounded-lg ${
                          achievement.unlocked ? 'bg-background' : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {achievement.unlocked ? (
                            <achievement.icon className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                          ) : (
                            <Lock className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold">{achievement.title}</div>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                                <Badge variant="secondary">{achievement.points} XP</Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Stats</CardTitle>
                      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <Timer className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">This Session's Time</p>
                          <p className="text-2xl font-bold">
                            {userStats.completionTime ? `${userStats.completionTime.toFixed(2)}s` : 'In Progress...'}
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <ChevronsUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <p className="text-sm text-muted-foreground">Personal Best Time</p>
                          <p className="text-2xl font-bold">
                            {userStats.bestCompletionTime ? `${userStats.bestCompletionTime.toFixed(2)}s` : 'Not Set'}
                          </p>
                        </div>
                      </CardContent>
                    </CardHeader>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievement Unlocked Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-20 right-4 z-[100]"
          >
            <Card className="w-80 border-yellow-400 bg-background shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <showAchievement.icon className="h-10 w-10 text-yellow-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-primary">Achievement Unlocked!</div>
                    <div className="text-sm text-muted-foreground">{showAchievement.title}</div>
                    <div className="text-xs font-bold text-yellow-600">+{showAchievement.points} XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
