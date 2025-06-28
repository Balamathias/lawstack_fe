'use client'

import React, { useState } from 'react'
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
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Shield,
  LucideScale,
  ArrowRight,
  Crown,
  Scale,
  Notebook,
  Menu
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
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const dashboardLinks = [
  {
    tooltip: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    tooltip: "Smart Assistant",
    href: "/dashboard/chat",
    icon: Sparkles,
  },
  {
    tooltip: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    tooltip: "Quizzes",
    href: "/dashboard/quizzes",
    icon: Shield
  },
  {
    tooltip: "Past Questions",
    href: "/dashboard/past-questions",
    icon: BookOpen,
  },
  {
    tooltip: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: BookMarked,
  },
  {
    tooltip: "Notes",
    href: "/dashboard/notes",
    icon: Notebook
  },
  {
    tooltip: "Cases",
    href: "/dashboard/cases",
    icon: Scale,
  },
  {
    tooltip: "Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    tooltip: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    tooltip: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Crown,
  },
  {
    tooltip: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
]

interface Props {
  user: User | null
}

const DashboardSidebar = ({ user }: Props) => {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const handleLogout = () => {
    logout(undefined, {
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
    })
  }  // Sidebar navigation links
  const NavLinks = () => (
    <nav className='flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden'>
      {dashboardLinks.map((link, index) => {
        // Fix isActive logic to avoid marking parent routes as active
        const isActive = 
          pathname === link.href || 
          (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard");
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <Link 
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
                "backdrop-blur-sm border border-transparent",
                isActive
                  ? "bg-primary/10 dark:bg-primary/8 text-primary font-medium shadow-lg shadow-primary/5 border-primary/20"
                  : "text-muted-foreground hover:bg-background/60 dark:hover:bg-background/40 hover:text-foreground hover:border-border/30 hover:shadow-md"
              )}
            >
              {/* Glassmorphic background overlay */}
              <div className={cn(
                "absolute inset-0 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/3 dark:to-primary/8" 
                  : "bg-gradient-to-r from-background/30 to-background/10 opacity-0 group-hover:opacity-100"
              )} />
              
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                />
              )}
              
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex items-center justify-center relative z-10 p-1 rounded-lg transition-all shrink-0", 
                  isActive ? "text-primary bg-primary/10" : "group-hover:bg-background/50"
                )}
              >
                <link.icon className={cn("h-4 w-4", isActive && "stroke-[2.5px]")} />
              </motion.div>
              
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm whitespace-nowrap overflow-hidden relative z-10 font-medium min-w-0"
                  >
                    {link.tooltip}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {isActive && !isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-auto w-2 h-2 rounded-full bg-primary relative z-10 shadow-sm shrink-0"
                />
              )}
            </Link>
          </motion.div>
        )
      })}
      
      {/* Admin Access Link - Only visible to staff and superusers */}
      {user && (user.is_staff || user.is_superuser) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dashboardLinks.length * 0.05 + 0.2 }}
          className="mt-4 pt-4 border-t border-border/20"
          style={{ overflow: 'hidden' }}
        >
          <Link 
            href="/admin"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
              "backdrop-blur-sm border border-transparent",
              pathname.startsWith('/admin')
                ? "bg-red-500/10 text-red-500 font-medium shadow-lg shadow-red-500/5 border-red-500/20"
                : "text-muted-foreground hover:bg-background/60 dark:hover:bg-background/40 hover:text-foreground hover:border-border/30 hover:shadow-md"
            )}
          >
            {/* Glassmorphic background overlay */}
            <div className={cn(
              "absolute inset-0 rounded-xl transition-all duration-300",
              pathname.startsWith('/admin')
                ? "bg-gradient-to-r from-red-500/5 to-red-500/10" 
                : "bg-gradient-to-r from-background/30 to-background/10 opacity-0 group-hover:opacity-100"
            )} />
            
            {/* Active indicator line */}
            {pathname.startsWith('/admin') && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                className="absolute left-0 top-2 bottom-2 w-1 bg-red-500 rounded-r-full"
              />
            )}
            
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: pathname.startsWith('/admin') ? 1.1 : 1 }}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "flex items-center justify-center relative z-10 p-1 rounded-lg transition-all shrink-0",
                pathname.startsWith('/admin') ? "text-red-500 bg-red-500/10" : "group-hover:bg-background/50"
              )}
            >
              <ShieldAlert className={cn(
                "h-4 w-4", 
                pathname.startsWith('/admin') && "stroke-[2.5px]"
              )} />
            </motion.div>
            
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm whitespace-nowrap overflow-hidden relative z-10 font-medium min-w-0"
                >
                  Admin Dashboard
                </motion.span>
              )}
            </AnimatePresence>
            
            {pathname.startsWith('/admin') && !isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto w-2 h-2 rounded-full bg-red-500 relative z-10 shadow-sm shrink-0"
              />
            )}
          </Link>
        </motion.div>
      )}
    </nav>
  )
  // User profile and logout
  const UserProfile = () => (
    <motion.div 
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Link 
        className={cn(
          "rounded-xl p-3 bg-background/40 backdrop-blur-xl border border-border/20 hover:bg-background/60 hover:border-border/30 transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden",
          isCollapsed ? "items-center justify-center" : "flex items-center gap-3"
        )}
        href={user ? '/dashboard/profile' : '/login?next=' + pathname}
        onClick={() => setIsMobileOpen(false)}
      >
        {/* Glassmorphic background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/5 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
        
        {isCollapsed ? (
          <Avatar className="h-9 w-9 border-2 border-border/30 shadow-md relative z-10">
            <AvatarImage src={user?.avatar || ''} className='object-cover' />
            <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <>
            <Avatar className="h-10 w-10 border-2 border-border/30 shadow-md shrink-0 relative z-10">
              <AvatarImage src={user?.avatar || ''} className='object-cover' />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate relative z-10">
              <p className="text-sm font-semibold truncate text-foreground">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate opacity-80">{user?.email}</p>
            </div>
            <motion.div
              whileHover={{ x: 2 }}
              className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors relative z-10"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </>
        )}
      </Link>
      
      {
        user ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className={cn(
                "rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm", 
                isCollapsed ? "w-full h-11 p-0" : "w-full gap-2 h-11",
                loggingOut && "opacity-70",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0"
              )}
              variant="default"
              size={isCollapsed ? "icon" : "sm"}
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
            >
              {!isCollapsed && (
                <span className="font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
              )}
              <LogOut className='w-4 h-4' />
            </Button>
          </motion.div>
        ): (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className={cn(
                "rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm", 
                isCollapsed ? "w-full h-11 p-0" : "w-full gap-2 h-11",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0"
              )}
              variant="default"
              size={isCollapsed ? "icon" : "sm"}
              onClick={() => {
                router.push('/login?next=' + pathname)
                setIsMobileOpen(false)
              }}
              title="Login"
            >
              {!isCollapsed && (
                <span className="font-medium">Login</span>
              )}
              <ArrowRight className='w-4 h-4' />
            </Button>
          </motion.div>
        )
      }
    </motion.div>
  )
  // Desktop Sidebar
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-background/95 backdrop-blur-xl border-r border-border/20 shadow-2xl z-50 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full p-4 overflow-hidden">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/20 shrink-0">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto scrollbar-hidden">
                <NavLinks />
              </div>

              {/* Mobile User Profile */}
              <div className="mt-6 pt-4 border-t border-border/20 shrink-0">
                <UserProfile />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>{/* Mobile Toggle Button */}
      {/* <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden bg-background/80 backdrop-blur-xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button> */}      {/* Desktop Sidebar */}
      <motion.div 
        layout
        className={cn(
          'h-screen flex-col bg-background/60 dark:bg-background/40 backdrop-blur-xl p-3 hidden lg:flex fixed left-0 bottom-0 top-0 border-r border-border/20 shadow-xl z-30 transition-all sidebar-transition',
          isCollapsed ? 'w-[100px]' : 'w-[280px]'
        )}
        animate={{ width: isCollapsed ? 100 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: 'hidden' }}
      >
        {/* Glassmorphic background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/20 to-background/10 rounded-r-2xl" />
        
        <div className="flex flex-col flex-1 min-h-0 relative z-10 overflow-hidden">
          {/* Logo and Collapse button */}
          <motion.div 
            className={cn(
              "flex items-center py-4 px-2 mb-6 shrink-0",
              isCollapsed ? "justify-center" : "justify-between"
            )}
            layout
          >
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Logo />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 rounded-xl bg-primary/10 text-primary"
                >
                  <LucideScale className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl border border-border/30 bg-background/40 backdrop-blur-sm hover:bg-background/60 hover:border-border/50 transition-all duration-300 shadow-sm shrink-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Navigation */}
          <div className={cn(
            "flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-1",
            isCollapsed ? "scrollbar-hidden" : "custom-scrollbar"
          )}>
            <NavLinks />
          </div>
          
          {/* User Profile and Logout */}
          <div className="mt-6 pt-4 border-t border-border/20 px-1 shrink-0">
            <UserProfile />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default DashboardSidebar