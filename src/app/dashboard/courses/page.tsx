import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUser } from '@/services/server/auth'
import ExploreCourses, { ExploreCoursesSkeleton } from '@/components/dashboard/explore-courses'
import SearchCourse from '@/components/dashboard/search.course'
import { Bookmark, BookOpen, GraduationCap, Library, Sparkles, Timer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    <div className='max-w-6xl flex flex-col space-y-6 md:py-10 py-6 mx-auto w-full px-4 pb-20 max-lg:mt-14'>
      {/* Simplified hero section with glassmorphic design */}
      <section className="relative rounded-3xl overflow-hidden">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute -bottom-16 -right-16 w-12 md:w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-8 -left-8 w-10 md:w-40 h-40 bg-blue-600/5 rounded-full blur-2xl"></div>
        
        {/* Content with glass effect */}
        <div className="relative backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Law Course Explorer
              </h1>
              <p className="text-muted-foreground/90 max-w-2xl text-base md:text-lg leading-relaxed">
                Discover comprehensive Nigerian law courses, curated for your academic journey.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Button className="gap-2 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20">
                  <Sparkles className="h-4 w-4" />
                  <span>Explore Courses</span>
                </Button>
                <Button variant="outline" className="gap-2 backdrop-blur-md bg-background/50 border-primary/20">
                  <BookOpen className="h-4 w-4" />
                  <span>My Learning</span>
                </Button>
              </div>
            </div>
            
            {/* Minimalist stats */}
            <div className="hidden md:flex flex-col gap-3 h-full py-4">
              <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-white/5 p-4 shadow-xl flex items-center gap-4 pr-8">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium"><span className="opacity-70">Access</span> 100+ <span className="opacity-70">courses</span></p>
              </div>
              
              <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-white/5 p-4 shadow-xl flex items-center gap-4 pr-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-3 rounded-xl">
                  <Library className="h-5 w-5 text-blue-500" />
                </div>
                <p className="font-medium"><span className="opacity-70">Practice with</span> 1000+ <span className="opacity-70">questions</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Refined tabs and content */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col gap-4 mb-4 md:mb-8">
          {/* Tabs navigation with improved mobile handling */}
          <div className="w-full overflow-x-auto scrollbar-hide -mx-1 px-1 py-2">
            <TabsList className="bg-background/50 backdrop-blur-md border border-white/10 p-1 rounded-xl h-auto w-max min-w-full md:min-w-0">
              <TabsTrigger 
                value="all" 
                className={cn(
                  "rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                )}
              >
                All Courses
              </TabsTrigger>
              <TabsTrigger 
                value="bookmarked"
                className={cn(
                  "rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                )}
              >
                Bookmarked
              </TabsTrigger>
              <TabsTrigger 
                value="popular"
                className={cn(
                  "rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                )}
              >
                Popular
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Search component - full width on mobile */}
          <div className="w-full">
            <SearchCourse />
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0 space-y-4 sm:space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses searchParams={searchParams} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="bookmarked" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center space-y-4 sm:space-y-5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-background to-background/80 backdrop-blur-md p-4 sm:p-6 rounded-full border border-primary/10 shadow-lg">
                <Bookmark className="h-8 w-8 sm:h-12 sm:w-12 text-primary/60" />
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-medium mt-2 sm:mt-4">Your Bookmarked Courses</h3>
            
            <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-relaxed px-4">
              Keep track of courses that interest you. Bookmarked courses will appear here for quick access.
            </p>
            
            {!user ? (
              <Button className="mt-2 sm:mt-4 text-sm sm:text-base bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20">
                Sign in to bookmark courses
              </Button>
            ) : (
              <Button variant="outline" className="mt-2 sm:mt-4 text-sm sm:text-base backdrop-blur-md bg-background/50 border-primary/20">
                Browse courses
              </Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0 space-y-4 sm:space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses searchParams={{ 
              ...searchParams,
              sort: "popular"
            }} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
