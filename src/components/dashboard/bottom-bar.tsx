"use client"

import { cn } from '@/lib/utils'
import { Bookmark, Heart, HelpCircleIcon, Home, Sparkle } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

export const navLinks = [
    {
      tooltip: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      tooltip: "Questions",
      href: "/dashboard/past-questions",
      icon: HelpCircleIcon,
    },
    {
      tooltip: "Bookmarks",
      href: "/dashboard/bookmarks",
      icon: Bookmark,
    },
    {
      tooltip: "AI",
      href: "/dashboard/chat",
      icon: Sparkle,
    },
  ]

const Bottombar = () => {
  const pathname = usePathname()

  const patternMatch = pathname.match(/\/dashboard\/past-questions\/(.+)/)

  if (patternMatch) {
    return null
  }

  return (
    <nav className="h-14 bg-white/80 dark:bg-black/20 backdrop-blur-md max-lg:py-1 py-5 fixed lg:hidden bottom-0 w-full flex flex-row items-center justify-around z-30">
      {
         navLinks.map((link, idx) => (
            <div key={idx} className=' flex flex-row gap-4'>
                <Link href={link?.href} className={` flex flex-col md:flex-row md:gap-2.5 items-center justify-center`}>
                    <link.icon size={pathname === link?.href ? 18 : 19} strokeWidth={2} className={cn( "hover:p-1 hover:bg-green-500/75 dark:hover:bg-green-500/80 hover:rounded-md hover:transition-all hover:duration-500", {
                      "rounded-md text-green-600 bg-green-600/15 hover:transition-all hover:opacity-80": pathname === link.href
                    })} />
                    <span className={cn('text-xs md:text-sm', {
                      'text-green-500': pathname === link.href
                    })}>{link?.tooltip}</span>
                </Link>
            </div>
          ))
        }
    </nav>
  )
}

export default Bottombar


// {
    //   tooltip: "Favorites",
    //   href: "/dashboard/favorites",
    //   icon: Heart,
    // },