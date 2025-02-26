import React, { PropsWithChildren } from 'react'
import Sidebar from '@/components/dashboard/sidebar'

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className='dark:bg-black bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-800 via-amber-900 to-black w-full min-h-screen'>
            <Sidebar />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout