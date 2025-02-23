'use client'

import { cn } from '@/lib/utils';
import { useCreateBookmark, useDeleteBookmark } from '@/services/client/bookmarks';
import { Loader2, LucideBookmark } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

interface Props {
    isbookmarked: boolean;
    question_id: string
}

const Bookmark = ({ isbookmarked, question_id }: Props) => {
  const { mutate: bookmarkQuestion, isPending } = useCreateBookmark()
  const { mutate: unbookmarkQuestion, isPending: isUnbookmarkPending } = useDeleteBookmark()
  const router = useRouter()

  const handleBookmarkQuestion = () => {
    bookmarkQuestion({ past_question_id: question_id }, {
        onSuccess: (data) => {
            
            if (data?.error) {
                return toast?.error(data.message)
            }

            router.refresh()
            
            if (data?.status === 201) {
                toast?.success('Question bookmarked successfully')
            } else {
                toast?.success('Question unbookmarked successfully')
            }
        },
        onError: (error) => {
            toast?.error(error.message)
        }
    })
  }

  return (
    <button onClick={handleBookmarkQuestion} disabled={isPending} className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
        'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white', {
            'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 hover:text-white': isbookmarked,
        })}>
        {
            isPending ? (<Loader2 className='animate-spin' size={18} />) : (
                <LucideBookmark size={18} fill={
                    isbookmarked ? 'currentColor' : 'none'
                }  />
            )
        }
    </button>
  )
}

export default Bookmark