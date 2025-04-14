import React from 'react'
import Link from 'next/link'
import { PlusCircle, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import NewsletterTable from '@/components/admin/newsletter/newsletters-table'
import NewsletterFilters from '@/components/admin/newsletter/newsletter-filters'
import { getNewsletters, getNewsletterCategories } from '@/services/server/newsletter'

export const dynamic = 'force-dynamic';

const NewsletterAdminPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  // Extract search params
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category as string || '';
  const status = resolvedSearchParams?.status as string || '';
  const search = resolvedSearchParams?.search as string || '';
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page as string) : 1;
  
  // Build query parameters for API call
  const queryParams: Record<string, any> = { page };
  if (category) queryParams.category = category;
  if (status) queryParams.status = status;
  if (search) queryParams.search = search;

  // Fetch newsletters and categories
  const { data: newsletters = [], error } = await getNewsletters(queryParams);
  const { data: categoriesData = [] } = await getNewsletterCategories();
  
  // Extract category names
  const categories = categoriesData.map(cat => cat.name);

  return (
    <div className="max-w-7xl flex flex-col space-y-2.5 sm:space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Newsletters</h2>
          <p className="text-muted-foreground mt-1">
            Create and send newsletters to your subscribers
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
                <NewsletterFilters categories={categories} className="flex flex-col space-y-4" />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/admin/newsletter/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Newsletter
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="hidden md:block mb-6">
        <NewsletterFilters categories={categories} />
      </div>

      {/* Error display */}
      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">Error loading newsletters</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <NewsletterTable newsletters={newsletters} />
      )}
    </div>
  )
}

export default NewsletterAdminPage