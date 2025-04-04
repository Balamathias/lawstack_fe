import { getQuestions } from '@/services/server/questions';
import { ScrollText, ArrowUpRight, GraduationCap, Building2, Clock } from 'lucide-react';
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
        <div className="space-y-8 mt-10">
            <div className='flex items-center justify-between py-4 border-b border-muted/30'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5">
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
                        className={cn(
                            "group relative overflow-hidden p-6 rounded-xl border border-muted/30 transition-all duration-300 hover:border-primary/30",
                            "bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-lg shadow-md hover:shadow-xl",
                            "flex flex-col gap-3 justify-between",
                            view === 'list' ? "lg:flex-row lg:items-center" : ""
                        )}
                    >
                        <div className={cn(
                            "flex flex-col gap-3", 
                            view === 'list' ? "lg:flex-1" : "flex-1"
                        )}>
                            <div className="flex justify-between items-start gap-4">
                                <div className={cn(
                                    "font-medium text-foreground/90",
                                    view === 'list' ? "line-clamp-2" : "line-clamp-3"
                                )}>
                                    <MarkdownPreview content={(question?.text)} />
                                </div>
                                <span className="bg-primary/10 p-2 rounded-full transform translate-y-0 group-hover:translate-y-1 transition-transform duration-300">
                                    <ArrowUpRight className="h-4 w-4 text-primary" />
                                </span>
                            </div>

                            <div className={cn(
                                "flex items-center flex-wrap gap-y-2",
                                view === 'list' ? "gap-x-6" : "gap-x-3 mt-auto"
                            )}>
                                <span className="text-xs px-3 py-1.5 bg-primary/15 text-primary font-medium rounded-full">
                                    {question.course_name}
                                </span>
                                
                                {question?.level && (
                                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                                        <GraduationCap className="h-3.5 w-3.5" /> 
                                        <span>{question.level} Level</span>
                                    </span>
                                )}
                                
                                {question?.institution_name && (
                                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                                        <Building2 className="h-3.5 w-3.5" /> 
                                        <span className="truncate max-w-[150px]">{question.institution_name}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Hover effect gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </Link>
                ))}
            </div>

            <Pagination
                totalPages={Math.ceil(count/12)}
                className='mt-10'
            />
        </div>
    );
};

export default Explorer;

export const ExplorerSkeleton = ({ searchParams }: { searchParams: { view: string } }) => {
    const view = searchParams.view || 'list';

    return (
        <div className="space-y-8 mt-10">
            <div className='flex items-center justify-between py-4 border-b border-muted/30'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5">
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
                    <div 
                        key={index} 
                        className={cn(
                            "p-6 rounded-xl border border-muted/30 bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-lg shadow-md",
                            "flex flex-col gap-3",
                            view === 'list' ? "lg:flex-row lg:items-center" : ""
                        )}
                    >
                        <div className={cn(
                            "flex flex-col gap-4",
                            view === 'list' ? "lg:flex-1" : "flex-1"
                        )}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    {view !== 'list' && <Skeleton className="h-4 w-1/2" />}
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                            
                            <div className={cn(
                                "flex items-center flex-wrap gap-y-2",
                                view === 'list' ? "gap-x-6" : "gap-x-3"
                            )}>
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
