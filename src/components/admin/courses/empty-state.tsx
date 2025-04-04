import React from 'react'
import { BookOpen, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const EmptyState = () => {
  return (
    <div className="border rounded-lg p-8 text-center bg-card">
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It looks like there are no courses matching your criteria. Try adjusting your filters or add a new course to get started.
      </p>
      <Link href="/admin/courses/add">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Your First Course
        </Button>
      </Link>
    </div>
  )
}

export default EmptyState
