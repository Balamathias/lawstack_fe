'use client'

import React, { useState, useRef } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  BarChart2, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Brain,
  Home,
  RotateCcw,
  AlertTriangle,
  PieChart,
  Timer,
  Award,
  Sparkles
} from 'lucide-react'
import { Quiz } from '@/@types/db'
import { useQuiz, useCreateQuiz } from '@/services/client/quiz'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import MarkdownPreview from '../markdown-preview'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizResultsProps {
  initialQuiz: Quiz
}

export default function QuizResults({ initialQuiz }: QuizResultsProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const touchStartXRef = useRef<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  
  // Get the latest quiz data
  const { data: quizResponse, isLoading } = useQuiz(initialQuiz.id, {})
  
  // For creating a new quiz with the same settings
  const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz()

  const quiz = quizResponse?.data || initialQuiz
  
  // Make sure the quiz is completed
  if (!quiz || quiz.status !== 'completed') {
    return (
      <div className="max-w-md mx-auto my-16 p-6">
        <Card className="border-amber-500/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              Results Not Available
            </CardTitle>
            <CardDescription>
              This quiz has not been completed yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Please complete the quiz to view your results.</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push(`/dashboard/quizzes/${quiz?.id}`)}
              className="w-full"
            >
              Go Back to Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
    
    // Minimum swipe distance (px)
    const minSwipeDistance = 50
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left, go to next question
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setSwipeDirection('left')
          setTimeout(() => {
            goToNextQuestion()
            setSwipeDirection(null)
          }, 150)
        }
      } else {
        // Swiped right, go to previous question
        if (currentQuestionIndex > 0) {
          setSwipeDirection('right')
          setTimeout(() => {
            goToPreviousQuestion()
            setSwipeDirection(null)
          }, 150)
        }
      }
    }
    
    touchStartXRef.current = null
  }
  
  // Current question from the list
  const currentQuestion = quiz.questions[currentQuestionIndex]
  const userAnswer = quiz.answers?.[currentQuestion.id]
  const isCorrect = userAnswer?.is_correct
  
  // Calculate statistic data
  const totalQuestions = quiz.total_questions
  const correctAnswers = quiz.correct_answers
  const wrongAnswers = totalQuestions - correctAnswers
  const score = quiz.score

  // Format time
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }
  
  // Get total time spent
  const totalTime = quiz.completion_time 
    ? Math.floor(quiz.completion_time) 
    : null
  
  // Average time per question
  const avgTimePerQuestion = totalTime && quiz.total_questions > 0
    ? Math.floor(totalTime / quiz.total_questions)
    : null
  
  // Handle navigation between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Function to retry with the same settings
  const handleRetryQuiz = () => {
    createQuiz({
      title: `${quiz.title} (Retry)`,
      course: quiz.course,
      total_questions: quiz.total_questions,
      duration: quiz.duration
    }, {
      onSuccess: (response) => {
        if (response.data) {
          toast.success('New quiz created!', {
            description: 'Get ready to try again!'
          })
          router.push(`/dashboard/quizzes/${response.data.id}`)
        } else {
          toast.error(response.message || 'Failed to create quiz')
        }
      },
      onError: () => {
        toast.error('Failed to create quiz')
      }
    })
  }
  
  // Get score color and message
  const getScoreInfo = (score: number) => {
    if (score >= 80) {
      return {
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        message: "Excellent! You have a strong grasp of the material.",
        icon: <Trophy className="h-8 w-8 text-green-500" />,
        grade: "A"
      }
    } else if (score >= 70) {
      return {
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        message: "Very good! Keep up the good work.",
        icon: <Award className="h-8 w-8 text-green-500" />,
        grade: "B"
      }
    } else if (score >= 60) {
      return {
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        message: "Good job! You're on the right track.",
        icon: <CheckCircle className="h-8 w-8 text-amber-500" />,
        grade: "C"
      }
    } else if (score >= 50) {
      return {
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        message: "You passed! Try focusing on the areas you missed.",
        icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
        grade: "D"
      }
    } else {
      return {
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        message: "You didn't pass. Review the topics and try again.",
        icon: <XCircle className="h-8 w-8 text-red-500" />,
        grade: "F"
      }
    }
  }
  
  const scoreInfo = getScoreInfo(score)
  
  // Get the percentage breakdown of correct vs incorrect
  const correctPercentage = (correctAnswers / totalQuestions) * 100
  const incorrectPercentage = (wrongAnswers / totalQuestions) * 100
  
  // Most challenging questions - find the ones that took the longest time
  const challengingQuestions = [...quiz.questions]
    .map((q, index) => ({
      index,
      question: q,
      answer: quiz.answers?.[q.id],
      time: quiz.answers?.[q.id]?.time_taken || 0
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 3) // Top 3 most time-consuming
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <div className="rounded-full bg-primary/10 p-6">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-medium">Loading results...</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            Retrieving your quiz performance data. Please wait.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto pb-8">
      <motion.div 
        className="flex flex-col space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Results Summary Card */}
        <Card className="overflow-hidden border shadow-lg">
          <div className={cn(
            "relative p-6",
            scoreInfo.bgColor,
            scoreInfo.borderColor,
            "bg-gradient-to-r from-card/70 to-transparent"
          )}>
            <CardHeader className="p-0">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl sm:text-3xl tracking-tight">{quiz.title} - Results</CardTitle>
                  <CardDescription className="text-base opacity-90">{quiz.course_name}</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={cn("font-normal px-2 py-1", scoreInfo.bgColor, scoreInfo.color, scoreInfo.borderColor)}>
                    {quiz.completed_at && format(new Date(quiz.completed_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </div>
          
          <CardContent className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center">
              {/* Score Circle */}
              <div className="md:col-span-1">
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <div className="relative">
                    {/* Circular progress background */}
                    <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted/20"
                      />
                      
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="440"
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (score / 100) * 440 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className={scoreInfo.color}
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={cn("text-4xl font-bold", scoreInfo.color)}>{score?.toFixed(2)}%</div>
                      <div className="text-lg font-semibold">Grade: {scoreInfo.grade}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-muted-foreground text-center max-w-xs">
                    <div className="flex items-center justify-center gap-2">
                      {scoreInfo.icon}
                      <span>{scoreInfo.message}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Stats Cards */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    custom={0}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Card className="bg-card/50 hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Correct</p>
                            <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              {correctAnswers}
                            </div>
                          </div>
                          <div className="text-green-500/20 bg-green-500/5 rounded-full p-2">
                            <CheckCircle className="h-8 w-8" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div 
                    custom={1}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Card className="bg-card/50 hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Incorrect</p>
                            <div className="text-2xl font-bold text-red-500 flex items-center gap-2">
                              <XCircle className="h-5 w-5" />
                              {wrongAnswers}
                            </div>
                          </div>
                          <div className="text-red-500/20 bg-red-500/5 rounded-full p-2">
                            <XCircle className="h-8 w-8" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div 
                    custom={2}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <Card className="bg-card/50 hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Time</p>
                            <div className="text-2xl font-bold flex items-center gap-2">
                              <Clock className="h-5 w-5" />
                              {totalTime ? formatTime(totalTime) : 'N/A'}
                            </div>
                          </div>
                          <div className="text-primary/20 bg-primary/5 rounded-full p-2">
                            <Timer className="h-8 w-8" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div 
                    custom={3}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <Card className="bg-card/50 hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Avg. Question Time</p>
                            <div className="text-2xl font-bold flex items-center gap-2">
                              <Clock className="h-5 w-5" />
                              {avgTimePerQuestion ? formatTime(avgTimePerQuestion) : 'N/A'}
                            </div>
                          </div>
                          <div className="text-primary/20 bg-primary/5 rounded-full p-2">
                            <Sparkles className="h-8 w-8" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                
                {/* Score breakdown */}
                <div className="mt-4 bg-muted/30 rounded-lg p-4 border">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Score Breakdown
                  </h3>
                  
                  <div className="h-2 rounded-full overflow-hidden mb-2 bg-muted flex">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${correctPercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${incorrectPercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-green-500">{Math.round(correctPercentage)}% Correct</span>
                    <span className="text-red-500">{Math.round(incorrectPercentage)}% Incorrect</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-wrap gap-2 justify-center border-t bg-muted/20 p-4">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={() => router.push('/dashboard/quizzes')}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            <Button 
              className="flex-1 sm:flex-none"
              onClick={handleRetryQuiz}
              disabled={isCreating}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {isCreating ? 'Creating...' : 'Retry Quiz'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Question Review */}
        <Tabs defaultValue="review" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="review" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Review Questions
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex gap-2">
              <BarChart2 className="h-4 w-4" />
              Performance Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="review" className="space-y-4 pt-2">
            <motion.div 
              onTouchStart={handleTouchStart} 
              onTouchEnd={handleTouchEnd}
              animate={{ 
                x: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0,
                opacity: swipeDirection !== null ? 0.5 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border shadow-md transition-all hover:shadow-lg">
                    <CardHeader className="pb-3 border-b">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                            {currentQuestionIndex + 1}
                          </span>
                          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                        </CardTitle>
                        <Badge 
                          className={cn(
                            "px-2 py-1 flex items-center gap-1.5 text-xs",
                            isCorrect 
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" 
                              : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                          )}
                        >
                          {isCorrect 
                            ? <><CheckCircle className="h-3 w-3" /> Correct</> 
                            : <><XCircle className="h-3 w-3" /> Incorrect</>}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4 pb-2">
                      <div className="text-lg mb-6">
                        <MarkdownPreview content={currentQuestion.question_text} />
                      </div>
                      
                      <div className="space-y-3">
                        {/* Option A */}
                        <div className={cn(
                          "p-3 rounded-lg border transition-colors",
                          currentQuestion.correct_answer === "A" && "bg-green-500/10 border-green-500/30",
                          userAnswer?.selected_option === "A" && currentQuestion.correct_answer !== "A" && "bg-red-500/10 border-red-500/30"
                        )}>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                              currentQuestion.correct_answer === "A" && "bg-green-500/20 border-green-500/30 text-green-600",
                              userAnswer?.selected_option === "A" && currentQuestion.correct_answer !== "A" && "bg-red-500/20 border-red-500/30 text-red-600"
                            )}>A</div>
                            <div className="flex-1">
                              <MarkdownPreview content={currentQuestion.options.a} />
                            </div>
                            {currentQuestion.correct_answer === "A" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                            {userAnswer?.selected_option === "A" && currentQuestion.correct_answer !== "A" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          </div>
                        </div>
                        
                        {/* Option B */}
                        <div className={cn(
                          "p-3 rounded-lg border transition-colors",
                          currentQuestion.correct_answer === "B" && "bg-green-500/10 border-green-500/30",
                          userAnswer?.selected_option === "B" && currentQuestion.correct_answer !== "B" && "bg-red-500/10 border-red-500/30"
                        )}>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                              currentQuestion.correct_answer === "B" && "bg-green-500/20 border-green-500/30 text-green-600",
                              userAnswer?.selected_option === "B" && currentQuestion.correct_answer !== "B" && "bg-red-500/20 border-red-500/30 text-red-600"
                            )}>B</div>
                            <div className="flex-1">
                              <MarkdownPreview content={currentQuestion.options.b} />
                            </div>
                            {currentQuestion.correct_answer === "B" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                            {userAnswer?.selected_option === "B" && currentQuestion.correct_answer !== "B" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          </div>
                        </div>
                        
                        {/* Option C */}
                        <div className={cn(
                          "p-3 rounded-lg border transition-colors",
                          currentQuestion.correct_answer === "C" && "bg-green-500/10 border-green-500/30",
                          userAnswer?.selected_option === "C" && currentQuestion.correct_answer !== "C" && "bg-red-500/10 border-red-500/30"
                        )}>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                              currentQuestion.correct_answer === "C" && "bg-green-500/20 border-green-500/30 text-green-600",
                              userAnswer?.selected_option === "C" && currentQuestion.correct_answer !== "C" && "bg-red-500/20 border-red-500/30 text-red-600"
                            )}>C</div>
                            <div className="flex-1">
                              <MarkdownPreview content={currentQuestion.options.c} />
                            </div>
                            {currentQuestion.correct_answer === "C" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                            {userAnswer?.selected_option === "C" && currentQuestion.correct_answer !== "C" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          </div>
                        </div>
                        
                        {/* Option D */}
                        <div className={cn(
                          "p-3 rounded-lg border transition-colors",
                          currentQuestion.correct_answer === "D" && "bg-green-500/10 border-green-500/30",
                          userAnswer?.selected_option === "D" && currentQuestion.correct_answer !== "D" && "bg-red-500/10 border-red-500/30"
                        )}>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold border",
                              currentQuestion.correct_answer === "D" && "bg-green-500/20 border-green-500/30 text-green-600",
                              userAnswer?.selected_option === "D" && currentQuestion.correct_answer !== "D" && "bg-red-500/20 border-red-500/30 text-red-600"
                            )}>D</div>
                            <div className="flex-1">
                              <MarkdownPreview content={currentQuestion.options.d} />
                            </div>
                            {currentQuestion.correct_answer === "D" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                            {userAnswer?.selected_option === "D" && currentQuestion.correct_answer !== "D" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          </div>
                        </div>
                      </div>
                      
                      {/* Explanation */}
                      {currentQuestion.explanation && (
                        <motion.div 
                          className="mt-6 p-4 rounded-lg border bg-primary/5"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <h4 className="font-medium mb-2 flex items-center gap-2 text-primary">
                            <Brain className="h-4 w-4" />
                            Explanation
                          </h4>
                          <div className="text-sm">
                            <MarkdownPreview content={currentQuestion.explanation} />
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Your answer and time */}
                      <div className="mt-6 text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-3 gap-2 bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <span>Your answer:</span> 
                          <Badge className={cn(
                            "px-2 py-0.5",
                            isCorrect 
                              ? "bg-green-500/10 text-green-600" 
                              : "bg-red-500/10 text-red-600"
                          )}>
                            {userAnswer?.selected_option || 'Not answered'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>Correct answer:</span> 
                          <Badge className="bg-green-500/10 text-green-600 px-2 py-0.5">
                            {currentQuestion.correct_answer}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>Time spent:</span> 
                          <Badge variant="outline" className="font-mono px-2 py-0.5">
                            {userAnswer?.time_taken ? formatTime(userAnswer.time_taken) : 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2 border-t mt-4">
                      <Button
                        variant="outline"
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="h-10 px-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      <div className="hidden sm:flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          Swipe to navigate
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === quiz.questions.length - 1}
                        className="h-10 px-4"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Question Navigation */}
            <div className="rounded-lg border bg-card p-4 shadow-sm mt-6">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                Question Navigator
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {quiz.questions.map((_, index) => {
                  const q = quiz.questions[index]
                  const qAnswer = quiz.answers?.[q.id]
                  const isCorrect = qAnswer?.is_correct
                  const isCurrent = index === currentQuestionIndex
                  
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "transition-all h-9 w-9 rounded-md relative",
                        isCurrent && "ring-2 ring-primary shadow-sm scale-110",
                        !isCurrent && isCorrect && "bg-green-500/10 text-green-600 border-green-500/30",
                        !isCurrent && !isCorrect && qAnswer && "bg-red-500/10 text-red-600 border-red-500/30"
                      )}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                      {!isCurrent && isCorrect && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                      {!isCurrent && !isCorrect && qAnswer && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                    </Button>
                  )
                })}
              </div>
              
              <div className="flex flex-wrap justify-end gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/30"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30"></div>
                  <span>Incorrect</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-2">
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Performance Analysis
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of your quiz performance
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Time stats visualization */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Time Management
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-muted/30 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Total Time</div>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold">
                          {totalTime ? `${Math.floor(totalTime / 60)}` : '0'}
                        </div>
                        <div className="text-xl font-medium">min</div>
                        <div className="text-3xl font-bold ml-2">
                          {totalTime ? `${totalTime % 60}` : '0'}
                        </div>
                        <div className="text-xl font-medium">sec</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Quiz duration: {quiz.duration} minutes
                      </div>
                    </div>
                    
                    <div className="p-5 bg-muted/30 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Avg. Time per Question</div>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold">
                          {avgTimePerQuestion ? `${Math.floor(avgTimePerQuestion / 60)}` : '0'}
                        </div>
                        <div className="text-xl font-medium">min</div>
                        <div className="text-3xl font-bold ml-2">
                          {avgTimePerQuestion ? `${avgTimePerQuestion % 60}` : '0'}
                        </div>
                        <div className="text-xl font-medium">sec</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {quiz.total_questions} questions total
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Most challenging questions */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Most Challenging Questions
                  </h3>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {challengingQuestions.map((item, index) => (
                      <div 
                        key={item.question.id} 
                        className={cn(
                          "p-4 rounded-lg border flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors",
                          item.answer?.is_correct ? "border-green-500/20" : "border-red-500/20"
                        )}
                        onClick={() => setCurrentQuestionIndex(item.index)}
                      >
                        <div className="flex-shrink-0 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium mb-1">Question {item.index + 1}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.question.question_text.replace(/[#*_`]/g, '')}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="font-mono">
                              Time: {formatTime(item.time)}
                            </Badge>
                            <Badge 
                              className={cn(
                                item.answer?.is_correct 
                                  ? "bg-green-500/10 text-green-600 border-green-500/30" 
                                  : "bg-red-500/10 text-red-600 border-red-500/30"
                              )}
                            >
                              {item.answer?.is_correct ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Areas to review based on incorrect answers */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Study Recommendations
                  </h3>
                  
                  <Card className="bg-amber-500/5 border-amber-500/20">
                    <CardContent className="p-4">
                      <p className="text-sm mb-3">
                        Based on your performance, we recommend reviewing these topics:
                      </p>
                      <div className="space-y-2">
                        {wrongAnswers > 0 ? (
                          quiz.questions
                            .filter(q => !quiz.answers?.[q.id]?.is_correct)
                            .map((q, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="text-amber-500 mt-0.5">•</div>
                                <div className="text-sm">{q.question_text.replace(/[#*_`]/g, '').substring(0, 100)}...</div>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Great job! You answered all questions correctly. Continue practicing to maintain your knowledge.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
