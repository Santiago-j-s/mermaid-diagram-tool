"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function handleToggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="relative w-9 h-9 p-0 theme-transition"
    >
      <Sun 
        className={`h-4 w-4 absolute transition-transform duration-200 ${
          isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        }`} 
        style={{ transitionProperty: 'transform' }}
      />
      <Moon 
        className={`h-4 w-4 absolute transition-transform duration-200 ${
          isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        }`}
        style={{ transitionProperty: 'transform' }}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

