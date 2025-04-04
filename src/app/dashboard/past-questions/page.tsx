import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Explorer, { ExplorerSkeleton } from '@/components/past-questions/explorer'
import Filters from '@/components/past-questions/filters'
import { ScrollText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Past Questions | Law Stack',
  description: 'Access and explore past legal examination questions from various courses and universities.'
}

interface Props {
  params: Promise<{[key: string]: any}>,
  searchParams: Promise<{[key: string]: any}>,
}

export default async function PastQuestionsPage({ params: _params, searchParams }: Props) {
  // Create a copy of searchParams for the skeleton to use
  const viewParam = searchParams.view || 'list';
  
  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 space-y-8'>
      <div className="flex items-center justify-between">
        <h1 className="sr-only">Past Questions</h1>
        <Filters />
      </div>
      
      <Suspense fallback={<ExplorerSkeleton searchParams={{ view: viewParam }} />}>
        <Explorer searchParams={searchParams} />
      </Suspense>
    </div>
  )
}