'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { LucideLoader } from 'lucide-react'
import LoadingOverlay from '../loading-overlay'

const StepOne = () => {
  const { mutate: updateUser, isPending } = useUpdateUser()

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const first_name = (formData.get('first_name') as string).trim()
    const last_name = (formData.get('last_name') as string).trim()

    if (!first_name || !last_name) {
        return toast.error('Please enter your first and last name')
    }

    updateUser({ first_name, last_name }, {
      onSuccess: (data) => {

        if (data?.error) {
            return toast.error(data.error)
        }

        toast.success('Name saved successfully. Let\'s move on to the next step.')
        router.replace('/finish-up?step=2')
      },
      onError: (error) => {
        toast.error('An error occurred. Please try again.')
      }
    })
  }

  return (
    <div className='w-full flex items-center justify-center'>
        {
            isPending && (<LoadingOverlay />)
        }
        <form 
            className='w-full flex flex-col gap-y-4 max-w-[500px]'
            onSubmit={handleSubmit}
        >
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
                    className='h-12'
                    disabled={isPending}
                >
                    {isPending ? (
                        <div className="flex items-center gap-x-2">
                            <LucideLoader size={20} className='animate-spin' />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        'Save My Name'
                    )}
                </Button>
            </div>
        </form>
    </div>
  )
}

export default StepOne