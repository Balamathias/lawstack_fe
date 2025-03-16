import BackButton from '@/components/back-button';
import LoadingOverlay from '@/components/loading-overlay';
import QuestionDetail from '@/components/past-questions/question-detail';
import { getQuestion } from '@/services/server/questions';
import { Metadata, ResolvingMetadata } from 'next';
import React, { Suspense } from 'react'

interface Props {
    params: Promise<{[key: string]: any}>,
    searchParams: Promise<{[key: string]: any}>,
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
 
  const { data: question } = await getQuestion(id)
 
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: question?.text_plain || question?.text || 'Question',
    description: question?.text_plain || question?.text || 'Question',
    openGraph: {
      images: [...previousImages],
    },
  }
}

const Page: React.FC<Props> = async ({ params: _params, searchParams: _searchParams }) => {
  const params = await _params;
  const searchParams = await _searchParams;


  return (
    <div className='w-full flex flex-col gap-y-10 max-w-5xl mx-auto p-4 sm:p-8 '>
        <div className='flex flex-col gap-y-5'>
            <h1 className='text-3xl font-bold hidden'>Past Questions</h1>
            
            <BackButton />

            <Suspense fallback={<LoadingOverlay />}>
                <QuestionDetail id={params.id} />
            </Suspense>
        </div>
    </div>
  )
}

export default Page