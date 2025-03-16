import BackButton from '@/components/back-button';
import ChatComponent from '@/components/chats/chat.component';
import LoadingOverlay from '@/components/loading-overlay';
import { getChat } from '@/services/server/chats';
import { Metadata, ResolvingMetadata } from 'next';
import React, { Suspense } from 'react'

interface Props {
    params: Promise<{[key: string]: any}>,
    searchParams: Promise<{[key: string]: any}>,
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
 
  const { data: chat } = await getChat(id)
 
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: chat?.title,
    description:  chat?.messages?.[0]?.content || chat?.title,
    openGraph: {
      images: [...previousImages],
    },
  }
}

const Page: React.FC<Props> = async ({ params: _params, searchParams: _searchParams }) => {
  const params = await _params;
  const searchParams = await _searchParams;

  const { data: chat } = await getChat(params.id)

  return (
    <div className='flex flex-col h-[calc(100vh-5px)] max-w-5xl mx-auto p-2.5 sm:p-6'>
      <div className='items-center justify-between mb-3 hidden'>
        <BackButton />
        <h1 className="text-xl font-bold truncate max-w-[50%]">{chat?.title || 'Legal Consultation'}</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 min-h-0">
        <Suspense fallback={<LoadingOverlay />}>
          <ChatComponent chat_id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

export default Page