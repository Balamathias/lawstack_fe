import { Question } from '@/@types/db'
import { getContributions } from '@/services/server/contributions'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ThumbsUp, ThumbsDown, MessageSquare, LucideMessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Empty from '../empty'
import DynamicModal from '../dynamic-modal'
import MarkdownPreview from '../markdown-preview'
import { DialogTitle } from '../ui/dialog'

interface Props {
    past_question: Question,
}

const ContributionListSkeleton = () => {
  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-xl font-semibold">Contributions</h3>
      
      <ul className="space-y-4">
        {Array(3).fill(0).map((_, index) => (
          <li key={index} className="p-2.5 sm:p-4 shadow-sm rounded-xl">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                
                <div className="mt-2">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                
                <div className="mt-3 flex items-center gap-4">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-12 ml-auto" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ContributionList: React.FC<Props> = async ({ past_question }) => {
  const { data: contributions } = await getContributions({
    params: {
      past_question: past_question.id,
      ordering: '-created_at',
    }
  })
  
  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-xl font-semibold">Contributions ({contributions?.length || 0})</h3>
      
      {contributions?.length === 0 ? (
        <Empty
            title='No contributions yet'
            content='Be the first to contribute to this question'
            icon={<LucideMessageCircle size={48} />}
            color='pink'
        />
      ) : (
        <ul className="space-y-4">
          {contributions?.map((contribution) => (
            <li key={contribution.id} className="bg-card/20 rounded-xl p-2.5 sm:p-4 shadow-sm border-none">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contribution.contributor?.avatar || ''} alt={contribution.contributor?.username || 'User'} />
                  <AvatarFallback>{(contribution.contributor?.username || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{contribution.contributor?.username || 'Anonymous'}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(contribution.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <DynamicModal
                        dialogClassName='sm:max-w-3xl'
                        title={
                            <DialogTitle className="flex items-center gap-2 px-2.5">
                                <LucideMessageCircle size={18} className="text-pink-500" />
                                <span className="bg-gradient-to-l from-pink-500 to-red-500 text-transparent bg-clip-text font-semibold text-lg">Contribution by {contribution.contributor?.username || 'Lawstacean'}</span>
                            </DialogTitle>
                        }
                        trigger={<p className="text-sm line-clamp-4 hover:cursor-pointer hover:opacity-80 transition-all">{contribution.text}</p>}
                    >
                        <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto p-2.5 leading-relaxed'>
                            <MarkdownPreview content={contribution.text} />
                        </div>
                    </DynamicModal>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{contribution.upvotes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs hover:text-destructive transition-colors">
                      <ThumbsDown className="h-4 w-4" />
                      <span>{contribution.downvotes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors ml-auto">
                      <MessageSquare className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { ContributionList, ContributionListSkeleton }

export default ContributionList