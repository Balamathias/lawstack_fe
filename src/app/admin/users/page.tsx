import React from 'react'
import UsersOverview from '@/components/admin/users/new/users-overview'
import { getUsers, getUserStatistics } from '@/services/server/users'
import { PAGE_SIZE } from '@/lib/utils'
import UsersTable from '@/components/admin/users/new/users-table'

interface Props {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}

const Page = async ({ params, searchParams }: Props) => {

  const { data: stats } = await getUserStatistics()
  const { data: users, count } = await getUsers({ params: { ...(await searchParams), page_size: PAGE_SIZE }})

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <UsersOverview stats={stats!}  />
      <UsersTable users={users} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page
