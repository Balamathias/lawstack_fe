'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Quiz, QuizQuestion } from '@/@types/db'
import { useQuiz, useStartQuiz, useSubmitAnswer, useCompleteQuiz } from '@/services/client/quiz'
import { StackResponse } from '@/@types/generics'
import { 
  Clock, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, XCircle, Flag,
  Brain, BookOpen, Timer, ListTodo, Award, RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn, convertMarkdownToPlainText } from '@/lib/utils'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import MarkdownPreview from '../markdown-preview'
import { useRouter } from 'nextjs-toploader/app'
import LoadingOverlay from '../loading-overlay'
import DynamicModal from '../dynamic-modal'
import { DialogClose } from '@radix-ui/react-dialog'

interface QuizSessionProps {
  initialQuiz: Quiz
}

export default function QuizSession({ initialQuiz }: QuizSessionProps) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTimeWarning, setIsTimeWarning] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [selectionAnimation, setSelectionAnimation] = useState<string | null>(null)
  const [isStartingQuiz, setIsStartingQuiz] = useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get latest quiz data with enabled option - we'll control this with the quiz ID
  const { data: quizResponse, isLoading: isLoadingQuiz, refetch } = useQuiz(quiz.id, {
    enabled: !isStartingQuiz // Only auto-fetch when not actively starting a quiz
  })
  
  // Mutations
  const { mutate: startQuiz, isPending: isStarting } = useStartQuiz(quiz.id)
  const { mutate: submitAnswer, isPending: isSubmittingAnswer } = useSubmitAnswer(quiz.id)
  const { mutate: completeQuiz, isPending: isCompleting } = useCompleteQuiz(quiz.id)
  
  // Update quiz when data changes from the query
  useEffect(() => {
    if (quizResponse?.data) {
      setQuiz(quizResponse.data)
    }
  }, [quizResponse])
  
  // Initialize answers state from quiz data if available
  useEffect(() => {
    if (quiz.status === 'in_progress' && quiz.answers) {
      const initialAnswers: Record<string, string> = {}
      
      // If quiz has answers from a previous session, populate them
      Object.entries(quiz.answers).forEach(([questionId, answerData]) => {
        initialAnswers[questionId] = answerData.selected_option
      })
      
      if (Object.keys(initialAnswers).length > 0) {
        setAnswers(prev => ({...prev, ...initialAnswers}))
      }
    }
  }, [quiz.status, quiz.answers])
  
  // Set up timer when quiz starts
  useEffect(() => {
    if (quiz.status === 'in_progress' && quiz.started_at) {
      const startTime = new Date(quiz.started_at).getTime()
      const durationMs = quiz.duration * 60 * 1000
      const endTime = startTime + durationMs
      
      const updateTimer = () => {
        const now = Date.now()
        const remaining = endTime - now
        
        if (remaining <= 0) {
          setTimeRemaining(0)
          
          // Time's up - auto submit the quiz
          if (!isAutoSubmitting) {
            setIsAutoSubmitting(true)
            toast.warning("Time's up! Submitting your quiz...", {
              duration: 5000,
              position: "top-center",
            })
            
            // Schedule auto-submit with a small delay to allow last answer to be saved
            if (autoSubmitTimeoutRef.current) {
              clearTimeout(autoSubmitTimeoutRef.current)
            }
            
            autoSubmitTimeoutRef.current = setTimeout(() => {
              handleQuizSubmit()
            }, 2000)
          }
          
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        } else {
          setTimeRemaining(remaining)
          // Set warning at 20% time remaining
          setIsTimeWarning(remaining < durationMs * 0.2)
        }
      }
      
      // Initial update
      updateTimer()
      
      // Set interval for timer
      timerRef.current = setInterval(updateTimer, 1000)
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        if (autoSubmitTimeoutRef.current) {
          clearTimeout(autoSubmitTimeoutRef.current)
        }
      }
    }
  }, [quiz.status, quiz.started_at, quiz.duration])
  
  // Start the quiz if it's pending
  const handleStartQuiz = () => {
    setIsStartingQuiz(true) // Set starting state to true
    
    startQuiz(undefined, {
      onSuccess: (response) => {
        if (response.data) {
          // Directly set the quiz with the response data
          setQuiz(response.data)
          setQuestionStartTime(Date.now())
          toast.success('Quiz started!')
          
          // Manually refetch the quiz data to ensure we have the latest version
          refetch().then(() => {
            setIsStartingQuiz(false) // Reset starting state
          })
        } else {
          toast.error(response.message || 'Failed to start quiz')
          setIsStartingQuiz(false)
        }
      },
      onError: () => {
        toast.error('Failed to start quiz')
        setIsStartingQuiz(false)
      }
    })
  }
  
  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    if (quiz.status !== 'in_progress' || !quiz.questions?.[currentQuestionIndex]) return
    
    const questionId = quiz.questions[currentQuestionIndex].id
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    // Add selection animation
    setSelectionAnimation(value)
    setTimeout(() => setSelectionAnimation(null), 300)
  }
  
  // Submit answer for current question
  const saveCurrentAnswer = async () => {
    if (quiz.status !== 'in_progress') return
    
    const currentQuestion = quiz.questions[currentQuestionIndex]
    if (!currentQuestion) return
    
    const selectedOption = answers[currentQuestion.id]
    if (!selectedOption) return
    
    const now = Date.now()
    const timeTaken = Math.floor((now - questionStartTime) / 1000) // Time in seconds
    
    setIsSubmitting(true)
    
    console.log("Submitting answer:", {
      quiz_question_id: currentQuestion.id,
      selected_option: selectedOption,
      time_taken: timeTaken
    })
    
    submitAnswer({
      quiz_question_id: currentQuestion.id,
      selected_option: selectedOption,
      time_taken: timeTaken
    }, {
      onSuccess: (response) => {
        console.log("Answer submission response:", response)
        // Don't do anything special on success
      },
      onError: (error) => {
        console.error("Failed to submit answer:", error)
        toast.error("Failed to save your answer. Please try again.")
      },
      onSettled: () => {
        setIsSubmitting(false)
      }
    })
  }
  
  // Go to the next question
  const handleNextQuestion = async () => {
    await saveCurrentAnswer()
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuestionStartTime(Date.now())
    }
  }
  
  // Go to the previous question
  const handlePreviousQuestion = async () => {
    await saveCurrentAnswer()
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setQuestionStartTime(Date.now())
    }
  }
  
  // Flag or unflag the current question
  const toggleFlaggedQuestion = () => {
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev)
      if (newFlagged.has(currentQuestionIndex)) {
        newFlagged.delete(currentQuestionIndex)
      } else {
        newFlagged.add(currentQuestionIndex)
      }
      return newFlagged
    })
  }
  
  // Navigate to a specific question
  const goToQuestion = async (index: number) => {
    await saveCurrentAnswer()
    setCurrentQuestionIndex(index)
    setQuestionStartTime(Date.now())
  }
  
  // Submit the entire quiz
  const handleQuizSubmit = async () => {
    // Save the current answer first
    if (!isAutoSubmitting) {
      await saveCurrentAnswer()
    }
    
    // Prevent multiple submissions
    if (isCompleting) return
    
    // Submit the quiz
    completeQuiz(undefined, {
      onSuccess: (response) => {
        if (response.data) {
          router.push(`/dashboard/quizzes/${quiz.id}/results`)
          toast.success('Quiz completed successfully!')
        } else if (response.error?.detail?.includes('incomplete')) {
          // If there are unanswered questions
          toast.error('Please answer all questions before submitting')
          setIsAutoSubmitting(false)
        } else {
          toast.error(response.message || 'Failed to complete quiz')
          setIsAutoSubmitting(false)
        }
      },
      onError: () => {
        toast.error('Failed to complete quiz')
        setIsAutoSubmitting(false)
      }
    })
  }
  
  // Format time remaining
  const formatTimeRemaining = (ms: number | null) => {
    if (ms === null) return '--:--'
    
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  // Get current question
  const currentQuestion = quiz.questions?.[currentQuestionIndex]
  
  // Calculate progress and status info
  const allQuestionsAnswered = quiz.questions && 
    quiz.questions.every(q => !!answers[q.id])
  
  const answeredCount = Object.keys(answers).length
  const progressPercentage = quiz.questions?.length > 0 
    ? (answeredCount / quiz.questions.length) * 100 
    : 0
  
  // Filter answered and unanswered questions
  const answeredQuestions = quiz.questions ? 
    quiz.questions.filter(q => !!answers[q.id]).map(q => q.id) : []
  
  const unansweredQuestions = quiz.questions ? 
    quiz.questions.filter(q => !answers[q.id]).map(q => q.id) : []
  
  // Show a more detailed loading state while quiz is starting
  if (isStartingQuiz || isLoadingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">{isStartingQuiz ? 'Starting quiz...' : 'Loading quiz...'}</p>
      </div>
    )
  }
  
  if (isLoadingQuiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  // Show start screen if quiz is pending
  if (quiz.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-card to-background border shadow-md overflow-hidden">
          <div className="md:grid md:grid-cols-5 items-stretch">
            <div className="md:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex flex-col justify-center">
              <div className="mb-6 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
                <p className="text-muted-foreground">{quiz.course_name}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <ListTodo className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{quiz.total_questions} Questions</div>
                    <div className="text-sm text-muted-foreground">Multiple choice format</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Timer className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{quiz.duration} Minutes</div>
                    <div className="text-sm text-muted-foreground">Timed assessment</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">60% Pass Rate</div>
                    <div className="text-sm text-muted-foreground">Benchmark for success</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-5 w-5" />
                  Quiz Instructions
                </CardTitle>
                <CardDescription>
                  Please review before starting your assessment
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 px-0">
                <div className="space-y-4">
                  <div className="border-l-2 border-primary/50 pl-4 py-1">
                    <h3 className="font-medium">Time Management</h3>
                    <p className="text-sm text-muted-foreground">The timer starts once you begin. You cannot pause once started.</p>
                  </div>
                  
                  <div className="border-l-2 border-primary/50 pl-4 py-1">
                    <h3 className="font-medium">Navigation</h3>
                    <p className="text-sm text-muted-foreground">Use the previous/next buttons to move between questions. Flag difficult questions to revisit.</p>
                  </div>
                  
                  <div className="border-l-2 border-primary/50 pl-4 py-1">
                    <h3 className="font-medium">Answering</h3>
                    <p className="text-sm text-muted-foreground">Select one correct answer for each question. Your answers are saved automatically.</p>
                  </div>
                  
                  <div className="border-l-2 border-primary/50 pl-4 py-1">
                    <h3 className="font-medium">Completion</h3>
                    <p className="text-sm text-muted-foreground">Submit when done. You'll see your results immediately after completion.</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={handleStartQuiz} 
                    disabled={isStarting} 
                    className="w-full relative overflow-hidden group"
                    size="lg"
                  >
                    {isStarting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                    )}
                    <span>{isStarting ? 'Starting Quiz...' : 'Begin Quiz'}</span>
                    <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  
  // If quiz is completed, redirect to results
  if (quiz.status === 'completed') {
    router.push(`/dashboard/quizzes/${quiz.id}/results`)
    return null
  }
  
  return (
    <>
    {
      isCompleting || isAutoSubmitting && (<LoadingOverlay />)
    }
      <div className="max-w-4xl mx-auto mb-8">
        {/* Timer and progress bar */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1">
            <Badge className="px-2 py-1">
              Question {currentQuestionIndex + 1} of {quiz.questions?.length}
            </Badge>
            {flaggedQuestions.has(currentQuestionIndex) && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-2 py-1 flex items-center gap-1">
                <Flag className="h-3 w-3" /> Flagged
              </Badge>
            )}
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
            isTimeWarning ? "bg-red-500/10 text-red-500 timer-warning" : "bg-primary/10"
          )}>
            <Clock className="h-4 w-4" />
            <span>{formatTimeRemaining(timeRemaining)}</span>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-6" />
        
        {/* Question card */}
        {currentQuestion && (
          <Card className="mb-6 shadow-sm transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium">
                <MarkdownPreview content={currentQuestion.question_text} />
              </div>
              
              <RadioGroup 
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                <div 
                  className={cn(
                    "bg-card border rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer",
                    answers[currentQuestion.id] === "A" && "bg-primary/10 border-primary/50 shadow-sm quiz-option-selected",
                    selectionAnimation === "A" && "animate-pulse-custom"
                  )}
                  onClick={() => handleAnswerSelect("A")}
                >
                  <RadioGroupItem 
                    value="A" 
                    id="option-a" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="option-a" 
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                      answers[currentQuestion.id] === "A" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>A</div>
                    <div className="flex-1">
                        <p className="leading-normal tracking-normal font-normal text-foreground/90">{convertMarkdownToPlainText(currentQuestion.options.a)}</p>
                    </div>
                  </Label>
                </div>
                
                <div 
                  className={cn(
                    "bg-card border rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer",
                    answers[currentQuestion.id] === "B" && "bg-primary/10 border-primary/50 shadow-sm quiz-option-selected",
                    selectionAnimation === "B" && "animate-pulse-custom"
                  )}
                  onClick={() => handleAnswerSelect("B")}
                >
                  <RadioGroupItem 
                    value="B" 
                    id="option-b" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="option-b" 
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                      answers[currentQuestion.id] === "B" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>B</div>
                    <div className="flex-1">
                        <p className="leading-normal tracking-normal font-normal text-foreground/90">{convertMarkdownToPlainText(currentQuestion.options.b)}</p>
                    </div>
                  </Label>
                </div>
                
                <div 
                  className={cn(
                    "bg-card border rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer",
                    answers[currentQuestion.id] === "C" && "bg-primary/10 border-primary/50 shadow-sm quiz-option-selected",
                    selectionAnimation === "C" && "animate-pulse-custom"
                  )}
                  onClick={() => handleAnswerSelect("C")}
                >
                  <RadioGroupItem 
                    value="C" 
                    id="option-c" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="option-c" 
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                      answers[currentQuestion.id] === "C" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>C</div>
                    <div className="flex-1">
                        <p className="leading-normal tracking-normal font-normal text-foreground/90">{convertMarkdownToPlainText(currentQuestion.options.c)}</p>
                    </div>
                  </Label>
                </div>
                
                <div 
                  className={cn(
                    "bg-card border rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer",
                    answers[currentQuestion.id] === "D" && "bg-primary/10 border-primary/50 shadow-sm quiz-option-selected",
                    selectionAnimation === "D" && "animate-pulse-custom"
                  )}
                  onClick={() => handleAnswerSelect("D")}
                >
                  <RadioGroupItem 
                    value="D" 
                    id="option-d" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="option-d" 
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                      answers[currentQuestion.id] === "D" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>D</div>
                    <div className="flex-1">
                      <p className="leading-normal tracking-normal font-normal text-foreground/90">{convertMarkdownToPlainText(currentQuestion.options.d)}</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant={flaggedQuestions.has(currentQuestionIndex) ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFlaggedQuestion}
                  className={cn(
                    flaggedQuestions.has(currentQuestionIndex) && "bg-orange-500 hover:bg-orange-600 text-white"
                  )}
                >
                  <Flag className={cn(
                    "h-4 w-4 mr-2",
                    flaggedQuestions.has(currentQuestionIndex) && "text-white"
                  )} />
                  {flaggedQuestions.has(currentQuestionIndex) ? "Unflag" : "Flag"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={isSubmitting}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowCompleteDialog(true)}
                    disabled={isSubmitting || isCompleting || isAutoSubmitting}
                    variant={allQuestionsAnswered ? "default" : "secondary"}
                  >
                    {isCompleting || isAutoSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {/* Submitting... */}
                      </>
                    ) : (
                      'Submit Quiz'
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
        
        {/* Question navigation */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="font-medium mb-3">Question Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {quiz.questions?.map((question, index) => {
              const questionId = question.id
              const isAnswered = !!answers[questionId]
              const isCurrent = index === currentQuestionIndex
              const isFlagged = flaggedQuestions.has(index)
              
              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "transition-all relative",
                    isCurrent && "ring-2 ring-primary/50 scale-110",
                    isFlagged && !isCurrent && "ring-2 ring-orange-500/50",
                    isAnswered && !isCurrent && "bg-primary/10",
                    !isAnswered && !isCurrent && "bg-transparent",
                    isFlagged && "after:content-[''] after:absolute after:top-0 after:right-0 after:w-2 after:h-2 after:bg-orange-500 after:rounded-full"
                  )}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </Button>
              )
            })}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-primary/10 border"></div>
              <span>Answered ({answeredQuestions.length})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded border"></div>
              <span>Unanswered ({unansweredQuestions.length})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded ring-2 ring-orange-500/50 border"></div>
              <span>Flagged ({flaggedQuestions.size})</span>
            </div>
            
            {allQuestionsAnswered ? (
              <Button 
                size="sm" 
                variant="outline"
                className="ml-auto bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/30"
                onClick={() => setShowCompleteDialog(true)}
                disabled={isCompleting || isAutoSubmitting}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Ready to Submit
              </Button>
            ) : (
              <Badge variant="outline" className="ml-auto flex items-center gap-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
                <AlertTriangle className="h-3 w-3" />
                {unansweredQuestions.length} questions unanswered
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Confirmation Dialog */}
      <DynamicModal open={showCompleteDialog} setOpen={setShowCompleteDialog} title="Submit Quiz?">
        <div className='p-4 flex flex-col gap-y-4'>
          <div>
            <div>
              You are about to submit your quiz. Make sure you have reviewed all of your answers.
              
              {!allQuestionsAnswered && (
                <div className="mt-2 flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    Warning: You have {unansweredQuestions.length} unanswered questions.
                  </span>
                </div>
              )}
            </div>
          </div>
          <footer>
            <DialogClose disabled={isCompleting}>Cancel</DialogClose>
            <Button 
              onClick={handleQuizSubmit}
              disabled={isCompleting || isAutoSubmitting}
              className={cn(
                isCompleting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isCompleting || isAutoSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : 'Submit Quiz'}
            </Button>
          </footer>
        </div>
      </DynamicModal>
    </>
  )
}
