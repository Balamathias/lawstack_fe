'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  BrainCircuit,
  MessageSquare,
  FileQuestion, 
  Sparkles,
  Users,
  BookMarked,
  Search,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';

const actionItems = [
  {
    title: 'Courses',
    description: 'Explore law courses and materials.',
    icon: BookOpen,
    href: '/dashboard/courses',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-400/20',
    pattern: 'radial-gradient(circle, transparent 20%, currentColor 20%, currentColor 21%, transparent 21%, transparent) 0 0/30px 30px',
    patternColor: 'text-blue-500/[0.03] dark:text-blue-400/[0.03]',
    delay: 0.1,
    stats: {
      count: 'Study',
      label: 'Smart'
    }
  },
  {
    title: 'Quizzes',
    description: 'Test your knowledge with AI-powered quizzes.',
    icon: BrainCircuit,
    href: '/dashboard/quizzes',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-amber-600/20 hover:to-amber-400/20',
    pattern: 'linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor) 0 0/20px 20px',
    patternColor: 'text-amber-500/[0.03] dark:text-amber-400/[0.03]',
    delay: 0.2,
    stats: {
      count: 'Smart',
      label: 'CBT'
    }
  },
  {
    title: 'Smart Assistant',
    description: 'Chat with LawStack AI for personalized help.',
    icon: Sparkles,
    href: '/dashboard/chat',
    color: 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20 dark:text-violet-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-violet-600/20 hover:to-violet-400/20',
    pattern: 'radial-gradient(circle at center, currentColor 0, currentColor 1px, transparent 1px, transparent) 0 0/24px 24px',
    patternColor: 'text-violet-500/[0.03] dark:text-violet-400/[0.03]',
    delay: 0.3,
    featured: true,
    badge: 'New'
  },
  {
    title: 'Past Questions',
    description: 'Access previous exam questions.',
    icon: FileQuestion,
    href: '/dashboard/past-questions',
    color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-emerald-600/20 hover:to-emerald-400/20',
    pattern: 'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px, linear-gradient(90deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
    patternColor: 'text-emerald-500/[0.03] dark:text-emerald-400/[0.03]',
    delay: 0.4,
    stats: {
      count: 'All',
      label: 'Questions'
    }
  },
  {
    title: 'Bookmarks',
    description: 'Access your saved resources.',
    icon: BookMarked,
    href: '/dashboard/bookmarks',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-pink-600/20 hover:to-pink-400/20',
    pattern: 'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/30px 30px',
    patternColor: 'text-pink-500/[0.03] dark:text-pink-400/[0.03]',
    delay: 0.5,
    stats: {
      count: 'All',
      label: 'Saved'
    }
  },
  {
    title: 'Search',
    description: 'Find specific content across resources.',
    icon: Search,
    href: '/dashboard/search',
    color: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-teal-600/20 hover:to-teal-400/20',
    pattern: 'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%), linear-gradient(-45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
    patternColor: 'text-teal-500/[0.03] dark:text-teal-400/[0.03]',
    delay: 0.6,
    stats: {
      count: 'All',
      label: 'Resources'
    }
  },
];

