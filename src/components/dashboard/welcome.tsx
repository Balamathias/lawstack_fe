'use client';

import { User } from '@/@types/db';
import { format } from 'date-fns';
import { LogIn, UserPlus, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import React from 'react';
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
  const isGuest = !user;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-md border border-primary/20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced background elements with stronger primary color */}
      <div className="absolute inset-0">
        {/* More vibrant base background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/20 to-background/95" />
        
        {/* Animated floating SVG blobs with enhanced visibility */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary blob - top right with enhanced color */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-1/2 opacity-25 dark:opacity-20"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-primary/60">
              <path d="M46.5,-59.5C59.9,-45.7,70.2,-30.9,75.2,-13.8C80.2,3.3,79.9,22.8,71.8,38.5C63.7,54.1,47.8,66,30.8,70.4C13.8,74.7,-4.4,71.6,-22.2,66.1C-40,60.6,-57.5,52.7,-66.7,39C-75.9,25.2,-76.8,5.5,-72.8,-12.5C-68.7,-30.4,-59.7,-46.7,-46.6,-60.4C-33.5,-74.1,-16.8,-85.3,-0.3,-84.9C16.2,-84.5,33.1,-73.4,46.5,-59.5Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
          
          {/* Secondary blob - bottom left with enhanced color */}
          <motion.div
            className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-25 dark:opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -2, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-primary/60">
              <path d="M43.2,-50.2C58.3,-36.7,74.3,-25.1,79.9,-9.2C85.5,6.7,80.8,26.8,69.2,40.8C57.5,54.8,39,62.5,19.7,68.1C0.5,73.7,-19.6,77.1,-36.5,70.7C-53.4,64.4,-67,48.4,-73,30.3C-79.1,12.3,-77.5,-7.7,-69.4,-23.9C-61.2,-40,-46.5,-52.3,-31.4,-65.7C-16.2,-79.1,-0.6,-93.8,10.8,-89.3C22.3,-84.8,28.1,-63.8,43.2,-50.2Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
          
          {/* Tertiary blob - middle with enhanced color */}
          <motion.div
            className="absolute top-1/3 left-1/4 w-1/4 h-1/4 opacity-20 dark:opacity-15"
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-primary/50">
              <path d="M47.7,-51.2C61.3,-33.5,71.4,-16.7,71.4,0C71.4,16.7,61.3,33.5,47.7,47.4C34.1,61.3,17,72.5,-2.4,74.9C-21.7,77.4,-43.5,71.1,-57.1,57.1C-70.7,43.2,-76.1,21.6,-75.1,0.9C-74.1,-19.7,-66.7,-39.4,-53.1,-57.2C-39.4,-74.9,-19.7,-90.6,-1.5,-89.1C16.7,-87.6,33.5,-68.9,47.7,-51.2Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
        </div>
        
        {/* Enhanced dot pattern with better visibility */}
        <div 
          className="absolute inset-0 opacity-[0.10] dark:opacity-[0.12]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0'
          }} 
        />

        {/* Enhanced linear pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)', 
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Enhanced radial gradient ambient effect */}
        <div className="absolute top-0 right-0 w-2/5 h-2/5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
        
        {/* Additional colorful accent */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Content with enhanced styling - unchanged */}
      <div className="relative z-10 px-4 py-10 sm:py-16 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left side - Greeting with enhanced styling */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced greeting text */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {getGreeting()},{' '}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70 animate-gradient-shift">
                  {isGuest ? 'Guest' : user?.first_name || user?.username || 'Student'}
                </span>
                {/* Decorative underline */}
                <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-primary/60 via-primary/40 to-transparent" />
              </span>
            </h1>
            
            <p className="text-muted-foreground max-w-md relative">
              {isGuest 
                ? 'Welcome to LawStack, your intelligent legal education platform.'
                : "Let's continue your legal learning journey today."}
              {/* Decorative accent */}
              <span className="absolute -left-3 top-0 h-full w-1 bg-gradient-to-b from-primary/60 to-transparent rounded-full hidden sm:block" />
            </p>
            
            {isGuest && (
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Glow effect behind button */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/80 to-primary/40 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-all duration-700" />
                  <Button 
                    asChild 
                    className="relative overflow-hidden group shadow-md"
                  >
                    <Link href="/login">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 w-full h-full bg-primary transition-opacity duration-300" />
                      <div className="relative flex items-center gap-2 z-10">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </div>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-primary/30 shadow-sm"
                  >
                    <Link href="/register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Create Account</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
          
          {/* Right side - Date or avatar with enhanced styling */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            {!isGuest ? (
              <div className="flex items-center gap-3 relative">
                {/* Enhanced avatar with better glow effect */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20 blur-md opacity-80 animate-pulse-glow" />
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-background shadow-lg">
                      <AvatarImage src={user?.avatar || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary font-medium">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Decorative accents */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary shadow-lg border-2 border-background" />
                  </div>
                </div>
                
                {/* Enhanced action button */}
                <div className="hidden sm:block relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-transparent rounded-xl blur-sm opacity-60 hover:opacity-80 transition-opacity duration-300" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard/chat')}
                    className="px-3 gap-2 text-primary hover:bg-primary/10 group relative"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Start Learning</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-3 px-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-primary/90">
                    {format(new Date(), 'EEEE, MMMM do')}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Enhanced action button for authenticated users (mobile only) */}
        {!isGuest && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-4 sm:hidden"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-primary/20 rounded-lg blur-sm opacity-70" />
              <Button
                size="sm"
                className="w-full gap-2 relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                onClick={() => router.push('/dashboard/courses')}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Start Learning</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-16 h-16 border-2 border-primary/20 rounded-full" />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-16 h-16 border-2 border-primary/20 rounded-full" />
      </div>
    </motion.div>
  );
};

export default DashboardWelcome;
