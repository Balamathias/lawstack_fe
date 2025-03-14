'use client'

import React from 'react'

import { Home, HelpCircleIcon, Bookmark, Heart, Sparkle, LucideArrowUpRight } from "lucide-react"
import Logo from '../logo'
import LinkItem from './link-item'
import { Button } from '../ui/button'
import { useLogout } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'nextjs-toploader/app'
import { User } from '@/@types/db'
import { usePathname } from 'next/navigation'

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
      tooltip: "AI Insights",
      href: "/dashboard/chat",
      icon: Sparkle,
    },
    {
      tooltip: "Favorites",
      href: "/dashboard/favorites",
      icon: Heart,
    },
  ]

interface Props {
    user: User | null
}

const Sidebar = ({ user }: Props) => {

  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()
  const currentPath = usePathname()

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

        <footer className="p-2 lg:p-2.5 flex gap-3 flex-col mt-auto">
                {
                  user ? (
                    <Button 
                      className="w-full rounded-xl" variant="default"
                      onClick={() => logout(undefined, {
                        onSuccess: (data) => {
                          if (data?.error) {
                              toast.error(data.message)
                              return
                          }

                            toast.success('Logged out successfully')
                            router.replace('/')
                            router.refresh()
                        },
                        onError: (error) => {
                            toast.error(error.message)
                        }
                      })}
                      disabled={loggingOut}
                    >
                      {loggingOut ? 'Processing...' : 'Logout'}
                      <LucideArrowUpRight className='w-4 h-4' />
                    </Button>
                  ): (
                    <Button 
                      className="w-full rounded-xl" variant="default"
                      onClick={() => router.replace('/login?next=' + currentPath)}
                    >
                      Login
                      <LucideArrowUpRight className='w-4 h-4' />
                    </Button>
                  )
                }
        </footer>
    </div>
  )
}

export default Sidebar