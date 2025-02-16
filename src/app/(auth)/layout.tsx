import Navbar from '@/components/home/navbar'
import Logo from '@/components/logo'
import React, { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='bg-gradient-to-br dark:from-gray-950 dark:via-background dark:to-gray-950'>
      <nav className="fixed top-0 w-full p-4 border-b backdrop-blur-sm">
        <Logo />
      </nav>
      <main className='flex items-center justify-center min-h-screen'>
        {children}
      </main>
    </div>
  )
}

export default Layout
