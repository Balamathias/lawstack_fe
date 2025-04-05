"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  BookOpen, 
  FileQuestion, 
  Lightbulb, 
  Scale, 
  Info, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  Sparkles,
  Brain,
  GraduationCap,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Delius } from 'next/font/google'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useCreateChat } from '@/services/client/chat'
import { useRouter } from 'nextjs-toploader/app'
import LoadingOverlay from '../loading-overlay'
import CourseSelector from '../courses/course-selector'
import PastQuestionSelector from '../questions/past-question-selector'
import { useSearchParams } from 'next/navigation'
import RecentChats from './recent-chats'
import { User } from '@/@types/db'
import { Button } from '../ui/button'
import Link from 'next/link'
import ChatHistory from './chat-history'

const delius = Delius({weight: ['400'], subsets: ['latin'], variable: '--font-delius'})

interface QuickStartOptionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  accentColor: string
  disabled?: boolean
  index: number
  highlight?: boolean
}

interface Props {
  params?: Promise<{[key: string]: any}>,
  searchParams?: Promise<{[key: string]: any}>,
  auth?: {
    token: string
  },
  user: User | null,
  chat_id?: string
}

const QuickStartOption = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  accentColor, 
  disabled = false,
  index,
  highlight = false
}: QuickStartOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl shadow-sm transition-all",
        "border border-border hover:border-primary/30 dark:hover:border-primary/40",
        "bg-card/50 backdrop-blur-sm hover:shadow-lg dark:bg-card/40",
        disabled ? "opacity-60 pointer-events-none" : "cursor-pointer",
        "group h-full",
        highlight ? "ring-2 ring-primary/20 bg-primary/[0.03]" : ""
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Highlight gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left" />

      {highlight && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full border border-primary/20">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] sm:text-xs">Recommended</span>
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-7 flex flex-col h-full justify-between relative z-10">
        <div>
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className={cn(
              "p-2 sm:p-3 rounded-xl transition-all duration-300 bg-primary/10 text-primary",
              "group-hover:bg-primary/15 group-hover:scale-105",
              "border border-primary/10 group-hover:border-primary/25"
            )}>
              {React.cloneElement(icon as React.ReactElement)}
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn(
                    "text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full p-1 sm:p-1.5 transition-colors",
                    "bg-card/80 backdrop-blur-sm hover:bg-card/90 border border-border hover:border-primary/30"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info size={12} className="sm:w-4 sm:h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="max-w-[260px] text-xs bg-card/95 backdrop-blur-md border shadow-lg font-normal rounded-xl p-3 text-muted-foreground"
                sideOffset={10}
              >
                {description}
              </TooltipContent>
            </Tooltip>
          </div>
          
          <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm pr-2 sm:pr-4 line-clamp-2 mt-1">{description}</p>
        </div>
        
        <motion.div 
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium mt-3 sm:mt-4 text-primary"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>Get Started</span>
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -bottom-20 -right-20 rounded-full w-40 sm:w-60 h-40 sm:h-60 bg-primary/5 opacity-50 dark:opacity-20"
        animate={{ 
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? 10 : 0,
          opacity: isHovered ? (0.7) : (0.5)
        }}
        transition={{ duration: 0.5 }}
      />
      
      <motion.div 
        className="absolute top-1/3 right-0 opacity-5 h-20 sm:h-40 w-20 sm:w-40 -translate-y-1/2 translate-x-1/2"
        animate={{ 
          rotate: isHovered ? 15 : 0,
          scale: isHovered ? 1.2 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        {React.cloneElement(icon as React.ReactElement,)}
      </motion.div>
    </motion.div>
  )
}

const GuestPrompt = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl overflow-hidden mb-6 sm:mb-10 border border-primary/20 bg-card/60 shadow-md backdrop-blur-sm"
    >
      <div className="p-4 sm:p-6 md:p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 sm:w-60 h-40 sm:h-60 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center relative z-10">
          <div className="p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 self-start">
            <Scale className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          
          <div className="flex-1 space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold">Welcome to LawStack Assistant</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Sign in to access the full features of LawStack, including saving your conversations, creating personalized quizzes, and tracking your progress across different legal courses.
            </p>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  onClick={onLoginClick}
                  className="flex gap-2 rounded-xl text-sm sm:text-base"
                >
                  <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Log In</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  variant="outline" 
                  asChild
                  className="flex gap-2 border-primary/20 text-primary rounded-xl text-sm sm:text-base"
                  size="default"
                >
                  <Link href="/register">
                    <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Register</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickStart = ({ user, chat_id }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const { mutate: startChat, isPending } = useCreateChat()
  const isGuest = !user;
  
  const handleLoginClick = () => {
    router.push('/login?next=/dashboard/chat');
  };
    
  const options = [
    {
      title: 'Open-ended Chat',
      description: 'Chat with LawStack Assistant about any legal topic, current events, or study concepts.',
      icon: <MessageSquare />,
      onClick: () => {
        if (isGuest) {
          handleLoginClick();
          return;
        }
        
        startChat({ title: 'New conversation', chat_type: 'general' }, {
          onSuccess: (data) => {
            if (data.error) {
              console.error('Error starting chat:', data.error)
              return
            }
            router.push(`/dashboard/chat/${data?.data?.id}`)
          }
        })
      },
      accentColor: "emerald",
      highlight: true
    },
    {
      title: 'Course-Specific Chat',
      description: 'Get help with a specific course, including question predictions, mock scenarios, and pattern analysis.',
      icon: <BookOpen />,
      onClick: () => isGuest ? handleLoginClick() : setIsCourseModalOpen(true),
      accentColor: "blue",
      highlight: true,
    },
    {
      title: 'Analyze Past Question',
      description: 'Upload or select a past question to receive deep analysis, answer guidance, and related concept exploration.',
      icon: <FileQuestion />,
      onClick: () => isGuest ? handleLoginClick() : setIsQuestionModalOpen(true),
      accentColor: "purple",
    },
    {
      title: 'Generate Practice Quiz',
      description: 'Create a customized quiz to test your knowledge on any legal topic or course material.',
      icon: <Brain />,
      onClick: () => isGuest ? handleLoginClick() : router.push(`/dashboard/quizzes`),
      accentColor: "amber",
    }
  ]

  return (
    <TooltipProvider delayDuration={300}>
      {isPending && <LoadingOverlay />}
      
      <div className={cn("w-full max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-4 relative min-h-[80vh] flex flex-col gap-6 sm:gap-8", delius.variable)}>
        <div className="flex justify-end">
          <ChatHistory 
            user={user} 
            currentChatId={chat_id}
            trigger={
              <Button variant="outline" size="sm" className="flex items-center gap-2 mb-2 sm:mb-4 text-xs sm:text-sm">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Chat History</span>
              </Button>
            }
          />
        </div>
        
        <div className="relative z-10 w-full flex flex-col flex-1 gap-4 sm:gap-5">
          {/* Header with animated entry */}
          <motion.div 
            className="text-center mb-6 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-primary/10 p-2 sm:p-3 rounded-xl border border-primary/20"
              >
                <Wand2 size={24} className="sm:w-[30px] sm:h-[30px] text-primary" />
              </motion.div>
              <motion.span 
                className="text-primary font-delius font-medium text-lg sm:text-xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                LawStack AI
              </motion.span>
            </div>
            
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Your Legal Learning Assistant
            </motion.h2>
            
            <motion.p
              className="text-sm sm:text-base text-muted-foreground px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Choose how you'd like to engage with our AI assistant for personalized legal education and guidance
            </motion.p>
          </motion.div>
          
          {/* Guest prompt if user is not logged in */}
          {isGuest && <GuestPrompt onLoginClick={handleLoginClick} />}
          
          {/* Main options grid with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-10">
            {options.map((option, index) => (
              <QuickStartOption 
                key={option.title} 
                {...option} 
                index={index}
                disabled={isGuest && index > 0} // Allow first option for guests as a teaser
                highlight={option.highlight}
              />
            ))}
          </div>

          {/* Recent chats section with animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="py-3 sm:py-5"
          >
            {!isGuest && (
              <RecentChats 
                user={user} 
                currentChatId={chat_id} 
              />
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Course Selector Modal */}
      <CourseSelector 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)} 
      />
      
      {/* Past Question Selector Modal */}
      <PastQuestionSelector
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />
    </TooltipProvider>
  )
}

export default QuickStart
