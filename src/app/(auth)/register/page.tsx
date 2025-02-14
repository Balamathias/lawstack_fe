import RegisterForm from '@/components/auth/register-form'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Register | LawStack',
  description: 'Register for a new account. Already have an account? Log in.',
  openGraph: {
    images: [
      '/static/images/og/register.jpg',
    ]
  }
}

const Page = () => {
  return (
    <div className='p-2.5 sm:p-8 container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10 h-full'>
      <RegisterForm />
    </div>
  )
}

export default Page
