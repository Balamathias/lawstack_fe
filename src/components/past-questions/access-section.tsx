import React from 'react'
import Search from './search'

interface Props {
  searchParams?: Promise<Record<string, any>>
}

const AccessSection: React.FC<Props> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  return (
    <div className='flex items-center gap-x-4'>
        <Search search={resolvedSearchParams?.search} />
    </div>
  )
}

export default AccessSection