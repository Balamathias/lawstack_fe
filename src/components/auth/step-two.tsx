'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { LucideLoader } from 'lucide-react'
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
        {
            isPending && (<LoadingOverlay />)
        }
        <form 
            onSubmit={handleSubmit}
            className='w-full flex flex-col gap-y-4 max-w-[500px]'
        >
            <div className='mx-auto mb-5'>
                <Logo />
            </div>

            <h2 className='text-xl md:text-2xl text-center'>
                We fancy usernames too <b className='text-green-500'>{user?.first_name}</b>!
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
                    className='h-12'
                    disabled={isPending}
                >
                    {isPending ? (
                        <div className="flex items-center gap-x-2">
                            <LucideLoader size={20} className='animate-spin' />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        'Update My Details'
                    )}
                </Button>
            </div>
        </form>
    </div>
  )
}

export default StepTwo