'use client'

import React from 'react'
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
  MessageSquareDashed
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Chat, User } from '@/@types/db'
import { useGetChats } from '@/services/client/chat'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Skeleton } from '../ui/skeleton'
import Empty from '../empty'

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

export default function RecentChats({ user, currentChatId }: RecentChatsProps) {
  const { data: chatsResponse, isPending, error } = useGetChats()
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Check if user is logged in
  if (!user) {
    return (
      <div className="w-full py-6 border-t bg-gradient-to-b from-muted/30 to-transparent">
        <Empty 
          icon={<LogIn className="h-6 w-6 text-blue-500" />}
          color="blue"
          title="Sign in to view your recent chats"
          content="Your chat history will appear here once you're logged in"
          action={
            <Button 
              onClick={() => router.push('/auth/login')}
              variant="outline"
              className="mt-2"
            >
              Sign In
            </Button>
          }
        />
      </div>
    )
  }

  // Function to scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 300
    const currentScroll = scrollContainerRef.current.scrollLeft
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    })
  }
  
  const getChatIcon = (chatType: string) => {
    switch (chatType) {
      case 'course_specific':
        return <Book className="text-blue-500" size={18} />
      case 'past_question':
        return <FileQuestion className="text-purple-500" size={18} />
      case 'exam_prep':
        return <Briefcase className="text-green-500" size={18} />
      default:
        return <MessageCircle className="text-amber-500" size={18} />
    }
  }
  
  const getChatGradient = (chatType: string) => {
    switch (chatType) {
      case 'course_specific':
        return 'from-blue-500/10 to-blue-500/5'
      case 'past_question':
        return 'from-purple-500/10 to-purple-500/5'
      case 'exam_prep':
        return 'from-green-500/10 to-green-500/5'
      default:
        return 'from-amber-500/10 to-amber-500/5'
    }
  }

  // Show loading state - though we use Suspense, this is a fallback
  if (isPending) {
    return <RecentChatsLoading />
  }

  // Show empty state if no chats or error
  if (error || !chatsResponse?.data || chatsResponse.data.length === 0) {
    return (
      <div className="w-full py-6 border-t bg-gradient-to-b from-muted/30 to-transparent">
        <Empty 
          icon={<MessageSquareDashed className="h-6 w-6 text-amber-500" />}
          color="amber"
          title="No conversations yet"
          content="Start a new conversation to see your chat history here"
          action={
            <Button 
              onClick={() => router.push('/dashboard/chat')}
              variant="outline"
              className="mt-2"
            >
              Start New Chat
            </Button>
          }
        />
      </div>
    )
  }

  // Get only the 10 most recent chats
  const recentChats = (chatsResponse.data as Chat[]).slice(0, 10)
  
  return (
    <div className="w-full py-4 border-t bg-gradient-to-b from-muted/30 to-transparent">
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-2">
          <History size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Recent Conversations</h3>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-background/80 shadow-sm hover:bg-background"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-background/80 shadow-sm hover:bg-background"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="pb-2" ref={scrollContainerRef}>
        <div className="flex gap-3 px-4">
          {recentChats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
              className={cn(
                "flex-shrink-0 w-[280px] h-28 rounded-xl bg-gradient-to-br border cursor-pointer",
                getChatGradient(chat.chat_type),
                currentChatId === chat.id ? "ring-2 ring-primary/20" : "hover:shadow-md transition-shadow",
              )}
            >
              <div className="p-3 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded-md bg-background/80">
                    {getChatIcon(chat.chat_type)}
                  </div>
                  <h4 className="font-medium text-sm truncate flex-1">{chat.title}</h4>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                  {chat.message_preview || "No messages yet"}
                </p>
                
                <div className="text-xs text-muted-foreground mt-auto flex items-center gap-1">
                  <Clock size={12} />
                  {format(new Date(chat.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
