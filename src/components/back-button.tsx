'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  className?: string
  href?: string
  variant?: 'default' | 'ghost' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

const BackButton = ({ 
  label = "Back", 
  className,
  href,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick
}: BackButtonProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (disabled) return
    
    if (onClick) {
      onClick()
      return
    }

    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const variants = {
    default: 'text-muted-foreground hover:text-foreground bg-transparent hover:bg-accent/50',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-transparent',
    minimal: 'text-muted-foreground hover:text-primary'
  }

  const sizes = {
    sm: 'gap-1 text-sm',
    md: 'gap-2 text-base',
    lg: 'gap-2 text-lg'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  return (
    <button 
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1.5 font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={handleBack}
      disabled={disabled}
      type="button"
      aria-label={`Navigate ${label.toLowerCase()}`}
    >
      <ChevronLeft size={iconSizes[size]} className="shrink-0" />
      <span>{label}</span>
    </button>
  )
}

export default BackButton