import React from 'react'
import { LucideScale, LucideSidebarOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Logo from '../logo'

const Navbar = () => {
  return (
    <nav className='w-full h-16 flex items-center justify-between px-4 bg-transparent backdrop-blur-md fixed top-0 z-20 border-b dark:border-non'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <Logo />

        <section className='items-center gap-x-4 hidden md:flex text-muted-foreground'>
            <Link href='#' className='cursor-pointer'>Features</Link>
            <Link href='#' className='cursor-pointer'>Premium</Link>
            <Link href='#' className='cursor-pointer'>Contact</Link>
        </section>

        <div className='flex items-center gap-x-4 md:hidden'>
            <LucideSidebarOpen size={24} className='cursor-pointer' />
        </div>

        <div className='items-center gap-x-4 hidden md:flex'>
            <Button asChild variant={'secondary'} className='rounded-full cursor-pointer transition-all hover:opacity-70'>
              <Link href={`/login`}>
                Login
              </Link>
            </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
