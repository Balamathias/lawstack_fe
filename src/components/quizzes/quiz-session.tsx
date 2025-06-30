'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Quiz, QuizQuestion } from '@/@types/db'
import { useQuiz, useStartQuiz, useSubmitAnswer, useCompleteQuiz } from '@/services/client/quiz'
import { 
  Clock, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, XCircle, Flag,
  Brain, BookOpen, Timer, ListTodo, Award, RefreshCw, ChevronRight, GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn, convertMarkdownToPlainText } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { useRouter } from 'nextjs-toploader/app'
import Loader from '@/components/loader'
import DynamicModal from '../dynamic-modal'
import MarkdownPreview from '../markdown-preview'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'

interface QuizSessionProps {
  initialQuiz: Quiz
}

export default function QuizSession({ initialQuiz }: QuizSessionProps) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTimeWarning, setIsTimeWarning] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [selectionAnimation, setSelectionAnimation] = useState<string | null>(null)
  const [isStartingQuiz, setIsStartingQuiz] = useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  
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
      
      if (Object.keys(initialAnswers)?.length > 0) {
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
      
      // Only set up timer if end time is in the future
      const now = Date.now()
      if (endTime <= now) {
        // Quiz should have already ended - don't set up the timer
        setTimeRemaining(0)
        return;
      }
      
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
  }, [quiz.status, quiz.started_at, quiz.duration, isAutoSubmitting])
  
  // Modify the swipe handlers with higher threshold and debounce
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentQuestionIndex < quiz.questions?.length - 1) {
        setSwipeDirection('left')
        setTimeout(() => {
          handleNextQuestion()
          setSwipeDirection(null)
        }, 50)
      }
    },
    onSwipedRight: () => {
      if (currentQuestionIndex > 0) {
        setSwipeDirection('right')
        setTimeout(() => {
          handlePreviousQuestion()
          setSwipeDirection(null)
        }, 50)
      }
    },
    // threshold: 50,
    trackTouch: true,
    // preventDefaultTouchmoveEvent: true,
    delta: 100,
    // minVelocity: 0.3,
    trackMouse: false
  })
  
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
    
    if (currentQuestionIndex < quiz.questions?.length - 1) {
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
  
  const answeredCount = Object.keys(answers)?.length
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <div className="rounded-full bg-primary/10 p-6">
              <Timer className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-medium">{isStartingQuiz ? 'Starting your quiz...' : 'Loading quiz...'}</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            {isStartingQuiz 
              ? 'Preparing your questions. This will just take a moment.' 
              : 'Retrieving your quiz data. Please wait.'}
          </p>
        </div>
      </div>
    )
  }
  
  // Show start screen if quiz is pending
  if (quiz.status === 'pending') {
    return (
      <div className="max-w-7xl mx-auto px-2.5 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden">
            <div className="relative">
              {/* Subtle animated background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] [background-size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
              </div>
              
              <div className="relative z-10 lg:grid lg:grid-cols-12 min-h-[500px]">
                {/* Left Panel - Quiz Overview */}
                <div className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/5 to-background/80 backdrop-blur-sm border-r p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        {quiz.title}
                      </h1>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-base font-medium">{quiz.course_name}</span>
                      </div>
                    </div>
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                      <motion.div 
                        className="group p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20 transition-colors">
                            <ListTodo className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{quiz.total_questions} Questions</div>
                            <div className="text-sm text-muted-foreground">Multiple choice format</div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="group p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20 transition-colors">
                            <Timer className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{quiz.duration} Minutes</div>
                            <div className="text-sm text-muted-foreground">Timed assessment</div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="group p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">60% to Pass</div>
                            <div className="text-sm text-muted-foreground">Success benchmark</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel - Instructions */}
                <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="max-w-2xl">
                    <CardHeader className="px-0 pt-0 pb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                        <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
                          Instructions
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl lg:text-3xl font-bold mb-3">
                        Ready to Test Your Knowledge?
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground leading-relaxed">
                        Please review these important guidelines before starting your assessment
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-0 space-y-6">
                      <div className="grid gap-4">
                        {[
                          {
                            icon: Clock,
                            title: "Time Management",
                            description: "Timer starts immediately when you begin. You cannot pause or restart once started.",
                            color: "text-red-600 bg-red-500/10"
                          },
                          {
                            icon: ChevronRight,
                            title: "Navigation",
                            description: "Move between questions using buttons or swipe gestures on mobile devices.",
                            color: "text-blue-600 bg-blue-500/10"
                          },
                          {
                            icon: CheckCircle,
                            title: "Answer Selection",
                            description: "Choose one correct answer per question. All answers are automatically saved.",
                            color: "text-green-600 bg-green-500/10"
                          },
                          {
                            icon: Flag,
                            title: "Submission",
                            description: "Review your answers and submit when complete. Results are shown immediately.",
                            color: "text-purple-600 bg-purple-500/10"
                          }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                            className="group flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-300"
                          >
                            <div className={cn("p-2.5 rounded-lg shrink-0 transition-all duration-300 group-hover:scale-110", item.color)}>
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.div 
                        className="pt-6 border-t border-border/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <Button 
                          onClick={handleStartQuiz} 
                          disabled={isStarting} 
                          className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                          size="lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          {isStarting ? (
                            <>
                              <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                              <span className="font-semibold">Initializing Quiz...</span>
                            </>
                          ) : (
                            <>
                              <Brain className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                              <span className="font-semibold">Begin Assessment</span>
                              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                        
                        <p className="text-xs text-muted-foreground text-center mt-3">
                          By starting this quiz, you acknowledge that you have read and understood the instructions above.
                        </p>
                      </motion.div>
                    </CardContent>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }
  
  if (quiz.status === 'completed') {
    router.push(`/dashboard/quizzes/${quiz.id}/results`)
    return null
  }
  
  return (
    <>
      {(isCompleting || isAutoSubmitting) && (<Loader variant="spin" />)}
      
      <div className="max-w-7xl mx-auto mb-20 sm:mb-8 ">
        {/* Header section with timer and progress */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pt-2 pb-4">
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <div className="flex gap-1 items-center">
                <Badge variant="outline" className="px-2 py-1 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Question </span>{currentQuestionIndex + 1} / {quiz.questions?.length}
                </Badge>
                {flaggedQuestions.has(currentQuestionIndex) && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-2 py-1 flex items-center gap-1 text-xs sm:text-sm">
                    <Flag className="h-3 w-3" /> Flagged
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center mt-1 sm:mt-0">
                <CheckCircle className="h-3 w-3 mr-1.5 text-green-500" /> 
                <span>{answeredCount} of {quiz.questions?.length} answered</span>
              </div>
            </div>
            
            <div className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-mono font-medium shadow-sm",
              isTimeWarning 
                ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20 timer-warning" 
                : "bg-primary/10 border border-primary/20"
            )}>
              <Timer className="h-4 w-4" />
              <span>{formatTimeRemaining(timeRemaining)}</span>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-1.5" />
        </div>
        
        {/* Question content area with touch support */}
        <motion.div 
          {...swipeHandlers}
          animate={{ 
            x: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0,
            opacity: swipeDirection !== null ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {currentQuestion && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6 border shadow-sm hover:shadow-md transition-all duration-300 bg-background">
                  <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
                    <CardTitle className="text-lg sm:text-xl">
                      <MarkdownPreview content={currentQuestion.question_text} className="text-lg sm:text-xl" />
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 space-y-4">
                    <RadioGroup 
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={handleAnswerSelect}
                      className="space-y-3"
                    >
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <motion.div
                          key={option}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "relative rounded-lg border cursor-pointer transition-all overflow-hidden",
                            answers[currentQuestion.id] === option 
                              ? "bg-primary/10 border-primary/50 shadow-sm" 
                              : "bg-card hover:bg-muted/40 hover:border-muted-foreground/20"
                          )}
                          onClick={() => handleAnswerSelect(option)}
                        >
                          {answers[currentQuestion.id] === option && (
                            <motion.div 
                              className="absolute inset-0 bg-primary/5"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          
                          <div className="flex items-start p-4">
                            <div className="flex-shrink-0 mr-3">
                              <div className={cn(
                                "flex items-center justify-center rounded-full w-7 h-7 text-sm font-semibold border transition-colors",
                                answers[currentQuestion.id] === option
                                  ? "bg-primary text-primary-foreground border-primary" 
                                  : "bg-muted border-input"
                              )}>
                                {option}
                              </div>
                            </div>
                            
                            <div className="flex-1 text-base">
                              <RadioGroupItem 
                                value={option} 
                                id={`option-${option}`} 
                                className="sr-only" 
                              />
                              <Label 
                                htmlFor={`option-${option}`} 
                                className="cursor-pointer font-normal"
                              >
                                {convertMarkdownToPlainText(currentQuestion.options[option.toLowerCase() as keyof typeof currentQuestion.options])}
                              </Label>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  
                  <CardFooter className="px-4 sm:px-6 py-4 flex flex-wrap sm:flex-nowrap gap-2 justify-between border-t bg-muted/20">
                    <Button
                      variant={flaggedQuestions.has(currentQuestionIndex) ? "default" : "outline"}
                      size="sm"
                      onClick={toggleFlaggedQuestion}
                      className={cn(
                        "min-w-[100px]",
                        flaggedQuestions.has(currentQuestionIndex) && "bg-orange-500 hover:bg-orange-600 text-white"
                      )}
                    >
                      <Flag className={cn(
                        "h-4 w-4 mr-2",
                        flaggedQuestions.has(currentQuestionIndex) && "text-white"
                      )} />
                      {flaggedQuestions.has(currentQuestionIndex) ? "Unflag" : "Flag"}
                    </Button>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0 || isSubmitting}
                        className="flex-1 sm:flex-initial sm:min-w-[100px]"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <Button
                          onClick={handleNextQuestion}
                          disabled={isSubmitting}
                          className="flex-1 sm:flex-initial sm:min-w-[100px]"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setShowCompleteDialog(true)}
                          disabled={isSubmitting || isCompleting || isAutoSubmitting}
                          variant={allQuestionsAnswered ? "default" : "secondary"}
                          className="flex-1 sm:flex-initial sm:min-w-[120px]"
                        >
                          {isCompleting || isAutoSubmitting ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>Submit Quiz</>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
        
        {/* Question navigation grid */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="font-medium mb-3 text-sm sm:text-base flex items-center gap-2">
            <ListTodo className="h-4 w-4" /> Question Navigation
          </h3>
          
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 sm:gap-2">
            {quiz.questions?.map((question, index) => {
              const questionId = question.id
              const isAnswered = !!answers[questionId]
              const isCurrent = index === currentQuestionIndex
              const isFlagged = flaggedQuestions.has(index)
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 transition-all relative",
                    isCurrent && "ring-2 ring-primary shadow-sm",
                    isAnswered && !isCurrent && "bg-primary/10 border-primary/20",
                    !isAnswered && !isCurrent && "bg-muted/30",
                    isFlagged && "ring-1 ring-orange-500/50"
                  )}
                  onClick={() => goToQuestion(index)}
                >
                  <span className="text-xs sm:text-sm">{index + 1}</span>
                  {isFlagged && (
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-orange-500"></span>
                  )}
                </Button>
              )
            })}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary/10 border border-primary/20"></div>
              <span>Answered</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-muted/30 border"></div>
              <span>Unanswered</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm ring-1 ring-orange-500/50 border"></div>
              <span>Flagged</span>
            </div>
            
            {allQuestionsAnswered ? (
              <Button 
                size="sm" 
                variant="outline"
                className="ml-auto bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/30"
                onClick={() => setShowCompleteDialog(true)}
                disabled={isCompleting || isAutoSubmitting}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Ready to Submit
              </Button>
            ) : (
              <Badge variant="outline" className="ml-auto flex items-center gap-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
                <AlertTriangle className="h-3 w-3" />
                {unansweredQuestions?.length} unanswered
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile fixed navigation bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-sm shadow-lg p-3 z-20">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            className="w-16"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center">
            {allQuestionsAnswered ? (
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/30"
                onClick={() => setShowCompleteDialog(true)}
                disabled={isCompleting || isAutoSubmitting}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Complete
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">
                {answeredCount}/{quiz.questions?.length} answered
              </span>
            )}
          </div>
          
          {currentQuestionIndex < quiz.questions?.length - 1 ? (
            <Button
              size="sm"
              onClick={handleNextQuestion}
              disabled={isSubmitting}
              className="w-16"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowCompleteDialog(true)}
              disabled={isSubmitting || isCompleting || isAutoSubmitting}
              variant={allQuestionsAnswered ? "default" : "secondary"}
              className="w-16"
            >
              <Flag className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Submit Confirmation Dialog */}
      <DynamicModal 
        open={showCompleteDialog} 
        setOpen={setShowCompleteDialog} 
        title="Submit Quiz?"
      >
        <div className='p-4 flex flex-col gap-y-4'>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You are about to submit your quiz. Once submitted, you won't be able to make any changes.
            </p>
            
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span>Questions Answered:</span> 
                <Badge className={allQuestionsAnswered ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}>
                  {answeredCount}/{quiz.questions?.length}
                </Badge>
              </div>
              
              {timeRemaining !== null && (
                <div className="flex justify-between items-center">
                  <span>Time Remaining:</span>
                  <Badge variant="outline" className="font-mono">{formatTimeRemaining(timeRemaining)}</Badge>
                </div>
              )}
            </div>
            
            {!allQuestionsAnswered && (
              <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>
                  You have {unansweredQuestions?.length} unanswered {unansweredQuestions?.length === 1 ? 'question' : 'questions'}.
                </span>
              </div>
            )}
          </div>
          
          <footer className='flex items-center justify-end gap-3 pt-2'>
            <Button 
              variant="outline" 
              onClick={() => setShowCompleteDialog(false)}
              disabled={isCompleting}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleQuizSubmit}
              disabled={isCompleting || isAutoSubmitting}
              className="min-w-[100px]"
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
