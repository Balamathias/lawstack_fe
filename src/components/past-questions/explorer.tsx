import { getQuestions } from '@/services/server/questions';
import { ScrollText, Clock, ArrowUpRight, GraduationCap, Building2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { cn, truncateString } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import SwitchDisplay from './switch-display';
import Pagination from '../pagination';
import MarkdownPreview from '../markdown-preview';

interface Props {
    params?: Promise<{ [key: string]: any }>,
    searchParams: Promise<{ [key: string]: any }>
}

const Explorer = async ({ searchParams: _searchParams }: Props) => {
    const searchParams = await _searchParams;
    const view = searchParams.view || 'list';

    const { data, count } = await getQuestions({
        params: {
            page_size: 12,
            ...searchParams
        }
    });

    return (
        <div className="space-y-6 mt-10">
            <div className='flex items-center justify-between py-3 border-b border-muted/50'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <ScrollText className="h-6 w-6 text-primary" />
                    Recent Questions
                </h2>
                <SwitchDisplay />
            </div>
            <div className={cn("gap-6", {
                "grid md:grid-cols-2 lg:grid-cols-3": view === 'grid',
                "flex flex-col": view === 'list'
            })}>
                {data.map((question) => (
                    <Link
                        href={`/dashboard/past-questions/${question.id}`}
                        key={question.id}
                        className="group p-5 rounded-xl border transition-all shadow-lg bg-secondary/30 backdrop-blur-md hover:opacity-80 translate-all flex flex-col gap-2.5 justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className='line-clamp-2'>
                                <MarkdownPreview content={(question?.text)} />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        <div className="flex items-center gap-3 mt-3 justify-between text-sm text-muted-foreground">
                            <span className="text-xs px-3 py-1.5 bg-green-600/15 text-green-500 rounded-xl">
                                {question.course_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {question?.level && <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {question.level} Level</span>}
                            {question?.institution_name && <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {question.institution_name}</span>}
                        </div>
                    </Link>
                ))}
            </div>

            <Pagination
                totalPages={Math.ceil(count/12)}
                className='mt-8'
            />
        </div>
    );
};

export default Explorer;

export const ExplorerSkeleton = ({ searchParams }: { searchParams: { view: string } }) => {
    const view = searchParams.view || 'list';

    return (
        <div className="space-y-6 mt-10">
            <div className='flex items-center justify-between py-3 border-b border-muted/50'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <ScrollText className="h-6 w-6 text-primary" />
                    Recent Questions
                </h2>
                <SwitchDisplay />
            </div>
            <div className={cn("gap-6", {
                "grid md:grid-cols-2 lg:grid-cols-3": view === 'grid',
                "flex flex-col": view === 'list'
            })}>
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="p-5 rounded-lg border border-muted/50 bg-secondary/30 backdrop-blur-md shadow-lg flex flex-col gap-4 justify-between">
                        <div className='flex flex-col gap-y-2'>
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <div className="flex items-center gap-3 mt-3 justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
