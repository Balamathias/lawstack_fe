import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarDays, 
  Clock, 
  GraduationCap, 
  School,
  FileText,
  Hash,
  Award,
  BookOpen,
  Building
} from 'lucide-react';
import { cn, getSemester } from '@/lib/utils';
import { Question, Course } from '@/@types/db';
import { format } from 'date-fns';

interface QuestionMetadataProps {
  question: Question;
  course: Course;
  className?: string;
}

const QuestionMetadata: React.FC<QuestionMetadataProps> = ({ 
  question, 
  course, 
  className 
}) => {
  return (
    <Card className={cn("border-0 glass-effect backdrop-blur-xl shadow-lg shadow-primary/5 overflow-hidden", className)}>
      {/* Enhanced glassmorphic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-primary/2 to-purple-500/4" />
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-blue-500/15 rounded-full blur-xl animate-pulse-glow" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>
      
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
          <div className="p-1.5 rounded-lg bg-primary/15 backdrop-blur-sm border border-primary/20">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Question Details
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* Academic Information with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
            <div className="p-1 rounded bg-primary/15 border border-primary/20">
              <BookOpen className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground block">Course</span>
              <span className="text-sm font-medium text-foreground truncate block">{course.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
            <div className="p-1 rounded bg-primary/15 border border-primary/20">
              <School className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block">Code</span>
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 text-primary font-medium">
                {course.code}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
            <div className="p-1 rounded bg-primary/15 border border-primary/20">
              <Building className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground block">Institution</span>
              <span className="text-sm font-medium text-foreground truncate block">{question.institution_name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
            <div className="p-1 rounded bg-primary/15 border border-primary/20">
              <CalendarDays className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block">Year</span>
              <Badge variant="secondary" className="text-xs bg-secondary/80 backdrop-blur-sm font-medium">
                {question.year}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
            <div className="p-1 rounded bg-primary/15 border border-primary/20">
              <Clock className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block">Semester</span>
              <span className="text-sm font-medium text-foreground">{getSemester(question.semester)}</span>
            </div>
          </div>
          
          {question.level && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
              <div className="p-1 rounded bg-primary/15 border border-primary/20">
                <GraduationCap className="h-3 w-3 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground block">Level</span>
                <span className="text-sm font-medium text-foreground">{question.level} Level</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Question Specific Details with enhanced styling */}
        <div className="border-t border-border/30 pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.marks && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20">
                <div className="p-1 rounded bg-green-500/20 border border-green-500/30">
                  <Award className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground block">Marks</span>
                  <Badge variant="outline" className="text-xs bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30 font-bold">
                    {question.marks} Mark{question.marks !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            )}
            
            {question.type && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20">
                <div className="p-1 rounded bg-blue-500/20 border border-blue-500/30">
                  <Hash className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground block">Type</span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300 capitalize">{question.type}</span>
                </div>
              </div>
            )}
          </div>
          
          {question.session && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30">
              <span className="text-xs text-muted-foreground">Session:</span>
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 text-primary font-medium">
                {question.session}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Tags with enhanced styling */}
        {question.tags && question.tags.length > 0 && (
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded bg-primary/15 border border-primary/20">
                <Hash className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-primary/8 hover:bg-primary/15 border-primary/20 text-primary transition-all duration-200 cursor-pointer hover:scale-105 backdrop-blur-sm"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamps with enhanced styling */}
        <div className="border-t border-border/30 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-2 rounded-lg bg-background/30 backdrop-blur-sm border border-border/20">
              <span className="text-xs text-muted-foreground block mb-1">Created</span>
              <span className="text-sm font-medium text-foreground">{format(new Date(question.created_at), 'MMM d, yyyy')}</span>
            </div>
            {question.updated_at && (
              <div className="p-2 rounded-lg bg-background/30 backdrop-blur-sm border border-border/20">
                <span className="text-xs text-muted-foreground block mb-1">Updated</span>
                <span className="text-sm font-medium text-foreground">{format(new Date(question.updated_at), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionMetadata;
