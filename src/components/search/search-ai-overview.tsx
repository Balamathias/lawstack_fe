'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, X, Maximize2, Minimize2, Copy, Check, Share, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, convertMarkdownToPlainText } from '@/lib/utils';
import { toast } from 'sonner';
import { useAnalyzeSearch } from '@/services/client/ai';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/services/client/query-keys';
import MarkdownPreview from '../markdown-preview';

interface SearchAIOverviewProps {
  query: string;
  opened?: boolean
  onOpenPanel?: (opened: boolean) => void;
}

export function SearchAIOverview({ query, onOpenPanel, opened }: SearchAIOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isExpanded) {
      onOpenPanel?.(true);
    } 
  }, [isExpanded, onOpenPanel]);
  
  // Use the AI analysis hook, but don't enable it automatically
  const { 
    data: _analysisData,
    refetch: generateAnalysis,
    isRefetching: isGenerating,
    isFetching,
    isPending: isProcessing
  } = useAnalyzeSearch(query);

  const analysisData = _analysisData?.data

  const error = _analysisData?.error
  
  // Determine if analysis is being generated or available
  // const isProcessing = isGenerating || isFetching || isLoading;
  const isAnalysisAvailable = !!(analysisData?.analysis);
  
  // Function to get content preview
  const getContentPreview = (content: string, previewLines = 3) => {
    const lines = content.split('\n');
    if (lines.length <= previewLines) return content;
    return lines.slice(0, previewLines).join('\n') + '...';
  };

  // Handle generate analysis button click
  const handleGenerate = async () => {
    try {
      await generateAnalysis();
      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate AI analysis. Please try again.');
    }
  };
  
  // Handle copying the analysis to clipboard
  const copyToClipboard = () => {
    if (!isAnalysisAvailable) return;
    
    const analysisText = `
      AI Analysis for "${query}":

      ${analysisData.analysis}

      Related Topics:
      ${analysisData.relatedTopics.map(topic => `• ${topic}`).join('\n')}

      Suggested Resources:
      ${analysisData.suggestedResources.map(resource => `• ${resource}`).join('\n')}
          `.trim();
          
          navigator.clipboard.writeText(convertMarkdownToPlainText(analysisText));
          setIsCopied(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setIsCopied(false), 2000);
        };
        
        const shareOverview = () => {
        toast.success("Sharing feature coming soon");
      };
  
      // Toggle analysis expansion
      const toggleAnalysisExpansion = () => {
        setIsAnalysisExpanded(!isAnalysisExpanded);
      };
  
      // Clear cached analysis when the component unmounts
      React.useEffect(() => {
        return () => {
          queryClient.removeQueries({ queryKey: QUERY_KEYS.aiAnalysis(query) });
        };
  }, [query, queryClient]);

  // if (error) {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       className="w-full"
  //     >
  //       <Card className="border-destructive/20 shadow-sm">
  //         <CardHeader className="bg-destructive/5 pb-3">
  //           <div className="flex items-center gap-2">
  //             <div className="bg-destructive/10 p-2 rounded-lg border border-destructive/20">
  //               <X className="h-4 w-4 text-destructive" />
  //             </div>
  //             <CardTitle className="text-lg">Error Occurred</CardTitle>
  //           </div>
  //           <CardDescription className="mt-2 text-destructive/80">
  //             We encountered a problem while generating the AI overview
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="pt-4 pb-3">
  //           <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10">
  //             <p className="text-sm text-muted-foreground">{error || error?.message || "Failed to generate AI analysis for your query. This could be due to system limitations or the complexity of your search."}</p>
  //           </div>
  //           <div className="mt-4 flex justify-center">
  //             <Button 
  //               onClick={handleGenerate} 
  //               variant="outline"
  //               className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
  //             >
  //               <Sparkles className="h-4 w-4" />
  //               <span>Try Again</span>
  //             </Button>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </motion.div>
  //   )
  // }
  
  return (
    <Card className={cn(
      "border-primary/20 shadow-sm overflow-hidden transition-all duration-300",
      isExpanded ? "fixed inset-4 z-50 m-auto max-w-4xl h-auto" : ""
    )}>
      <CardHeader className={cn(
        "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 pb-3 relative",
        isExpanded ? "p-6" : "px-5 pt-5"
      )}>
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.15),transparent_70%)]"></div>
        </div>
        
        <div className="flex justify-between items-start z-10 relative">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">AI Overview</CardTitle>
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-xs">Beta</Badge>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            {isExpanded && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <CardDescription className="mt-2 z-10 relative">
          Get an AI-powered summary related to your search query
        </CardDescription>
      </CardHeader>
      
      <CardContent className={cn(
        "space-y-3",
        isExpanded ? "p-6 pt-3" : "px-5 pt-3"
      )}>
        <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 text-sm mb-1">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="font-medium">Your search: </span>
          </div>
          <p className="text-sm text-muted-foreground">"{query}"</p>
        </div>
        
        <AnimatePresence mode="wait">
          {!isGenerated ? (
            <motion.div
              key="not-generated"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col items-center"
            >
              <p className="text-muted-foreground text-sm text-center mb-4">
                Generate an AI overview to get contextual information related to your search.
              </p>
              
              <Button 
                onClick={handleGenerate} 
                className="gap-2 rounded-lg bg-primary/90 hover:bg-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Overview</span>
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="generated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-3"
            >
              {isAnalysisAvailable ? (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      <div className="relative">
                        <MarkdownPreview 
                          content={isAnalysisExpanded 
                            ? analysisData?.analysis || '' 
                            : getContentPreview(analysisData?.analysis || '', 3)} 
                        />
                        
                        {analysisData?.analysis?.split('\n').length > 3 && (
                          <div 
                            className={cn(
                              "mt-3 text-center",
                              !isAnalysisExpanded && "pt-4"
                            )}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleAnalysisExpansion}
                              className="text-xs gap-1 text-primary hover:bg-primary/10"
                            >
                              {isAnalysisExpanded ? (
                                <>
                                  See less <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  See more <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {analysisData.relatedTopics && analysisData.relatedTopics.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Related Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.relatedTopics.map((topic, index) => (
                          <Badge 
                            key={index} 
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisData.suggestedResources && analysisData.suggestedResources.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Suggested Resources</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {analysisData.suggestedResources.map((resource, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-primary mt-1 flex-shrink-0" />
                            <MarkdownPreview content={resource || ''} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center text-center">
                  <p className="text-muted-foreground">
                    Failed to generate AI overview. Please try again.
                  </p>
                  <Button 
                    onClick={handleGenerate}
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      
      {isGenerated && isAnalysisAvailable && (
        <CardFooter className={cn(
          "flex justify-between border-t border-border/30 pt-3",
          isExpanded ? "p-6 pt-3" : "px-5 pb-5 pt-3"
        )}>
          <div className="text-xs text-muted-foreground flex items-center">
            <Badge variant="outline" className="text-[10px] rounded-sm font-normal">
              AI-generated
            </Badge>
            <span className="ml-2">Results may vary. Verify important information.</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary"
              onClick={copyToClipboard}
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary"
              onClick={shareOverview}
            >
              <Share className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}