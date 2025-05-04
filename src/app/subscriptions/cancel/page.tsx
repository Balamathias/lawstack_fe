'use client';

import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaystackCancelPage() {
    return (
        <div className="container max-w-lg mx-auto py-16 px-4 min-h-[90vh] flex items-center justify-center">
            <div className="w-full bg-background rounded-xl overflow-hidden">
                <div className="p-8 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
                    <div className="flex justify-center">
                        <div className="rounded-full p-3 bg-red-100 dark:bg-red-900/30">
                            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <h1 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-400">
                            Payment Cancelled
                        </h1>
                        <p className="text-muted-foreground">Your payment process was cancelled or could not be completed.</p>
                        
                        <p className="mt-2 text-muted-foreground">
                            If you intended to subscribe or update your plan, please try again. If the problem persists, contact support.
                        </p>
                    </div>
                </div>
                
                <div className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please return to the subscription page to try again or view your current subscription
                    </p>
                    
                    <div className="flex justify-center space-x-4">
                        <Button asChild>
                            <Link href="/dashboard/subscriptions">
                                Return to Subscriptions
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">
                                Go to Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}