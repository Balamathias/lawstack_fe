'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Brain, Sparkles, ArrowRight, Lightbulb } from 'lucide-react'

const NeuralSection = () => {
  return (
    <section className='py-20 flex flex-col items-center justify-center gap-y-10 bg-center bg-cover bg-no-repeat mt-10 h-full w-full relative max-w-5xl mx-auto px-4'>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-green-400/20 rounded-full filter blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full filter blur-3xl" />
        <Image src={'/global/neural.png'} width={500} height={500} quality={100} alt='Neural Network' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 dark:opacity-30 z-0' />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20 dark:border-white/5 mb-4">
          <Sparkles size={16} className="text-yellow-500" />
          <span className="text-sm font-medium text-black/80 dark:text-white/80">Powered by advanced AI</span>
        </div>
        
        <h2 className='text-4xl sm:text-5xl md:text-6xl font-bold text-center z-10 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent dark:from-green-400 dark:to-blue-500'>
          AI Legal Insights
        </h2>
        
        <p className="mt-4 text-center text-black/70 dark:text-white/70 max-w-2xl">
          Transform your legal research with our powerful AI technology
        </p>
      </div>

      {/* Card */}
      <div className='w-full max-w-3xl backdrop-blur-xl bg-white/40 dark:bg-black/40 rounded-2xl 
                    border border-white/30 dark:border-white/10 shadow-xl 
                    overflow-hidden transition-all hover:shadow-green-500/10 hover:border-green-500/30'>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-50 pointer-events-none" />
        
        <div className="p-8 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/20 dark:bg-green-500/10 rounded-xl">
              <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className='text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-200 bg-clip-text text-transparent'>
                Experience AI-Powered Legal Research
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/40 dark:bg-white/5 rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium">Smart Insights</h4>
                <p className="text-sm text-black/70 dark:text-white/60 mt-1">
                  Get intelligent analysis and recommendations tailored to your legal needs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/40 dark:bg-white/5 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Data-Driven Decisions</h4>
                <p className="text-sm text-black/70 dark:text-white/60 mt-1">
                  Make better legal decisions backed by our powerful AI analysis
                </p>
              </div>
            </div>
          </div>

          <p className='text-base text-black/80 dark:text-white/70 mt-6'>
            Our platform uses cutting-edge artificial intelligence to provide you with the most relevant legal insights. Save hours of research time and get the information you need to make confident decisions.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size={'lg'} className='relative group overflow-hidden bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 border-0 hover:shadow-lg hover:shadow-green-500/20'>
              <Link href='/ai-insights' className="flex items-center gap-2">
                Explore AI Features
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size={'lg'} className='backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/10 hover:border-green-500/50 hover:bg-white/20'>
              <Link href='/demo'>
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NeuralSection
