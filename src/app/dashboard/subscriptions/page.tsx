import PlanModal from '@/components/dashboard/subscriptions/plan-modal'
import SubscriptionComponent from '@/components/dashboard/subscriptions/subscription.component'
import Loader from '@/components/loader'
import { getPlans, getSubscriptions } from '@/services/server/subscriptions'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Subscriptions | Law Stack',
  description: 'Manage your subscriptions and billing information'
}

interface Props {
    params: Promise<Record<string, any>>,
    searchParams: Promise<Record<string, any>>,
}

const Page: React.FC<Props> = async ({ params, searchParams }) => {
    const { data: subs } = await getSubscriptions()
    const { data: plans } = await getPlans()
  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 space-y-8'>
        <Suspense fallback={<Loader variant='dots' />}>
            <SubscriptionComponent initialData={subs} />
        </Suspense>

        <PlanModal
            trigger={<button className='btn btn-primary'>Select a Plan</button>}
            plans={plans}
        />
    </div>
  )
}

export default Page