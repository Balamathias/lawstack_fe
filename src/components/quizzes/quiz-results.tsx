'use client'

import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  BarChart, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Brain,
  Home,
  RotateCcw,
  AlertTriangle
} from 'lucide-react'
import { Quiz, QuizQuestion } from '@/@types/db'
import { StackResponse } from '@/@types/generics'
import { useQuiz, useCreateQuiz } from '@/services/client/quiz'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import MarkdownPreview from '../markdown-preview'

interface QuizResultsProps {
  initialQuiz: Quiz
}

export default function QuizResults({ initialQuiz }: QuizResultsProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  // Get the latest quiz data
  const { data: quizResponse, isLoading } = useQuiz(initialQuiz.id)
  
  // For creating a new quiz with the same settings
  const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz()

  const quiz = quizResponse?.data || initialQuiz
  
  // Make sure the quiz is completed
  if (!quiz || quiz.status !== 'completed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results Not Available</CardTitle>
          <CardDescription>
            This quiz has not been completed yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please complete the quiz to view your results.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}>
            Go Back to Quiz
          </Button>
        </CardFooter>
      </Card>
    )
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
          toast.success('New quiz created!')
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
        message: "Excellent! You have a strong grasp of the material.",
        icon: <Trophy className="h-8 w-8 text-green-500" />
      }
    } else if (score >= 70) {
      return {
        color: "text-green-500",
        message: "Very good! Keep up the good work.",
        icon: <Trophy className="h-8 w-8 text-green-500" />
      }
    } else if (score >= 60) {
      return {
        color: "text-amber-500",
        message: "Good job! You're on the right track.",
        icon: <Trophy className="h-8 w-8 text-amber-500" />
      }
    } else if (score >= 50) {
      return {
        color: "text-amber-500",
        message: "You passed! Try focusing on the areas you missed.",
        icon: <AlertTriangle className="h-8 w-8 text-amber-500" />
      }
    } else {
      return {
        color: "text-red-500",
        message: "You didn't pass. Review the topics and try again.",
        icon: <AlertTriangle className="h-8 w-8 text-red-500" />
      }
    }
  }
  
  const scoreInfo = getScoreInfo(score)
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <>
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        {/* Results Summary Card */}
        <Card className="overflow-hidden border shadow-md">
          <div className="bg-gradient-to-r from-primary/5 to-transparent p-6">
            <CardHeader className="p-0">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">{quiz.title} - Results</CardTitle>
                  <CardDescription>{quiz.course_name}</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-muted-foreground">
                    Completed {quiz.completed_at && format(new Date(quiz.completed_at), 'PPP')}
                  </div>
                </div>
              </div>
            </CardHeader>
          </div>
          <CardContent className="space-y-6 pt-6">
            {/* Score */}
            <div className="flex flex-col items-center pb-4">
              <div className={cn(
                "text-4xl font-bold flex items-center gap-2",
                scoreInfo.color
              )}>
                {scoreInfo.icon}
                {score}%
              </div>
              <div className="text-muted-foreground mt-1 text-center max-w-md">
                {scoreInfo.message}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {correctAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Correct
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-red-500 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      {wrongAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Incorrect
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {totalTime ? formatTime(totalTime) : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Time
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Score Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span className="font-medium">{score}%</span>
              </div>
              <Progress 
                value={score} 
                className="h-2" 
                // indicatorClassName={cn(
                //   score >= 60 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                // )}
              />
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Review Questions
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex gap-2">
              <BarChart className="h-4 w-4" />
              Performance Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="review" className="space-y-4 pt-4">
            <Card className="border shadow-sm transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg font-medium">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </CardTitle>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                    isCorrect 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                  )}>
                    {isCorrect 
                      ? <><CheckCircle className="h-3 w-3" /> Correct</> 
                      : <><XCircle className="h-3 w-3" /> Incorrect</>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-lg mb-4">
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
                      {currentQuestion.correct_answer === "A" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {userAnswer?.selected_option === "A" && currentQuestion.correct_answer !== "A" && <XCircle className="h-4 w-4 text-red-500" />}
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
                      {currentQuestion.correct_answer === "B" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {userAnswer?.selected_option === "B" && currentQuestion.correct_answer !== "B" && <XCircle className="h-4 w-4 text-red-500" />}
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
                      {currentQuestion.correct_answer === "C" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {userAnswer?.selected_option === "C" && currentQuestion.correct_answer !== "C" && <XCircle className="h-4 w-4 text-red-500" />}
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
                      {currentQuestion.correct_answer === "D" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {userAnswer?.selected_option === "D" && currentQuestion.correct_answer !== "D" && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                </div>
                
                {/* Explanation */}
                {currentQuestion.explanation && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Explanation
                    </h4>
                    <div className="text-sm">
                      <MarkdownPreview content={currentQuestion.explanation} />
                    </div>
                  </div>
                )}
                
                {/* Your answer and time */}
                <div className="mt-4 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
                  <div>
                    Your answer: <span className={cn(
                      "font-medium",
                      isCorrect ? "text-green-500" : "text-red-500"
                    )}>{userAnswer?.selected_option || 'Not answered'}</span>
                  </div>
                  <div>
                    Correct answer: <span className="font-medium text-green-500">{currentQuestion.correct_answer}</span>
                  </div>
                  <div>
                    Time spent: <span className="font-medium">{userAnswer?.time_taken ? formatTime(userAnswer.time_taken) : 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Question Navigation */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-3">Question Navigator</h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {quiz.questions.map((_, index) => {
                  const q = quiz.questions[index]
                  const qAnswer = quiz.answers?.[q.id]
                  const isCorrect = qAnswer?.is_correct
                  const isCurrent = index === currentQuestionIndex
                  
                  return (
                    <Button
                      key={index}
                      variant={isCurrent ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "transition-all duration-200",
                        isCurrent && "scale-110",
                        !isCurrent && isCorrect && "bg-green-500/10 text-green-500 border-green-500/20",
                        !isCurrent && !isCorrect && qAnswer && "bg-red-500/10 text-red-500 border-red-500/20"
                      )}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  )
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>Detailed analysis of your quiz performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Stats */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Time Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Time</div>
                      <div className="text-xl font-semibold">
                        {totalTime ? formatTime(totalTime) : 'N/A'}
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg. Time per Question</div>
                      <div className="text-xl font-semibold">
                        {avgTimePerQuestion ? formatTime(avgTimePerQuestion) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Correct/Incorrect Distribution */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Answer Distribution</h3>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{width: `${(correctAnswers / totalQuestions) * 100}%`}}
                    />
                    <div 
                      className="bg-red-500 h-full" 
                      style={{width: `${(wrongAnswers / totalQuestions) * 100}%`}}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>{correctAnswers} Correct ({Math.round((correctAnswers / totalQuestions) * 100)}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>{wrongAnswers} Incorrect ({Math.round((wrongAnswers / totalQuestions) * 100)}%)</span>
                    </div>
                  </div>
                </div>
                
                {/* Question-by-Question Breakdown */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Question-by-Question Breakdown</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {quiz.questions.map((question, index) => {
                      const answer = quiz.answers?.[question.id]
                      return (
                        <div 
                          key={question.id} 
                          className={cn(
                            "p-3 rounded-lg border flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors",
                            answer?.is_correct ? "border-green-500/20" : "border-red-500/20"
                          )}
                          onClick={() => setCurrentQuestionIndex(index)}
                        >
                          <div className="flex-shrink-0">
                            {answer?.is_correct ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Question {index + 1}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {question.question_text.replace(/[#*_`]/g, '')} {/* Remove markdown formatting for truncated preview */}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-xs text-muted-foreground">
                            {answer?.time_taken ? formatTime(answer.time_taken) : 'N/A'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
