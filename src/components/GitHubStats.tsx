import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { Github, GitBranch, Star, Users, Calendar, TrendingUp } from 'lucide-react';
import { useGame } from './GameContext';

// The interface remains the same
interface GitHubData {
  profile: {
    repos: number;
    followers: number;
    following: number;
    stars: number;
  };
  languages: { name: string; percentage: number; color: string }[];
  activity: { day: string; contributions: number }[];
  topRepos: { name:string; stars: number; forks: number; language: string; url: string }[];
}

// We'll pass the GitHub username as a prop to make the component reusable
export function GitHubStats({ username }: { username: string }) {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { unlockAchievement } = useGame();

  // FIX: Ref to track if data has been fetched to prevent re-fetching on re-renders
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch data if it hasn't been fetched yet.
    if (!hasFetched.current) {
      const fetchGitHubData = async () => {
        const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
          setError("A GitHub Personal Access Token is required. Please set VITE_GITHUB_TOKEN in your .env.local file.");
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        };

        const graphqlQuery = {
          query: `
            query($username: String!) {
              user(login: $username) {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            username,
          },
        };

        try {
          const [userRes, reposRes, graphqlRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, { headers }),
            fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
            fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(graphqlQuery),
            }),
          ]);

          if (!userRes.ok || !reposRes.ok || !graphqlRes.ok) {
            throw new Error('Failed to fetch data from GitHub API.');
          }

          const userProfile = await userRes.json();
          const userRepos = await reposRes.json();
          const graphqlData = await graphqlRes.json();

          if (graphqlData.errors) {
              throw new Error(`GraphQL Error: ${graphqlData.errors[0].message}`);
          }

          // --- Process the data ---
          const totalStars = userRepos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
          
          const languageStats: { [key: string]: number } = {};
          let totalLanguages = 0;
          userRepos.forEach((repo: any) => {
            if (repo.language) {
              languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
              totalLanguages++;
            }
          });
          
          const languages = Object.entries(languageStats)
            .map(([name, count]) => ({
              name,
              percentage: Math.round((count / totalLanguages) * 100),
              color: '#8A8A8A'
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);

          const topRepos = userRepos
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4)
            .map((repo: any) => ({
              name: repo.name,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language || 'N/A',
              url: repo.html_url,
            }));

          const contributionCalendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
          const activity = contributionCalendar.weeks.flatMap((week: any) => 
              week.contributionDays.map((day: any) => ({
                  day: day.date,
                  contributions: day.contributionCount,
              }))
          );

          setData({
            profile: {
              repos: userProfile.public_repos,
              followers: userProfile.followers,
              following: userProfile.following,
              stars: totalStars,
            },
            languages,
            topRepos,
            activity,
          });

          unlockAchievement('github-stalker');

        } catch (err) {
          if (err instanceof Error) {
              setError(err.message);
          } else {
              setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };

      if (username) {
        fetchGitHubData();
        // Set the flag to true after the fetch is initiated
        hasFetched.current = true;
      }
    }
  }, [username, unlockAchievement]); // Dependency array ensures it re-runs ONLY if username changes

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader><div className="h-6 bg-muted rounded w-1/2"></div></CardHeader>
        <CardContent><div className="h-32 bg-muted rounded"></div></CardContent>
      </Card>
    );
  }

  if (error) {
    return <Card><CardContent className="p-4 text-destructive">{error}</CardContent></Card>;
  }

  if (!data) return null;
  
  const totalContributions = data.activity.reduce((sum, day) => sum + day.contributions, 0);

  const getContributionColor = (contributions: number) => {
    if (contributions === 0) return 'bg-muted/50 dark:bg-muted/20';
    if (contributions <= 2) return 'bg-green-300/50 dark:bg-green-800/50';
    if (contributions <= 5) return 'bg-green-400/70 dark:bg-green-700/70';
    if (contributions <= 8) return 'bg-green-600 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Repositories', value: data.profile.repos, icon: Github },
          { label: 'Total Stars', value: data.profile.stars, icon: Star },
          { label: 'Followers', value: data.profile.followers, icon: Users },
          { label: 'Following', value: data.profile.following, icon: TrendingUp }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Language Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Most Used Languages</CardTitle>
              <CardDescription>Based on repository analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.languages.map((lang) => (
                <div key={lang.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <Progress value={lang.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Repositories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Repositories</CardTitle>
              <CardDescription>Most starred projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.topRepos.map((repo) => (
                <a href={repo.url} key={repo.name} target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                  <h4 className="text-sm font-medium">{repo.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {repo.forks}</span>
                    <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contribution Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Contribution Activity</CardTitle>
            <CardDescription>{totalContributions} contributions in the last year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-53 gap-1 overflow-x-auto pb-2">
              {data.activity.map((day, index) => (
                <div
                  key={day.day}
                  className={`w-3 h-3 rounded-sm ${getContributionColor(day.contributions)}`}
                  title={`${day.contributions} contributions on ${day.day}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
