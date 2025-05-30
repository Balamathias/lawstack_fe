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
    <Card className={cn("border-primary/10 bg-gradient-to-br from-card/90 to-card shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          Question Details
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Academic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Course:</span>
              <span className="font-medium">{course.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <School className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Code:</span>
              <Badge variant="outline" className="text-xs">{course.code}</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Institution:</span>
              <span className="font-medium text-xs">{question.institution_name}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Year:</span>
              <Badge variant="secondary" className="text-xs">{question.year}</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Semester:</span>
              <span className="font-medium">{getSemester(question.semester)}</span>
            </div>
            
            {question.level && (
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">{question.level} Level</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Question Specific Details */}
        <div className="border-t border-border/50 pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.marks && (
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Marks:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  {question.marks} Mark{question.marks !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}
            
            {question.type && (
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{question.type}</span>
              </div>
            )}
          </div>
          
          {question.session && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Session:</span>
              <span className="font-medium">{question.session}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Hash className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamps */}
        <div className="border-t border-border/50 pt-4 text-xs text-muted-foreground space-y-1">
          <div>Created: {format(new Date(question.created_at), 'PPP')}</div>
          {question.updated_at && (
            <div>Updated: {format(new Date(question.updated_at), 'PPP')}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionMetadata;
