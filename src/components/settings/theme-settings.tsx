'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme as useNextTheme } from "next-themes"
import { useTheme, Theme, Mode, DarkVariant } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Check,
  Moon,
  Palette,
  Sun,
  Monitor,
  Sparkles,
  Circle,
  LucideIcon,
  RefreshCw,
  EyeIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

// Theme color definitions with their representative colors
const themeColors: {
  id: Theme;
  name: string;
  description: string;
  colors: string[];
  icon: string;
  preview: string;
}[] = [
  {
    id: "default",
    name: "Default",
    description: "A professional gray theme with a clean, focused appearance.",
    colors: ["#919192", "#3e3e3e", "#c4c4c4"],
    icon: "bg-gradient-to-br from-gray-500 to-gray-600",
    preview: "bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950/40 dark:via-gray-900 dark:to-blue-950/40",
  },
  {
    id: "blue",
    name: "Live Blue",
    description: "A professional blue theme with a clean, focused appearance.",
    colors: ["#3b82f6", "#2563eb", "#60a5fa"],
    icon: "bg-gradient-to-br from-blue-500 to-blue-600",
    preview: "bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-950/40 dark:via-gray-900 dark:to-blue-950/40",
  },
  {
    id: "purple",
    name: "Royal Purple",
    description: "An elegant purple theme that exudes creativity and wisdom.",
    colors: ["#a855f7", "#9333ea", "#c084fc"],
    icon: "bg-gradient-to-br from-purple-500 to-violet-600",
    preview: "bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-purple-950/40 dark:via-gray-900 dark:to-purple-950/40",
  },
  {
    id: "orange",
    name: "Amber Glow",
    description: "A warm, energetic orange theme that's bold and inviting.",
    colors: ["#f97316", "#ea580c", "#fb923c"],
    icon: "bg-gradient-to-br from-orange-500 to-amber-600",
    preview: "bg-gradient-to-r from-orange-50 via-white to-orange-50 dark:from-orange-950/40 dark:via-gray-900 dark:to-orange-950/40",
  },
  {
    id: "pink",
    name: "Rose Pink",
    description: "A charming pink theme that's modern and welcoming.",
    colors: ["#ec4899", "#db2777", "#f472b6"],
    icon: "bg-gradient-to-br from-pink-500 to-rose-600",
    preview: "bg-gradient-to-r from-pink-50 via-white to-pink-50 dark:from-pink-950/40 dark:via-gray-900 dark:to-pink-950/40",
  },
  {
    id: "emerald",
    name: "Fresh Emerald",
    description: "A refreshing green theme that promotes calm and clarity.",
    colors: ["#10b981", "#059669", "#34d399"],
    icon: "bg-gradient-to-br from-emerald-500 to-green-600",
    preview: "bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/40 dark:via-gray-900 dark:to-emerald-950/40",
  },
];

// Appearance modes
const appearanceModes: {
  id: Mode;
  name: string;
  description: string;
  icon: LucideIcon;
  preview: string;
}[] = [
  {
    id: "light",
    name: "Light Mode",
    description: "Clean, bright interface that's perfect for daytime use.",
    icon: Sun,
    preview: "bg-gradient-to-b from-white to-gray-100",
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Reduced eye strain in low-light environments.",
    icon: Moon,
    preview: "bg-gradient-to-b from-gray-900 to-gray-800",
  },
  {
    id: "system",
    name: "System",
    description: "Automatically follows your device's appearance settings.",
    icon: Monitor,
    preview: "bg-gradient-to-r from-gray-100 to-gray-900",
  },
];

// Dark mode variants
const darkVariants: {
  id: DarkVariant;
  name: string;
  description: string;
  bgClass: string;
  preview: string;
}[] = [
  {
    id: "subtle",
    name: "Subtle Dark",
    description: "A softer dark theme with deep gray backgrounds.",
    bgClass: "bg-zinc-900",
    preview: "bg-gradient-to-b from-gray-900 to-gray-800",
  },
  {
    id: "lights-out",
    name: "Lights Out",
    description: "Maximum contrast with true black backgrounds, ideal for OLED displays.",
    bgClass: "bg-black",
    preview: "bg-gradient-to-b from-black to-gray-950",
  },
];

