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
  UserPlus 
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

const delius = Delius({weight: ['400'], subsets: ['latin'], variable: '--font-delius'})

interface QuickStartOptionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  color: string
  iconBg: string
  tooltipContent: string
  disabled?: boolean
  gradientFrom?: string
  gradientTo?: string
  index: number
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
  color, 
  iconBg, 
  tooltipContent, 
  disabled = false,
  gradientFrom = "from-white/5",
  gradientTo = "to-white/15",
  index
}: QuickStartOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl md:h-[200px] cursor-pointer",
        disabled ? "opacity-60 pointer-events-none" : "",
        `bg-gradient-to-br ${gradientFrom} ${gradientTo} backdrop-blur-sm border border-white/10`,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-6 flex flex-col h-full justify-between relative z-10">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className={cn(
              "p-3 rounded-lg transition-all duration-300",
              iconBg,
              isHovered ? "scale-110" : ""
            )}>
              {icon}
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn(
                    "text-gray-400 hover:text-gray-200 flex items-center justify-center rounded-full p-1.5 transition-colors",
                    "bg-black/10 backdrop-blur-sm border border-white/10"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="max-w-[260px] text-xs bg-black/80 backdrop-blur-md border border-white/10 shadow-xl text-white/90 font-normal"
              >
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </div>
          
          <h3 className={cn("font-medium text-lg mb-2 line-clamp-1", color)}>{title}</h3>
          <p className="text-white/70 text-sm pr-4 line-clamp-2">{description}</p>
        </div>
        
        <motion.div 
          className="flex items-center gap-1 text-sm font-medium mt-2"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div 
        className={cn(
          "absolute -bottom-10 -right-10 rounded-full opacity-20 w-40 h-40 transition-all duration-500",
          isHovered ? "scale-125 rotate-[15deg] opacity-30" : "rotate-0"
        )}
        style={{ backgroundColor: color.includes('text-') ? color.replace('text-', 'rgb(var(--color-') + ' / 0.2)' : color }}
      />
      
      <motion.div 
        className="absolute top-1/2 right-0 opacity-10 h-40 w-40 -translate-y-1/2 translate-x-1/2"
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
      className="rounded-xl overflow-hidden mb-10 border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
        
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center relative z-10">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 self-start">
            <Scale className="h-10 w-10 text-primary/80" />
          </div>
          
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold">Welcome to LawStack Assistant</h3>
            <p className="text-muted-foreground max-w-xl">
              Sign in to access the full features of LawStack, including saving your conversations, creating personalized quizzes, and tracking your progress across different legal courses.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  onClick={onLoginClick}
                  className="bg-primary text-white flex gap-2"
                  size="lg"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  variant="outline" 
                  asChild
                  className="flex gap-2 border-primary/20 text-primary"
                  size="lg"
                >
                  <Link href="/signup">
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
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

const QuickStart = ({ auth, user, chat_id }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const { mutate: startChat, isPending } = useCreateChat()
  const isGuest = !user;
  
  const handleLoginClick = () => {
    router.push('/login');
  };
    
  const options = [
    {
      title: 'Start a Chat',
      description: 'Start a chat with LawStack Assistant on any topic including current happenings.',
      icon: <MessageSquare className="h-6 w-6" />,
      onClick: () => {
        if (isGuest) {
          handleLoginClick();
          return;
        }
        
        startChat({ title: 'New chat', chat_type: 'general' }, {
          onSuccess: (data) => {
            console.log('Chat started:', data)
            if (data.error) {
              console.error('Error starting chat:', data.error)
              return
            }
            router.push(`/dashboard/chat/${data?.data?.id}`)
          }
        })
      },
      color: "text-emerald-400",
      iconBg: "bg-emerald-950/40 text-emerald-400",
      tooltipContent: "Best for general legal questions and exploratory conversations. Use this when you want open-ended guidance or have multiple topics to discuss with minimal structure.",
      gradientFrom: "from-emerald-950/30",
      gradientTo: "to-emerald-900/40"
    },
    {
      title: 'Start with a Course',
      description: 'Predict past questions, get mock past questions, analyze patterns',
      icon: <BookOpen className="h-6 w-6" />,
      onClick: () => isGuest ? handleLoginClick() : setIsCourseModalOpen(true),
      color: "text-blue-400",
      iconBg: "bg-blue-950/40 text-blue-400",
      tooltipContent: "Perfect for exam preparation. Choose this option when studying for a specific course to identify likely exam questions, understand question patterns, and get tailored practice materials.",
      gradientFrom: "from-blue-950/30",
      gradientTo: "to-blue-900/40"
    },
    {
      title: 'Start with a Past Question',
      description: 'Deeply analyze past questions, get insights, predict future questions',
      icon: <FileQuestion className="h-6 w-6" />,
      onClick: () => isGuest ? handleLoginClick() : setIsQuestionModalOpen(true),
      color: "text-purple-400",
      iconBg: "bg-purple-950/40 text-purple-400",
      tooltipContent: "Ideal when you have specific exam questions to study. The assistant will break down question patterns, suggest model answers, and help you understand marking criteria and examiners' expectations.",
      gradientFrom: "from-purple-950/30",
      gradientTo: "to-purple-900/40"
    },
    {
      title: 'Take a Quiz on any Course',
      description: 'Get AI quizzes based on previous past-questions and set the grounds for success',
      icon: <Lightbulb className="h-6 w-6" />,
      onClick: () => isGuest ? handleLoginClick() : router.push(`/dashboard/quizzes`),
      color: "text-amber-400",
      iconBg: "bg-amber-950/40 text-amber-400",
      tooltipContent: "Best for deep-diving into specific legal concepts. Select this to explore a particular area of law in depth, access comprehensive resources, and understand how the topic might appear in examinations.",
      gradientFrom: "from-amber-950/30",
      gradientTo: "to-amber-900/40"
    }
  ]

  return (
    <TooltipProvider delayDuration={300}>
      {isPending && <LoadingOverlay />}
      
      <div className={cn("w-full max-w-5xl mx-auto py-8 px-4 relative min-h-[80vh]", delius.variable)}>
        <div className="relative z-10">
          {/* Header with animated entry */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-primary/10 p-2 rounded-full"
              >
                <Scale size={28} className="text-primary" />
              </motion.div>
              <motion.span 
                className="text-primary font-delius font-medium text-xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                LawStack Assistant
              </motion.span>
            </div>
            
            <motion.h2 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Your Legal Learning Partner
            </motion.h2>
            
            <motion.p
              className="text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Choose how you'd like to engage with our AI assistant for personalized legal education
            </motion.p>
          </motion.div>
          
          {/* Guest prompt if user is not logged in */}
          {isGuest && <GuestPrompt onLoginClick={handleLoginClick} />}
          
          {/* Main options grid with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {options.map((option, index) => (
              <QuickStartOption 
                key={option.title} 
                {...option} 
                index={index}
                disabled={isGuest && index > 0} // Allow first option for guests as a teaser
              />
            ))}
          </div>

          {/* Recent chats section with animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className='py-5'
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
