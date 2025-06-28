import { Question } from '@/@types/db'
import MarkdownPreview from '@/components/markdown-preview'
import { getQuestions } from '@/services/server/questions'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Empty from '@/components/empty'
import { truncateString } from '@/lib/utils'
import Pagination from '@/components/pagination'
import { cn } from '@/lib/utils' // Import cn utility
import { ChevronRight } from 'lucide-react' // Import an icon

interface Props {
  courseId: string,
  searchParams: Record<string, any>
}

const PAGE_SIZE = 30

const CourseQuestions = async ({ courseId, searchParams }: Props) => {
  const { data: questions, count } = await getQuestions({ params: { course: courseId, ...searchParams, page_size: PAGE_SIZE } })

  const page = Number(searchParams?.page || 1)
  
  return (
    <div className="relative animate-fade-in"> {/* Added fade-in animation */}
    {questions?.length > 0 ? (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> {/* Increased gap */}
        {questions.map((question, index) => (
        <QuestionItem 
          key={question.id} 
          question={question} 
          number={(index + 1) + (page - 1) * PAGE_SIZE} 
          // Add staggered animation delay
          style={{ animationDelay: `${index * 50}ms` }} 
          className="opacity-0 animate-slide-in-up" // Add slide-in animation
        />
        ))}
      </div>
      <Pagination
        totalPages={Math.ceil(count / PAGE_SIZE)}
        className="mt-10" // Increased margin
      />
      </>
    ) : (
      <div className="flex justify-center py-16 animate-fade-in"> {/* Increased padding & animation */}
      <Empty 
        title="No questions found" 
        content="There are currently no questions available for this course or filter." 
        color="blue" 
        // Use glass effect for empty state card in dark mode for better contrast
        className="dark:glass-effect dark:border dark:border-border/20 max-w-md p-6 rounded-lg" 
      />
      </div>
    )}
    </div>
  )
  }
  
  const QuestionItem = ({ 
  question, 
  number, 
  className, 
  style 
  }: { 
    question: Question; 
    number: number; 
    className?: string; 
    style?: React.CSSProperties 
  }) => {
  return (
    <Link 
    href={`/dashboard/past-questions/${question.id}`} 
    className={cn("group block", className)}
    style={style}
    >
    <div className={cn(
      "h-full p-5 rounded-xl border border-border/30",
      "bg-white dark:bg-secondary/20",
      "shadow-sm hover:shadow-lg dark:hover:shadow-primary/10",
      "transition-all duration-300 ease-out",
      "hover:border-primary/40 dark:hover:border-primary/40",
      "hover:scale-[1.02] transform",
      "flex flex-col",
      "dark:glass-effect dark:border-border/20" 
    )}>
      <div className="flex items-center mb-4"> {/* Increased margin */}
      {/* Enhanced number circle */}
      <div className={cn(
        "flex items-center justify-center w-9 h-9 rounded-full mr-3", // Slightly larger
        "bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/15 dark:to-primary/25", // Subtle gradient
        "text-primary font-semibold", // Bolder font
        "group-hover:scale-110 group-hover:shadow-md group-hover:from-primary/15 group-hover:to-primary/30", // Hover effects
        "transition-all duration-300 ease-out"
      )}>
        {number}
      </div>
      {question?.session && (
        <span className="text-xs bg-secondary/60 dark:bg-secondary/40 text-muted-foreground px-2.5 py-1 rounded-full font-medium"> {/* Enhanced styling */}
        {question.session}
        </span>
      )}
      </div>
      
      <div className="flex-1 mb-3"> {/* Added margin bottom */}
      {/* Ensure prose styles don't limit height too much */}
      <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-5"> {/* Use line-clamp */}
        <MarkdownPreview content={truncateString(question.text, 180)} />
      </div>
      </div>
      
      <div className="mt-auto text-sm text-muted-foreground flex justify-end items-center"> {/* Use mt-auto to push to bottom */}
      <span className="group-hover:text-primary transition-colors duration-200 flex items-center gap-1 font-medium group-hover:font-semibold"> {/* Added font weight changes */}
        View question
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" /> {/* Use Lucide icon */}
      </span>
      </div>
    </div>
    </Link>
  )
  }

  export const CourseQuestionsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse"> {/* Added gap and pulse */}
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="p-5 bg-white dark:bg-secondary/20 rounded-xl border border-border/30 shadow-sm"> {/* Matched card style */}
      <div className="flex items-center mb-4">
        <Skeleton className="w-9 h-9 rounded-full mr-3" /> {/* Matched size */}
        <Skeleton className="h-5 w-20 rounded-full" /> {/* Slightly wider */}
      </div>
      <Skeleton className="mb-2 h-4 w-full rounded" />
      <Skeleton className="mb-2 h-4 w-full rounded" />
      <Skeleton className="mb-3 h-4 w-5/6 rounded" /> {/* Adjusted width */}
      <div className="mt-4 flex justify-end"> {/* Matched spacing */}
        <Skeleton className="h-5 w-28 rounded" /> {/* Matched text size */}
      </div>
      </div>
    ))}
    </div>
  )
  }

export default CourseQuestions
