'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, BarChart3, Clock, Award, BookOpen, ChevronRight, CheckCircle, XCircle, TimerIcon } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { Quiz, QuizStatistics, Course } from '@/@types/db'
import { useQuizzes, useQuizStatistics, useCreateQuiz, useGenerateMCQuestions } from '@/services/client/quiz'
import { useCourses } from '@/services/client/courses'
import { useRouter } from 'nextjs-toploader/app'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

interface QuizDashboardProps {
  initialQuizzes: { data: Quiz[] }
  initialStats: { data: QuizStatistics | null }
  initialCourses: { data: Course[] }
}

export default function QuizDashboard({ initialQuizzes, initialStats, initialCourses }: QuizDashboardProps) {
  const router = useRouter()
  
  // States for quiz creation
  const [isCreating, setIsCreating] = useState(false)
  const [quizTitle, setQuizTitle] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [numQuestions, setNumQuestions] = useState(10)
  const [quizDuration, setQuizDuration] = useState(15)

  const [difficulty, setDifficulty] = useState('easy')
  const [semester, setSemester] = useState('1')
  
  // States for filtering
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Query hooks with initial data
  const { data: quizzesData, isLoading: loadingQuizzes } = useQuizzes()
  const { data: statsData, isLoading: loadingStats } = useQuizStatistics()
  const { data: coursesData, isLoading: loadingCourses } = useCourses()
  
  // Mutation hooks
  const createQuizMutation = useCreateQuiz()
  const generateMCQMutation = useGenerateMCQuestions()

  // Filtered quizzes
  const filteredQuizzes = React.useMemo(() => {
    if (!quizzesData?.data) return []
    
    if (statusFilter === 'all') return quizzesData.data
    return quizzesData.data.filter(quiz => quiz.status === statusFilter)
  }, [quizzesData?.data, statusFilter])
  
  // Quiz creation handler
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCourse) {
      toast.error("Course required", {
        description: "Please select a course for the quiz"
      })
      return
    }
    
    try {
      const result = await createQuizMutation.mutateAsync({
        title: quizTitle || `Law Quiz - ${new Date().toLocaleDateString()}`,
        course: selectedCourse,
        total_questions: numQuestions,
        duration: quizDuration,
        semester,
        difficulty
      })
      
      if (result.data) {
        toast.success("Quiz created!", {
          description: "Your quiz is ready to take"
        })
        
        // Reset form and close dialog
        setIsCreating(false)
        setQuizTitle('')
        setSelectedCourse('')
        
        // Navigate to the new quiz
        router.push(`/dashboard/quizzes/${result.data.id}`)
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast.error("Failed to create quiz", {
        description: "There was an error creating your quiz. Please try again."
      })
    }
  }
  
  // Generate sample chart data
  const coursePerformanceData = React.useMemo(() => {
    if (!statsData?.data?.course_performance) return []
    
    return statsData.data.course_performance.map(course => ({
      course: course.course_name,
      'Accuracy %': course.accuracy,
      'Questions': course.total_questions
    }))
  }, [statsData?.data?.course_performance])
  
  const completionTrend = React.useMemo(() => {
    if (!statsData?.data?.recent_performance) return []
    
    return statsData.data.recent_performance.map(quiz => ({
      date: quiz.completed_at ? format(new Date(quiz.completed_at), 'MMM d') : 'Unknown',
      'Score': quiz.score,
      'Questions': quiz.total_questions
    })).reverse()
  }, [statsData?.data?.recent_performance])
  
  const courseDonutData = React.useMemo(() => {
    if (!statsData?.data?.course_performance) return []
    
    return statsData.data.course_performance.map(course => ({
      name: course.course_name,
      quizzes: course.quizzes_taken
    }))
  }, [statsData?.data?.course_performance])

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  // Use this color scheme for charts
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Law Quiz Dashboard</h1>
          <p className="text-muted-foreground mt-1">Test your knowledge with Smartly inferred law quizzes from past questions.</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <PlusCircle className="h-4 w-4" />
              <span>Create Quiz</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>
                Generate an AI-powered quiz based on past questions from your selected course.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateQuiz} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title (Optional)</Label>
                  <Input
                    id="title"
                    placeholder="Law of Contract Quiz"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course" className="required">Course</Label>
                  <Select 
                    value={selectedCourse} 
                    onValueChange={setSelectedCourse}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {coursesData?.data?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="questions">Number of Questions</Label>
                    <Select 
                      value={numQuestions.toString()} 
                      onValueChange={(value) => setNumQuestions(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 questions</SelectItem>
                        <SelectItem value="10">10 questions</SelectItem>    
                        <SelectItem value="15">15 questions</SelectItem>
                        <SelectItem value="20">20 questions</SelectItem>
                        <SelectItem value="25">25 questions</SelectItem>
                        <SelectItem value="30">30 questions</SelectItem>
                        <SelectItem value="35">35 questions</SelectItem>
                        <SelectItem value="40">40 questions</SelectItem>
                        <SelectItem value="45">45 questions</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select 
                      value={quizDuration.toString()} 
                      onValueChange={(value) => setQuizDuration(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="15" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select 
                      value={difficulty} 
                      onValueChange={(value) => setDifficulty(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>    
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select 
                      value={semester} 
                      onValueChange={(value) => setSemester(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Semester..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First Semester</SelectItem>
                        <SelectItem value="2">Second Semester</SelectItem>  
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={createQuizMutation.isPending}
                >
                  {createQuizMutation.isPending ? "Creating..." : "Create Quiz"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          custom={0} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/10 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <div>
                <CardTitle className="text-lg">Completed Quizzes</CardTitle>
                <CardDescription>Total quizzes taken</CardDescription>
              </div>
              <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900">
                <CheckCircle className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="text-3xl font-bold">
                {loadingStats ? <Skeleton className="h-8 w-16" /> : statsData?.data?.quizzes_completed || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          custom={1} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/10 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div>
                <CardTitle className="text-lg">Average Score</CardTitle>
                <CardDescription>Overall accuracy</CardDescription>
              </div>
              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900">
                <Award className="h-5 w-5 text-green-700 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="text-3xl font-bold">
                {loadingStats ? 
                  <Skeleton className="h-8 w-16" /> : 
                  `${statsData?.data?.overall_accuracy?.toFixed(1) || 0}%`
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          custom={2} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/10 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
              <div>
                <CardTitle className="text-lg">Questions Answered</CardTitle>
                <CardDescription>Total responses</CardDescription>
              </div>
              <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900">
                <BookOpen className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="text-3xl font-bold">
                {loadingStats ? 
                  <Skeleton className="h-8 w-16" /> : 
                  statsData?.data?.total_questions_answered || 0
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          custom={3} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/10 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20">
              <div>
                <CardTitle className="text-lg">Correct Answers</CardTitle>
                <CardDescription>Total correct</CardDescription>
              </div>
              <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                <BarChart3 className="h-5 w-5 text-purple-700 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="text-3xl font-bold">
                {loadingStats ? 
                  <Skeleton className="h-8 w-16" /> : 
                  statsData?.data?.total_correct_answers || 0
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="quizzes">My Quizzes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quizzes" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter">Filter:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quizzes</SelectItem>
                  <SelectItem value="pending">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredQuizzes.length} quizzes
            </div>
          </div>
          
          {loadingQuizzes ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border border-border/50">
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <Card className="border-2 border-dashed bg-muted/30">
              <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <BookOpen className="h-6 w-6 text-primary/80" />
                </div>
                <h3 className="text-lg font-medium mb-1">No quizzes found</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  {statusFilter === 'all' 
                    ? "You haven't created any quizzes yet. Create your first quiz to test your knowledge!"
                    : `You don't have any quizzes with '${statusFilter}' status.`
                  }
                </p>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <Card 
                      className={`
                        overflow-hidden transition-all duration-200 hover:shadow-md
                        ${quiz.status === 'pending' ? 'border-l-4 border-l-blue-500' : ''}
                        ${quiz.status === 'in_progress' ? 'border-l-4 border-l-amber-500' : ''}
                        ${quiz.status === 'completed' ? 'border-l-4 border-l-green-500' : ''}
                        ${quiz.status === 'expired' ? 'border-l-4 border-l-gray-500' : ''}
                      `}
                    >
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="font-medium text-base sm:text-lg">
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span>{quiz.course_name}</span>
                            <span className="text-xs">•</span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              {quiz.total_questions} questions
                            </span>
                            <span className="text-xs">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {quiz.duration} min
                            </span>
                          </CardDescription>
                        </div>
                        <Badge 
                          className={`
                            capitalize
                            ${quiz.status === 'pending' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20' : ''}
                            ${quiz.status === 'in_progress' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20' : ''}
                            ${quiz.status === 'completed' ? 'bg-green-500/10 text-green-700 dark:text-green-300 hover:bg-green-500/20' : ''}
                            ${quiz.status === 'expired' ? 'bg-gray-500/10 text-gray-700 dark:text-gray-300 hover:bg-gray-500/20' : ''}
                          `}
                        >
                          {quiz.status.replace('_', ' ')}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center gap-4">
                            {quiz.status === 'completed' && (
                              <div className="flex items-center gap-1.5">
                                <div className="text-xl sm:text-2xl font-bold">
                                  {quiz.score.toFixed(0)}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ({quiz.correct_answers}/{quiz.total_questions} correct)
                                </div>
                              </div>
                            )}
                            {quiz.completed_at && (
                              <div className="text-sm text-muted-foreground">
                                Completed {format(new Date(quiz.completed_at), 'MMM d, yyyy')}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                            variant={quiz.status === 'pending' || quiz.status === 'in_progress' ? 'default' : 'outline'}
                            className="ml-auto gap-1.5"
                          >
                            {quiz.status === 'pending' && 'Start Quiz'}
                            {quiz.status === 'in_progress' && 'Continue Quiz'}
                            {quiz.status === 'completed' && 'View Results'}
                            {quiz.status === 'expired' && 'View Quiz'}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          {loadingStats ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          ) : statsData?.data?.quizzes_completed === 0 ? (
            <Card className="border-2 border-dashed bg-muted/30">
              <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-primary/80" />
                </div>
                <h3 className="text-lg font-medium mb-1">No analytics available</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  Complete at least one quiz to see your performance analytics.
                </p>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create a Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h3 className="text-lg font-medium mb-3">Performance by Course</h3>
                <Card>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={coursePerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="course" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Accuracy']}
                        />
                        <Bar dataKey="Accuracy %" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Recent Quiz Scores</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          data={completionTrend}
                          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={[0, 100]} 
                            label={{ value: 'Score %', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Score']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="Score" 
                            stroke="#10b981" 
                            fill="#10b981" 
                            fillOpacity={0.2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Quizzes by Course</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={courseDonutData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            innerRadius={45}
                            fill="#8884d8"
                            dataKey="quizzes"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {courseDonutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip 
                            formatter={(value) => [`${value} quiz${value === 1 ? '' : 'zes'}`, 'Quizzes']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
