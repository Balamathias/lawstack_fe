import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const NeuralSection = () => {
  return (
    <section className='py-20 flex flex-col items-center justify-center gap-y-5 bg-center bg-cover bg-no-repeat mt-10 h-full w-full relative max-w-4xl mx-auto'>
        <Image src={'/global/neural.png'} width={333} height={333} quality={100} alt='Globe' className='absolute hidden dark:flex' />
        <h2 className='text-4xl sm:text-5xl font-bold py-3 text-center z-10 text-green-500 dark:text-foreground'>
            AI insights
        </h2>
        
        <div className='bg-green-500/60 dark:bg-secondary/70 backdrop-blur p-6 rounded-xl flex flex-col gap-y-4 justify-between'>
            <h3 className='text-2xl font-semibold'>
                Experience AI insights in Legal Research.
            </h3>
            <p className='text-lg text-black dark:text-muted-foreground'>
                Our platform is powered by Artificial Intelligence, providing you with insights into your legal research. Get the most relevant information and insights to help you make better decisions.
            </p>

            <Button asChild size={'lg'} className='mt-4 h-14 w-44 rounded-full'>
                <Link href='/ai-insights'>
                    Learn More
                </Link>
            </Button>
        </div>
    </section>
  )
}

export default NeuralSection
