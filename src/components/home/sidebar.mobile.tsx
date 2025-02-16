import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet'
import { CreditCard, LogOutIcon, LucideCreditCard, LucideHelpCircle, LucideLeafyGreen, LucideNotebookPen, Sidebar, Sparkles } from 'lucide-react'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import Link from 'next/link'

const features = [
    {
        icon: <Sparkles />,
        title: 'AI Insights',
        description: 'Get AI-powered legal insights'
    },
    {
        icon: <LucideHelpCircle />,
        title: 'Past Questions',
        description: 'Browse previous legal questions'
    },
    {
        icon: <LucideNotebookPen />,
        title: 'Learn',
        description: 'Access legal learning resources'
    },
    {
        icon: <LucideLeafyGreen />,
        title: 'Grow with LawStack',
        description: 'Explore growth opportunities'
    },
    {
        icon: <LucideCreditCard />,
        title: 'Pricing',
        description: 'View our pricing plans'
    },
    {
        icon: <LogOutIcon />,
        title: 'Logout',
        description: 'Sign out of your account'
    }
]

interface Props {
    user: User | null
}

const MobileSidebar = ({ user }: Props) => {
  return (
    <div>
        <Sheet>
            <SheetTrigger>
                <Sidebar size={24} className='cursor-pointer' />
            </SheetTrigger>

            <SheetContent className='bg-background/70 backdrop-blur-sm'>
                <SheetHeader>
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                </SheetHeader>

                <div className='flex flex-col gap-y-8 px-4 py-8'>
                    {
                        features.map((feature, index) => (
                            <SheetClose key={index} asChild>
                                <Link href={`#`} className='flex items-center gap-x-4 text-muted-foreground hover:opacity-70 transition-all'>
                                    {feature.icon}
                                    <div>
                                        <h4 className='' title={feature.description}>{feature.title}</h4>
                                    </div>
                                </Link>
                            </SheetClose>
                        ))
                    }
                </div>

                <SheetFooter className='flex flex-col gap-y-3 border-t'>
                    <Button
                        variant={'secondary'}
                        className='w-full'
                    >
                        <CreditCard />
                        Pricing
                    </Button>

                    {
                        user ? (
                            <Button
                                variant={'destructive'}
                                className='w-full'
                            >
                                <LogOutIcon />
                                Log Out
                            </Button>
                        ): (
                            <Button
                                className='w-full'
                            >
                                <LogOutIcon />
                                Log In
                            </Button>
                        )
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default MobileSidebar