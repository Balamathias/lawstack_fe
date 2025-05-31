'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal'
import { DialogTitle } from '../ui/dialog'
import { LucideHeart, LucideMessageCircle, LucideSparkle, LucideStars, User, Calendar, MessageSquare, Eye } from 'lucide-react'
import MarkdownPreview from '../markdown-preview'
import { Contribution, Question } from '@/@types/db'
import ContributionInsights from './contribution.insights'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Props {
    contribution: Contribution,
    question: Question
}

const ContributionDetailModal = ({ contribution, question }: Props) => {
  const createdAt = new Date(contribution.created_at)
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <div>
        <DynamicModal
            dialogClassName='sm:max-w-4xl max-h-[85vh]'
            title={
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <DialogTitle className="flex items-center justify-between w-full">
                    <div className='flex items-center gap-3'>
                      <div className="flex flex-col">
                        <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent text-lg font-semibold">
                          Student Contribution
                        </span>
                        <span className="text-sm text-muted-foreground font-normal">
                          Community insight and analysis
                        </span>
                      </div>
                    </div>

                    <ContributionInsights 
                      trigger={
                        <LucideSparkle size={16} />
                      }
                      contribution={contribution}
                      question={question}
                    />
                  </DialogTitle>
                </motion.div>
            }
            trigger={
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer group"
              >
                <p className="text-sm line-clamp-4 hover:opacity-80 transition-all leading-relaxed font-['Spectral',serif]">
                  {contribution.text}
                </p>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to read full contribution</span>
                </div>
              </motion.div>
            }
        >
            <motion.div 
              className='flex flex-col h-full'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Author Info Header */}
              <div className="border-b border-border/50 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-pink-500/20">
                    <AvatarImage 
                      src={contribution.contributor?.avatar || ''} 
                      alt={contribution.contributor?.username || 'User'} 
                    />
                    <AvatarFallback className="bg-pink-500/10 text-pink-600 font-semibold">
                      {(contribution.contributor?.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">
                        {contribution.contributor?.username || 'Anonymous'}
                      </h4>
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        Contributor
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{contribution.text.length} characters</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='flex-1 overflow-y-auto'>
                <div className="prose prose-sm max-w-none">
                  <MarkdownPreview 
                    content={contribution.text} 
                    className="leading-relaxed font-['Spectral',serif]"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border/50 pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <LucideHeart className="h-3 w-3 text-pink-500" />
                    <span>This contribution helps the learning community</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* You could add like/dislike buttons here if needed */}
                  </div>
                </div>
              </div>
            </motion.div>
        </DynamicModal>
    </div>
  )
}

export default ContributionDetailModal