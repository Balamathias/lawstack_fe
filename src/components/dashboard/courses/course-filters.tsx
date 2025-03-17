"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useInstitutions } from '@/services/client/institutions';
import { XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseFiltersProps {
  className?: string;
}

const CourseFilters = ({ className }: CourseFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [institution, setInstitution] = useState(
    searchParams?.get('institution') || ''
  );
  const [level, setLevel] = useState(
    searchParams?.get('level') || ''
  );

  // Fetch institutions for filter
  const { data: institutionsData } = useInstitutions();
  const institutions = institutionsData?.data || [];

  const hasActiveFilters = institution || level;

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (institution) {
      params.set('institution', institution);
    } else {
      params.delete('institution');
    }
    
    if (level) {
      params.set('level', level);
    } else {
      params.delete('level');
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [institution, level, router, pathname, searchParams]);

  const resetFilters = () => {
    setInstitution('');
    setLevel('');
  };

  return (
    <div className={cn("flex gap-2 items-start flex-wrap sm:flex-nowrap", className)}>
      <Select value={institution} onValueChange={setInstitution}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Institutions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Institutions</SelectItem>
          {institutions.map((inst) => (
            <SelectItem key={inst.id} value={inst.id}>
              {inst.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={level} onValueChange={setLevel}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Any Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Level</SelectItem>
          <SelectItem value="100">100 Level</SelectItem>
          <SelectItem value="200">200 Level</SelectItem>
          <SelectItem value="300">300 Level</SelectItem>
          <SelectItem value="400">400 Level</SelectItem>
          <SelectItem value="500">500 Level</SelectItem>
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={resetFilters}
          className="h-10 w-10"
        >
          <XCircle className="h-4 w-4" />
          <span className="sr-only">Reset filters</span>
        </Button>
      )}
    </div>
  );
};

export default CourseFilters;
