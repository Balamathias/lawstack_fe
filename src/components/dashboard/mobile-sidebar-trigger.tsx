'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'

interface MobileSidebarTriggerProps {
  onClick: () => void
  className?: string
}

export const MobileSidebarTrigger: React.FC<MobileSidebarTriggerProps> = ({
  onClick,
  className = ''
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`lg:hidden bg-background/80 backdrop-blur-xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl ${className}`}
      onClick={onClick}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}

export default MobileSidebarTrigger
