'use client';

import { cn } from '@/lib/utils';
import { LayoutGrid, List } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Toggle } from '../ui/toggle';
import { motion } from 'framer-motion';

interface SwitchDisplayProps {
  className?: string;
}

const SwitchDisplay = ({ className }: SwitchDisplayProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentView = searchParams.get('view') || 'list';
  
  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  return (
    <div className={cn("flex items-center gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-lg border shadow-sm", className)}>
      <Toggle
        variant="outline"
        size="sm"
        pressed={currentView === 'list'}
        onPressedChange={() => setView('list')}
        className={cn(
          "h-9 px-3 rounded-md data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
          "border-transparent data-[state=on]:border-primary/20",
          "transition-all"
        )}
      >
        <List className="h-4 w-4 mr-2" />
        <span className="text-sm">List</span>
        {currentView === 'list' && (
          <motion.div 
            layoutId="activeView"
            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Toggle>
      
      <Toggle
        variant="outline"
        size="sm"
        pressed={currentView === 'grid'}
        onPressedChange={() => setView('grid')}
        className={cn(
          "h-9 px-3 rounded-md data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
          "border-transparent data-[state=on]:border-primary/20",
          "transition-all"
        )}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        <span className="text-sm">Grid</span>
        {currentView === 'grid' && (
          <motion.div 
            layoutId="activeView"
            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Toggle>
    </div>
  );
};

export default SwitchDisplay;