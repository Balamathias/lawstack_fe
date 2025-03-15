import React from 'react'
import AdminShortcuts from '@/components/admin/admin.shortcuts'

const Page = () => {
  return (
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div className="mb-6">
        <h2 className='text-2xl font-bold'>
            Welcome, Admin
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your educational content and platform settings from this dashboard.
        </p>
      </div>
      
      <div className="">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
        <AdminShortcuts />
      </div>
    </div>
  )
}

export default Page