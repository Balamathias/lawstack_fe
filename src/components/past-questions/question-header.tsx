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
    <Card className="border-primary/20 overflow-hidden relative bg-gradient-to-br from-card/90 via-card to-card/95 shadow-md">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.02)_25%,rgba(68,68,68,.02)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.02)_75%)] bg-[length:12px_12px]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <CardHeader className="relative z-10 px-3 sm:px-5 md:px-6 pt-4 pb-3 sm:pt-5 sm:pb-4">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Question identifier row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 font-medium px-2 py-0.5 text-sm shadow-sm">
              Past Question
            </Badge>

            <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>{question.year} • {question.session}</span>
              </div>
              <span className="text-muted-foreground/40">|</span>
              <div className="flex items-center gap-1">
                <School className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>{course.code}</span>
              </div>
            </div>
          </div>

          {/* Course title and metadata */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-foreground">
              {course.name}
            </h1>
            
            <div className="flex flex-wrap gap-3 items-center text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>{getSemester(question.semester)}</span>
              </div>
              
              {question.level && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{question.level} Level</span>
                </div>
              )}

              {question.marks && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{question.marks} Mark{question.marks !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <Button
              asChild
              className="bg-primary/90 hover:bg-primary text-primary-foreground shadow border border-primary/10 gap-1.5 sm:gap-2 transition-all h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3"
              size="sm"
            >
              <Link href={`/dashboard/quizzes?course=${course?.id}`}>
                <Brain className="h-3.5 w-3.5" />
                <span>Practice CBT</span>
              </Link>
            </Button>
            
            <OpenChatButton question={question} user={user} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default QuestionHeader;
