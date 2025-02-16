import React from 'react'
import { LucideSidebarOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Logo from '../logo'
import { getUser } from '@/services/server/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import NavDropdown from './nav-dropdown'

const Navbar = async () => {

  const { data: user } = await getUser()

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
            {
              user ? (
                <NavDropdown 
                  trigger={
                    <Link href={'#'}>
                      <Avatar className='w-10 h-10 cursor-pointer transition-all hover:opacity-70'>
                        <AvatarImage src={user.avatar!} />
                        <AvatarFallback className='uppercase'>{user.username?.at(0) || user?.email?.at(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                  }
               />
              ): (
                <Button asChild variant={'secondary'} className='rounded-full cursor-pointer transition-all hover:opacity-70'>
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
            <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
