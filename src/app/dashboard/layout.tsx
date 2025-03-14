import React, { PropsWithChildren } from 'react'
import Sidebar from '@/components/dashboard/sidebar'
import Bottombar from '@/components/dashboard/bottom-bar'
import { getUser } from '@/services/server/auth'

const Layout = async ({ children }: PropsWithChildren) => {
    const { data: user } = await getUser()
    return (
        <div className='dark:bg-black bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-800 via-amber-900 to-black w-full min-h-screen'>
            <Sidebar user={user} />
            <main className='lg:ml-[210px]'>
                {children}
            </main>
            <Bottombar />
        </div>
    )
}

export default Layout