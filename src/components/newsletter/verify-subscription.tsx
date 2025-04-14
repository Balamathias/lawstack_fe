'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useVerifySubscription, useUnsubscribe } from '@/services/client/newsletter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VerifySubscriptionProps {
  token: string;
  mode: 'verify' | 'unsubscribe';
}

const VerifySubscription = ({ token, mode }: VerifySubscriptionProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  
  const { mutate: verifySubscription, isPending: isVerifying } = useVerifySubscription();
  const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();
  
  useEffect(() => {
    if (mode === 'verify') {
      verifySubscription(
        { token },
        {
          onSuccess: (data) => {
            if (data.error) {
              setStatus('error');
              setMessage(data.error);
              return;
            }
            setStatus('success');
            setMessage(data.message || 'Your subscription has been successfully verified!');
          },
          onError: (error: any) => {
            setStatus('error');
            setMessage(error.message || 'Failed to verify your subscription. Please try again later.');
          },
        }
      );
    } else if (mode === 'unsubscribe') {
      unsubscribe(
        { token },
        {
          onSuccess: (data) => {
            if (data.error) {
              setStatus('error');
              setMessage(data.error);
              return;
            }
            setStatus('success');
            setMessage(data.message || 'You have been successfully unsubscribed from our newsletter.');
          },
          onError: (error: any) => {
            setStatus('error');
            setMessage(error.message || 'Failed to unsubscribe. Please try again later.');
          },
        }
      );
    }
  }, [token, mode, verifySubscription, unsubscribe]);

  const isPending = isVerifying || isUnsubscribing;

  if (status === 'loading' || isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {mode === 'verify' ? 'Verifying your subscription' : 'Processing your unsubscribe request'}
        </h2>
        <p className="text-muted-foreground text-center">
          Please wait while we process your request...
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          {mode === 'verify' ? 'Subscription Verified!' : 'Unsubscribed Successfully'}
        </h2>
        <p className="text-muted-foreground max-w-md mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button variant="outline">Go to Homepage</Button>
          </Link>
          {mode === 'unsubscribe' && (
            <Link href="/newsletter/subscribe">
              <Button>Resubscribe</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <XCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-4">
        {mode === 'verify' ? 'Verification Failed' : 'Unsubscribe Failed'}
      </h2>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="outline">Go to Homepage</Button>
        </Link>
        <Link href="/newsletter/subscribe">
          <Button>
            {mode === 'verify' ? 'Try Subscribing Again' : 'Manage Your Subscription'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifySubscription;