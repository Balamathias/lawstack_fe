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
}

const Empty = ({color = 'red', content, icon, className, title, action}: EmptyProps) => {
  const colorClasses: Record<ColorType, { bg: string, text: string }> = {
    red: { bg: 'bg-red-600/20', text: 'text-red-500' },
    green: { bg: 'bg-green-600/20', text: 'text-green-500' },
    blue: { bg: 'bg-blue-600/20', text: 'text-blue-500' },
    yellow: { bg: 'bg-yellow-600/20', text: 'text-yellow-500' },
    indigo: { bg: 'bg-indigo-600/20', text: 'text-indigo-500' },
    purple: { bg: 'bg-purple-600/20', text: 'text-purple-500' },
    pink: { bg: 'bg-pink-600/20', text: 'text-pink-500' },
    gray: { bg: 'bg-gray-600/20', text: 'text-gray-500' },
    amber: { bg: 'bg-amber-600/20', text: 'text-amber-500' },
    orange: { bg: 'bg-orange-600/20', text: 'text-orange-500' },
  };

  const colorClass = colorClasses[color] || colorClasses.red;

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

export default Empty
