'use client'

import React from 'react'
import { 
  Home, 
  BookOpen, 
  HelpCircle, 
  Building2, 
  Users, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  ArrowUpRight 
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

export const adminLinks = [
  {
    tooltip: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    tooltip: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    tooltip: "Questions",
    href: "/admin/questions",
    icon: HelpCircle,
  },
  {
    tooltip: "Institutions",
    href: "/admin/institutions",
    icon: Building2,
  },
  {
    tooltip: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    tooltip: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface Props {
  user: User | null
}

const AdminSidebar = ({ user }: Props) => {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='h-screen lg:flex flex-col bg-white dark:bg-card p-2 lg:p-2.5 hidden w-[220px] custom-scrollbar justify-between z-20 overflow-hidden left-0 bottom-0 fixed border-r border-border'>
      <div className="flex flex-col space-y-8">
        <div className="py-2.5 px-2 flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-sm opacity-80">Admin</span>
        </div>

        <nav className='flex flex-col gap-1'>
          {adminLinks.map((link, index) => {
            const isActive = ((pathname === link.href)) || pathname.startsWith(`/${link.href}/`);
            
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
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <footer className="p-2 lg:p-2.5 flex gap-3 flex-col mt-auto">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Admin User'}
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

export default AdminSidebar
