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
    LucideHelpCircle, 
    LucideLeafyGreen, 
    LucideNotebookPen, 
    LayoutDashboard,
    Menu, 
    Sparkles,
    ChevronRight
} from 'lucide-react'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import Link from 'next/link'

const features = [
    {
        icon: <Sparkles className="text-emerald-500" />,
        title: 'AI Insights',
        description: 'Get AI-powered legal insights',
        href: '/ai-insights'
    },
    {
        icon: <LucideHelpCircle className="text-emerald-500" />,
        title: 'Past Questions',
        description: 'Browse previous legal questions',
        href: '/questions'
    },
    {
        icon: <LucideNotebookPen className="text-emerald-500" />,
        title: 'Learn',
        description: 'Access legal learning resources',
        href: '/learn'
    },
    {
        icon: <LucideLeafyGreen className="text-emerald-500" />,
        title: 'Grow with LawStack',
        description: 'Explore growth opportunities',
        href: '/growth'
    },
    {
        icon: <CreditCard className="text-emerald-500" />,
        title: 'Pricing',
        description: 'View our pricing plans',
        href: '/pricing'
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
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Menu size={20} className='text-foreground/80' />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className='bg-white dark:bg-gray-950 border-0 shadow-lg p-0'>
                <SheetHeader className='border-b border-gray-100 dark:border-gray-800 p-4'>
                    <SheetTitle className="flex justify-start">
                        <Logo />
                    </SheetTitle>
                </SheetHeader>

                <div className='flex flex-col'>
                    {features.map((feature, index) => (
                        <SheetClose key={index} asChild>
                            <Link 
                                href={feature.href} 
                                className='flex items-center justify-between px-4 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className='font-medium'>{feature.title}</h4>
                                        <p className='text-xs text-muted-foreground mt-0.5'>{feature.description}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </Link>
                        </SheetClose>
                    ))}
                </div>

                <SheetFooter className='flex flex-col gap-y-2 border-t border-gray-100 dark:border-gray-800 px-4 py-4 mt-auto'>
                    {user ? (
                        <>
                            <Button
                                className='w-full justify-start gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white h-11'
                                asChild
                            >
                                <Link href={'/dashboard'}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                            
                            <Button
                                variant={'ghost'}
                                className='w-full justify-start gap-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-11'
                            >
                                <LogOutIcon className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className='w-full justify-start gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white h-11'
                                asChild
                            >
                                <Link href={'/login'}>
                                    <LogOutIcon className="h-4 w-4" />
                                    Sign In
                                </Link>
                            </Button>
                            
                            <Button
                                variant={'outline'}
                                className='w-full justify-start gap-3 border-gray-200 dark:border-gray-800 h-11'
                                asChild
                            >
                                <Link href={'/pricing'}>
                                    <CreditCard className="h-4 w-4" />
                                    Pricing Plans
                                </Link>
                            </Button>
                        </>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default MobileSidebar