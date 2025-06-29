'use client'

import { Course, Question, User } from '@/@types/db'
import { Button } from '@/components/ui/button'
import { truncateString } from '@/lib/utils'
import { useCreateChat } from '@/services/client/chat'
import { MessagesSquare, Loader } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import { toast } from 'sonner'

interface Props {
    question: Question | null,
    user: User | null
}

const OpenChatButton = ({ question, user }: Props) => {
  const router = useRouter()
  const { mutate: createChat, isPending } = useCreateChat()
  const handleClick = () => {
    if (!question || !user) return

    createChat({
        title: `New Chat`,
        chat_type: 'past_question',
        course: question?.course,
        past_question: question?.id
    }, {
        onSuccess: (data) => {
            if (data?.error) {
                if (data?.status === 401) {
                    toast.info("You are not authorized to create a chat.", {
                        description: "Please log in to create a chat.",
                    })
                } else {
                    toast.warning(data?.message, {
                        description: data?.message || "An error occurred while creating the chat.",
                    })
                }
                return
            }
            
            router.push(`/dashboard/chat/${data?.data?.id}`)
        },
        onError: (error) => {
            toast.error("Failed to create chat. Please try again.", {
                description: error?.message || "An error occurred while creating the chat.",
            })
        }
    })
    
  }
  return (
    <Button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="relative bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/20 text-white dark:text-white shadow-xl hover:shadow-2xl gap-2 transition-all duration-300 ease-out hover:scale-105 active:scale-95 rounded-xl overflow-hidden group w-full"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex items-center gap-2">
            {isPending ? (
                <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="font-medium">Opening...</span>
                </>
            ) : (
                <>
                    <MessagesSquare className="h-4 w-4" />
                    <span className="font-medium">Open Chat</span>
                </>
            )}
        </div>
    </Button>
  )
}

export default OpenChatButton