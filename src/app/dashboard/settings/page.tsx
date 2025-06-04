import React from 'react';
import { Metadata } from 'next';
import { getUser } from '@/services/server/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, User, Bell, Shield, Lock } from 'lucide-react';
import ThemeSettings from '@/components/settings/theme-settings';
import { UserProfilePage } from '@/components/profile/user-profile-page';

export const metadata: Metadata = {
  title: 'Settings | Law Stack',
  description: 'Personalize your Law Stack experience',
};

const SettingsPage = async () => {
  const { data: user } = await getUser();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 max-lg:mt-14">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Personalize your experience and manage your account settings.
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <div className="border-b border-border mb-8">
            <TabsList className="bg-transparent p-0 h-auto flex w-full justify-start -mb-px space-x-1 gap-2.5 flex-wrap">
              <TabsTrigger 
                value="appearance"
                className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 transition-all hover:bg-muted/40 data-[state=active]:font-medium"
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="account"
                className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 transition-all hover:bg-muted/40 data-[state=active]:font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 transition-all hover:bg-muted/40 data-[state=active]:font-medium"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 transition-all hover:bg-muted/40 data-[state=active]:font-medium"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="appearance" className="space-y-6 mt-0">
            <Card className="border border-border rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Appearance Settings</CardTitle>
                </div>
                <CardDescription className="pt-1.5">
                  Customize the look and feel of your Law Stack interface. Choose your preferred color theme and appearance mode.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSettings />
              </CardContent>
            </Card>
          </TabsContent>          <TabsContent value="account" className="mt-0">
            <UserProfilePage currentUser={user} />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card className="border border-border rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Notification Settings</CardTitle>
                </div>
                <CardDescription className="pt-1.5">
                  Control which notifications you receive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Notification settings coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="border border-border rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Security Settings</CardTitle>
                </div>
                <CardDescription className="pt-1.5">
                  Manage your security preferences and account protection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Security settings coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
