'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  Clock, 
  Book, 
  FileQuestion, 
  Briefcase, 
  HelpCircle, 
  Loader2, 
  MessageCircle, 
  Sidebar, 
  Plus, 
  Search, 
  X, 
  SlidersHorizontal,
  CalendarDays,
  LayoutList,
  ChevronUp,
  ChevronDown,
  Trash2,
  RefreshCcw,
  Trophy,
  Wand2,
  Calendar,
  MessageSquare
} from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { User, Chat } from '@/@types/db'
import { useGetChats, useDeleteChat } from '@/services/client/chat'
import { Button } from '../ui/button'
import { useRouter } from 'nextjs-toploader/app'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel
} from '../ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Modal dialog for confirmation
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

interface ChatHistoryProps {
  user: User | null
  currentChatId?: string
  trigger?: React.ReactNode,
}

const sortOptions = [
  { label: 'Newest first', value: 'newest', icon: <ChevronUp className="h-4 w-4" /> },
  { label: 'Oldest first', value: 'oldest', icon: <ChevronDown className="h-4 w-4" /> },
  { label: 'Alphabetically (A-Z)', value: 'aToZ', icon: <LayoutList className="h-4 w-4" /> },
]

// Chat history item component
interface ChatHistoryItemProps {
  chat: Chat
  isActive: boolean
  icon: React.ReactNode
  onDelete: (e: React.MouseEvent) => void
  closeDrawer: () => void
  showDeleteLoading: boolean
}

