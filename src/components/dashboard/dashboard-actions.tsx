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
  ArrowRight
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
    delay: 0.1,
  },
  {
    title: 'Quizzes',
    description: 'Test your knowledge with AI-powered quizzes.',
    icon: BrainCircuit,
    href: '/dashboard/quizzes',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-amber-600/20 hover:to-amber-400/20',
    delay: 0.2,
  },
  {
    title: 'Smart Assist',
    description: 'Chat with LawStack AI for personalized help.',
    icon: Sparkles,
    href: '/dashboard/chat',
    color: 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20 dark:text-violet-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-violet-600/20 hover:to-violet-400/20',
    delay: 0.3,
  },
  {
    title: 'Past Questions',
    description: 'Access previous exam questions.',
    icon: FileQuestion,
    href: '/dashboard/past-questions',
    color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-emerald-600/20 hover:to-emerald-400/20',
    delay: 0.4,
  },
  {
    title: 'Bookmarks',
    description: 'Access your saved resources.',
    icon: BookMarked,
    href: '/dashboard/bookmarks',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-pink-600/20 hover:to-pink-400/20',
    delay: 0.5,
  },
  {
    title: 'Search',
    description: 'Find specific content across resources.',
    icon: Search,
    href: '/dashboard/search',
    color: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-teal-600/20 hover:to-teal-400/20',
    delay: 0.6,
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
        <h2 className="text-xl font-bold text-foreground">Features & Tools</h2>
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
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                delay: action.delay 
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={cn(
                'relative overflow-hidden rounded-xl cursor-pointer border transition-all',
                'bg-card dark:bg-card/40 backdrop-blur-sm hover:shadow-md',
                isCurrentPath ? 'border-primary/30 shadow' : 'border-border/60',
                action.hoverGradient
              )}
              onClick={() => router.push(action.href)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Accent top border with animate-in effect */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1 transform origin-left",
                "bg-gradient-to-r from-primary/40 via-primary to-primary/40",
                isHovered || isCurrentPath ? "scale-x-100" : "scale-x-0",
                "transition-transform duration-300 ease-out"
              )} />
              
              {/* Current page indicator */}
              {isCurrentPath && (
                <div className="absolute top-3 right-3 rounded-full h-2 w-2 bg-primary" />
              )}
              
              {/* Card content */}
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className={cn(
                      "p-3 w-min rounded-lg transition-transform duration-300",
                      action.color,
                      (isHovered || isCurrentPath) && "scale-110"
                    )}>
                      <action.icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <h3 className={cn(
                    "font-semibold text-lg mb-1.5 transition-colors duration-300",
                    (isHovered || isCurrentPath) ? "text-primary" : "text-foreground"
                  )}>
                    {action.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground flex-1">
                    {action.description}
                  </p>
                  
                  <motion.div 
                    className="flex items-center gap-1 text-sm font-medium mt-4 text-primary"
                    initial={{ opacity: 0.8 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0.8, 
                      x: isHovered ? 5 : 0 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.div>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 bg-gradient-to-br from-foreground/20 to-foreground/5"></div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DashboardAction;
