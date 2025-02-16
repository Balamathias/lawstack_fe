"use client"

import React from 'react'

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuContent
} from '@/components/ui/dropdown-menu'

import { LucideCreditCard, LucideHelpCircle, LucideLeafyGreen, LucideLoader, LucideNotebookPen, Sparkles } from 'lucide-react'
import { useLogout } from '@/services/client/auth'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Oval } from 'react-loader-spinner'
import { Button } from '../ui/button'

interface NavDropdownProps {
    trigger: React.ReactNode
}

const NavDropdown = ({trigger }: NavDropdownProps) => {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()

  const currentPath = usePathname()

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>

        <DropdownMenuContent>
            <DropdownMenuItem>
                <Sparkles />
                AI Insights
            </DropdownMenuItem>

            <DropdownMenuItem>
                <LucideHelpCircle />
                Past Questions
            </DropdownMenuItem>

            <DropdownMenuItem>
                <LucideNotebookPen />
                Learn
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
                <LucideLeafyGreen />
                Grow with LawStack
            </DropdownMenuItem>
            
            <DropdownMenuItem>
                <LucideCreditCard />
                Pricing
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
                Profile
            </DropdownMenuItem>

            <Button 
                variant='destructive'
                className='cursor-pointer mt-2'
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
                >
                {loggingOut && <LucideLoader className='animate-spin' />}
                {
                    loggingOut ? ('Logging out...') : ('Logout')
                }
            </Button>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default NavDropdown