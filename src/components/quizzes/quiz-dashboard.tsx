'use client'

import React, { useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { PaginatedStackResponse, StackResponse } from '@/@types/generics'
import { Course, Quiz, QuizStatistics } from '@/@types/db'
import { useQuizzes, useCreateQuiz, useQuizStatistics } from '@/services/client/quiz'
import { 
  CalendarIcon, Clock, GraduationCap, LineChart, BarChart, 
  CheckCircle, Loader2, Brain, Award, BookOpen, School
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import DynamicModal from '../dynamic-modal'

interface QuizDashboardProps {
  initialQuizzes: PaginatedStackResponse<Quiz[]>
  initialStats: StackResponse<QuizStatistics | null>
  initialCourses: PaginatedStackResponse<Course[]>
}

export default function QuizDashboard({ 
  initialQuizzes,
  initialStats,
  initialCourses
}: QuizDashboardProps) {
  const router = useRouter()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newQuizTitle, setNewQuizTitle] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [quizDuration, setQuizDuration] = useState(15)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  
  // Fetch quizzes with the initial data
  const { data: quizzesResponse, isLoading: isLoadingQuizzes } = useQuizzes()
  
  // Fetch statistics with the initial data
  const { data: statsResponse, isLoading: isLoadingStats } = useQuizStatistics()
  
  // Mutation for creating a new quiz
  const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz()
  
  // Get courses from initial data
  const courses = initialCourses?.data || []
  
  // Get the quizzes and stats data
  const quizzes = quizzesResponse?.data || []
  const stats = statsResponse?.data || null
  
  // Filter quizzes by status
  const pendingQuizzes = quizzes.filter(q => q.status === 'pending')
  const inProgressQuizzes = quizzes.filter(q => q.status === 'in_progress')
  const completedQuizzes = quizzes.filter(q => q.status === 'completed')
  
  // Handle creating a new quiz
  const handleCreateQuiz = () => {
    if (!newQuizTitle.trim()) {
      toast.error('Please enter a quiz title')
      return
    }
    
    if (!selectedCourse) {
      toast.error('Please select a course')
      return
    }
    
    createQuiz({
      title: newQuizTitle,
      course: selectedCourse,
      total_questions: questionCount,
      duration: quizDuration
    }, {
      onSuccess: (response) => {
        if (response.data) {
          toast.success('Quiz created successfully!')
          setCreateDialogOpen(false)
          setNewQuizTitle('')
          setSelectedCourse('')
          
          // Navigate to the new quiz
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

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'in_progress': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'expired': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Stats Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4 grid-cols-1">
        <StatCard 
          title="Quizzes Completed"
          value={stats?.quizzes_completed || 0}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description="Total quizzes taken"
          loading={isLoadingStats}
        />
        <StatCard
          title="Questions Answered" 
          value={stats?.total_questions_answered || 0}
          icon={<Brain className="h-5 w-5 text-blue-500" />}
          description="Total questions attempted"
          loading={isLoadingStats}
        />
        <StatCard
          title="Overall Accuracy"
          value={`${stats?.overall_accuracy || 0}%`}
          icon={<Award className="h-5 w-5 text-purple-500" />}
          description="Correct answer rate"
          loading={isLoadingStats}
        />
        <StatCard
          title="Last Quiz Score"
          value={stats?.recent_performance?.[0]?.score ? `${stats.recent_performance[0].score}%` : 'N/A'}
          icon={<BarChart className="h-5 w-5 text-orange-500" />}
          description={stats?.recent_performance?.[0]?.title || 'No recent quizzes'}
          loading={isLoadingStats}
        />
      </div>
      
      {/* Course Performance */}
      {stats?.course_performance && stats.course_performance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Course Performance
            </CardTitle>
            <CardDescription>
              Your quiz performance by course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.course_performance.map(course => (
                <div key={course.course_id} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{course.course_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {course.correct_answers}/{course.total_questions} ({course.accuracy}%)
                    </span>
                  </div>
                  <Progress value={course.accuracy} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recent Quizzes & Quiz Creation */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Your Quizzes</h2>
        <DynamicModal 
          open={createDialogOpen} 
          setOpen={setCreateDialogOpen}
          trigger={
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              Create New Quiz
            </Button>
          }
          title="New Quiz"
        >
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quiz-title" className="">
                  Title
                </Label>
                <Input
                  id="quiz-title"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="Constitutional Law Quiz"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course" className="">
                  Course
                </Label>
                <Select 
                  value={selectedCourse} 
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="">
                  Difficulty
                </Label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question-count" className="">
                  Questions
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Slider
                    id="question-count"
                    value={[questionCount]}
                    onValueChange={(values) => setQuestionCount(values[0])}
                    min={5}
                    max={45}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{questionCount}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="">
                  Duration
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Slider
                    id="duration"
                    value={[quizDuration]}
                    onValueChange={(values) => setQuizDuration(values[0])}
                    min={5}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-14 text-center">{quizDuration} min</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreateQuiz} 
                disabled={isCreating}
                className="w-full rounded-xl"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Quiz...
                  </>
                ) : 'Create Quiz'}
              </Button>
            </DialogFooter>
          </div>
        </DynamicModal>
      </div>
      
      {/* Tabs for Quiz Status */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Ready to Start</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoadingQuizzes ? (
            <QuizSkeleton count={3} />
          ) : quizzes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No quizzes found" 
              description="Create a quiz to get started with your legal learning journey." 
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {isLoadingQuizzes ? (
            <QuizSkeleton count={2} />
          ) : pendingQuizzes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No pending quizzes" 
              description="Create a new quiz to begin your practice." 
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="in_progress">
          {isLoadingQuizzes ? (
            <QuizSkeleton count={1} />
          ) : inProgressQuizzes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No quizzes in progress" 
              description="Start a quiz to test your knowledge." 
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {isLoadingQuizzes ? (
            <QuizSkeleton count={2} />
          ) : completedQuizzes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No completed quizzes" 
              description="Complete a quiz to see your results here." 
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component for individual quiz cards
interface QuizCardProps {
  quiz: Quiz
}

function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter()
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Ready to Start</Badge>
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case 'expired':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const handleCardClick = () => {
    // Ensure we're using the correct ID format
    const quizId = quiz.id.toString().trim()
    
    // Log for debugging
    console.log("Navigating to quiz:", quizId, "Status:", quiz.status)
    
    if (quiz.status === 'completed') {
      router.push(`/dashboard/quizzes/${quizId}/results`)
    } else {
      router.push(`/dashboard/quizzes/${quizId}`)
    }
  }
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        quiz.status === 'completed' && "bg-muted/30"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          {getStatusBadge(quiz.status)}
        </div>
        <CardDescription>
          {quiz.course_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span>{quiz.total_questions} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{quiz.duration} minutes</span>
          </div>
        </div>
        
        {quiz.status === 'completed' && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className="font-medium">{quiz.score}%</span>
            </div>
            <Progress value={quiz.score} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          <span>
            {quiz.status === 'completed' 
              ? `Completed ${formatDistanceToNow(new Date(quiz.completed_at || ''), { addSuffix: true })}` 
              : `Created ${formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })}`}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

// Empty state component
interface EmptyStateProps {
  title: string
  description: string
  onCreateClick: () => void
}

function EmptyState({ title, description, onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button onClick={onCreateClick}>Create a Quiz</Button>
    </div>
  )
}

// Stat card component
interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description: string
  loading?: boolean
}

function StatCard({ title, value, icon, description, loading = false }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

// Loading skeleton for quizzes
function QuizSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Skeleton className="h-3 w-1/2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