const ChatHistoryItem = ({ chat, isActive, icon, onDelete, closeDrawer, showDeleteLoading }: ChatHistoryItemProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const date = new Date(chat.created_at)
  const formattedDate = format(date, 'MMM d, yyyy')
  const formattedTime = format(date, 'h:mm a')
  
  // Display a proper context badge for specialized chats
  const getContextBadge = () => {
    if (chat.chat_type === 'course_specific') {
      return (
        <Badge 
          variant="outline" 
          className="text-[10px] px-1 py-0 border-blue-500/30 bg-blue-500/5 text-blue-500"
        >
          Course
        </Badge>
      );
    }
    
    if (chat.chat_type === 'past_question') {
      return (
        <Badge 
          variant="outline" 
          className="text-[10px] px-1 py-0 border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
        >
          Question
        </Badge>
      );
    }
    
    return null;
  };
  
  const handleClick = () => {
    router.push(`/dashboard/chat/${chat.id}`)
    closeDrawer()
  }
  
  return (
    <motion.div
      className={cn(
        "group relative rounded-lg mb-2 border transition-all overflow-hidden",
        isActive 
          ? "bg-primary/5 border-primary/40" 
          : "hover:bg-accent/50 border-transparent"
      )}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="p-3 cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-md text-foreground/80 flex-shrink-0 transition-colors",
            isActive ? "bg-primary/10 text-primary" : "bg-muted"
          )}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-1">
              <h4 className={cn(
                "text-sm font-medium truncate max-w-[170px]",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {chat.title || "New conversation"}
              </h4>
              
              <AnimatePresence>
                {(showMenu || isActive) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center"
                  >
                    <button
                      onClick={onDelete}
                      className={cn(
                        "p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors",
                        showDeleteLoading && "pointer-events-none opacity-60"
                      )}
                      title="Delete chat"
                      disabled={showDeleteLoading}
                    >
                      {showDeleteLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 mb-1.5">
              {chat.message_preview || "No messages yet"}
            </p>
            
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <time title={`${formattedDate} at ${formattedTime}`}>
                  {new Date(chat.created_at).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </time>
              </span>
              
              <div className="flex items-center gap-1">
                {getContextBadge()}
                
                {isActive && (
                  <Badge 
                    variant="outline" 
                    className="text-[10px] px-1 py-0 border-primary/30 bg-primary/5 text-primary"
                  >
                    Current
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ChatHistory = ({ currentChatId, trigger }: ChatHistoryProps) => {
  const { data: chatsResponse, isPending, error, refetch } = useGetChats({ params: { ordering: '-updated_at' }})
  const deleteChat = useDeleteChat()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  // Search and sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [activeTab, setActiveTab] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'today': true, 'week': true, 'month': true, 'older': true })

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetChat, setDeleteTargetChat] = useState<Chat | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Group chats by time period
  const groupChatsByDate = (chats: Chat[]) => {
    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 7)
    
    const monthStart = new Date(now)
    monthStart.setMonth(now.getMonth() - 1)
    
    return {
      today: chats.filter(chat => new Date(chat.created_at) >= todayStart),
      week: chats.filter(chat => {
        const date = new Date(chat.created_at)
        return date >= weekStart && date < todayStart
      }),
      month: chats.filter(chat => {
        const date = new Date(chat.created_at)
        return date >= monthStart && date < weekStart
      }),
      older: chats.filter(chat => new Date(chat.created_at) < monthStart)
    }
  }
  
  // Filter and sort chats
  const getFilteredAndSortedChats = () => {
    if (!chatsResponse?.data) return { today: [], week: [], month: [], older: [] }
    
    let chats = [...chatsResponse.data] as Chat[]
    
    // Filter by search term
    if (searchTerm) {
      chats = chats.filter(chat => 
        chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.message_preview?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filter by type
    if (activeTab !== 'all') {
      chats = chats.filter(chat => chat.chat_type === activeTab)
    }
    
    // Sort
    chats.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'aToZ':
          return (a.title || '').localeCompare(b.title || '')
        default:
          return 0
      }
    })
    
    return groupChatsByDate(chats)
  }
  
  const getChatIcon = (chatType: string) => {
    switch (chatType) {
      case 'course_specific':
        return <Book className="text-blue-500" size={18} />
      case 'past_question':
        return <FileQuestion className="text-purple-500" size={18} />
      case 'exam_prep':
        return <Briefcase className="text-amber-500" size={18} />
      default:
        return <MessageCircle className="text-primary" size={18} />
    }
  }

  // Open delete dialog
  const handleDeleteChat = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDeleteTargetChat(chat)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDeleteChat = async () => {
    if (!deleteTargetChat) return
    setDeleteLoading(true)
    try {
      await deleteChat.mutateAsync(deleteTargetChat.id, {
        onSuccess: () => {
          toast.success('Chat deleted successfully')
          refetch()
          setDeleteDialogOpen(false)
          setDeleteTargetChat(null)
          setDeleteLoading(false)
          // If the current chat was deleted, redirect to chat home
          if (deleteTargetChat.id === currentChatId) {
            router.push('/dashboard/chat')
          }
        },
        onError: () => {
          toast.error('Failed to delete chat')
          setDeleteLoading(false)
        }
      })
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error('Failed to delete chat')
      setDeleteLoading(false)
    }
  }
  
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }
  
  // Clear search results when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSortBy('newest')
      setActiveTab('all')
    }
  }, [isOpen])

  const filteredChats = getFilteredAndSortedChats()
  const totalChats = Object.values(filteredChats).reduce((total, group) => total + group.length, 0)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {trigger || <Sidebar size={24} className='cursor-pointer' />}
        </SheetTrigger>

        <SheetContent 
          className="p-0 flex flex-col max-w-md w-[85vw] sm:w-[385px] bg-background/95 backdrop-blur-md"
          side="right"
        >
          <div className="flex flex-col h-full overflow-hidden">
            <SheetHeader className='p-4 border-b'>
              <div className="flex items-center justify-between gap-4">
                <SheetTitle className='text-xl flex items-center gap-2'>
                  <Wand2 className="h-5 w-5 text-primary" />
                  Chat History
                </SheetTitle>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8 hover:bg-muted" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-9 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 shrink-0"
                      title="Sort conversations"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    {sortOptions.map(option => (
                      <DropdownMenuItem 
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                        {sortBy === option.value && (
                          <Badge variant="secondary" className="ml-auto h-5 text-[10px]">
                            Active
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="mt-3"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="general">Chats</TabsTrigger>
                  <TabsTrigger value="course_specific">Course</TabsTrigger>
                  <TabsTrigger value="past_question">PQ</TabsTrigger>
                </TabsList>
              </Tabs>
            </SheetHeader>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="flex-1 relative min-h-[300px]">
                {isPending ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">Loading conversations...</p>
                  </div>
                ) : error || !chatsResponse?.data ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                    <HelpCircle className="h-8 w-8 text-destructive mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Failed to load chat history. Please try again later.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 gap-2"
                      onClick={() => refetch()}
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Retry
                    </Button>
                  </div>
                ) : totalChats === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                    <p className="text-base font-medium">No conversations found</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      {searchTerm 
                        ? `No results for "${searchTerm}". Try a different search term.` 
                        : "Start a new chat to get help with your legal questions"}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 flex flex-col flex-1">
                  {/* Today's chats */}
                  {filteredChats.today.length > 0 && (
                    <div className="mb-5">
                      <button 
                        className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full justify-between"
                        onClick={() => toggleGroup('today')}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>Today</span>
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {filteredChats.today.length}
                          </Badge>
                        </div>
                        <div>
                          {expandedGroups.today ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedGroups.today && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {filteredChats.today.map((chat) => (
                              <ChatHistoryItem 
                                key={chat.id} 
                                chat={chat} 
                                isActive={chat.id === currentChatId}
                                icon={getChatIcon(chat.chat_type)}
                                onDelete={(e) => handleDeleteChat(chat, e)}
                                closeDrawer={() => setIsOpen(false)}
                                showDeleteLoading={deleteLoading && deleteTargetChat?.id === chat.id}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  {/* This week's chats */}
                  {filteredChats.week.length > 0 && (
                    <div className="mb-5">
                      <button 
                        className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full justify-between"
                        onClick={() => toggleGroup('week')}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Earlier this week</span>
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {filteredChats.week.length}
                          </Badge>
                        </div>
                        <div>
                          {expandedGroups.week ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedGroups.week && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {filteredChats.week.map((chat) => (
                              <ChatHistoryItem 
                                key={chat.id} 
                                chat={chat} 
                                isActive={chat.id === currentChatId}
                                icon={getChatIcon(chat.chat_type)}
                                onDelete={(e) => handleDeleteChat(chat, e)}
                                closeDrawer={() => setIsOpen(false)}
                                showDeleteLoading={deleteLoading && deleteTargetChat?.id === chat.id}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  {/* This month's chats */}
                  {filteredChats.month.length > 0 && (
                    <div className="mb-5">
                      <button 
                        className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full justify-between"
                        onClick={() => toggleGroup('month')}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Earlier this month</span>
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {filteredChats.month.length}
                          </Badge>
                        </div>
                        <div>
                          {expandedGroups.month ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedGroups.month && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {filteredChats.month.map((chat) => (
                              <ChatHistoryItem 
                                key={chat.id} 
                                chat={chat} 
                                isActive={chat.id === currentChatId}
                                icon={getChatIcon(chat.chat_type)}
                                onDelete={(e) => handleDeleteChat(chat, e)}
                                closeDrawer={() => setIsOpen(false)}
                                showDeleteLoading={deleteLoading && deleteTargetChat?.id === chat.id}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  {/* Older chats */}
                  {filteredChats.older.length > 0 && (
                    <div className="mb-5">
                      <button 
                        className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full justify-between"
                        onClick={() => toggleGroup('older')}
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          <span>Older conversations</span>
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {filteredChats.older.length}
                          </Badge>
                        </div>
                        <div>
                          {expandedGroups.older ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedGroups.older && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {filteredChats.older.map((chat) => (
                              <ChatHistoryItem 
                                key={chat.id} 
                                chat={chat} 
                                isActive={chat.id === currentChatId}
                                icon={getChatIcon(chat.chat_type)}
                                onDelete={(e) => handleDeleteChat(chat, e)}
                                closeDrawer={() => setIsOpen(false)}
                                showDeleteLoading={deleteLoading && deleteTargetChat?.id === chat.id}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <SheetFooter className="p-4 border-t">
              <Button 
                className="w-full gap-2"
                onClick={() => {
                  router.push('/dashboard/chat')
                  setIsOpen(false)
                }}
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={open => {
        if (!deleteLoading) setDeleteDialogOpen(open)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 mt-2">
            <MessageCircle className="h-6 w-6 text-destructive" />
            <span className="font-medium">
              {deleteTargetChat?.title || 'Untitled conversation'}
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                disabled={deleteLoading}
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteChat}
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ChatHistory