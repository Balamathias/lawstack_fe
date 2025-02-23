import { getQuestions } from '@/services/server/questions'
import { ScrollText, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'
import SwitchDisplay from './switch-display'

interface Props {
    params?: Promise<{[key: string]: any}>,
    searchParams: Promise<{[key: string]: any}>
}

const Explorer = async ({ searchParams: _searchParams }: Props) => {
    const searchParams = await _searchParams
    const view = searchParams.view || 'grid'

    const { data } = await getQuestions({
        params: {
            page_size: 12,
            ...searchParams
        }
    })

    return (
        <div className="space-y-4 mt-10">
            <div className='flex items-center gap-2 justify-between py-2'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <ScrollText className="h-6 w-6" />
                    Recent Questions
                </h2>
                <SwitchDisplay />
            </div>
            <div className={cn("gap-4", {
                "grid md:grid-cols-2 lg:grid-cols-3": view === 'grid',
                "flex flex-col": view === 'list'
            })}>
                {data.map((question) => (
                    <Link
                        href={`/past-questions/${question.id}`}
                        key={question.id}
                        className="group p-4 rounded-lg border border-secondary hover:border-secondary/50 transition-all hover:shadow-md bg-secondary/20 backdrop-blur-md hover:bg-secondary/80 flex flex-col gap-4 justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <p className="font-medium line-clamp-2 hover:text-muted-foreground transition-all">{question?.text_plain || question.text}</p>
                            <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex items-center gap-2 mt-3 justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <time>{new Date(question.created_at).toLocaleDateString()}</time>
                            </div>

                            <span className="text-xs text-muted-foreground border-green-secondary/50 px-2.5 py-1.5 bg-green-secondary/10 border rounded-full">{question.course_name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Explorer

export const ExplorerSkeleton = ({ searchParams }: { searchParams: { view: string } }) => {

    const view = searchParams.view || 'grid'

    return (
        <div className="space-y-4 mt-10">
            <div className='flex items-center gap-2 justify-between py-2'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <ScrollText className="h-6 w-6" />
                    Recent Questions
                </h2>
                <SwitchDisplay />
            </div>
            <div className={
                cn("gap-4", {
                    "grid md:grid-cols-2 lg:grid-cols-3": view === 'grid',
                    "flex flex-col": view === 'list'
                })
            }>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
                    <div key={index} className="p-4 rounded-lg border border-secondary bg-secondary/20 backdrop-blur-md flex flex-col gap-4 justify-between">
                        <div className='flex flex-col gap-y-2'>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="flex items-center gap-2 mt-3 justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
