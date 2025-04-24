"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Shield, Crown, Sparkles, 
  Diamond, ArrowRight, Gem, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DynamicModal from '../dynamic-modal';
import { Subscription } from '@/@types/db';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

// Define plan type for improved type checking
interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  cycle: 'free' | 'monthly' | 'quarterly' | 'yearly';
  color: string;
  icon: React.ReactNode;
  popular?: boolean;
  bestValue?: boolean;
  features: PlanFeature[];
}

// Demo plan data
const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Basic access to legal resources',
    price: 0,
    priceId: 'price_free',
    cycle: 'free',
    color: 'gray',
    icon: <Zap size={18} />,
    features: [
      { name: 'Limited AI questions', included: true, limit: '10/day' },
      { name: 'Basic past questions', included: true },
      { name: 'Simple analytics', included: true },
      { name: 'Bookmark limit', included: true, limit: '20' },
      { name: 'Chat history', included: true, limit: '7 days' },
      { name: 'Premium course materials', included: false },
      { name: 'Advanced AI features', included: false },
      { name: 'Unlimited practice exams', included: false },
    ]
  },
  {
    id: 'bronze',
    name: 'LawStack Bronze',
    description: 'Enhanced learning for serious students',
    price: 1000,
    priceId: 'price_monthly',
    cycle: 'monthly',
    color: 'amber',
    icon: <Crown size={18} />,
    features: [
      { name: 'Enhanced AI questions', included: true, limit: '30/day' },
      { name: 'Full past questions library', included: true },
      { name: 'Detailed analytics', included: true },
      { name: 'Bookmark limit', included: true, limit: '100' },
      { name: 'Chat history', included: true, limit: '30 days' },
      { name: 'Premium course materials', included: true, limit: 'Selected' },
      { name: 'Advanced AI features', included: false },
      { name: 'Unlimited practice exams', included: false },
    ]
  },
  {
    id: 'gold',
    name: 'LawStack Gold',
    description: 'Premium features for dedicated learners',
    price: 2500,
    priceId: 'price_quarterly',
    cycle: 'quarterly',
    color: 'yellow',
    icon: <Crown size={18} />,
    popular: true,
    features: [
      { name: 'Extensive AI questions', included: true, limit: '100/day' },
      { name: 'Full past questions library', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Bookmark limit', included: true, limit: '500' },
      { name: 'Chat history', included: true, limit: '90 days' },
      { name: 'Premium course materials', included: true },
      { name: 'Advanced AI features', included: true, limit: 'Most' },
      { name: 'Unlimited practice exams', included: true, limit: '10/month' },
    ]
  },
  {
    id: 'sapphire',
    name: 'LawStack Sapphire',
    description: 'Ultimate package for legal excellence',
    price: 8000,
    priceId: 'price_yearly',
    cycle: 'yearly',
    color: 'blue',
    icon: <Diamond size={18} />,
    bestValue: true,
    features: [
      { name: 'Unlimited AI questions', included: true },
      { name: 'Full past questions library', included: true },
      { name: 'Premium analytics', included: true },
      { name: 'Unlimited bookmarks', included: true },
      { name: 'Unlimited chat history', included: true },
      { name: 'Premium course materials', included: true },
      { name: 'All advanced AI features', included: true },
      { name: 'Unlimited practice exams', included: true },
    ]
  }
];

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const pulseAnimation = {
  initial: { scale: 1, boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.7)" },
  animate: {
    scale: [1, 1.02, 1],
    boxShadow: [
      "0 0 0 0 rgba(99, 102, 241, 0)",
      "0 0 0 10px rgba(99, 102, 241, 0.2)",
      "0 0 0 0 rgba(99, 102, 241, 0)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

interface SubscriptionModalProps {
  trigger?: React.ReactNode;
  subscription?: Subscription | null;
  onSelectPlan?: (planId: string) => void;
  onClose?: () => void;
}

const SubscriptionModal = ({
  trigger,
  subscription = null,
  onSelectPlan,
  onClose
}: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    subscription?.plan?.id || 'free'
  );
  const [isOpen, setIsOpen] = useState(false);

  const getPlanInfo = (planId: string): Plan => {
    return PLANS.find(plan => plan.id === planId) || PLANS[0];
  };

  const handleSelectPlan = (planId: string): void => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (): void => {
    if (onSelectPlan) {
      onSelectPlan(selectedPlan);
    }
    setIsOpen(false);
  };

  const handleClose = (): void => {
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  };

  const getDiscount = (plan: Plan): string | null => {
    if (plan.cycle === 'yearly') {
      return '2 months free';
    } else if (plan.cycle === 'quarterly') {
      return '1 month free';
    }
    return null;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <DynamicModal
      open={isOpen}
      setOpen={(value) => {
        if (typeof value === 'function') {
          setIsOpen(value(isOpen));
        } else {
          setIsOpen(value);
        }
        if (!value && onClose) onClose();
      }}
      trigger={trigger}
      dialogClassName="sm:max-w-7xl p-0 overflow-hidden bg-background/85 backdrop-blur-lg w-full"
      drawerClassName="p-0 bg-background/85 backdrop-blur-lg"
      hideDrawerCancel
      title={
        <div className="w-full items-center justify-between px-3 py-1 hidden 2xl:flex">
          <div className="flex items-center gap-2">
            <Gem size={20} className="text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              LawStack Premium
            </span>
          </div>
          {subscription && (
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/20 hidden sm:block"
            >
              Current: {getPlanInfo(subscription.plan?.id || 'free').name}
            </Badge>
          )}
        </div>
      }
    >
      <div className="max-h-[80vh] overflow-y-auto scrollbar-hidden pt-4 pb-6 px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Intro */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Elevate Your Legal Education</h2>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              Unlock premium features to enhance your learning experience and maximize your success in legal studies.
            </p>
          </motion.div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10">
            {PLANS.map((plan) => {
              const isPlanSelected = selectedPlan === plan.id;
              const isCurrentPlan = subscription?.plan?.id === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  className="relative"
                  animate={isPlanSelected ? "animate" : "initial"}
                  initial="initial"
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 border-none text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.bestValue && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white">
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <motion.div
                    variants={isPlanSelected ? pulseAnimation : {}}
                    animate={isPlanSelected ? "animate" : "initial"}
                    className={cn(
                      "h-full rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 border p-5 flex flex-col",
                      isPlanSelected 
                        ? "bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                        : "bg-card/30 hover:bg-card/80 border-border/50",
                      plan.popular && !isPlanSelected && "border-yellow-500/30 bg-yellow-500/5",
                      plan.bestValue && !isPlanSelected && "border-blue-500/30 bg-blue-500/5",
                    )}
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className={cn(
                          "p-1.5 rounded-md",
                          isPlanSelected ? 'bg-primary/20' : 'bg-secondary',
                          plan.color === 'blue' && 'text-blue-500',
                          plan.color === 'amber' && 'text-amber-500',
                          plan.color === 'yellow' && 'text-yellow-500',
                        )}>
                          {plan.icon}
                        </div>
                        
                        {isCurrentPlan && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Current
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground h-10">
                        {plan.description}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-end gap-1.5 mb-1">
                        {plan.price === 0 ? (
                          <span className="text-2xl font-bold">Free</span>
                        ) : (
                          <>
                            <span className="text-2xl font-bold">
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-muted-foreground text-sm pb-0.5">
                              {plan.cycle === 'monthly' && '/month'}
                              {plan.cycle === 'quarterly' && '/quarter'}
                              {plan.cycle === 'yearly' && '/year'}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {getDiscount(plan) && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
                          {getDiscount(plan)}
                        </Badge>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex-1">
                      <ul className="space-y-2 mb-4">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            {feature.included ? (
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <span className={feature.included ? "" : "text-muted-foreground"}>
                              {feature.name}
                              {feature.limit && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({feature.limit})
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button
                      variant={isPlanSelected ? "default" : "outline"} 
                      className={cn(
                        "mt-2 w-full",
                        isPlanSelected && "bg-primary hover:bg-primary/90",
                        plan.bestValue && !isPlanSelected && "border-blue-500/30 text-blue-600 hover:bg-blue-500/10",
                        plan.popular && !isPlanSelected && "border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
                      )}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {isPlanSelected ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={16} />
                          Selected
                        </span>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : (
                        "Select Plan"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Feature comparison */}
          <motion.div variants={itemVariants} className="overflow-x-auto pb-4">
            <div className="min-w-[700px]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Feature Comparison
              </h3>
              
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium">Feature</th>
                    {PLANS.map(plan => (
                      <th key={plan.id} className={cn(
                        "py-2 text-center font-medium",
                        selectedPlan === plan.id ? "text-primary" : ""
                      )}>
                        <div className="flex flex-col items-center">
                          {plan.name}
                          {selectedPlan === plan.id && (
                            <div className="h-1 w-10 bg-primary rounded-full mt-1"></div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">AI Questions</td>
                    <td className="py-3 text-center">10/day</td>
                    <td className="py-3 text-center">30/day</td>
                    <td className="py-3 text-center">100/day</td>
                    <td className="py-3 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">Past Questions</td>
                    <td className="py-3 text-center">Basic</td>
                    <td className="py-3 text-center">Full Library</td>
                    <td className="py-3 text-center">Full Library</td>
                    <td className="py-3 text-center">Full Library</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">Practice Exams</td>
                    <td className="py-3 text-center">3/month</td>
                    <td className="py-3 text-center">5/month</td>
                    <td className="py-3 text-center">10/month</td>
                    <td className="py-3 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">Premium Case Laws</td>
                    <td className="py-3 text-center">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">Select Only</td>
                    <td className="py-3 text-center">Most</td>
                    <td className="py-3 text-center">All</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">Advanced Analytics</td>
                    <td className="py-3 text-center">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">Basic</td>
                    <td className="py-3 text-center">Advanced</td>
                    <td className="py-3 text-center">Premium</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-3 font-medium">Support</td>
                    <td className="py-3 text-center">Community</td>
                    <td className="py-3 text-center">Email</td>
                    <td className="py-3 text-center">Priority</td>
                    <td className="py-3 text-center">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Footer with action buttons */}
      <div className="border-t px-6 py-4 bg-muted/30 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            <Shield size={14} />
            Secure payment with PayStack • Cancel anytime
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={() => handleSubscribe()}
            size="sm"
            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white"
          >
            {selectedPlan === 'free' ? (
              'Continue with Free'
            ) : subscription?.plan?.id === selectedPlan ? (
              'Keep Current Plan'
            ) : (
              <>
                Continue
                <ArrowRight size={16} className="ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </DynamicModal>
  );
};

export default SubscriptionModal;
