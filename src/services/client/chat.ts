import { Chat } from "@/@types/db"
import { StackResponse } from "@/@types/generics"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { API_URL } from "../utils"
import { toast } from "sonner"
import { getCookie } from 'cookies-next/client'

export const useCreateChat = () => {
    
    return useMutation({
        mutationKey: ['create-chat'],
        mutationFn: async (data: Record<string, any>) => {
            const token = getCookie('token');
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
            toast.error('Error creating chat, are you sure you are signed in?', { description: error.message })
        }
    })
}