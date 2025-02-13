import Navbar from '@/components/home/navbar'
import React, { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='min-h-screen bg-gradient-to-br dark:from-gray-950 dark:via-background dark:to-gray-950'>
      <Navbar />
      <main className='pt-16'>
        {children}
      </main>
    </div>
  )
}

export default Layout
