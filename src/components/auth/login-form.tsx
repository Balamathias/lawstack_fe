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
import { useLogin } from '@/services/client/auth'
import { toast } from 'sonner'
import LoadingOverlay from '../loading-overlay'

const AuthSchema = z.object({
 email: z.string().email({ message: 'Please enter a valid email address' }),
 password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

const LoginForm = () => {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const searchParams = useSearchParams()

    const { mutate: login, isPending } = useLogin()

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof AuthSchema>) {

        login(values, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Login successful')

                const next = searchParams?.get('next')

                form.reset()
                
                if (next) {
                    router.replace(next)
                } else {
                    router.replace('/dashboard')
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
             {"Hi, Welcome back! Let's get you in."}
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

                <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isPending}
                    className='w-full'
                >
                    {isPending && <LucideLoader2 className={`w-6 h-6 ${isPending ? "animate-spin" : ""}`} />}
                    {isPending ? "Loading..." : "Login"}
                </Button>

                <div className='flex w-full justify-between items-center'>
                    <span
                        className='text-muted-foreground transition-all'
                    >
                        {'Don\'t have an account?'} <Link href={`/register`} className='text-primary hover:text-green-500'>Create Account</Link>
                    </span>
                </div>
            </form>
         </div>
        </div>
     </div>       
    </Form>
 )
}

export default LoginForm
