"use client"


import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useGame } from "./GameContext"; 
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { unlockAchievement } = useGame();
 const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    unlockAchievement('night-owl'); // 3. Call the function on action
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}