'use client'

import DynamicModal from "@/components/dynamic-modal"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import React from "react"

export const FilterBySession = () => {
    const [selectedSession, setSelectedSession] = React.useState<string | null>(null)

    const handleSessionFilter = (session: string) => {
      setSelectedSession(session)
    }
  
    // Generate sessions from 2009/2010 to current year
    const generateSessions = () => {
      const currentYear = new Date().getFullYear()
      const sessions = []
      for (let startYear = currentYear; startYear >= 2009; startYear--) {
        sessions.push(`${startYear}/${startYear + 1}`)
      }
      return sessions
    }

    const sessions = generateSessions()

    return (
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold">Session</h3>
        <div className="grid grid-cols-3 gap-1.5">
          {sessions.slice(0, 5).map((session) => (
            <button 
              key={session} 
              className={cn(
                "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                session === selectedSession && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
              )}
              onClick={() => handleSessionFilter(session)}
            >
              {session}
            </button>
          ))}

            <DynamicModal
                trigger={
                    <button 
                    className={cn(
                        "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                        "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                        selectedSession && sessions.slice(5)?.includes(selectedSession) && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
                    )}
                    >
                    { selectedSession && sessions.slice(5)?.includes(selectedSession) ? selectedSession : 'More'}
                    </button>
                }
                title="Filter by Session"
                dialogClassName='w-full max-w-3xl'
            >
                <div className="flex flex-col max-h-[80vh] overflow-y-auto gap-3 p-2.5">
                    <div className="grid grid-cols-3 gap-1.5">
                        {sessions.slice(5).map((session) => (
                        <DialogClose asChild key={session}>
                            <button 
                                className={cn(
                                "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                                "bg-secondary/50 text-gray-500 hover:text-green-500 hover:bg-green-500/10",
                                session === selectedSession && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
                                )}
                                onClick={() => handleSessionFilter(session)}
                            >
                                {session}
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