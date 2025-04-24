'use client'

import React from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowRight, User, UserRound, Loader2, Sparkles } from 'lucide-react'
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
        <div className='w-full flex items-center justify-center min-h-[80vh] py-10'>
                {isPending && (<LoadingOverlay />)}
                
                <div className="w-full max-w-[540px] px-2 md:px-6">
                        <form 
                                className='w-full flex flex-col gap-y-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-8 shadow-xl'
                                onSubmit={handleSubmit}
                        >
                                <div className='mx-auto mb-4 transform hover:scale-105 transition-transform duration-300 animate-fade-in'>
                                        <Logo />
                                </div>

                                <div className="space-y-3 text-center animate-fade-in-delay">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                                <div className="h-px w-8 bg-primary/30"></div>
                                                <span className="text-primary/80 text-sm font-medium">WELCOME</span>
                                                <div className="h-px w-8 bg-primary/30"></div>
                                        </div>
                                        <h2 className='text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
                                                It all starts with your name!
                                        </h2>
                                        <p className='text-muted-foreground max-w-md mx-auto text-sm md:text-base'>
                                                Let&apos;s begin with your full name... A good name they say, is better than riches, right?
                                        </p>
                                </div>

                                <div className='space-y-5 mt-2 animate-fade-in-delay-longer'>
                                        <div className="relative group">
                                                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 h-5 w-5 transition-all group-focus-within:text-primary" />
                                                <Input 
                                                        className='h-14 pl-10 rounded-xl border-input/60 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base'
                                                        name='first_name'
                                                        placeholder='First Name...'
                                                        required
                                                />
                                                <div className="absolute inset-0 rounded-xl border border-primary/0 group-focus-within:border-primary/10 group-focus-within:bg-primary/[0.02] pointer-events-none transition-all"></div>
                                        </div>

                                        <div className="relative group">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 h-5 w-5 transition-all group-focus-within:text-primary" />
                                                <Input 
                                                        className='h-14 pl-10 rounded-xl border-input/60 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base'
                                                        name='last_name'
                                                        placeholder='Last Name...'
                                                        required
                                                />
                                                <div className="absolute inset-0 rounded-xl border border-primary/0 group-focus-within:border-primary/10 group-focus-within:bg-primary/[0.02] pointer-events-none transition-all"></div>
                                        </div>

                                        <Button
                                                className='h-14 w-full rounded-xl text-base font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300 mt-3 relative overflow-hidden group'
                                                disabled={isPending}
                                        >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="relative flex items-center justify-center gap-x-2">
                                                        {isPending ? (
                                                                <>
                                                                        <Loader2 size={20} className='animate-spin' />
                                                                        <span>Saving...</span>
                                                                </>
                                                        ) : (
                                                                <>
                                                                        <span>Continue</span>
                                                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                                </>
                                                        )}
                                                </div>
                                        </Button>
                                        
                                        <div className="flex items-center justify-center gap-x-2 mt-3 text-xs text-muted-foreground opacity-80">
                                                <Sparkles size={14} className="text-primary/70" />
                                                <span>Your data is secure and encrypted</span>
                                        </div>
                                </div>
                        </form>
                        
                        <div className="absolute top-[60%] left-[20%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute bottom-[30%] right-[30%] w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                </div>
        </div>
    )
}

export default StepOne