'use client'

import { cn } from '@/lib/utils';
import { useCreateBookmark } from '@/services/client/bookmarks';
import { LucideBookmark } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useOptimistic, startTransition } from 'react'
import { toast } from 'sonner';

interface Props {
    isbookmarked: boolean;
    question_id: string
}

const Bookmark = ({ isbookmarked, question_id }: Props) => {
  const { mutate: bookmarkQuestion, isPending } = useCreateBookmark()
  const router = useRouter()
  const [optimisticState, setOptimisticState] = useOptimistic(isbookmarked)

  const handleBookmarkQuestion = () => {
    startTransition(() => {
      setOptimisticState(!optimisticState)
    })

    bookmarkQuestion({ past_question_id: question_id }, {
        onSuccess: (data) => {
            if (data?.error) {
                setOptimisticState(isbookmarked) // Revert state on error
                return toast?.error(data.message)
            }

            router.refresh()

            if (data?.status === 201) {
                toast?.success('Question bookmarked successfully')
            }
        },
        onError: (error) => {
            setOptimisticState(isbookmarked) // Revert state on error
            toast?.error(error.message)
        }
    })
  }

  return (
    <button onClick={handleBookmarkQuestion} className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
        'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white', {
            'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 hover:text-white': true,
        })}>

        <LucideBookmark size={18} fill={
            optimisticState ? 'currentColor' : 'none'
        }  />
    </button>
  )
}

export default Bookmark