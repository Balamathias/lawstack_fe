'use client'

import React, { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import BaseFilter from './base-filter';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'nextjs-toploader/app'

export const FilterBySemester = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Get selected semester from URL
  const selectedSemester = searchParams?.get('semester') || '';

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
  
  // Handle semester selection
  const handleSemesterChange = (semester: string) => {
    const queryString = createQueryString({
      semester: selectedSemester === semester ? null : semester
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };
  
  return (
    <BaseFilter 
      title="Semester" 
      icon={Layers} 
      defaultOpen={!!selectedSemester}
      badge={selectedSemester && (
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs font-normal">
          {selectedSemester === '1' ? 'First Semester' : 'Second Semester'}
        </Badge>
      )}
    >
      <div className="space-y-4">
        <Tabs 
          value={selectedSemester || 'all'} 
          onValueChange={(value) => handleSemesterChange(value === 'all' ? '' : value)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
            <TabsTrigger value="1" className="text-sm">First</TabsTrigger>
            <TabsTrigger value="2" className="text-sm">Second</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            className={cn(
              "cursor-pointer rounded-lg border p-4 text-center hover:border-primary/50 hover:bg-accent/50 transition-colors",
              selectedSemester === '1' ? "border-primary bg-primary/5" : "border-muted"
            )}
            onClick={() => handleSemesterChange('1')}
          >
            <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-primary font-bold text-lg">1st</span>
            </div>
            <h4 className="font-medium">First Semester</h4>
            <p className="text-xs text-muted-foreground mt-1">August - December</p>
          </div>
          
          <div 
            className={cn(
              "cursor-pointer rounded-lg border p-4 text-center hover:border-primary/50 hover:bg-accent/50 transition-colors",
              selectedSemester === '2' ? "border-primary bg-primary/5" : "border-muted"
            )}
            onClick={() => handleSemesterChange('2')}
          >
            <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-primary font-bold text-lg">2nd</span>
            </div>
            <h4 className="font-medium">Second Semester</h4>
            <p className="text-xs text-muted-foreground mt-1">January - May</p>
          </div>
        </div>
      </div>
    </BaseFilter>
  );
};