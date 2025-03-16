"use client"

import { cn } from '@/lib/utils'
import { BookOpen, HelpCircle, Building2, LayoutDashboard, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

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
    tooltip: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

const AdminBottomBar = () => {
  const pathname = usePathname()

  // Hide bottom bar on specific detail pages
  if (pathname.match(/\/admin\/(courses|questions|institutions|users)\/[^/]+/)) {
    return null
  }

  return (
    <nav className="fixed bottom-0 w-full lg:hidden z-40 border-t border-border">
      <div className="h-16 bg-background/80 dark:bg-black/70 backdrop-blur-lg flex items-center justify-around px-2">
        {adminLinks.slice(0, 5).map((link, idx) => {
          const isActive = pathname === link?.href || pathname.startsWith(`/${link.href}/`);
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
                isActive ? "bg-primary/10 rounded-full" : ""
              )}>
                <link.icon 
                  size={isActive ? 22 : 20}   
                  strokeWidth={isActive ? 2 : 1.5}                  
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
                <span className="absolute -top-0.5 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"></span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default AdminBottomBar
