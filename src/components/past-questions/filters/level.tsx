'use client'

import DynamicModal from "@/components/dynamic-modal"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import React from "react"

export const FilterByLevel = () => {
    const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null)

    const handleLevelFilter = (level: string) => {
      setSelectedLevel(level)
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
                "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                level === selectedLevel && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
              )}
              onClick={() => handleLevelFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    )
}