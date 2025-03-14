'use client'

import React from 'react'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, ImageIcon } from 'lucide-react'
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
          router.replace('/dashboard?rel=welcome')
        },
        onError: (error) => {
          toast.error('An error occurred. Please try again.')
        }
      })
    }

  return (
    <div className='w-full flex items-center justify-center'>
        {isPending && (<LoadingOverlay loader="1" />)}
        
        <div className='w-full flex flex-col gap-y-6 max-w-3xl'>
            <div className='mb-8 transform hover:scale-105 transition-transform duration-300'>
                <Logo />
            </div>

            <div className="space-y-2">
                <h2 className='text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2'>
                    <ImageIcon className="h-6 w-6 text-sky-500" />
                    <span>Choose your avatar, </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-400">@{user?.username}</span>
                </h2>
                <p className='text-muted-foreground'>
                    Select an avatar that represents you best. Make it unique!
                </p>
            </div>

            <div className='grid grid-cols-4 md:grid-cols-6 gap-4 mt-4'>
                {avatars.map((_avatar, index) => (
                    <div 
                        key={index} 
                        className={cn(
                            'relative group cursor-pointer transition-all duration-300',
                            _avatar === avatar && 'scale-110'
                        )}
                    >
                        <div className={cn(
                            'absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 opacity-0 transition-opacity duration-300 -z-10',
                            _avatar === avatar && 'opacity-100'
                        )} />
                        
                        <img 
                            src={_avatar}
                            alt={`Avatar option ${index + 1}`}
                            className={cn(
                                'w-16 h-16 rounded-full object-cover transition-all duration-300 border-2 group-hover:scale-105',
                                _avatar === avatar 
                                    ? 'border-sky-500 shadow-lg shadow-sky-500/25' 
                                    : 'border-transparent grayscale-[30%] group-hover:grayscale-0'
                            )}
                            onClick={() => handleSelectAvatar(_avatar)}
                        />
                        
                        {_avatar === avatar && (
                            <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-sky-500 bg-background rounded-full" />
                        )}
                    </div>
                ))}
            </div>

            <Button 
                className='mt-8 h-12 ml-auto rounded-lg text-base font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300 px-8'
                variant={avatar ? 'default' : 'secondary'} 
                onClick={handleSubmit}
                disabled={isPending || !avatar}
            >
                {isPending ? (
                    <div className="flex items-center gap-x-2">
                        <Loader2 className='w-5 h-5 animate-spin' />
                        <span>Saving...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2">
                        <span>Complete Setup</span>
                        <CheckCircle2 size={18} />
                    </div>
                )}
            </Button>
        </div>
    </div>
  )
}

export default StepThree