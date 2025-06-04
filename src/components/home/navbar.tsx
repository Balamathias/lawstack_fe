import React from 'react'
import { ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Logo from '../logo'
import { getUser } from '@/services/server/auth'
import { Skeleton } from '../ui/skeleton'
import MobileSidebar from './sidebar.mobile'

const Navbar = async () => {
  const { data: user } = await getUser()
  return (
    <nav className='w-full backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-gray-800/30 fixed top-0 z-50 h-20 transition-all duration-300'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between px-6 h-full'>
        <div className="flex items-center">
          <Logo />
          
          <div className="hidden md:flex ml-12 space-x-1">
            {[
              { name: 'Features', href: '#features' },
              { name: 'Pricing', href: '#pricing' },
              { name: 'Resources', href: '#resources' },
              { name: 'About', href: '#about' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className='relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group text-sm font-medium rounded-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20'
              >
                {item.name}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-x-4 md:hidden'>
          <MobileSidebar user={user} />
        </div>        <div className='items-center gap-x-3 hidden md:flex'>
          {user ? (
            <div className="flex items-center gap-3">
              <Button 
                variant='outline' 
                size="sm" 
                asChild
                className='border-gray-300/60 dark:border-gray-700/60 hover:border-emerald-500/50 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300'
              >
                <Link href='/dashboard/account'>
                  My Account
                </Link>
              </Button>
              
              <Button 
                variant='default' 
                size="sm" 
                asChild
                className='bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 border-none text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105'
              >
                <Link href='/dashboard' className='flex items-center gap-2'>
                  Dashboard
                  <ChevronRight size={16} className='transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                asChild 
                variant='ghost' 
                size="sm" 
                className='text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-300'
              >
                <Link href='/login'>
                  Sign In
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant='default' 
                size="sm" 
                className='bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 border-none text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105'
              >
                <Link href='/register' className='flex items-center gap-2'>
                  Get Started
                  <ChevronRight size={16} className='transition-transform group-hover:translate-x-1' />
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
    <nav className='w-full backdrop-blur-lg flex items-center justify-between px-4 fixed top-0 z-30 h-16 border-b border-white/10 dark:border-gray-800/30 bg-background/5'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <Logo />

        <div className='flex items-center gap-x-4 md:hidden'>
          <Skeleton className='h-9 w-9 rounded-lg' />
        </div>

        <div className='items-center gap-x-4 hidden md:flex'>
          <Skeleton className='h-9 w-20 rounded-full' />
          <Skeleton className='h-9 w-28 rounded-full' />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
