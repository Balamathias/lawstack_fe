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
        "rounded-2xl px-2.5 sm:px-5 py-3 w-full max-w-[95%] backdrop-blur-xl border border-white/10 shadow-lg",
        message.role === 'user' 
          ? "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 w-fit ml-auto border-blue-200/20" 
          : "bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-blue-500/5 border-emerald-200/20"
      )}>
        {message.role === 'ai' ? (
          <div className={cn(
            "prose-sm dark:prose-invert max-w-none text-foreground/90",
            isStreaming && "animate-fade-in-text relative overflow-hidden"
          )}>
            <MarkdownPreview content={message.content} className="prose-h1:font-serif prose-h1:italicize prose-h2:font-serif" />
            {isStreaming && (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            )}
          </div>
        ) : (
          <p className="text-foreground/90">{message.content}</p>
        )}
        <div className="text-xs mt-2 flex items-center justify-between text-muted-foreground/70">
          <span>{formatTime(message.timestamp)}</span>
          
          {message.role === 'ai' && (
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 opacity-70 hover:opacity-100 transition-all duration-200"
                onClick={() => saveInsight(message.content)}
                title="Save insight"
              >
                <Save className="h-3 w-3" />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 opacity-70 hover:opacity-100 transition-all duration-200"
                onClick={() => handleCopy(message.id, message.content)}
                title="Copy to clipboard"
              >
                {copyState[message.id] ? (
                  <Check className="h-3 w-3 text-green-400" />
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
    <div className={cn(
      "flex flex-col h-full overflow-hidden w-full relative",
      "backdrop-blur-xl border-none rounded-2xl shadow-2xl",
      className
    )}>
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-radial from-emerald-400/20 via-cyan-400/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {messages.length > 0 && (
        <div className="hidden md:flex p-4 border-b border-white/10 backdrop-blur-sm bg-white/5 dark:bg-white/5 justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              {contentType === 'question' ? (
                <div className="bg-gradient-to-br from-sky-400/20 to-blue-500/20 p-2 rounded-xl backdrop-blur-sm border border-sky-200/20">
                  <Scale className="h-4 w-4 text-sky-400" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-emerald-400/20 to-green-500/20 p-2 rounded-xl backdrop-blur-sm border border-emerald-200/20">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
              )}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Legal AI Insights
              </span>
              {messages.filter(m => m.role === 'ai').length > 0 && (
                <div className="text-xs text-muted-foreground/70">
                  {messages.filter(m => m.role === 'ai').length} insights generated
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                    onClick={() => setMessages([])}
                  >
                    <Plus className="h-4 w-4 rotate-45" />
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
                      className="h-8 w-8 p-0 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                      onClick={exportInsights}
                    >
                      <Download className="h-4 w-4" />
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
                          className="h-8 w-8 p-0 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/20">
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

      <ScrollArea className="flex-1 p-2.5 md:p-4 overflow-y-auto md:max-h-[60vh] max-h-[75vh] relative z-10" style={{ height: 'calc(100% - 5px)' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 p-6 rounded-2xl backdrop-blur-sm border border-white/20 animate-pulse">
                <Sparkles className="h-12 w-12 text-transparent bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text" style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                }} />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-ping delay-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Legal Insights
              </h3>
              <p className="text-muted-foreground/80 text-sm max-w-xs leading-relaxed">
                Ask questions about this {contentType} to get AI-powered insights and analysis
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 overflow-hidden">
            {messages.map((message) => (
              <AnimatePresence key={message.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={cn(
                    "flex items-start gap-4",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <AnimatedMessage message={message} />
                  
                </motion.div>
              </AnimatePresence>
            ))}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4"
              >
                <div className="bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 p-3 rounded-2xl backdrop-blur-sm border border-emerald-200/20 h-7 w-7 md:h-12 md:w-12 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                </div>
                <div className="bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-blue-500/5 backdrop-blur-xl border border-emerald-200/20 rounded-2xl rounded-tl-none px-5 py-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="typing-dots">
                      <div className="bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                      <div className="bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    </div>
                    <span className="text-sm text-muted-foreground/80">Generating insights...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Suggested prompts */}
      {messages.length === 0 && (
        <div className="p-4 border-t border-white/10 backdrop-blur-sm bg-white/5 dark:bg-white/5 relative z-10">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 p-1.5 rounded-lg backdrop-blur-sm border border-amber-200/20">
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {isLoading ? 'Generating suggestions...' : 'Suggested questions'}
            </span>
          </h4>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm animate-pulse rounded-xl border border-white/10"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedPrompts.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start gap-3 h-auto p-1.5 sm:p-3 hover:bg-white/10 transition-all duration-300 bg-white/5 backdrop-blur-sm border-white/20 hover:border-white/30 rounded-xl group hover:shadow-lg hover:scale-[1.02]"
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                >
                  <span className="text-lg filter drop-shadow-sm">{item.emoji}</span>
                  <span className="text-sm text-left flex-1 text-foreground/90 line-clamp-1" title={item.prompt}>{item.prompt}</span>
                  <ArrowRight className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 p-4 bg-white/5 dark:bg-white/5 backdrop-blur-sm mt-auto relative z-10 rounded-2xl">
        <form 
          className="flex items-end gap-3 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-2 shadow-inner border border-white/20"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent focus-within:ring-0 focus:outline-0 !ring-0 !outline-none placeholder:text-muted-foreground/60 text-foreground/90"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "rounded-xl h-10 w-10 p-0 flex items-center justify-center transition-all duration-300 group",
              !inputValue.trim() || isLoading 
                ? "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/10" 
                : "bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 border border-blue-400/50"
            )}
          >
            <Send className={cn(
              "h-4 w-4 transition-all duration-200",
              !inputValue.trim() || isLoading ? "" : "group-hover:translate-x-0.5"
            )} />
          </Button>
        </form>
        
        {savedInsights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-xs text-muted-foreground/70 flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10"
          >
            <span>{savedInsights.length} insight{savedInsights.length > 1 ? 's' : ''} saved</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs hover:bg-white/10 rounded-md transition-all duration-200"
              onClick={() => {
                toast.success("Insights saved", {
                  description: `${savedInsights.length} insight${savedInsights.length > 1 ? 's have' : ' has'} been saved to your notes`,
                });
              }}
            >
              View saved
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
