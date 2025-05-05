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
    <nav className='w-full backdrop-blur-lg flex items-center justify-between px-4 fixed top-0 z-30 h-16 border-b border-white/10 dark:border-gray-800/30 bg-background/5'>
      <div className='flex w-full max-w-7xl mx-auto items-center justify-between'>
        <div className="flex items-center">
          <Logo />
          
          <div className="hidden md:flex ml-8 space-x-2">
            {[
              { name: 'Features', href: '#features' },
              { name: 'Pricing', href: '#pricing' },
              { name: 'Resources', href: '#resources' },
              { name: 'About', href: '#about' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className='relative px-3 py-2 text-muted-foreground hover:text-foreground transition-all group text-sm font-medium'
              >
                {item.name}
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
            <div className="flex items-center gap-2">
              <Button 
                variant='outline' 
                size="sm" 
                asChild
                className='border-emerald-500/20 hover:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 rounded-full'
              >
                <Link href='/dashboard/account'>
                  My Account
                </Link>
              </Button>
              
              <Button 
                variant='default' 
                size="sm" 
                asChild
                className='bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-none text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 gap-1 flex items-center'
              >
                <Link href='/dashboard'>
                  Dashboard
                  <ChevronRight size={16} className='ml-1 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                asChild 
                variant='ghost' 
                size="sm" 
                className='text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full'
              >
                <Link href='/login'>
                  Sign In
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant='default' 
                size="sm" 
                className='bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-none text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1'
              >
                <Link href='/register'>
                  Get Started
                  <ChevronRight size={16} className='ml-1 transition-transform group-hover:translate-x-1' />
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
