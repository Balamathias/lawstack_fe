'use client'

import { addQueryParams, cn } from '@/lib/utils'
import { Grid2X2, List } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import React, { useTransition, useState } from 'react'

const SwitchDisplay = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [optimisticView, setOptimisticView] = useState(searchParams.get('view') || 'list')

  const qs = searchParams.toString()

  const toggleView = (newView: string) => {
    setOptimisticView(newView)
    startTransition(() => {
      const url = addQueryParams(qs, { view: newView })
      router.replace(url)
    })
  }

  return (
    <div className='flex items-center gap-x-2.5'>
        <button className={cn('cursor-pointer', { 'text-sky-500': optimisticView === 'list' })} aria-label="List view" onClick={() => toggleView('list')}>
            <List className='h-6 w-6' />
        </button>
        <button className={cn('cursor-pointer', { 'text-sky-500': optimisticView === 'grid' })} aria-label="Grid view" onClick={() => toggleView('grid')}>
            <Grid2X2 className='h-5 w-5' />
        </button>
    </div>
  )
}

export default SwitchDisplay