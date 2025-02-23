'use client'

import { cn } from '@/lib/utils';
import { LucideBookmark } from 'lucide-react'
import React from 'react'

interface Props {
    isbookmarked: boolean;
}

const Bookmark = ({ isbookmarked }: Props) => {
  return (
    <button className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
        'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white', {
            'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 hover:text-white': true,
        })}>
        <LucideBookmark size={18} fill={
            isbookmarked ? 'currentColor' : 'none'
        }  />
    </button>
  )
}

export default Bookmark