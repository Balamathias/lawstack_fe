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
      tooltip: "Chat",
      href: "/dashboard/chat",
      icon: Sparkle,
    },
  ]

const Bottombar = () => {
  const pathname = usePathname()

  const patternMatch = pathname.match(/\/dashboard\/past-questions\/(.+)/) ||
    pathname.match(/\/dashboard\/chat\/(.+)/)

  if (patternMatch) {
    return null
  }

  return (
    <nav className="fixed bottom-0 w-full lg:hidden z-40 border-t border-gray-100 dark:border-gray-800">
      <div className="h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg flex items-center justify-around px-2">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link?.href;
          return (
            <Link 
              key={idx} 
              href={link?.href} 
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-200",
                isActive ? "text-green-600 dark:text-green-500" : "text-gray-600 dark:text-gray-400"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-full p-2 transition-all duration-300",
                isActive 
                  ? "bg-green-100 dark:bg-green-900/30" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
              )}>
                <link.icon 
                  size={isActive ? 22 : 20}                   strokeWidth={isActive ? 2.5 : 2}                   className="transition-all duration-200"                 />              </div>              <span className={cn(                "mt-1 text-[10px] font-medium transition-all duration-200",
                isActive ? "opacity-100" : "opacity-80"
              )}>
                {link?.tooltip}
              </span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 w-1 h-1 bg-green-500 rounded-full transform -translate-x-1/2"></span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Bottombar


// {
    //   tooltip: "Favorites",
    //   href: "/dashboard/favorites",
    //   icon: Heart,
    // },