const ThemeSettings = () => {
  const { theme, setTheme, themes, darkVariant, setDarkVariant, isAnimated, setIsAnimated } = useTheme()
  const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"colors" | "appearance">("colors")
  const [previewMode, setPreviewMode] = useState<DarkVariant>("subtle")
  
  // Mount check to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle color theme change
  const handleThemeChange = (newTheme: Theme) => {
    if (newTheme === theme) return; // Don't do anything if same theme
    setTheme(newTheme)
    toast.success(`Theme changed to ${themeColors.find(t => t.id === newTheme)?.name}`)
  }
  
  // Handle appearance mode change
  const handleModeChange = (newMode: Mode) => {
    if (newMode === nextTheme) return; // Don't do anything if same mode
    setNextTheme(newMode)
    toast.success(`Appearance mode set to ${newMode}`)
  }
  
  // Handle dark variant change
  const handleDarkVariantChange = (newVariant: DarkVariant) => {
    if (newVariant === darkVariant) return; // Don't do anything if same variant
    setDarkVariant(newVariant)
    setPreviewMode(newVariant)
    toast.success(`Dark theme style set to ${newVariant === "lights-out" ? "Lights Out" : "Subtle Dark"}`)
  }
  
  // Handle animation toggle
  const handleAnimationToggle = (checked: boolean) => {
    setIsAnimated(checked)
    toast.success(`Theme transitions ${checked ? 'enabled' : 'disabled'}`)
  }
  
  // Reset all theme settings
  const resetThemeSettings = () => {
    setTheme("default")
    setNextTheme("system")
    setDarkVariant("subtle")
    setIsAnimated(true)
    toast.success("Theme settings reset to defaults")
  }
  
  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const isDarkMode = resolvedTheme === "dark"
  
  return (
    <Card className="border-none shadow-none relative overflow-hidden">
      <CardContent className="p-0">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={(value) => setActiveTab(value as "colors" | "appearance")}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-card/50 border">
              <TabsTrigger value="colors" className="flex items-center gap-1.5 data-[state=active]:bg-primary/10">
                <Palette className="h-4 w-4" />
                <span>Theme Colors</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-1.5 data-[state=active]:bg-primary/10">
                <EyeIcon className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetThemeSettings}
              className="text-xs flex items-center gap-1.5 h-8"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          </div>

          <TabsContent value="colors" className="space-y-6 mt-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Color Theme</h3>
                <Badge variant="outline" className="bg-primary/10 px-2 py-1 gap-1 text-primary">
                  <div className={cn(
                    "h-3.5 w-3.5 rounded-full",
                    themeColors.find(t => t.id === theme)?.icon || "bg-gray-500"
                  )}></div>
                  <span>{themeColors.find(t => t.id === theme)?.name || "Default"}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themeColors.map((colorTheme) => (
                  <motion.div
                    key={colorTheme.id}
                    whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 p-0 transition-all overflow-hidden",
                      theme === colorTheme.id
                        ? "border-primary"
                        : "border-transparent hover:border-primary/20"
                    )}
                    onClick={() => handleThemeChange(colorTheme.id)}
                  >
                    {/* Color preview area */}
                    <div className={cn(
                      "h-24 w-full flex items-end justify-end p-3",
                      colorTheme.preview
                    )}>
                      {theme === colorTheme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center"
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-white shrink-0",
                          colorTheme.icon
                        )}>
                          <Palette className="h-5 w-5" />
                        </div>
                        
                        <div>
                          <h4 className="font-medium flex items-center gap-1.5">
                            {colorTheme.name}
                            {theme === colorTheme.id && (
                              <Badge variant="outline" className="ml-1 bg-primary/10 text-primary text-[10px] px-1 py-0 h-4">
                                Active
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{colorTheme.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mt-3 h-2">
                        {colorTheme.colors.map((color, i) => (
                          <div 
                            key={i}
                            className="h-2 w-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-8 mt-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Appearance Mode</h3>
                <Badge variant="outline" className="bg-primary/10 px-2 py-1 gap-1 text-primary">
                  <span>{nextTheme === 'system' ? 'System' : nextTheme === 'dark' ? 'Dark' : 'Light'}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {appearanceModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = 
                    (mode.id === "system" && nextTheme === "system") || 
                    (mode.id === "light" && nextTheme === "light") || 
                    (mode.id === "dark" && nextTheme === "dark");
                    
                  return (
                    <motion.div
                      key={mode.id}
                      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative cursor-pointer rounded-xl border-2 p-0 transition-all overflow-hidden",
                        isActive
                          ? "border-primary"
                          : "border-transparent hover:border-primary/20"
                      )}
                      onClick={() => handleModeChange(mode.id)}
                    >
                      {/* Preview area */}
                      <div className={cn(
                        "h-24 w-full flex items-end justify-end p-3",
                        mode.preview
                      )}>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center"
                          >
                            <Check className="h-5 w-5" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <h4 className="font-medium">{mode.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{mode.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {isDarkMode && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Separator className="my-6" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Dark Theme Style</h3>
                    <Badge variant="outline" className="bg-primary/10 px-2 py-1 gap-1 text-primary">
                      <span>{darkVariant === 'lights-out' ? 'Lights Out' : 'Subtle Dark'}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {darkVariants.map((variant) => {
                      const isActive = darkVariant === variant.id;
                      return (
                        <motion.div
                          key={variant.id}
                          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "relative cursor-pointer rounded-xl border-2 p-0 transition-all overflow-hidden",
                            isActive
                              ? "border-primary"
                              : "border-transparent hover:border-primary/20"
                          )}
                          onClick={() => handleDarkVariantChange(variant.id)}
                        >
                          {/* Preview area */}
                          <div className={cn(
                            "h-24 w-full flex items-end justify-end p-3",
                            variant.preview
                          )}>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center"
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0", 
                                variant.bgClass
                              )}>
                                <Moon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium">{variant.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{variant.description}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animate-theme">Animated transitions</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions when changing themes</p>
                </div>
                <Switch 
                  id="animate-theme" 
                  checked={isAnimated}
                  onCheckedChange={handleAnimationToggle}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ThemeSettings
