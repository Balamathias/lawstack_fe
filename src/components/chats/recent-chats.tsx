'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { format } from 'date-fns'
import { 
  Clock, 
  BookOpen, 
  FileQuestion, 
  Briefcase, 
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  History,
  LogIn,
  MessageSquareDashed,
  ArrowRight,
  MessageSquareText,
  Sparkles,
  MessageSquareMore
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Chat, User } from '@/@types/db'
import { useGetChats } from '@/services/client/chat'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import Link from 'next/link'
import { Badge } from '../ui/badge'

interface RecentChatsProps {
  user?: User | null
  currentChatId?: string,
  chats: Chat[]
}

export function RecentChatsLoading() {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[300px] rounded-xl overflow-hidden">
            <Skeleton className="h-[160px] w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

const GuestChatPrompt = () => {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl bg-background/30 backdrop-blur-sm border border-primary/20 overflow-hidden shadow-md relative"
    >
      {/* Enhanced background patterns */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', 
          backgroundSize: '20px 20px'
        }}/>
      </div>
      
      {/* Ambient gradients for depth */}
      <div className="absolute top-0 right-0 w-2/5 h-2/5 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-primary/10 text-primary p-3 rounded-xl border border-primary/20">
            <History className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground mb-1">Your conversations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to view your chat history and continue previous legal conversations
            </p>
            
            <div className="flex items-center gap-3 mt-3">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-primary/30 rounded-lg blur-sm opacity-60 hover:opacity-80 transition-all duration-300"></div>
                <Button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 rounded-lg relative z-10"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="text-primary flex items-center gap-1 rounded-lg group"
                  onClick={() => router.push('/dashboard/chat')}
                >
                  <span>Try Demo</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RecentChats({ user, currentChatId, chats }: RecentChatsProps) {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [visibleStartIndex, setVisibleStartIndex] = useState(0)
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setScrollPosition(scrollLeft)
    setMaxScroll(scrollWidth - clientWidth)
    
    // Calculate visible cards (for keyboard navigation)
    const cardWidth = 300 // Approximate card width + gap
    const visibleIndex = Math.floor(scrollLeft / cardWidth)
    setVisibleStartIndex(visibleIndex)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 320 // Slightly more than card width
    const currentScroll = scrollContainerRef.current.scrollLeft
    
    const newPosition = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(maxScroll, currentScroll + scrollAmount)
    
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scroll('left')
      } else if (e.key === 'ArrowRight') {
        scroll('right')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [maxScroll, scrollPosition])
  
  // Update maxScroll on resize
  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setMaxScroll(scrollWidth - clientWidth)
      }
    }
    
    window.addEventListener('resize', updateMaxScroll)
    updateMaxScroll()
    
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [chats])
  
  if (!user) {
    return <GuestChatPrompt />;
  }
  
  const getChatIcon = (chatType: string) => {
    switch (chatType) {
      case 'course_specific':
        return <BookOpen className="h-5 w-5" />
      case 'past_question':
        return <FileQuestion className="h-5 w-5" />
      case 'exam_prep':
        return <Briefcase className="h-5 w-5" />
      default:
        return <MessageSquareText className="h-5 w-5" />
    }
  }
  
  const getChatTypeLabel = (chatType: string) => {
    switch (chatType) {
      case 'course_specific': return 'Course'
      case 'past_question': return 'PQ'
      case 'exam_prep': return 'Exam'
      default: return 'Chat'
    }
  }
  
  const getChatTypeColor = (chatType: string) => {
    switch (chatType) {
      case 'course_specific': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'past_question': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'exam_prep': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default: return 'bg-primary/10 text-primary border-primary/20'
    }
  }
  
  // if (isPending) {
  //   return <RecentChatsLoading />
  // }

  if (chats?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-xl bg-background/30 backdrop-blur-sm border border-border/60 overflow-hidden shadow-md relative"
      >
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', 
            backgroundSize: '20px 20px'
          }}/>
        </div>
        
        {/* Ambient gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="p-6 relative z-10">
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-primary/10 text-primary p-3 rounded-xl border border-primary/20">
              <MessageSquareDashed className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground mb-1">No conversations yet</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Start a new conversation to see your chat history here
              </p>
              
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-block mt-3"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-primary/30 rounded-lg blur-sm opacity-60 hover:opacity-80 transition-all duration-300"></div>
                <Button 
                  onClick={() => router.push('/dashboard/chat')}
                  className="flex items-center gap-2 rounded-lg relative z-10"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Start New Chat</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const recentChats = (chats as Chat[]).slice(0, 10)
  
  return (
    <motion.div 
      className="w-full py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <MessageSquareMore className="h-4 w-4" />
          </div>
          <h3 className="text-sm md:text-base font-medium">Recent Conversations</h3>
          <Badge variant="outline" className="ml-1 text-xs py-0 px-2 rounded-full">
            {recentChats.length}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full transition-all",
              scrollPosition <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10 hover:text-primary"
            )}
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full transition-all",
              scrollPosition >= maxScroll ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10 hover:text-primary"
            )}
            onClick={() => scroll('right')}
            disabled={scrollPosition >= maxScroll}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </Button>
          <Link href="/dashboard/chats" passHref className="md:flex hidden">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs gap-1.5 h-8 rounded-lg hover:bg-primary/10 hover:text-primary group"
            >
              <span>View All</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div 
        className="overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        tabIndex={0}
        role="region"
        aria-label="Recent conversations"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <div className="flex gap-4 min-w-full pb-1">
          <AnimatePresence>
            {recentChats.map((chat, index) => {
              const isActive = currentChatId === chat.id;
              const date = new Date(chat.created_at);
              const formattedDate = format(date, 'MMM d, yyyy');
              const timeAgo = formatTimeAgo(date);
              const chatTypeClass = getChatTypeColor(chat.chat_type);
              
              return (
                <motion.div 
                  key={chat.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.12)",
                    borderColor: "var(--primary)"
                  }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={cn(
                    'flex-shrink-0 w-[300px] rounded-xl overflow-hidden cursor-pointer',
                    'backdrop-blur-sm border transition-all relative group',
                    isActive 
                      ? 'border-primary/40 shadow-md bg-background/40' 
                      : 'border-border/60 hover:border-primary/30 shadow-sm bg-background/30'
                  )}
                  onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
                  tabIndex={0}
                  role="button"
                  aria-current={isActive ? "true" : "false"}
                >
                  {/* Card background effects */}
                  <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.03]" style={{ 
                    backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', 
                    backgroundSize: '16px 16px'
                  }} />
                  
                  {/* Active glow effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-xl" />
                  )}
                  
                  {/* Top colorful border */}
                  <div className={cn(
                    "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-80",
                    "transition-opacity duration-300"
                  )} />

                  <div className="p-4 h-full flex flex-col relative z-10">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg border transition-all duration-200",
                          chatTypeClass,
                          "group-hover:shadow-sm group-hover:scale-105 hidden"
                        )}>
                          {getChatIcon(chat.chat_type)}
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted/50 dark:bg-muted/20">
                          {getChatTypeLabel(chat.chat_type)}
                        </Badge>
                      </div>
                      
                      {isActive && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4 border border-primary/20">
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className={cn(
                      "font-medium text-sm mb-2 transition-colors duration-200",
                      isActive ? "text-primary" : "group-hover:text-primary"
                    )}>
                      {chat.title || "New conversation"}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1 min-h-[40px] hidden">
                      {chat.message_preview || "No messages yet"}
                    </p>
                    
                    <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span title={formattedDate}>{timeAgo}</span>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-xs text-primary font-medium flex items-center gap-1 transition-all"
                      >
                        <span>Continue</span>
                        <ArrowRight className="h-3 w-3" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// Helper function to format relative time
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsAgo < 60) return 'just now';
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return `${daysAgo}d ago`;
  
  // If more than a week, use the date format from format()
  return format(date, 'MMM d');
}
