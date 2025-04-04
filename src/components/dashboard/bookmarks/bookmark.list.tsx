import { Skeleton } from '@/components/ui/skeleton';
import { getBookmarks } from '@/services/server/bookmarks';
import { Clock, Bookmark, ArrowUpRight, Search, Filter, BookOpen, Calendar, GraduationCap, School, CalendarDays, Layers, ChevronRight, Star, LayoutGrid, List, SlidersHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { use } from 'react';
import { format } from 'date-fns';
import Empty from '@/components/empty';
import Pagination from '@/components/pagination';
import { StackResponse } from '@/@types/generics';
import { User } from '@/@types/db';
import { Button } from '@/components/ui/button';
import MarkdownPreview from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Props {
    searchParams: Record<string, any>,
    user: User | null
}

const BookmarksList = async ({ searchParams, user }: Props) => {
    const viewMode = searchParams.view || 'list';
    const { data, error, count } = await getBookmarks({
        params: {
            page_size: 10,
            ordering: '-created_at',
            ...searchParams
        }
    });

    // Group bookmarks by date (today, this week, earlier)
    const groupBookmarksByDate = (bookmarks: any[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        
        const result = {
            today: [] as any[],
            thisWeek: [] as any[],
            earlier: [] as any[]
        };
        
        bookmarks.forEach(bookmark => {
            const bookmarkDate = new Date(bookmark.created_at);
            bookmarkDate.setHours(0, 0, 0, 0);
            
            if (bookmarkDate.getTime() === today.getTime()) {
                result.today.push(bookmark);
            } else if (bookmarkDate >= thisWeekStart) {
                result.thisWeek.push(bookmark);
            } else {
                result.earlier.push(bookmark);
            }
        });
        
        return result;
    };
    
    const groupedBookmarks = data ? groupBookmarksByDate(data) : null;

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full border-none shadow-lg bg-card relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
                    
                    <CardHeader className="text-center pt-10 relative z-10">
                        <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-full mb-5 border border-primary/20 shadow-sm">
                            <Bookmark className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold">Bookmarks require an account</h3>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-muted-foreground text-center pb-4">
                            Sign in to your account to view and manage your collection of bookmarked past questions.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-10 relative z-10">
                        <Button asChild size="lg" className="rounded-xl px-8 font-medium shadow-md bg-primary/90 hover:bg-primary transition-all group">
                            <Link href="/login?next=/dashboard/bookmarks" className="flex items-center gap-2">
                                Sign in to continue
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!data?.length || error) {
        return (
            <Empty
                title="Your bookmark collection is empty"
                content="Save your favorite past questions for quick access by bookmarking them while you study."
                color='amber'
                icon={<Bookmark className="h-6 w-6 text-amber-500" />}
                action={
                    <Button asChild variant="default" className="mt-6 gap-2 px-5 py-2 h-auto rounded-xl">
                        <Link href="/dashboard/past-questions">
                            <BookOpen className="h-4 w-4" />
                            Browse past questions
                        </Link>
                    </Button>
                }
            />
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 p-5 sm:p-6 shadow-sm border border-amber-500/20">
                {/* Background pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:8px_8px]"></div>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 text-foreground mb-2">
                            <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                <Bookmark className="h-6 w-6 text-amber-500" />
                            </div>
                            Your Bookmarks
                            <Badge variant="outline" className="ml-2 text-xs font-normal bg-amber-500/10 text-amber-500 border-amber-500/30">
                                {count} {count === 1 ? 'item' : 'items'}
                            </Badge>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Your personal collection of saved past questions for quick access and reference.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end">
                        <Tabs value={viewMode} className="hidden sm:block">
                            <TabsList className="bg-background/80 backdrop-blur-sm">
                                <TabsTrigger 
                                    value="list" 
                                    asChild
                                    className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500"
                                >
                                    <Link href={{
                                        pathname: '/dashboard/bookmarks',
                                        query: { ...searchParams, view: 'list' }
                                    }} scroll={false}>
                                        <List className="h-4 w-4 mr-2" />
                                        List
                                    </Link>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="grid" 
                                    asChild
                                    className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500"
                                >
                                    <Link href={{
                                        pathname: '/dashboard/bookmarks',
                                        query: { ...searchParams, view: 'grid' }
                                    }} scroll={false}>
                                        <LayoutGrid className="h-4 w-4 mr-2" />
                                        Grid
                                    </Link>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>
            
            {/* Search and filter section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search in your bookmarks..." 
                        className="pl-10 bg-card border-border shadow-sm"
                    />
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">Sort & Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                                <CalendarDays className="mr-2 h-4 w-4" />
                                <span>Newest first</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Oldest first</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                <span>Favorites</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            {/* Section title */}
            <div className="flex items-center justify-between border-b border-border/40 py-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-amber-500 to-amber-500/30 rounded-full"></div>
                    <h3 className="text-lg font-semibold">Saved Questions</h3>
                </div>
            </div>
            
            {/* Bookmark list section */}
            <div className="space-y-8">
                {/* Today's bookmarks */}
                {groupedBookmarks?.today.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Today
                        </h4>
                        <div className={cn(
                            viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                                : "space-y-3"
                        )}>
                            {groupedBookmarks.today.map((bookmark) => (
                                <BookmarkCard 
                                    key={bookmark.id} 
                                    bookmark={bookmark} 
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* This week's bookmarks */}
                {groupedBookmarks?.thisWeek.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            This Week
                        </h4>
                        <div className={cn(
                            viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                                : "space-y-3"
                        )}>
                            {groupedBookmarks.thisWeek.map((bookmark) => (
                                <BookmarkCard 
                                    key={bookmark.id} 
                                    bookmark={bookmark} 
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Earlier bookmarks */}
                {groupedBookmarks?.earlier.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Earlier
                        </h4>
                        <div className={cn(
                            viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                                : "space-y-3"
                        )}>
                            {groupedBookmarks.earlier.map((bookmark) => (
                                <BookmarkCard 
                                    key={bookmark.id} 
                                    bookmark={bookmark} 
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Pagination
                totalPages={Math.ceil(count/10)}
                className="mt-12"
            />
        </div>
    );
};

const BookmarkCard = ({ bookmark, viewMode }: { bookmark: any, viewMode: string }) => {
    const date = new Date(bookmark.created_at);
    const formattedDate = format(date, 'MMM d, yyyy');
    
    // Generate a pattern based on course name
    const getPattern = (courseName: string = '') => {
        const patterns = [
            'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/20px 20px',
            'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
            'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
            'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/24px 24px',
        ];
        
        // Generate a consistent pattern index based on course name
        const hash = courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return patterns[hash % patterns.length];
    };
    
    if (viewMode === 'grid') {
        return (
            <Link
                href={`/dashboard/past-questions/${bookmark.past_question.id}`}
                className="block group h-full"
            >
                <Card className="overflow-hidden transition-all duration-300 h-full hover:shadow-md hover:border-amber-500/30 hover:bg-amber-500/[0.02] relative">
                    {/* Pattern background */}
                    <div className="absolute inset-0 pointer-events-none text-amber-500/[0.02] dark:text-amber-500/[0.015]">
                        <div className="absolute inset-0 bg-repeat opacity-60" 
                            style={{ backgroundImage: getPattern(bookmark.past_question.course_name) }} 
                        />
                    </div>
                    
                    {/* Top gradient highlight */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/30 via-amber-500/60 to-amber-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    
                    <CardContent className="p-5 relative z-10">
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20 transition-transform group-hover:scale-110 duration-300">
                                <Bookmark className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col items-end">
                                <Badge variant="outline" className="font-medium text-xs bg-amber-500/5 border-amber-500/20 text-amber-500">
                                    {bookmark.past_question.course_name}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="line-clamp-3 prose prose-sm max-w-none mb-4 min-h-[4.5rem]">
                            <MarkdownPreview content={bookmark.past_question.text} />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-border/40">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <time>{formattedDate}</time>
                            </div>
                            <span className="text-amber-500 font-medium text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                View Question
                                <ChevronRight className="h-3 w-3" />
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        );
    }
    
    return (
        <Link
            href={`/dashboard/past-questions/${bookmark.past_question.id}`}
            className="block group"
        >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-500/30 hover:bg-amber-500/[0.02] relative">
                {/* Pattern background */}
                <div className="absolute inset-0 pointer-events-none text-amber-500/[0.02] dark:text-amber-500/[0.015]">
                    <div className="absolute inset-0 bg-repeat opacity-60" 
                        style={{ backgroundImage: getPattern(bookmark.past_question.course_name) }} 
                    />
                </div>
                
                {/* Top gradient highlight */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/30 via-amber-500/60 to-amber-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <CardContent className="p-5 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20 transition-transform group-hover:scale-110 duration-300">
                                        <Bookmark className="h-4 w-4" />
                                    </div>
                                    <Badge variant="outline" className="font-medium text-xs bg-amber-500/5 border-amber-500/20 text-amber-500 flex items-center gap-1">
                                        <School className="h-3 w-3" />
                                        {bookmark.past_question.course_name}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        <time>{formattedDate}</time>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="line-clamp-2 prose prose-sm max-w-none">
                                <MarkdownPreview content={bookmark.past_question.text} />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <span className="text-amber-500 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                View Question
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default BookmarksList;

export const BookmarksSkeleton = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header skeleton */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/2 to-primary/5 p-5 sm:p-6 shadow-sm border border-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>
            
            {/* Search and filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-36" />
            </div>
            
            {/* Section title skeleton */}
            <div className="flex items-center justify-between border-b border-border/40 py-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-2 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>
            
            {/* Cards skeleton */}
            <div className="space-y-6">
                {/* Group header */}
                <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="space-y-3">
                        {[...Array(3)].map((_, index) => (
                            <Card key={index} className="overflow-hidden animate-pulse">
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                                    <Skeleton className="h-5 w-28 rounded-full" />
                                                </div>
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-4/5" />
                                            </div>
                                        </div>
                                        
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-12">
                <Skeleton className="h-9 w-80" />
            </div>
        </div>
    );
};
