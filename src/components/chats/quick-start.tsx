"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, BookOpen, FileQuestion, Lightbulb, Scale, Info } from 'lucide-react'
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

const delius = Delius({weight: ['400'], subsets: ['latin'], variable: '--font-delius'})

interface QuickStartOptionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  color: string
  iconBg: string
  tooltipContent: string
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

const QuickStartOption = ({ title, description, icon, onClick, color, iconBg, tooltipContent }: QuickStartOptionProps) => {
  return (
    <motion.div
      className={cn(
        "p-6 rounded-xl cursor-pointer backdrop-blur-sm bg-white/95 dark:bg-secondary/40 ",
        "relative overflow-hidden"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4 relative z-10">
        <div className={cn("p-3 rounded-lg", iconBg, color)}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className={cn("font-medium text-lg", color)}>{title}</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn("text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center justify-center rounded-full p-1 transition-colors", color.replace('text-', 'hover:bg-').replace('dark:', 'dark:hover:bg-') + '/10')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="max-w-[260px] text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg dark:text-gray-100 font-normal"
              >
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-muted-foreground text-sm pr-4">{description}</p>
        </div>
      </div>
      {/* <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent to-current" /> */}
    </motion.div>
  )
}

const QuickStart = ({ auth, user, chat_id }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const { mutate: startChat, isPending } = useCreateChat()
    
  const options = [
    {
      title: 'Start a Chat',
      description: 'Start a chat with LawStack Assistant on any topic including current happenings.',
      icon: <MessageSquare className="h-6 w-6" />,
      onClick: () => {
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
      color: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      tooltipContent: "Best for general legal questions and exploratory conversations. Use this when you want open-ended guidance or have multiple topics to discuss with minimal structure."
    },
    {
      title: 'Start with a Course',
      description: 'Predict past questions, get mock past questions, analyze patterns',
      icon: <BookOpen className="h-6 w-6" />,
      onClick: () => setIsCourseModalOpen(true),
      color: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      tooltipContent: "Perfect for exam preparation. Choose this option when studying for a specific course to identify likely exam questions, understand question patterns, and get tailored practice materials."
    },
    {
      title: 'Start with a Past Question',
      description: 'Deeply analyze past questions, get insights, predict future questions',
      icon: <FileQuestion className="h-6 w-6" />,
      onClick: () => setIsQuestionModalOpen(true),
      color: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      tooltipContent: "Ideal when you have specific exam questions to study. The assistant will break down question patterns, suggest model answers, and help you understand marking criteria and examiners' expectations."
    },
    {
      title: 'Take a Quiz on any Course',
      description: 'Get AI quizzes based on previous past-questions and set the grounds for success',
      icon: <Lightbulb className="h-6 w-6" />,
      onClick: () => router.push(`/dashboard/quizzes`),
      color: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      tooltipContent: "Best for deep-diving into specific legal concepts. Select this to explore a particular area of law in depth, access comprehensive resources, and understand how the topic might appear in examinations."
    }
  ]

  return (
    <TooltipProvider delayDuration={300}>
        {
            isPending && <LoadingOverlay />
        }
      <div className={cn("w-full max-w-4xl mx-auto py-8 px-4 relative", delius.variable)}>
        <div className="relative z-10">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Scale size={24} className="text-green-500 dark:text-green-400" />
            <span className="text-emerald-500 dark:text-emerald-400 font-delius font-medium">LawStack Assistant</span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose how to start
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {options.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <QuickStartOption {...option} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        
        <div className='py-5'>
          <RecentChats 
            user={user} 
            currentChatId={chat_id} 
          />
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
