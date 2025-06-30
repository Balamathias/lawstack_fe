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
  Check,
  HelpCircle
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
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Quiz, QuizStatistics, Course } from '@/@types/db'
import { useQuizzes, useQuizStatistics, useCreateQuiz, useGenerateMCQuestions } from '@/services/client/quiz'
import { useCourses } from '@/services/client/courses'
import { useRouter } from 'nextjs-toploader/app'
import { useSearchParams } from 'next/navigation'
import { cn, truncateString } from '@/lib/utils'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import GlassModal from '../ui/glass-modal';

interface QuizDashboardProps {
  initialQuizzes: { data: Quiz[] }
  initialStats: { data: QuizStatistics | null }
  initialCourses: { data: Course[] }
}

const StatisticsSkeleton = () => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex items-center gap-2">
      <div className="h-6 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
      <Skeleton className="h-6 w-48" />
    </div>
    
    {/* Stat cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {Array(4).fill(0).map((_, index) => (
        <Card key={index} className="relative overflow-hidden glass-effect border-primary/10 backdrop-blur-xl">
          <CardHeader className="pb-2 p-4 md:p-6">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-lg" />
              <Skeleton className="h-5 w-16 md:h-6 md:w-20" />
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <Skeleton className="h-6 w-20 md:h-8 md:w-24 mb-1" />
            <Skeleton className="h-3 w-32 md:h-4 md:w-40" />
          </CardContent>
          {/* Glassmorphic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-background/5 to-background/20 pointer-events-none" />
          {/* Subtle pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.015]">
            <div className="absolute inset-0 bg-repeat" 
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
          </div>
        </Card>
      ))}
    </div>
    
    {/* Charts skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
      {/* Bar chart skeleton */}
      <Card className="overflow-hidden glass-effect border-primary/10 backdrop-blur-xl">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 md:h-5 md:w-5 rounded-md" />
            <Skeleton className="h-5 w-36 md:h-6 md:w-48" />
          </div>
          <Skeleton className="h-3 w-32 md:h-4 md:w-40 mt-1" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[250px] md:h-[300px] w-full p-3 md:p-4 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/[0.02] dark:from-primary/3 dark:to-primary/[0.01] rounded-xl border border-primary/10 flex flex-col justify-end backdrop-blur-sm">
              {/* Fake bars with glassmorphic effect */}
              <div className="flex items-end justify-around h-[80%] w-full px-4 md:px-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="relative">
                    <Skeleton 
                      className="w-6 md:w-8 rounded-t-lg opacity-70 bg-gradient-to-t from-primary/20 to-primary/40"
                      style={{ 
                        height: `${Math.floor(Math.random() * 80) + 30}px`,
                      }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent rounded-t-lg" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-6 md:h-8 w-full mt-3 md:mt-4 rounded-md" />
            </div>
          </div>
        </CardContent>
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/5 pointer-events-none rounded-xl" />
      </Card>
      
      {/* Area chart skeleton */}
      <Card className="overflow-hidden glass-effect border-primary/10 backdrop-blur-xl">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 md:h-5 md:w-5 rounded-md" />
            <Skeleton className="h-5 w-36 md:h-6 md:w-48" />
          </div>
          <Skeleton className="h-3 w-32 md:h-4 md:w-40 mt-1" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[250px] md:h-[300px] w-full p-3 md:p-4 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/[0.02] dark:from-primary/3 dark:to-primary/[0.01] rounded-xl border border-primary/10 flex flex-col justify-end backdrop-blur-sm">
              {/* Fake area chart with glassmorphic effect */}
              <div className="w-full h-[80%] relative flex items-end">
                <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-xl backdrop-blur-sm"></div>
                <div className="absolute top-[30%] w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <Skeleton className="absolute bottom-0 w-full h-6 md:h-8 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/5 pointer-events-none rounded-xl" />
      </Card>
      
      {/* Donut chart skeleton */}
      <Card className="md:col-span-2 glass-effect border-primary/10 backdrop-blur-xl">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 md:h-5 md:w-5 rounded-md" />
            <Skeleton className="h-5 w-36 md:h-6 md:w-48" />
          </div>
          <Skeleton className="h-3 w-32 md:h-4 md:w-40 mt-1" />
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="h-[250px] md:h-[300px] w-full flex items-center justify-center">
            <div className="relative">
              <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full border-8 border-primary/10 relative overflow-hidden bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-primary/30 to-primary/10"></div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-500/30 to-blue-500/10"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-green-500/30 to-green-500/10"></div>
                <div className="absolute inset-0 m-auto w-16 h-16 md:w-24 md:h-24 rounded-full bg-background/80 backdrop-blur-xl border border-border/20"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/5 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center gap-3 md:gap-4 mt-4 flex-wrap">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-3 w-16 md:h-4 md:w-20" />
            ))}
          </div>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/5 pointer-events-none rounded-xl" />
      </Card>
    </div>
  </div>
);

