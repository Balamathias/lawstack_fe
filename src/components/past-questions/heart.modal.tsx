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
import { Heart, Loader2, MessageSquare, Send, Star, BookOpen, Users, Lightbulb, Quote } from 'lucide-react'
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
  const [charCount, setCharCount] = useState<number>(0)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const maxChars = 2000

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setThought(text)
      setCharCount(text.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!thought.trim()) {
      toast.error("Please enter your thoughts about this question")
      return
    }

    if (thought.trim().length < 10) {
      toast.error("Please provide more detailed thoughts (at least 10 characters)")
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
      setCharCount(0)
      router.refresh()
      toast.success("Your insights have been shared successfully!")
      
      // Close modal
      setOpen(false)
      
    } catch (error: any) {
      console.error(error)
      toast.error("Failed to share your thoughts. Please try again.")
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Share Your Insights
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                Help fellow students understand better
              </span>
            </div>
          </DialogTitle>
        </motion.div>
      }
      dialogClassName="sm:max-w-2xl"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Header Section */}
        <div className="hidden md:block relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5" />
          <div className="relative space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-pink-500/10 p-3 rounded-full border border-pink-500/20">
                  <Lightbulb className="h-5 w-5 text-pink-500" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Contribute to the Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Share your understanding, analysis, or alternative approaches to this question. 
                  Your insights could help other students see the problem from a new perspective.
                </p>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Help peers learn</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span>Share knowledge</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Quote className="h-4 w-4 text-purple-500" />
                <span>Build reputation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Your Contribution
                  </label>
                  <div className={cn(
                    "text-xs transition-colors",
                    charCount > maxChars * 0.9 ? "text-orange-500" : "text-muted-foreground"
                  )}>
                    {charCount}/{maxChars}
                  </div>
                </div>
                
                <div className="relative">
                  <Textarea
                    placeholder="Share your interpretation, approach, or insights about this question... 

                                Examples:
                                • Alternative solution methods
                                • Key legal principles to consider  
                                • Common mistakes to avoid
                                • Real-world applications
                                • Study tips for similar questions"
                    className={cn(
                      "min-h-[180px] resize-none border-border/40 focus-visible:ring-pink-500/50",
                      "bg-background/70 backdrop-blur-sm transition-all duration-200",
                      "placeholder:text-muted-foreground/70 font-['Spectral',serif]",
                      isSubmitting && "opacity-50"
                    )}
                    value={thought}
                    onChange={handleTextChange}
                    disabled={isSubmitting}
                  />
                  
                  {/* Character count warning */}
                  <AnimatePresence>
                    {charCount > maxChars * 0.9 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-6 right-0 text-xs text-orange-500"
                      >
                        Approaching character limit
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t border-border/30 bg-card/20 backdrop-blur-sm flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5 text-pink-500" />
                <span>Your contribution helps build a stronger learning community</span>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !thought.trim() || thought.trim().length < 10}
                  className={cn(
                    "gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700",
                    "text-white shadow-lg hover:shadow-xl transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                  )}
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
                        <span>Sharing...</span>
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
                        <span>Share Insights</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </motion.div>
    </DynamicModal>
  )
}

export default HeartModal
