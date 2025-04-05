'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2, X, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function SearchInput({ value, onChange, isLoading, placeholder }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Keep input value in sync with parent
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input on Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Submit search on Enter when focused
      if (e.key === 'Enter' && isFocused && inputValue.trim()) {
        console.log("Submitting search on Enter:", inputValue.trim());
        onChange(inputValue.trim());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange, inputValue, isFocused]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting search form:", inputValue.trim());
    if (inputValue.trim()) {
      onChange(inputValue.trim());
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    setShowHints(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowHints(false), 200);
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative group w-full">
      <motion.div 
        className={cn(
          "relative flex items-center rounded-xl transition-all duration-300 overflow-hidden",
          isFocused 
            ? "shadow-lg ring-2 ring-primary/30 bg-background/95 backdrop-blur-sm" 
            : "shadow hover:shadow-md bg-background"
        )}
        initial={false}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="absolute left-3.5 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || "Search..."}
          className="pl-11 pr-16 py-6 h-14 bg-transparent border-primary/10 placeholder:text-muted-foreground/70 text-base focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
        />
        
        <div className="absolute right-3.5 flex items-center gap-2">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                onChange('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <div className="hidden sm:flex items-center pl-2 border-l border-border/50 h-6">
            <kbd className="hidden sm:flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 text-xs font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </motion.div>
      
      {/* Search hints */}
      {showHints && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute mt-2 w-full bg-card/90 backdrop-blur-sm rounded-lg border shadow-lg p-3 z-50"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Command className="h-3.5 w-3.5" />
              <span>Search tips</span>
            </span>
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary bg-primary/5">course:"contract law"</Badge>
              <span>Search in specific course</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary bg-primary/5">year:2023</Badge>
              <span>Search by year</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary bg-primary/5">type:question</Badge>
              <span>Filter by content type</span>
            </div>
          </div>
        </motion.div>
      )}
    </form>
  );
}