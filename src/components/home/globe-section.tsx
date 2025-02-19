import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const GlobeSection = () => {
  return (
    <section className='py-20 flex flex-col items-center justify-center gap-y-5 bg-center bg-cover bg-no-repeat mt-10 h-full w-full relative max-w-4xl mx-auto'>
        <Image src={'/global/globe.png'} width={500} height={500} alt='Globe' className='absolute' />
        <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent mb-6 text-center z-10'>
            Global Reach
        </h2>
        
        <div className='bg-secondary/70 backdrop-blur p-6 rounded-xl flex flex-col gap-y-4 justify-between'>
            <h3 className='text-2xl font-semibold'>
                Access Anywhere, Anytime
            </h3>
            <p className='text-lg text-muted-foreground'>
                Our platform is accessible from anywhere in the world, with a global network of servers. Access your data and documents securely from any device, anywhere, anytime.
            </p>

            <Button asChild size={'lg'} className='w-full sm:w-fit mt-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full'>
                <Link href={`/features`}>
                    Learn More
                </Link>
            </Button>
        </div>
    </section>
  )
}

export default GlobeSection
