'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { LucideStar } from 'lucide-react';
import { Question, User } from '@/@types/db';
import { DialogTitle } from '../ui/dialog';
import InsightsPanel from '../ai/insights-panel';
import { getQuestionInsights } from '@/services/client/ai';

interface Props {
    trigger: React.ReactNode;
    user: User,
    question: Question,
}

const AIModal: React.FC<Props> = ({ trigger, user, question }) => {
  // Define our initial question-specific prompts with emojis
  const initialPrompts = [
    { prompt: 'Analyze this question for me', emoji: '🔍' },
    { prompt: 'Explain the legal principles involved', emoji: '⚖️' },
    { prompt: 'What are the key issues to consider?', emoji: '🧩' },
    { prompt: 'How would an expert approach this?', emoji: '👨‍⚖️' },
    { prompt: 'Suggest a framework for answering', emoji: '📋' },
  ];

  return (
    <DynamicModal
      trigger={trigger}

      title={
        <DialogTitle className="flex items-center gap-2 p-3">
          <LucideStar size={18} className='text-sky-500' />
          <span className='bg-gradient-to-l from-sky-500 to-blue-500 text-transparent bg-clip-text font-semibold text-lg'>
            AI Legal Analysis
          </span>
        </DialogTitle>
      }
      dialogClassName='sm:max-w-3xl h-[80vh] max-lg:h-[90vh]'

    //   contentClassName='flex-1 flex flex-col overflow-hidden'
    >
      <InsightsPanel
        user={user}
        contentType="question"
        contentId={question.id}
        content={question.text}
        getInsights={async (params) => getQuestionInsights({
          prompt: params.prompt,
          question,
          user
        })}
        // initialPrompts={undefined}
        className="h-full"
      />
    </DynamicModal>
  )
}

export default AIModal
