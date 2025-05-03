'use client';

import { Plan, User } from '@/@types/db';
import { motion } from 'framer-motion';
import PlanModal from './plan-modal';
import Link from 'next/link';

interface EmptyStateProps {
  plans: Plan[],
  user: User | null,
}

const EmptyState = ({ plans, user }: EmptyStateProps) => {
  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="w-full h-[450px] flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border bg-card/30 backdrop-blur-sm"
  >
    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
    </div>
    
    <h2 className="text-2xl font-bold mb-3">No Subscriptions Found</h2>
    
    {user ? (
    <>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
      You don't have any active subscriptions. Upgrade to a premium plan to unlock all features and enhance your experience.
      </p>
      <PlanModal 
      plans={plans}
      trigger={
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Explore Premium Plans
        </button>
      }
      />
    </>
    ) : (
    <>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
      Sign in to your account to view and manage your subscriptions, or create an account to get started.
      </p>
      <div className="flex gap-4">
      <Link href="/login?next=/dashboard/subscriptions">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md">
        Sign In
        </button>
      </Link>
      <Link href="/register?redirect=/dashboard/subscriptions">
        <button className="px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-all">
        Create Account
        </button>
      </Link>
      </div>
    </>
    )}
  </motion.div>
  );
};

export default EmptyState;
