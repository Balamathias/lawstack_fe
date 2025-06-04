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
    ChevronRight,
    User,
    Settings
} from 'lucide-react'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User as UserType } from '@/@types/db'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'

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
    user: UserType | null
}

const MobileSidebar = ({ user }: Props) => {
  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return "U";
  };

  return (
    <div>
        <Sheet>
            <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-10 w-10 rounded-xl hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-gray-800/30 transition-all duration-300"
                >
                    <Menu size={20} className='text-foreground transition-colors' />
                </Button>
            </SheetTrigger>

            <SheetContent 
              side="left" 
              className='w-80 bg-background/95 backdrop-blur-xl border-r border-border/50 p-0 shadow-2xl'
            >
                <SheetHeader className='border-b border-border/50 p-6 bg-gradient-to-r from-primary/5 to-primary/10'>
                    <SheetTitle className="flex justify-start">
                        <Logo />
                    </SheetTitle>
                </SheetHeader>

                {/* User Profile Section */}
                {user && (
                  <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage 
                          src={user.avatar || ''} 
                          alt={`${user.first_name || ''} ${user.last_name || ''}`}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(user.first_name, user.last_name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.username || user.email.split('@')[0]
                          }
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>                        <Badge variant="secondary" className="text-xs mt-1">
                          {user.is_subscribed ? 'Premium' : 'Free Plan'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Features */}
                <div className='flex flex-col py-2'>
                    {features.map((feature, index) => (
                        <SheetClose key={index} asChild>
                            <Link 
                                href={feature.href} 
                                className='group flex items-center justify-between px-6 py-4 text-foreground hover:bg-primary/5 transition-all duration-200 border-l-4 border-transparent hover:border-primary/30 hover:pl-8'
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200 group-hover:scale-110 transform">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className='font-medium text-sm group-hover:text-primary transition-colors'>
                                          {feature.title}
                                        </h4>
                                        <p className='text-xs text-muted-foreground mt-0.5 group-hover:text-muted-foreground/80'>
                                          {feature.description}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight 
                                  size={16} 
                                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
                                />
                            </Link>
                        </SheetClose>
                    ))}
                </div>

                {/* Action Buttons Footer */}
                <SheetFooter className='flex flex-col gap-y-3 border-t border-border/50 px-6 py-6 mt-auto bg-gradient-to-t from-primary/5 to-transparent'>
                    {user ? (
                        <>
                            <Button
                                className='w-full justify-start gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
                                asChild
                            >
                                <Link href={'/dashboard'}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className='w-full justify-start gap-3 h-11 rounded-xl border-border/50 hover:bg-secondary/50 transition-all duration-300'
                                asChild
                            >
                                <Link href={'/dashboard/profile'}>
                                    <User className="h-4 w-4" />
                                    My Profile
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className='w-full justify-start gap-3 h-11 rounded-xl border-border/50 hover:bg-secondary/50 transition-all duration-300'
                                asChild
                            >
                                <Link href={'/dashboard/settings'}>
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </Button>
                            
                            <Button
                                variant={'ghost'}
                                className='w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-11 rounded-xl transition-all duration-300'
                            >
                                <LogOutIcon className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className='w-full justify-start gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
                                asChild
                            >
                                <Link href={'/login'}>
                                    <LogOutIcon className="h-4 w-4" />
                                    Sign In
                                </Link>
                            </Button>
                            
                            <Button
                                variant={'outline'}
                                className='w-full justify-start gap-3 border-border/50 h-11 rounded-xl hover:bg-secondary/50 transition-all duration-300'
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