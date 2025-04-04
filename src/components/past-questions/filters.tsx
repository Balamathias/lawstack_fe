'use client'

import { SlidersHorizontal, FilterX, Check } from 'lucide-react'
import React, { useState } from 'react'
import DynamicModal from '../dynamic-modal'
import { FilterByYear } from './filters/years'
import { FilterBySession } from './filters/session'
import { FilterByLevel } from './filters/level'
import { FilterBySemester } from './filters/semester'
import { FilterByCourse } from './filters/course'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'nextjs-toploader/app'

interface Props {
  isPQ?: boolean
}

const Filters: React.FC<Props> = ({ isPQ=true }) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Count active filters
  const activeFilters = ['year', 'semester', 'course', 'session', 'level']
    .filter(param => searchParams?.has(param) && searchParams.get(param) !== '');
    
  const hasFilters = activeFilters.length > 0;
  
  // Clear all filters
  const clearAllFilters = () => {
    router.push(window.location.pathname, { scroll: false });
    setOpen(false);
  };
  
  return (
    <div className="relative">
      <DynamicModal
        open={open}
        setOpen={setOpen}
        trigger={
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SlidersHorizontal className='text-muted-foreground hover:text-primary cursor-pointer transition-all' size={20} />
            {hasFilters && (
              <Badge variant="default" className="bg-primary text-xs h-6 font-normal">
                {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
              </Badge>
            )}
          </motion.div>
        }
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filter Options</span>
              {hasFilters && (
                <Badge variant="default" className="bg-primary/20 text-primary text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </div>
            {hasFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-8 text-xs gap-1 text-destructive hover:text-destructive/90"
              >
                <FilterX className="h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>
        }
        dialogClassName='w-full max-w-3xl rounded-[1.8rem] max-h-[85vh]'
      >
        <div className="flex flex-col gap-4 p-2.5 pb-16 overflow-y-auto max-h-[70vh]">
          <FilterBySemester />
          {isPQ && <FilterByCourse />}
          <FilterBySession />
          
          {isPQ && <FilterByYear />}
          {isPQ && <FilterByLevel />}
          
          {hasFilters && (
            <div className="sticky bottom-0 bg-card pt-4 border-t flex justify-between w-full px-4 pb-4 shadow-sm bg-opacity-90 backdrop-blur-sm">
              <Button 
                variant="outline" 
                className="flex-1 gap-2 mr-2"
                onClick={clearAllFilters}
              >
                <FilterX className="h-4 w-4" />
                Clear All
              </Button>
              <Button 
                variant="default" 
                className="flex-1 gap-2" 
                onClick={() => setOpen(false)}
              >
                <Check className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          )}
        </div>
      </DynamicModal>
    </div>
  )
}

export default Filters