import React, { PropsWithChildren } from 'react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminBottomBar from '@/components/admin/admin-bottom-bar'
import { getUser } from '@/services/server/auth'

const Layout = async ({ children }: PropsWithChildren) => {
  const { data: user } = await getUser()
  
  return (
    <div className='bg-background min-h-screen'>
      <AdminSidebar user={user} />
      <main className='lg:pl-[220px] pb-20 lg:pb-8'>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <AdminBottomBar />
    </div>
  )
}

export default Layout