'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserCheck, Shield, Activity, Calendar, Clock, TrendingUp, UserX } from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserStatistics } from '@/@types/db';

interface UsersOverviewProps {
  stats: UserStatistics;
}

const UsersOverview = ({
  stats
}: UsersOverviewProps) => {
  const router = useRouter();

  // Calculate percentages
  const activePercentage = stats.total_users > 0 ? Math.round((stats.active_users / stats.total_users) * 100) : 0;
  const staffPercentage = stats.total_users > 0 ? Math.round((stats.staff_users / stats.total_users) * 100) : 0;
  const adminPercentage = stats.total_users > 0 ? Math.round((stats.admin_users / stats.total_users) * 100) : 0;
  
  // Calculate growth rates
  const monthGrowth = stats.registration_stats.last_month > 0 ? 
    Math.round(((stats.registration_stats.this_month - stats.registration_stats.last_month) / stats.registration_stats.last_month) * 100) : 0;
  
  const weekGrowth = stats.registration_stats.last_week > 0 ?
    Math.round(((stats.registration_stats.this_week - stats.registration_stats.last_week) / stats.registration_stats.last_week) * 100) : 0;

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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary animate-pulse-custom" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total_users.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="animate-fade-in">Registered accounts</span>
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
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.active_users.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{activePercentage}% of total users</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${activePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
              <CardTitle className="text-sm font-medium">Staff Users</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.staff_users.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{staffPercentage}% of total users</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${staffPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-md backdrop-blur-sm glass-effect border-purple-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-purple-500/10 to-purple-500/5">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.admin_users.toLocaleString()}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{adminPercentage}% of total users</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-purple-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${adminPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Registration Statistics */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Registration Statistics</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <CardDescription className="text-xs">New registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.registration_stats.today}</div>
                <div className="flex items-center mt-2 text-xs">
                  {stats.registration_stats.today > stats.registration_stats.yesterday ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                  )}
                  <span className={stats.registration_stats.today >= stats.registration_stats.yesterday ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(stats.registration_stats.today - stats.registration_stats.yesterday)} {stats.registration_stats.today >= stats.registration_stats.yesterday ? 'more' : 'fewer'} than yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <CardDescription className="text-xs">Weekly registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.registration_stats.this_week}</div>
                <div className="flex items-center mt-2 text-xs">
                  {weekGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                  )}
                  <span className={weekGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(weekGrowth)}% {weekGrowth >= 0 ? 'increase' : 'decrease'} from last week
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-neural-pattern shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <CardDescription className="text-xs">Monthly registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.registration_stats.this_month}</div>
                <div className="flex items-center mt-2 text-xs">
                  {monthGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                  )}
                  <span className={monthGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(monthGrowth)}% {monthGrowth >= 0 ? 'increase' : 'decrease'} from last month
                  </span>
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
                <CardTitle className="text-sm font-medium">User Management</CardTitle>
                <CardDescription className="text-xs">
                  Add or manage system users
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Button 
                    onClick={() => router.push('/admin/users/new')}
                    className="w-full flex items-center justify-center group relative overflow-hidden bg-primary"
                    size="lg"
                  >
                    <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-in-out"></span>
                    <UserPlus 
                      className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" 
                    />
                    <span>Add New User</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Activity Metrics */}
      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Activity Metrics</h2>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold animate-fade-in">{stats.activity_stats.active_today.toLocaleString()}</div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    <span>{Math.round((stats.activity_stats.active_today / stats.total_users) * 100)}% of total</span>
                  </div>
                  <div className="text-xs font-medium">
                    {stats.activity_stats.active_today} users
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activity_stats.active_today / stats.total_users) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold animate-fade-in">{stats.activity_stats.active_this_week.toLocaleString()}</div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    <span>{Math.round((stats.activity_stats.active_this_week / stats.total_users) * 100)}% of total</span>
                  </div>
                  <div className="text-xs font-medium">
                    {stats.activity_stats.active_this_week} users
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activity_stats.active_this_week / stats.total_users) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-md glass-effect border-primary/10">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold animate-fade-in">{stats.activity_stats.active_this_month.toLocaleString()}</div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    <span>{Math.round((stats.activity_stats.active_this_month / stats.total_users) * 100)}% of total</span>
                  </div>
                  <div className="text-xs font-medium">
                    {stats.activity_stats.active_this_month} users
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activity_stats.active_this_month / stats.total_users) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Yearly Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden shadow-lg glass-effect border-primary/20 bg-gradient-radial from-primary/5 to-transparent">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Annual Registration Summary
            </CardTitle>
            <CardDescription>
              Overview of user growth this year
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold mb-2 animate-float">{stats.registration_stats.this_year.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">New users this year</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold mb-1">{stats.registration_stats.this_quarter.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">This quarter</div>
              </div>
            </div>
            <div className="mt-6 h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(stats.registration_stats.this_quarter / stats.registration_stats.this_year) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-right">
              {Math.round((stats.registration_stats.this_quarter / stats.registration_stats.this_year) * 100)}% of yearly registrations occurred this quarter
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UsersOverview;

// Skeleton component with the same structure
const UsersOverviewSkeleton = () => {
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
            
            {/* Registration Stats Skeleton */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-36" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-3" />
                                <Skeleton className="h-3 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            
            {/* Activity Metrics Skeleton */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-36" />
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
                                <Skeleton className="h-8 w-20 mb-3" />
                                <div className="flex justify-between items-center mb-3">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-1.5 w-full rounded-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            
            {/* Yearly Summary Skeleton */}
            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="pb-3 border-b">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Skeleton className="h-10 w-32 mb-2" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-6 w-20 mb-1 ml-auto" />
                            <Skeleton className="h-4 w-24 ml-auto" />
                        </div>
                    </div>
                    <Skeleton className="h-2 w-full rounded-full mb-2" />
                    <Skeleton className="h-3 w-48 ml-auto" />
                </CardContent>
            </Card>
        </div>
    );
};

export { UsersOverviewSkeleton };