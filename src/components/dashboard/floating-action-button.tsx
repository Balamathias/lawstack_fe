'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Plus, MessageSquare, BookOpen, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  className?: string
  onNewChat?: () => void
  onQuickSearch?: () => void
  onNewNote?: () => void
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  className = '',
  onNewChat,
  onQuickSearch,
  onNewNote
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const actions = [
    {
      icon: MessageSquare,
      label: 'New Chat',
      action: onNewChat,
      color: 'bg-blue-500 hover:bg-blue-600',
      delay: 0.1
    },
    {
      icon: Search,
      label: 'Quick Search',
      action: onQuickSearch,
      color: 'bg-purple-500 hover:bg-purple-600',
      delay: 0.15
    },
    {
      icon: BookOpen,
      label: 'New Note',
      action: onNewNote,
      color: 'bg-green-500 hover:bg-green-600',
      delay: 0.2
    }
  ].filter(action => action.action) // Only show actions that have handlers

  if (actions.length === 0) return null

  return (
    <div className={cn("fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30", className)}>
      {/* Action buttons */}
      <motion.div
        className="flex flex-col-reverse gap-3 mb-3"
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: isOpen ? 0 : 20, 
              opacity: isOpen ? 1 : 0 
            }}
            transition={{ 
              delay: isOpen ? action.delay : 0,
              duration: 0.2,
              type: "spring",
              stiffness: 200
            }}
            className="flex items-center gap-3"
          >
            {/* Label */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isOpen ? 1 : 0, 
                opacity: isOpen ? 1 : 0 
              }}
              transition={{ delay: action.delay + 0.1, duration: 0.1 }}
              className="bg-background/90 backdrop-blur-xl border border-border/20 rounded-lg px-3 py-2 shadow-lg"
            >
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {action.label}
              </span>
            </motion.div>
            
            {/* Button */}
            <Button
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full shadow-lg backdrop-blur-xl border-0 text-white",
                action.color
              )}
              onClick={() => {
                action.action?.()
                setIsOpen(false)
              }}
            >
              <action.icon className="h-5 w-5" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          className={cn(
            "w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 border-0 backdrop-blur-xl",
            "transition-all duration-300"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-6 w-6 text-primary-foreground" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Backdrop for closing */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default FloatingActionButton
