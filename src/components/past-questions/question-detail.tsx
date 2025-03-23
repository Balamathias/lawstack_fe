import { getCourse } from '@/services/server/courses';
import { getQuestion } from '@/services/server/questions';
import { LucideBook, LucideBookLock, LucideBookmark, LucideCalendar, LucideHeart, LucideSparkle, LucideUser, LucideUserCircle } from 'lucide-react';
import React, { Suspense } from 'react'
import { Separator } from '../ui/separator';
import { cn, getSemester } from '@/lib/utils';
import AIModal from './ai-modal';
import { getUser } from '@/services/server/auth';
import MarkdownPreview from '../markdown-preview';
import PleaseSignIn from '../please-signin';
import { isBookmarked } from '@/services/server/bookmarks';
import Bookmark from './bookmark';
import HeartModal from './heart.modal';
import ContributionList, { ContributionListSkeleton } from './contribution.list';
import Empty from '../empty';

interface Props {
    id: string;
}

const QuestionDetail: React.FC<Props> = async ({ id }) => {
  const { data, error } = await getQuestion(id);
  const { data: course, error: courseError } = await getCourse(data?.course!)
  const { data: user } = await getUser()

  const { data: isbookmarked } = await isBookmarked(id)
  
  if (!data || error || !course || courseError) {
    return (
        <div className='flex flex-col gap-4'>
            <Empty
                title="Questions not found"
                content="Sorry, questions could not be retrieved at this point, please try again."
                icon={<LucideBookLock />}
                color="green"
            />
        </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 justify-between h-full'>
        <div className='flex flex-col gap-4 mb-14'>

            <div className=''>
                <div className='flex items-center gap-2 text-muted-foreground'>
                    <h2 className='font-medium font-serif text-2xl py-2'>{course?.name} ({course?.code}) {data?.session} ({data?.year}) ({getSemester(data?.semester)})</h2>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <div className='text-lg sm:text-xl flex flex-col gap-y-2.5 antialiased dark:text-foreground/80 leading-relaxed font-serif py-2'>
                    <MarkdownPreview content={data?.text} className='text-lg sm:text-xl flex flex-col gap-y-2.5 antialiased dark:text-foreground/80 leading-relaxed font-serif py-2'/>
                </div>
            </div>

            <Separator />

            <div className='flex flex-col gap-4'>

                <Suspense fallback={<ContributionListSkeleton />}>
                    <ContributionList past_question={data} />
                </Suspense>
            </div>
        </div>

        <footer className='w-full max-lg:left-0 flex justify-center items-center fixed bottom-0 max-w-5xl max-md:border-t max-sm:backdrop-blur-lg z-20'>
            <div className='flex items-center justify-between py-2 gap-8 md:gap-12  max-w-3xl mx-auto left-0 right-0'>
                {
                    user ? (
                        <HeartModal
                            question={data}
                            user={user} 
                            trigger={
                                <button className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
                                    'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white', {
                                        'bg-pink-500/20 text-pink-500 hover:bg-pink-500/40 hover:text-white': true,
                                    })}>
                                    <LucideHeart size={18} />
                                </button>
                            }
                        />
                    ): (
                        <PleaseSignIn
                            message='You have to login to use this feature. This is a feature that allows you to share your thoughts for the question you are viewing.'
                            icon={<LucideHeart size={16} />}
                            trigger={
                                <button
                                    className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
                                'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white', {
                                    'bg-pink-500/20 text-pink-500 hover:bg-pink-500/40 hover:text-white': true,
                                })}>
                                    <LucideHeart size={18} />
                                </button>
                            }
                        />
                    )
                }

                {
                    user ? (
                        <Bookmark isbookmarked={isbookmarked?.bookmarked || false} question_id={id} />
                    ): (
                        <PleaseSignIn
                            message='You have to login to use this feature. This is a feature that allows you to bookmark the question you are viewing.'
                            icon={<LucideBookmark size={16} />}
                            trigger={
                                <button
                                    className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
                                'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white', {
                                    'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 hover:text-white': true,
                                })}>
                                    <LucideBookmark size={18} />
                                </button>
                            }
                        />
                    )
                }

                {
                    user ? (
                        <AIModal
                            user={user!}
                            question={data}
                            trigger={
                                <button
                                    disabled={!user}
                                    className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
                                'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white animate-pulse', {
                                    'bg-sky-500/20 text-sky-500 hover:bg-sky-500/40 hover:text-white': true,
                                })}>
                                    <LucideSparkle size={18} />
                                </button>
                            }
                        />
                    ): (
                        <PleaseSignIn
                            message='You have to login to use this feature. This is a feature that allows you to get insights on the question you are viewing using AI.'
                            icon={<LucideSparkle size={16} />}
                            trigger={
                                <button
                                    className={cn('flex items-center cursor-pointer justify-center w-12 h-12 rounded-full',
                                'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white animate-pulse', {
                                    'bg-sky-500/20 text-sky-500 hover:bg-sky-500/40 hover:text-white': true,
                                })}>
                                    <LucideSparkle size={18} />
                                </button>
                            }
                        />
                    )
                }
            </div>
        </footer>
    </div>
  )
}

export default QuestionDetail