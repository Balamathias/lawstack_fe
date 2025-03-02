import React from 'react'
import { LucideScale } from 'lucide-react'
import Link from 'next/link'
import { Delius } from 'next/font/google';
import { cn } from '@/lib/utils';

const delius = Delius({weight: ['400', '400'], subsets: ['latin'], variable: '--font-delius'});

const Logo = ({ isLink=true }) => {
  return (
    <Link href={'/'} className={cn('flex items-center gap-x-1.5 font-delius text-green-500 dark:text-foreground', delius.className)}>
        <LucideScale size={30} className='' />
        <h1 className='text-xl font-semibold'>LawStack</h1>
    </Link>
  )
}

export default Logo
