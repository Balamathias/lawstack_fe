import Navbar, { NavbarSkeleton } from '@/components/home/navbar'
import React, { PropsWithChildren, Suspense } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-emerald-50 dark:from-gray-950 dark:via-background dark:to-gray-950'>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <main className='pt-16'>
        {children}
      </main>
    </div>
  )
}

export default Layout
