"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionModal from './subscription-modal';
import { Sparkles } from 'lucide-react';

export default function SubscriptionDemoPage() {
  const handleSelectPlan = (planId: string) => {
    console.log(`Selected plan: ${planId}`);
    // Here you would typically redirect to checkout or handle subscription logic
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Subscription Demo</h1>
      
      <div className="space-y-4">
        <div className="p-6 bg-card rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Try our Subscription Modal</h2>
          <p className="mb-6 text-muted-foreground">
            Click the button below to open the subscription modal and explore different plans.
          </p>
          
          <SubscriptionModal 
            trigger={
              <Button className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500">
                <Sparkles className="mr-2 h-4 w-4" />
                View Premium Plans
              </Button>
            }
            onSelectPlan={handleSelectPlan}
          />
        </div>
        
        <div className="p-6 bg-card rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Current User Subscription</h2>
          <p className="mb-6 text-muted-foreground">
            This example shows the modal with an existing subscription.
          </p>
          
          <SubscriptionModal 
            trigger={
              <Button variant="outline">
                Manage Subscription
              </Button>
            }
            subscription={{
              id: '123',
              user: 'user_1',
              plan: {
                id: 'bronze',
                name: 'LawStack Bronze',
                price: 1000,
                duration: 'monthly',
              },
              status: 'active',
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              is_auto_renew: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }}
            onSelectPlan={handleSelectPlan}
          />
        </div>
      </div>
    </div>
  );
}
