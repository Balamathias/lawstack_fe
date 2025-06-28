"use client"

import { cn } from '@/lib/utils'
import { Home, BookOpen, Search, BookMarked, User, MessageSquare, ShieldAlert, Stars, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useUser } from '@/services/client/auth'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.nav 
      className="fixed bottom-0 w-full lg:hidden z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Glassmorphic container */}
      <div className="relative mx-4 mb-4 rounded-2xl overflow-hidden backdrop-blur-xl bg-background/80 dark:bg-background/60 border border-border/20 shadow-2xl shadow-black/10">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/20 to-background/40" />
        
        {/* Navigation items */}
        <div className={cn(
          "relative h-16 flex items-center justify-around px-3",
          isAdmin ? 'pb-safe' : ''
        )}>
          {dashboardMobileLinks.map((link, idx) => {
            // Fix isActive logic to avoid marking parent routes as active
            const isActive = 
              pathname === link.href || 
              (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard");
              
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="relative"
              >
                <Link 
                  href={link?.href} 
                  className={cn(
                    "relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 rounded-xl group",
                    "hover:bg-background/60 dark:hover:bg-background/40"
                  )}
                >
                  {/* Active background */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-1 rounded-xl bg-transparent"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Icon container */}
                  <motion.div 
                    className={cn(
                      "flex items-center justify-center p-2 transition-all duration-300 relative z-10",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: isActive ? 0.3 : 0.2 }}
                    >
                      <link.icon 
                        size={20}   
                        strokeWidth={isActive ? 2.5 : 2}                  
                        className="transition-all duration-300"  
                      />  
                    </motion.div>
                  </motion.div>              
                  
                  {/* Label */}
                  <motion.span 
                    className={cn(
                      "text-[10px] font-medium transition-all duration-300 relative z-10",
                      isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-70 group-hover:opacity-90"
                    )}
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                      fontWeight: isActive ? 600 : 500
                    }}
                  >
                    {link?.tooltip}
                  </motion.span>
                  
                  {/* Active indicator dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="absolute -top-1 left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 shadow-lg shadow-primary/50"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Ripple effect on tap */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-primary/20 opacity-0"
                    whileTap={{ 
                      scale: [1, 1.2], 
                      opacity: [0, 0.3, 0],
                      transition: { duration: 0.3 }
                    }}
                  />
                </Link>
              </motion.div>
            )
          })}

          {/* Admin link for mobile - Only for staff/superusers */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dashboardMobileLinks.length * 0.1, duration: 0.3 }}
              className="relative"
            >
              <Link 
                href="/admin"
                className={cn(
                  "relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 rounded-xl group",
                  "hover:bg-background/60 dark:hover:bg-background/40"
                )}
              >
                {/* Active background */}
                <AnimatePresence>
                  {pathname.startsWith('/admin') && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-1 rounded-xl bg-red-500/10 border border-red-500/20"
                    />
                  )}
                </AnimatePresence>
                
                {/* Icon container */}
                <motion.div 
                  className={cn(
                    "flex items-center justify-center p-2 transition-all duration-300 relative z-10",
                    pathname.startsWith('/admin') ? "text-red-500" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ 
                      scale: pathname.startsWith('/admin') ? 1.1 : 1,
                      rotate: pathname.startsWith('/admin') ? [0, -10, 10, 0] : 0
                    }}
                    transition={{ duration: pathname.startsWith('/admin') ? 0.3 : 0.2 }}
                  >
                    <ShieldAlert 
                      size={20}   
                      strokeWidth={pathname.startsWith('/admin') ? 2.5 : 2}                  
                      className="transition-all duration-300"                
                    />  
                  </motion.div>
                </motion.div>              
                
                {/* Label */}
                <motion.span 
                  className={cn(
                    "text-[10px] font-medium transition-all duration-300 relative z-10",
                    pathname.startsWith('/admin') ? "text-red-500 opacity-100" : "text-muted-foreground opacity-70 group-hover:opacity-90"
                  )}
                  animate={{ 
                    scale: pathname.startsWith('/admin') ? 1.05 : 1,
                    fontWeight: pathname.startsWith('/admin') ? 600 : 500
                  }}
                >
                  Admin
                </motion.span>
                
                {/* Active indicator dot */}
                <AnimatePresence>
                  {pathname.startsWith('/admin') && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full transform -translate-x-1/2 shadow-lg shadow-red-500/50"
                    />
                  )}
                </AnimatePresence>
                
                {/* Ripple effect on tap */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-red-500/20 opacity-0"
                  whileTap={{ 
                    scale: [1, 1.2], 
                    opacity: [0, 0.3, 0],
                    transition: { duration: 0.3 }
                  }}
                />
              </Link>
            </motion.div>
          )}
        </div>
        
        {/* Bottom safe area for devices with home indicator */}
        <div className="h-safe-bottom" />
      </div>
    </motion.nav>
  )
}

export default DashboardBottomBar