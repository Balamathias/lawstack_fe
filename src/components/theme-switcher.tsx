"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Palette, CheckCircle2 } from "lucide-react"
import { useTheme as useNextTheme } from "next-themes"
import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { setTheme: setMode, theme: nextTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const themeMap = {
    default: "Default Blue",
    purple: "Royal Purple",
    orange: "Amber Glow",
    pink: "Rose Pink",
    emerald: "Fresh Emerald",
  }
  
  const themeColors = {
    default: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    emerald: "bg-emerald-500",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
          {theme !== "default" && (
            <div className={cn(
              "absolute top-0 right-0 w-2 h-2 rounded-full",
              themeColors[theme as keyof typeof themeColors]
            )} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          className="flex justify-between items-center"
          disabled
        >
          <span>Current Theme:</span>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "h-3 w-3 rounded-full", 
              themeColors[theme as keyof typeof themeColors]
            )} />
            <span className="font-medium text-primary">{themeMap[theme as keyof typeof themeMap]}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={nextTheme} onValueChange={setMode}>
          <DropdownMenuRadioItem value="light" className="cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2" />
                <span>Light</span>
              </div>
              {nextTheme === "light" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-2" />
                <span>Dark</span>
              </div>
              {nextTheme === "dark" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Laptop className="h-4 w-4 mr-2" />
                <span>System</span>
              </div>
              {nextTheme === "system" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="h-4 w-4 mr-2" />
            <span>Color Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {Object.entries(themeMap).map(([key, name]) => (
                <DropdownMenuItem 
                  key={key}
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => setTheme(key as any)}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "h-4 w-4 rounded-full mr-2",
                      themeColors[key as keyof typeof themeColors]
                    )} />
                    <span>{name}</span>
                  </div>
                  {theme === key && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <Link href="/dashboard/settings" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            More appearance settings
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
