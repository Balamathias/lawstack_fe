import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { 
  CalendarDays, 
  Clock, 
  GraduationCap, 
  School, 
  Brain,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn, getSemester } from '@/lib/utils';
import OpenChatButton from './open-chat-button';
import { Question, Course, User } from '@/@types/db';

interface QuestionHeaderProps {
  question: Question;
  course: Course;
  user: User | null;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ question, course, user }) => {
  return (
    <Card className="border-0 overflow-hidden relative glass-effect backdrop-blur-xl shadow-2xl shadow-primary/5">
      {/* Enhanced glassmorphic background with liquid glass effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-purple-500/5" />
        
        {/* Animated liquid glass orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-pink-500/10 rounded-full blur-2xl animate-pulse-glow" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
        
        {/* Liquid glass shine effect */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      
      <CardHeader className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-6">
        <div className="flex flex-col space-y-4 sm:space-y-5">
          {/* Question identifier row with enhanced styling */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge 
              variant="outline" 
              className="text-primary border-primary/40 bg-primary/10 backdrop-blur-sm font-semibold px-3 py-1 text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Past Question
              </span>
            </Badge>

            <div className="flex items-center gap-3 text-muted-foreground text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-background/30 backdrop-blur-sm">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{question.year} • {question.session}</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-background/30 backdrop-blur-sm">
                <School className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{course.code}</span>
              </div>
            </div>
          </div>

          {/* Course title with enhanced typography */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-foreground leading-tight">
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                {course.name}
              </span>
            </h1>
            
            {/* Metadata badges with glassmorphic styling */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-sm border border-border/30">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium">{getSemester(question.semester)}</span>
              </div>
              
              {question.level && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-sm border border-border/30">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium">{question.level} Level</span>
                </div>
              )}

              {question.marks && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {question.marks} Mark{question.marks !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button 
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white shadow-2xl hover:shadow-cyan-500/25 gap-2 transition-all duration-300 group relative overflow-hidden rounded-xl"
            >
              <Link href={`/dashboard/quizzes?course=${course?.id}`} className="flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 rounded-xl blur opacity-0 group-hover:opacity-75 transition-all duration-500 -z-10"></div>
                <Brain className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                <span className="ml-2 font-medium relative z-10">Practice Quiz</span>
              </Link>
            </Button>
            
            <div className="transition-all duration-300 hover:scale-105">
              <OpenChatButton question={question} user={user} />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default QuestionHeader;
