import LoginForm from '@/components/auth/login-form'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className='p-2.5 sm:p-8 container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10 h-full'>
      <LoginForm />
    </div>
  )
}

export default Page
