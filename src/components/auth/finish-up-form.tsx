import React from 'react'
import StepOne from './step-one'
import StepTwo from './step-two'
import { getUser } from '@/services/server/auth'
import StepThree from './step-three'

interface FinishUpFormProps {
    searchParams: Record<string, any>    
}

const FinishUpForm = async ({ searchParams }: FinishUpFormProps) => {
  const { data: user } = await getUser()

  const step = Number(searchParams?.['step'])

  return (
    <div className='w-full flex flex-col gap-y-5'>
        {(!step || (step === 1)) && <StepOne />}
        {((step === 2)) && <StepTwo user={user} />}
        {((step === 3)) && <StepThree user={user} />}
    </div>
  )
}

export default FinishUpForm