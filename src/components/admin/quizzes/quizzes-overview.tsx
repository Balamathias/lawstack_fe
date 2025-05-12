'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  PlusSquare, 
  BookOpen, 
  Clock, 
  BarChart3,
  Award, 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  Hourglass,
  Calendar,
  BarChart
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { GlobalQuizAnalytics } from '@/@types/db';
import { format } from 'date-fns';

interface QuizzesOverviewProps {
  stats: GlobalQuizAnalytics;
}

const QuizzesOverview = ({
  stats
}: QuizzesOverviewProps) => {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Format percentage to always show one decimal place
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Main Statistics Cards */}
      <motion.div 
        className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <ListChecks className="h-4 w-4 text-primary animate-pulse-custom" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.total_quizzes.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="animate-fade-in">{stats.summary.completed_quizzes.toLocaleString()} completed ({formatPercentage(stats.summary.completion_rate)})</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.summary.completion_rate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-green-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-green-500/10 to-green-500/5">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{formatPercentage(stats.summary.average_score)}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{stats.questions.accuracy_rate.toFixed(1)}% question accuracy</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.summary.average_score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-amber-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
              <CardTitle className="text-sm font-medium">Completion Time</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.average_completion_time_minutes.toFixed(1)} min</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>Average quiz completion time</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-amber-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <Card className="overflow-hidden h-full shadow-md border-dashed animate-gradient-shift bg-grid-pattern">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-sm font-medium">Quiz Management</CardTitle>
              <CardDescription className="text-xs">
                Add or manage assessment quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button 
                  onClick={() => router.push('/admin/quizzes/new')}
                  className="w-full flex items-center justify-center group relative overflow-hidden bg-primary"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-in-out"></span>
                  <PlusSquare 
                    className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" 
                  />
                  <span>Create New Quiz</span>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quiz Status Breakdown */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Quiz Status Breakdown</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4 mb-6">
          {/* Completed */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-green-500/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.summary.completed_quizzes.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatPercentage(stats.summary.completion_rate)} of total
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500/80 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.summary.completion_rate}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* In Progress */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-blue-500/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.summary.in_progress_quizzes.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatPercentage((stats.summary.in_progress_quizzes / stats.summary.total_quizzes) * 100)} of total
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500/80 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.summary.in_progress_quizzes / stats.summary.total_quizzes) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-amber-500/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Hourglass className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.summary.pending_quizzes.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatPercentage((stats.summary.pending_quizzes / stats.summary.total_quizzes) * 100)} of total
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500/80 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.summary.pending_quizzes / stats.summary.total_quizzes) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expired */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-red-500/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-red-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Expired</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.summary.expired_quizzes.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatPercentage((stats.summary.expired_quizzes / stats.summary.total_quizzes) * 100)} of total
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500/80 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.summary.expired_quizzes / stats.summary.total_quizzes) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Question Statistics */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Question Statistics</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* Questions Summary */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Questions Overview</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Questions</div>
                    <div className="text-xl font-bold">{stats.questions.total_questions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Answers</div>
                    <div className="text-xl font-bold">{stats.questions.total_answers.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Correct Answers</span>
                    <span className="text-green-500 font-medium">{stats.questions.correct_answers.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500/80 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.questions.correct_answers / stats.questions.total_answers) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {formatPercentage(stats.questions.accuracy_rate)} accuracy rate
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Difficulty Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Difficulty Distribution</CardTitle>
                  <BarChart className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.questions.difficulty_distribution.map((difficulty, index) => (
                    <div key={difficulty.difficulty} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium capitalize">{difficulty.difficulty}</span>
                        <span className="text-muted-foreground">{difficulty.count} questions</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${
                            difficulty.difficulty === 'easy' ? 'bg-green-500/80' : 
                            difficulty.difficulty === 'medium' ? 'bg-amber-500/80' : 'bg-red-500/80'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(difficulty.count / stats.questions.total_questions) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Difficult Questions */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Most Challenging Questions</CardTitle>
                  <AlertCircle className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.difficult_questions.slice(0, 5).map((question, index) => (
                    <div key={question.question_id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate max-w-[230px]">
                          {question.question_text?.substring(0, 40)}...
                        </div>
                        <span className="text-xs font-medium text-red-500">
                          {formatPercentage(question.correct_rate)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-red-500/80 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${question.correct_rate}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {question.attempt_count} attempts
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Time-Based Analytics */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Time-Based Analytics</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4 mb-6">
          {/* Last 24 Hours */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.time_based.quizzes_last_24h}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  {stats.time_based.quizzes_last_24h > stats.time_based.daily_average_last_month ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                  )}
                  <span className={stats.time_based.quizzes_last_24h >= stats.time_based.daily_average_last_month ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(stats.time_based.quizzes_last_24h - stats.time_based.daily_average_last_month).toFixed(1)}{' '}
                    {stats.time_based.quizzes_last_24h >= stats.time_based.daily_average_last_month ? 'above' : 'below'} daily average
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last Week */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.time_based.quizzes_last_week}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>
                    {(stats.time_based.quizzes_last_week / 7).toFixed(1)} quizzes per day
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last Month */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.time_based.quizzes_last_month}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>
                    {stats.time_based.daily_average_last_month.toFixed(1)} daily average
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completion Rate */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatPercentage(stats.summary.completion_rate)}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>{stats.summary.completed_quizzes} of {stats.summary.total_quizzes} quizzes completed</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary/80 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.summary.completion_rate}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Top Performers</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          {/* Top Courses */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Top Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.course_analytics.slice(0, 5).map((course, index) => (
                    <div key={course.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium truncate max-w-[150px]">{course.name}</div>
                          <div className="text-xs text-muted-foreground">{course.code}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-right">{formatPercentage(course.average_score)}</div>
                        <div className="text-xs text-muted-foreground text-right">{course.quiz_count} quizzes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Users */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Top Users</CardTitle>
                  <Award className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.user_engagement.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium truncate max-w-[200px]">
                          {user.username}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-right">{formatPercentage(user.average_score)}</div>
                        <div className="text-xs text-muted-foreground text-right">
                          {user.completed_count}/{user.quiz_count} completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Generation timestamp */}
      <div className="text-xs text-muted-foreground text-right">
        Data generated at: {new Date(stats.generated_at).toLocaleString()}
      </div>
    </motion.div>
  );
};

export default QuizzesOverview;

// Skeleton component with the same structure
export const QuizzesOverviewSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="pt-4">
              <Skeleton className="h-8 w-20 mb-1" />
              <div className="mt-1">
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quiz Status Breakdown Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-8 w-16 mb-3" />
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Question Statistics Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {i === 1 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-3 w-20 mb-1" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                        <div>
                          <Skeleton className="h-3 w-20 mb-1" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      </div>
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-1.5 w-full rounded-full" />
                        <div className="text-right">
                          <Skeleton className="h-3 w-20 ml-auto" />
                        </div>
                      </div>
                    </>
                  ) : (
                    Array(5).fill(0).map((_, j) => (
                      <div key={j} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-1.5 w-full rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Time-Based Analytics Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-3" />
                <Skeleton className="h-4 w-32" />
                {i === 4 && (
                  <div className="mt-3">
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Top Performers Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, j) => (
                    <div key={j} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div>
                        <Skeleton className="h-4 w-10 mb-1 ml-auto" />
                        <Skeleton className="h-3 w-16 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Generation timestamp skeleton */}
      <div className="text-right">
        <Skeleton className="h-3 w-48 ml-auto" />
      </div>
    </div>
  );
};
