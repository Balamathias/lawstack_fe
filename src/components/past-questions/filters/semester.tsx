'use client'

import { cn } from "@/lib/utils"
import React from "react"

export const FilterBySemester = () => {
    const [selectedSemester, setSelectedSemester] = React.useState<string | null>(null)

    const handleSemesterFilter = (semester: string) => {
      setSelectedSemester(semester)
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
                "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                semester.value === selectedSemester && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
              )}
              onClick={() => handleSemesterFilter(semester.value)}
            >
              {semester.name}
            </button>
          ))}
        </div>
      </div>
    )
}