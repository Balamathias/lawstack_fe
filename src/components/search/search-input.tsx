'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchInput({ value, onChange, isLoading, placeholder }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Sync input value with parent component
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl+K or Meta+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Clear on Escape
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setInputValue('');
        onChange('');
        inputRef.current?.blur();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(inputValue);
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || "Search..."}
          className="pl-11 pr-16 py-6 h-14 bg-transparent border-primary/10 placeholder:text-muted-foreground/70 text-base focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
        />
        
        {inputValue && (
          <div className="absolute right-3 flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              onClick={() => {
                setInputValue('');
                onChange('');
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 hover:bg-primary/90 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
      
      <div className="absolute right-4 bottom-0 transform translate-y-full mt-1.5 text-xs text-muted-foreground opacity-70 hover:opacity-100 transition-opacity">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/40 font-mono text-xs">Ctrl K</kbd> to search
      </div>
    </form>
  );
} 