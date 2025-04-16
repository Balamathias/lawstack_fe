import BackButton from '@/components/back-button';
import ChatComponent from '@/components/chats/chat.component';
import LoadingOverlay from '@/components/loading-overlay';
import { getChat } from '@/services/server/chats';
import { Metadata, ResolvingMetadata } from 'next';
import React, { Suspense } from 'react'
import Loader from '@/components/loader'

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

  return (
    <div className='flex flex-col h-[calc(100vh-5px)] mx-auto p-1.5 sm:p-5 max-w-5xl'>

      <div className="flex-1 min-h-0">
        <Suspense fallback={<Loader variant="spin" />}>
          <ChatComponent chat_id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

export default Page