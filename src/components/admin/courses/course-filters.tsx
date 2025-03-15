'use client';

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useInstitutions } from '@/services/client/institutions'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Loader2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CourseFiltersProps {
  onSearch?: (term: string) => void
  className?: string
}

const CourseFilters = ({ onSearch, className }: CourseFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [institutionId, setInstitutionId] = useState<string>(searchParams?.get('institution') || '')
  const [level, setLevel] = useState<string>(searchParams?.get('level') || '')
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get('search') || '')

  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions()

  // Levels for educational system
  const levels = ["100", "200", "300", "400", "500", "600"]

  // Update filters in URL
  const updateFilters = () => {
    const params = new URLSearchParams()
    
    if (institutionId) params.set('institution', institutionId)
    if (level) params.set('level', level)
    if (searchTerm) params.set('search', searchTerm)
    
    // Reset to page 1 when filters change
    params.set('page', '1')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  // Handle filter reset
  const resetFilters = () => {
    setInstitutionId('')
    setLevel('')
    setSearchTerm('')
    
    if (onSearch) {
      onSearch('')
    }
    
    router.push(pathname)
  }

  // Update URL when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [institutionId, level])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          className="pl-9"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('')
              if (onSearch) onSearch('')
            }}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Institution filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Institution</label>
        <Select value={institutionId} onValueChange={setInstitutionId}>
          <SelectTrigger>
            <SelectValue placeholder="All Institutions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Institutions</SelectItem>
            {isLoadingInstitutions ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading institutions...
                </div>
              </SelectItem>
            ) : (
              institutionsData?.data?.map((institution) => (
                <SelectItem key={institution.id} value={institution.id}>
                  {institution.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Level filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Level</label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {levels.map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {lvl} Level
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset button */}
      {(institutionId || level || searchTerm) && (
        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="w-full"
        >
          Reset Filters
        </Button>
      )}
    </div>
  )
}

export default CourseFilters
