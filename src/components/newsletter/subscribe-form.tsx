'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, MailIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSubscribeToNewsletter } from '@/services/client/newsletter';

const SubscribeSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

type SubscribeFormValues = z.infer<typeof SubscribeSchema>;

interface SubscribeFormProps {
  variant?: 'default' | 'compact' | 'footer';
  onSuccess?: () => void;
}

const SubscribeForm = ({ variant = 'default', onSuccess }: SubscribeFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: subscribe, isPending } = useSubscribeToNewsletter();

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(SubscribeSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
    },
  });

  const onSubmit = (values: SubscribeFormValues) => {
    subscribe(values, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setSubmitted(true);
        toast.success(data.message || 'Subscribed successfully! Please check your email to verify.');
        form.reset();
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to subscribe. Please try again later.');
      },
    });
  };

  // Render compact version for footer or sidebar
  if (variant === 'compact' || variant === 'footer') {
    return (
      <div className={variant === 'footer' ? "text-sm" : ""}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Enter your email"
                        className={`${variant === 'footer' ? 'h-9 pl-9' : 'pl-9'} pr-4`}
                        disabled={isPending || submitted}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              size={variant === 'footer' ? 'sm' : 'default'}
              disabled={isPending || submitted}
              className="min-w-[100px]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : submitted ? (
                <Check className="h-4 w-4" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  // Default full version
  return (
    <div className="w-full">
      {submitted ? (
        <div className="flex flex-col items-center justify-center text-center py-6 px-4">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Subscription Confirmed!</h3>
          <p className="text-muted-foreground max-w-md">
            Thank you for subscribing to our newsletter. Please check your email to verify your subscription.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input placeholder="Email Address *" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="mr-2 h-4 w-4" />
              )}
              Subscribe
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default SubscribeForm;