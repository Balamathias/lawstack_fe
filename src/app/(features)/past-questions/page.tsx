import LoadingOverlay from '@/components/loading-overlay'
import AccessSection from '@/components/past-questions/access-section'
import Explorer from '@/components/past-questions/explorer'
import React, { Suspense } from 'react'
import BackButton from '@/components/back-button'

const Page = () => {
  return (
    <div className='w-full flex flex-col gap-y-10 max-w-7xl mx-auto p-3 sm:p-8'>
        <div className='flex flex-col gap-y-5'>
            <h1 className='text-3xl font-bold hidden'>Past Questions</h1>
            
            <BackButton />

            <AccessSection />

            <Suspense fallback={<LoadingOverlay />}>
                <Explorer />
            </Suspense>
        </div>
    </div>
  )
}

export default Page