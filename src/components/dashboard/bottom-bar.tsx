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
    // {
    //   tooltip: "Questions",
    //   href: "/dashboard/questions",
    //   icon: HelpCircleIcon,
    // },
    {
      tooltip: "Bookmarks",
      href: "/dashboard/bookmarks",
      icon: Bookmark,
    },
    // {
    //   tooltip: "Favorites",
    //   href: "/dashboard/favorites",
    //   icon: Heart,
    // },
    {
      tooltip: "AI",
      href: "/dashboard/chat",
      icon: Sparkle,
    },
  ]

const Bottombar = () => {
    const pathname = usePathname()

  return (
    <nav className="h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md md:hidden max-lg:py-1 py-5 max-lg:px-4 px-9 sticky max-md:fixed bottom-0 w-full flex flex-row items-center justify-around z-30">
      {
         navLinks.map((link, idx) => (
            <div key={idx} className=' flex flex-row gap-4'>
                <Link href={link?.href} className={` flex flex-col items-center justify-center`}>
                    <link.icon size={pathname === link?.href ? 24 : 25} strokeWidth={2} className={cn( "text-green-800 text-s hover:p-1 hover:bg-green-500/75 dark:hover:bg-green/80 hover:rounded-md hover:transition-all hover:duration-500", {
                      "p-1 rounded-md text-green-600 hover:transition-all hover:opacity-80": pathname === link.href
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