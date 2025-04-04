import { getChatMessages } from '@/services/server/chats'
import React from 'react'
import ChatInterface from './chat.interface'
import { getUser } from '@/services/server/auth'

interface Props {
    chat_id: string
}

const ChatComponent = async ({ chat_id }: Props) => {
  const { data: messages, count } = await getChatMessages(chat_id, { ordering: '-created_at', page_size: 200 })
  const { data: user } = await getUser()

  return (
    <div className="w-full h-full">
      <ChatInterface 
        chatId={chat_id}
        initialMessages={messages || []}
        user={user!}
      />
    </div>
  )
}

export default ChatComponent