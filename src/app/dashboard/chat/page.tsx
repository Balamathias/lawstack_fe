import BackButton from '@/components/back-button'
import QuickStart from '@/components/chats/quick-start'
import { getUser } from '@/services/server/auth'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Chat | LawStack',
    description: 'Get started with chatting with LawStack Assistant'
}

const Page = async () => {

  const { data: user } = await getUser()

  return (
    <div className='w-full flex flex-col gap-y-10 max-w-7xl mx-auto p-3 sm:p-8 pb-16'>
        <div className='flex flex-col gap-y-5'>            
            <BackButton />

            <Suspense>
                <QuickStart user={user} chat_id={undefined} />
            </Suspense>
        </div>
    </div>
  )
}

export default Page