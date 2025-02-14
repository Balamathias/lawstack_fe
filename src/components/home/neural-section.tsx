import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const NeuralSection = () => {
  return (
    <section className='py-20 flex flex-col items-center justify-center gap-y-5 bg-center bg-cover bg-no-repeat mt-10 h-full w-full relative max-w-4xl mx-auto'>
        <Image src={'/global/neural.png'} width={333} height={333} quality={100} alt='Globe' className='absolute' />
        <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent mb-6 text-center z-10'>
            AI insights
        </h2>
        
        <div className='bg-secondary/70 backdrop-blur p-6 rounded-xl flex flex-col gap-y-4 justify-between'>
            <h3 className='text-2xl font-semibold text-white'>
                Experience AI insights in Legal Research.
            </h3>
            <p className='text-lg text-muted-foreground'>
                Our platform is powered by Artificial Intelligence, providing you with insights into your legal research. Get the most relevant information and insights to help you make better decisions.
            </p>

            <Button asChild size={'lg'} className='w-full sm:w-fit mt-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full'>
                <Link href='/ai-insights'>
                    Learn More
                </Link>
            </Button>
        </div>
    </section>
  )
}

export default NeuralSection
