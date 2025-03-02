import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const GlobeSection = () => {
  return (
    <section className='py-20 flex flex-col items-center justify-center gap-y-5 bg-center bg-cover bg-no-repeat mt-10 h-full w-full relative max-w-4xl mx-auto'>
        <Image src={'/global/globe.png'} width={500} height={500} alt='Globe' className='absolute hidden dark:flex' />
        <h2 className='text-green-600 dark:text-foreground text-4xl sm:text-5xl font-bold py-3 text-center z-10'>
            Global Reach
        </h2>
        
        <div className='bg-green-500/60 dark:bg-secondary/70 backdrop-blur p-6 rounded-xl flex flex-col gap-y-4 justify-between'>
            <h3 className='text-2xl font-semibold'>
                Access Anywhere, Anytime
            </h3>
            <p className='text-lg text-black dark:text-muted-foreground'>
                Our platform is accessible from anywhere in the world, with a global network of servers. Access your data and documents securely from any device, anywhere, anytime.
            </p>

            <Button asChild size={'lg'} className='mt-4 h-14 w-44 rounded-full'>
                <Link href={`/features`}>
                    Learn More
                </Link>
            </Button>
        </div>
    </section>
  )
}

export default GlobeSection
