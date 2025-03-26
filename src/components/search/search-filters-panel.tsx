'use client';

import React from 'react';
import { SearchFilters } from '@/@types/db';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  filterOptions: {
    institutions: Array<{ id: string; name: string }>;
    courses: Array<{ id: string; name: string }>;
    years: string[];
    types: string[];
  };
}

export function SearchFiltersPanel({ filters, onChange, filterOptions }: SearchFiltersPanelProps) {
  // Count active filters
  const activeFilterCount = [
    filters.institution,
    filters.course,
    filters.year,
    filters.type
  ].filter(Boolean).length;
  
  return (
    <Card className="border border-border/50">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </div>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({
                institution: '',
                course: '',
                year: '',
                type: ''
              })}
              className="text-muted-foreground text-xs flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Institution</label>
            <Select
              value={filters.institution || ''}
              onValueChange={(value) => onChange({ institution: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Institutions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutions</SelectItem>
                {filterOptions.institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select
              value={filters.course || ''}
              onValueChange={(value) => onChange({ course: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {filterOptions.courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select
              value={filters.year || ''}
              onValueChange={(value) => onChange({ year: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {filterOptions.years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={filters.type || ''}
              onValueChange={(value) => onChange({ type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 