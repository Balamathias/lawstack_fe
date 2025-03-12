"use client"

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Globe, Cloud, Clock, Tablet, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const GlobeSection = () => {
  return (
    <section className='py-24 flex flex-col items-center justify-center relative overflow-hidden my-16 max-w-5xl mx-auto'>
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-400/30 to-blue-500/30 blur-3xl opacity-50" />
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-purple-400/20 blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-yellow-400/20 blur-xl" />
      </div>

      {/* Floating orbs */}
      <motion.div 
        className="absolute top-10 right-20 w-5 h-5 rounded-full bg-green-400"
        animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 left-40 w-3 h-3 rounded-full bg-blue-400"
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-blue-500/30 rounded-full blur-xl" />
          <Globe className="text-green-500 dark:text-green-400 w-16 h-16 mb-2 relative z-10 mx-auto" strokeWidth={1.5} />
          <Image 
            src={'/global/globe.png'} 
            width={600} 
            height={600} 
            alt='Globe'
            className='absolute -top-60 left-1/2 -translate-x-1/2 opacity-40 dark:opacity-20 blur-sm rotate-12'
          />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className=' dark:text-green-400 text-5xl sm:text-6xl font-bold text-center z-10 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300'
        >
          Global Reach
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='bg-white/10 dark:bg-black/20 backdrop-blur-xl p-4 rounded-2xl flex flex-col gap-y-6 border border-white/20 dark:border-white/10 shadow-[0_0_15px_rgba(0,200,100,0.15)] dark:shadow-[0_0_20px_rgba(0,255,150,0.15)] w-full max-w-2xl'
        >
          <div className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-green-400/80 to-emerald-600/80 p-3 rounded-xl text-white shadow-lg">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300'>
                Access Anywhere, Anytime
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mt-2 leading-relaxed'>
                Our platform is accessible from anywhere in the world, with a global network of servers ensuring seamless operation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div className="flex items-center gap-4 bg-white/5 dark:bg-white/5 p-4 rounded-xl border border-white/10">
              <Tablet className="text-green-500 dark:text-green-400 w-5 h-5" />
              <p className="text-sm text-gray-700 dark:text-gray-200">Access from any device securely</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 dark:bg-white/5 p-4 rounded-xl border border-white/10">
              <Clock className="text-green-500 dark:text-green-400 w-5 h-5" />
              <p className="text-sm text-gray-700 dark:text-gray-200">24/7 availability worldwide</p>
            </div>
          </div>

          <Button 
            asChild 
            size={'lg'} 
            className='mt-4 h-14 w-full sm:w-auto px-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-medium transition-all duration-300 hover:shadow-[0_5px_15px_rgba(0,200,100,0.35)] group'
          >
            <Link href={`/features`} className="flex items-center justify-center gap-2">
              Learn More About Global Access
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default GlobeSection
