'use client'

import React from 'react'

import { Home, HelpCircleIcon, Bookmark, Heart, Sparkle } from "lucide-react"
import Logo from '../logo'
import LinkItem from './link-item'

export const navLinks = [
    {
      tooltip: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      tooltip: "Questions",
      href: "/dashboard/questions",
      icon: HelpCircleIcon,
    },
    {
      tooltip: "Bookmarks",
      href: "/dashboard/bookmarks",
      icon: Bookmark,
    },
    {
      tooltip: "Favorites",
      href: "/dashboard/favorites",
      icon: Heart,
    },
    {
      tooltip: "AI",
      href: "/dashboard/chat",
      icon: Sparkle,
    },
  ]

const Sidebar = () => {
  return (
    <div className='h-screen lg:flex flex-col bg-white dark:bg-background p-2 lg:p-2.5 hidden w-[210px] custom-scrollbar justify-between z-20 overflow-hidden left-0 bottom-0 fixed'>
        <div className="flex flex-col space-y-8">
            <div className="py-2.5">
              <Logo />
            </div>

            <nav className='flex flex-col gap-1.5'>
                {
                    navLinks.map((link, index) => (
                        <LinkItem key={index} link={link} />
                    ))
                }
            </nav>
        </div>

        <footer className="p-2 lg:p-2.5 flex gap-3 flex-col">
                
        </footer>
    </div>
  )
}

export default Sidebar