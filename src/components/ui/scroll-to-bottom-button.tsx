"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToBottomButtonProps {
  containerRef: React.RefObject<HTMLDivElement>;
  className?: string;
  offset?: number;
  onClick?: () => void;
}

const ScrollToBottomButton = ({ 
  containerRef, 
  className,
  offset = 200,
  onClick 
}: ScrollToBottomButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < offset;
      setIsVisible(!isNearBottom && scrollHeight > clientHeight + 100);
    };

    // Initial check
    checkScrollPosition();

    // Add scroll event listener
    container.addEventListener('scroll', checkScrollPosition);
    
    // Cleanup
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [containerRef, offset]);

  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed rounded-full p-2 bg-primary text-primary-foreground shadow-lg",
        "transition-all duration-300 transform hover:scale-110 active:scale-90",
        "flex items-center justify-center z-10 animate-float",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
        className
      )}
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-5 w-5" />
    </button>
  );
};

export default ScrollToBottomButton;
