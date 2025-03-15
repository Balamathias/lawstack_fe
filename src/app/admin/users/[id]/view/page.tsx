import React from 'react'
import { ArrowLeft, User, Mail, Calendar, ShieldAlert, ShieldCheck, UserCog, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { getUser } from '@/services/server/users'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const ViewUserPage = async ({ params: _params }: PageProps) => {
  const params = await _params
  const userResponse = await getUser(params.id)
  
  if (!userResponse?.data) {
    return notFound()
  }
  
  const user = userResponse.data
  
  // Format date of joining
  const formattedDate = user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'Unknown'
  
  // Get role badge component
  const getRoleBadge = () => {
    if (user.is_superuser) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1">
          <ShieldAlert className="h-3 w-3" />
          Administrator
        </Badge>
      );
    } else if (user.is_staff) {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1">
          <UserCog className="h-3 w-3" />
          Staff
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Regular User
        </Badge>
      );
    }
  };
  
  return (
    <div className='max-w-7xl flex flex-col space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div>
        <Link 
          href="/admin/users" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className='text-2xl font-bold'>
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.username}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">@{user.username}</p>
              <span className="text-muted-foreground">•</span>
              {getRoleBadge()}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/users/${params.id}/edit`}>
              <Button variant="outline">Edit User</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User profile information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                <p className="mt-1">{user.first_name || '—'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                <p className="mt-1">{user.last_name || '—'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email Address
              </h3>
              <p className="mt-1">{user.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined
              </h3>
              <p className="mt-1">{formattedDate}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* User account status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span>Account Active</span>
              {user.is_active ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  <XCircle className="h-3 w-3" />
                  Inactive
                </Badge>
              )}
            </div>
            
            <div className="flex justify-between items-center border-b pb-3">
              <span>Staff Access</span>
              {user.is_staff ? (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  Disabled
                </Badge>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span>Admin Privileges</span>
              {user.is_superuser ? (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  Disabled
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ViewUserPage
