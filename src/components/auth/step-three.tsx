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
import { cn } from '@/lib/utils'
import LoadingOverlay from '../loading-overlay'

interface Props {
    user: User | null
}

const avatars = [
    'https://avatar.iran.liara.run/public/48',
    'https://avatar.iran.liara.run/public/9',
    'https://avatar.iran.liara.run/public/10',
    'https://avatar.iran.liara.run/public/82',
    'https://avatar.iran.liara.run/public/76',
    'https://avatar.iran.liara.run/public/68',
    'https://avatar.iran.liara.run/public/67',
    'https://avatar.iran.liara.run/public/32',
    'https://avatar.iran.liara.run/public/33',
    'https://avatar.iran.liara.run/public/34',
    'https://avatar.iran.liara.run/public/79',
    'https://avatar.iran.liara.run/public/80',
]

const StepThree = ({ user }: Props) => {
    const { mutate: updateUser, isPending } = useUpdateUser()

    const [avatar, setAvatar] = React.useState('')

    const router = useRouter()

    const handleSelectAvatar = (avatar: string) => {
        setAvatar(avatar)
    }
  
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
  
      updateUser({ avatar }, {
        onSuccess: (data) => {
  
          if (data?.error) {
              return toast.error(data.message || data?.error?.message)
          }
  
          toast.success('Avatar saved successfully. You are all set!')
          router.replace('/?rel=welcome')
        },
        onError: (error) => {
          toast.error('An error occurred. Please try again.')
        }
      })
    }

  return (
    <div className='w-full flex items-center justify-center'>
        {
            isPending && (<LoadingOverlay loader="1" />)
        }
        <div 
            className='w-full flex flex-col gap-y-4 max-w-3xl'
        >
            <div className='mb-5'>
                <Logo />
            </div>

            <h2 className='text-xl md:text-2xl'>
                Got it! @<b className='text-sky-500'>{user?.username}</b>👌
            </h2>
            <p className='text-muted-foreground my-2'>
                How about a picture of yourself? or simply an avatar? Make it unique!
            </p>

            <div className='grid grid-cols-4 md:grid-cols-6 gap-4'>
                {avatars.map((_avatar, index) => (
                    <div key={index} className=''>
                        <img 
                            src={_avatar}
                            className={cn('w-12 h-12 rounded-full object-cover cursor-pointer transition-all duration-300 hover:scale-110 filter', {
                                'brightness-110 contrast-125 saturate-150 shadow-lg ring-2 ring-sky-500': _avatar === avatar,
                                'hover:brightness-110 hover:contrast-110 grayscale-[50%]': _avatar !== avatar
                            })}
                            onClick={() => handleSelectAvatar(_avatar)}
                        />
                    </div>
                ))}
            </div>

            <Button className='w-full mt-16 sm:w-fit sm:float-right rounded-lg' type='submit' variant={'secondary'} onClick={handleSubmit} disabled={isPending}>
                {isPending ? (
                    <LucideLoader className='w-6 h-6 animate-spin' />
                ) : (
                    'Continue'
                )}
            </Button>
        </div>
    </div>
  )
}

export default StepThree