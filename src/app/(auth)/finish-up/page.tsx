import FinishUpForm from '@/components/auth/finish-up-form'
import LoadingOverlay from '@/components/loading-overlay'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Finish up | LawStack',
  description: 'Complete your registration process.',
  openGraph: {
    images: [
      '/static/images/og/register.jpg',
    ]
  }
}

interface Props {
    searchParams: Promise<Record<string, any>>,
    params: Promise<Record<string, any>>
}

const Page = async ({ searchParams: asyncSearchParams }: Props) => {

  const searchParams = await asyncSearchParams

  return (
    <div className='p-2.5 sm:p-8 container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10 h-full'>
        <Suspense fallback={<LoadingOverlay />}>
            <FinishUpForm searchParams={searchParams} />
        </Suspense>
    </div>
  )
}

export default Page
