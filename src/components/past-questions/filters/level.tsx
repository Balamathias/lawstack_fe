'use client'

import DynamicModal from "@/components/dynamic-modal"
import { DialogClose } from "@/components/ui/dialog"
import { addQueryParams, cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import React, { useState, useTransition } from "react"

export const FilterByLevel = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticLevel, setOptimisticLevel] = useState<string | null>(null)

  const selectedLevel = optimisticLevel ?? (searchParams?.get('level') ? searchParams?.get('level') : null)

  const qs = searchParams?.toString()

  const handleLevelFilter = (level: string) => {
    setOptimisticLevel(level)
    startTransition(() => {
      const url = addQueryParams(qs, { level: level })
      router.replace(url)
    })
  }
  
  // Define levels from 100 to 500
  const levels = ['100', '200', '300', '400', '500']

  return (
    <div className="flex flex-col gap-1.5">
    <h3 className="text-lg font-semibold">Level</h3>
    <div className="grid grid-cols-5 gap-1.5">
      {levels.map((level) => (
      <button 
        key={level} 
        className={cn(
        "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
        "bg-secondary/50 text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
        level === selectedLevel && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
        )}
        onClick={() => handleLevelFilter(level)}
        disabled={isPending}
      >
        {level}
      </button>
      ))}
    </div>
    </div>
  )
}