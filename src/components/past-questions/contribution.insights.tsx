'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { LucideStar, Sparkles, Target, BookOpen, Brain } from 'lucide-react';
import { Contribution, Question } from '@/@types/db';
import { DialogTitle } from '../ui/dialog';
import InsightsPanel from '../ai/insights-panel';
import { getContributionInsights } from '@/services/client/ai';
import { useUser } from '@/services/client/auth';
import { motion } from 'framer-motion';

interface Props {
  contribution: Contribution,
  question: Question,
  trigger: React.ReactNode
}

const ContributionInsights: React.FC<Props> = ({ trigger, contribution, question }) => {
  const { data: userData } = useUser();
  const user = userData?.data;

  // Define contribution-specific prompts with emojis
  const initialPrompts = [
    { prompt: 'Analyze the legal reasoning', emoji: '⚖️' },
    { prompt: 'Evaluate this contribution', emoji: '🔍' },
    { prompt: 'Identify strengths and weaknesses', emoji: '💪' },
    { prompt: 'How well does it answer the question?', emoji: '🎯' },
    { prompt: 'Suggest improvements', emoji: '✨' },
  ];

  return (
    <DynamicModal
      trigger={trigger}
      title={
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Contribution Analysis
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                AI-powered evaluation and feedback
              </span>
            </div>
          </DialogTitle>
        </motion.div>
      }
      dialogClassName='sm:max-w-4xl h-[85vh]'
      drawerClassName="pb-4"
    >
      <motion.div
        className="h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header Banner */}
        <div className="hidden md:block relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/5 to-green-500/5 p-4 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5" />
          <div className="relative flex items-center gap-4">
            <div className="flex gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Brain className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                <Target className="h-4 w-4 text-green-500" />
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Contribution Evaluation</h3>
              <p className="text-xs text-muted-foreground">
                Get detailed analysis of this student {"contribution's"} quality, accuracy, and educational value
              </p>
            </div>
          </div>
        </div>

        <InsightsPanel
          user={user!}
          contentType="contribution"
          contentId={contribution.id}
          content={contribution.text}
          getInsights={async (params) => getContributionInsights({
            prompt: params.prompt,
            question,
            contribution,
            user
          })}
          initialPrompts={[]}
          className="flex-1 overflow-hidden flex flex-col min-h-0"
        />
      </motion.div>
    </DynamicModal>
  )
}

export default ContributionInsights
