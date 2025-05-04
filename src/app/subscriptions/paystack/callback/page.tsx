'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import { useSearchParams } from 'next/navigation';

export default function PaystackCallbackPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    const pendingPlanId = sessionStorage.getItem('pendingSubscriptionPlan');
    const redirectTime = sessionStorage.getItem('subscriptionRedirectTime');
    
    if (!pendingPlanId) {
      setStatus('success');
      setMessage('Your subscription has been processed. Redirecting to subscription page...');
      setTimeout(() => {
        router.push('/dashboard/subscriptions');
        router.refresh();
      }, 3000);
      return;
    }

    sessionStorage.removeItem('pendingSubscriptionPlan');
    sessionStorage.removeItem('subscriptionRedirectTime');
    
    setStatus('success');
    setMessage('Payment successful! Your subscription is now active.');
    
    setTimeout(() => {
      router.push('/dashboard/subscriptions');
      router.refresh();
    }, 3000);
  }, [router, reference]);

  return (
    <div className="container max-w-lg mx-auto py-16 px-4 min-h-[90vh] flex items-center justify-center">
      <div className="w-full bg-background rounded-xl overflow-hidden">
        <div className={`p-8 rounded-xl ${
          status === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' 
            : status === 'failed'
              ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20'
        }`}>
          <div className="flex justify-center">
            {status === 'verifying' && (
              <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30">
                <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === 'failed' && (
              <div className="rounded-full p-3 bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <h1 className={`text-2xl font-bold mb-2 ${
              status === 'success' 
                ? 'text-green-700 dark:text-green-400' 
                : status === 'failed' 
                  ? 'text-red-700 dark:text-red-400' 
                  : 'text-blue-700 dark:text-blue-400'
            }`}>
              {status === 'verifying' ? 'Processing Payment' : 
               status === 'success' ? 'Payment Successful' : 'Payment Failed'}
            </h1>
            <p className="text-muted-foreground">{message}</p>
            
            {reference && (
              <p className="mt-2 text-sm">
                Reference: <span className="font-mono">{reference}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {status === 'success' 
              ? "You'll be redirected to your subscription page in a few seconds" 
              : "Please return to the subscription page to try again or view your current subscription"}
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/dashboard/subscriptions">
                Go to Subscriptions
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
