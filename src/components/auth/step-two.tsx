'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'

const StepTwo = () => {
  return (
    <div className='w-full flex items-center justify-center'>
        <form className='w-full flex flex-col gap-y-4 max-w-[500px]'>
            <div className='mx-auto mb-5'>
                <Logo />
            </div>

            <h2 className='text-xl md:text-2xl text-center'>
                We fancy usernames too!
            </h2>
            <p className='text-muted-foreground max-sm:text-center my-2'>
                Sometimes, we just want to be known by a special name. Some call it &quot;alias&quot;, while others call it &quot;nickname&quot;. What should we call you?
            </p>

            <div className='flex flex-col gap-y-4'>
                <Input 
                    className='h-12'
                    name='username'
                    placeholder='Your Username...'
                    required
                />

                <Input 
                    className='h-12'
                    name='phone'
                    placeholder='Your Phone Number...'
                    required
                    type='tel'
                />

                <Button
                    className=''
                >
                    Update My Details
                </Button>
            </div>
        </form>
    </div>
  )
}

export default StepTwo