import React from 'react'
import DynamicModal from '../dynamic-modal'
import { Contribution, Question } from '@/@types/db'

interface Props {
    contribution: Contribution,
    question: Question
}

const ContributionInsights = ({ contribution, question }: Props) => {
  return (
    <div>
        <DynamicModal>
            <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto p-2.5 leading-relaxed'>

            </div>
        </DynamicModal>
    </div>
  )
}

export default ContributionInsights