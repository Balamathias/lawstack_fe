"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivateSubscription } from '@/services/client/subscriptions';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface SubscriptionSuccessProps {
  reference?: string;
  redirectUrl?: string;
}

const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({ 
  reference: propReference,
  redirectUrl = '/dashboard'
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const reference = propReference || params?.get('reference') || '';
  
  const { mutate: activateSubscription, isPending, isSuccess, isError, error } = useActivateSubscription();

  useEffect(() => {
    if (reference) {
      activateSubscription(reference, {
        onSuccess: () => {
          toast.success('Your subscription has been activated successfully!');
          // Wait a moment before redirecting so user can see the success message
          setTimeout(() => {
            router.push(redirectUrl);
          }, 2000);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to activate subscription');
        }
      });
    }
  }, [reference, activateSubscription, router, redirectUrl]);

  if (!reference) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Invalid Payment Reference</h2>
            <p className="text-muted-foreground">
              We couldn't find a valid payment reference. Please contact support if you believe this is an error.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold">Activating your subscription</h2>
            <p className="text-muted-foreground">
              Please wait while we activate your subscription...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Activation Failed</h2>
            <p className="text-muted-foreground">
              {(error as any)?.message || 'Something went wrong while activating your subscription.'}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Subscription Activated!</h2>
            <p className="text-muted-foreground">
              Your payment was successful and your subscription has been activated. You will be redirected shortly.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push(redirectUrl)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
};

export default SubscriptionSuccess;
