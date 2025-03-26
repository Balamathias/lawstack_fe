'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { format } from 'date-fns'
import { 
  Clock, 
  Book, 
  FileQuestion, 
  Briefcase, 
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  History,
  LogIn,
  MessageSquareDashed,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Chat, User } from '@/@types/db'
import { useGetChats } from '@/services/client/chat'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Skeleton } from '../ui/skeleton'
import Link from 'next/link'

interface RecentChatsProps {
  user?: User | null
  currentChatId?: string
}

export function RecentChatsLoading() {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden">
            <Skeleton className="h-28 w-full" />
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
      className="w-full rounded-xl bg-gradient-to-r from-blue-950/30 to-blue-900/20 border border-white/10 overflow-hidden backdrop-blur-sm"
    >
      <div className="p-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/10 blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-blue-950/40 text-blue-400 p-3 rounded-lg">
            <History className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-blue-400 mb-1">Your conversations</h3>
            <p className="text-sm text-white/70 mb-3">
              Sign in to view your chat history and continue previous legal conversations
            </p>
            
            <div className="flex items-center gap-3 mt-3">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
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
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  onClick={() => router.push('/dashboard/chat')}
                >
                  Try Demo
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RecentChats({ user, currentChatId }: RecentChatsProps) {
  const { data: chatsResponse, isPending, error } = useGetChats()
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  
  // Handle scroll events to update button states
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setScrollPosition(scrollLeft)
    setMaxScroll(scrollWidth - clientWidth)
  }

  // Function to scroll left/right - fixed implementation
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 320 // Slightly more than card width to ensure a new card is fully visible
    const currentScroll = scrollContainerRef.current.scrollLeft
    
    const newPosition = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(maxScroll, currentScroll + scrollAmount)
    
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }
  
  // Check if user is logged in
  if (!user) {
    return <GuestChatPrompt />;
  }
  
  const getChatIcon = (chatType: string) => {
    switch (chatType) {
      case 'course_specific':
        return <Book className="h-5 w-5" />
      case 'past_question':
        return <FileQuestion className="h-5 w-5" />
      case 'exam_prep':
        return <Briefcase className="h-5 w-5" />
      default:
        return <MessageCircle className="h-5 w-5" />
    }
  }
  
  const getChatColor = (chatType: string, isActive: boolean) => {
    const baseColor = {
      course_specific: {
        textRegular: 'text-blue-400',
        textActive: 'text-blue-300',
        bgRegular: 'bg-blue-950/40',
        bgActive: 'bg-blue-900/60',
        gradientFrom: 'from-blue-950/30',
        gradientTo: 'to-blue-900/40',
        gradientFromActive: 'from-blue-900/40',
        gradientToActive: 'to-blue-800/50'
      },
      past_question: {
        textRegular: 'text-purple-400',
        textActive: 'text-purple-300',
        bgRegular: 'bg-purple-950/40',
        bgActive: 'bg-purple-900/60',
        gradientFrom: 'from-purple-950/30',
        gradientTo: 'to-purple-900/40',
        gradientFromActive: 'from-purple-900/40',
        gradientToActive: 'to-purple-800/50'
      },
      exam_prep: {
        textRegular: 'text-emerald-400',
        textActive: 'text-emerald-300',
        bgRegular: 'bg-emerald-950/40',
        bgActive: 'bg-emerald-900/60',
        gradientFrom: 'from-emerald-950/30',
        gradientTo: 'to-emerald-900/40',
        gradientFromActive: 'from-emerald-900/40',
        gradientToActive: 'to-emerald-800/50'
      },
      general: {
        textRegular: 'text-amber-400',
        textActive: 'text-amber-300',
        bgRegular: 'bg-amber-950/40',
        bgActive: 'bg-amber-900/60',
        gradientFrom: 'from-amber-950/30',
        gradientTo: 'to-amber-900/40',
        gradientFromActive: 'from-amber-900/40',
        gradientToActive: 'to-amber-800/50'
      }
    }
    
    const colorScheme = baseColor[chatType as keyof typeof baseColor] || baseColor.general
    
    return {
      text: isActive ? colorScheme.textActive : colorScheme.textRegular,
      bg: isActive ? colorScheme.bgActive : colorScheme.bgRegular,
      gradient: isActive 
        ? `${colorScheme.gradientFromActive} ${colorScheme.gradientToActive}`
        : `${colorScheme.gradientFrom} ${colorScheme.gradientTo}`
    }
  }

  // Show loading state
  if (isPending) {
    return <RecentChatsLoading />
  }

  // Show empty state if no chats or error
  if (error || !chatsResponse?.data || chatsResponse.data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-xl bg-gradient-to-r from-amber-950/30 to-amber-900/20 border border-white/10 overflow-hidden backdrop-blur-sm"
      >
        <div className="p-6 relative">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-amber-950/40 text-amber-400 p-3 rounded-lg">
              <MessageSquareDashed className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-amber-400 mb-1">No conversations yet</h3>
              <p className="text-sm text-white/70 mb-3">
                Start a new conversation to see your chat history here
              </p>
              
              <Button 
                onClick={() => router.push('/dashboard/chat')}
                className="bg-amber-600 hover:bg-amber-500 text-white mt-3 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Start New Chat
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Get only the 10 most recent chats
  const recentChats = (chatsResponse.data as Chat[]).slice(0, 10)
  
  return (
    <motion.div 
      className="w-full py-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-muted/50">
            <History size={14} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">Recent Conversations</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all",
              scrollPosition <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-background hover:shadow-sm"
            )}
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all",
              scrollPosition >= maxScroll ? "opacity-50 cursor-not-allowed" : "hover:bg-background hover:shadow-sm"
            )}
            onClick={() => scroll('right')}
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div 
        className="overflow-x-auto scrollbar-hidden pb-2"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className="flex gap-4 min-w-full pb-1">
          <AnimatePresence>
            {recentChats.map((chat, index) => {
              const isActive = currentChatId === chat.id;
              const colors = getChatColor(chat.chat_type, isActive);
              
              return (
                <motion.div 
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className={cn(
                    "flex-shrink-0 w-[280px] rounded-xl overflow-hidden cursor-pointer group",
                    "border border-white/10 backdrop-blur-sm shadow-sm",
                    `bg-gradient-to-br ${colors.gradient}`,
                    isActive ? "ring-2 ring-white/20" : ""
                  )}
                  onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ y: 0, scale: 0.98, transition: { duration: 0.2 } }}
                >
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn("p-2 rounded-lg", colors.bg, colors.text)}>
                        {getChatIcon(chat.chat_type)}
                      </div>
                      <h4 className={cn("font-medium text-sm truncate flex-1", colors.text)}>
                        {chat.title || "New conversation"}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-white/70 line-clamp-2 flex-1 min-h-[40px]">
                      {chat.message_preview || "No messages yet"}
                    </p>
                    
                    <div className="text-xs text-white/50 mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(chat.created_at), 'MMM d, yyyy')}
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-xs text-white/70 flex items-center gap-1 group-hover:opacity-100 transition-opacity"
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
