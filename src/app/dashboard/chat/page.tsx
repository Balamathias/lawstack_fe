import BackButton from '@/components/back-button'
import QuickStart from '@/components/chats/quick-start'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Chat | LawStack',
    description: 'Get started with chatting with LawStack Assistant'
}

const Page = async () => {

  const cookie = await cookies()

  return (
    <div className='w-full flex flex-col gap-y-10 max-w-7xl mx-auto p-3 sm:p-8'>
        <div className='flex flex-col gap-y-5'>            
            <BackButton />

            <Suspense>
                <QuickStart auth={{ token: cookie?.get('token')?.value as string }} />
            </Suspense>
        </div>
    </div>
  )
}

export default Page