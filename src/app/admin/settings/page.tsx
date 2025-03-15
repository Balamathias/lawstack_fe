import React from 'react'
import SettingsTabs from '@/components/admin/settings/settings-tabs'

const SettingsPage = async () => {
  return (
    <div className='max-w-7xl flex flex-col space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div>
        <h2 className='text-2xl font-bold'>Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure system settings and preferences
        </p>
      </div>
      
      <SettingsTabs />
    </div>
  )
}

export default SettingsPage
