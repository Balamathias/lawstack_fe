'use client'

import React from 'react'
import DynamicModal from '../dynamic-modal';
import { Brain, LucideStar, Sparkles, Zap, MessageCircle, BookOpen, Target } from 'lucide-react';
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <motion.div 
              className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 rounded-xl border border-blue-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="h-5 w-5 text-blue-500" />
              <motion.div
                className="absolute inset-0 bg-blue-500/10 rounded-xl"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Legal Analysis
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                Get expert-level insights and guidance
              </span>
            </div>
          </DialogTitle>
        </motion.div>
      }
      dialogClassName="sm:max-w-4xl max-h-[calc(100vh-40px)] h-auto overflow-hidden"
    >
      <motion.div 
        className="flex-1 overflow-hidden flex flex-col min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-4 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
          <div className="relative flex items-center gap-4">
            <div className="flex gap-2">
              <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <Brain className="h-4 w-4 text-blue-500" />
              </div>
              <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                <Target className="h-4 w-4 text-cyan-500" />
              </div>
              <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                <BookOpen className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">AI-Powered Legal Assistant</h3>
              <p className="text-xs text-muted-foreground">
                Ask specific questions about legal concepts, case analysis, or problem-solving approaches
              </p>
            </div>
          </div>
        </div>

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
      </motion.div>
    </DynamicModal>
  )
}

export default AIModal
