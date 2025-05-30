import { Chat, Message } from "@/@types/db"
import { StackResponse } from "@/@types/generics"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { API_URL, API_URL_V2 } from "../utils"
import { toast } from "sonner"
import { getCookie } from 'cookies-next/client'
import { getChats, deleteChat, getChatMessages } from "../server/chats"
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
            const res = await axios.post(`${API_URL}/chats/`, data, {
            // const res = await axios.post(`${API_URL}/agent/chats/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data as StackResponse<Chat | null>
        },
        onError: (error: any) => {
            console.error('Error creating chat:', error)
            if (error?.message?.includes('Authorization')) {
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
            } else {
                toast.error('Error creating chat, please try again?', { description: error.message })
            }
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
            // const res = await axios.post(`${API_URL}/agent/chats/${chat_id}/message/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data as StackResponse<{ user_message: Message, ai_message: Message }>
        },
        onError: (error) => {
            console.error('Error sending message:', error)
            toast.error('Error sending message, please try again?', { description: error.message })
        }
    })
}

export const useGetChats = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ['get_chats', params],
        queryFn: () => getChats(params),
    })
}

export const useChatMessages = (chatId: string) => {
    return useQuery({
        queryKey: ['get_chat_messages', chatId],
        queryFn: () => getChatMessages(chatId),
    })
}

export const useDeleteChat = () => {
    const token = getCookie('token')
    
    return useMutation({
        mutationKey: ['delete-chat'],
        mutationFn: async (chat_id: string) => {
            return await deleteChat(chat_id)
        },
        onError: (error) => {
            console.error('Error deleting chat:', error)
            toast.error('Error deleting chat, please try again?', { description: error.message })
        }
    })
}

/**
 * Hook to send messages in a chat
 */
// export function useChat() {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: async (params: {
//       chat_id: string;
//       content: string;
//       role: string;
//       model?: string; // Add model parameter
//     }) => {
//       const { data } = await axios.post(`/api/chat/${params.chat_id}/messages`, params);
//       return data;
//     },
//     onSuccess: (data, variables) => {
//       // Invalidate the chat messages query to trigger a refetch
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEYS.messages(variables.chat_id),
//       });
      
//       // Update the chat list as well to reflect the latest message preview
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEYS.chats,
//       });
//     },
//   });
// }

