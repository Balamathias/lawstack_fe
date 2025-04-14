"use client";

import React from 'react';
import { Mail, Newspaper } from 'lucide-react';
import SubscribeForm from './subscribe-form';
import { cn } from '@/lib/utils';

interface NewsletterSectionProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSection({
  variant = 'primary',
  title = 'Subscribe to our Newsletter',
  description = 'Stay updated with the latest legal insights, cases, and resources. Get exclusive content delivered to your inbox.',
  className,
}: NewsletterSectionProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn("py-6", className)}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <SubscribeForm variant="compact" />
      </div>
    );
  }
  
  if (variant === 'secondary') {
    return (
      <section className={cn("border rounded-lg p-6", className)}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-6">{description}</p>
        <SubscribeForm variant="compact" />
      </section>
    );
  }

  // Primary variant (default)
  return (
    <section className={cn("bg-card border rounded-xl shadow-sm overflow-hidden", className)}>
      <div className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.03)_25%,rgba(68,68,68,.03)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.03)_75%)] bg-[length:8px_8px]"></div>
        
        <div className="relative grid gap-6 lg:grid-cols-2 p-8 sm:p-10">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4 w-fit">
              <Newspaper className="h-4 w-4" />
              <span>LawStack Newsletter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              {description}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span className="text-sm">Weekly legal updates and case summaries</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span className="text-sm">Exclusive resources and practice materials</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span className="text-sm">Latest Nigerian legal trends and insights</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <div className="bg-background rounded-lg border p-6 w-full">
              <h3 className="text-xl font-semibold mb-4">Join Our Community</h3>
              <SubscribeForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}