'use client'

import React from 'react'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, ImageIcon, ChevronRight, Upload, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingOverlay from '../loading-overlay'
import { Card } from '../ui/card'
import ProfilePictureUpload from '../ui/profile-picture-upload'
import { Separator } from '../ui/separator'

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
    const [uploadType, setUploadType] = React.useState<'preset' | 'custom'>('custom')
    const router = useRouter()

    const handleSelectAvatar = (avatar: string) => {
        setAvatar(avatar)
        setUploadType('preset')
    }

    const handleCustomAvatar = (url: string) => {
        setAvatar(url)
        setUploadType('custom')
    }
  
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
  
      updateUser({ avatar }, {
        onSuccess: (data) => {
          if (data?.error) {
              return toast.error(data.message || data?.error?.message)
          }
          toast.success('Avatar saved successfully. Let\'s select your institution!')
          router.replace('/finish-up?step=4') // Update this to go to step 4 instead of dashboard
        },
        onError: (error) => {
          toast.error('An error occurred. Please try again.')
        }
      })
    }

  return (
    <div className='w-full min-h-[90vh] flex items-center justify-center px-1 py-8 md:py-12'>
        {isPending && (<LoadingOverlay loader="1" />)}
        
        <Card className='w-full max-w-3xl px-2 md:p-8 backdrop-blur-sm bg-card/70 shadow-xl border border-border/50 animate-fade-in'>
            <div className='flex flex-col gap-y-8'>
                <div className='flex justify-center mb-2 transform hover:scale-105 transition-transform duration-300'>
                    <Logo />
                </div>

                <div className="space-y-3 animate-fade-in-delay">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <span className="text-xs font-medium">STEP 3 OF 3</span>
                    </div>
                    
                    <h2 className='text-lg md:text-xl font-bold tracking-tight flex flex-wrap items-center gap-2'>
                        <ImageIcon className="h-6 w-6 text-primary" />
                        <span>Choose your avatar,</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">@{user?.username}</span>
                    </h2>
                      <p className='text-muted-foreground text-base'>
                        Choose a professional avatar or upload your own photo. Your profile picture helps build trust and recognition.
                    </p>
                </div>

                {/* Upload Options Tabs */}
                <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-lg">
                    <button
                        onClick={() => setUploadType('custom')}
                        className={cn(
                            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                            uploadType === 'custom'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                        </div>
                    </button>
                    <button
                        onClick={() => setUploadType('preset')}
                        className={cn(
                            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                            uploadType === 'preset'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Quick Select
                        </div>
                    </button>
                </div>

                {/* Content based on selected type */}
                {uploadType === 'preset' ? (
                    <div className='space-y-6'>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Choose from our collection</h3>
                            <p className="text-sm text-muted-foreground">
                                Professional avatars ready to use
                            </p>
                        </div>

                        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 animate-slide-in-up'>
                            {avatars.map((_avatar, index) => (
                                <div 
                                    key={index} 
                                    className={cn(
                                        'relative group cursor-pointer transition-all duration-300 hover:z-10',
                                        _avatar === avatar && uploadType === 'preset' && 'scale-105 z-10'
                                    )}
                                >
                                    <div className={cn(
                                        'absolute inset-0 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 opacity-0 transition-all duration-300 -z-10 blur-sm',
                                        _avatar === avatar && uploadType === 'preset' && 'opacity-100'
                                    )} />
                                    
                                    <div className="relative flex items-center justify-center">
                                        <div className={cn(
                                            'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 -m-1',
                                            _avatar === avatar && uploadType === 'preset' ? 'opacity-100 animate-pulse-custom bg-primary/20' : 'group-hover:opacity-50 bg-secondary/50'
                                        )} />
                                        
                                        <img 
                                            src={_avatar}
                                            alt={`Avatar option ${index + 1}`}
                                            className={cn(
                                                'w-16 h-16 md:w-20 md:h-20 rounded-full object-cover transition-all duration-300 border-2',
                                                _avatar === avatar && uploadType === 'preset'
                                                    ? 'border-primary shadow-lg shadow-primary/25 scale-110' 
                                                    : 'border-transparent grayscale-[30%] group-hover:grayscale-0 group-hover:border-primary/30 group-hover:shadow-md'
                                            )}
                                            onClick={() => handleSelectAvatar(_avatar)}
                                        />
                                        
                                        {_avatar === avatar && uploadType === 'preset' && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-background rounded-full border border-primary/20 shadow-sm flex items-center justify-center animate-fade-in">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ProfilePictureUpload
                        userId={user?.id || ''}
                        currentAvatar={uploadType === 'custom' ? avatar : undefined}
                        onAvatarChange={handleCustomAvatar}
                        className="animate-fade-in"
                    />
                )}

                {/* Divider */}
                {uploadType === 'preset' && (
                    <div className="relative">
                        <Separator />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-background px-4 text-xs text-muted-foreground">
                                OR UPLOAD YOUR OWN
                            </span>
                        </div>
                    </div>
                )}                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-8 justify-between items-center">
                    <div className="flex items-center gap-2">
                        {avatar && (
                            <>
                                <img 
                                    src={avatar} 
                                    alt="Selected avatar" 
                                    className="w-10 h-10 rounded-full border-2 border-primary/30 shadow-sm animate-fade-in" 
                                />
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        {uploadType === 'custom' ? 'Custom photo selected' : 'Avatar selected'}
                                    </span>
                                    {uploadType === 'custom' && (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span className="text-xs">Professional upload</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                
                    <Button 
                        className={cn(
                            'h-12 rounded-lg text-base font-medium shadow-lg transition-all duration-300 px-8',
                            avatar ? 'hover:shadow-primary/30 animate-fade-in' : 'opacity-80'
                        )}
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
                                <span>{avatar ? 'Complete Setup' : 'Select an Avatar'}</span>
                                {avatar ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  )
}

export default StepThree