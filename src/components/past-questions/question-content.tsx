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
    <Card className="border-0 glass-effect shadow-2xl shadow-primary/5 backdrop-blur-xl relative overflow-hidden">
      {/* Enhanced glassmorphic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-blue-500/3" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
      
      <CardContent className="pb-8 relative z-10 px-2.5 md:px-8 border-none">
        <Tabs defaultValue="question" className="mt-4">
          {/* Enhanced tabs with glassmorphic styling */}
          <TabsList className="bg-background/60 backdrop-blur-md border border-border/40 p-1.5 rounded-xl shadow-lg shadow-primary/5 mb-6">
            <TabsTrigger 
              value="question" 
              className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/10 transition-all duration-300 rounded-lg px-4 py-2.5 font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Question
            </TabsTrigger>
            <TabsTrigger 
              value="discussions" 
              className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all duration-300 rounded-lg px-4 py-2.5 font-medium"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
          </TabsList>
          
          {/* Enhanced Question Content Area */}
          <TabsContent 
            value="question" 
            className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-500 border-none outline-none"
          >
            <div className="!border-none glass-effect bg-background/40 backdrop-blur-lg shadow-xl overflow-hidden rounded-xl">
              {/* Paper texture effect background with enhanced styling */}
              <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-[0.02] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/30" />
              
              <div className="md:p-10 lg:p-12 relative z-10">
                <div className="prose prose-lg md:prose-xl max-w-none">
                  <MarkdownPreview 
                    content={question?.text || ''} 
                    className={cn(`
                      font-serif text-foreground/95
                      leading-relaxed tracking-wide
                      text-base sm:text-lg md:text-xl lg:text-xl
                      [&>*:first-child]:mt-0
                      [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-foreground [&>h1]:border-b [&>h1]:border-primary/20 [&>h1]:pb-3 [&>h1]:mb-6
                      [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-foreground/90 [&>h2]:mb-4
                      [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-foreground/85 [&>h3]:mb-3
                      [&>p]:my-5 [&>p]:leading-loose
                      [&>ul]:pl-8 [&>ul]:list-disc [&>ul]:my-5
                      [&>ol]:pl-8 [&>ol]:list-decimal [&>ol]:my-5
                      [&>li]:my-2 [&>li]:leading-relaxed
                      [&>pre]:bg-muted/80 [&>pre]:backdrop-blur-sm [&>pre]:p-6 [&>pre]:rounded-xl [&>pre]:shadow-inner [&>pre]:my-6 [&>pre]:border [&>pre]:border-border/40
                      [&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:italic [&>blockquote]:text-foreground/75 [&>blockquote]:bg-primary/5 [&>blockquote]:rounded-r-lg [&>blockquote]:my-6
                      [&>img]:max-w-full [&>img]:rounded-xl [&>img]:shadow-lg [&>img]:my-8 [&>img:hover]:shadow-xl [&>img]:transition-shadow [&>img]:border [&>img]:border-border/30
                      [&>table]:border-collapse [&>table]:border [&>table]:border-border/30 [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:my-6
                      [&>table_th]:bg-muted/60 [&>table_th]:backdrop-blur-sm [&>table_th]:p-3 [&>table_th]:text-left [&>table_th]:font-semibold
                      [&>table_td]:p-3 [&>table_td]:border-t [&>table_td]:border-border/20
                    `, spectral.variable, 'font-serif')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent 
            value="discussions" 
            className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-500"
          >
            <div className="glass-effect bg-background/40 backdrop-blur-lg rounded-xl border-0 shadow-xl p-6">
              <Suspense fallback={fallbackComponent || <ContributionListSkeleton />}>
                <ContributionList past_question={question} />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuestionContent;
