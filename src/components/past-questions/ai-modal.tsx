'use client'

import React, { useState } from 'react'
import GlassModal from '../ui/glass-modal'
import { Brain } from 'lucide-react'
import { Question, User } from '@/@types/db'
import InsightsPanel from '../ai/insights-panel'
import { getQuestionInsights } from '@/services/client/ai'

interface Props {
    trigger: React.ReactNode;
    user: User,
    question: Question,
}

const AIModal: React.FC<Props> = ({ trigger, user, question }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>
      
      <GlassModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Legal Analysis</span>
          </div>
        }
        subtitle="Get expert-level insights and guidance"
        size="xl"
        className="md:min-h-[70vh] min-h-[95vh]"
      >
        <div className="flex flex-col md:min-h-[60vh] min-h-[85vh]">
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
      </GlassModal>
    </>
  )
}

export default AIModal
