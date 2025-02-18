import LoadingOverlay from '@/components/loading-overlay';
import QuestionDetail from '@/components/past-questions/question-detail';
import { getQuestion } from '@/services/server/questions';
import { ChevronLeft } from 'lucide-react';
import React, { Suspense } from 'react'

interface Props {
    params: Promise<{[key: string]: any}>,
    searchParams: Promise<{[key: string]: any}>,
}

const Page: React.FC<Props> = async ({ params: _params, searchParams: _searchParams }) => {
  const params = await _params;
  const searchParams = await _searchParams;


  return (
    <div className='w-full flex flex-col gap-y-10 max-w-7xl mx-auto p-4 sm:p-8'>
        <div className='flex flex-col gap-y-5'>
            <h1 className='text-3xl font-bold hidden'>Past Questions</h1>
            
            <button className='flex items-center flex-row gap-x-1 mb-3'>
                <ChevronLeft />
                <span className='text-muted-foreground'>Back</span>
            </button>
            <Suspense fallback={<LoadingOverlay />}>
                <QuestionDetail id={params.id} />
            </Suspense>
        </div>
    </div>
  )
}

export default Page