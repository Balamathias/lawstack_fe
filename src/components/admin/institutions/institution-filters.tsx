'use client';

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InstitutionFiltersProps {
  onSearch?: (term: string) => void
  className?: string
}

const InstitutionFilters = ({ onSearch, className }: InstitutionFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [type, setType] = useState<string>(searchParams?.get('type') || '')
  const [country, setCountry] = useState<string>(searchParams?.get('country') || '')
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get('search') || '')

  // Institution types
  const institutionTypes = ["University", "College", "Polytechnic", "High School", "Training Center", "Research Institute"];
  
  // Countries - just a sample, would be more extensive in a real app
  const countries = ["Nigeria", "Ghana", "South Africa", "Kenya", "United States", "United Kingdom", "Canada"];

  // Update filters in URL
  const updateFilters = () => {
    const params = new URLSearchParams()
    
    if (type) params.set('type', type)
    if (country) params.set('country', country)
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
    setType('')
    setCountry('')
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
  }, [type, country])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search institutions..."
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

      {/* Institution Type filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Institution Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {institutionTypes.map((institutionType) => (
              <SelectItem key={institutionType} value={institutionType.toLowerCase()}>
                {institutionType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Country</label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((countryName) => (
              <SelectItem key={countryName} value={countryName.toLowerCase()}>
                {countryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset button */}
      {(type || country || searchTerm) && (
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

export default InstitutionFilters
