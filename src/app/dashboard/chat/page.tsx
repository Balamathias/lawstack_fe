import BackButton from '@/components/back-button'
import QuickStart from '@/components/chats/quick-start'
import { getUser } from '@/services/server/auth'
import { Metadata } from 'next'
import React, { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { getChats } from '@/services/server/chats'

export const metadata: Metadata = {
    title: 'AI Assistant | LawStack',
    description: 'Get personalized legal guidance with the LawStack Smart Assistant - your AI-powered study companion'
}

const QuickStartSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-pulse">
    <div className="flex flex-col items-center mb-12">
      <div className="h-8 w-8 rounded-full bg-primary/20 mb-4"></div>
      <div className="h-8 w-64 bg-muted rounded-lg mb-3"></div>
      <div className="h-4 w-48 bg-muted rounded-lg"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 p-6 h-56">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-xl bg-muted mb-4"></div>
            <div className="h-6 w-6 rounded-full bg-muted"></div>
          </div>
          <div className="h-6 w-3/4 bg-muted rounded-lg mb-3"></div>
          <div className="h-4 w-full bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-5/6 bg-muted rounded-lg mb-6"></div>
          <div className="h-4 w-24 bg-muted rounded-lg mt-auto self-end"></div>
        </div>
      ))}
    </div>
    
    <div className="h-40 w-full rounded-xl bg-muted mt-8"></div>
  </div>
)

const Page = async () => {
  const [{ data: user }, { data: chats }] = await Promise.all([
    getUser(),
    getChats()
  ])

  return (
    <div className='w-full flex flex-col gap-y-8 max-w-7xl mx-auto p-3 sm:p-8 pb-16 max-lg:mt-14 animate-fade-in relative'>
      <div className='flex flex-col gap-y-5'>            
        <BackButton />

        <Suspense fallback={<QuickStartSkeleton />}>
          <QuickStart user={user} chat_id={undefined} chats={chats} />
        </Suspense>
      </div>
    </div>
  )
}

export default Page