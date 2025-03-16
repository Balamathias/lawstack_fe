import React, { PropsWithChildren } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import DashboardBottomBar from '@/components/dashboard/bottom-bar'
import { getUser } from '@/services/server/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/dashboard/navbar'

const Layout = async ({ children }: PropsWithChildren) => {
  const { data: user } = await getUser()
  
  if (!user) {
    return redirect('/login?next=/dashboard')
  }
  
  return (
    <div className='bg-background dark:bg-black min-h-screen'>
      <DashboardSidebar user={user} />
      <Navbar user={user} />
      <main className='lg:pl-[220px]'>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <DashboardBottomBar />
    </div>
  )
}

export default Layout