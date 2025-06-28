'use client'

import React, { useState } from 'react'
import GlassModal from '../ui/glass-modal'
import { Question, User } from '@/@types/db'
import { Button } from '../ui/button'
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link as LinkIcon, 
  Mail, 
  Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
    question: Question;
    user?: User | null;
    trigger: React.ReactNode;
}

const ShareModal: React.FC<Props> = ({ question, user, trigger }) => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const questionUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/dashboard/past-questions/${question.id}`
    : ''

  const shareTitle = `Check out this legal question: ${question.text.slice(0, 100)}...`

  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast.success(`${type} copied to clipboard!`)
      
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: LinkIcon,
      action: () => handleCopyToClipboard(questionUrl, 'Link'),
      description: 'Copy direct link to share anywhere'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(questionUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
      },
      description: 'Share on Twitter/X'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(questionUrl)}`
        window.open(url, '_blank', 'width=600,height=500')
      },
      description: 'Share on LinkedIn'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(questionUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
      },
      description: 'Share on Facebook'
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`Legal Question: ${question.text.slice(0, 50)}...`)
        const body = encodeURIComponent(`Hi,\n\nI found this interesting legal question that I thought you might want to check out:\n\n"${question.text.slice(0, 200)}..."\n\nView the full question and discussion here: ${questionUrl}\n\nBest regards`)
        window.location.href = `mailto:?subject=${subject}&body=${body}`
      },
      description: 'Share via email'
    }
  ]

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>
      
      <GlassModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Share Question"
        subtitle="Help others discover this legal question"
        size="lg"
      >
        <div className="space-y-6">
          {/* Question Preview */}
          <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
              {question.text}
            </p>
          </div>

          {/* URL Preview */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/10 border border-border/20">
            <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground font-mono truncate">
              {questionUrl}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyToClipboard(questionUrl, 'URL')}
              className="ml-auto h-7 w-7 p-0"
            >
              <AnimatePresence mode="wait">
                {copied === 'URL' ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-3 w-3 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <LinkIcon className="h-3 w-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Share Options</h3>
            <div className="grid grid-cols-1 gap-2">
              {shareOptions.map((option, index) => (
                <motion.div
                  key={option.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    onClick={option.action}
                    className={cn(
                      "w-full justify-start gap-3 p-3 h-auto border-border/30",
                      "bg-background/30 backdrop-blur-sm",
                      "hover:bg-muted/30 transition-all duration-200"
                    )}
                  >
                    <option.icon className="h-4 w-4 text-foreground" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </GlassModal>
    </>
  )
}

export default ShareModal
