'use client'

import React, { useCallback, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import BaseFilter from './base-filter';
import { cn } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app'

export const FilterBySession = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  
  // Get selected session from URL
  const selectedSession = searchParams?.get('session') || '';

  // Create sessions (current academic year and 9 past ones)
  const currentYear = new Date().getFullYear();
  const sessions = Array.from({ length: 20 }, (_, i) => {
    const startYear = currentYear - i;
    return `${startYear}/${startYear + 1}`;
  });

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
  
  // Handle session selection
  const handleSessionChange = (session: string) => {
    const queryString = createQueryString({
      session: selectedSession === session ? null : session
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };
  
  const displayedSessions = showMore ? sessions : sessions.slice(0, 9);
  
  return (
    <BaseFilter 
      title="Academic Session" 
      icon={CalendarDays} 
      defaultOpen={!!selectedSession}
      contentClassName="pb-2"
      badge={selectedSession && (
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs font-normal">
          {selectedSession}
        </Badge>
      )}
    >
      <div className="space-y-4 overflow-auto h-auto">
        <div className="text-sm text-muted-foreground mb-4">
          Select an academic session
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {displayedSessions.map((session) => (
            <Badge
              key={session}
              variant="outline"
              className={cn(
                "justify-center py-1.5 cursor-pointer hover:bg-primary/10 transition-colors text-sm",
                selectedSession === session
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-card"
              )}
              onClick={() => handleSessionChange(session)}
            >
              {session}
            </Badge>
          ))}
        </div>

        {sessions.length > 9 && (
          <button 
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors py-2 border-t border-border/50 mt-2 pt-2"
          >
            {showMore ? (
              <>
                <ChevronUp className="h-3 w-3" />
                <span>Show fewer</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>Show more sessions</span>
              </>
            )}
          </button>
        )}
      </div>
    </BaseFilter>
  );
};