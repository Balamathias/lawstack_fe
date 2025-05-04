'use client';

import React, { useState, useEffect } from 'react';
import { Plan, Subscription } from '@/@types/db';
import DynamicModal from '@/components/dynamic-modal';
import { usePaystackInit, usePlans } from '@/services/client/subscriptions';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRouter } from 'nextjs-toploader/app';

interface PlanModalProps {
  open?: boolean;
  setOpen?: (bool: boolean) => void;
  trigger?: React.ReactNode;
  plans?: Plan[];
  currentSubscription?: Subscription | null;
  onSelectPlan?: (plan: Plan) => void;
  isLoading?: boolean;
  title?: string;
  showComparison?: boolean;
}

const PlanModal = ({ 
  open, 
  setOpen, 
  trigger, 
  plans: propPlans,
  currentSubscription, 
  onSelectPlan,
  isLoading: propIsLoading,
  title = "Choose Your Plan",
  showComparison = true
}: PlanModalProps) => {
  const { data: fetchedPlansData, isPending: isLoadingPlans } = usePlans();
  const { mutate: paystackInit, isPending: isPendingPaystackInit } = usePaystackInit();

  const router = useRouter();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    currentSubscription?.plan?.id || null
  );
  const [activeTab, setActiveTab] = useState<string>('cards');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const isLoading = propIsLoading || (isLoadingPlans && !propPlans);
  
  const plans = propPlans || fetchedPlansData?.data || [];
  
  const sortedPlans = React.useMemo(() => {
    const freePlan = plans.find(p => p.price === 0);
    const paidPlans = plans
      .filter(p => p.price > 0)
      .sort((a, b) => a.price - b.price);
      
    return freePlan ? [freePlan, ...paidPlans] : paidPlans;
  }, [plans]);
  
  useEffect(() => {
    if (currentSubscription?.plan?.id) {
      setSelectedPlanId(currentSubscription.plan.id);
    } else if (sortedPlans.length > 0) {
      const defaultPlan = sortedPlans.find(p => p.price === 0) || sortedPlans[0];
      setSelectedPlanId(defaultPlan.id);
    }
  }, [currentSubscription, sortedPlans]);
  
  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    if (onSelectPlan) {
      onSelectPlan(plan);
    }

    if (plan.price > 0) {
      // Set redirecting state to show loading UI
      setIsRedirecting(true);
      
      paystackInit(plan.id, {
        onSuccess: ({ data, error }) => {
          if (error) {
            toast.error(error.message);
            setIsRedirecting(false);
          } else {
            const authorization_url = data?.data?.authorization_url;

            if (authorization_url) {
              // Store selected plan in session storage before redirecting
              sessionStorage.setItem('pendingSubscriptionPlan', plan.id);
              sessionStorage.setItem('subscriptionRedirectTime', Date.now().toString());
              
              // Close the modal first
              setOpen?.(false);
              
              // Show a toast before redirecting
              toast.info("Redirecting to payment page...");
              
              // Redirect to the authorization URL
              router.push(authorization_url)
            } else {
              toast.error("Failed to initialize payment. Please try again.");
              setIsRedirecting(false);
            }
          }
        },
        onError: (error) => {
          console.error("Paystack initialization error:", error);
          toast.error("Failed to initialize payment. Please try again.");
          setIsRedirecting(false);
        }
      });
    } else {
      setOpen?.(false);
    }
  };
  
  const allFeatures = React.useMemo(() => {
    const featuresSet = new Set<string>();
    sortedPlans.forEach(plan => {
      plan.features.split(',').forEach(feature => featuresSet.add(feature));
    });
    return Array.from(featuresSet);
  }, [sortedPlans]);

  return (
    <DynamicModal 
      open={open} 
      setOpen={setOpen} 
      trigger={trigger} 
      title={
        <DialogTitle className="flex flex-col items-center space-y-2">
          <div className="text-xl font-bold tracking-tight text-center">{title}</div>
          <p className="text-sm text-muted-foreground text-center hidden">
            {currentSubscription 
              ? "Upgrade your current plan for more premium features" 
              : "Choose a plan that works best for you"}
          </p>
          
          {showComparison && sortedPlans.length > 1 && (
            <div className=" items-center space-x-2 mt-3 bg-muted rounded-full p-1 hidden">
              <Button 
                variant={activeTab === 'cards' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-full text-xs h-8"
                onClick={() => setActiveTab('cards')}
              >
                Plans
              </Button>
              <Button 
                variant={activeTab === 'comparison' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-full text-xs h-8"
                onClick={() => setActiveTab('comparison')}
              >
                Compare
              </Button>
            </div>
          )}
        </DialogTitle>
      } 
      dialogClassName="sm:max-w-4xl"
    >
      <div className="py-6 overflow-y-auto max-md:max-h-[80vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm text-muted-foreground">Loading plans...</p>
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="text-center p-10">
            <h3 className="text-lg font-medium">No plans available</h3>
            <p className="text-muted-foreground mt-2">Please check back later for subscription options.</p>
          </div>
        ) : activeTab === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-1 max-sm:mb-40">
            <AnimatePresence>
              {sortedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={currentSubscription?.plan?.id === plan.id}
                  isSelected={selectedPlanId === plan.id}
                  onSelect={handleSelectPlan}
                  isPendingPaystackInit={isPendingPaystackInit}
                  isDisabled={isPendingPaystackInit} // Disable all cards during processing
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-3 text-sm font-medium text-muted-foreground w-1/3">Features</th>
                  {sortedPlans.map(plan => (
                    <th 
                      key={plan.id} 
                      className={cn(
                        "p-3 text-center",
                        currentSubscription?.plan?.id === plan.id && "bg-primary/5"
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <h3 className="font-semibold text-base">{plan.name}</h3>
                        <div className="flex items-baseline mt-1">
                          <span className="text-lg font-bold">{plan.price === 0 ? "Free" : `${formatCurrency(plan.price)}`}</span>
                          {plan.price > 0 && (
                            <span className="text-muted-foreground text-xs ml-1">/{plan.duration}</span>
                          )}
                        </div>
                        
                        {currentSubscription?.plan?.id === plan.id && (
                          <div className="mt-2 mb-1 text-xs bg-primary/10 text-primary rounded-sm py-0.5 px-2">
                            Current Plan
                          </div>
                        )}
                        
                        <Button 
                          variant={selectedPlanId === plan.id ? "default" : "outline"}
                          size="sm"
                          className="mt-2 px-4"
                          onClick={() => handleSelectPlan(plan)}
                          disabled={isPendingPaystackInit} // Disable all buttons during processing
                        >
                          {isPendingPaystackInit ? (
                            <span className="flex items-center">
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Processing...
                            </span>
                          ) : currentSubscription?.plan?.id === plan.id 
                            ? "Current" 
                            : selectedPlanId === plan.id 
                              ? "Selected" 
                              : "Select"}
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allFeatures.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="p-3 text-sm">{feature}</td>
                    {sortedPlans.map(plan => (
                      <td 
                        key={`${plan.id}-${idx}`} 
                        className={cn("p-3 text-center", 
                          currentSubscription?.plan?.id === plan.id && "bg-primary/5"
                        )}
                      >
                        {plan.features.includes(feature) ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="block w-4 h-0.5 bg-muted-foreground/30 mx-auto rounded-full" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DynamicModal>
  );
};

const PlanCard = ({ 
  plan, 
  isCurrentPlan, 
  isSelected, 
  onSelect,
  isPendingPaystackInit,
  isDisabled
}: { 
  plan: Plan, 
  isCurrentPlan: boolean, 
  isSelected: boolean, 
  onSelect: (plan: Plan) => void,
  isPendingPaystackInit: boolean,
  isDisabled: boolean
}) => {
  // Random pattern for this plan card (using different patterns for visual variety)
  const patterns = [
    // Pattern 1: Dots grid
    <svg key="dots" className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>,
    
    // Pattern 2: Diagonal lines
    <svg key="diagonals" className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="diag" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0,20 l 20,-20 M -5,5 l 10,-10 M 15,25 l 10,-10" stroke="currentColor" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#diag)" />
    </svg>,
    
    // Pattern 3: Grid
    <svg key="grid" className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  ];

  // Get consistent pattern for each plan based on plan id
  const patternIndex = plan.id.charCodeAt(0) % patterns.length;
  const pattern = patterns[patternIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl shadow-sm transition-all",
        "backdrop-blur-sm bg-card/80 border",
        isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50 hover:shadow-md",
        isCurrentPlan && "border-primary/70",
        isDisabled && "opacity-70 pointer-events-none",
        plan.label === 'premium' && "bg-gradient-to-br from-amber-50/40 to-card/95 dark:from-amber-950/30 dark:to-card/95",
        plan.label === 'pro' && "bg-gradient-to-br from-blue-50/40 to-card/95 dark:from-blue-950/30 dark:to-card/95"
      )}
      onClick={() => !isDisabled && onSelect(plan)}
    >
      {/* Decorative pattern background */}
      {pattern}
      
      {/* Decorative gradient orb */}
      <div 
        className={cn(
          "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-xl opacity-40",
          plan.label === 'premium' && "bg-amber-300/40 dark:bg-amber-700/20",
          plan.label === 'pro' && "bg-blue-300/40 dark:bg-blue-700/20",
          !plan.label && "bg-primary/30"
        )} 
        aria-hidden="true"
      />

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg shadow-sm">
            Current
          </div>
        </div>
      )}
      
      {/* Premium badge */}
      {plan.label === 'premium' && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-semibold py-1 px-2.5 rounded-full flex items-center shadow-sm">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </span>
        </div>
      )}
      
      {/* Pro badge */}
      {plan.label === 'pro' && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-semibold py-1 px-2.5 rounded-full flex items-center shadow-sm">
            <Sparkles className="h-3 w-3 mr-1" />
            Pro
          </span>
        </div>
      )}

      <div className="p-4 sm:p-6 flex-1 relative z-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{plan.name}</h3>
        
        <div className="flex items-baseline mb-4">
          <span className="text-2xl sm:text-3xl font-bold">
            {plan.price === 0 ? "Free" : `${formatCurrency(plan.price)}`}
          </span>
          {plan.price > 0 && (
            <span className="text-muted-foreground text-sm ml-1">/{plan.duration}</span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 sm:mb-5 line-clamp-2">
          {plan.description}
        </p>
        
        {/* Features */}
        <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
          {plan.features.split(',').slice(0, 4).map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{feature.trim()}</span>
            </li>
          ))}
          
          {plan.features.split(',').length > 4 && (
            <li className="text-xs text-muted-foreground pl-6">
              +{plan.features.split(',').length - 4} more features
            </li>
          )}
        </ul>
      </div>
      
      {/* Action button */}
      <div className="p-3 sm:p-4 bg-muted/40 backdrop-blur-sm border-t border-border relative z-10">
        <Button 
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          size="sm"
          disabled={isDisabled}
        >
          {isPendingPaystackInit && isSelected ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </span>
          ) : isCurrentPlan 
            ? "Current Plan" 
            : isSelected 
              ? "Selected" 
              : "Select Plan"
          }
          {!isCurrentPlan && !isPendingPaystackInit && !isDisabled && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Discount/promo info */}
      {plan.discount_info_text && (
        <div className="bg-muted/50 backdrop-blur-sm p-2 text-xs text-center font-medium border-t border-border relative z-10">
          {plan.discount_info_text}
        </div>
      )}
    </motion.div>
  );
};

export default PlanModal;