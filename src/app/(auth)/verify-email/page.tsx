import OTPForm from '@/components/auth/otp-form'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Verify email | LawStack',
  description: 'Verify your email address to continue using LawStack.',
  openGraph: {
    images: [
      '/static/images/og/register.jpg',
    ]
  }
}

const Page = () => {
  return (
    <div className='p-2.5 sm:p-8 container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10 h-full'>
        <OTPForm />
    </div>
  )
}

export default Page
