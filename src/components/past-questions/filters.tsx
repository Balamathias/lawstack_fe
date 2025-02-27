import { SlidersHorizontal } from 'lucide-react'
import React, { Suspense } from 'react'
import DynamicModal from '../dynamic-modal'
import { FilterByYear } from './filters/years'
import { FilterBySession } from './filters/session'
import { FilterByLevel } from './filters/level'
import { FilterBySemester } from './filters/semester'
import { FilterByCourse, FilterByCourseSkeleton } from './filters/course'
import { getCourses } from '@/services/server/courses'

interface Props {
  isPQ?: boolean
}

const Filters: React.FC<Props> = ({ isPQ=true }) => {
  return (
    <DynamicModal
      trigger={
        <SlidersHorizontal className='text-muted-foreground hover:text-green-500 cursor-pointer transition-all' size={20} />
      }
      title="Filter Options"
      dialogClassName='w-full max-w-3xl rounded-[1.8rem]'
    >
      <div className="flex flex-col max-h-[700px] overflow-y-auto gap-3 p-2.5 pb-4">
        <FilterBySemester />
        {isPQ && <Suspense fallback={<FilterByCourseSkeleton />}>
          <FilterByCourse getCourses={getCourses()} />
        </Suspense>}
        <FilterBySession />
        
        {isPQ && <FilterByYear />}
        {isPQ && <FilterByLevel />}
      </div>
    </DynamicModal>
  )
}

export default Filters