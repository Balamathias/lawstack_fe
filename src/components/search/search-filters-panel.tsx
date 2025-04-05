'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal, School, BookOpen, Calendar, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FilterOptions } from '@/services/server/search';

interface SearchFiltersPanelProps {
  filters: {
    institution?: string;
    course?: string;
    year?: string;
    type?: string;
  };
  onChange: (filters: Partial<Record<string, any>>) => void;
  filterOptions: FilterOptions;
}

export function SearchFiltersPanel({ filters, onChange, filterOptions }: SearchFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  
  // Handle form submission to ensure values are passed correctly
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    console.log(`Changing filter ${key} to ${value}`);
    onChange({ [key]: value });
  };
  
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Search Filters</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="outline" 
                className="ml-2 text-xs h-5 px-1.5 py-0 bg-primary/10 border-primary/20 text-primary"
              >
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          
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
              className="text-muted-foreground text-xs flex items-center gap-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
        <CardDescription>Narrow your search results with these filters</CardDescription>
      </CardHeader>
      
      <CardContent className="p-5 pt-4 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <School className="h-3.5 w-3.5 text-purple-500" />
              Institution
            </label>
            <Select
              value={filters.institution || ''}
              onValueChange={(value) => handleFilterChange('institution', value)}
            >
              <SelectTrigger className="w-full bg-card border-border/60">
                <SelectValue placeholder="All Institutions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutions</SelectItem>
                {filterOptions?.institutions?.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              Course
            </label>
            <Select
              value={filters.course || ''}
              onValueChange={(value) => handleFilterChange('course', value)}
            >
              <SelectTrigger className="w-full bg-card border-border/60">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {filterOptions?.courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-500" />
              Year
            </label>
            <Select
              value={filters.year || ''}
              onValueChange={(value) => handleFilterChange('year', value)}
            >
              <SelectTrigger className="w-full bg-card border-border/60">
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
            <label className="text-sm font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-500" />
              Content Type
            </label>
            <Select
              value={filters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="w-full bg-card border-border/60">
                <SelectValue placeholder="All Content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions?.types?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* AI Suggestion feature */}
        <div className="mt-2 pt-4 border-t border-border/40">
          <div 
            className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-3 rounded-lg border border-primary/20 text-sm flex items-center justify-between cursor-pointer hover:bg-primary/15 transition-colors"
            onClick={() => {}}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>Get AI suggestions based on your search filters</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-primary">Try</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

// Create a custom badge component with animation
function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <motion.span 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" 
          ? "border-transparent bg-primary text-primary-foreground" 
          : "border-border",
        className
      )}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
    >
      {children}
    </motion.span>
  );
}