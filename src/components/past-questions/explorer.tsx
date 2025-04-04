import { getQuestions } from '@/services/server/questions';
import { ScrollText } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import SwitchDisplay from './switch-display';
import Pagination from '../pagination';
import { Badge } from '../ui/badge';
import Empty from '../empty';
import CardGrid from './card-grid';
import CardList from './card-list';

interface Props {
    params?: Promise<{ [key: string]: any }>,
    searchParams: Promise<{ [key: string]: any }>
}

const Explorer = async ({ searchParams: _searchParams }: Props) => {
    const searchParams = await _searchParams;
    const view = searchParams.view || 'list';

    const { data, count } = await getQuestions({
        params: {
            page_size: 15,
            ...searchParams
        }
    });

    return (
        <div className="space-y-8 mt-6 animate-fade-in">
            {/* Header with gradient background */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 shadow-sm border border-primary/20">
                {/* Background pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:8px_8px]"></div>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 text-foreground mb-2">
                            <ScrollText className="h-7 w-7 text-primary" />
                            Past Questions
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Explore past exam questions from various law courses. Use the filters to narrow down your search.
                        </p>
                    </div>
                    <SwitchDisplay className="self-end" />
                </div>
            </div>

            {/* Section title */}
            <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
                    <h2 className="text-lg sm:text-xl font-semibold">Question Archive</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Total found:</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary hover:bg-primary/10">
                        {count} Questions
                    </Badge>
                </div>
            </div>

            {data.length === 0 ? (
                <Empty 
                    title="No questions found"
                    content="Try adjusting your filters to find questions."
                    icon={<ScrollText />}
                    color="primary"
                />
            ) : (
                // Use client components to handle animations based on view type
                // Don't pass the getPattern function - it will be defined inside the client components
                view === 'grid' ? (
                    <CardGrid data={data} />
                ) : (
                    <CardList data={data} />
                )
            )}

            <Pagination
                totalPages={Math.ceil(count/15)}
                className='mt-10'
            />
        </div>
    );
};

export default Explorer;

export const ExplorerSkeleton = ({ searchParams }: { searchParams: { view: string } }) => {
    const view = searchParams.view || 'list';

    return (
        <div className="space-y-8 mt-6">
            {/* Header skeleton */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/2 to-primary/5 p-6 shadow-sm border border-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-7 w-7 rounded-full" />
                            <Skeleton className="h-9 w-48" />
                        </div>
                        <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>

            {/* Section title */}
            <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-1.5 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
            </div>

            <div className={cn("gap-5", {
                "grid md:grid-cols-2 lg:grid-cols-3": view === 'grid',
                "flex flex-col": view === 'list'
            })}>
                {[...Array(9)].map((_, index) => (
                    <div 
                        key={index} 
                        className={cn(
                            "relative overflow-hidden rounded-xl border p-6 animate-pulse",
                            view === 'list' ? "flex flex-col md:flex-row md:items-center md:gap-5" : ""
                        )}
                    >
                        {/* Subtle pattern background for skeleton */}
                        <div className="absolute inset-0 pointer-events-none opacity-5">
                            <div className="absolute inset-0 bg-repeat" 
                                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                        </div>
                        
                        <div className={cn(
                            "space-y-4 w-full",
                            view === 'list' ? "md:flex-1" : ""
                        )}>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-4/5" />
                                    {view === 'grid' && <Skeleton className="h-4 w-2/3" />}
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full ml-2" />
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-4">
                                <Skeleton className="h-6 w-28 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
