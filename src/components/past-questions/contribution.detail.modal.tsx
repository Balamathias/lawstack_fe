import React from 'react'
import DynamicModal from '../dynamic-modal'
import { DialogTitle } from '../ui/dialog'
import { LucideHeart, LucideMessageCircle, LucideSparkle, LucideStars } from 'lucide-react'
import MarkdownPreview from '../markdown-preview'
import { Contribution, Question, User } from '@/@types/db'
import ContributionInsights from './contribution.insights'
import { cn } from '@/lib/utils'

interface Props {
    contribution: Contribution,
    question: Question
}

const ContributionDetailModal = ({ contribution, question }: Props) => {
  return (
    <div>
        <DynamicModal
            dialogClassName='sm:max-w-3xl'
            title={
                <DialogTitle className="flex items-center gap-16 justify-between max-sm:justify-end px-3 w-full">
                    <div className='flex items-center gap-2 max-sm:hidden'>
                        <LucideHeart size={18} className="text-pink-500" />
                        <span className="bg-gradient-to-l from-pink-500 to-red-500 text-transparent bg-clip-text font-semibold text-xs sm:text-lg line-clamp-1">Contributions</span>
                    </div>

                    <ContributionInsights trigger={
                            <button
                                className={cn('flex items-center cursor-pointer justify-center w-8 h-8 rounded-full',
                            'bg-secondary/70 text-muted-foreground hover:bg-secondary/40 hover:text-white animate-pulse ml-auto', {
                                'bg-sky-500/20 text-sky-500 hover:bg-sky-500/40 hover:text-white': true,
                            })}>
                                <LucideSparkle size={14} />
                            </button>
                        }
                        contribution={contribution}
                        question={question}
                    />
                </DialogTitle>
            }
            trigger={<p className="text-sm line-clamp-4 hover:cursor-pointer hover:opacity-80 transition-all">{contribution.text}</p>}
        >
            <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto p-2.5 leading-relaxed px-3 flex flex-col gap-2.5'>
                <MarkdownPreview content={contribution.text} />
            </div>
        </DynamicModal>
    </div>
  )
}

export default ContributionDetailModal