'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  toggleMobile: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  return (
    <SidebarContext.Provider value={{
      isMobileOpen,
      setIsMobileOpen,
      toggleMobile
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider
