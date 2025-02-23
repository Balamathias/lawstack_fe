'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { LucideAxe, LucideLaptopMinimalCheck, LucideLightbulb, LucideList, LucideSearch, LucideSparkle, LucideSparkles } from 'lucide-react';
import { useQuestionInsights } from '@/services/client/question';
import { Question, User } from '@/@types/db';
import MarkdownPreview from '../markdown-preview';
import { cn } from '@/lib/utils';
import { DialogTitle } from '../ui/dialog';

interface Props {
    trigger: React.ReactNode;
    user: User,
    question: Question,
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
    },
    {
        prompt: 'What\'s the answer to this question?',
        icon: <LucideSparkle size={16} />,
    },
    {
        prompt: 'Simplify this question for me.',
        icon: <LucideAxe size={16} />,
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
        title={
            <DialogTitle className='flex items-center gap-2 w-full justify-center'>
                <LucideLightbulb size={18} />
                <span>{isPending ? 'Thinking...' : 'AI Insights'}</span>
            </DialogTitle>
        }
        dialogClassName='sm:max-w-3xl'
        >
        <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto'>
            {
                isPending ? (
                    <div className='text-center animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-amber-500 py-6 flex items-center justify-center gap-x-2 w-full'>
                        <LucideSparkle className='animate-spin text-muted-foreground' size={18} />
                        <span>Thinking...</span>
                    </div>
                ) : (
                    insight && (
                        <div className='leading-relaxed flex items-start gap-x-2.5'>
                            <div>
                                <MarkdownPreview content={insight} />
                            </div>
                        </div>
                    )
                )
            }

            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                {quickPrompts.map((prompt, index) => (
                    <button disabled={isPending} key={index} className='flex items-center gap-2 bg-secondary/70 hover:opacity-90 transition-all p-3 py-2.5 rounded-lg cursor-pointer data-[disabled]:opacity-60 data-[disabled]:cursor-not-allowed' role='button' onClick={() => handlePromptClick(prompt.prompt)}>
                        {prompt.icon}
                        <span className='text-sm'>{prompt.prompt}</span>
                    </button>
                ))}
            </ul>
        </div>
    </DynamicModal>
  )
}

export default AIModal
