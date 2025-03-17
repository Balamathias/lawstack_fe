'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { LucideStar } from 'lucide-react';
import { Contribution, Question } from '@/@types/db';
import { DialogTitle } from '../ui/dialog';
import InsightsPanel from '../ai/insights-panel';
import { getContributionInsights } from '@/services/client/ai';
import { useUser } from '@/services/client/auth';

interface Props {
  contribution: Contribution,
  question: Question,
  trigger: React.ReactNode
}

const ContributionInsights: React.FC<Props> = ({ trigger, contribution, question }) => {
  const { data: userData } = useUser();
  const user = userData?.data;

  // Define contribution-specific prompts with emojis
  const initialPrompts = [
    { prompt: 'Analyze the legal reasoning', emoji: '⚖️' },
    { prompt: 'Evaluate this contribution', emoji: '🔍' },
    { prompt: 'Identify strengths and weaknesses', emoji: '💪' },
    { prompt: 'How well does it answer the question?', emoji: '🎯' },
    { prompt: 'Suggest improvements', emoji: '✨' },
  ];

  return (
    <DynamicModal
      trigger={trigger}
      title={
        <DialogTitle className="flex items-center gap-2 p-3">
          <LucideStar size={18} className='text-emerald-500' />
          <span className='bg-gradient-to-l from-emerald-500 to-green-600 text-transparent bg-clip-text font-semibold text-lg'>
            Contribution Analysis
          </span>
        </DialogTitle>
      }
      dialogClassName='sm:max-w-3xl h-[80vh]'
      drawerClassName="pb-4"
    //   contentClassName='flex-1 flex flex-col overflow-hidden'
    >
      <InsightsPanel
        user={user!}
        contentType="contribution"
        contentId={contribution.id}
        content={contribution.text}
        getInsights={async (params) => getContributionInsights({
          prompt: params.prompt,
          question,
          contribution,
          user
        })}
        initialPrompts={initialPrompts}
        className="h-full"
      />
    </DynamicModal>
  )
}

export default ContributionInsights
