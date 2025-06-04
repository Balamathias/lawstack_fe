import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import MarkdownPreview from '../markdown-preview';
import ContributionList, { ContributionListSkeleton } from './contribution.list';
import { Question } from '@/@types/db';
import { Suspense } from 'react';
import { Spectral } from 'next/font/google';

const spectral = Spectral({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], 
  variable: '--font-spectral' 
});

interface QuestionContentProps {
  question: Question;
  fallbackComponent?: React.ReactNode;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ question, fallbackComponent }) => {
  return (
    <Card className="shadow-lg md:border-primary/10 relative">
      <CardContent className="pb-8 relative z-10 px-4 md:px-6">
        <Tabs defaultValue="question" className="mt-2">
          <TabsList className="bg-background/80 backdrop-blur-sm border border-border/50 p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="question" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <FileText className="h-4 w-4 mr-2" />
              Question
            </TabsTrigger>
            <TabsTrigger 
              value="discussions" 
              className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 data-[state=active]:shadow-sm transition-all"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
          </TabsList>
          
          {/* Enhanced Question Content Area */}
          <TabsContent 
            value="question" 
            className="py-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300"
          >
            <Card className="max-md:border-none md:border-primary/10 md:bg-card md:shadow-lg overflow-hidden">
              {/* Paper texture effect background */}
              <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-[0.03] pointer-events-none"></div>
              
              <CardContent className="p-0 md:p-8 relative">
                <div className="prose prose-lg md:prose-xl max-w-none">
                  <MarkdownPreview 
                    content={question?.text || ''} 
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
                    `, spectral.className, 'font-serif')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent 
            value="discussions" 
            className="py-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300"
          >
            <Suspense fallback={fallbackComponent || <ContributionListSkeleton />}>
              <ContributionList past_question={question} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuestionContent;
