import React from 'react'
import DynamicModal from '../dynamic-modal'
import { DialogTitle } from '../ui/dialog'
import { LucideMessageCircle, LucideStars } from 'lucide-react'
import MarkdownPreview from '../markdown-preview'
import { Contribution, User } from '@/@types/db'

interface Props {
    contribution: Contribution
}

const ContributionDetailModal = ({ contribution }: Props) => {
  return (
    <div>
        <DynamicModal
            dialogClassName='sm:max-w-3xl'
            title={
                <DialogTitle className="flex items-center gap-2 justify-between px-2.5">
                    <div className='flex items-center gap-2'>
                        <LucideMessageCircle size={18} className="text-pink-500" />
                        <span className="bg-gradient-to-l from-pink-500 to-red-500 text-transparent bg-clip-text font-semibold text-xs sm:text-lg line-clamp-1">Contribution by {contribution.contributor?.username || 'Lawstacean'}</span>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-gradient-to-br  from-sky-500 to-blue-600 cursor-pointer">
                        <LucideStars />
                        <span className="text-sm md:text-lg">Insights</span>
                    </button>
                </DialogTitle>
            }
            trigger={<p className="text-sm line-clamp-4 hover:cursor-pointer hover:opacity-80 transition-all">{contribution.text}</p>}
        >
            <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto p-2.5 leading-relaxed'>
                <MarkdownPreview content={contribution.text} />
            </div>
        </DynamicModal>
    </div>
  )
}

export default ContributionDetailModal