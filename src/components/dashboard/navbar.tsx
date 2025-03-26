'use client'

import React, { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from '../logo'
import { User } from '@/@types/db'
import { usePathname } from 'next/navigation' 

interface NavbarProps {
  user: User | null
}

const Navbar = ({ user }: NavbarProps) => {

  const pathname = usePathname()

  
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  
  useMotionValueEvent(scrollY, 'change', latest => {
      const prevValue = scrollY.getPrevious()
      
      if (latest > prevValue! && latest > 150) {
          setHidden(true)
    } else {
        setHidden(false)
    }
  })

  if (pathname.match(/\/dashboard\/(past-questions|bookmarks|search|chat|quizzes)\/[^/]+/)) {
    return null
  }

  return (
    <motion.nav
        initial={{ background: 'inherit' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        animate={hidden ? "hidden" : "visible"}
        variants={{
            visible: { y: 0 },
            hidden: { y: '-100%' }
        }}
        className="flex flex-row p-4 h-14 w-full fixed top-0 z-30 border-b bg-background dark:bg-dark/70 lg:hidden  dark:border-none backdrop-blur-md"
    >
        <div className="flex flex-row justify-between items-center w-full mx-auto gap-4">
          <div />
          <Logo />

          <Link href={user ? `/profile/${user.username}` : '#'}>
            <Avatar>
              <AvatarImage src={user?.avatar ?? ''} className="object-cover" alt={user?.username} />
              <AvatarFallback className="capitalize">{user?.username?.at(0)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
    </motion.nav>
  )
}

export default Navbar