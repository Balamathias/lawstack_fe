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
      className="relative overflow-hidden rounded-2xl shadow-lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced background with layered elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/30 to-primary/15 dark:from-primary/20 dark:via-primary/15 dark:to-background/80 backdrop-blur-[2px]" />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 overflow-hidden mix-blend-soft-light opacity-30 dark:opacity-20">
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNFptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large glowing orbs */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-primary/15 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Decorative geometric shapes */}
        <motion.div 
          className="absolute top-12 right-[20%] w-20 h-20 border-2 border-primary/20 rounded-lg rotate-12 opacity-50"
          animate={{ 
            rotate: [12, 24, 12],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-12 left-[25%] w-16 h-16 border-2 border-primary/20 rounded-full opacity-50"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Light sparkles/dots */}
        <motion.div 
          className="absolute top-[30%] left-[10%] w-2 h-2 bg-primary/40 rounded-full"
          animate={{ 
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-[20%] right-[30%] w-3 h-3 bg-primary/30 rounded-full"
          animate={{ 
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-primary/40 rounded-full"
          animate={{ 
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100px_100px,rgba(var(--primary),0.15),transparent)] dark:bg-[radial-gradient(circle_800px_at_100px_100px,rgba(var(--primary),0.08),transparent)]"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 px-6 py-8 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Left content - greeting and profile */}
          <motion.div variants={itemVariants} className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 text-sm bg-primary/10 dark:bg-primary/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20 text-primary-foreground dark:text-primary/90 shadow-sm">
              <div className="flex gap-1 items-center">
                <Calendar className="h-3.5 w-3.5" />
                <span>{today}</span>
              </div>
              <span className="text-primary-foreground/50">•</span>
              <div className="flex gap-1 items-center">
                <Clock className="h-3.5 w-3.5" />
                <span>{format(new Date(), 'h:mm a')}</span>
              </div>
            </div>
            
            {isGuest ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
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
                      className="gap-2 shadow-lg shadow-primary/20"
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
                      className="gap-2 border-primary/20 bg-background/50 backdrop-blur-sm text-primary"
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
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary to-primary/30 rounded-full blur-sm opacity-50"></div>
                    <Avatar className="h-14 w-14 border-2 border-primary/20 relative shadow-xl">
                      <AvatarImage src={user?.avatar || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {getGreeting()}, <span className="text-primary">{user?.first_name || user?.username || 'Student'}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Continue your legal learning journey with personalized resources.
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
          
          {/* Right content - Quick actions card */}
          {!isGuest && (
            <motion.div 
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-primary/40 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-card dark:bg-background/80 border border-primary/10 p-6 rounded-lg backdrop-blur-sm shadow-lg">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="p-2 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                    <h3 className="font-medium text-sm">Continue Learning</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Pick up where you left off</p>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start h-auto py-2 px-3 hover:bg-primary/10 hover:text-primary text-left group"
                      onClick={() => router.push('/dashboard/courses')}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                          Your Courses
                        </span>
                        <span className="text-xs text-muted-foreground">Continue learning</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="justify-start h-auto py-2 px-3 hover:bg-primary/10 hover:text-primary text-left group"
                      onClick={() => router.push('/dashboard/chat')}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                          AI Assistant
                        </span>
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
