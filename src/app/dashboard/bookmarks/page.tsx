import BackButton from '@/components/back-button';
import BookmarksList, { BookmarksSkeleton } from '@/components/dashboard/bookmarks/bookmark.list';
import React, { Suspense } from 'react'

interface Props {
    params: Promise<{[key: string]: any}>,
    searchParams: Promise<{[key: string]: any}>,
}

const Page: React.FC<Props> = async ({ params: _params, searchParams: _searchParams }) => {


  return (
    <div className='w-full flex flex-col gap-y-10 max-w-5xl mx-auto p-4 sm:p-8'>
        <div className='flex flex-col gap-y-5'>
            <h1 className='text-3xl font-bold hidden'>Bookmarks</h1>
            
            <BackButton />

            <Suspense fallback={<BookmarksSkeleton />}>
                <BookmarksList />
            </Suspense>
        </div>
    </div>
  )
}

export default Page