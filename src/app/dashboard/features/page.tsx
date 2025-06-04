import React from 'react';
import { Metadata } from 'next';
import { getUser } from '@/services/server/auth';
import FeaturesGrid from '@/components/dashboard/features/features-grid';

export const metadata: Metadata = {
  title: 'All Features | lawstack',
  description: 'Explore all the powerful features and tools available in lawstack for your legal education journey.'
};

interface Props {
  params: Promise<Record<string, any>>;
  searchParams: Promise<Record<string, any>>;
}

const FeaturesPage = async ({ params: _params, searchParams: _searchParams }: Props) => {
  const { data: user } = await getUser();
  const searchParams = await _searchParams;

  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 space-y-8'>
      <FeaturesGrid user={user} searchParams={searchParams} />
    </div>
  );
};

export default FeaturesPage;
