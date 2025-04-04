import React, { useState } from 'react'
import { User } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, MoreHorizontal, ShieldAlert, ShieldCheck, UserCog } from 'lucide-react'
import Link from 'next/link'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DeleteUserDialog from './delete-user-dialog'
import { cn } from '@/lib/utils'

interface UserRowProps {
  user: User
  onDelete: (id: string) => void
  isDeleting: boolean
}

const UserRow = ({ user, onDelete, isDeleting }: UserRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Determine user role badge
  const getUserRoleBadge = () => {
    if (user.is_superuser) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1">
          <ShieldAlert className="h-3 w-3" />
          Admin
        </Badge>
      );
    } else if (user.is_staff) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1">
          <UserCog className="h-3 w-3" />
          Staff
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          User
        </Badge>
      );
    }
  };

  // Determine user status badge
  const getUserStatusBadge = () => {
    return (
      <Badge 
        variant={user.is_active ? "outline" : "secondary"}
        className={cn(
          "flex items-center gap-1",
          user.is_active 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        )}
      >
        <span className={cn(
          "w-2 h-2 rounded-full",
          user.is_active ? "bg-green-500" : "bg-gray-500"
        )}></span>
        {user.is_active ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <>
      <tr className="hover:bg-muted/20">
        <td className="py-3 px-4">
          <div>
            <p className="font-medium">
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </td>
        <td className="py-3 px-4 hidden md:table-cell">
          @{user.username}
        </td>
        <td className="py-3 px-4 hidden lg:table-cell">
          {getUserRoleBadge()}
        </td>
        <td className="py-3 px-4 hidden lg:table-cell">
          {getUserStatusBadge()}
        </td>
        <td className="py-3 px-4 text-right">
          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2 items-center justify-end">
            <Link href={`/admin/users/${user.id}/view`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={user.is_superuser} // Prevent deleting superusers as a safety measure
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/view`} className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/edit`} className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={user.is_superuser}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>

      <DeleteUserDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={() => {
          onDelete(user.id)
          setShowDeleteDialog(false)
        }}
        username={user.username}
        email={user.email}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default UserRow
