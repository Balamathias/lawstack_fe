'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileQuestion, 
  PlusSquare, 
  BookOpen, 
  School, 
  BarChart3,
  Bookmark, 
  MessageSquare, 
  TrendingUp,
  Calendar 
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { GlobalPastQuestionAnalytics } from '@/@types/db';

interface QuestionsOverviewProps {
  stats: GlobalPastQuestionAnalytics;
}

const QuestionsOverview = ({
  stats
}: QuestionsOverviewProps) => {
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
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <FileQuestion className="h-4 w-4 text-primary animate-pulse-custom" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.total_questions.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="animate-fade-in">{stats.summary.average_views_per_question.toFixed(1)} avg. views per question</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.total_views.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>Views across all questions</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `100%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-amber-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
              <CardTitle className="text-sm font-medium">Total Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.total_bookmarks.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>User bookmarked questions</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-amber-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `100%` }}
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
              <CardTitle className="text-sm font-medium">Question Management</CardTitle>
              <CardDescription className="text-xs">
                Add or manage past questions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button 
                  onClick={() => router.push('/admin/questions/new')}
                  className="w-full flex items-center justify-center group relative overflow-hidden bg-primary"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-in-out"></span>
                  <PlusSquare 
                    className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" 
                  />
                  <span>Add New Question</span>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Question Distribution */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Question Distribution</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* By Year */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">By Year</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.distributions.by_year.slice(0, 5).map((yearStat, index) => (
                    <div key={yearStat.year} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{yearStat.year}</span>
                        <span className="text-muted-foreground">{yearStat.count} questions</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary/80 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(yearStat.count / Math.max(...stats.distributions.by_year.map(y => y.count))) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                  {stats.distributions.by_year.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.distributions.by_year.length - 5} more years
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* By Type */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">By Question Type</CardTitle>
                  <FileQuestion className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.distributions.by_type.slice(0, 5).map((typeStat, index) => (
                    <div key={typeStat.type} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium capitalize">{typeStat.type || 'Unspecified'}</span>
                        <span className="text-muted-foreground">{typeStat.count} questions</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary/80 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(typeStat.count / Math.max(...stats.distributions.by_type.map(t => t.count))) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                  {stats.distributions.by_type.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.distributions.by_type.length - 5} more types
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* By Semester */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">By Semester</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.distributions.by_semester.slice(0, 5).map((semesterStat, index) => (
                    <div key={semesterStat.semester} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium capitalize">{semesterStat.semester || 'Unspecified'}</span>
                        <span className="text-muted-foreground">{semesterStat.count} questions</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary/80 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(semesterStat.count / Math.max(...stats.distributions.by_semester.map(s => s.count))) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                  {stats.distributions.by_semester.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.distributions.by_semester.length - 5} more semesters
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Content */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Top Content</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
          {/* Most Viewed */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10 h-full">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Most Viewed Questions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.top_content.most_viewed.slice(0, 5).map((question, index) => (
                    <div key={question.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-sm font-medium truncate">{question.course_name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {question.year} • {question.text_plain?.substring(0, 30)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Most Bookmarked */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10 h-full">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Most Bookmarked</CardTitle>
                  <Bookmark className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.top_content.most_bookmarked.slice(0, 5).map((question, index) => (
                    <div key={question.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-sm font-medium truncate">{question.course_name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {question.year} • {question.text_plain?.substring(0, 30)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Most Discussed */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10 h-full">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Most Discussed</CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.top_content.most_discussed.slice(0, 5).map((question, index) => (
                    <div key={question.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-sm font-medium truncate">{question.course_name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {question.year} • {question.text_plain?.substring(0, 30)}...
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

      {/* Top Entities */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <School className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Top Entities</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
          {/* Top Institutions */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Top Institutions</CardTitle>
                  <School className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.top_entities.institutions.slice(0, 5).map((institution, index) => (
                    <div key={institution.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium truncate max-w-[150px]">{institution.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {institution.question_count} questions
                      </div>
                    </div>
                  ))}
                  {stats.top_entities.institutions.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.top_entities.institutions.length - 5} more institutions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
                  {stats.top_entities.courses.slice(0, 5).map((course, index) => (
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
                      <div className="text-xs text-muted-foreground">
                        {course.question_count} questions
                      </div>
                    </div>
                  ))}
                  {stats.top_entities.courses.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.top_entities.courses.length - 5} more courses
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Tags */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Top Tags</CardTitle>
                  <FileQuestion className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.top_entities.tags.slice(0, 5).map((tag, index) => (
                    <div key={tag.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium truncate max-w-[150px]">{tag.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tag.question_count} questions
                      </div>
                    </div>
                  ))}
                  {stats.top_entities.tags.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.top_entities.tags.length - 5} more tags
                    </div>
                  )}
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

export default QuestionsOverview;

// Skeleton component with the same structure
export const QuestionsOverviewSkeleton = () => {
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
      
      {/* Question Distribution Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Top Content Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
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
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Top Entities Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
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
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-16" />
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
