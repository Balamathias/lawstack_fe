import { Skeleton } from '@/components/ui/skeleton';
import { getBookmarks } from '@/services/server/bookmarks';
import { Clock, Bookmark, ArrowUpRight, Search, Filter, BookOpen } from 'lucide-react';
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

interface Props {
    searchParams: Record<string, any>,
    user: User | null
}

const BookmarksList = async ({ searchParams, user }: Props) => {

    const { data, error, count } = await getBookmarks({
        params: {
            page_size: 10,
            ordering: '-created_at',
            ...searchParams
        }
    });

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Card className="max-w-md w-full border-none shadow-lg bg-gradient-to-br from-background to-secondary/5">
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Bookmark className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold">Bookmarks require an account</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-center">
                            Sign in to your account to view and manage your collection of bookmarked past questions.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-8">
                        <Button asChild size="lg" className="rounded-full px-6 font-medium shadow-sm">
                            <Link href="/login?next=/dashboard/bookmarks" className="flex items-center">
                                Sign in to continue
                                <ArrowUpRight className="ml-2 h-4 w-4" />
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
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/dashboard/past-questions">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Browse past questions
                        </Link>
                    </Button>
                }
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted/30">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="h-6 w-6 text-primary" />
                    Your Bookmarks
                    <Badge variant="outline" className="ml-2 text-xs font-normal">
                        {count} {count === 1 ? 'item' : 'items'}
                    </Badge>
                </h2>
                
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-sm">
                        <Filter className="mr-2 h-3.5 w-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="text-sm">
                        <Search className="mr-2 h-3.5 w-3.5" />
                        Search
                    </Button>
                </div>
            </div>
            
            <div className="grid gap-4">
                {data.map((bookmark) => (
                    <Link
                        href={`/dashboard/past-questions/${bookmark.past_question.id}`}
                        key={bookmark.id}
                        className="group block"
                    >
                        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:bg-secondary/5">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="line-clamp-2 prose prose-sm max-w-none">
                                        <MarkdownPreview content={bookmark.past_question.text} />
                                    </div>
                                    <Bookmark className="h-5 w-5 text-primary/70 flex-shrink-0 transition-transform group-hover:scale-110" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between px-5 py-3 bg-muted/20 border-t border-border/50 text-sm">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <time>{format(new Date(bookmark.created_at), 'MMM d, yyyy')}</time>
                                </div>
                                <Badge variant="secondary" className="font-medium">
                                    {bookmark.past_question.course_name}
                                </Badge>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>

            <Pagination
                totalPages={Math.ceil(count/10)}
                className="mt-12"
            />
        </div>
    );
};

export default BookmarksList;

export const BookmarksSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted/30">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="h-6 w-6 text-primary" />
                    Your Bookmarks
                    <Skeleton className="h-5 w-16 rounded-full ml-2" />
                </h2>
                
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                </div>
            </div>
            
            <div className="grid gap-4">
                {[...Array(5)].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-4/5" />
                                </div>
                                <Bookmark className="h-5 w-5 text-muted/30 flex-shrink-0" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between px-5 py-3 bg-muted/20 border-t border-border/50">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-12">
                <Skeleton className="h-9 w-80" />
            </div>
        </div>
    );
};
