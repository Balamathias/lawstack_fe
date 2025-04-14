'use client'

import React, { useMemo } from 'react'

interface GridPatternProps {
  // Theme options - expanded to match your theme system
  theme?: 'light' | 'dark' | 'blue' | 'purple' | 'orange' | 'pink' | 'emerald' | 'custom'
  
  // Dark mode variant
  darkMode?: 'subtle' | 'lights-out' | 'default'
  
  // Custom colors (only used when theme is 'custom')
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  
  // Pattern options
  variant?: 'minimal' | 'standard' | 'detailed'
  density?: 'sparse' | 'normal' | 'dense'
  
  // Animation
  animated?: boolean
  
  // Container styling
  className?: string
  style?: React.CSSProperties
}

const EnhancedGridPattern: React.FC<GridPatternProps> = ({
  theme = 'light',
  darkMode = 'default',
  primaryColor,
  secondaryColor,
  accentColor,
  variant = 'standard',
  density = 'normal',
  animated = false,
  className = '',
  style = {},
}) => {
  // Get theme colors
  const colors = useMemo(() => {
    if (theme === 'custom' && primaryColor && secondaryColor && accentColor) {
      return { primary: primaryColor, secondary: secondaryColor, accent: accentColor };
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    const isLightsOut = isDark && darkMode === 'lights-out';
    
    // Use CSS variables aligned with your theming system
    switch (theme) {
      case 'dark':
        return {
          primary: 'rgba(255, 255, 255, 0.07)',
          secondary: 'rgba(255, 255, 255, 0.03)',
          accent: 'rgba(99, 102, 241, 0.2)'
        };
      case 'blue':
        return {
          primary: isLightsOut ? 'rgba(224, 231, 255, 0.07)' : 'rgba(59, 130, 246, 0.08)',
          secondary: isLightsOut ? 'rgba(224, 231, 255, 0.03)' : 'rgba(59, 130, 246, 0.04)',
          accent: isLightsOut ? 'rgba(93, 135, 255, 0.15)' : 'rgba(37, 99, 235, 0.15)'
        };
      case 'purple':
        return {
          primary: isLightsOut ? 'rgba(232, 222, 248, 0.07)' : 'rgba(139, 92, 246, 0.08)',
          secondary: isLightsOut ? 'rgba(232, 222, 248, 0.03)' : 'rgba(139, 92, 246, 0.04)',
          accent: isLightsOut ? 'rgba(161, 107, 255, 0.15)' : 'rgba(109, 40, 217, 0.15)'
        };
      case 'orange':
        return {
          primary: isLightsOut ? 'rgba(255, 237, 213, 0.07)' : 'rgba(249, 115, 22, 0.08)',
          secondary: isLightsOut ? 'rgba(255, 237, 213, 0.03)' : 'rgba(249, 115, 22, 0.04)',
          accent: isLightsOut ? 'rgba(255, 156, 70, 0.15)' : 'rgba(234, 88, 12, 0.15)'
        };
      case 'pink':
        return {
          primary: isLightsOut ? 'rgba(252, 231, 243, 0.07)' : 'rgba(236, 72, 153, 0.08)',
          secondary: isLightsOut ? 'rgba(252, 231, 243, 0.03)' : 'rgba(236, 72, 153, 0.04)',
          accent: isLightsOut ? 'rgba(249, 112, 184, 0.15)' : 'rgba(219, 39, 119, 0.15)'
        };
      case 'emerald':
        return {
          primary: isLightsOut ? 'rgba(209, 250, 229, 0.07)' : 'rgba(16, 185, 129, 0.08)',
          secondary: isLightsOut ? 'rgba(209, 250, 229, 0.03)' : 'rgba(16, 185, 129, 0.04)',
          accent: isLightsOut ? 'rgba(52, 211, 153, 0.15)' : 'rgba(5, 150, 105, 0.15)'
        };
      case 'light':
      default:
        return {
          primary: 'rgba(0, 0, 0, 0.05)',
          secondary: 'rgba(0, 0, 0, 0.02)',
          accent: 'rgba(79, 70, 229, 0.1)'
        };
    }
  }, [theme, darkMode, primaryColor, secondaryColor, accentColor]);
  
  // Determine grid parameters based on variant and density
  const gridParams = useMemo(() => {
    const densityFactor = density === 'sparse' ? 1.5 : density === 'dense' ? 0.5 : 1;
    
    switch (variant) {
      case 'minimal':
        return {
          mainGridSize: 100 * densityFactor,
          fineGridSize: 20 * densityFactor,
          gridOpacity: 0.7,
          decorations: [{ cx: '50%', cy: '50%', r: 8, opacity: 0.3 }]
        };
      case 'detailed':
        return {
          mainGridSize: 40 * densityFactor,
          fineGridSize: 8 * densityFactor,
          gridOpacity: 1.2,
          decorations: [
            { cx: '20%', cy: '30%', r: 5, opacity: 0.7 },
            { cx: '80%', cy: '60%', r: 3, opacity: 0.5 },
            { cx: '65%', cy: '15%', r: 7, opacity: 0.3 },
            { cx: '35%', cy: '80%', r: 4, opacity: 0.6 },
            { cx: '10%', cy: '90%', r: 6, opacity: 0.4 }
          ]
        };
      default:
        return {
          mainGridSize: 50 * densityFactor,
          fineGridSize: 10 * densityFactor,
          gridOpacity: 1,
          decorations: [
            { cx: '20%', cy: '30%', r: 5, opacity: 0.7 },
            { cx: '80%', cy: '60%', r: 3, opacity: 0.5 },
            { cx: '65%', cy: '15%', r: 7, opacity: 0.3 }
          ]
        };
    }
  }, [variant, density]);
  
  // Animation class based on globals.css
  const animationClass = animated ? 'animate-pulse-custom' : '';
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      preserveAspectRatio="xMidYMid slice"
      style={style}
    >
      <defs>
        <radialGradient id="grid-gradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </radialGradient>
        
        <pattern 
          id="fine-grid" 
          x="0" y="0" 
          width={gridParams.fineGridSize} 
          height={gridParams.fineGridSize} 
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="0.5" height={gridParams.fineGridSize} fill={colors.secondary} opacity={gridParams.gridOpacity * 0.7} />
          <rect x="0" y="0" width={gridParams.fineGridSize} height="0.5" fill={colors.secondary} opacity={gridParams.gridOpacity * 0.7} />
        </pattern>
        
        <pattern 
          id="main-grid" 
          x="0" y="0" 
          width={gridParams.mainGridSize} 
          height={gridParams.mainGridSize} 
          patternUnits="userSpaceOnUse"
        >
          <rect width={gridParams.mainGridSize} height={gridParams.mainGridSize} fill="url(#fine-grid)" />
          <rect x="0" y="0" width="1" height={gridParams.mainGridSize} fill={colors.primary} opacity={gridParams.gridOpacity} />
          <rect x="0" y="0" width={gridParams.mainGridSize} height="1" fill={colors.primary} opacity={gridParams.gridOpacity} />
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#main-grid)" />
      <rect width="100%" height="100%" fill="url(#grid-gradient)" />
      
      <g className={animationClass}>
        {gridParams.decorations.map((decoration, index) => (
          <circle
            key={`decoration-${index}`}
            cx={decoration.cx}
            cy={decoration.cy}
            r={decoration.r}
            fill={colors.accent}
            opacity={decoration.opacity}
            className={animated ? 'animate-bounce-slow' : ''}
            style={animated ? { animationDelay: `${index * 0.2}s` } : {}}
          />
        ))}
      </g>
      
      {variant === 'detailed' && (
        <>
          <path
            d={`M10,10 Q50,30 90,10`}
            fill="none"
            stroke={colors.accent}
            strokeWidth="0.2"
            opacity="0.3"
          />
          <path
            d={`M10,90 Q50,70 90,90`}
            fill="none"
            stroke={colors.accent}
            strokeWidth="0.2"
            opacity="0.3"
          />
        </>
      )}
    </svg>
  )
}

export default EnhancedGridPattern