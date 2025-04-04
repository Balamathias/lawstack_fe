"use client"

import { cn } from '@/lib/utils'
import { Home, BookOpen, Search, BookMarked, User, MessageSquare, ShieldAlert, Stars, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useUser } from '@/services/client/auth'

export const dashboardMobileLinks = [
  {
    tooltip: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    tooltip: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    tooltip: "SmartAI",
    href: "/dashboard/chat",
    icon: Stars,
  },
  // {
  //   tooltip: "Search",
  //   href: "/dashboard/search",
  //   icon: Search,
  // },
  // {
  //   tooltip: "Bookmarks",
  //   href: "/dashboard/bookmarks",
  //   icon: BookMarked,
  // },
  {
    tooltip: "Settings",
    href: "/dashboard/settings",
    icon: Settings2,
  },

]

const DashboardBottomBar = () => {
  const pathname = usePathname()
  const { data: userData } = useUser();
  const user = userData?.data;

  // Hide bottom bar on specific detail pages
  if (pathname.match(/\/dashboard\/(past-questions|bookmarks|search|chat)\/[^/]+/)) {
    return null
  }

  // Check if user is staff or superuser
  const isAdmin = user && (user.is_staff || user.is_superuser);

  return (
    <nav className="fixed bottom-0 w-full lg:hidden z-40 border-t border-border dark:border-none">
      <div className={`h-16 bg-background/80 dark:bg-black/70 backdrop-blur-lg flex items-center justify-around px-2 ${isAdmin ? 'pb-safe' : ''}`}>
        {dashboardMobileLinks.map((link, idx) => {
          // Fix isActive logic to avoid marking parent routes as active
          const isActive = 
            pathname === link.href || 
            (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard");
            
          return (
            <Link 
              key={idx} 
              href={link?.href} 
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-200",
                isActive ? "text-primary" : "text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center p-2 transition-all duration-300",
                isActive ? "text-foreground" : ""
              )}>
                <link.icon 
                  size={isActive ? 22 : 20}   
                  strokeWidth={isActive ? 2.5 : 1.5}                  
                  className="transition-all duration-200"  
                />              
              </div>              
              <span className={cn(
                "mt-1 text-[10px] font-medium transition-all duration-200",
                isActive ? "opacity-100" : "opacity-80"
              )}>
                {link?.tooltip}
              </span>
              {isActive && (
                <span className="absolute dark:hidden -top-0.5 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"></span>
              )}
            </Link>
          )
        })}

        {/* Admin link for mobile - Only for staff/superusers */}
        {isAdmin && (
          <Link 
            href="/admin"
            className={cn(
              "relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-200",
              pathname.startsWith('/admin') ? "text-red-500" : "text-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center p-2 transition-all duration-300",
              pathname.startsWith('/admin') ? "bg-red-500/10 rounded-full" : ""
            )}>
              <ShieldAlert 
                size={pathname.startsWith('/admin') ? 22 : 20}   
                strokeWidth={pathname.startsWith('/admin') ? 2 : 1.5}                  
                className="transition-all duration-200"                
              />              
            </div>              
            <span className={cn(
              "mt-1 text-[10px] font-medium transition-all duration-200",
              pathname.startsWith('/admin') ? "opacity-100" : "opacity-80"
            )}>
              Admin
            </span>
            {pathname.startsWith('/admin') && (
              <span className="absolute -top-0.5 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2"></span>
            )}
          </Link>
        )}
      </div>
    </nav>
  )
}

export default DashboardBottomBar