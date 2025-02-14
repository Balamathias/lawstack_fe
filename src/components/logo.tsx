import React from 'react'
import { LucideScale } from 'lucide-react'
import Link from 'next/link'

const Logo = ({ isLink=true }) => {
  return (
    <Link href={'/'} className='flex items-center gap-x-1.5'>
        <LucideScale size={30} className='' />
        <h1 className='text-xl font-semibold'>LawStack</h1>
    </Link>
  )
}

export default Logo
