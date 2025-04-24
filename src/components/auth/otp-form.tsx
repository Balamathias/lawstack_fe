"use client"

import React, { useState, useEffect } from 'react'
import Logo from '../logo'
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { useResendOTP, useVerifyOTP } from '@/services/client/auth'
import { ArrowRight, LucideLoader, Mail, RefreshCw, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

const AuthSchema = z.object({
  otp: z.string().min(6, { message: 'Enter a valid 6-digit verification code.' }),
})

const OTPForm = () => {
    const router = useRouter()
    const email = useSearchParams().get('email')
    const next = useSearchParams().get('next')
    const { mutate: verifyOTP, isPending } = useVerifyOTP()
    const { mutate: resendOTP, isPending: resending } = useResendOTP()

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: { otp: "" },
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
                    router.replace(`/finish-up?step=1&next=${next}`)
                } else {
                    router.replace('/finish-up?step=1')
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
    }

    return (
        <Form {...form}>
            <div className='flex flex-col justify-center mx-auto py-10 px-2.5 md:px-12 backdrop-blur-sm bg-background/95 border border-border shadow-xl rounded-xl w-full max-w-[520px] transition-all animate-fade-in'>
                <div className='space-y-10'>
                    {/* Header */}
                    <div className='flex flex-col items-center'>
                        <div className='mb-8 transition-transform hover:scale-105 duration-300'>
                            <Logo />
                        </div>
                        
                        <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md'>
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        
                        <h1 className='text-2xl font-bold text-foreground mb-2'>
                            Verify Your Email
                        </h1>
                        
                        <p className='text-muted-foreground text-center max-w-sm'>
                            {"We've"} sent a code to <span className='font-semibold text-foreground'>{email}</span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-delay">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} className="flex justify-center gap-2">
                                            <InputOTPGroup className="flex justify-center gap-2 md:gap-3">
                                                {Array.from({ length: 6 }).map((_, index) => (
                                                    <InputOTPSlot 
                                                        key={index} 
                                                        index={index} 
                                                        className="w-12 h-14 md:w-14 md:h-16 text-xl font-medium border-2 rounded-lg bg-card text-card-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription className="text-center text-muted-foreground mt-4">
                                        Please enter the verification code we sent to your email
                                    </FormDescription>
                                    <FormMessage className="text-center text-destructive" />
                                </FormItem>
                            )}
                        />
                        
                        {/* Resend Timer */}
                        <div className="flex justify-center">
                            {canResend ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-primary hover:bg-primary/10 rounded-full h-auto px-4 py-2 text-sm font-medium"
                                    onClick={handleResendOTP}
                                    disabled={resending}
                                >
                                    {resending ? (
                                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    Resend verification code
                                </Button>
                            ) : (
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse-custom"></div>
                                    Resend available in <span className="font-semibold text-foreground">{countdown}s</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in-delay-longer">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 rounded-lg h-11 border-2 hover:border-border"
                                onClick={() => router.back()}
                            >
                                Back to Login
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={isPending || form.getValues('otp')?.length !== 6}
                                className="flex-1 rounded-lg h-11 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                            >
                                {isPending ? (
                                    <>
                                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Email
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Form>
    )
}

export default OTPForm
