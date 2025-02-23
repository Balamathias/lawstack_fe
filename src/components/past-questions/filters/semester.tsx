'use client'

import { addQueryParams, cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useTransition, useState } from "react"

export const FilterBySemester = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticSemester, setOptimisticSemester] = useState<string | null>(null)

  const selectedSemester = optimisticSemester ?? (searchParams?.get('semester') ? searchParams?.get('semester') : null)

  const handleSemesterFilter = (semester: string) => {
    setOptimisticSemester(semester)
    startTransition(() => {
      const qs = searchParams.toString()
      const url = addQueryParams(qs, { semester: semester })
      router.replace(url)
    })
  }
  
  // Define semesters based on the levels
  const semesters = [{
    name: "1st Semester",
    value: "1"
  }, {
    name: "2nd Semester",
    value: "2"
  },]

  return (
    <div className="flex flex-col gap-1.5">
    <h3 className="text-lg font-semibold">Semester</h3>
    <div className="grid grid-cols-2 gap-1.5">
      {semesters.map((semester) => (
      <button 
        key={semester.value} 
        className={cn(
        "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
        "bg-secondary/50 text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
        semester.value === selectedSemester && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
        )}
        onClick={() => handleSemesterFilter(semester.value)}
        disabled={isPending}
      >
        {semester.name}
      </button>
      ))}
    </div>
    </div>
  )
}