export default function QuizDashboard({ initialQuizzes, initialStats, initialCourses }: QuizDashboardProps) {
  const router = useRouter()
  const course = useSearchParams().get('course') as string

  const [isCreating, setIsCreating] = useState(false)
  const [quizTitle, setQuizTitle] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(course || '')
  const [numQuestions, setNumQuestions] = useState(10)
  const [quizDuration, setQuizDuration] = useState(15)
  const [difficulty, setDifficulty] = useState('medium')
  const [semester, setSemester] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [reuseQuestions, setReuseQuestions] = useState(true)

  const [statusFilter, setStatusFilter] = useState('all')

  const { data: quizzesData, isPending: loadingQuizzes } = useQuizzes()
  const { data: statsData, isPending: loadingStats } = useQuizStatistics()
  const { data: coursesData, isPending: loadingCourses } = useCourses()

  const createQuizMutation = useCreateQuiz()
  const generateMCQMutation = useGenerateMCQuestions()

  useEffect(() => {
    if (course) {
      setSelectedCourse(course)
      // Auto-open create dialog when course is passed via URL
      setIsCreating(true)
    }
  }, [course])

  useEffect(() => {
    if (selectedCourse) {
      const course = coursesData?.data?.find(c => c.id === selectedCourse)
      if (course) {
        setQuizTitle(`${course.name} Quiz`)
      }
    }
  }, [selectedCourse, coursesData?.data])

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

  const completedQuizzes = filteredQuizzes.filter(q => q.status === 'completed')
  const inProgressQuizzes = filteredQuizzes.filter(q => q.status === 'in_progress')
  const recentQuizzes = [...filteredQuizzes].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 8)

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
        reuse_questions: reuseQuestions
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
      name: truncateString(data?.course_name, 20),
      value: data.quizzes_taken,
    })).slice(0, 6)
  }, [statsData?.data?.course_performance])

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  }

  const QuizCard = ({ quiz, index }: { quiz: Quiz, index: number }) => {
    const isCompleted = quiz.status === 'completed';
    
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group",
          "bg-background/40 dark:bg-background/20 backdrop-blur-xl shadow-lg hover:shadow-xl",
          "border-border/20 hover:border-primary/30 glass-effect",
          isCompleted && "border-green-200/30 dark:border-green-500/20"
        )}
        onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
      >
        {/* Glassmorphic background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/10 to-background/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/[0.02] via-transparent to-primary/[0.03] pointer-events-none" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 pointer-events-none text-primary/[0.015] dark:text-primary/[0.01]">
          <div className="absolute inset-0 bg-repeat opacity-40" style={{ backgroundImage: getPattern(quiz.course_name) }} />
        </div>
        
        {/* Decorative glassmorphic elements */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-bl-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-tr from-primary/8 via-primary/3 to-transparent rounded-tr-3xl opacity-40" />
        
        {/* Card content */}
        <div className="p-4 md:p-5 lg:p-6 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "p-2.5 md:p-3 rounded-xl relative backdrop-blur-sm border",
              isCompleted 
                ? "bg-green-500/10 dark:bg-green-500/[0.08] text-green-600 dark:text-green-400 border-green-500/20" 
                : "bg-primary/10 dark:bg-primary/[0.08] text-primary border-primary/20"
            )}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <BrainCircuit className="h-4 w-4 md:h-5 md:w-5" />
              )}
              
              {/* Icon glassmorphic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-current/5 to-transparent rounded-xl opacity-20" />
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs border backdrop-blur-sm",
                isCompleted 
                  ? "border-green-200/50 dark:border-green-500/30 bg-green-500/10 dark:bg-green-500/[0.08] text-green-600 dark:text-green-400" 
                  : "border-primary/30 bg-primary/5 dark:bg-primary/[0.05] text-primary"
              )}
            >
              {isCompleted ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {quiz.title || 'Untitled Quiz'}
          </h3>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-1 text-xs py-1 px-2 border-primary/20 bg-primary/5 dark:bg-primary/[0.05] backdrop-blur-sm">
              <BookOpen className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{quiz.course_name || 'General'}</span>
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 text-xs py-1 px-2 backdrop-blur-sm bg-background/50 dark:bg-background/30">
              <Layers className="h-3 w-3" />
              <span>{quiz.total_questions || 0} Qs</span>
            </Badge>
          </div>
          
          <div className="space-y-2.5 mt-4">
            {isCompleted && quiz.score !== undefined && (
              <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border border-border/20">
                <span className="text-xs text-muted-foreground">Score:</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "font-semibold text-sm",
                    (quiz.score) >= 70 ? "text-green-500" : "text-amber-500"
                  )}>
                    {quiz.correct_answers}/{quiz.total_questions}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(quiz.score)}%)
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Created:</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {quiz.created_at && !isNaN(new Date(quiz.created_at).getTime()) 
                  ? format(new Date(quiz.created_at), 'MMM d, yyyy')
                  : 'Unknown date'}
              </span>
            </div>
            
            {quiz.completion_time && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Duration:</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TimerIcon className="h-3 w-3" />
                  {Math.round(quiz.completion_time/60)} mins
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium mt-5 text-primary border-t border-border/30 pt-3">
            <span>{isCompleted ? 'View Results' : 'Continue Quiz'}</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
        
        {/* Hover glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      </motion.div>
    );
  };

  const StatCard = ({ title, value, icon, trend, description }: { 
    title: string, 
    value: string | number, 
    icon: React.ReactNode,
    trend?: { value: number, positive: boolean, label: string },
    description?: string
  }) => (
    <Card className="relative overflow-hidden glass-effect border-primary/10 backdrop-blur-xl group hover:border-primary/20 transition-all duration-300">
      {/* Glassmorphic background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/10 to-background/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/[0.02] via-transparent to-primary/[0.03] pointer-events-none" />
      
      <CardHeader className="pb-2 p-4 md:p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className="bg-primary/10 dark:bg-primary/[0.08] text-primary p-2.5 md:p-3 rounded-xl border border-primary/20 backdrop-blur-sm relative">
            {icon}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl" />
          </div>
          {trend && (
            <Badge 
              variant={trend.positive ? "default" : "destructive"} 
              className="flex gap-1 items-center text-xs backdrop-blur-sm bg-background/50 text-muted-foreground dark:bg-background/30 border border-border/30"
            >
              {trend.positive ? 
                <ChevronRight className="h-3 w-3 rotate-45" /> : 
                <ChevronRight className="h-3 w-3 rotate-135" />
              }
              {trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 relative z-10">
        <div className="text-xl md:text-2xl font-bold mb-1">{value}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 opacity-80">{description}</p>
        )}
      </CardContent>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );

  return (
    <motion.div 
      className="space-y-6 md:space-y-8 pb-16 md:pb-20 px-3 md:px-0" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Header section with enhanced glassmorphic design */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl glass-effect border-primary/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced glassmorphic background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/20 to-background/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/[0.04] via-transparent to-primary/[0.06] pointer-events-none" />
        
        {/* Sophisticated background patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute inset-0 bg-neural-pattern"></div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent rounded-bl-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-radial from-primary/10 to-transparent opacity-40"></div>
        
        <div className="relative z-10 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 md:gap-6 items-start sm:items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-2 md:space-y-3"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="bg-primary/10 dark:bg-primary/[0.08] p-2 md:p-2.5 rounded-xl border border-primary/20 shadow-sm backdrop-blur-sm relative">
                  <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl animate-pulse-custom" />
                </div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  AI-Powered Quizzes
                </h1>
              </div>
              <p className="text-muted-foreground max-w-md text-sm md:text-base animate-fade-in">
                Test your knowledge with AI-generated quizzes tailored to your courses. 
                Track your progress and improve your understanding.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <div className="relative w-full sm:w-auto mb-2 sm:mb-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  className="pl-10 w-full sm:w-[200px] md:w-[220px] lg:w-[250px] bg-background/50 dark:bg-background/30 border-primary/20 shadow-sm focus-visible:ring-primary/30 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => setIsCreating(true)}
                className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg backdrop-blur-sm border-0 w-full sm:w-auto"
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
                    New Test
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.01] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl md:rounded-3xl" />
      </motion.div>

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
      <GlassModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-2.5 rounded-xl">
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Test</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Customize your test settings with AI-generated questions
              </p>
            </div>
          </div>
        }
        size="xl"
        className="max-w-2xl"
      >
        <form onSubmit={handleCreateQuiz} className="space-y-6">
          <div className="grid gap-6">
            {/* Course Selection */}
            <div className="space-y-3">
              <Label htmlFor="course" className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Course
              </Label>
              <Select 
                value={selectedCourse} 
                onValueChange={setSelectedCourse}
                required
              >
                <SelectTrigger className="h-12 bg-background/50 border-border/30 hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select a course to generate questions from" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCourses ? (
                    <div className="flex items-center justify-center p-3">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading courses...</span>
                    </div>
                  ) : !coursesData?.data?.length ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No courses available
                    </div>
                  ) : (
                    coursesData.data.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                          <span className="font-medium">{course.name}</span>
                          <span className="text-muted-foreground">({course.code})</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* Quiz Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-primary" />
                Quiz Title
              </Label>
              <Input
                id="title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter a descriptive title for your quiz"
                className="h-12 bg-background/50 border-border/30 hover:border-primary/50 focus:border-primary transition-colors"
                required
              />
            </div>
            
            {/* Quiz Configuration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="num_questions" className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Questions
                </Label>
                <Select 
                  value={numQuestions.toString()} 
                  onValueChange={(val) => setNumQuestions(parseInt(val))}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/30 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25, 30, 40, 45, 60].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{num} questions</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {Math.ceil(num * 1.5)}min
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Duration
                </Label>
                <Select 
                  value={quizDuration.toString()} 
                  onValueChange={(val) => setQuizDuration(parseInt(val))}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/30 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Time limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 30, 45, 60].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center gap-2">
                          <TimerIcon className="h-3 w-3" />
                          {num} minutes
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Advanced Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="difficulty" className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Difficulty Level
                </Label>
                <Select 
                  value={difficulty} 
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/30 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Easy</span>
                        <span className="text-muted-foreground text-xs">Basic concepts</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span>Medium</span>
                        <span className="text-muted-foreground text-xs">Moderate challenge</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hard">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Hard</span>
                        <span className="text-muted-foreground text-xs">Advanced topics</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="semester" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Semester
                </Label>
                <Select 
                  value={semester} 
                  onValueChange={setSemester}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/30 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-3 w-3" />
                        First Semester
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-3 w-3" />
                        Second Semester
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question Reuse Setting */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border border-border/30">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 text-primary" />
                    <Label htmlFor="reuse-questions" className="text-sm font-medium">
                      Smart Question Reuse
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3" side="top">
                          <p className="text-sm">
                            When enabled, the system intelligently selects from our curated question bank for faster loading. 
                            When disabled, all questions are freshly generated by AI.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {reuseQuestions 
                      ? "Optimized mix of curated and new questions for faster generation"
                      : "All questions will be freshly generated for unique content"
                    }
                  </p>
                </div>
                <Switch 
                  id="reuse-questions"
                  checked={reuseQuestions}
                  onCheckedChange={setReuseQuestions}
                  aria-label="Toggle question reuse"
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border/30">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCreating(false)}
              className="flex-1 sm:flex-none h-11 bg-background/50 hover:bg-background/80 border-border/30 hover:border-border/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createQuizMutation.isPending || !selectedCourse}
              className="flex-1 sm:flex-none h-11 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            >
              {createQuizMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Quiz...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" />
                  <span>Start Quiz</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassModal>
    </motion.div>
  );
}
