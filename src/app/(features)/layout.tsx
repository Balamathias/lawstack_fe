import React, { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='bg-gradient-to-br dark:from-black dark:via-black dark:to-black'>
      <main className='min-h-screen'>
        {children}
      </main>
    </div>
  )
}

export default Layout