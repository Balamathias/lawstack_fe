"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, BookOpen, FileQuestion, Lightbulb, Scale, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Delius } from 'next/font/google'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useCreateChat } from '@/services/client/chat'
import { useRouter } from 'nextjs-toploader/app'
import LoadingOverlay from '../loading-overlay'

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
    }
}

const QuickStartOption = ({ title, description, icon, onClick, color, iconBg, tooltipContent }: QuickStartOptionProps) => {
  return (
    <motion.div
      className={cn(
        "p-6 rounded-xl cursor-pointer border backdrop-blur-sm bg-white/50 dark:bg-gray-800/50",
        "shadow-md hover:shadow-lg border-gray-100 dark:border-gray-700",
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
          <p className="text-gray-700 dark:text-gray-300 text-sm pr-4">{description}</p>
        </div>
      </div>
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent to-current" />
    </motion.div>
  )
}

const QuickStart = ({ auth }: Props) => {

  const router = useRouter()

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
      onClick: () => {
        startChat({ message: 'Start with a course' })
      },
      color: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      tooltipContent: "Perfect for exam preparation. Choose this option when studying for a specific course to identify likely exam questions, understand question patterns, and get tailored practice materials."
    },
    {
      title: 'Start with a Past Question',
      description: 'Deeply analyze past questions, get insights, predict future questions',
      icon: <FileQuestion className="h-6 w-6" />,
      onClick: () => console.log('Start with a past question clicked'),
      color: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      tooltipContent: "Ideal when you have specific exam questions to study. The assistant will break down question patterns, suggest model answers, and help you understand marking criteria and examiners' expectations."
    },
    {
      title: 'Start with a Topic',
      description: 'Get insights on a topic, predict questions, get resources',
      icon: <Lightbulb className="h-6 w-6" />,
      onClick: () => console.log('Start with a topic clicked'),
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
            <span className="text-green-500 dark:text-green-400 font-delius font-medium">LawStack Assistant</span>
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
      </div>
    </TooltipProvider>
  )
}

export default QuickStart
