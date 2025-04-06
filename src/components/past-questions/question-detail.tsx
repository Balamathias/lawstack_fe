import { getCourse } from '@/services/server/courses';
import { getQuestion } from '@/services/server/questions';
import { Bookmark, Brain, CalendarDays, Clock, FileText, GraduationCap, HelpCircle, MessageCircle, MessagesSquare, School, Share2, Sparkles, Star } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation'

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
        <div className='flex flex-col gap-4'>
            <Empty
                title="Question not found"
                content="Sorry, this question could not be retrieved. It may have been removed or you might not have permission to view it."
                icon={<HelpCircle />}
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
    <div className='flex flex-col gap-6 animate-fade-in'>
      {/* Hero section with gradient background */}
      <Card className="border-primary/20 overflow-hidden relative bg-gradient-to-r from-card via-card/80 to-card">
        {/* Background pattern element */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:10px_10px]"></div>
        </div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                  Past Question
                </Badge>
                
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2">
                    <CalendarDays className="h-3 w-3" />
                    <span>{data.year} • {data.session}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2">
                    <School className="h-3 w-3" />
                    <span>{course.code}</span>
                  </Badge>
                </div>
              </div>
              
              <CardTitle className="text-2xl md:text-3xl font-serif">{course.name}</CardTitle>
              
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-foreground/70">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{getSemester(data.semester)} Semester</span>
                </div>
                
                {data.level && (
                  <div className="flex items-center gap-1.5 text-foreground/70">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{data.level} Level</span>
                  </div>
                )}
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* CBT Button */}
              <Button
                asChild
                className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-md border border-primary/10 gap-2 transition-all"
              >
                <Link href={`/dashboard/quizzes?course=${course?.id}`}>
                  <Brain className="h-4 w-4" />
                  <span>Practice CBT</span>
                </Link>
              </Button>
              
              {/* Open Chat Button */}
              <form action={createQuestionChat}>
                <Button
                  type="submit"
                  className="bg-indigo-500/90 hover:bg-indigo-500 text-white shadow-md border border-indigo-500/10 gap-2 transition-all"
                >
                  <MessagesSquare className="h-4 w-4" />
                  <span>Open Chat</span>
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6 relative z-10">
          <Tabs defaultValue="question" className="mt-2">
            <TabsList className="bg-background/50 backdrop-blur-sm border border-border/50 p-1">
              <TabsTrigger value="question" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <FileText className="h-4 w-4 mr-2" />
                Question
              </TabsTrigger>
              <TabsTrigger value="discussions" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500">
                <MessageCircle className="h-4 w-4 mr-2" />
                Discussions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="question" className="py-4 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-primary/10 bg-card shadow-sm">
                <CardContent className="p-2.5 md:p-6">
                  <div className="prose max-w-none">
                    <MarkdownPreview content={data?.text || ''} className="leading-relaxed text-lg md:text-xl font-serif text-foreground/80" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussions" className="py-4 focus-visible:outline-none focus-visible:ring-0">
              <Suspense fallback={<ContributionListSkeleton />}>
                <ContributionList past_question={data} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Action buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <Card className="border border-primary/10 bg-card/95 backdrop-blur-sm shadow-lg">
          <CardContent className="flex items-center justify-center px-2 py-2 sm:px-4 gap-4">
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
                      "hover:bg-pink-500/10 hover:text-pink-500 text-muted-foreground"
                    )}
                  >
                    <Star className="h-5 w-5" />
                    <span className="sr-only">Share thoughts</span>
                    
                    <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all text-xs whitespace-nowrap bg-background shadow rounded-md px-2 py-1 border">
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
                    className="h-10 w-10 rounded-full text-muted-foreground hover:bg-pink-500/10 hover:text-pink-500"
                  >
                    <Star className="h-5 w-5" />
                    <span className="sr-only">Share thoughts</span>
                  </Button>
                }
              />
            )}

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
                    className="h-10 w-10 rounded-full text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500"
                  >
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                }
              />
            )}
            
            {user ? (
              <AIModal
                user={user!}
                question={data}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 relative group"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="sr-only">AI analysis</span>
                    
                    <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all text-xs whitespace-nowrap bg-background shadow rounded-md px-2 py-1 border">
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
                    className="h-10 w-10 rounded-full text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="sr-only">AI analysis</span>
                  </Button>
                }
              />
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-green-500/10 hover:text-green-500 relative group"
            //   onClick={() => {
            //     if (navigator.share) {
            //       navigator.share({
            //         title: `${course.name} (${data.year})`,
            //         text: `Check out this past question from ${course.name}`,
            //         url: window.location.href,
            //       });
            //     } else {
            //       navigator.clipboard.writeText(window.location.href);
            //       toast.success("Link copied to clipboard");
            //     }
            //   }}
            >
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
              
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all text-xs whitespace-nowrap bg-background shadow rounded-md px-2 py-1 border">
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