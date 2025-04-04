'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calendar, Clock, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, getSemester } from '@/lib/utils';
import MarkdownPreview from '@/components/markdown-preview';

interface CardListProps {
  data: any[];
}

const CardList = ({ data }: CardListProps) => {
  // Generate patterns for cards based on course name - moved inside client component
  const getPattern = (courseName: string = 'Default') => {
    const patterns = [
      'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/20px 20px',
      'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
      'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
      'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/24px 24px',
      'linear-gradient(30deg, currentColor 12%, transparent 12.5%, transparent 87%, currentColor 87.5%, currentColor 100%) 0 0/12px 12px',
      'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%) 0 0/12px 12px'
    ];
    
    // Generate a consistent pattern index based on course name
    const hash = courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return patterns[hash % patterns.length];
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {data.map((question, index) => {
        // Create a pattern for this card based on course name
        const pattern = getPattern(question.course_name || '');
        
        return (
          <motion.div
            key={question.id}
            variants={item}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/30 hover:shadow-lg flex flex-col md:flex-row gap-5"
          >
            {/* Pattern background */}
            <div className="absolute inset-0 pointer-events-none text-primary/[0.02] dark:text-primary/[0.015]">
              <div className="absolute inset-0 bg-repeat opacity-60" style={{ backgroundImage: pattern }} />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-70" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full opacity-50" />
            
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            
            <Link
              href={`/dashboard/past-questions/${question.id}`}
              className="flex flex-col md:flex-row md:items-center md:gap-5 relative z-10 p-6 h-full w-full"
            >
              {/* Question content */}
              <div className="flex flex-col gap-3 md:flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="font-medium text-foreground/90 line-clamp-2">
                    <MarkdownPreview content={question.text} />
                  </div>
                  
                  <div className="group-hover:bg-primary/20 p-2 rounded-full transform group-hover:rotate-12 transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
                
                {/* Tags and metadata */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 md:max-w-xl">
                  {/* Course name */}
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 flex items-center gap-1.5 px-2 py-1">
                    <BookOpen className="h-3 w-3 text-primary" />
                    <span className="text-xs truncate max-w-[100px]">{question.course_name}</span>
                  </Badge>
                  
                  {/* Year */}
                  {question.year && (
                    <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{question.year}</span>
                    </Badge>
                  )}
                  
                  {/* Semester */}
                  {question.semester && (
                    <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{getSemester(question.semester)}</span>
                    </Badge>
                  )}
                  
                  {/* Level */}
                  {question.level && (
                    <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                      <GraduationCap className="h-3 w-3" />
                      <span className="text-xs">{question.level} Level</span>
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CardList;
