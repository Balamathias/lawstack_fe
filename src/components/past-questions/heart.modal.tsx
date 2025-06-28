'use client'

import React, { useState } from 'react'
import GlassModal from '../ui/glass-modal'
import { Question, User } from '@/@types/db'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { createContribution as contributeToQuestion} from '@/services/server/contributions'
import { useRouter } from 'nextjs-toploader/app'
import { Heart, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  question: Question;
  user: User;
  trigger: React.ReactNode;
}

const HeartModal: React.FC<Props> = ({ question, user, trigger }) => {
  const [thought, setThought] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const maxChars = 2000

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const text = e.target.value
  if (text.length <= maxChars) {
    setThought(text)
  }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!thought.trim()) {
    toast.error("Please share your thoughts")
    return
  }

  if (thought.trim().length < 10) {
    toast.error("Minimum 10 characters required")
    return
  }
  
  try {
    setIsSubmitting(true)
    
    const { data, error } = await contributeToQuestion({
    text: thought,
    past_question: question.id,
    contributor: user,
    })
    
    if (error) {
    throw new Error(error?.message)
    }
    
    setThought('')
    router.refresh()
    toast.success("Contribution shared successfully!")
    setOpen(false)
    
  } catch (error: any) {
    console.error(error)
    toast.error("Failed to share contribution")
  } finally {
    setIsSubmitting(false)
  }
  }

  return (
  <>
    <div onClick={() => setOpen(true)} className="cursor-pointer">
    {trigger}
    </div>
    
    <GlassModal
    isOpen={open}
    onClose={() => setOpen(false)}
    title="Share Your Insights"
    subtitle="Contribute to the learning community"
    size="lg"
    >
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Your Contribution</label>
        <span className={cn(
        "text-xs",
        thought.length > maxChars * 0.9 ? "text-orange-500" : "text-muted-foreground"
        )}>
        {thought.length}/{maxChars}
        </span>
      </div>
      
      <Textarea
        placeholder="Share your approach, insights, or tips for this question..."
        className={cn(
        "min-h-[140px] resize-none",
        "bg-background/50 backdrop-blur-sm",
        isSubmitting && "opacity-50"
        )}
        value={thought}
        onChange={handleTextChange}
        disabled={isSubmitting}
      />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
      <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground flex-1">
        <Heart className="h-3 w-3 text-red-500" />
        <span>Help others learn</span>
      </div>
      
      <div className="flex gap-2 sm:ml-auto">
        <Button 
        type="button"
        variant="outline"
        onClick={() => setOpen(false)}
        disabled={isSubmitting}
        className="flex-1 sm:flex-none"
        >
        Cancel
        </Button>
        
        <Button 
        type="submit" 
        disabled={isSubmitting || !thought.trim() || thought.trim().length < 10}
        className="flex-1 sm:flex-none"
        >
        <AnimatePresence mode="wait">
          {isSubmitting ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Sharing...
          </motion.div>
          ) : (
          <motion.div
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Share
          </motion.div>
          )}
        </AnimatePresence>
        </Button>
      </div>
      </div>
    </form>
    </GlassModal>
  </>
  )
}

export default HeartModal
