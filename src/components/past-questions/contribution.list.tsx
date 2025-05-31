import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Empty from '../empty'
import { Skeleton } from '../ui/skeleton'
import { Question } from '@/@types/db'
import { getContributions } from '@/services/server/contributions'
import { LucideHeart, MessageSquare, ThumbsUp, ThumbsDown, Eye, User, Calendar, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import ContributionDetailModal from './contribution.detail.modal'
import { Badge } from '../ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  past_question: Question,
}

const ContributionListSkeleton = () => {
  return (
  <div className="space-y-6 mt-6">
    <h3 className="text-xl font-semibold hidden">Contributions</h3>
    
    <ul className="space-y-4">
    {Array(3).fill(0).map((_, index) => (
      <li 
      key={index} 
      className="p-4 sm:p-6 shadow-sm rounded-xl border border-border/50 bg-card/50"
      >
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        
        <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        
        <div className="flex items-center gap-6 pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20 ml-auto" />
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
    <div className="flex items-center gap-3">
    <div className="bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
      <LucideHeart className="h-4 w-4 text-pink-500" />
    </div>
    <h3 className="text-xl font-semibold">Community Contributions</h3>
    {contributions && contributions.length > 0 && (
      <Badge variant="secondary" className="ml-auto">
      {contributions.length} insight{contributions.length !== 1 ? 's' : ''}
      </Badge>
    )}
    </div>
    
    {contributions?.length === 0 ? (
    <div>
      <Empty
      title='No contributions yet'
      content='Be the first to contribute to this question and help fellow students understand better'
      color='blue'
      />
    </div>
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
            <ContributionDetailModal contribution={contribution} question={past_question} />
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

export { ContributionListSkeleton }

export default ContributionList
