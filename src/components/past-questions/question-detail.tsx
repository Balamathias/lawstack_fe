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

  // Helper function to create chat context
  async function createQuestionChat(e: FormData) {
    'use server';
    if (!user) return;
    
    const chatData = await createChat({
      title: `${course?.name} (${data?.year}) - Question Discussion`,
      chat_type: 'past_question',
      past_question: data?.id,
      course: course?.id
    });
    
    redirect(`/dashboard/chat/${chatData?.data?.id}`);
  }

  return (
    <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>      {/* Question Header */}
      <QuestionHeader
        question={data}
        course={course}
        user={user}
      />

      {/* Question Content */}
      <QuestionContent
        question={data}
        fallbackComponent={<ContributionListSkeleton />}
      />

      {/* Question Metadata */}
      <QuestionMetadata
        question={data}
        course={course}
      />

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