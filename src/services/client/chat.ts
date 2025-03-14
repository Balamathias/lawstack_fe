import { Chat, Message } from "@/@types/db"
import { StackResponse } from "@/@types/generics"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API_URL } from "../utils"
import { toast } from "sonner"
import { getCookie } from 'cookies-next/client'
import { getChats } from "../server/chats"
import React from "react"
import { useRouter } from "nextjs-toploader/app"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export const useCreateChat = () => {

    const router = useRouter()

    const token = getCookie('token')
    
    return useMutation({
        mutationKey: ['create-chat'],
        mutationFn: async (data: Record<string, any>) => {
            if (!token) {
                throw new Error('Authorization token is missing.');
            }
            const res = await axios.post(`${API_URL}/chats/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data as StackResponse<Chat | null>
        },
        onError: (error) => {
            console.error('Error creating chat:', error)
            toast.error(
                'Error creating chat, are you sure you are signed in?', 
                { description: error.message, action: (
                    React.createElement('button', { onClick: () => router.push('/login'), className: cn(
                        buttonVariants({
                            size: 'sm',
                            variant: 'default',
                            className: 'rounded-full'
                        })
                    ) }, 'Login')
                ) }
            )
        }
    })
}

export const useSendMessage = (chat_id: string) => {

    const token = getCookie('token')
    
    return useMutation({
        mutationKey: ['send-message'],
        mutationFn: async (data: Record<string, any>) => {
            if (!token) {
                throw new Error('Authorization token is missing.');
            }
            const res = await axios.post(`${API_URL}/chats/${chat_id}/send-and-respond/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data as StackResponse<{ user_message: Message, ai_message: Message }>
        },
        onError: (error) => {
            console.error('Error sending message:', error)
            toast.error('Error sending message, are you sure you are signed in?', { description: error.message })
        }
    })
}

export const useGetChats = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ['get_chats', params],
        queryFn: () => getChats(params),
    })
}