import React from 'react'

interface GridPatternProps {
  isDarkMode?: boolean
}

const EnhancedGridPattern: React.FC<GridPatternProps> = ({ isDarkMode = false }) => {
  const primaryColor = isDarkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'
  const secondaryColor = isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
  const accentColor = isDarkMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 pointer-events-none z-0"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="grid-gradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        
        <pattern id="fine-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="0.5" height="10" fill={secondaryColor} />
          <rect x="0" y="0" width="10" height="0.5" fill={secondaryColor} />
        </pattern>
        
        <pattern id="main-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#fine-grid)" />
          <rect x="0" y="0" width="1" height="50" fill={primaryColor} />
          <rect x="0" y="0" width="50" height="1" fill={primaryColor} />
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#main-grid)" />
      <rect width="100%" height="100%" fill="url(#grid-gradient)" />
      
      {/* Decorative elements */}
      <circle cx="20%" cy="30%" r="5" fill={accentColor} opacity="0.7" />
      <circle cx="80%" cy="60%" r="3" fill={accentColor} opacity="0.5" />
      <circle cx="65%" cy="15%" r="7" fill={accentColor} opacity="0.3" />
    </svg>
  )
}

export default EnhancedGridPattern