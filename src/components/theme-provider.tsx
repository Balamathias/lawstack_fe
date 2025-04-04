"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

// Define theme types
export type Theme = "default" | "purple" | "orange" | "pink" | "emerald" | "blue"
export type Mode = "light" | "dark" | "system"
export type DarkVariant = "subtle" | "lights-out"

interface ThemeOptions {
  theme: Theme
  mode: Mode
  darkVariant: DarkVariant
}

interface ThemeContextType extends ThemeOptions {
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
  setDarkVariant: (variant: DarkVariant) => void
  themes: Theme[]
  darkVariants: DarkVariant[]
  isAnimated: boolean
  setIsAnimated: (value: boolean) => void
}

const defaultThemeOptions: ThemeOptions = {
  theme: "default",
  mode: "system",
  darkVariant: "subtle"
}

const ThemeContext = createContext<ThemeContextType>({
  ...defaultThemeOptions,
  setTheme: () => null,
  setMode: () => null,
  setDarkVariant: () => null,
  themes: ["default", "purple", "orange", "pink", "emerald"],
  darkVariants: ["subtle", "lights-out"],
  isAnimated: true,
  setIsAnimated: () => null
})

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>("default")
  const [mode, setModeState] = useState<Mode>("system")
  const [darkVariant, setDarkVariantState] = useState<DarkVariant>("subtle")
  const [isAnimated, setIsAnimated] = useState<boolean>(true)

  const themes: Theme[] = ["default", "purple", "orange", "pink", "emerald"]
  const darkVariants: DarkVariant[] = ["subtle", "lights-out"]

  const setTheme = (newTheme: Theme) => {
    if (!mounted) return
    setThemeState(newTheme)
    localStorage.setItem("theme-color", newTheme)
    document.documentElement.classList.remove(...themes.map(t => `theme-${t}`))
    if (newTheme !== "default") document.documentElement.classList.add(`theme-${newTheme}`)
  }

  const setMode = (mode: Mode) => {
    if (!mounted) return
    setModeState(mode)
    localStorage.setItem("color-mode", mode)
  }

  const setDarkVariant = (variant: DarkVariant) => {
    if (!mounted) return
    setDarkVariantState(variant)
    localStorage.setItem("dark-variant", variant)
    document.documentElement.classList.remove("lights-out", "subtle")
    document.documentElement.classList.add(variant === "lights-out" ? "lights-out" : "subtle")
  }

  const setAnimatedState = (value: boolean) => {
    setIsAnimated(value)
    localStorage.setItem("theme-animated", String(value))
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-color") as Theme
    const savedDarkVariant = localStorage.getItem("dark-variant") as DarkVariant
    const savedMode = localStorage.getItem("color-mode") as Mode
    const savedAnimated = localStorage.getItem("theme-animated")

    if (savedTheme && themes.includes(savedTheme)) {
      setThemeState(savedTheme)
      if (savedTheme !== "default") {
        document.documentElement.classList.add(`theme-${savedTheme}`)
      }
    }

    if (savedDarkVariant) {
      setDarkVariantState(savedDarkVariant)
      document.documentElement.classList.add(savedDarkVariant === "lights-out" ? "lights-out" : "subtle")
    }

    if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
      setModeState(savedMode)
    }

    if (savedAnimated !== null) {
      setIsAnimated(savedAnimated === "true")
    }

    setMounted(true)
  }, [])

  const value = {
    theme,
    mode,
    darkVariant,
    setTheme,
    setMode,
    setDarkVariant,
    themes,
    darkVariants,
    isAnimated,
    setIsAnimated: setAnimatedState
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={value}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={mode}
        enableSystem
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
