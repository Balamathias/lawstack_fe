import React from 'react';
import { Question } from '@/@types/db';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, FileText, MessageSquare, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestionsListProps {
  questions: Question[];
}

const QuestionsList = ({ questions }: QuestionsListProps) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
};

const QuestionItem = ({ question }: { question: Question }) => {
  // Format the date as "X time ago"
  const timeAgo = formatDistanceToNow(new Date(question.created_at), { addSuffix: true });
  
  // Get the year if available
  const year = question.year ? 
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Calendar className="h-3.5 w-3.5" />
      <span>{question.year}</span>
    </div> : null;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Question preview */}
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <h3 className="font-medium text-lg line-clamp-1">
                {question.title || question.text.substring(0, 60) + '...'}
              </h3>
              {year}
            </div>
            
            <p className="text-muted-foreground line-clamp-2 text-sm mb-3">
              {question.text}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>Added by {question.creator?.username || 'Admin'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{question.contributions_count || 0} Contributions</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Added {timeAgo}</span>
              </div>
            </div>
          </div>
          
          {/* View button */}
          <div className={cn(
            "md:w-44 flex md:flex-col justify-end items-center p-4",
            "bg-gradient-to-r from-muted/50 to-muted md:from-transparent md:to-muted/20"
          )}>
            <Link href={`/dashboard/questions/${question.id}`} className="w-full">
              <Button variant="outline" className="w-full">View Question</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionsList;
