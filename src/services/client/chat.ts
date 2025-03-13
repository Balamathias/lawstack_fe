import { Chat } from "@/@types/db"
import { StackResponse } from "@/@types/generics"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { API_URL } from "../utils"
import { toast } from "sonner"
import { useCookies } from "./auth"

export const useCreateChat = (_token?: string) => {

    const { data: store } = useCookies()

    const token = store?.token
    toast.info(token)

    return useMutation({
        mutationKey: ['chat', 'create'],
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
            toast.error('Error creating chat, are you sure you are signed in?', { description: error.message })
        }
    })
}