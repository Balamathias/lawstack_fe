import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calendar, Clock, GraduationCap, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, getSemester } from '@/lib/utils';
import MarkdownPreview from '@/components/markdown-preview';
import { Question } from '@/@types/db';

interface QuestionGridItemProps {
  question: Question;
  index: number;
  className?: string;
}

const QuestionGridItem: React.FC<QuestionGridItemProps> = ({ 
  question, 
  index, 
  className 
}) => {
  // Generate a pattern for this card based on course name
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

  const pattern = getPattern(question.course_name || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      {/* Background pattern */}
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
        className="flex flex-col relative z-10 p-6 h-full w-full"
      >
        {/* Question content */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex justify-between items-start gap-4">
            <div className="font-medium text-foreground/90 line-clamp-3">
              <MarkdownPreview content={question.text} />
            </div>
            
            <div className="group-hover:bg-primary/20 p-2 rounded-full transform group-hover:rotate-12 transition-all duration-300">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </div>
          
          {/* Tags and metadata */}
          <div className="flex flex-wrap gap-2 mt-auto pt-4">
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

            {/* Marks */}
            {question.marks && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 flex items-center gap-1.5 px-2 py-1">
                <Hash className="h-3 w-3" />
                <span className="text-xs">{question.marks} Mark{question.marks !== 1 ? 's' : ''}</span>
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuestionGridItem;
