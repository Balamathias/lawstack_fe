import { useQuery, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from './query-keys';
import * as server from '../server/subscriptions';
import { Subscription } from '@/@types/db';

export const usePlans = () =>
  useQuery({
    queryKey: [QUERY_KEYS.get_plans],
    queryFn: server.getPlans,
  });

export const useCoupons = () =>
  useQuery({
    queryKey: [QUERY_KEYS.get_coupons],
    queryFn: server.getCoupons,
  });

export const useSubscriptions = () =>
  useQuery({
    queryKey: [QUERY_KEYS.get_subscriptions],
    queryFn: server.getSubscriptions,
  });

export const useSubscription = (id: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.get_subscription, id],
    queryFn: () => server.getSubscription(id),
    enabled: !!id,
  });

export const useCreateSubscription = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.create_subscription],
    mutationFn: (payload: Partial<Subscription>) => server.createSubscription(payload),
  });

export const usePaystackInitialize = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.paystack_initialize],
    mutationFn: (subscriptionId: string) => server.paystackInitialize(subscriptionId),
  });

export const useActivateSubscription = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.activate_subscription],
    mutationFn: (id: string) => server.activateSubscription(id),
  });

export const useCancelSubscription = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.cancel_subscription],
    mutationFn: (id: string) => server.cancelSubscription(id),
  });

export const useRenewSubscription = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.renew_subscription],
    mutationFn: (id: string) => server.renewSubscription(id),
  });

export const useStartTrial = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.start_trial],
    mutationFn: (id: string) => server.startTrial(id),
  });

export const useStartGrace = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.start_grace],
    mutationFn: (id: string) => server.startGrace(id),
  });

export const useApplyCoupon = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.apply_coupon],
    mutationFn: ({ id, coupon_code }: { id: string; coupon_code: string }) => server.applyCoupon(id, coupon_code),
  });

export const useSimulatePayment = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.simulate_payment],
    mutationFn: (id: string) => server.simulatePayment(id),
  });

export const useSubscriptionApiStatus = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.subscription_api_status],
    mutationFn: (id: string) => server.getSubscriptionApiStatus(id),
  });

export const useMySubscriptions = () =>
  useQuery({
    queryKey: [QUERY_KEYS.my_subscriptions],
    queryFn: server.getMySubscriptions,
  });
