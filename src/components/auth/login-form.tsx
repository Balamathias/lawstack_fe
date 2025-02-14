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
import { useRouter } from 'next/navigation'
import { Card } from '../ui/card'
import { LucideLock, LucideMail, LucideArrowLeft } from 'lucide-react'

const AuthSchema = z.object({
 email: z.string().email({ message: 'Please enter a valid email address' }),
 password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

const LoginForm = () => {
    const router = useRouter()
    const [step, setStep] = useState(1)

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof AuthSchema>) {
        // Handle form submission
    }

 return (
    <Form {...form}>
     <div className='flex flex-col items-center justify-center gap-y-6 py-12 p-4 backdrop-blur-sm border rounded-xl w-full max-w-[500px]'>

        <div className='flex flex-col gap-y-12 w-full justify-between'>
         <div className='flex flex-col items-center gap-y-4 w-full'>
            <Logo />

            <h2 className='text-lg text-center'>
             {step === 1 ? "Hi, Welcome back! Let's get you in." : "Enter your password to continue."}
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
                    href={`/register`}
                    className='hover:text-muted-foreground transition-all'
                >
                    Create Account
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
                >
                    Login
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

export default LoginForm
