'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <button className='flex items-center flex-row gap-x-1 mb-3 hover:text-primary cursor-pointer transition-all w-fit' onClick={handleBack}>
      <ChevronLeft />
      <span className='text-muted-foreground hover:text-primary'>Back</span>
    </button>
  )
}

export default BackButton