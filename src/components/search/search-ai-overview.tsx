'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, BookOpen, FileText, Copy, Check, Loader2 } from 'lucide-react';
import { useAnalyzeSearch } from '@/services/client/ai';
import { motion } from 'framer-motion';
import { cn, convertMarkdownToPlainText } from '@/lib/utils';
import MarkdownPreview from '../markdown-preview';

interface SearchAIOverviewProps {
  query: string;
}

export function SearchAIOverview({ query }: SearchAIOverviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisRequested, setAnalysisRequested] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Only enable the query when analysis is requested
  const { data, isLoading, error, refetch } = useAnalyzeSearch(analysisRequested ? query : '');
  
  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    setAnalysisRequested(true);
    await refetch();
    setIsAnalyzing(false);
  };
  
  const copyToClipboard = () => {
    if (data?.analysis) {
      navigator.clipboard.writeText(data.analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">AI Legal Insights</CardTitle>
          </div>
          
          {data?.analysis && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {!analysisRequested ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-primary/5 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-primary/70" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Get AI Analysis</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Our AI can analyze your search term and provide legal context, related topics, and recommended resources.
              </p>
            </div>
            <Button 
              onClick={handleAnalyzeClick} 
              className="mt-2"
              disabled={!query || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze "{query}"
                </>
              )}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <Sparkles className="h-10 w-10 text-muted-foreground/20" />
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground">AI is analyzing your search...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-sm text-red-500">
              Unable to generate insights for this search. Please try again.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-4"
              onClick={handleAnalyzeClick}
            >
              Retry Analysis
            </Button>
          </div>
        ) : data?.analysis ? (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownPreview content={data.analysis} />
            </div>
            
            {data.relatedTopics && data.relatedTopics.length > 0 && (
              <div className="pt-2 border-t border-border mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.relatedTopics.map((topic, index) => (
                    <Button 
                      key={index} 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs bg-primary/5 hover:bg-primary/10"
                    >
                      {convertMarkdownToPlainText(topic)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {data.suggestedResources && (
              <div className="pt-2 border-t border-border mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-500" />
                  Suggested Resources
                </h4>
                <ul className="space-y-2">
                  {data.suggestedResources.map((resource, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{convertMarkdownToPlainText(resource)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Something went wrong. Please try again.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-4"
              onClick={handleAnalyzeClick}
            >
              Retry Analysis
            </Button>
          </div>
        )}
      </CardContent>
      
      {data && (
        <CardFooter className="bg-muted/30 p-3 text-xs text-muted-foreground">
          AI analysis is for informational purposes only and should not be considered legal advice.
        </CardFooter>
      )}
    </Card>
  );
} 