'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { AtSign, ArrowRight, Phone, Loader2 } from 'lucide-react'
import LoadingOverlay from '../loading-overlay'

interface Props {
    user: User | null
}

const StepTwo = ({ user }: Props) => {
    const { mutate: updateUser, isPending } = useUpdateUser()
    const router = useRouter()
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
  
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
  
      const username = (formData.get('username') as string).trim()
      const phone = (formData.get('phone') as string).trim()
  
      if (!username || !phone) {
          return toast.error('Please enter your first and last name')
      }
  
      updateUser({ username, phone }, {
        onSuccess: (data) => {
  
          if (data?.error) {
              return toast.error(data.message || data?.error?.message)
          }
  
          toast.success('Username and Phone saved successfully. Let\'s move on to the final step.')
          router.replace('/finish-up?step=3')
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
            onSubmit={handleSubmit}
            className='w-full flex flex-col gap-y-6 max-w-[500px]'
        >
            <div className='mx-auto mb-8 transform hover:scale-105 transition-transform duration-300'>
                <Logo />
            </div>

            <div className="space-y-2 text-center">
                <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
                    Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400">{user?.first_name}!</span>
                </h2>
                <p className='text-muted-foreground max-w-md mx-auto'>
                    Sometimes, we just want to be known by a special name. What should we call you?
                </p>
            </div>

            <div className='space-y-4 mt-4'>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                        className='h-12 pl-10 rounded-lg border-input/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                        name='username'
                        placeholder='Your Username...'
                        required
                    />
                </div>

                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                        className='h-12 pl-10 rounded-lg border-input/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                        name='phone'
                        placeholder='Your Phone Number...'
                        required
                        type='tel'
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

export default StepTwo