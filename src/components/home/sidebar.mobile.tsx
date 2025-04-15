import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet'
import { 
    CreditCard, 
    LogOutIcon, 
    LucideCreditCard, 
    LucideHelpCircle, 
    LucideLeafyGreen, 
    LucideNotebookPen, 
    LayoutDashboard,
    Menu, 
    Sparkles 
} from 'lucide-react'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
    {
        icon: <Sparkles className="text-emerald-500" />,
        title: 'AI Insights',
        description: 'Get AI-powered legal insights'
    },
    {
        icon: <LucideHelpCircle className="text-emerald-500" />,
        title: 'Past Questions',
        description: 'Browse previous legal questions'
    },
    {
        icon: <LucideNotebookPen className="text-emerald-500" />,
        title: 'Learn',
        description: 'Access legal learning resources'
    },
    {
        icon: <LucideLeafyGreen className="text-emerald-500" />,
        title: 'Grow with LawStack',
        description: 'Explore growth opportunities'
    },
    {
        icon: <LucideCreditCard className="text-emerald-500" />,
        title: 'Pricing',
        description: 'View our pricing plans'
    },
]

interface Props {
    user: User | null
}

const MobileSidebar = ({ user }: Props) => {
  return (
    <div>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative overflow-hidden group">
                    <Menu size={24} className='cursor-pointer transition-all duration-300 group-hover:scale-110' />
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></span>
                </Button>
            </SheetTrigger>

            <SheetContent className='bg-white/80 dark:bg-black/80 backdrop-blur-xl border-l border-white/20 dark:border-gray-800/50 shadow-2xl'>
                <SheetHeader className='border-b border-white/10 dark:border-gray-800/50 pb-4'>
                    <SheetTitle className="flex justify-center">
                        <Logo />
                    </SheetTitle>
                </SheetHeader>

                <div className='flex flex-col gap-y-8 px-4 py-8'>
                    {
                        features.map((feature, index) => (
                            <SheetClose key={index} asChild>
                                <Link href={`#`} className='flex items-center gap-x-4 p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all relative group'>
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/30 shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className='font-medium' title={feature.description}>{feature.title}</h4>
                                        <p className='text-xs text-muted-foreground'>{feature.description}</p>
                                    </div>
                                    <div className="absolute inset-0 border border-emerald-500/0 rounded-xl group-hover:border-emerald-500/10 transition-all duration-300"></div>
                                </Link>
                            </SheetClose>
                        ))
                    }
                </div>

                <SheetFooter className='flex flex-col gap-y-3 border-t border-white/10 dark:border-gray-800/50 pt-6'>
                    <Button
                        variant={'secondary'}
                        className='w-full gap-2 bg-gradient-to-r from-emerald-400/20 to-green-500/20 hover:from-emerald-400/30 hover:to-green-500/30'
                    >
                        <CreditCard className="h-4 w-4" />
                        Pricing
                    </Button>

                    {
                        user ? (
                            <Button
                                variant={'destructive'}
                                className='w-full gap-2'
                            >
                                <LogOutIcon className="h-4 w-4" />
                                Log Out
                            </Button>
                        ): (
                            <Button
                                className='w-full gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
                                asChild
                            >
                                <Link href={'/login'}>
                                    <LogOutIcon className="h-4 w-4" />
                                    Log In
                                </Link>
                            </Button>
                        )
                    }

                    <Button
                        className='w-full gap-2'
                        asChild
                        variant={'outline'}
                    >
                        <Link href={'/dashboard'}>
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default MobileSidebar