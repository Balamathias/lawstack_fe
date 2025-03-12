import React from 'react'
import { LucideSidebarOpen, LucideSquareArrowOutUpRight, Sidebar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Logo from '../logo'
import { getUser } from '@/services/server/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import NavDropdown from './nav-dropdown'
import MobileSidebar from './sidebar.mobile'

const Navbar = async () => {

  const { data: user } = await getUser()

  return (
    <nav className='w-full h-16 flex items-center justify-between px-4 bg-transparent backdrop-blur-md fixed top-0 z-20 border-b dark:border-none py-4'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <Logo />

        <section className='items-center gap-x-4 text-muted-foreground hidden'>
            <Link href='#' className='cursor-pointer'>Features</Link>
            <Link href='#' className='cursor-pointer'>Premium</Link>
            <Link href='#' className='cursor-pointer'>Contact</Link>
        </section>

        <div className='flex items-center gap-x-4 md:hidden'>
            <MobileSidebar user={user} />
        </div>

        <div className='items-center gap-x-4 hidden md:flex '>
            {
              user ? (
                <Button asChild variant={'secondary'} className='bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'>
                  <Link href={`/dashboard`}>
                    Dashboard
                    <LucideSquareArrowOutUpRight size={16} className='ml-2' />
                  </Link>
                </Button>
              ): (
                <Button asChild variant={'secondary'} className='bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'>
                  <Link href={`/login`}>
                    Login
                  </Link>
                </Button>
              )
            }
        </div>
      </div>
    </nav>
  )
}

export const NavbarSkeleton = () => {
  return (
    <nav className='w-full h-16 flex items-center justify-between px-4 bg-transparent backdrop-blur-md fixed top-0 z-20 border-b dark:border-none'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <Logo />

        <section className='items-center gap-x-4 hidden text-muted-foreground'>
            <Link href='#' className='cursor-pointer'>Features</Link>
            <Link href='#' className='cursor-pointer'>Premium</Link>
            <Link href='#' className='cursor-pointer'>Contact</Link>
        </section>

        <div className='flex items-center gap-x-4 md:hidden'>
            <LucideSidebarOpen size={24} className='cursor-pointer opacity-70' />
        </div>

        <div className='items-center gap-x-4 hidden md:flex'>
            <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
