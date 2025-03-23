'use client'

import React from 'react'
import { 
  Home, 
  BookOpen, 
  Search, 
  BookMarked, 
  Settings, 
  LogOut,
  Users,
  Sparkles,
  MessageSquare,
  ShieldAlert
} from "lucide-react"
import Logo from '../logo'
import { Button } from '../ui/button'
import { useLogout } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'nextjs-toploader/app'
import { User } from '@/@types/db'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const dashboardLinks = [
  {
    tooltip: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    tooltip: "Past Questions",
    href: "/dashboard/past-questions",
    icon: BookOpen,
  },
  {
    tooltip: "AI Assistant",
    href: "/dashboard/chat",
    icon: Sparkles,
  },
  {
    tooltip: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: BookMarked,
  },
  {
    tooltip: "Search",
    href: "/dashboard/search",
    icon: Search,
  },
  // {
  //   tooltip: "Chat",
  //   href: "/dashboard/chat",
  //   icon: MessageSquare,
  // },
  {
    tooltip: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    tooltip: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface Props {
  user: User | null
}

const DashboardSidebar = ({ user }: Props) => {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='h-screen lg:flex flex-col bg-gray-100 dark:bg-card p-2 lg:p-2.5 hidden w-[220px] custom-scrollbar justify-between z-20 overflow-hidden left-0 bottom-0 fixed border-r border-border'>
      <div className="flex flex-col space-y-8">
        <div className="py-2.5 px-2">
          <Logo />
        </div>

        <nav className='flex flex-col gap-1'>
          {dashboardLinks.map((link, index) => {
            const isActive = pathname === link.href || pathname.startsWith(`/${link.href}/`);
            
            return (
              <Link 
                key={index} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm">{link.tooltip}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </Link>
            )
          })}
          
          {/* Admin Access Link - Only visible to staff and superusers */}
          {user && (user.is_staff || user.is_superuser) && (
            <Link 
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all mt-2 border-t border-border pt-3",
                pathname.startsWith('/admin')
                  ? "bg-red-500/10 text-red-500 font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="text-sm">Admin Dashboard</span>
              {pathname.startsWith('/admin') && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500"></span>
              )}
            </Link>
          )}
        </nav>
      </div>

      <footer className="p-2 lg:p-2.5 flex gap-3 flex-col mt-auto">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        
        <Button 
          className="w-full rounded-md gap-2" 
          variant="outline"
          size="sm"
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
          {loggingOut ? 'Logging out...' : 'Logout'}
          <LogOut className='w-3.5 h-3.5' />
        </Button>
      </footer>
    </div>
  )
}

export default DashboardSidebar