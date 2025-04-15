"use client"

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Globe, Cloud, Clock, Tablet, ChevronRight, Shield, BarChart } from 'lucide-react'
import { motion } from 'framer-motion'

const GlobeSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, type: "spring", stiffness: 100 }
    }
  };

  const stats = [
    { value: "99.9%", label: "Uptime", icon: <Clock className="w-4 h-4" /> },
    { value: "128+", label: "Countries", icon: <Globe className="w-4 h-4" /> },
    { value: "Enterprise", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { value: "24/7", label: "Support", icon: <Cloud className="w-4 h-4" /> },
  ];

  return (
    <section className='py-24 relative overflow-hidden my-24'>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main globe gradient */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-emerald-500/10 to-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-40 h-40 rounded-full bg-blue-400/10 blur-[60px]"
          animate={{ 
            y: [0, -30, 0], 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-emerald-400/10 blur-[80px]"
          animate={{ 
            y: [0, 40, 0], 
            x: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Globe image with pulse effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <Image 
              src="/global/globe.png" 
              width={600} 
              height={600} 
              alt="Global Network"
              className="opacity-60 dark:opacity-30"
            />
            
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-emerald-500/30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        {/* Particles */}
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-emerald-500 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/50 dark:bg-emerald-900/20 backdrop-blur-sm">
              <Globe className="text-emerald-600 dark:text-emerald-400 w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Global Infrastructure</span>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent"
          >
            Worldwide Access
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Our platform is built on a global infrastructure, ensuring reliable access and maximum performance no matter where you are.
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-10 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/20 dark:border-white/5 shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-3">
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 border border-white/20 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Card decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Access From Anywhere, Anytime
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our platform is designed to work seamlessly across all devices and locations. With data centers strategically positioned around the world, we ensure minimal latency and maximum availability.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      icon: <Tablet className="text-emerald-500 dark:text-emerald-400 w-5 h-5" />,
                      title: "Multi-device Support",
                      description: "Use on any device securely"
                    },
                    {
                      icon: <BarChart className="text-emerald-500 dark:text-emerald-400 w-5 h-5" />,
                      title: "Real-time Analytics",
                      description: "Track usage and performance"
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-white/5"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  asChild 
                  size="lg" 
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-0 text-white font-medium shadow-lg hover:shadow-emerald-500/20 group"
                >
                  <Link href="/global-network" className="flex items-center gap-2">
                    Explore Our Network
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Image 
                    src="/global/world-map.png" 
                    width={600} 
                    height={400} 
                    alt="Global Coverage" 
                    className="rounded-lg shadow-lg"
                  />
                  
                  {/* Connection lines animation */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                    <motion.path 
                      d="M150,120 C220,80 280,200 350,150" 
                      stroke="url(#lineGradient)" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    <motion.path 
                      d="M250,220 C320,180 380,300 450,250" 
                      stroke="url(#lineGradient)" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GlobeSection
