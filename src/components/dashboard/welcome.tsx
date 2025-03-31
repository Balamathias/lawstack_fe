'use client';

import { User } from '@/@types/db';
import { format } from 'date-fns';
import { Search, Bell, Calendar, BookOpen, Clock, Sparkles, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'nextjs-toploader/app'

interface WelcomeProps {
  user: User | null;
}

const DashboardWelcome = ({ user }: WelcomeProps) => {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false);
  const isGuest = !user;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get day name and date
  const today = format(new Date(), 'EEEE, MMMM do');
  
  // Get current time
  const currentTime = format(new Date(), 'h:mm a');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background gradient with improved colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 dark:from-indigo-900 dark:via-indigo-800 dark:to-blue-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/4 translate-y-1/4 opacity-10"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 border-4 border-white rounded-lg rotate-12" />
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 border-2 border-white rounded-md rotate-45" />
        </div>
      </div>
      
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 space-y-4 md:space-y-0">
          {/* Mobile Search - Only show if logged in */}
          {!isGuest && (
            <motion.div 
              variants={itemVariants}
              className="z-10 w-full md:hidden"
            >
              <div className="relative w-full">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                  isFocused ? "text-indigo-600" : "text-white/70"
                )} />
                
                <motion.form
                  initial={false}
                  animate={isFocused ? { 
                    scale: 1.02, 
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                  } : {
                    scale: 1,
                    boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
                  }}
                  transition={{ duration: 0.2 }}
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                >
                  <Input 
                    placeholder="Search questions, topics..." 
                    className={cn(
                      "pl-9 bg-white/20 backdrop-blur-md border-white/20 placeholder:text-white/70 text-white w-full rounded-xl transition-all duration-200 h-10",
                      isFocused ? "bg-white text-indigo-900 border-white placeholder:text-indigo-400" : ""
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </motion.form>
              </div>
            </motion.div>
          )}

          <div className="z-10 space-y-3 md:space-y-5 w-full md:max-w-[60%]">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 md:gap-3">
              <div className="flex gap-1 items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                <span>{today}</span>
              </div>
              
              <div className="flex gap-1 items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-sm">
                <Clock className="h-3.5 w-3.5" />
                <span>{currentTime}</span>
              </div>
            </motion.div>
            
            {isGuest ? (
              // Guest welcome content
              <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="text-xl md:text-3xl font-bold text-white leading-tight">
                  {getGreeting()}, Guest!
                </h1>
                <motion.p 
                  className="mt-1 text-sm md:text-base text-white/90"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome to LegalX - your ultimate legal education platform. Sign in to access all features.
                </motion.p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      asChild
                      className="bg-white text-indigo-700 hover:bg-white/90 flex gap-2 h-10"
                    >
                      <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        <span>Log In</span>
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      asChild
                      className="bg-indigo-900/30 text-white border border-white/20 backdrop-blur-sm hover:bg-indigo-900/40 flex gap-2 h-10"
                    >
                      <Link href="/signup">
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                
                <div className="flex flex-wrap gap-1.5 md:gap-3 mt-4">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm py-1">
                    <BookOpen className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                    <span>50+ Courses</span>
                  </Badge>
                  
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm py-1">
                    <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                    <span>AI-Powered</span>
                  </Badge>
                </div>
              </motion.div>
            ) : (
              // Logged-in user content
              <>
                <motion.div variants={itemVariants} className="flex gap-3 items-center">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-white/30 shrink-0">
                    <AvatarImage src={user?.avatar || ''} />
                    <AvatarFallback className="bg-white/20 text-white">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-xl md:text-3xl font-bold text-white leading-tight">
              {getGreeting()}, {user?.first_name || user?.username || 'Student'}
            </h1>
                    <motion.p 
                      className="mt-1 text-sm md:text-base text-white/80"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
              Ready to continue your legal learning journey?
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-1.5 md:gap-3"
                >
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm py-1">
                    <BookOpen className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                    <span>3 Courses</span>
                  </Badge>
                  
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm py-1">
                    <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                    <span>92% Quiz</span>
                  </Badge>
                  
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm py-1" variant="outline">
                    <Bell className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                    <span>2 Notifications</span>
                  </Badge>
                </motion.div>
              </>
            )}
          </div>
          
          {/* Desktop Search - Only show if logged in */}
          {!isGuest && (
            <motion.div 
              variants={itemVariants}
              className="z-10 hidden md:block"
            >
              <div className="relative md:min-w-[280px] w-full">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                  isFocused ? "text-indigo-600" : "text-white/70"
                )} />
                
                <motion.div
                  initial={false}
                  animate={isFocused ? { 
                    scale: 1.02, 
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                  } : {
                    scale: 1,
                    boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
                  }}
                  transition={{ duration: 0.2 }}
                >
              <Input 
                placeholder="Search questions, topics..." 
                    className={cn(
                      "pl-9 bg-white/20 backdrop-blur-md border-white/20 placeholder:text-white/70 text-white w-full rounded-xl transition-all duration-200 h-11",
                      isFocused ? "bg-white text-indigo-900 border-white placeholder:text-indigo-400" : ""
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1"
                  animate={{ opacity: isFocused ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">Ctrl+K</div>
                </motion.div>
            </div>
            </motion.div>
          )}
          
          {/* Desktop Guest Buttons */}
          {isGuest && (
            <motion.div 
              variants={itemVariants}
              className="z-10 hidden md:flex gap-3"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  asChild
                  className="bg-white text-indigo-700 hover:bg-white/90 flex gap-2 h-11"
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4" />
                    <span>Log In</span>
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  asChild
                  className="bg-indigo-900/30 text-white border border-white/20 backdrop-blur-sm hover:bg-indigo-900/40 flex gap-2 h-11"
                >
                  <Link href="/signup">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardWelcome;
