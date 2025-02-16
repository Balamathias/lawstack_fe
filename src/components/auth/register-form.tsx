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
import { LucideArrowLeft, LucideLoader2 } from 'lucide-react'
import { useRegister } from '@/services/client/auth'
import { toast } from 'sonner'

const AuthSchema = z.object({
 email: z.string().email({ message: 'Please enter a valid email address' }),
 password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

const RegisterForm = () => {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const searchParams = useSearchParams()

    const { mutate: register, isPending } = useRegister()

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof AuthSchema>) {
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
                form.setError('password', { message: error?.message || 'An error occurred' })
            }
        })
    }

 return (
    <Form {...form}>
     <div className='flex flex-col items-center justify-center gap-y-6 py-12 p-4 backdrop-blur-sm border rounded-xl w-full max-w-[500px]'>

        <div className='flex flex-col gap-y-12 w-full justify-between'>
         <div className='flex flex-col items-center gap-y-4 w-full'>
            <Logo />

            <h2 className='text-lg text-center'>
             {step === 1 ? "Hi, join us at LawStack and learn and become a pro." : "Set a password... You'd be able to use it to login."}
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full">
             {step === 1 && (
                <FormField
                 control={form.control}
                 name={'email'}
                 render={({ field }) => (
                    <FormItem>
                     <FormLabel className="items-center justify-between my-1.5 font-bold hidden">
                        Email
                     </FormLabel>
                     <FormControl>
                        <Input 
                         className='h-14 w-full'
                         placeholder='Enter your email'
                         {...field}
                        />
                     </FormControl>
                     <FormMessage className='text-red-500/70' />
                    </FormItem>
                 )}
                />
             )}
             {step === 2 && (
                <FormField
                 control={form.control}
                 name={'password'}
                 render={({ field }) => (
                    <FormItem>
                     <FormLabel className="items-center justify-between my-1.5 font-bold hidden">
                        Password
                     </FormLabel>
                     <FormControl>
                        <Input 
                         type="password"
                         className='h-14 w-full'
                         placeholder='Enter your password'
                         {...field}
                        />
                     </FormControl>
                     <FormMessage className='text-red-500/70' />
                    </FormItem>
                 )}
                />
             )}

            <div className='flex w-full justify-between items-center'>
                {step === 1 ? (
                <Link
                    href={`/login`}
                    className='hover:text-muted-foreground transition-all'
                >
                    Log In
                </Link>
                ) : (
                <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep(1)}
                >
                    <LucideArrowLeft className="mr-2" />
                    Previous
                </Button>
                )}
                {step === 1 ? (
                <Button
                    type="button"
                    variant="default"
                    size="lg"
                    onClick={e => {
                        e.preventDefault()
                        setStep(2)
                    }}
                >
                    Next
                </Button>
                ) : (
                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        disabled={isPending}
                    >
                        {isPending && <LucideLoader2 className={`w-6 h-6 ${isPending ? "animate-spin" : ""}`} />}
                        {isPending ? "Loading..." : "Register"}
                    </Button>
                )}
            </div>

            </form>
         </div>
        </div>
     </div>       
    </Form>
 )
}

export default RegisterForm
