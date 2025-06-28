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
    <button 
      onClick={handleBookmarkQuestion} 
      disabled={isPending}
      className={cn(
        'h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 relative group',
        'glass-effect bg-amber-500/5 hover:bg-amber-500/15 text-muted-foreground hover:text-amber-500',
        'hover:scale-110 hover:shadow-amber-500/25 backdrop-blur-sm border border-amber-500/10',
        'disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center',
        {
          'bg-amber-500/15 text-amber-500 border-amber-500/20 shadow-amber-500/20': optimisticState,
        }
      )}
    >
      <LucideBookmark 
        className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110" 
        fill={optimisticState ? 'currentColor' : 'none'}
      />
      <span className="sr-only">
        {optimisticState ? 'Remove bookmark' : 'Add bookmark'}
      </span>
      
      {/* Enhanced tooltip */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs whitespace-nowrap bg-background/95 backdrop-blur-sm shadow-xl rounded-lg px-3 py-2 border border-amber-500/20 pointer-events-none">
        <div className="text-amber-500 font-medium">
          {optimisticState ? 'Remove bookmark' : 'Bookmark'}
        </div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-l border-t border-amber-500/20 rotate-45"></div>
      </div>
    </button>
  )
}

export default Bookmark