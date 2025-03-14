'use client'

import React from 'react'
import { format } from 'date-fns'
import { MessageSquare, Book, FileQuestion, Briefcase, HelpCircle, Loader2, MessageCircle, Sidebar, LucideClock } from 'lucide-react'
import Link from 'next/link'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { User, Chat } from '@/@types/db'
import { useGetChats } from '@/services/client/chat'

interface ChatHistoryProps {
    user: User | null
    currentChatId?: string
    trigger?: React.ReactNode,
}

const ChatHistory = ({ user, currentChatId, trigger }: ChatHistoryProps) => {
  const { data: chatsResponse, isPending, error } = useGetChats()
  
  const getChatIcon = (chatType: string) => {
    switch (chatType) {
      case 'course_specific':
        return <Book className="text-primary" size={18} />
      case 'past_question':
        return <FileQuestion className="text-primary" size={18} />
      case 'exam_prep':
        return <Briefcase className="text-primary" size={18} />
      default:
        return <MessageCircle className="text-primary" size={18} />
    }
  }

  const renderChatContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Loading conversations...</p>
        </div>
      )
    }

    if (error || !chatsResponse?.data) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
          <HelpCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">
            Failed to load chat history. Please try again later.
          </p>
        </div>
      )
    }

    const chats = chatsResponse.data as Chat[];
    console.log(chats)

    if (chats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No conversations yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start a new chat to get help with your legal questions</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <SheetClose asChild key={chat.id}>
                <Link 
                    href={`/dashboard/chat/${chat.id}`} 
                    className={cn(
                        "flex items-start gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/40",
                        currentChatId === chat.id && "bg-muted"
                    )}
                    >
                    <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-md bg-primary/10">
                        {getChatIcon(chat.chat_type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{chat.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                        {chat.message_preview || "No messages yet"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(chat.created_at), 'MMM d, yyyy')}
                        </div>
                    </div>
                </Link>
            </SheetClose>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || <Sidebar size={24} className='cursor-pointer' />}
      </SheetTrigger>

      <SheetContent className='bg-background/70 backdrop-blur-sm'>
        <SheetHeader className=''>
          <SheetTitle className='flex items-center gap-2 text-xl'>
            <LucideClock size={16} />
            Recent Conversations
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-80px)] overflow-hidden">
          {renderChatContent()}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ChatHistory