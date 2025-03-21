import LoadingOverlay from '@/components/loading-overlay'
import AccessSection from '@/components/past-questions/access-section'
import Explorer, { ExplorerSkeleton } from '@/components/past-questions/explorer'
import React, { Suspense } from 'react'
import BackButton from '@/components/back-button'
import { Metadata } from 'next'

interface Props {
  params: Promise<{[key: string]: any}>,
  searchParams: Promise<{[key: string]: any}>
}

export const metadata: Metadata = {
  title: 'Past Questions',
  description: 'Explore past questions from various institutions',
}

const Page = async ({ searchParams }: Props) => {
  return (
    <div className='w-full flex flex-col gap-y-10 max-w-7xl mx-auto p-3 sm:p-8 pb-16 max-lg:mt-14'>
        <div className='flex flex-col gap-y-5'>
            <h1 className='text-3xl font-bold hidden'>Past Questions</h1>
            
            <BackButton />

            <AccessSection searchParams={searchParams} />

            <Suspense fallback={<ExplorerSkeleton searchParams={{ view: (await searchParams).view }} />}>
                <Explorer searchParams={searchParams} />
            </Suspense>
        </div>
    </div>
  )
}

export default Page