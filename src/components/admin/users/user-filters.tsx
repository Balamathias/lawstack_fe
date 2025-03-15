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

interface UserFiltersProps {
  onSearch?: (term: string) => void
  className?: string
}

const UserFilters = ({ onSearch, className }: UserFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [role, setRole] = useState<string>(searchParams?.get('role') || '')
  const [status, setStatus] = useState<string>(searchParams?.get('status') || '')
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get('search') || '')

  // Update filters in URL
  const updateFilters = () => {
    const params = new URLSearchParams()
    
    if (role === 'admin') {
      params.set('is_superuser', 'true')
    } else if (role === 'staff') {
      params.set('is_staff', 'true')
      params.set('is_superuser', 'false')
    } else if (role === 'user') {
      params.set('is_staff', 'false')
      params.set('is_superuser', 'false')
    }
    
    if (status === 'active') {
      params.set('is_active', 'true')
    } else if (status === 'inactive') {
      params.set('is_active', 'false')
    }
    
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
    setRole('')
    setStatus('')
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
  }, [role, status])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
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

      {/* Role filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="user">Regular User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Any Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Any Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset button */}
      {(role || status || searchTerm) && (
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

export default UserFilters
