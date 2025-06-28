import { getCourse } from '@/services/server/courses';
import { getQuestion } from '@/services/server/questions';
import { HelpCircle } from 'lucide-react';
import React, { Suspense } from 'react';
import { getUser } from '@/services/server/auth';
import Empty from '../empty';
import { createChat } from '@/services/server/chats';
import { redirect } from 'next/navigation'
import { isBookmarked } from '@/services/server/bookmarks';
import QuestionHeader from './question-header';
import QuestionContent from './question-content';
import QuestionActions from './question-actions';
import QuestionMetadata from './question-metadata';
import { ContributionListSkeleton } from './contribution.list';

interface Props {
  id: string;
}

const QuestionDetail: React.FC<Props> = async ({ id }) => {
  const { data, error } = await getQuestion(id);
  const { data: course, error: courseError } = await getCourse(data?.course!);
  const { data: user } = await getUser();
  const { data: isbookmarked } = await isBookmarked(id);
  
  if (!data || error || !course || courseError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
        <Empty
          title="Question not found"
          content="Sorry, this question could not be retrieved. It may have been removed or you might not have permission to view it."
          icon={<HelpCircle className="h-16 w-16 opacity-80" />}
          color="green"
        />
      </div>
    );
  }
  return (
    <div className='relative min-h-screen'>
      {/* Background elements for enhanced glassmorphic effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/8 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-muted/6 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>
      
      <div className='flex flex-col gap-4 sm:gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-2.5 sm:px-6 lg:px-8 pb-24 sm:pb-28'>
        {/* Question Header */}
        <div className="w-full max-w-none">
          <QuestionHeader
            question={data}
            course={course}
            user={user}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Question Content - Takes full width on mobile, 2/3 on desktop */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <QuestionContent
              question={data}
              fallbackComponent={<ContributionListSkeleton />}
            />
          </div>

          {/* Question Metadata - Full width on mobile, 1/3 on desktop */}
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <QuestionMetadata
                question={data}
                course={course}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Panel */}
      <QuestionActions
        question={data}
        user={user}
        isBookmarked={isbookmarked?.bookmarked || false}
        questionId={id}
      />
    </div>
  );
};

export default QuestionDetail;