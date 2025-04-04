"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function CourseDetailActions() {
  return (
        <div>
          <h3 className="mb-4 text-lg font-medium">Select a Course of Action</h3>
          <div className="grid grid-col-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                <Label>Retrieve Past Questions</Label>
                <p className="text-sm text-muted-foreground">
                    Get access to past questions for this course.
                </p>
                </div>
                <Switch
                />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                <Label>Study this Course</Label>
                <p className="text-sm text-muted-foreground">
                    Learn and study this course.
                </p>
                </div>
                <Switch
                />
            </div>
          </div>
        </div>
  )
}
