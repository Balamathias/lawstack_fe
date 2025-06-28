'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string | React.ReactNode
  subtitle?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'xxl' | '2xl' | '3xl'
  className?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
}

const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'lg',
  className,
  showCloseButton = true,
  closeOnBackdropClick = true
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    xxl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              "relative w-full mx-auto",
              "bg-background/90 backdrop-blur-xl",
              "border border-border/20 rounded-[1.5rem] shadow-2xl",
              "overflow-hidden",
              "bg-gray-950/10 backdrop-blur-xl border-gray-500/20",
              sizeClasses[size],
              className
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-2.5 md:p-6 pb-4">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-xl font-semibold text-foreground leading-6">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 ml-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={cn(
              "px-2.5 md:px-6",
              title || showCloseButton ? "pb-6" : "py-6"
            )}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default GlassModal
