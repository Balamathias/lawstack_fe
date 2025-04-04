'use client'

import React, { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import BaseFilter from './base-filter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRouter } from 'nextjs-toploader/app'

export const FilterByLevel = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Define levels
  const levels = [
    { value: '100', label: '100 Level', color: 'from-emerald-500 to-green-500' },
    { value: '200', label: '200 Level', color: 'from-blue-500 to-cyan-500' },
    { value: '300', label: '300 Level', color: 'from-violet-500 to-indigo-500' },
    { value: '400', label: '400 Level', color: 'from-amber-500 to-yellow-500' },
    { value: '500', label: '500 Level', color: 'from-pink-500 to-rose-500' },
    { value: '600', label: '600 Level', color: 'from-red-500 to-orange-500' },
    { value: '700', label: '700 Level', color: 'from-purple-500 to-pink-500' },
  ];
  
  // Get selected level from URL
  const selectedLevel = searchParams?.get('level') || '';

  // Create new search params
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  // Handle level selection
  const handleLevelClick = (level: string) => {
    const queryString = createQueryString({
      level: selectedLevel === level ? null : level
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };
  
  return (
    <BaseFilter 
      title="Education Level" 
      icon={GraduationCap} 
      defaultOpen={!!selectedLevel}
      contentClassName="overflow-y-auto max-h-[400px] px-4 pt-1 pb-2"
      badge={selectedLevel && (
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs font-normal">
          {selectedLevel} Level
        </Badge>
      )}
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground sticky top-0 pt-3 pb-2 bg-card z-10">
          Select a level of study
        </div>
        
        <div className="grid grid-cols-1 gap-2 pb-2">
          {levels.map((level) => (
            <motion.div
              key={level.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLevelClick(level.value)}
              className={cn(
                "cursor-pointer rounded-lg border p-3 relative overflow-hidden",
                selectedLevel === level.value 
                  ? "border-primary bg-primary/5" 
                  : "border-muted bg-card hover:border-primary/30 hover:bg-accent/50"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-5 bg-gradient-to-r",
                level.color
              )} />
              
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white font-medium",
                    level.color
                  )}>
                    {level.value.substring(0, 1)}
                  </div>
                  <span className="font-medium">{level.label}</span>
                </div>
                
                {selectedLevel === level.value && (
                  <Badge className="bg-primary">Selected</Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseFilter>
  );
};