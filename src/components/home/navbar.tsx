import React from 'react'
import { LucideScale, LucideSidebarOpen } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='w-full h-16 flex items-center justify-between px-4 bg-transparent backdrop-blur-md fixed top-0 z-20 border-b dark:border-non'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <div className='flex items-center gap-x-1.5'>
            <LucideScale size={30} className='' />
            <h1 className='text-xl font-semibold'>LawStack</h1>
        </div>

        <section className='items-center gap-x-4 hidden md:flex text-muted-foreground'>
            <Link href='#' className='cursor-pointer'>Features</Link>
            <Link href='#' className='cursor-pointer'>Premium</Link>
            <Link href='#' className='cursor-pointer'>Contact</Link>
        </section>

        <div className='flex items-center gap-x-4'>
            <LucideSidebarOpen size={24} className='cursor-pointer' />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
