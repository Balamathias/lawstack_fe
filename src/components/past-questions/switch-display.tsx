'use client'

import { addQueryParams, cn } from '@/lib/utils'
import { Grid2X2, List } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const SwitchDisplay = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const qs = searchParams.toString()

  const view = searchParams.get('view') || 'grid'

  const toggleView = (newView: string) => {
    const url = addQueryParams(qs, { view: newView })
    router.replace(url)
  }

  return (
    <div className='flex items-center gap-x-2.5'>
        <button className={cn('cursor-pointer', { 'text-sky-500': view === 'grid' })} aria-label="Grid view" onClick={() => toggleView('grid')}>
            <Grid2X2 className='h-5 w-5' />
        </button>
        <button className={cn('cursor-pointer', { 'text-sky-500': view === 'list' })} aria-label="List view" onClick={() => toggleView('list')}>
            <List className='h-5 w-5' />
        </button>
    </div>
  )
}

export default SwitchDisplay