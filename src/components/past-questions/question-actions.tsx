import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bookmark, 
  Star, 
  Sparkles, 
  Share2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AIModal from './ai-modal';
import BookmarkComponent from './bookmark';
import HeartModal from './heart.modal';
import PleaseSignIn from '../please-signin';
import { Question, User } from '@/@types/db';

interface QuestionActionsProps {
  question: Question;
  user: User | null;
  isBookmarked: boolean;
  questionId: string;
}

const QuestionActions: React.FC<QuestionActionsProps> = ({ 
  question, 
  user, 
  isBookmarked, 
  questionId 
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <Card className="border border-primary/10 bg-card/95 backdrop-blur-md shadow-xl rounded-full">
        <CardContent className="flex items-center justify-center px-3 py-2 sm:px-4 gap-2 sm:gap-3">
          
          {/* Heart/Star button */}
          {user ? (
            <HeartModal
              question={question}
              user={user} 
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full transition-all relative group",
                    "hover:bg-pink-500/10 hover:text-pink-500 text-muted-foreground hover:scale-110"
                  )}
                >
                  <Star className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="sr-only">Share thoughts</span>
                  
                  <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-all text-xs whitespace-nowrap bg-background shadow-lg rounded-md px-2.5 py-1.5 border">
                    Share thoughts
                  </div>
                </Button>
              }
            />
          ) : (
            <PleaseSignIn
              message='Log in to share your thoughts about this question'
              icon={<Star className="h-4 w-4" />}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:bg-pink-500/10 hover:text-pink-500 hover:scale-110"
                >
                  <Star className="h-5 w-5" />
                  <span className="sr-only">Share thoughts</span>
                </Button>
              }
            />
          )}

          {/* Bookmark button */}
          {user ? (
            <BookmarkComponent 
              isbookmarked={isBookmarked} 
              question_id={questionId} 
            />
          ) : (
            <PleaseSignIn
              message='Log in to bookmark this question for later'
              icon={<Bookmark className="h-4 w-4" />}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 hover:scale-110"
                >
                  <Bookmark className="h-5 w-5" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              }
            />
          )}
          
          {/* AI analysis button */}
          {user ? (
            <AIModal
              user={user}
              question={question}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 hover:scale-110 relative group"
                >
                  <Sparkles className="h-5 w-5 transition-transform group-hover:animate-pulse" />
                  <span className="sr-only">AI analysis</span>
                  
                  <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-all text-xs whitespace-nowrap bg-background shadow-lg rounded-md px-2.5 py-1.5 border">
                    AI analysis
                  </div>
                </Button>
              }
            />
          ) : (
            <PleaseSignIn
              message='Log in to get AI-powered insights on this question'
              icon={<Sparkles className="h-4 w-4" />}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 hover:scale-110"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="sr-only">AI analysis</span>
                </Button>
              }
            />
          )}
          
          {/* Share button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-green-500/10 hover:text-green-500 hover:scale-110 relative group"
          >
            <Share2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="sr-only">Share</span>
            
            <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-all text-xs whitespace-nowrap bg-background shadow-lg rounded-md px-2.5 py-1.5 border">
              Share
            </div>
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionActions;
