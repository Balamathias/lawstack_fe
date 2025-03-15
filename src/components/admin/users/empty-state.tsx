import React from 'react'
import { Users, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const EmptyState = () => {
  return (
    <div className="border rounded-lg p-8 text-center bg-card">
      <div className="flex justify-center mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-full">
          <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It looks like there are no users matching your criteria. Try adjusting your filters or add a new user to get started.
      </p>
      <Link href="/admin/users/add">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </Link>
    </div>
  )
}

export default EmptyState
