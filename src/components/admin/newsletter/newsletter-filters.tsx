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
import { Search, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NewsletterFiltersProps {
  onSearch?: (term: string) => void
  className?: string
  categories?: string[]
}

const NewsletterFilters = ({ onSearch, className, categories = [] }: NewsletterFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState<string>(searchParams?.get('category') || '')
  const [status, setStatus] = useState<string>(searchParams?.get('status') || '')
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get('search') || '')

  // Update filters in URL
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams?.toString())
    
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search input
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm)
    }
    updateFilters()
  }

  // Handle enter key press in search input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setCategory('')
    setStatus('')
    setSearchTerm('')
    
    const params = new URLSearchParams()
    router.push(pathname + (params.toString() ? `?${params.toString()}` : ''))
    
    if (onSearch) {
      onSearch('')
    }
  }

  // Update filters when route changes
  useEffect(() => {
    const currentCategory = searchParams?.get('category') || ''
    const currentStatus = searchParams?.get('status') || ''
    const currentSearch = searchParams?.get('search') || ''
    
    setCategory(currentCategory)
    setStatus(currentStatus)
    setSearchTerm(currentSearch)
  }, [searchParams])

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search newsletters..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('')
                if (onSearch) onSearch('')
                updateFilters()
              }}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch}
          className="shrink-0"
        >
          Search
        </Button>
      </div>
      
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className="w-full sm:w-auto">
          <Select 
            value={category} 
            onValueChange={(value) => {
              setCategory(value)
              updateFilters()
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select 
            value={status} 
            onValueChange={(value) => {
              setStatus(value)
              updateFilters()
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
          className="ml-auto"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

export default NewsletterFilters