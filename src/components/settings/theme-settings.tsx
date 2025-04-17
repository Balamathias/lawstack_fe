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
  EyeIcon,
  Paintbrush,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { useLocalStorage } from "@/hooks/use-localstorage"

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

// Define HSL color type
interface HSLColor {
  hue: number;
  saturation: number;
  lightness: number;
}

const ThemeSettings = () => {
  // Use no default color scheme to allow pure dark theme
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "default")
  const [darkVariant, setDarkVariant] = useLocalStorage<DarkVariant>("theme-color-mode", "lights-out")
  const [colorScheme, setColorScheme] = useLocalStorage<string>("theme-color", "")
  const { themes, isAnimated, setIsAnimated } = useTheme()
  const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"colors" | "appearance">("colors")
  const [previewMode, setPreviewMode] = useState<DarkVariant>("lights-out")
  const [colorMode, setColorMode] = useLocalStorage<string>('theme-color-mode', 'lights-out');
  const [customColor, setCustomColor] = useState<HSLColor>({ hue: 221, saturation: 83, lightness: 53 });
  const [isUsingCustomColor, setIsUsingCustomColor] = useLocalStorage<boolean>('using-custom-color', false);
  const [previewColor, setPreviewColor] = useState<HSLColor>(customColor);
  const [activeThemeValue, setActiveThemeValue] = useState<string>(
    isUsingCustomColor ? 'custom' : colorScheme
  );

  // Mount check to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Convert HSL to CSS string format
  const hslToString = (hsl: HSLColor) => `hsl(${hsl.hue} ${hsl.saturation}% ${hsl.lightness}%)`;

  // Function to update document styles with custom color
  const applyCustomColor = (hsl: HSLColor) => {
    console.log("Setting custom color HSL values:", hsl);
    document.documentElement.style.setProperty('--custom-primary-hue', hsl.hue.toString());
    document.documentElement.style.setProperty('--custom-primary-saturation', `${hsl.saturation}%`);
    document.documentElement.style.setProperty('--custom-primary-lightness', `${hsl.lightness}%`);
    document.documentElement.classList.add('theme-custom');
    localStorage.setItem('custom-color', JSON.stringify(hsl));
  };

  // Load custom color from localStorage on component mount
  useEffect(() => {
    const savedCustomColor = localStorage.getItem('custom-color');
    if (savedCustomColor) {
      try {
        const parsedColor = JSON.parse(savedCustomColor) as HSLColor;
        setCustomColor(parsedColor);
        setPreviewColor(parsedColor);
        if (isUsingCustomColor) {
          applyCustomColor(parsedColor);
        }
      } catch (e) {
        console.error('Failed to parse custom color from localStorage');
      }
    }
  }, [isUsingCustomColor]);

  // Apply theme changes
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove('lights-out', 'subtle');
      if (colorMode === 'lights-out' || colorMode === 'subtle') {
        document.documentElement.classList.add(colorMode);
      }
    }
    document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-orange', 'theme-emerald', 'theme-pink', 'theme-custom');
    if (isUsingCustomColor) {
      applyCustomColor(customColor);
    } else {
      document.documentElement.classList.add(`theme-${colorScheme}`);
    }
  }, [theme, colorMode, colorScheme, isUsingCustomColor, customColor]);

  // Add a state to track initial loading
  useEffect(() => {
    if (!mounted) return;

    // If no color scheme is set, keep the default dark theme
    if (!colorScheme && !isUsingCustomColor) {
      document.documentElement.classList.remove(
        'theme-blue', 'theme-purple', 'theme-orange',
        'theme-emerald', 'theme-pink', 'theme-custom'
      );
    }
  }, [mounted, colorScheme, isUsingCustomColor]);

  // Handle selecting custom color
  const handleCustomColorSelect = () => {
    console.log("Applying custom color:", previewColor);
    setIsUsingCustomColor(true);
    setActiveThemeValue('custom');
    setCustomColor(previewColor);
    applyCustomColor(previewColor);

    console.log("Custom color active:", isUsingCustomColor);
    console.log("Custom color values:",
      document.documentElement.style.getPropertyValue('--custom-primary-hue'),
      document.documentElement.style.getPropertyValue('--custom-primary-saturation'),
      document.documentElement.style.getPropertyValue('--custom-primary-lightness')
    );

    document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-orange', 'theme-emerald', 'theme-pink');
    document.documentElement.classList.add('theme-custom');

    toast.success("Custom color applied");
  };

  // Reset to preset themes
  const handleResetToPreset = (preset: string) => {
    console.log("Resetting to preset:", preset);
    setIsUsingCustomColor(false);
    setActiveThemeValue(preset);
    setColorScheme(preset);

    document.documentElement.classList.remove('theme-custom');
    document.documentElement.classList.add(`theme-${preset}`);

    toast.success(`Theme changed to ${preset}`);
  };

  // Fix the switchTheme function to preserve dark mode
  const switchTheme = (theme: string) => {
    // Preserve current theme mode (dark/light)
    const currentIsDarkMode = document.documentElement.classList.contains('dark');
    const currentDarkVariant = darkVariant;
    
    if (theme === 'custom') {
      // Apply custom theme
      setIsUsingCustomColor(true);
      setActiveThemeValue('custom');
      
      // Apply custom theme properties
      document.documentElement.style.setProperty('--custom-primary-hue', customColor.hue.toString());
      document.documentElement.style.setProperty('--custom-primary-saturation', `${customColor.saturation}%`);
      document.documentElement.style.setProperty('--custom-primary-lightness', `${customColor.lightness}%`);
      
      // First remove all theme classes to avoid conflicts
      document.documentElement.classList.remove(
        'theme-blue', 'theme-purple', 'theme-orange', 'theme-emerald', 'theme-pink'
      );
      
      // Add custom theme class
      document.documentElement.classList.add('theme-custom');
      
      // Restore dark mode if it was active
      if (currentIsDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.add(currentDarkVariant);
      }
      
      // Update localStorage
      localStorage.setItem('theme-color', 'custom');
      localStorage.setItem('using-custom-color', 'true');
      localStorage.setItem('custom-color', JSON.stringify(customColor));
    } else {
      // Apply preset theme
      setIsUsingCustomColor(false);
      setColorScheme(theme);
      setActiveThemeValue(theme);
      
      // Clear custom theme properties
      document.documentElement.style.removeProperty('--custom-primary-hue');
      document.documentElement.style.removeProperty('--custom-primary-saturation');
      document.documentElement.style.removeProperty('--custom-primary-lightness');
      
      // First remove all theme classes
      document.documentElement.classList.remove(
        'theme-blue', 'theme-purple', 'theme-orange', 
        'theme-emerald', 'theme-pink', 'theme-custom'
      );
      
      // Apply preset theme class
      document.documentElement.classList.add(`theme-${theme}`);
      
      // Restore dark mode if it was active
      if (currentIsDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.add(currentDarkVariant);
      }
      
      // Update localStorage
      localStorage.setItem('theme-color', theme);
      localStorage.setItem('using-custom-color', 'false');
    }
    
    // Force UI update
    // forceUpdate({});
  };

  // Handle color theme change
  const handleThemeChange = (newTheme: Theme) => {
    if (newTheme === theme) return; // Don't do anything if same theme
    setTheme(newTheme)
    setIsUsingCustomColor(false);
    setColorScheme(newTheme);
    setActiveThemeValue(newTheme);
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

  // Reset theme settings to pure dark mode without color theme
  const resetThemeSettings = () => {
    // Clear custom theme properties
    document.documentElement.style.removeProperty('--custom-primary-hue');
    document.documentElement.style.removeProperty('--custom-primary-saturation');
    document.documentElement.style.removeProperty('--custom-primary-lightness');

    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-blue', 'theme-purple', 'theme-orange',
      'theme-emerald', 'theme-pink', 'theme-custom'
    );

    // Add dark and lights-out but no color theme
    document.documentElement.classList.add('dark', 'lights-out');

    // Reset state variables
    setTheme("dark");
    setNextTheme("dark");
    setDarkVariant("lights-out");
    setIsUsingCustomColor(false);
    setColorScheme("");
    setActiveThemeValue("");

    // Force localStorage update
    localStorage.setItem('theme', 'dark');
    localStorage.removeItem('theme-color'); // Remove instead of setting to blue
    localStorage.setItem('theme-color-mode', 'lights-out');
    localStorage.setItem('using-custom-color', 'false');

    toast.success("Theme settings reset to defaults");
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
          <div className="flex justify-between items-center mb-6 flex-wrap">
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
                    onClick={() => {
                      handleThemeChange(colorTheme.id)
                    }}
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

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Preset Colors</h4>
                  {isUsingCustomColor && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleResetToPreset('default')}
                      className="h-7 text-xs gap-1.5"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Reset to preset
                    </Button>
                  )}
                </div>
                <RadioGroup
                  value={activeThemeValue}
                  onValueChange={(value) => {
                    console.log("Color scheme selected:", value);
                    setActiveThemeValue(value);
                    if (value === 'custom') {
                      setIsUsingCustomColor(true);
                      applyCustomColor(customColor);
                    } else {
                      setIsUsingCustomColor(false);
                      setColorScheme(value);
                    }
                  }}
                  className="grid grid-cols-2 md:grid-cols-6 gap-3"
                >
                  {/* Preset color options */}
                  <div>
                    <RadioGroupItem
                      value="blue"
                      id="blue"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="blue"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[hsl(221.2,83.2%,53.3%)]" />
                      <span className="text-xs mt-1">Blue</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="purple"
                      id="purple"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="purple"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[hsl(272,91%,65%)]" />
                      <span className="text-xs mt-1">Purple</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="orange"
                      id="orange"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="orange"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[hsl(30,95%,60%)]" />
                      <span className="text-xs mt-1">Orange</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="emerald"
                      id="emerald"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="emerald"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[hsl(160,84%,39%)]" />
                      <span className="text-xs mt-1">Emerald</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="pink"
                      id="pink"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="pink"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[hsl(336,80%,65%)]" />
                      <span className="text-xs mt-1">Pink</span>
                    </Label>
                  </div>
                  
                  {/* Custom color option */}
                  <div>
                    <RadioGroupItem
                      value="custom"
                      id="custom"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="custom"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                      onClick={() => {
                        console.log("Custom color clicked");
                        setActiveThemeValue('custom');
                        setIsUsingCustomColor(true);
                        applyCustomColor(customColor);
                      }}
                    >
                      <Popover modal>
                        <PopoverTrigger >
                          <div className="w-6 h-6 rounded-full relative overflow-hidden cursor-pointer" style={{ background: hslToString(customColor) }}>
                            {isUsingCustomColor && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <Paintbrush className="h-4 w-4 text-white drop-shadow-md" />
                              </div>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4" align="center">
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-center mb-2">Custom Color</h4>
                            
                            <div className="w-full h-24 rounded-md relative overflow-hidden" style={{ background: hslToString(previewColor) }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white text-xs font-mono drop-shadow-md bg-black/20 px-2 py-1 rounded">
                                  HSL({previewColor.hue}, {previewColor.saturation}, {previewColor.lightness})
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span>Hue ({previewColor.hue}°)</span>
                                  <span className="text-muted-foreground">0-360</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="360" 
                                  value={previewColor.hue}
                                  onChange={(e) => setPreviewColor({ 
                                    ...previewColor, 
                                    hue: parseInt(e.target.value) 
                                  })}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                  style={{
                                    background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                                  }}
                                />
                              </div>
                              
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span>Saturation ({previewColor.saturation}%)</span>
                                  <span className="text-muted-foreground">0-100</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={previewColor.saturation}
                                  onChange={(e) => setPreviewColor({ 
                                    ...previewColor, 
                                    saturation: parseInt(e.target.value) 
                                  })}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, hsl(${previewColor.hue}, 0%, ${previewColor.lightness}%), hsl(${previewColor.hue}, 100%, ${previewColor.lightness}%))`,
                                  }}
                                />
                              </div>
                              
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span>Lightness ({previewColor.lightness}%)</span>
                                  <span className="text-muted-foreground">0-100</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={previewColor.lightness}
                                  onChange={(e) => setPreviewColor({ 
                                    ...previewColor, 
                                    lightness: parseInt(e.target.value) 
                                  })}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer" 
                                  style={{
                                    background: `linear-gradient(to right, hsl(${previewColor.hue}, ${previewColor.saturation}%, 0%), hsl(${previewColor.hue}, ${previewColor.saturation}%, 50%), hsl(${previewColor.hue}, ${previewColor.saturation}%, 100%))`,
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => setPreviewColor(customColor)}
                              >
                                Reset
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleCustomColorSelect}
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="text-xs mt-1">Custom</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ThemeSettings
