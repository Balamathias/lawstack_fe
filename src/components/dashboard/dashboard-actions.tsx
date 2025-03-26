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
    description: 'Explore law courses and materials',
    icon: BookOpen,
    href: '/dashboard/courses',
    color: 'from-blue-500 to-indigo-600',
    hoverColor: 'from-blue-600 to-indigo-700',
    lightColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    delay: 0.1,
  },
  {
    title: 'Quizzes',
    description: 'Test your knowledge with AI quizzes',
    icon: BrainCircuit,
    href: '/dashboard/quizzes',
    color: 'from-amber-500 to-orange-600',
    hoverColor: 'from-amber-600 to-orange-700',
    lightColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    delay: 0.2,
  },
  {
    title: 'AI Chat',
    description: 'Get answers from our legal AI assistant',
    icon: Sparkles,
    href: '/dashboard/chat',
    color: 'from-violet-500 to-purple-600',
    hoverColor: 'from-violet-600 to-purple-700',
    lightColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    delay: 0.3,
  },
  {
    title: 'Past Questions',
    description: 'Access previous exam questions',
    icon: FileQuestion,
    href: '/dashboard/past-questions',
    color: 'from-emerald-500 to-green-600',
    hoverColor: 'from-emerald-600 to-green-700',
    lightColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    delay: 0.4,
  },
  {
    title: 'Bookmarks',
    description: 'View your saved content',
    icon: BookMarked,
    href: '/dashboard/bookmarks',
    color: 'from-pink-500 to-rose-600',
    hoverColor: 'from-pink-600 to-rose-700',
    lightColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    delay: 0.5,
  },
  {
    title: 'Advanced Search',
    description: 'Find specific content across all resources',
    icon: Search,
    href: '/dashboard/search',
    color: 'from-cyan-500 to-teal-600',
    hoverColor: 'from-cyan-600 to-teal-700',
    lightColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
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
              scale: 1.03, 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            }}
            className={cn(
              'relative overflow-hidden rounded-2xl h-44 cursor-pointer bg-gradient-to-br border border-transparent',
              isCurrentPath ? `${action.hoverColor} shadow-lg` : action.color,
              isCurrentPath && 'border-white/20 shadow-xl'
            )}
            onClick={() => router.push(action.href)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Card overlay with gradient */ }
            <div className={cn(
              "absolute inset-0 transition-all duration-300",
              isHovered || isCurrentPath ? "bg-black/10" : "bg-black/20"
            )} />
            
            {/* Current page indicator */}
            {isCurrentPath && (
              <div className="absolute top-3 right-3 rounded-full h-2.5 w-2.5 bg-white/90 shadow-glow" />
            )}
            
            {/* Card content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
              <div>
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "p-2 rounded-full w-10 h-10 flex items-center justify-center mb-4",
                    action.lightColor
                  )}>
                    <action.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-1.5">{action.title}</h3>
                <p className="text-sm text-white/90">{action.description}</p>
              </div>
              
              {/* Call to action button */}
              <motion.div 
                className="flex items-center gap-1 text-sm font-medium mt-2"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <span>Get Started</span>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </div>
            
            {/* Large background icon */}
            <motion.div 
              className="absolute -bottom-8 -right-8 opacity-10"
              animate={{ 
                rotate: isHovered ? 10 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <action.icon className="h-40 w-40" />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardAction;
