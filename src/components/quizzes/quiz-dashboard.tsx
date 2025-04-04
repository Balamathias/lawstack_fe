'use client';

import React, { useState, useEffect } from 'react'
import { 
  PlusCircle, 
  BarChart3, 
  Clock, 
  Award, 
  BookOpen, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  TimerIcon,
  Loader2,
  GraduationCap,
  BrainCircuit,
  Calendar,
  Layers,
  Search,
  RefreshCcw,
  FileQuestion,
  Check
} from 'lucide-react'
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
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';

interface QuizDashboardProps {
  initialQuizzes: { data: Quiz[] }
  initialStats: { data: QuizStatistics | null }
  initialCourses: { data: Course[] }
}

const StatisticsSkeleton = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold">Performance Overview</h2>
    
    {/* Stat cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
          {/* Add subtle pattern to skeletons */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute inset-0 bg-repeat" 
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          </div>
        </Card>
      ))}
    </div>
    
    {/* Charts skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Bar chart skeleton */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full p-4 flex items-center justify-center">
            <div className="w-full h-[250px] bg-muted/40 rounded-md flex flex-col justify-end">
              {/* Fake bars */}
              <div className="flex items-end justify-around h-[200px] w-full px-6">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className="w-8 rounded-t-md opacity-70"
                    style={{ 
                      height: `${Math.floor(Math.random() * 120) + 40}px`,
                    }} 
                  />
                ))}
              </div>
              <Skeleton className="h-8 w-full mt-4 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Area chart skeleton */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full p-4 flex items-center justify-center">
            <div className="w-full h-[250px] bg-muted/40 rounded-md flex flex-col justify-end">
              {/* Fake area chart */}
              <div className="w-full h-[200px] relative flex items-end">
                <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-primary/10 to-transparent rounded-md"></div>
                <Skeleton className="absolute top-[30%] w-full h-[2px]" />
                <Skeleton className="absolute bottom-0 w-full h-8 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Donut chart skeleton */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="h-[200px] w-[200px] rounded-full border-8 border-muted relative overflow-hidden">
              {/* Fake donut segments */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/20"></div>
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/20"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-500/20"></div>
              <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-background"></div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function QuizDashboard({ initialQuizzes, initialStats, initialCourses }: QuizDashboardProps) {
  const router = useRouter()
  const course = useSearchParams().get('course') as string

  // States for quiz creation
  const [isCreating, setIsCreating] = useState(false)
  const [quizTitle, setQuizTitle] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(course || '')
  const [numQuestions, setNumQuestions] = useState(10)
  const [quizDuration, setQuizDuration] = useState(15)
  const [difficulty, setDifficulty] = useState('medium')
  const [semester, setSemester] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')

  // States for filtering
  const [statusFilter, setStatusFilter] = useState('all')

  // Query hooks with initial data
  const { data: quizzesData, isPending: loadingQuizzes } = useQuizzes()
  const { data: statsData, isPending: loadingStats } = useQuizStatistics()
  const { data: coursesData, isPending: loadingCourses } = useCourses()

  // Mutation hooks
  const createQuizMutation = useCreateQuiz()
  const generateMCQMutation = useGenerateMCQuestions()

  // Effect to set course from URL param
  useEffect(() => {
    if (course) {
      setSelectedCourse(course)
      // Auto-open create dialog when course is passed via URL
      setIsCreating(true)
    }
  }, [course])

  // Effect to update title based on selected course
  useEffect(() => {
    if (selectedCourse) {
      const course = coursesData?.data?.find(c => c.id === selectedCourse)
      if (course) {
        setQuizTitle(`${course.name} Quiz`)
      }
    }
  }, [selectedCourse, coursesData?.data])

  // Filtered quizzes
  const filteredQuizzes = React.useMemo(() => {
    if (!quizzesData?.data) return []
    
    let filtered = [...quizzesData.data]
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(q => 
        q.title?.toLowerCase().includes(query) || 
        q.course_name?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [quizzesData?.data, statusFilter, searchQuery])

  // Separate quizzes by status for tab display
  const completedQuizzes = filteredQuizzes.filter(q => q.status === 'completed')
  const inProgressQuizzes = filteredQuizzes.filter(q => q.status === 'in_progress')
  const recentQuizzes = [...filteredQuizzes].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 8)

    // FIX: Added date validation to prevent "Invalid time value" errors
    const formatDateSafely = (dateString: string) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return 'Unknown date';
        }
        return format(date, 'MMM d, yyyy');
      } catch (error) {
        return 'Unknown date';
      }
    };

  // Quiz creation handler
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCourse) {
      toast.error('Please select a course')
      return
    }
    
    try {
      createQuizMutation.mutate({
        title: quizTitle,
        course: selectedCourse,
        total_questions: numQuestions,
        duration: quizDuration,
        difficulty,
        semester,
      }, {
        onSuccess: (data) => {
          if (data?.data) {
            toast.success('Quiz created successfully')
            setIsCreating(false)
            router.push(`/dashboard/quizzes/${data.data.id}`)
          } else {
            toast.error(data?.message || 'Failed to create quiz')
          }
        },
        onError: (error: any) => {
          toast.error(error.message || 'An error occurred')
        }
      })
    } catch (error) {
      toast.error('Failed to create quiz')
    }
  }

  // Generate sample chart data
  const coursePerformanceData = React.useMemo(() => {
    if (!statsData?.data?.course_performance) return []
    
    return Object.entries(statsData.data.course_performance).map(([course, data]) => ({
      name: data?.course_name,
      score: data.accuracy,
      attempts: data.quizzes_taken,
    })).slice(0, 6)
  }, [statsData?.data?.course_performance])

  const completionTrend = React.useMemo(() => {
    if (!statsData?.data?.recent_performance) return []
    
    return statsData.data.recent_performance.map(entry => ({
      date: formatDateSafely(entry.completed_at),
      score: entry.score,
      questions: entry.total_questions,
    }))
  }, [statsData?.data?.recent_performance])

  const courseDonutData = React.useMemo(() => {
    if (!statsData?.data?.course_performance) return []
    
    return Object.entries(statsData.data.course_performance).map(([course, data]) => ({
      name: data?.course_name,
      value: data.quizzes_taken,
    })).slice(0, 6)
  }, [statsData?.data?.course_performance])

  // Colors for charts
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Get pattern based on course name (for visual variety)
  const getPattern = (course?: string) => {
    const patterns = [
      'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/20px 20px',
      'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
      'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
      'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/24px 24px',
    ];
    
    // Use the sum of character codes to pick a consistent pattern
    if (!course) return patterns[0];
    const sum = (course || 'default').split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    return patterns[sum % patterns.length];
  };

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  }

  // Quiz card component with enhanced styling
  const QuizCard = ({ quiz, index }: { quiz: Quiz, index: number }) => {
    const isCompleted = quiz.status === 'completed';
    
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className={cn(
          "relative overflow-hidden rounded-xl border transition-all duration-300",
          "bg-card dark:bg-card/70 backdrop-blur-sm hover:shadow-lg",
          isCompleted ? "border-green-200/50" : "border-border hover:border-primary/30",
          "cursor-pointer shadow-sm"
        )}
        onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
      >
        {/* Pattern background */}
        <div className="absolute inset-0 pointer-events-none text-primary/[0.02] dark:text-primary/[0.015]">
          <div className="absolute inset-0 bg-repeat opacity-60" style={{ backgroundImage: getPattern(quiz.course_name) }} />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-70" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full opacity-50" />
        
        {/* Card content */}
        <div className="p-5 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "p-3 rounded-lg relative",
              isCompleted ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
            )}>
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <BrainCircuit className="h-5 w-5" />
              )}
              
              {/* Icon background pattern */}
              <div className="absolute inset-0 opacity-10 bg-repeat rounded-lg" 
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '6px 6px' }} 
              />
            </div>
            
            <Badge variant={isCompleted ? "outline" : "secondary"} className={cn(
              "text-xs",
              isCompleted ? "border-green-200 bg-green-500/5 text-green-500" : ""
            )}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
            {quiz.title || 'Untitled Quiz'}
          </h3>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-1 text-xs py-0.5 px-1.5 border-primary/20 bg-primary/5">
              <BookOpen className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{quiz.course_name || 'General Knowledge'}</span>
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 text-xs py-0.5 px-1.5">
              <Layers className="h-3 w-3" />
              <span>{quiz.questions?.length || 0} Qs</span>
            </Badge>
          </div>
          
          <div className="space-y-3 mt-4">
            {isCompleted && quiz.score !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Score:</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "font-semibold text-sm",
                    (quiz.score / quiz.total_questions! * 100) >= 70 ? "text-green-500" : "text-amber-500"
                  )}>
                    {quiz.score}/{quiz.total_questions}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(quiz.score / quiz.total_questions! * 100)}%)
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Created:</span>
              <span className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {quiz.created_at && !isNaN(new Date(quiz.created_at).getTime()) 
                  ? format(new Date(quiz.created_at), 'MMM d, yyyy')
                  : 'Unknown date'}
              </span>
            </div>
            
            {quiz.completion_time && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Time taken:</span>
                <span className="text-xs flex items-center gap-1">
                  <TimerIcon className="h-3 w-3 text-muted-foreground" />
                  {quiz.completion_time} mins
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-sm font-medium mt-5 text-primary border-t border-border/50 pt-3">
            <span>{isCompleted ? 'View Results' : 'Continue Quiz'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </motion.div>
    );
  };

  // Stats card component
  const StatCard = ({ title, value, icon, trend, description }: { 
    title: string, 
    value: string | number, 
    icon: React.ReactNode,
    trend?: { value: number, positive: boolean, label: string },
    description?: string
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            {icon}
          </div>
          {trend && (
            <Badge variant={trend.positive ? "default" : "destructive"} className="flex gap-1 items-center">
              {trend.positive ? <ChevronRight className="h-3 w-3 rotate-45" /> : <ChevronRight className="h-3 w-3 rotate-135" />}
              {trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <motion.div 
      className="space-y-8 pb-20" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Header section with gradient background and patterns */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 overflow-hidden shadow-sm border border-primary/10">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:8px_8px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">AI-Powered Quizzes</h1>
            </div>
            <p className="text-muted-foreground max-w-md">
              Test your knowledge with AI-generated quizzes tailored to your courses. Track your progress and improve your understanding.
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-9 w-[200px] sm:w-[250px] h-10 bg-background/80 border-border focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => setIsCreating(true)}
              className="gap-2 bg-primary/90 hover:bg-primary"
              disabled={createQuizMutation.isPending}
            >
              {createQuizMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  New Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics and Performance Section */}
      {loadingStats ? (
        <StatisticsSkeleton />
      ) : statsData?.data && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
            <h2 className="text-xl font-bold">Performance Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Questions Answered" 
              value={statsData.data.total_questions_answered || 0} 
              icon={<FileQuestion className="h-5 w-5" />} 
              trend={{
                value: statsData.data.total_questions_answered || 0,
                positive: (statsData.data.total_questions_answered || 0) >= 0,
                label: 'from last month'
              }}
            />
            <StatCard 
              title="Completed" 
              value={statsData.data.quizzes_completed || 0} 
              icon={<CheckCircle className="h-5 w-5" />} 
              description={`Completed ${statsData.data.quizzes_completed || 0} quizzes`}
            />
            <StatCard 
              title="Accuracy" 
              value={`${statsData.data.overall_accuracy || 0}%`} 
              icon={<Award className="h-5 w-5" />} 
              trend={{
                value: statsData.data.overall_accuracy || 0,
                positive: (statsData.data.overall_accuracy || 0) >= 0,
                label: 'accuracy'
              }}
            />
            <StatCard 
              title="Correct Answers" 
              value={`${statsData.data.total_correct_answers || 0}`} 
              icon={<Clock className="h-5 w-5" />} 
              description="Total correctly answered questions"
            />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Course Performance Chart */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Course Performance
                </CardTitle>
                <CardDescription>Average scores by course</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coursePerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis unit="%" tick={{ fontSize: 12 }} />
                      <RechartsTooltip 
                        formatter={(value: number) => [`${value}%`, 'Score']} 
                        labelFormatter={(label) => `Course: ${label}`}
                      />
                      <Bar dataKey="score" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Progress Chart */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Recent Progress
                </CardTitle>
                <CardDescription>Your quiz scores over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={completionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis unit="%" tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="var(--primary)" 
                        fillOpacity={1}
                        fill="url(#scoreGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Distribution Chart */}
            <Card className="md:col-span-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Course Distribution
                </CardTitle>
                <CardDescription>Number of quizzes taken per course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => entry.name}
                        labelLine={{ stroke: 'var(--foreground)', strokeOpacity: 0.2, strokeWidth: 1 }}
                      >
                        {courseDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                      <RechartsTooltip formatter={(value) => [`${value} quizzes`, 'Attempts']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quiz Listings */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
          <h2 className="text-xl font-bold">Your Quizzes</h2>
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="space-y-5"
        >
          <TabsList className="bg-card/50 p-1 border rounded-full">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary/10 rounded-full data-[state=active]:text-primary"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              All Quizzes
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-primary/10 rounded-full data-[state=active]:text-primary"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="in_progress" 
              className="data-[state=active]:bg-primary/10 rounded-full data-[state=active]:text-primary"
            >
              <Clock className="h-4 w-4 mr-2" />
              In Progress
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-full w-full pr-3">
            <TabsContent value="all" className="m-0">
              {loadingQuizzes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
                  ))}
                </div>
              ) : recentQuizzes.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-xl">
                  <div className="bg-primary/5 p-4 rounded-full mx-auto w-fit mb-4">
                    <BrainCircuit className="h-8 w-8 text-primary/80" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    Start your first quiz to begin testing your knowledge with AI-generated questions.
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Your First Quiz
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-xl border border-dashed border-primary/30 h-full
                    bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm shadow-sm
                    hover:border-primary hover:shadow-md cursor-pointer transition-all"
                    onClick={() => setIsCreating(true)}
                  >
                    <div className="relative p-5 h-full flex flex-col justify-center items-center text-center">
                      <div className="bg-primary/10 text-primary p-3 rounded-lg mb-4 relative">
                        <PlusCircle className="h-6 w-6" />
                        <div className="absolute inset-0 animate-ping bg-primary/20 rounded-lg opacity-75" style={{ animationDuration: '3s' }}></div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Create New Quiz</h3>
                      <p className="text-muted-foreground text-sm mb-5">
                        Test your knowledge with AI-generated questions tailored to your courses
                      </p>
                      <Button 
                        className="gap-2"
                        size="sm"
                      >
                        <BrainCircuit className="h-4 w-4" />
                        Start New Quiz
                      </Button>
                    </div>
                  </motion.div>
                  {recentQuizzes.map((quiz, i) => (
                    <QuizCard key={quiz.id} quiz={quiz} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="m-0">
              {loadingQuizzes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
                  ))}
                </div>
              ) : completedQuizzes.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-xl">
                  <div className="bg-muted/40 inline-flex p-3 rounded-full mb-4">
                    <Award className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No completed quizzes yet</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                    Once you complete a quiz, it will appear here. Start a quiz to test your knowledge.
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Start a Quiz
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {completedQuizzes.map((quiz, i) => (
                    <QuizCard key={quiz.id} quiz={quiz} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in_progress" className="m-0">
              {loadingQuizzes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
                  ))}
                </div>
              ) : inProgressQuizzes.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-xl">
                  <div className="bg-muted/40 inline-flex p-3 rounded-full mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No quizzes in progress</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                    You don't have any ongoing quizzes. Start a new quiz to begin testing your knowledge.
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Start a Quiz
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-xl border border-dashed border-primary/30 h-full
                    bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm shadow-sm
                    hover:border-primary hover:shadow-md cursor-pointer transition-all"
                    onClick={() => setIsCreating(true)}
                  >
                    <div className="relative p-5 h-full flex flex-col justify-center items-center text-center">
                      <div className="bg-primary/10 text-primary p-3 rounded-lg mb-4">
                        <PlusCircle className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Create New Quiz</h3>
                      <p className="text-muted-foreground text-sm mb-5">
                        Test your knowledge with AI-generated questions
                      </p>
                      <Button 
                        className="gap-2"
                        size="sm"
                      >
                        <BrainCircuit className="h-4 w-4" />
                        Start New Quiz
                      </Button>
                    </div>
                  </motion.div>
                  {inProgressQuizzes.map((quiz, i) => (
                    <QuizCard key={quiz.id} quiz={quiz} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Quiz Creation Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Create New Quiz
            </DialogTitle>
            <DialogDescription>
              Customize your quiz settings. Our AI will generate questions based on your selected course.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select 
                  value={selectedCourse} 
                  onValueChange={setSelectedCourse}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCourses ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading courses...</span>
                      </div>
                    ) : !coursesData?.data?.length ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No courses available
                      </div>
                    ) : (
                      coursesData.data.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="num_questions">Number of Questions</Label>
                  <Select 
                    value={numQuestions.toString()} 
                    onValueChange={(val) => setNumQuestions(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 25, 30, 40, 45, 60].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} questions
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select 
                    value={quizDuration.toString()} 
                    onValueChange={(val) => setQuizDuration(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 30, 45, 60].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={difficulty} 
                    onValueChange={setDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
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
                    onValueChange={setSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
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
                type="button" 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createQuizMutation.isPending || !selectedCourse}
                className="gap-2"
              >
                {createQuizMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4" />
                    Start Quiz
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
