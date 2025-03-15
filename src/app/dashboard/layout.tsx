import React, { PropsWithChildren } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import DashboardBottomBar from '@/components/dashboard/bottom-bar'
import { getUser } from '@/services/server/auth'
import { redirect } from 'next/navigation'

const Layout = async ({ children }: PropsWithChildren) => {
  const { data: user } = await getUser()
  
  if (!user) {
    return redirect('/login?next=/dashboard')
  }
  
  return (
    <div className='bg-background min-h-screen'>
      <DashboardSidebar user={user} />
      <main className='lg:pl-[220px] pb-20 lg:pb-8'>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <DashboardBottomBar />
    </div>
  )
}

export default Layout