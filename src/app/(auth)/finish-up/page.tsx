import FinishUpForm from '@/components/auth/finish-up-form'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Finish up | LawStack',
  description: 'Complete your registration process.',
  openGraph: {
    images: [
      '/static/images/og/register.jpg',
    ]
  }
}

const Page = () => {
  return (
    <div className='p-2.5 sm:p-8 container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10 h-full'>
        <FinishUpForm />
    </div>
  )
}

export default Page
