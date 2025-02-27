import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils';
import { BarChart } from 'lucide-react'
import React, { ReactNode } from 'react'

declare interface EmptyProps {
    icon?: React.ReactNode;
    content?: string | ReactNode;
    color?: 'red' | 'green' | 'blue' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray' | 'amber' | 'orange',
    className?: string;
    title?: string;
}

const Empty = ({color, content, icon, className, title}: EmptyProps) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Card className={cn("bg-white dark:bg-card/50 p-4 h flex flex-col items-center justify-center gap-y-2 md:gap-y-2.5 rounded-3xl border-none my-2 shadow-none drop-shadow-none", className)}>
            <div className={`w-12 h-12 flex items-center justify-center bg-${color ?? 'red'}-600/20 rounded-full text-${color ?? 'red'}-500`}>
             { icon ? icon : <BarChart size={16} className={`text-${color ?? 'red'}-500`} />}
            </div>
            {title && <p className="text-lg font-semibold text-muted-foreground text-center">{title}</p>}
            {
                content ? <div className="text-muted-foreground text-sm text-center md:text-base tracking-tighter">{content}</div> :
                <p className="text-muted-foreground text-center text-sm md:text-base tracking-tighter">There is nothing here right now.</p>
            }
        </Card>
    </div>
  )
}

export default Empty
