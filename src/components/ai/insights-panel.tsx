"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Lightbulb, Star, Send, Save, Loader2,
  Clipboard, Check, ArrowRight, Scale, Download, Share2,
  Plus, ChevronRight, ChevronLeft
} from 'lucide-react';
import { User } from '@/@types/db';
import MarkdownPreview from '../markdown-preview';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn, convertMarkdownToPlainText } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  role: 'system' | 'user' | 'ai';
  timestamp: Date;
  emoji?: string;
}

interface InsightsPanelProps {
  user: User;
  contentType: 'question' | 'contribution';
  contentId: string;
  content: string;
  getInsights: (params: any) => Promise<string>;
  initialPrompts?: Array<{prompt: string, emoji: string}>;
  onSaveInsight?: (insight: string) => void;
  className?: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  user,
  contentType,
  contentId,
  content,
  getInsights,
  initialPrompts,
  onSaveInsight,
  className
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<Array<{prompt: string, emoji: string}>>(
    initialPrompts || []
  );
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});
  const [isStreamingMessage, setIsStreamingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<{ left: number, scrollWidth: number, clientWidth: number }>({ left: 0, scrollWidth: 0, clientWidth: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!initialPrompts || initialPrompts.length === 0) {
      generateDynamicPrompts();
    }
  }, [content]);

  useEffect(() => {
    checkScrollability();
  }, [suggestedPrompts]);

  const checkScrollability = () => {
    if (!suggestionsRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = suggestionsRef.current;
    scrollPosition.current = { left: scrollLeft, scrollWidth, clientWidth };
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth);
  };

  const handleScroll = () => {
    checkScrollability();
  };

  const scrollSuggestions = (direction: 'left' | 'right') => {
    if (!suggestionsRef.current) return;
    
    const scrollAmount = suggestionsRef.current.clientWidth * 0.5;
    const newPosition = direction === 'left' 
      ? Math.max(0, suggestionsRef.current.scrollLeft - scrollAmount)
      : suggestionsRef.current.scrollLeft + scrollAmount;
    
    suggestionsRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  const generateDynamicPrompts = async () => {
    try {
      setIsLoading(true);
      // Generate dynamic prompts based on content
      const dynamicPromptsResult = await getInsights({
        prompt: `Generate 4 short, insightful questions about this ${contentType} with appropriate emojis. Format as JSON array with 'prompt' and 'emoji' fields.`,
        contentId,
        content,
        user
      });
      
      try {
        // Try parsing the response as JSON
        const parsed = JSON.parse(dynamicPromptsResult);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSuggestedPrompts(parsed.slice(0, 4));
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // If not JSON, extract prompts using regex
        const promptRegex = /["']prompt["']\s*:\s*["'](.+?)["']/g;
        const emojiRegex = /["']emoji["']\s*:\s*["'](.+?)["']/g;
        
        const prompts: string[] = [];
        const emojis: string[] = [];
        
        let match;
        while ((match = promptRegex.exec(dynamicPromptsResult)) !== null) {
          prompts.push(match[1]);
        }
        
        while ((match = emojiRegex.exec(dynamicPromptsResult)) !== null) {
          emojis.push(match[1]);
        }
        
        if (prompts.length > 0) {
          setSuggestedPrompts(
            prompts.map((prompt, i) => ({
              prompt,
              emoji: emojis[i] || '💡'
            })).slice(0, 4)
          );
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to default prompts for question or contribution
      const defaultPrompts = contentType === 'question' 
        ? [
            { prompt: "Analyze this question for me", emoji: "🔍" },
            { prompt: "Explain key legal principles", emoji: "⚖️" },
            { prompt: "What are the main issues here?", emoji: "📋" },
            { prompt: "How would a professional answer this?", emoji: "👨‍⚖️" }
          ]
        : [
            { prompt: "Evaluate this answer's quality", emoji: "🎯" },
            { prompt: "Identify strengths and weaknesses", emoji: "💪" },
            { prompt: "What legal authorities are missing?", emoji: "📚" },
            { prompt: "How could this be improved?", emoji: "✨" }
          ];
          
      setSuggestedPrompts(defaultPrompts);
      
    } catch (error) {
      console.error("Error generating dynamic prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const insightContent = await getInsights({
        prompt,
        contentId,
        content,
        user
      });
      
      // Add AI message
      const aiMessageId = (Date.now() + 1).toString();
      setIsStreamingMessage(aiMessageId);
      
      const aiMessage: Message = {
        id: aiMessageId,
        content: insightContent || "I couldn't generate insights for this prompt. Please try something else.",
        role: 'ai',
        timestamp: new Date(),
        emoji: getContentTypeEmoji()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate streaming effect
      const streamDuration = Math.min(insightContent.length * 20, 2500);
      setTimeout(() => {
        setIsStreamingMessage(null);
      }, streamDuration);
      
    } catch (error) {
      console.error('Error getting insights:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while generating insights. Please try again.",
        role: 'ai',
        timestamp: new Date(),
        emoji: "❌"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContentTypeEmoji = () => {
    if (contentType === 'question') {
      const questionEmojis = ["⚖️", "📚", "🧠", "🏛️", "🔍", "📝", "❓"];
      return questionEmojis[Math.floor(Math.random() * questionEmojis.length)];
    } else {
      const contributionEmojis = ["✅", "🎯", "💪", "📊", "🧩", "⭐", "🔎"];
      return contributionEmojis[Math.floor(Math.random() * contributionEmojis.length)];
    }
  };

  const saveInsight = (content: string) => {
    setSavedInsights(prev => [...prev, content]);
    
    if (onSaveInsight) {
      onSaveInsight(content);
    }
    
    toast.success("Insight saved", {
      description: "You can view your saved insights in your notes section",
      duration: 3000,
    });
  };

  const handleCopy = (id: string, content: string) => {
    // Convert markdown to plain text for copying
    const plainText = convertMarkdownToPlainText(content);
    navigator.clipboard.writeText(plainText);
    
    setCopyState({ ...copyState, [id]: true });
    
    setTimeout(() => {
      setCopyState({ ...copyState, [id]: false });
    }, 2000);
    
    toast.info("Copied to clipboard", {
      duration: 2000,
    });
  };

  const exportInsights = () => {
    const aiMessages = messages.filter(m => m.role === 'ai');
    if (aiMessages.length === 0) return;
    
    const content = aiMessages.map(m => (
      `## AI Insight (${new Date(m.timestamp).toLocaleString()})\n\n${m.content}\n\n---\n\n`
    )).join('');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-insights-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success( "Insights exported", {
      description: "Your insights have been downloaded as a markdown file",
      duration: 3000,
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Message animation component
  const AnimatedMessage = ({ message }: { message: Message }) => {
    const isStreaming = isStreamingMessage === message.id && message.role === 'ai';
    
    return (
      <div className={cn(
        "rounded-2xl px-2 sm:px-4 py-2 w-full max-w-[85%]",
        message.role === 'user' 
          ? "bg-secondary/70 rounded-tr-none w-fit" 
          : "rounded-tl-none"
      )}>
        {message.role === 'ai' ? (
          <div className={cn(
            "prose-sm dark:prose-invert max-w-none",
            isStreaming && "animate-fade-in-text relative overflow-hidden"
          )}>
            <MarkdownPreview content={message.content} className="prose-h1:font-serif prose-h1:italicize prose-h2:font-serif" />
            {isStreaming && (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            )}
          </div>
        ) : (
          <p>{message.content}</p>
        )}
        <div className="text-xs mt-1 flex items-center justify-between">
          <span className="opacity-70">{formatTime(message.timestamp)}</span>
          
          {message.role === 'ai' && (
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                onClick={() => saveInsight(message.content)}
                title="Save insight"
              >
                <Save className="h-3 w-3" />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                onClick={() => handleCopy(message.id, message.content)}
                title="Copy to clipboard"
              >
                {copyState[message.id] ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Clipboard className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full overflow-hidden w-full", className)}>
      {/* Messages header with actions */}
      {messages.length > 0 && (
        <div className="p-2 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            {contentType === 'question' ? (
              <Scale className="h-4 w-4 text-sky-500" />
            ) : (
              <Star className="h-4 w-4 text-emerald-500" />
            )}
            <span className="text-sm font-medium">
              Legal Insights {messages.filter(m => m.role === 'ai').length > 0 && 
                `(${messages.filter(m => m.role === 'ai').length})`
              }
            </span>
          </div>
          
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={() => setMessages([])}
                  >
                    <Plus className="h-3.5 w-3.5 rotate-45" />
                    <span className="sr-only">New Conversation</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {messages.filter(m => m.role === 'ai').length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 w-7 p-0 rounded-full"
                      onClick={exportInsights}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="sr-only">Export Insights</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Insights</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {messages.filter(m => m.role === 'ai').length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 rounded-full"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Share Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={exportInsights}>
                          <Download className="h-4 w-4 mr-2" />
                          <span>Save as Markdown</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const content = messages.filter(m => m.role === 'ai')
                            .map(m => convertMarkdownToPlainText(m.content))
                            .join('\n\n---\n\n');
                          navigator.clipboard.writeText(content);
                          toast.success("Insights copied!", {
                            description: "All insights copied to clipboard as plain text",
                            duration: 2000,
                          });
                        }}>
                          <Clipboard className="h-4 w-4 mr-2" />
                          <span>Copy All Insights</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share Options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}

      {/* Messages area */}
      <ScrollArea className="flex-1 p-3 overflow-y-auto max-h-[400px]" style={{ height: 'calc(100% - 140px)' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-8">
            <div className="bg-primary/10 p-3 rounded-full animate-pulse">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium text-lg">AI Legal Insights</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Ask questions about this {contentType} to get AI-powered insights and analysis
            </p>
          </div>
        ) : (
          <div className="space-y-4 overflow-hidden">
            {messages.map((message) => (
              <AnimatePresence key={message.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-start gap-2 mb-4",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'ai' && message.emoji && (
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{message.emoji}</span>
                    </div>
                  )}
                  
                  <AnimatedMessage message={message} />
                  
                  {message.role === 'user' && (
                    <div className="bg-secondary/70 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username || 'User'} 
                          className="rounded-full h-full w-full object-cover" 
                        />
                      ) : (
                        <span className="font-medium">
                          {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
                <div className="bg-secondary/50 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="typing-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Generating insights...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Horizontally scrollable suggested prompts */}
      {messages.length === 0 && (
        <div className="p-3 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            {isLoading ? 'Generating suggestions...' : 'Suggested questions'}
          </h4>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 bg-secondary/40 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedPrompts.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start gap-2 hover:bg-secondary/50 transition-all"
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                >
                  <span>{item.emoji}</span>
                  <span className="text-sm truncate text-left">{item.prompt}</span>
                  <ArrowRight className="h-3 w-3 ml-auto opacity-70" />
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input area - Professional styling */}
      <div className="border-t p-3 bg-card/50 backdrop-blur-sm mt-auto">
        <form 
          className="flex items-end gap-2 bg-background/70 backdrop-blur-sm rounded-xl p-1.5 shadow-inner"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent focus-within:ring-0 focus:outline-0 !ring-0 !outline-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "rounded-full h-9 w-9 p-0 flex items-center justify-center transition-all",
              !inputValue.trim() || isLoading 
                ? "bg-secondary/70 text-muted-foreground cursor-not-allowed" 
                : "bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {savedInsights.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>{savedInsights.length} insight{savedInsights.length > 1 ? 's' : ''} saved</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => {
                // Navigate to notes or open notes modal
                toast.success("Insights saved", {
                  description: `${savedInsights.length} insight${savedInsights.length > 1 ? 's have' : ' has'} been saved to your notes`,
                });
              }}
            >
              View saved
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
