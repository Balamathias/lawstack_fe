import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUser } from '@/services/server/auth'
import ExploreCourses, { ExploreCoursesSkeleton } from '@/components/dashboard/explore-courses'
import SearchCourse from '@/components/dashboard/search.course'
import { Bookmark, BookOpen, GraduationCap, Library, ScrollText, Sparkles, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, PAGE_SIZE } from '@/lib/utils'
import SwitchCourses from '@/components/dashboard/courses/switch-courses'
import { getCourses } from '@/services/server/courses'

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
      <section className="relative rounded-3xl overflow-hidden hidden">
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

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 shadow-sm border border-primary/20">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:8px_8px]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 text-foreground mb-2">
                      <ScrollText className="h-7 w-7 text-primary" />
                      Course Explorer
                  </h1>
                  <p className="text-muted-foreground max-w-2xl">
                    Discover comprehensive Nigerian law courses, curated for your academic journey.
                  </p>
              </div>
              <SwitchCourses className="self-end" />
          </div>
      </div>

      <div className="w-full">
        <SearchCourse />
      </div>

      <div className="mt-0 space-y-4 sm:space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses searchParams={searchParams} getCourses={getCourses({params: { ordering: '-created_at', page_size: PAGE_SIZE, ...searchParams }})} />
          </Suspense>
      </div>
    </div>
  )
}

export default Page
