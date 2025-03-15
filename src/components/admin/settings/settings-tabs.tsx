"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Paintbrush, 
  Settings, 
  Shield, 
  Database,
  Users,
  Component
} from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import EmailSettings from "./email-settings"
import AppearanceSettings from "./appearance-settings"

const SettingsTabs = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const tab = searchParams.get("tab") || "email"
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <Tabs defaultValue={tab} onValueChange={handleTabChange} className="space-y-4">
      <TabsList className="flex h-auto p-1 flex-wrap">
        <TabsTrigger value="email" className="flex items-center gap-2 px-3 py-2">
          <Mail className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2 px-3 py-2">
          <Paintbrush className="h-4 w-4" />
          Appearance
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2 px-3 py-2">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="system" className="flex items-center gap-2 px-3 py-2">
          <Settings className="h-4 w-4" />
          System
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2 px-3 py-2">
          <Component className="h-4 w-4" />
          Content
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2 px-3 py-2">
          <Users className="h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="backup" className="flex items-center gap-2 px-3 py-2">
          <Database className="h-4 w-4" />
          Backup
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email" className="space-y-6">
        <EmailSettings />
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-6">
        {/* Will be implemented later */}
        <div className="text-center py-10 text-muted-foreground">
          Security settings will be available in a future update.
        </div>
      </TabsContent>
      
      <TabsContent value="system" className="space-y-6">
        {/* Will be implemented later */}
        <div className="text-center py-10 text-muted-foreground">
          System settings will be available in a future update.
        </div>
      </TabsContent>
      
      <TabsContent value="content" className="space-y-6">
        {/* Will be implemented later */}
        <div className="text-center py-10 text-muted-foreground">
          Content settings will be available in a future update.
        </div>
      </TabsContent>
      
      <TabsContent value="users" className="space-y-6">
        {/* Will be implemented later */}
        <div className="text-center py-10 text-muted-foreground">
          User settings will be available in a future update.
        </div>
      </TabsContent>
      
      <TabsContent value="backup" className="space-y-6">
        {/* Will be implemented later */}
        <div className="text-center py-10 text-muted-foreground">
          Backup settings will be available in a future update.
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default SettingsTabs
