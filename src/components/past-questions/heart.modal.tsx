'use client'

import React, { useState } from 'react'
import DynamicModal from '../dynamic-modal'
import { Question, User } from '@/@types/db'
import { DialogTitle } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { createContribution as contributeToQuestion} from '@/services/server/contributions'
import { useRouter } from 'nextjs-toploader/app'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Heart, Loader2, MessageSquare, Send, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!thought.trim()) {
      toast.error("Please enter your thoughts about this question");
      return;
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
      toast.success("Your thoughts have been shared successfully!");
      
      // Close modal
      setOpen(false)
      
    } catch (error: any) {
      console.error(error)
      toast.error("Failed to share your thoughts. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicModal
      trigger={trigger}
      open={open}
      setOpen={setOpen}
      title={
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex items-center justify-between"
        >
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
              <Star className="h-4 w-4 text-pink-500" />
            </div>
            <span>Share Your Thoughts</span>
          </DialogTitle>
        </motion.div>
      }
      dialogClassName="sm:max-w-lg"
    >
      <div className="mb-4">
        <CardDescription className="text-muted-foreground">
          Share your insights, interpretation, or experience with this question to help other students.
        </CardDescription>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="pt-4">
            <Textarea
              placeholder="Write your thoughts about this question..."
              className="min-h-[150px] resize-none border-border/30 focus-visible:ring-primary/50 bg-background/50"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t border-border/30 py-2.5 bg-card/40">
            <div className="text-xs text-muted-foreground">
              Your insights help everyone learn better
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Share</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </DynamicModal>
  )
}

export default HeartModal
