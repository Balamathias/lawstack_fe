import { getChat, getChatMessages } from '@/services/server/chats'
import React from 'react'
import ChatInterface from './chat.interface'
import { getUser } from '@/services/server/auth'

interface Props {
    chat_id: string
}

const ChatComponent = async ({ chat_id }: Props) => {
  const [{ data: messages, count }, { data: user }, { data: chat }] = await Promise.all([
    getChatMessages(chat_id, { ordering: '-created_at', page_size: 500 }),
    getUser(),
    getChat(chat_id)
  ])

  return (
    <div className="w-full h-full">
      <ChatInterface 
        chatId={chat_id}
        initialMessages={messages || []}
        user={user!}
        chat={chat}
      />
    </div>
  )
}

export default ChatComponent