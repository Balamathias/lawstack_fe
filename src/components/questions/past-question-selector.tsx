"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, FileQuestion, Check, Loader2, Calendar, School } from 'lucide-react'
import { useQuestions } from '@/services/client/question'
import { useCreateChat } from '@/services/client/chat'
import { useRouter } from 'nextjs-toploader/app'
import { cn } from '@/lib/utils'
import { Question } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface PastQuestionSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const PastQuestionSelector = ({ isOpen, onClose }: PastQuestionSelectorProps) => {
  const [search, setSearch] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const router = useRouter()
  
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuestions({
    params: search ? { search } : undefined
  })
  
  const { mutate: startChat, isPending: isCreatingChat } = useCreateChat()
  
  const handleStartChat = () => {
    if (!selectedQuestion) return
    
    startChat(
      { 
        title: `Question Analysis: ${selectedQuestion.text?.substring(0, 50)}...`, 
        chat_type: 'question',
        past_question: selectedQuestion.id,
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
      setSearch('')
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-purple-100" />
            Select a Past Question
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions by content, course, or year..."
            className="pl-10 bg-background h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        
        {isLoadingQuestions ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileQuestion className="mx-auto h-16 w-16 opacity-20 mb-3" />
            <p className="text-lg font-medium">No questions found</p>
            {search && <p className="text-sm mt-1">Try a different search term</p>}
          </div>
        ) : (
          <ScrollArea className="flex-1 max-h-[400px] pr-4 -mr-4 overflow-auto">
            <div className="grid gap-3">
              {questions.map((question) => (
                <div 
                  key={question.id}
                  onClick={() => setSelectedQuestion(question.id === selectedQuestion?.id ? null : question)}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all relative group",
                    "hover:bg-muted/50 hover:border-purple-300",
                    question.id === selectedQuestion?.id 
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                      : "border-border"
                  )}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-base font-medium line-clamp-2">
                          {truncateText(question.text_plain || "", 120)}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {question.course_name && (
                          <Badge variant="outline" className="flex items-center gap-1 text-xs">
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
                        
                        {question.created_at && (
                          <span className="text-xs text-muted-foreground">
                            Added: {format(new Date(question.created_at), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      question.id === selectedQuestion?.id 
                        ? "border-purple-500 bg-purple-500 text-white" 
                        : "border-gray-400 group-hover:border-purple-600"
                    )}>
                      {question.id === selectedQuestion?.id && (
                        <Check className="h-4 w-4 m-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartChat} 
            disabled={!selectedQuestion || isCreatingChat}
            className="gap-2 bg-purple-400 hover:bg-purple-500"
          >
            {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileQuestion className="h-4 w-4" />}
            Analyze This Question
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PastQuestionSelector
