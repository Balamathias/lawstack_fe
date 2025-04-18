'use client'

import { Course, User } from '@/@types/db'
import { Button } from '@/components/ui/button'
import { useCreateChat } from '@/services/client/chat'
import { MessagesSquare, Loader } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import { toast } from 'sonner'

interface Props {
    course: Course | null,
    user: User | null
}

const OpenChatButton = ({ course, user }: Props) => {
  const router = useRouter()
  const { mutate: createChat, isPending } = useCreateChat()
  const handleClick = () => {
    if (!course || !user) return

    createChat({
        title: `Course: ${course?.name} (${course?.code})`,
        chat_type: 'course_specific',
        course: course?.id
    }, {
        onSuccess: (data) => {
            router.push(`/dashboard/chat/${data?.data?.id}`)
        },
        onError: (error) => {
            console.error('Error creating chat:', error)
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
        className="bg-indigo-500/90 hover:bg-indigo-500 text-white shadow-md border border-indigo-500/10 gap-2 transition-all"
    >
        {isPending ? (
            <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Opening...</span>
            </>
        ) : (
            <>
                <MessagesSquare className="h-4 w-4" />
                <span>Open Chat</span>
            </>
        )}
    </Button>
  )
}

export default OpenChatButton