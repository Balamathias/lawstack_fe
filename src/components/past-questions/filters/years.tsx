'use client'

import DynamicModal from "@/components/dynamic-modal"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import React from "react"

export const FilterByYear = () => {
    const [selectedYear, setSelectedYear] = React.useState<number | null>(null)

    const handleYearFilter = (year: number) => {
      setSelectedYear(year)
    }
  
    const years = Array.from(
      { length: new Date().getFullYear() - 2009 },
      (_, i) => new Date().getFullYear() - i
    )
    return (
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold">Year</h3>
        <div className="grid grid-cols-5 gap-1.5">
          {years.slice(0, 4).map((year) => (
            <button 
              key={year} 
              className={cn(
                "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                year === selectedYear && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
              )}
              onClick={() => handleYearFilter(year)}
            >
              {year}
            </button>
          ))}

            <DynamicModal
                trigger={
                    <button 
                    className={cn(
                        "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                        "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                        selectedYear && years.slice(4)?.includes(selectedYear) && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
                    )}
                    >
                    { selectedYear && years.slice(4)?.includes(selectedYear!) ? selectedYear : 'More'}
                    </button>
                }
                title="Filter by Year"
                dialogClassName='w-full max-w-3xl'
            >
                <div className="flex flex-col max-h-[80vh] overflow-y-auto gap-3 p-2.5">
                    <div className="grid grid-cols-5 gap-1.5">
                        {years.slice(4).map((year) => (
                        <DialogClose asChild key={year}>
                            <button 
                                className={cn(
                                "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                                "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                                year === selectedYear && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
                                )}
                                onClick={() => handleYearFilter(year)}
                            >
                                { year }
                            </button>
                        </DialogClose>
                        ))}
                    </div>
                </div>
            </DynamicModal>
        </div>
      </div>
    )
}