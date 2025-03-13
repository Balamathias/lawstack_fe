"use client"

import { motion } from 'framer-motion'
import React from 'react'

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 opacity-80" />
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Legal pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBzdHJva2U9IiMwMDAiIHN0cm9rZS1vcGFjaXR5PSIuMDIiIHN0cm9rZS13aWR0aD0iLjUiIGQ9Ik0zMCAwdjYwTTYwIDMwSDBNNDUgMTVMMTUgNDVNMTUgMTVsNDUgMzBNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-[0.03] dark:opacity-[0.02]" />
      
      {/* Scale of justice symbol */}
      <div className="absolute left-1/2 top-3/4 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.01]">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C10.9 4 10 4.9 10 6V8H14V6C14 4.9 13.1 4 12 4Z" fill="currentColor"/>
          <path d="M18 8H6C4.9 8 4 8.9 4 10H20C20 8.9 19.1 8 18 8Z" fill="currentColor"/>
          <path d="M7 11H5V16.8C5 17.3 5.3 17.8 5.8 18L9 20V11H7Z" fill="currentColor"/>
          <path d="M15 11V20L18.2 18C18.7 17.8 19 17.3 19 16.8V11H17H15Z" fill="currentColor"/>
          <path d="M12 11H11V21H13V11H12Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  )
}

export default BackgroundEffects
