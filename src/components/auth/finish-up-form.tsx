import React from 'react'
import StepOne from './step-one'
import StepTwo from './step-two'
import { getUser } from '@/services/server/auth'
import StepThree from './step-three'
import ProgressIndicator from './progress-indicator'

interface FinishUpFormProps {
    searchParams: Record<string, any>    
}

const FinishUpForm = async ({ searchParams }: FinishUpFormProps) => {
  const { data: user } = await getUser()

  const step = Number(searchParams?.['step']) || 1

  return (
    <div className='w-full flex flex-col gap-y-5 max-w-4xl mx-auto px-4 py-6 animate-fade-in'>
        <ProgressIndicator currentStep={step} />
        
        <div className="flex flex-col items-center justify-center gap-y-6 p-5 backdrop-blur-sm border border-border rounded-xl w-full shadow-lg bg-card/70 relative overflow-hidden animate-slide-in-up pb-10">

            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            {(!step || (step === 1)) && <StepOne />}
            {((step === 2)) && <StepTwo user={user} />}
            {((step === 3)) && <StepThree user={user} />}

        </div>
    </div>
  )
}

export default FinishUpForm