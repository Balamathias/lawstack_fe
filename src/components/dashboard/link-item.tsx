'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const LinkItem = ({ link }: { link: {href: string, icon: LucideIcon, tooltip: string } }) => {
    const pathname = usePathname()

    const isActive = useMemo(() => {
        if (pathname.startsWith(link.href) && link.href !== '/dashboard') {
            return true
        }
        return pathname === link.href
    }, [pathname, link.href])

  return (
    <Link className='flex gap-3 flex-col space-y-1 py-1.5 cursor-pointer transition-all' href={link.href}>
        <div className={cn('flex items-center gap-1.5 justify-between dark:hover:text-muted-foreground p-2.5 rounded-lg', {'text-green-600/90 bg-green-600/10': isActive})}>
            <div className='flex items-center gap-1.5' role='link'>
                <link.icon size={27} className={
                    cn({'text-green-600/90': isActive})
                } />
                <span className='truncate'>{link.tooltip}</span>
            </div>
        </div>
    </Link>
  )
}

export default LinkItem