'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { Brain, LucideStar, Sparkles } from 'lucide-react';
import { Question, User } from '@/@types/db';
import { DialogTitle } from '../ui/dialog';
import InsightsPanel from '../ai/insights-panel';
import { getQuestionInsights } from '@/services/client/ai';
import { motion } from 'framer-motion';

interface Props {
    trigger: React.ReactNode;
    user: User,
    question: Question,
}

const AIModal: React.FC<Props> = ({ trigger, user, question }) => {
  // Define our initial question-specific prompts with emojis
  const initialPrompts = [
    { prompt: 'Analyze this question for me', emoji: '🔍' },
    { prompt: 'Explain the legal principles involved', emoji: '⚖️' },
    { prompt: 'What are the key issues to consider?', emoji: '🧩' },
    { prompt: 'How would an expert approach this?', emoji: '👨‍⚖️' },
    // { prompt: 'Suggest a framework for answering', emoji: '📋' },
  ];

  return (
    <DynamicModal
      trigger={trigger}
      title={
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex items-center justify-between"
        >
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <span>Smart Legal Analysis</span>
          </DialogTitle>
        </motion.div>
      }
      dialogClassName="sm:max-w-3xl max-h-[calc(100vh-40px)] h-auto overflow-hidden"
    >
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <InsightsPanel
          user={user}
          contentType="question"
          contentId={question.id}
          content={question.text}
          getInsights={async (params) => getQuestionInsights({
            prompt: params.prompt,
            question,
            user
          })}
          initialPrompts={[]}
          className="flex-1 overflow-hidden flex flex-col min-h-0"
        />
      </div>
    </DynamicModal>
  )
}

export default AIModal
