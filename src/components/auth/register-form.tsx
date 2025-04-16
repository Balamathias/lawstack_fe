"use client"

import React, { useState } from 'react'
import Logo from '../logo'
import { Input } from '../ui/input'
import Link from 'next/link'
import { Button } from '../ui/button'

import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
    LucideArrowLeft, 
    LucideLoader2, 
    Mail, 
    Lock, 
    LogIn, 
    UserPlus, 
    HelpCircle,
    Eye,
    EyeOff
} from 'lucide-react'
import { useRegister } from '@/services/client/auth'
import { toast } from 'sonner'
import LoadingOverlay from '../loading-overlay'

const AuthSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

const RegisterForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { mutate: register, isPending } = useRegister()

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof AuthSchema>) {
        if (values.password !== values.confirm_password) {
            return form.setError('confirm_password', { message: 'Passwords do not match' })
        }

        register(values, {
            onSuccess: (data) => {
                toast.success('Account created successfully. Please verify your email address with the verification code sent to your email.', { duration: 10000 })

                const next = searchParams?.get('next')

                form.reset()
                
                if (next) {
                    router.replace('/verify-email?email=' + encodeURIComponent(values.email) + '&next=' + encodeURIComponent(next))
                } else {
                    router.replace('/verify-email?email=' + encodeURIComponent(values.email))
                }
            },
            onError: (error) => {
                toast.error(error?.message || 'An error occurred')
                form.setError('email', { message: error?.message || 'An error occurred' })
            }
        })
    }

 return (
    <div className="flex items-center justify-center p-4 w-full">
        <Form {...form}>
            {isPending && (<LoadingOverlay />)}
            <div className='flex flex-col items-center justify-center gap-y-6 p-8 backdrop-blur-sm border border-border rounded-xl w-full max-w-[500px] shadow-lg bg-card/70 relative overflow-hidden'>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className='flex flex-col gap-y-8 w-full justify-between relative z-10'>
                    <div className='flex flex-col items-center gap-y-6 w-full'>
                        <Logo />

                        <div className="text-center space-y-2">
                            <h1 className='text-2xl font-bold text-foreground'>Create Account</h1>
                            <p className='text-muted-foreground'>
                                Sign up to get started with Lawstack
                            </p>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
                            <FormField
                                control={form.control}
                                name={'email'}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="items-center justify-between mb-2 font-medium flex">
                                        <span className="flex items-center gap-x-2">
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                className='h-12 w-full pl-10 transition-all border-input focus:ring-2 focus:ring-ring/20'
                                                placeholder='name@example.com'
                                                {...field}
                                            />
                                            <Mail className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className='text-destructive/70 text-sm mt-1.5' />
                                </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name={'password'}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="items-center justify-between mb-2 font-medium flex">
                                        <span className="flex items-center gap-x-2">
                                            <Lock className="w-4 h-4" />
                                            Password
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type={showPassword ? "text" : "password"}
                                                className='h-12 w-full pl-10 pr-10 transition-all border-input focus:ring-2 focus:ring-ring/20'
                                                placeholder='Create a strong password'
                                                {...field}
                                            />
                                            <Lock className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                                            <button 
                                                type="button" 
                                                className="absolute right-3 top-4 text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='text-destructive/70 text-sm mt-1.5' />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={'confirm_password'}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="items-center justify-between mb-2 font-medium flex">
                                        <span className="flex items-center gap-x-2">
                                            <Lock className="w-4 h-4" />
                                            Confirm Password
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type={showConfirmPassword ? "text" : "password"}
                                                className='h-12 w-full pl-10 pr-10 transition-all border-input focus:ring-2 focus:ring-ring/20'
                                                placeholder='Confirm your password'
                                                {...field}
                                            />
                                            <Lock className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                                            <button 
                                                type="button" 
                                                className="absolute right-3 top-4 text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='text-destructive/70 text-sm mt-1.5' />
                                </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                variant="default"
                                size="lg"
                                disabled={isPending}
                                className='w-full h-12 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-x-2 font-medium'
                            >
                                {isPending ? (
                                    <>
                                        <LucideLoader2 className="w-5 h-5 animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </Button>

                            <div className='flex w-full justify-center items-center pt-4 border-t border-border mt-2'>
                                <span className='text-muted-foreground flex items-center gap-x-2 text-sm'>
                                    <LogIn className="w-4 h-4" />
                                    Already have an account?
                                    <Link 
                                        href={`/login`} 
                                        className='text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline'
                                    >
                                        Sign In
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-xs text-center text-muted-foreground mt-4">
                    <Link href="/help" className="flex items-center justify-center gap-x-1 hover:text-primary transition-colors">
                        <HelpCircle className="w-3 h-3" />
                        <span>Need help?</span>
                    </Link>
                </div>
            </div>
        </Form>
    </div>
 )
}

export default RegisterForm
