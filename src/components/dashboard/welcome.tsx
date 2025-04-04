'use client';

import { User } from '@/@types/db';
import { format } from 'date-fns';
import { Search, Calendar, Clock, Sparkles, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'nextjs-toploader/app';

interface WelcomeProps {
  user: User | null;
}

const DashboardWelcome = ({ user }: WelcomeProps) => {
  const router = useRouter();
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
      {/* Background with theme-aware gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 dark:from-primary/10 dark:via-primary/5 dark:to-background backdrop-blur-[2px]" />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating circles */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"
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
          className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"
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
        
        {/* Light pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(var(--primary),0.1),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,rgba(var(--primary),0.05),transparent)]"></div>
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:8px_8px]"></div>
        </div>
      </div>
      
      <div className="relative z-10 px-6 py-8 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Left content - greeting and profile */}
          <motion.div variants={itemVariants} className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <div className="flex gap-1 items-center">
                <Calendar className="h-3.5 w-3.5" />
                <span>{today}</span>
              </div>
              <span>•</span>
              <div className="flex gap-1 items-center">
                <Clock className="h-3.5 w-3.5" />
                <span>{format(new Date(), 'h:mm a')}</span>
              </div>
            </div>
            
            {isGuest ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {getGreeting()}, <span className="text-primary">Guest</span>
                </h1>
                
                <p className="text-muted-foreground max-w-md">
                  Welcome to LawStack, your intelligent legal education platform. Sign in to access personalized features.
                </p>
                
                <div className="flex flex-wrap gap-3 pt-3">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      asChild
                      className="gap-2"
                      size="lg"
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
                      variant="outline"
                      className="gap-2 border-primary/20 text-primary"
                      size="lg"
                    >
                      <Link href="/register">
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={user?.avatar || ''} />
                      <AvatarFallback>
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      {getGreeting()}, <span className="text-primary">{user?.first_name || user?.username || 'Student'}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Continue your legal learning journey with personalized resources.
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
          
          {/* Right content - search or CTA */}
          {!isGuest && (
            <motion.div 
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-card dark:bg-card/80 border border-primary/10 p-6 rounded-lg">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                    <h3 className="font-medium text-sm">Continue Learning</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Pick up where you left off</p>
                  
                  <div className="mt-3 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start h-auto py-2 px-3 hover:bg-primary/10 hover:text-primary text-left"
                      onClick={() => router.push('/dashboard/courses')}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Your Courses</span>
                        <span className="text-xs text-muted-foreground">Continue learning</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="justify-start h-auto py-2 px-3 hover:bg-primary/10 hover:text-primary text-left"
                      onClick={() => router.push('/dashboard/chat')}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">AI Assistant</span>
                        <span className="text-xs text-muted-foreground">Get help with your studies</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardWelcome;
