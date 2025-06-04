'use client';

import { User } from '@/@types/db';
import { format } from 'date-fns';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Star, 
  TrendingUp, 
  BookOpen,
  Zap,
  Trophy,
  Target,
  Crown,
  Rocket,
  Brain,
  ChevronRight,
  Play,
  Award
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'nextjs-toploader/app';

interface WelcomeProps {
  user: User | null;
}

const DashboardWelcome = ({ user }: WelcomeProps) => {
  const router = useRouter();
  const isGuest = !user;
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(featureTimer);
  }, []);

  // Enhanced greeting with personalization
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return { text: 'Good night', icon: '🌙', color: 'from-purple-500 to-indigo-600' };
    if (hour < 12) return { text: 'Good morning', icon: '☀️', color: 'from-orange-500 to-yellow-500' };
    if (hour < 17) return { text: 'Good afternoon', icon: '🌤️', color: 'from-blue-500 to-cyan-500' };
    if (hour < 22) return { text: 'Good evening', icon: '🌅', color: 'from-orange-600 to-red-500' };
    return { text: 'Good night', icon: '🌙', color: 'from-purple-500 to-indigo-600' };
  };

  // Dynamic motivational messages
  const getMotivationalMessage = () => {
    if (isGuest) {
      return 'Transform your legal education with AI-powered learning. Join thousands of successful law students.';
    }
    
    const messages = [
      "Every case you study brings you closer to mastery.",
      "Your dedication today shapes your legal career tomorrow.",
      "Excellence in law starts with curiosity and persistence.",
      "Turn complex legal concepts into clear understanding.",
      "Build the foundation for your legal expertise."
    ];
    
    return messages[Math.floor(currentTime.getSeconds() / 12) % messages.length];
  };

  // Feature highlights for guests
  const features = [
    { icon: Brain, title: 'AI-Powered Learning', desc: 'Smart tutoring system' },
    { icon: Trophy, title: 'Expert Insights', desc: 'Learn from top lawyers' },
    { icon: Target, title: 'Personalized Path', desc: 'Tailored to your goals' },
    { icon: Rocket, title: 'Fast Progress', desc: 'Accelerated learning' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      filter: 'blur(10px)' 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 3, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const greeting = getGreeting();

  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background/95 h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
        <div className="h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl shadow-2xl border border-primary/30 backdrop-blur-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >      {/* Beautiful Starry Night Sky Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep space gradient foundation */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900 to-secondary" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-card to-secondary" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-primary/5 to-primary/10" />
        
        {/* Animated aurora effects */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            background: [
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 69, 255, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 80% 60%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 40% 30%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 69, 255, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Twinkling stars layer 1 - Large stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={`star-large-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Twinkling stars layer 2 - Medium stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={`star-medium-${i}`}
              className="absolute w-0.5 h-0.5 bg-blue-100 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>
        
        {/* Twinkling stars layer 3 - Small stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 120 }).map((_, i) => (
            <motion.div
              key={`star-small-${i}`}
              className="absolute w-px h-px bg-slate-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 1.5 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
        
        {/* Shooting stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`shooting-star-${i}`}
              className="absolute w-1 h-px bg-gradient-to-r from-white via-blue-200 to-transparent"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 30}%`,
                rotate: '135deg',
              }}
              animate={{
                x: [0, 200],
                opacity: [0, 1, 0],
                scaleX: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 8 + Math.random() * 15,
                ease: "easeOut",
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>
        
        {/* Floating celestial orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-transparent blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/5 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400/15 via-violet-400/8 to-transparent blur-lg"
            animate={{
              y: [0, 15, 0],
              x: [0, -8, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        
        {/* Nebula clouds */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] 
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
          style={{ 
            backgroundImage: `
              radial-gradient(ellipse 100% 100% at 20% 80%, rgba(139, 69, 255, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 80% 80% at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 60% 60% at 40% 40%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)
            `, 
            backgroundSize: '400% 400%'
          }} 
        />
        
        {/* Magical shimmer effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ 
            x: ['-100%', '100%'] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'easeInOut',
            repeatDelay: 6
          }}
        />
        
        {/* Gradient overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
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
          >            {/* Enhanced greeting text */}
            <div className="flex items-center gap-3 mb-2">
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {greeting.icon}
              </motion.span>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border",
                "bg-gradient-to-r opacity-90",
                greeting.color,
                "text-white border-white/20"
              )}>
                Live • {format(currentTime, 'HH:mm')}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-1">
              {greeting.text},{' '}
              <span className="relative">
                <span className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r animate-gradient-shift",
                  greeting.color
                )}>
                  {isGuest ? 'Future Lawyer' : user?.first_name || user?.username || 'Student'}
                </span>
                {/* Decorative underline */}
                <motion.span 
                  className={cn(
                    "absolute -bottom-1 left-0 h-1 bg-gradient-to-r rounded-full",
                    greeting.color
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </span>
            </h1>            
            <motion.p 
              className="text-muted-foreground max-w-lg relative text-base leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {getMotivationalMessage()}
              {/* Decorative accent */}
              <span className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-primary/60 to-transparent rounded-full hidden sm:block" />
            </motion.p>

            {/* Enhanced feature highlights for guests */}
            {isGuest && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <AnimatePresence mode="wait">
                    {features.slice(0, 4).map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        className={cn(
                          "p-3 rounded-xl border backdrop-blur-sm transition-all duration-300",
                          "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
                          activeFeature === index ? "border-primary/40 shadow-lg shadow-primary/10" : "hover:border-primary/30"
                        )}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          scale: activeFeature === index ? 1.02 : 1,
                          y: activeFeature === index ? -2 : 0
                        }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "p-1.5 rounded-lg",
                            activeFeature === index 
                              ? "bg-primary/20 text-primary" 
                              : "bg-primary/10 text-primary/70"
                          )}>
                            <feature.icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">{feature.title}</p>
                            <p className="text-xs text-muted-foreground">{feature.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            
            {isGuest && (
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Enhanced glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow" />
                  <Button 
                    asChild 
                    size="lg"
                    className="relative overflow-hidden group shadow-xl border-0"
                  >
                    <Link href="/login">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 transition-all duration-500" />
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-center gap-2 z-10 font-medium">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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
                    size="lg"
                    className="border-primary/30 shadow-lg hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm"
                  >
                    <Link href="/register" className="flex items-center gap-2 font-medium">
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
          >            {!isGuest ? (
              <div className="flex flex-col items-end gap-4 relative">
                {/* User Achievement Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-3 mb-3 hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="text-center p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-600">47</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Cases</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-bold text-blue-600">92%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Crown className="h-3 w-3 text-purple-600" />
                      <span className="text-xs font-bold text-purple-600">12</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                </motion.div>

                {/* Enhanced avatar with better glow effect */}
                <div className="flex items-center gap-4 relative">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20 blur-md opacity-80 animate-pulse-glow" />
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-background shadow-xl">
                        <AvatarImage src={user?.avatar || ''} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                          {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status indicator */}
                      <motion.div 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 shadow-lg border-2 border-background flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* User info and action */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {user?.first_name} {user?.last_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          <Star className="h-2.5 w-2.5 mr-1" />
                          Pro Student
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Enhanced action button */}
                    <div className="hidden sm:block relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-primary/20 rounded-xl blur-sm opacity-60 hover:opacity-80 transition-opacity duration-300" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/dashboard/chat')}
                        className="px-3 gap-2 text-primary hover:bg-primary/10 group relative backdrop-blur-sm"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="font-medium">Continue Learning</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-end gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* Today's inspiration for guests */}
                <div className="text-right mb-3">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-medium text-primary">Today's Focus</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground max-w-xs">
                    "Legal excellence through consistent practice"
                  </p>
                </div>

                {/* Enhanced date display */}
                <div className="flex items-center p-4 px-5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm border border-primary/30 shadow-lg">
                  <div className="flex items-center gap-3 text-sm">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Calendar className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-primary">
                        {format(currentTime, 'EEEE')}
                      </p>
                      <p className="text-xs text-primary/70">
                        {format(currentTime, 'MMMM do, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>        {/* Enhanced action button for authenticated users (mobile only) */}
        {!isGuest && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-8 sm:hidden"
          >
            <div className="relative group">
              {/* Enhanced mobile glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 rounded-2xl blur-xl opacity-70 group-active:opacity-90 transition-all duration-500" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/80 to-primary/60 rounded-xl blur-lg opacity-60 group-active:opacity-80 transition-all duration-300" />
              
              <Button
                size="lg"
                className="w-full gap-3 relative bg-gradient-to-r from-primary via-primary/95 to-primary hover:from-primary/95 hover:to-primary font-semibold text-base py-4 h-auto rounded-xl shadow-2xl border-0 overflow-hidden group"
                onClick={() => router.push('/dashboard/courses')}
              >
                {/* Button background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                
                {/* Button content */}
                <div className="relative flex items-center gap-3 z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Play className="h-5 w-5 fill-current" />
                  </motion.div>
                  <span>Continue Learning Journey</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
                
                {/* Sparkle effects */}
                <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-700" />
                <div className="absolute top-4 left-1/3 w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse delay-300" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Enhanced quick stats for authenticated users (mobile) */}
        {!isGuest && (
          <motion.div
            className="mt-8 grid grid-cols-3 gap-3 sm:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div 
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/8 border border-primary/25 backdrop-blur-sm relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Starry accent */}
              <div className="absolute top-1 right-2 w-1 h-1 bg-primary/60 rounded-full animate-pulse" />
              <Award className="h-6 w-6 mx-auto mb-2 text-primary drop-shadow-sm" />
              <p className="text-lg font-bold text-foreground">47</p>
              <p className="text-xs text-muted-foreground font-medium">Cases Solved</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/8 border border-emerald-500/25 backdrop-blur-sm relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Starry accent */}
              <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-emerald-400/60 rounded-full animate-pulse delay-500" />
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-emerald-600 drop-shadow-sm" />
              <p className="text-lg font-bold text-emerald-600">92%</p>
              <p className="text-xs text-muted-foreground font-medium">Success Rate</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/8 border border-blue-500/25 backdrop-blur-sm relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Starry accent */}
              <div className="absolute bottom-2 right-1 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-pulse delay-1000" />
              <Zap className="h-6 w-6 mx-auto mb-2 text-blue-600 drop-shadow-sm" />
              <p className="text-lg font-bold text-blue-600">12</p>
              <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
            </motion.div>
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
