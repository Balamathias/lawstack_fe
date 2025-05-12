'use client'

import { Chat } from '@/@types/db'
import React, { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  MessageSquare,
  Clock,
  Calendar,
  BookOpen,
  FileQuestion,
  Briefcase,
  MessageCircle
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'

interface Props {
  chats: Chat[],
  count: number,
  pageSize?: number
}

const ChatsTable = ({ chats, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null)
  
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleChatAction = (chat: Chat, action: 'view' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/chat/${chat.id}`)
        break
      case 'delete':
        setChatToDelete(chat)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!chatToDelete) return
    
    try {
      // API call to delete chat would go here
      // await deleteChat(chatToDelete.id)
      console.log(`Deleting chat: ${chatToDelete.id}`)
      setChatToDelete(null)
      // Refresh data or show success message
    } catch (error) {
      console.error('Failed to delete chat:', error)
      // Show error message
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    return format(new Date(dateString), 'h:mm a')
  }

  const getChatTypeIcon = (chatType: string) => {
    switch (chatType) {
      case 'general': return <MessageSquare className="h-4 w-4" />
      case 'course_specific': return <BookOpen className="h-4 w-4" />
      case 'past_question': return <FileQuestion className="h-4 w-4" />
      case 'exam_prep': return <Briefcase className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getChatTypeBadge = (chatType: string) => {
    switch (chatType) {
      case 'general':
        return 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
      case 'course_specific':
        return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 border border-blue-300/30'
      case 'past_question':
        return 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400 border border-violet-300/30'
      case 'exam_prep':
        return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border border-amber-300/30'
      default:
        return 'bg-secondary/50'
    }
  }
  
  const formatChatTypeLabel = (chatType: string) => {
    return chatType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getPreviewText = (chat: Chat) => {
    if (chat.message_preview) {
      return chat.message_preview.length > 60 
        ? chat.message_preview.substring(0, 60) + '...' 
        : chat.message_preview
    }
    return 'No messages yet'
  }

  if (chats.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-background/50">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No chats found</h3>
          <p className="text-sm text-muted-foreground">
            There are no chats to display at the moment.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <Table>
        <TableCaption>List of chats in the system</TableCaption>
        <TableHeader>
          <TableRow className="bg-secondary/20 hover:bg-secondary/30 dark:bg-muted/50 dark:hover:bg-muted/60">
            <TableHead className="w-[280px]">Chat</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Preview</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="hidden lg:table-cell">Updated</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chats.map((chat) => (
            <TableRow key={chat.id} className="hover:bg-muted/30 transition-all duration-150">
              <TableCell className="py-4 font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    {getChatTypeIcon(chat.chat_type)}
                  </div>
                  <div>
                    <div className="font-medium leading-none mb-1 text-base">
                      {chat.title || 'Untitled Chat'}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {chat.course_name || chat.past_question_text?.substring(0, 30) || 'General chat'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getChatTypeBadge(chat.chat_type)}>
                  <div className="flex items-center gap-1.5">
                    {getChatTypeIcon(chat.chat_type)}
                    <span>{formatChatTypeLabel(chat.chat_type)}</span>
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {getPreviewText(chat)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(chat.created_at)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 ml-5">
                    {formatTime(chat.created_at)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{chat.updated_at ? formatDate(chat.updated_at) : 'Never updated'}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] animate-in zoom-in-50 duration-200">
                    <DropdownMenuLabel>Chat Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleChatAction(chat, 'view')}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Chat</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleChatAction(chat, 'delete')}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Chat</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="font-medium">{count}</span> chats
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the chat{' '}
              <span className="font-medium">{chatToDelete?.title || 'Untitled Chat'}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm">
              <span className="font-medium">Title:</span> {chatToDelete?.title || 'Untitled Chat'}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Type:</span> {chatToDelete && formatChatTypeLabel(chatToDelete.chat_type)}
            </p>
            {chatToDelete?.course_name && (
              <p className="text-sm mt-1">
                <span className="font-medium">Course:</span> {chatToDelete.course_name}
              </p>
            )}
            {chatToDelete?.created_at && (
              <p className="text-sm mt-1">
                <span className="font-medium">Created:</span> {formatDate(chatToDelete.created_at)}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setChatToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ChatsTable
