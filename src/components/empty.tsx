import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils';
import { BarChart } from 'lucide-react'
import React, { ReactNode } from 'react'

type ColorType = 'red' | 'green' | 'blue' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray' | 'amber' | 'orange';

interface EmptyProps {
  icon?: React.ReactNode;
  content?: string | ReactNode;
  color?: ColorType;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'glassmorphic';
}

const Empty = ({color = 'gray', content, icon, className, title, action, variant = 'glassmorphic'}: EmptyProps) => {
  const colorClasses: Record<ColorType, { bg: string, text: string, glow: string, border: string }> = {
    red: { 
      bg: 'bg-red-50/80 dark:bg-red-950/30', 
      text: 'text-red-600 dark:text-red-400', 
      glow: 'shadow-red-500/10',
      border: 'border-red-200/50 dark:border-red-800/50'
    },
    green: { 
      bg: 'bg-green-50/80 dark:bg-green-950/30', 
      text: 'text-green-600 dark:text-green-400', 
      glow: 'shadow-green-500/10',
      border: 'border-green-200/50 dark:border-green-800/50'
    },
    blue: { 
      bg: 'bg-blue-50/80 dark:bg-blue-950/30', 
      text: 'text-blue-600 dark:text-blue-400', 
      glow: 'shadow-blue-500/10',
      border: 'border-blue-200/50 dark:border-blue-800/50'
    },
    yellow: { 
      bg: 'bg-yellow-50/80 dark:bg-yellow-950/30', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      glow: 'shadow-yellow-500/10',
      border: 'border-yellow-200/50 dark:border-yellow-800/50'
    },
    indigo: { 
      bg: 'bg-indigo-50/80 dark:bg-indigo-950/30', 
      text: 'text-indigo-600 dark:text-indigo-400', 
      glow: 'shadow-indigo-500/10',
      border: 'border-indigo-200/50 dark:border-indigo-800/50'
    },
    purple: { 
      bg: 'bg-purple-50/80 dark:bg-purple-950/30', 
      text: 'text-purple-600 dark:text-purple-400', 
      glow: 'shadow-purple-500/10',
      border: 'border-purple-200/50 dark:border-purple-800/50'
    },
    pink: { 
      bg: 'bg-pink-50/80 dark:bg-pink-950/30', 
      text: 'text-pink-600 dark:text-pink-400', 
      glow: 'shadow-pink-500/10',
      border: 'border-pink-200/50 dark:border-pink-800/50'
    },
    gray: { 
      bg: 'bg-gray-50/80 dark:bg-gray-950/30', 
      text: 'text-gray-600 dark:text-gray-400', 
      glow: 'shadow-gray-500/10',
      border: 'border-gray-200/50 dark:border-gray-800/50'
    },
    amber: { 
      bg: 'bg-amber-50/80 dark:bg-amber-950/30', 
      text: 'text-amber-600 dark:text-amber-400', 
      glow: 'shadow-amber-500/10',
      border: 'border-amber-200/50 dark:border-amber-800/50'
    },
    orange: { 
      bg: 'bg-orange-50/80 dark:bg-orange-950/30', 
      text: 'text-orange-600 dark:text-orange-400', 
      glow: 'shadow-orange-500/10',
      border: 'border-orange-200/50 dark:border-orange-800/50'
    },
  };

  const colorClass = colorClasses[color] || colorClasses.gray;

  if (variant === 'default') {
    // Original component for backward compatibility
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md w-full p-8 flex flex-col items-center justify-center text-center border-none !bg-inherit">
          <div className={cn("w-14 h-14 flex items-center justify-center rounded-full mb-4", colorClass.bg)}>
            {icon ? icon : <BarChart className={cn("h-6 w-6", colorClass.text)} />}
          </div>
          
          {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
          
          <div className="text-muted-foreground mb-6">
            {content ? content : "There is nothing here right now."}
          </div>
          
          {action && <div className="mt-2">{action}</div>}
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <Card className={cn(
        "max-w-md w-full p-8 flex flex-col items-center justify-center text-center",
        "bg-background/50 backdrop-blur-sm border border-border/50",
        "shadow-lg transition-all duration-300 hover:shadow-xl",
        className
      )}>
        {/* Professional icon container */}
        <div className={cn(
          "w-16 h-16 flex items-center justify-center rounded-2xl mb-6",
          "border transition-all duration-300",
          colorClass.bg,
          colorClass.border
        )}>
          {icon ? 
            <div className={cn("", colorClass.text)}>
              {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8" } as any)}
            </div> : 
            <BarChart className={cn("h-8 w-8", colorClass.text)} />
          }
        </div>
        
        {title && (
          <h3 className="text-xl font-semibold mb-3 text-foreground">
            {title}
          </h3>
        )}
        
        <div className="text-muted-foreground mb-6 text-sm leading-relaxed max-w-sm">
          {content ? content : "There is nothing here right now."}
        </div>
        
        {action && (
          <div className="mt-2">
            {action}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Empty
