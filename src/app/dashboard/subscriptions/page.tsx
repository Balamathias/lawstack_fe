import SubscriptionComponent from '@/components/dashboard/subscriptions/subscription.component'
import Loader from '@/components/loader'
import { getUser } from '@/services/server/auth'
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
  const { data: user } = await getUser()

  console.log("USER: ", user)

  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 space-y-8'>
        <Suspense fallback={<Loader variant='dots' />}>
            <SubscriptionComponent initialData={subs} getPlans={getPlans()} user={user}/>
        </Suspense>
    </div>
  )
}

export default Page