import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bookmark, 
  Star, 
  Sparkles, 
  Share2, 
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AIModal from './ai-modal';
import BookmarkComponent from './bookmark';
import HeartModal from './heart.modal';
import ShareModal from './share-modal';
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
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30">
      {/* Floating background orb effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-8 h-8 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-6 h-6 bg-accent/15 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-muted/20 rounded-full animate-pulse-glow"></div>
      </div>
      
      <Card className="relative overflow-hidden glass-effect border border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-2xl rounded-full transition-all duration-500 hover:shadow-primary/25 hover:scale-105">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50"></div>
        
        {/* Liquid glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-full"></div>
        
        <CardContent className="relative flex items-center justify-center px-2 py-2 sm:px-4 sm:py-3 gap-4">
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
                    "h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 relative group",
                    "glass-effect bg-pink-500/5 hover:bg-pink-500/15 text-muted-foreground hover:text-pink-500",
                    "hover:scale-110 hover:shadow-pink-500/25 backdrop-blur-sm border border-pink-500/10"
                  )}
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:rotate-12 group-hover:fill-pink-500/20" />
                  <span className="sr-only">Share thoughts</span>
                  
                  {/* Enhanced tooltip */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs whitespace-nowrap bg-background/95 backdrop-blur-sm shadow-xl rounded-lg px-3 py-2 border border-pink-500/20 pointer-events-none">
                    <div className="text-pink-500 font-medium">Share thoughts</div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-l border-t border-pink-500/20 rotate-45"></div>
                  </div>
                </Button>
              }
            />
          ) : (
            <PleaseSignIn
              message='Log in to share your thoughts about this question'
              icon={<Heart className="h-4 w-4" />}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 glass-effect bg-pink-500/5 hover:bg-pink-500/15 text-muted-foreground hover:text-pink-500 hover:scale-110 backdrop-blur-sm border border-pink-500/10"
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300" />
                  <span className="sr-only">Share thoughts</span>
                </Button>
              }
            />
          )}          {/* Bookmark button */}
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
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 relative group glass-effect bg-amber-500/5 hover:bg-amber-500/15 text-muted-foreground hover:text-amber-500 hover:scale-110 hover:shadow-amber-500/25 backdrop-blur-sm border border-amber-500/10 flex items-center justify-center"
                >
                  <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:fill-amber-500/20" />
                  <span className="sr-only">Bookmark</span>
                  
                  {/* Enhanced tooltip */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs whitespace-nowrap bg-background/95 backdrop-blur-sm shadow-xl rounded-lg px-3 py-2 border border-amber-500/20 pointer-events-none">
                    <div className="text-amber-500 font-medium">Bookmark</div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-l border-t border-amber-500/20 rotate-45"></div>
                  </div>
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
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 relative group glass-effect bg-blue-500/5 hover:bg-blue-500/15 text-muted-foreground hover:text-blue-500 hover:scale-110 hover:shadow-blue-500/25 backdrop-blur-sm border border-blue-500/10"
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:animate-pulse group-hover:scale-110" />
                  <span className="sr-only">AI analysis</span>
                  
                  {/* Enhanced tooltip */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs whitespace-nowrap bg-background/95 backdrop-blur-sm shadow-xl rounded-lg px-3 py-2 border border-blue-500/20 pointer-events-none">
                    <div className="text-blue-500 font-medium">AI Analysis</div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-l border-t border-blue-500/20 rotate-45"></div>
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
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 glass-effect bg-blue-500/5 hover:bg-blue-500/15 text-muted-foreground hover:text-blue-500 hover:scale-110 backdrop-blur-sm border border-blue-500/10"
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300" />
                  <span className="sr-only">AI analysis</span>
                </Button>
              }
            />
          )}          {/* Share button */}
          <ShareModal
            question={question}
            user={user}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 relative group glass-effect bg-green-500/5 hover:bg-green-500/15 text-muted-foreground hover:text-green-500 hover:scale-110 hover:shadow-green-500/25 backdrop-blur-sm border border-green-500/10"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="sr-only">Share</span>
                
                {/* Enhanced tooltip */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs whitespace-nowrap bg-background/95 backdrop-blur-sm shadow-xl rounded-lg px-3 py-2 border border-green-500/20 pointer-events-none">
                  <div className="text-green-500 font-medium">Share</div>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-l border-t border-green-500/20 rotate-45"></div>
                </div>
              </Button>
            }
          />

        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionActions;