const DashboardAction = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      } 
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 bg-gradient-to-b from-primary via-primary/80 to-primary/30 rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Features & Tools</h2>
        </div>
        
        <motion.button 
          className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all px-2 py-1 rounded-md hover:bg-primary/5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
      
      <motion.div 
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
        variants={container}
        initial="hidden"
        animate="show"
      >
        {actionItems.map((action, index) => {
          const isCurrentPath = pathname === action.href;
          const isHovered = hoveredIndex === index;
          
          return (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative overflow-hidden rounded-xl cursor-pointer border transition-all duration-300',
                'bg-card/80 dark:bg-card/40 backdrop-blur-sm',
                isCurrentPath ? 'ring-1 ring-primary/30 shadow-lg shadow-primary/5' : 'border-border/60',
                action.hoverGradient,
                'hover:shadow-xl hover:shadow-primary/10',
                action.featured ? 'sm:col-span-2 lg:col-span-1 md:row-span-1' : ''
              )}
              onClick={() => router.push(action.href)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Feature label for featured item */}
              {action.featured && (
                <div className="absolute top-4 right-4 bg-primary/80 text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium z-20 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              )}
              
              {/* New badge */}
              {action.badge && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-20">
                  {action.badge}
                </div>
              )}
              
              {/* Background pattern */}
              <div className={cn(
                "absolute inset-0 pointer-events-none opacity-70 transition-opacity duration-300",
                action.patternColor,
                isHovered || isCurrentPath ? 'opacity-100' : 'opacity-70',
                'text-primary/[0.03] dark:text-primary/[0.03]'
              )}>
                <div 
                  className="absolute inset-0 bg-repeat opacity-60" 
                  style={{ backgroundImage: action.pattern }}
                />
              </div>
              
              {/* Decorative shape elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 rotate-45 bg-foreground/5 rounded-lg" />
              <div className="absolute -bottom-8 -left-8 w-20 h-20 rotate-12 bg-foreground/5 rounded-full" />
              
              {/* Gradient border effect on hover/active */}
              <div className="absolute inset-0 rounded-xl p-0.5 bg-gradient-to-br from-primary/50 via-primary/20 to-transparent opacity-0 transition-opacity duration-300"
                   style={{ opacity: isHovered || isCurrentPath ? 0.7 : 0 }} />
              
              {/* Accent top border with animate-in effect */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1 transform origin-left",
                "bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30",
                isHovered || isCurrentPath ? "scale-x-100" : "scale-x-0",
                "transition-transform duration-300 ease-out z-10"
              )} />
              
              {/* Current page indicator */}
              {isCurrentPath && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 bg-primary/10 text-primary text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Current</span>
                </div>
              )}
              
              {/* Card content */}
              <div className="p-6 relative z-10 h-full flex flex-col">
                {/* Icon section */}
                <div className="mb-4">
                  <div className={cn(
                    "p-3 w-min rounded-lg transition-all duration-300 relative overflow-hidden",
                    'bg-gradient-to-br from-primary/20 to-primary/5 text-primary',
                    (isHovered || isCurrentPath) && "scale-105 shadow-md"
                  )}>
                    <motion.div
                      animate={{ 
                        rotate: isHovered ? [0, 10, 0] : 0,
                        scale: isHovered ? 1.1 : 1
                      }}
                      transition={{ duration: 0.5, ease: "easeOut", repeat: isHovered ? 1 : 0 }}
                    >
                      <action.icon className="h-6 w-6 relative z-10" />
                    </motion.div>
                    
                    {/* Icon background pattern */}
                    <div className="absolute inset-0 opacity-10 bg-repeat" 
                         style={{ backgroundImage: `radial-gradient(circle, ${isCurrentPath ? 'var(--primary)' : 'currentColor'} 1px, transparent 1px)`, backgroundSize: '6px 6px' }} />
                  </div>
                </div>
                
                {/* Title and description */}
                <div className="space-y-2 flex-1">
                  <h3 className={cn(
                    "font-semibold text-lg transition-colors duration-300 flex items-center gap-2",
                    (isHovered || isCurrentPath) ? "text-primary" : "text-foreground"
                  )}>
                    {action.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                
                {/* Stats or metrics */}
                {action.stats && (
                  <div className="mt-4 pt-3 border-t border-border/50 text-sm text-muted-foreground flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-primary">{action.stats.count}</span>
                      <span>{action.stats.label}</span>
                    </div>
                    
                    <motion.div 
                      className="flex items-center gap-1 text-sm font-medium text-primary"
                      animate={{ 
                        opacity: isHovered ? 1 : 0.7, 
                        x: isHovered ? 5 : 0 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </div>
                )}
                
                {/* Explore link for items without stats */}
                {!action.stats && (
                  <motion.div 
                    className="flex items-center gap-1 text-sm font-medium mt-4 text-primary"
                    animate={{ 
                      opacity: isHovered ? 1 : 0.7, 
                      x: isHovered ? 5 : 0 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </div>
              
              {/* Large background icon */}
              <motion.div 
                className="absolute -bottom-10 -right-10 opacity-[0.04] pointer-events-none"
                animate={{ 
                  rotate: isHovered ? 10 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                <action.icon className="h-36 w-36" />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DashboardAction;
