'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { AtSign, ArrowRight, Phone, Loader2, CheckCircle2 } from 'lucide-react'
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
    <div className='w-full flex items-center justify-center min-h-[80vh]'>
        {isPending && (<LoadingOverlay />)}
        
        <div className="w-full max-w-[500px] relative">
            {/* Step indicator */}
            <div className="absolute -top-10 left-0 right-0 flex justify-center">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm border border-primary/30">1</div>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shadow-lg shadow-primary/20">2</div>
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">3</div>
                </div>
            </div>
            
            <div className="p-2.5 md:p-8 bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl shadow-lg animate-fade-in relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
                
                <form 
                    onSubmit={handleSubmit}
                    className='w-full flex flex-col gap-y-6 relative z-10'
                >
                    <div className='mx-auto mb-5 transform hover:scale-105 transition-transform duration-300'>
                        <Logo />
                    </div>

                    <div className="space-y-3 text-center animate-fade-in-delay">
                        <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
                            Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{user?.first_name}!</span>
                        </h2>
                        <p className='text-muted-foreground max-w-md mx-auto'>
                            Sometimes, we just want to be known by a special name. What should we call you?
                        </p>
                    </div>

                    <div className='space-y-5 mt-6 animate-slide-in-up'>
                        <div className="relative group">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors duration-200" />
                            <Input 
                                className='h-12 pl-10 rounded-lg border-input/60 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                                name='username'
                                placeholder='Your Username...'
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                        </div>

                        <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors duration-200" />
                            <Input 
                                className='h-12 pl-10 rounded-lg border-input/60 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                                name='phone'
                                placeholder='Your Phone Number...'
                                required
                                type='tel'
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                        </div>

                        <Button
                            className='h-12 w-full rounded-lg text-base font-medium shadow-lg hover:shadow-primary/30 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 mt-4'
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
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default StepTwo