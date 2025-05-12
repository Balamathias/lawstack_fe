'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  PlusSquare, 
  MessageCircle, 
  Users, 
  BarChart3,
  MessageSquareDashed, 
  MessageSquareText, 
  TrendingUp,
  Clock,
  BookOpen,
  FileQuestion,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  BarChart
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { GlobalChatAnalytics } from '@/@types/db';

interface ChatsOverviewProps {
  stats: GlobalChatAnalytics;
}

const ChatsOverview = ({
  stats
}: ChatsOverviewProps) => {
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
              <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary animate-pulse-custom" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.total_chats.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="animate-fade-in">{stats.summary.avg_messages_per_chat.toFixed(1)} avg. messages per chat</span>
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
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-green-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-green-500/10 to-green-500/5">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.active_chats.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{((stats.summary.active_chats / stats.summary.total_chats) * 100).toFixed(1)}% of total chats</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.summary.active_chats / stats.summary.total_chats) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquareText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.summary.total_messages.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{stats.time_based.chats_last_24h} new chats in last 24h</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full" 
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
              <CardTitle className="text-sm font-medium">Chat Management</CardTitle>
              <CardDescription className="text-xs">
                Monitor and manage conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button 
                  onClick={() => router.push('/admin/chats/new')}
                  className="w-full flex items-center justify-center group relative overflow-hidden bg-primary"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-in-out"></span>
                  <PlusSquare 
                    className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" 
                  />
                  <span>New Chat</span>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Chat Types Distribution */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Chat Distribution</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* By Chat Type */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">By Chat Type</CardTitle>
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.distributions.by_type.map((chatType, index) => (
                    <div key={chatType.chat_type} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium capitalize">{chatType.chat_type.replace('_', ' ')}</span>
                        <span className="text-muted-foreground">{chatType.count} chats</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary/80 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(chatType.count / stats.summary.total_chats) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* By Message Type */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">By Message Type</CardTitle>
                  <MessageSquareText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.distributions.message_types.map((messageType, index) => (
                    <div key={messageType.sender} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium capitalize">{messageType.sender === 'ai' ? 'AI Assistant' : 'User'}</span>
                        <span className="text-muted-foreground">{messageType.count} messages</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${messageType.sender === 'ai' ? 'bg-blue-500/80' : 'bg-green-500/80'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(messageType.count / stats.summary.total_messages) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* By Feedback Type */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Feedback Distribution</CardTitle>
                  <div className="flex -space-x-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                    <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.distributions.feedback.map((feedback, index) => (
                    <div key={feedback.feedback || 'none'} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium capitalize">
                          {feedback.feedback === 'positive' ? 'Positive' : 
                           feedback.feedback === 'negative' ? 'Negative' : 
                           feedback.feedback === 'neutral' ? 'Neutral' : 'No Feedback'}
                        </span>
                        <span className="text-muted-foreground">{feedback.count} messages</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full 
                            ${feedback.feedback === 'positive' ? 'bg-green-500/80' : 
                              feedback.feedback === 'negative' ? 'bg-red-500/80' : 
                              feedback.feedback === 'neutral' ? 'bg-amber-500/80' : 'bg-gray-500/80'}`
                          }
                          initial={{ width: 0 }}
                          animate={{ width: `${(feedback.count / stats.summary.total_messages) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Time-Based Statistics */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Time-Based Statistics</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.time_based.chats_last_24h}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>
                    {stats.time_based.chats_last_24h > stats.time_based.chats_per_day_avg ? 
                      `${(stats.time_based.chats_last_24h - stats.time_based.chats_per_day_avg).toFixed(1)} above daily average` : 
                      `${(stats.time_based.chats_per_day_avg - stats.time_based.chats_last_24h).toFixed(1)} below daily average`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.time_based.chats_last_week}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>
                    {(stats.time_based.chats_last_week / 7).toFixed(1)} chats per day
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.time_based.chats_last_month}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>
                    {stats.time_based.chats_per_day_avg.toFixed(1)} daily average
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {((stats.summary.active_chats / stats.summary.total_chats) * 100).toFixed(1)}%
                </div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>Active vs. Inactive Chats</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary/80 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.summary.active_chats / stats.summary.total_chats) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Popular Content */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Popular Content</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          {/* Popular Courses */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Popular Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.popular_content.courses.slice(0, 5).map((course, index) => (
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
                        {course.chat_count} chats
                      </div>
                    </div>
                  ))}
                  {stats.popular_content.courses.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.popular_content.courses.length - 5} more courses
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Past Questions */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Popular Past Questions</CardTitle>
                  <FileQuestion className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {stats.popular_content.past_questions.slice(0, 5).map((question, index) => (
                    <div key={question.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-sm font-medium truncate">{question.text.substring(0, 50)}...</div>
                        <div className="text-xs text-muted-foreground">
                          {question.year} • {question.semester} • {question.chat_count} chats
                        </div>
                      </div>
                    </div>
                  ))}
                  {stats.popular_content.past_questions.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      +{stats.popular_content.past_questions.length - 5} more questions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Active Users */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">User Engagement</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 mb-6">
          {/* Most Active Users */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Most Active Users</CardTitle>
                  <User className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.user_engagement.most_active_users.slice(0, 6).map((user, index) => (
                    <div key={user.id} className="flex items-center gap-2 p-3 bg-background/40 rounded-lg border border-border/40">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.chat_count} chats</div>
                      </div>
                    </div>
                  ))}
                </div>
                {stats.user_engagement.most_active_users.length > 6 && (
                  <div className="text-xs text-center text-muted-foreground mt-4">
                    +{stats.user_engagement.most_active_users.length - 6} more users
                  </div>
                )}
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

export default ChatsOverview;

// Skeleton component with the same structure
export const ChatsOverviewSkeleton = () => {
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
      
      {/* Chat Distribution Skeleton */}
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
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
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
      
      {/* Time-Based Statistics Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-3" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-3 w-28" />
                </div>
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
      
      {/* Popular Content Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          {[1, 2].map((i) => (
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
      
      {/* User Engagement Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 mb-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, j) => (
                  <div key={j} className="flex items-center gap-2 p-3 bg-background/40 rounded-lg border border-border/40">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Generation timestamp skeleton */}
      <div className="text-right">
        <Skeleton className="h-3 w-48 ml-auto" />
      </div>
    </div>
  );
};
