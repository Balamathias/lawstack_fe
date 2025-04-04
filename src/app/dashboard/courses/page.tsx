import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUser } from '@/services/server/auth'
import ExploreCourses, { ExploreCoursesSkeleton } from '@/components/dashboard/explore-courses'
import SearchCourse from '@/components/dashboard/search.course'
import { Bookmark, BookOpen, GraduationCap, Library, Timer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Explore Courses | Law Stack',
  description: 'Discover and explore law courses to enhance your legal education'
}

interface Props {
  params: Promise<Record<string, any>>,
  searchParams: Promise<Record<string, any>>,
}

const Page = async ({ params: _params, searchParams: _searchParams }: Props) => {
  const { data: user } = await getUser()
  const searchParams = await _searchParams

  return (
    <div className='max-w-7xl flex flex-col space-y-4 md:py-8 py-4 md:mx-auto w-full px-4 pb-20 max-lg:mt-14'>
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.03)_25%,rgba(68,68,68,.03)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.03)_75%)] bg-[length:8px_8px]"></div>
        
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Law Course Explorer</h1>
          <p className="text-muted-foreground max-w-3xl text-base md:text-lg">
            Discover comprehensive law courses tailored for Nigerian law students. Browse through past questions, study materials, and resources.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
            <Card className="bg-card/50 border border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">All Courses</p>
                  <p className="text-muted-foreground text-xs">Comprehensive curriculum</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Library className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Past Questions</p>
                  <p className="text-muted-foreground text-xs">Practice materials</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Study Plans</p>
                  <p className="text-muted-foreground text-xs">Structured learning</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bookmark className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Bookmarks</p>
                  <p className="text-muted-foreground text-xs">Save for later</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Tabs and content */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-card">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">All Courses</TabsTrigger>
            <TabsTrigger value="bookmarked" className="data-[state=active]:bg-primary/10">Bookmarked</TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-primary/10">Popular</TabsTrigger>
          </TabsList>
          
          <div className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span>My Learning</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <SearchCourse />
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses searchParams={searchParams} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="bookmarked" className="mt-0">
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <Bookmark className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-xl font-medium">Your bookmarked courses</h3>
            <p className="text-muted-foreground max-w-md">
              Bookmark your favorite courses to access them quickly. Your bookmarked courses will appear here.
            </p>
            {!user ? (
              <Button variant="default" className="mt-4">Sign in to bookmark courses</Button>
            ) : (
              <Button variant="outline" className="mt-4">Browse courses</Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <SearchCourse />
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses searchParams={{ 
              ...searchParams, 
              // ordering: 'popularity' // Use actual backend field for popularity sorting
            }} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
