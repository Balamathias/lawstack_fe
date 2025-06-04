import Loader from '@/components/loader';
import ListNotes from '@/components/notes/list-notes';
import { getNotes } from '@/services/server/notes';
import React, { Suspense } from 'react'

export const metadata = {
    title: 'Notes',
    description: 'View and manage your notes',
    keywords: ['notes', 'dashboard', 'lawstack'],
}

interface Props {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

const Page = async ({ searchParams: _searchParams }: Props) => {
  const searchParams = await _searchParams || {};

  return (
    <div className='w-full flex flex-col gap-y-8 max-w-7xl mx-auto p-3 sm:p-8 pb-16 max-lg:mt-14 animate-fade-in relative'>
        
        <Suspense fallback={<Loader variant="dots" />}>
            <ListNotes getUserNotes={( getNotes({ params: {...searchParams} as any }) )} />
        </Suspense>
    </div>
  )
}

export default Page