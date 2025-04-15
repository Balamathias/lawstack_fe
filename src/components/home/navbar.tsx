import React from 'react'
import { LayoutDashboard, LucideSidebarOpen, LucideSquareArrowOutUpRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Logo from '../logo'
import { getUser } from '@/services/server/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import MobileSidebar from './sidebar.mobile'

const Navbar = async () => {
  const { data: user } = await getUser()

  return (
    <nav className='w-full backdrop-blur-2xl flex items-center justify-between px-4 fixed top-0 z-30 h-20 border-b border-white/10 dark:border-gray-800/30'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <div className="flex items-center">
          <Logo />
          
          <div className="hidden md:flex ml-8 space-x-1">
            {['Features', 'Premium', 'Contact', 'About'].map((item) => (
              <Link 
                key={item} 
                href='#' 
                className='relative px-4 py-2 text-muted-foreground hover:text-foreground transition-all group'
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-x-4 md:hidden'>
          <MobileSidebar user={user} />
        </div>

        <div className='items-center gap-x-4 hidden md:flex'>
          {user ? (
            <div className="flex items-center gap-4">
              <Avatar className="border-2 border-emerald-500/20 h-10 w-10">
                <AvatarImage src={user.avatar || ''} />
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                  {user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <Button asChild variant='default' className='bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-none text-white px-6 py-6 rounded-full text-[15px] font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'>
                <Link href='/dashboard'>
                  Dashboard
                  <ChevronRight size={18} className='ml-1 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button asChild variant='outline' className='border-emerald-500/30 hover:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 rounded-full py-6 px-6'>
                <Link href='/login'>
                  Sign In
                </Link>
              </Button>
              
              <Button asChild variant='default' className='bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-none text-white px-6 py-6 rounded-full text-[15px] font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'>
                <Link href='/register'>
                  Get Started
                  <ChevronRight size={18} className='ml-1 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export const NavbarSkeleton = () => {
  return (
    <nav className='w-full backdrop-blur-2xl flex items-center justify-between px-4 fixed top-0 z-30 h-20 border-b border-white/10 dark:border-gray-800/30'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <Logo />

        <div className='flex items-center gap-x-4 md:hidden'>
          <Skeleton className='h-10 w-10 rounded-lg' />
        </div>

        <div className='items-center gap-x-4 hidden md:flex'>
          <Skeleton className='h-10 w-24 rounded-full' />
          <Skeleton className='h-10 w-32 rounded-full' />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
