import { Skeleton } from '@/components/ui/skeleton';
import { getBookmarks } from '@/services/server/bookmarks';
import { Clock, Bookmark, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { use } from 'react';
import { format } from 'date-fns';
import Empty from '@/components/empty';
import Pagination from '@/components/pagination';
import { StackResponse } from '@/@types/generics';
import { User } from '@/@types/db';
import { Button } from '@/components/ui/button';

interface Props {
    searchParams: Record<string, any>,
    user: User | null
}

const BookmarksList = async ({ searchParams, user }: Props) => {

    const { data, error, count } = await getBookmarks({
        params: {
            page_size: 10,
            ...searchParams
        }
    });

    if (user === null) {
        <div className="p-6">
            <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">Bookmarks require an account</h3>
            <p className="text-muted-foreground mb-4">Sign in to view and manage your bookmarked past questions.</p>
            <Button asChild className="mt-2 bg-amber-500 hover:bg-amber-600 text-white">
                <Link href="/auth/signin">
                Sign in
                <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            </div>
        </div>
    }

    if (!data?.length || error) {
        return (
            <Empty
                title="No bookmarks available"
                content="You have not bookmarked any past questions yet."
                color='amber'
                icon={<Bookmark className="h-12 w-12 text-amber-500" />}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between py-3 border-b border-muted/50'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="h-6 w-6 text-amber-500" />
                    Your Bookmarks
                </h2>
            </div>
            <div className="space-y-4">
                {data.map((bookmark) => (
                    <Link
                        href={`/dashboard/past-questions/${bookmark.past_question.id}`}
                        key={bookmark.id}
                        className="group block p-5 rounded-xl leading-relaxed transition-all bg-background hover:bg-secondary/10 shadow-sm"
                    >
                        <div className="flex justify-between items-center gap-4">
                            <p className="font-medium line-clamp-3 text-primary transition-all group-hover:text-muted-foreground flex-1">
                                {bookmark.past_question.text_plain || bookmark.past_question.text}
                            </p>
                            <Bookmark className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-1 text-xs md:text-base">
                                <Clock className="h-4 w-4" />
                                <time>{format(new Date(bookmark.created_at), 'PPP')}</time>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-primary">
                                {bookmark.past_question.course_name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <Pagination
                totalPages={Math.ceil(count/10)}
                className='mt-10'
            />
        </div>
    );
};

export default BookmarksList;

export const BookmarksSkeleton = () => {
    return (
        <div className="space-y-6 mt-10">
            <div className='flex items-center justify-between py-3 border-b border-muted/50'>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="h-6 w-6 text-primary" />
                    Your Bookmarks
                </h2>
            </div>
            <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="p-5 rounded-xl bg-background shadow-sm">
                        <div className='flex flex-col gap-y-2'>
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
