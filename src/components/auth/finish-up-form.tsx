'use client'

import React from 'react'
import StepOne from './step-one'
import { useSearchParams } from 'next/navigation'
import StepTwo from './step-two'

const FinishUpForm = () => {
  const step = Number(useSearchParams().get('step'))

  return (
    <div className='w-full flex flex-col gap-y-5'>
        {(!step || (step === 1)) && <StepOne />}
        {((step === 2)) && <StepTwo />}
    </div>
  )
}

export default FinishUpForm