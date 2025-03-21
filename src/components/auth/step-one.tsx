'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowRight, User, UserRound, Loader2 } from 'lucide-react'
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
        {isPending && (<LoadingOverlay />)}
        
        <form 
            className='w-full flex flex-col gap-y-6 max-w-[500px]'
            onSubmit={handleSubmit}
        >
            <div className='mx-auto mb-8 transform hover:scale-105 transition-transform duration-300'>
                <Logo />
            </div>

            <div className="space-y-2 text-center">
                <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
                    It all starts with your name!
                </h2>
                <p className='text-muted-foreground max-w-md mx-auto'>
                    Let&apos;s begin with your full name... A good name they say, is better than riches, right?
                </p>
            </div>

            <div className='space-y-4 mt-4'>
                <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                        className='h-12 pl-10 rounded-lg border-input/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                        name='first_name'
                        placeholder='First Name...'
                        required
                    />
                </div>

                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                        className='h-12 pl-10 rounded-lg border-input/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                        name='last_name'
                        placeholder='Last Name...'
                        required
                    />
                </div>

                <Button
                    className='h-12 w-full rounded-lg text-base font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300'
                    disabled={isPending}
                >
                    {isPending ? (
                        <div className="flex items-center gap-x-2">
                            <Loader2 size={20} className='animate-spin' />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <span>Continue</span>
                            <ArrowRight size={18} />
                        </div>
                    )}
                </Button>
            </div>
        </form>
    </div>
  )
}

export default StepOne