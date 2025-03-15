import React from 'react'
import { User } from '@/@types/db'
import { PaginatedStackResponse } from '@/@types/generics'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import UserRow from './user-row'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react'
import { useDeleteUser } from '@/services/client/users'

interface UsersTableProps {
  users: PaginatedStackResponse<User[]>
}

const UsersTable = ({ users }: UsersTableProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()
  
  // Calculate pagination details
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1
  const totalPages = Math.ceil(users.count / 10) // Assuming 10 items per page
  
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const handleDelete = (id: string) => {
    deleteUser(id);
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-sm">User</th>
              <th className="text-left py-3 px-4 font-medium text-sm hidden md:table-cell">Username</th>
              <th className="text-left py-3 px-4 font-medium text-sm hidden lg:table-cell">Role</th>
              <th className="text-left py-3 px-4 font-medium text-sm hidden lg:table-cell">Status</th>
              <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.data.map((user) => (
              <UserRow 
                key={user.id} 
                user={user} 
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 10, users.count)}</span> of{' '}
            <span className="font-medium">{users.count}</span> users
          </p>

          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(createPageUrl(1))}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(createPageUrl(currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex gap-1 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show 2 pages before and after current page
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(createPageUrl(pageNum))}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(createPageUrl(currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(createPageUrl(totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p>Deleting user...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersTable
