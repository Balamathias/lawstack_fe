'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'

const StepOne = () => {
  return (
    <div className='w-full flex items-center justify-center'>
        <form className='w-full flex flex-col gap-y-4 max-w-[500px]'>
            <div className='mx-auto mb-5'>
                <Logo />
            </div>

            <h2 className='text-xl md:text-2xl text-center'>
                It all starts with your name!
            </h2>
            <p className='text-muted-foreground max-sm:text-center my-2'>
                Let&apos;s begin with your full name... A good name they say, is better than riches, right?
            </p>

            <div className='flex flex-col gap-y-4'>
                <Input 
                    className='h-12'
                    name='first_name'
                    placeholder='First Name...'
                    required
                />

                <Input 
                    className='h-12'
                    name='last_name'
                    placeholder='Last Name...'
                    required
                />

                <Button
                    className=''
                >
                    Save My Name
                </Button>
            </div>
        </form>
    </div>
  )
}

export default StepOne