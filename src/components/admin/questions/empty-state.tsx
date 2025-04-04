import React from 'react'
import { HelpCircle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const EmptyState = () => {
  return (
    <div className="border rounded-lg p-8 text-center bg-card">
      <div className="flex justify-center mb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No Questions Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It looks like there are no questions matching your criteria. Try adjusting your filters or add a new question to get started.
      </p>
      <Link href="/admin/questions/add">
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Your First Question
        </Button>
      </Link>
    </div>
  )
}

export default EmptyState
