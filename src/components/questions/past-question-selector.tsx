"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, FileQuestion, Check, Loader2, Calendar, School, X, Clock, Sparkles } from 'lucide-react'
import { useQuestions } from '@/services/client/question'
import { useCreateChat } from '@/services/client/chat'
import { useRouter } from 'nextjs-toploader/app'
import { cn } from '@/lib/utils'
import { Question } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/use-debounce'

interface PastQuestionSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const PastQuestionSelector = ({ isOpen, onClose }: PastQuestionSelectorProps) => {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400) // Debounce search input with 400ms delay
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const router = useRouter()
  
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuestions({
    params: debouncedSearch ? { search: debouncedSearch } : undefined
  })
  
  const { mutate: startChat, isPending: isCreatingChat } = useCreateChat()
  
  const handleStartChat = () => {
    if (!selectedQuestion) return
    
    startChat(
      { 
        title: `Question Analysis: ${selectedQuestion.text?.substring(0, 50)}...`, 
        chat_type: 'question',
        past_question: selectedQuestion.id,
        course: selectedQuestion.course
      },
      {
        onSuccess: (data) => {
          if (data.error) {
            console.error('Error starting chat:', data.error)
            return
          }
          router.push(`/dashboard/chat/${data?.data?.id}`)
          onClose()
        }
      }
    )
  }
  
  // Reset selected question when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedQuestion(null)
      setSearchInput('')
    }
  }, [isOpen])

  const questions = questionsData?.data || []
  
  // Helper function to truncate long question text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "No question text";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-purple-500/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <div className="bg-purple-500/10 p-2 rounded-full">
                <FileQuestion className="h-6 w-6 text-purple-500" />
              </div>
              Analyze Past Question
            </DialogTitle>
            <p className="text-muted-foreground mt-2 ml-1">
              Select a past question to analyze with our AI assistant for deep insights and exam preparation.
            </p>
          </DialogHeader>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full h-8 w-8 hover:bg-purple-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 pt-4 space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search input with animation */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search questions by content, course, or year..."
              className="pl-10 bg-card h-12 border-border focus-visible:ring-purple-500/20 focus-visible:border-purple-500/80 rounded-lg"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            {searchInput && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-8 w-8 rounded-full" 
                onClick={() => setSearchInput('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isLoadingQuestions ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 flex-1">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <p className="text-muted-foreground">Searching questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex-1 flex flex-col items-center justify-center">
              <div className="bg-purple-500/5 p-4 rounded-full mb-4">
                <FileQuestion className="h-10 w-10 text-purple-500/60" />
              </div>
              <p className="text-lg font-medium text-foreground">No questions found</p>
              {searchInput && (
                <p className="text-sm mt-1 max-w-md">
                  No questions match "{searchInput}". Try a different search term or browse all questions.
                </p>
              )}
              {!searchInput && (
                <p className="text-sm mt-1 max-w-md">
                  Start typing to search for past questions.
                </p>
              )}
            </div>
          ) : (
            <ScrollArea className="flex-1 max-h-[400px] pr-4 -mr-4 overflow-auto">
              <div className="grid gap-3">
                <AnimatePresence initial={false}>
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: index * 0.03,
                        ease: "easeOut"
                      }}
                    >
                      <div 
                        onClick={() => setSelectedQuestion(question.id === selectedQuestion?.id ? null : question)}
                        className={cn(
                          "p-4 border rounded-xl cursor-pointer transition-all relative group",
                          "hover:bg-muted/50 hover:border-purple-300/50 hover:shadow-sm",
                          question.id === selectedQuestion?.id 
                            ? "border-purple-500 bg-purple-500/5 shadow" 
                            : "border-border"
                        )}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="mb-2">
                              <div className="flex justify-between items-center">
                                {question.id === selectedQuestion?.id && (
                                  <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-500 border-purple-500/20 mb-2">
                                    Selected for Analysis
                                  </Badge>
                                )}
                              </div>
                              <p className={cn(
                                "text-base text-foreground line-clamp-3 mt-1",
                                question.id === selectedQuestion?.id ? "font-medium" : "font-normal" 
                              )}>
                                {truncateText(question.text_plain || "", 180)}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {question.course_name && (
                                <Badge variant="outline" className="flex items-center gap-1 text-xs border-purple-200 bg-purple-500/5">
                                  <School className="h-3 w-3" />
                                  {question.course_name}
                                </Badge>
                              )}
                              
                              {question.year && (
                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                  <Calendar className="h-3 w-3" />
                                  {question.year}
                                </Badge>
                              )}
                              
                              {question.semester && (
                                <Badge variant="secondary" className="text-xs">
                                  {question.semester === "1" ? "1st" : "2nd"} Semester
                                </Badge>
                              )}
                              
                              {question.created_at && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(question.created_at), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={cn(
                            "h-7 w-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                            question.id === selectedQuestion?.id 
                              ? "border-purple-500 bg-purple-500 text-white" 
                              : "border-muted-foreground/30 group-hover:border-purple-500/40"
                          )}>
                            {question.id === selectedQuestion?.id && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/80 mt-4">
            <Button variant="outline" onClick={onClose} className="rounded-lg">
              Cancel
            </Button>
            <Button 
              onClick={handleStartChat} 
              disabled={!selectedQuestion || isCreatingChat}
              className="gap-2 rounded-lg bg-purple-500 hover:bg-purple-600"
            >
              {isCreatingChat ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Analyze Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PastQuestionSelector
