import { LucideScale } from 'lucide-react'
import React from 'react'

const Logo = () => {
  return (
    <div className='flex items-center gap-x-1.5'>
        <LucideScale size={30} className='' />
        <h1 className='text-xl font-semibold'>LawStack</h1>
    </div>
  )
}

export default Logo
