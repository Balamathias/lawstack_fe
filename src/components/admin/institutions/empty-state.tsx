import React from 'react'
import { Building2, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const EmptyState = () => {
  return (
    <div className="border rounded-lg p-8 text-center bg-card">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
          <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No Institutions Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It looks like there are no institutions matching your criteria. Try adjusting your filters or add a new institution to get started.
      </p>
      <Link href="/admin/institutions/add">
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Your First Institution
        </Button>
      </Link>
    </div>
  )
}

export default EmptyState
