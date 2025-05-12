import React from 'react'
import { getChats, getChatsAnalytics } from '@/services/server/chats'
import { PAGE_SIZE } from '@/lib/utils'
import ChatsTable from '@/components/admin/chats/chats-table'
import ChatsOverview from '@/components/admin/chats/chats-overview'

interface Props {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}

const Page = async ({ params, searchParams }: Props) => {
  const { data: stats } = await getChatsAnalytics()
  const { data: chats, count } = await getChats({ params: { ...(await searchParams), page_size: PAGE_SIZE }})

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <ChatsOverview stats={stats!} />
      <ChatsTable chats={chats} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page