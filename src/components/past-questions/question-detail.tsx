import { getCourse } from '@/services/server/courses';
import { getQuestion } from '@/services/server/questions';
import { Bookmark, Brain, CalendarDays, Clock, FileText, GraduationCap, HelpCircle, MessageCircle, School, Share2, Sparkles, Star } from 'lucide-react';
import React, { Suspense } from 'react';
import { cn, getSemester } from '@/lib/utils';
import AIModal from './ai-modal';
import { getUser } from '@/services/server/auth';
import MarkdownPreview from '../markdown-preview';
import PleaseSignIn from '../please-signin';
import { isBookmarked } from '@/services/server/bookmarks';
import BookmarkComponent from './bookmark';
import HeartModal from './heart.modal';
import ContributionList, { ContributionListSkeleton } from './contribution.list';
import Empty from '../empty';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { createChat } from '@/services/server/chats';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation'
import OpenChatButton from './open-chat-button';

import { Playfair, Spectral } from 'next/font/google'

const playfair = Spectral({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-playfair' })

interface Props {
  id: string;
}

const QuestionDetail: React.FC<Props> = async ({ id }) => {
  const { data, error } = await getQuestion(id);
  const { data: course, error: courseError } = await getCourse(data?.course!);
  const { data: user } = await getUser();
  const { data: isbookmarked } = await isBookmarked(id);
  
  if (!data || error || !course || courseError) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
    <Empty
      title="Question not found"
      content="Sorry, this question could not be retrieved. It may have been removed or you might not have permission to view it."
      icon={<HelpCircle className="h-16 w-16 opacity-80" />}
      color="green"
    />
    </div>
  );
  }

  // Helper function to create chat context
  async function createQuestionChat(e: FormData) {
  'use server';
  if (!user) return;
  
  const chatData = await createChat({
    title: `${course?.name} (${data?.year}) - Question Discussion`,
    chat_type: 'past_question',
    past_question: data?.id,
    course: course?.id
  });
  
  redirect(`/dashboard/chat/${chatData?.data?.id}`);
  }

  return (
  <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
    {/* Hero section with enhanced gradient background */}
    <Card className="border-primary/20 overflow-hidden relative bg-gradient-to-br from-card/90 via-card to-card/95 shadow-md">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.02)_25%,rgba(68,68,68,.02)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.02)_75%)] bg-[length:12px_12px]"></div>
      <div className="absolute top-0 right-0 w-1/3 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
    </div>
    
    <CardHeader className="relative z-10 px-3 sm:px-5 md:px-6 pt-4 pb-3 sm:pt-5 sm:pb-4">
      <div className="flex flex-col space-y-3 sm:space-y-4">
      {/* Course identifier row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 font-medium px-2 py-0.5 text-sm shadow-sm">
        Past Question
        </Badge>

        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{data.year} • {data.session}</span>
        </div>
        <span className="text-muted-foreground/40">|</span>
        <div className="flex items-center gap-1">
          <School className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{course.code}</span>
        </div>
        </div>
      </div>

      {/* Title and metadata */}
      <div className="space-y-2">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-foreground">
        {course.name}
        </CardTitle>
        
        <div className="flex flex-wrap gap-3 items-center text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{getSemester(data.semester)}</span>
        </div>
        
        {data.level && (
          <div className="flex items-center gap-1">
          <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{data.level} Level</span>
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
        
        <OpenChatButton question={data} user={user} />
      </div>
      </div>
    </CardHeader>
    
    <CardContent className="pb-8 relative z-10 px-4 md:px-6">
      <Tabs defaultValue="question" className="mt-2">
      <TabsList className="bg-background/80 backdrop-blur-sm border border-border/50 p-1 rounded-lg shadow-sm">
        <TabsTrigger value="question" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
        <FileText className="h-4 w-4 mr-2" />
        Question
        </TabsTrigger>
        <TabsTrigger value="discussions" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 data-[state=active]:shadow-sm transition-all">
        <MessageCircle className="h-4 w-4 mr-2" />
        Discussions
        </TabsTrigger>
      </TabsList>
      
      {/* Enhanced Question Content Area */}
      <TabsContent value="question" className="py-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300">
        <Card className="border-primary/10 bg-card shadow-lg overflow-hidden relative">
        {/* Paper texture effect background */}
        <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-[0.03] pointer-events-none"></div>
        
        <CardContent className="p-4 md:p-8 relative">
          <div className="prose prose-lg md:prose-xl max-w-none">
          <MarkdownPreview 
            content={data?.text || ''} 
            className={cn(`
            font-serif text-foreground/90
            leading-relaxed tracking-wide
            text-base sm:text-lg md:text-xl
            [&>*:first-child]:mt-0
            [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-foreground [&>h1]:border-b [&>h1]:border-primary/10 [&>h1]:pb-2 [&>h1]:mb-4
            [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-foreground/90
            [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-foreground/80
            [&>p]:my-4
            [&>ul]:pl-6 [&>ul]:list-disc
            [&>ol]:pl-6 [&>ol]:list-decimal
            [&>li]:my-1.5
            [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:shadow-inner [&>pre]:my-4
            [&>blockquote]:border-l-4 [&>blockquote]:border-primary/20 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-foreground/70
            [&>img]:max-w-full [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>img:hover]:shadow-lg [&>img]:transition-shadow
            `, playfair.className, 'font-playfair')}
          />
          </div>
        </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="discussions" className="py-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300">
        <Suspense fallback={<ContributionListSkeleton />}>
        <ContributionList past_question={data} />
        </Suspense>
      </TabsContent>
      </Tabs>
    </CardContent>
    </Card>
    
    {/* Action buttons - Improved floating panel */}
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
    <Card className="border border-primary/10 bg-card/95 backdrop-blur-md shadow-xl rounded-full">
      <CardContent className="flex items-center justify-center px-3 py-2 sm:px-4 gap-2 sm:gap-3">
      {/* Heart/Star button */}
      {user ? (
        <HeartModal
        question={data}
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
        isbookmarked={isbookmarked?.bookmarked || false} 
        question_id={id} 
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
        user={user!}
        question={data}
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
  </div>
  );
};

export default QuestionDetail;