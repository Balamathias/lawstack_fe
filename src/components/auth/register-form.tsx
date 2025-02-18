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
import { LucideLoader2 } from 'lucide-react'
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
    <Form {...form}>
        {
            isPending && (<LoadingOverlay />)
        }
     <div className='flex flex-col items-center justify-center gap-y-6 py-12 p-4 backdrop-blur-sm border rounded-xl w-full max-w-[500px]'>

        <div className='flex flex-col gap-y-12 w-full justify-between'>
         <div className='flex flex-col items-center gap-y-4 w-full'>
            <Logo />

            <h2 className='text-lg text-center'>
             Hi, join us at LawStack and learn law with <span className='text-green-500'>style</span>.
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full">
                <FormField
                 control={form.control}
                 name={'email'}
                 render={({ field }) => (
                    <FormItem>
                     <FormLabel className="items-center justify-between my-1.5 font-bold">
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
                <FormField
                 control={form.control}
                 name={'password'}
                 render={({ field }) => (
                    <FormItem>
                     <FormLabel className="items-center justify-between my-1.5 font-bold">
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

                <FormField
                 control={form.control}
                 name={'confirm_password'}
                 render={({ field }) => (
                    <FormItem>
                     <FormLabel className="items-center justify-between my-1.5 font-bold">
                        Confirm Password
                     </FormLabel>
                     <FormControl>
                        <Input 
                         type="password"
                         className='h-14 w-full'
                         placeholder='Confirm your password'
                         {...field}
                        />
                     </FormControl>
                     <FormMessage className='text-red-500/70' />
                    </FormItem>
                 )}
                />

                <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isPending}
                    className='w-full'
                >
                    {isPending && <LucideLoader2 className={`w-6 h-6 ${isPending ? "animate-spin" : ""}`} />}
                    {isPending ? "Loading..." : "Register"}
                </Button>

                <div className='flex w-full justify-between items-center'>
                    <span
                        className='text-muted-foreground transition-all'
                    >
                        {'Already have an account?'} <Link href={`/login`} className='text-primary hover:text-green-500'>Login</Link>.
                    </span>
                </div>
            </form>
         </div>
        </div>
     </div>       
    </Form>
 )
}

export default RegisterForm
