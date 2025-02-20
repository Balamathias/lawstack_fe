'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { LucideLaptopMinimalCheck, LucideLightbulb, LucideList, LucideSearch } from 'lucide-react';
import { useQuestionInsights } from '@/services/client/question';
import { Question, User } from '@/@types/db';
import MarkdownPreview from '../markdown-preview';

interface Props {
    trigger: React.ReactNode;
    user: User,
    question: Question
}

const quickPrompts = [
    {
        prompt: 'Analyze this question for me.',
        icon: <LucideSearch size={16} />,
    },
    {
        prompt: 'Criticize this question for me.',
        icon: <LucideLaptopMinimalCheck size={16} />,
    },
    {
        prompt: 'Summarize this question for me.',
        icon: <LucideLightbulb size={16} />,
    },
    {
        prompt: 'What are the key points in this question?',
        icon: <LucideList size={16} />,
    }
]

const AIModal: React.FC<Props> = ({ trigger, user, question }) => {
  const { mutate: getInsights, data: insight, isPending } = useQuestionInsights();
  
  const handlePromptClick = (prompt: string) => {
    getInsights({ prompt, user, question });
  }

  return (
    <DynamicModal
        trigger={trigger}
        title={isPending ? 'Thinking...' : 'AI Insights'}
        dialogClassName='sm:max-w-3xl'
        >
        <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto'>
            {
                isPending ? (
                    <p className='text-center animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 py-6'>
                        AI is thinking...
                    </p>
                ) : (
                    insight && (
                        <div className='leading-relaxed'>
                            <MarkdownPreview content={insight} />
                        </div>
                    )
                )
            }

            <ul className='flex flex-col gap-4 mt-4'>
                {quickPrompts.map((prompt, index) => (
                    <li key={index} className='flex items-center gap-2 bg-secondary/70 hover:opacity-90 transition-all p-3 py-2.5 rounded-lg cursor-pointer' role='button' onClick={() => handlePromptClick(prompt.prompt)}>
                        {prompt.icon}
                        <span className='text-sm'>{prompt.prompt}</span>
                    </li>
                ))}
            </ul>
        </div>
    </DynamicModal>
  )
}

export default AIModal
