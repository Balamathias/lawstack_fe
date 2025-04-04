"use client";

import React, { useState } from 'react'
import InstitutionsTable from '@/components/admin/institutions/institutions-table'
import InstitutionFilters from '@/components/admin/institutions/institution-filters'
import { Button } from '@/components/ui/button'
import { PlusCircle, ListFilter } from 'lucide-react'
import Link from 'next/link'
import { useInstitutions } from '@/services/client/institutions'
import { useSearchParams } from 'next/navigation'
import { Institution } from '@/services/server/institutions'
import { PaginatedStackResponse } from '@/@types/generics'
import EmptyState from '@/components/admin/institutions/empty-state'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

const InstitutionsPageClient = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  const params: Record<string, string | number | boolean> = {};
  // Add any search params from the URL
  if (searchParams?.get('type')) params.type = searchParams.get('type') as string;
  if (searchParams?.get('country')) params.country = searchParams.get('country') as string;
  if (searchParams?.get('page')) params.page = parseInt(searchParams.get('page') as string);
  if (searchTerm) params.search = searchTerm;

  const { data: institutionsData, isLoading, isError, error } = useInstitutions({ params });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className='text-2xl font-bold'>
            Institutions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage educational institutions in the system
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <ListFilter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <InstitutionFilters onSearch={handleSearch} className="flex flex-col space-y-4" />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/admin/institutions/add">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Institution
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <div className="sticky top-4">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium text-lg mb-4">Filters</h3>
              <InstitutionFilters onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Institutions Table */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
              <p>Error loading institutions: {error?.message || 'An unknown error occurred'}</p>
            </div>
          ) : institutionsData?.data?.length === 0 ? (
            <EmptyState />
          ) : (
            <InstitutionsTable 
              institutions={institutionsData as PaginatedStackResponse<Institution[]>}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default InstitutionsPageClient
