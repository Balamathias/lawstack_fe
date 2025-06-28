'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './button'

interface GlassmorphicModalProps {
  children: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((bool: boolean) => void)
  title?: string | React.ReactNode
  subtitle?: string
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

const GlassmorphicModal = ({
  children,
  trigger,
  open,
  setOpen,
  title,
  subtitle,
  className,
  maxWidth = 'lg'
}: GlassmorphicModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md', 
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl'
  }[maxWidth]

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger && (
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
        )}
        <DialogContent 
          className={cn(
            "border-none shadow-2xl focus:outline-none rounded-xl overflow-hidden",
            "bg-background/15 border-background/20 backdrop-blur-xl",
            maxWidthClass,
            className
          )}
        >
          {title && (
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-foreground">
                {title}
              </DialogTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </DialogHeader>
          )}
          <div className="space-y-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger && (
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
      )}
      <DrawerContent 
        className={cn(
          "border-none focus:outline-none rounded-t-2xl max-h-[90vh]",
          "bg-background/15 backdrop-blur-xl",
          "border-t border-l border-r border-border/20",
          className
        )}
      >
        <div className="mx-auto w-12 h-1.5 bg-muted-foreground/40 rounded-full mt-3 mb-4" />
        
        {title && (
          <div className="flex items-center justify-between px-4 pb-4">
            <div>
              <DrawerTitle className="text-xl font-semibold text-foreground">
                {title}
              </DrawerTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        )}
        
        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default GlassmorphicModal
