"use client"

import React, { useState, useEffect } from 'react'
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { useResendOTP, useVerifyOTP } from '@/services/client/auth'
import { LucideLoader } from 'lucide-react'
import { toast } from 'sonner'

const AuthSchema = z.object({
 otp: z.string().min(6, { message: 'Enter a valid OTP.' }),
})

const OTPForm = () => {
    const router = useRouter()

    const email = useSearchParams().get('email')
    const next = useSearchParams().get('next')

    const { mutate: verifyOTP, isPending } = useVerifyOTP()
    const { mutate: resendOTP, isPending: resending } = useResendOTP()

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: {
            otp: "",
        },
    })

    const [countdown, setCountdown] = useState(90)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    async function onSubmit(values: z.infer<typeof AuthSchema>) {
        verifyOTP({ email: email!, otp: values.otp }, {
            onSuccess: (data) => {
                if (data.error) {
                    form.setError('otp', { message: data.message })
                    return
                }

                form.reset()

                toast.success('Email verified successfully. Redirecting...')

                if (next) {
                    router.replace(next)
                } else {
                    router.replace('/')
                }
            }
        })
    }

    const handleResendOTP = () => {
        resendOTP({ email: email! }, {
            onSuccess: (data) => {
                if (data.error) {
                    form.setError('otp', { message: data.message })
                    return
                }

                toast.success('OTP sent successfully. Please check your email.')

                setCountdown(90)
                setCanResend(false)
            }
        })
        setCountdown(90)
        setCanResend(false)
    }

 return (
    <Form {...form}>
     <div className='flex flex-col justify-center gap-y-6 py-12 p-4 backdrop-blur-sm border rounded-xl w-full max-w-[500px]'>

        <div className='flex flex-col gap-y-12 w-full justify-between'>
         <div className='flex flex-col gap-y-7 w-full'>
            <div className='flex flex-col items-center justify-center w-full'>
                <Logo />
            </div>


            <h2 className='text-lg'>
                Hi <b className='font-semibold'>{ email }</b>, please verify your email.
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full items-center justify-center">
                <div className='w-full flex flex-col items-center justify-center gap-y-4'>
                    <FormField
                        control={form.control}
                        name={'otp'}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="items-center justify-between my-1.5 font-bold hidden">
                                Enter OTP
                            </FormLabel>
                            <FormControl className='flex items-center justify-center'>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup className="flex justify-between gap-2">
                                        <InputOTPSlot index={0} className="w-14 h-14 text-center border rounded-lg" />
                                        <InputOTPSlot index={1} className="w-14 h-14 text-center border rounded-lg" />
                                        <InputOTPSlot index={2} className="w-14 h-14 text-center border rounded-lg" />
                                        <InputOTPSlot index={3} className="w-14 h-14 text-center border rounded-lg" />
                                        <InputOTPSlot index={4} className="w-14 h-14 text-center border rounded-lg" />
                                        <InputOTPSlot index={5} className="w-14 h-14 text-center border rounded-lg" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage className='text-red-500/70' />
                            </FormItem>
                        )}
                    />
                </div>
            <div className='flex w-full justify-between items-center mt-5'>
                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className='rounded-xl'
                    onClick={handleResendOTP}
                    disabled={!canResend || resending || isPending}
                >
                    {resending ? (
                        <>
                            <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : canResend ? 'Resend' : `Resend in ${countdown}s`}
                </Button>
                
                <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className='rounded-xl'
                    disabled={isPending || resending}
                >
                    {isPending ? (
                        <>
                            <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : 'Verify Email'}
                </Button>
            </div>
            </form>
         </div>
        </div>
     </div>       
    </Form>
 )
}

export default OTPForm
