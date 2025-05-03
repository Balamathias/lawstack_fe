'use client';

import { getSubscriptions } from '@/services/server/subscriptions';
import { formatDistance, format, isPast } from 'date-fns';
import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plan, Subscription, SubscriptionStatus, User } from '@/@types/db';
import StatusBadge from './StatusBadge';
import SubscriptionCard from './SubscriptionCard';
import FeaturesList from './FeaturesList';
import EmptyState from './EmptyState';
import UpgradePrompt from './UpgradePrompt';
import { formatCurrency } from '@/lib/utils';
import PlanModal from './plan-modal';
import { StackResponse } from '@/@types/generics';
import { Button } from '@/components/ui/button';

type SubscriptionData = {
    data: Subscription[];
    status: 'loading' | 'success' | 'error';
    error?: string;
};

const SubscriptionComponent = ({ initialData, getPlans, user }: { initialData?: Subscription[],  getPlans: Promise<StackResponse<Plan[]>>, user: User | null }) => {
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
        data: initialData || [],
        status: initialData ? 'success' : 'loading',
    });
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const { data: plans, status: plansStatus } = use(getPlans)

    useEffect(() => {
        if (!initialData) {
            const fetchData = async () => {
                try {
                    const result = await getSubscriptions();
                    setSubscriptionData({ data: result.data, status: 'success' });

                    const activeSubscription = result.data.find(sub => sub.status === 'active');
                    if (activeSubscription) {
                        setSelectedSubscription(activeSubscription);
                    } else if (result.data.length > 0) {
                        setSelectedSubscription(result.data[0]);
                    }
                } catch (error) {
                    setSubscriptionData({
                        data: [],
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Failed to load subscriptions'
                    });
                }
            };

            fetchData();
        } else if (initialData.length > 0) {
            const activeSubscription = initialData.find(sub => sub.status === 'active');
            setSelectedSubscription(activeSubscription || initialData[0]);
        }
    }, [initialData]);

    const toggleCardExpand = (id: string) => {
        setExpandedCard(prevId => prevId === id ? null : id);
    };

    const handleSelectSubscription = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
    };

    const getTimeRemaining = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);

        if (isPast(end)) return 'Expired';

        const diffInDays = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays < 7) {
            return (
                <span className="timer-warning inline-flex items-center text-amber-500 font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formatDistance(end, now, { addSuffix: true })}
                </span>
            );
        }

        return formatDistance(end, now, { addSuffix: true });
    };

    if (subscriptionData.status === 'loading') {
        return (
            <div className="w-full p-8 flex justify-center items-center min-h-[300px]">
                <div className="typing-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }

    if (subscriptionData.status === 'error') {
        return (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg shadow-sm animate-fade-in">
                <h2 className="text-xl font-semibold mb-2">Unable to load subscriptions</h2>
                <p>{subscriptionData.error || 'Please try again later'}</p>
            </div>
        );
    }

    if (subscriptionData.data.length === 0) {
        return <EmptyState plans={plans} user={user}/>;
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                        Your Subscriptions
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your active subscriptions and billing information
                    </p>
                </div>
                <PlanModal
                    trigger={
                        <Button 
                            disabled={user?.is_subscribed}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all flex items-center gap-2 justify-center animate-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upgrade Plan
                        </Button>
                    }
                    plans={plans}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
                        {subscriptionData.data.map((subscription) => (
                            <SubscriptionCard
                                key={subscription.id}
                                subscription={subscription}
                                isSelected={selectedSubscription?.id === subscription.id}
                                isExpanded={expandedCard === subscription.id}
                                onSelect={() => handleSelectSubscription(subscription)}
                                onToggleExpand={() => toggleCardExpand(subscription.id)}
                                timeRemaining={getTimeRemaining(subscription.end_date)}
                            />
                        ))}
                    </div>

                    <UpgradePrompt user={user} />
                </div>

                <div className="lg:col-span-4">
                    <AnimatePresence mode="wait">
                        {selectedSubscription && (
                            <motion.div
                                key={selectedSubscription.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-card border border-border rounded-xl shadow-sm p-6 overflow-hidden relative"
                            >
                                {/* Decorative gradient blob in background */}
                                <div
                                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl bg-primary/20 animate-pulse-glow"
                                    aria-hidden="true"
                                />

                                <h2 className="text-xl font-semibold mb-1">
                                    {selectedSubscription.plan.name}
                                </h2>
                                <StatusBadge status={selectedSubscription.status} />

                                <div className="mt-4 space-y-3 relative z-10">
                                    {/* Pricing Information */}
                                    <div className="flex items-end gap-1 mb-4">
                                        <span className="text-3xl font-bold">{formatCurrency(selectedSubscription.plan.price)}</span>
                                        <span className="text-muted-foreground">/{selectedSubscription.plan.duration}</span>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Started on</span>
                                            <span className="font-medium">{format(new Date(selectedSubscription.start_date), 'PPP')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Renews on</span>
                                            <span className="font-medium">{format(new Date(selectedSubscription.end_date), 'PPP')}</span>
                                        </div>
                                        {selectedSubscription.trial_end && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Trial ends</span>
                                                <span className="font-medium">{format(new Date(selectedSubscription.trial_end), 'PPP')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Auto-renew toggle */}
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                                        <span className="font-medium">Auto-renew</span>
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                                            selectedSubscription.is_auto_renew ? 'bg-primary' : 'bg-secondary'
                                        }`}>
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                                                selectedSubscription.is_auto_renew ? 'translate-x-6' : 'translate-x-0'
                                            }`}></div>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <h3 className="text-sm font-medium mb-3">Plan features</h3>
                                        <FeaturesList features={selectedSubscription.plan.features as string} />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all text-sm">
                                            Manage Plan
                                        </button>
                                        <button className="py-2 px-4 border border-border rounded-md hover:bg-secondary transition-all text-sm">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionComponent;