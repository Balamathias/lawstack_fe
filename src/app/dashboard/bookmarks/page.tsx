import BackButton from '@/components/back-button';
import BookmarksList, { BookmarksSkeleton } from '@/components/dashboard/bookmarks/bookmark.list';
import { getUser } from '@/services/server/auth';
import { Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Bookmarks | Law Stack',
  description: 'View and manage your bookmarked past questions for easy reference and study.'
}

interface Props {
    params: Promise<{[key: string]: any}>,
    searchParams: Promise<{[key: string]: any}>,
}

const Page: React.FC<Props> = async ({ params: _params, searchParams: _searchParams }) => {
  const { data: user } = await getUser()
  const searchParams = await _searchParams

  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 space-y-6 animate-fade-in'>
      <BackButton />
      
      <Suspense fallback={<BookmarksSkeleton />}>
        <BookmarksList searchParams={searchParams} user={user} />
      </Suspense>
      
      {/* Gradient decorative element */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10 opacity-80" />
    </div>
  )
}

export default Page