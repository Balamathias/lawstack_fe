"use client"

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Globe, Cloud, Clock, Tablet, ChevronRight, Shield, BarChart, ArrowRight, Zap, Users, Wifi } from 'lucide-react'
import { motion, useAnimation, useInView } from 'framer-motion'

const GlobeSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

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
    { 
      value: "99.9%", 
      label: "Uptime", 
      icon: <Clock className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    { 
      value: "30+", 
      label: "Courses", 
      icon: <Tablet className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30"
    },
    { 
      value: "3000+", 
      label: "Questions", 
      icon: <BarChart className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
    { 
      value: "24/7", 
      label: "Support", 
      icon: <Cloud className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/30"
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized global CDN ensures instant access to all content worldwide.",
      metric: "< 100ms latency"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and security protocols protect your data.",
      metric: "SOC2 Compliant"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Learning",
      description: "Connect with peers and mentors across different time zones.",
      metric: "Global Community"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Offline Capability",
      description: "Download content for offline access when connectivity is limited.",
      metric: "Always Available"
    }
  ];

  return (
    <section ref={ref} className='py-24 sm:py-32 relative overflow-hidden my-20'>
      {/* Enhanced Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main globe gradient with improved styling */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-gradient-radial from-emerald-500/8 via-blue-500/4 to-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } }
          }}
        />
        
        {/* Enhanced animated orbs */}
        <motion.div 
          className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-gradient-to-br from-emerald-400/10 via-blue-400/5 to-transparent blur-[80px]"
          animate={{ 
            y: [0, -40, 0], 
            x: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/8 via-purple-400/4 to-transparent blur-[100px]"
          animate={{ 
            y: [0, 50, 0], 
            x: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Premium grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="globeGridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="2" fill="#10B981" />
              <circle cx="20" cy="20" r="1" fill="#3B82F6" />
              <circle cx="60" cy="20" r="1" fill="#8B5CF6" />
              <circle cx="20" cy="60" r="1" fill="#F59E0B" />
              <circle cx="60" cy="60" r="1" fill="#EF4444" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#globeGridPattern)" />
        </svg>
        
        {/* Enhanced floating particles */}
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-1 h-1 rounded-full ${
              index % 4 === 0 ? 'bg-emerald-400' : 
              index % 4 === 1 ? 'bg-blue-400' :
              index % 4 === 2 ? 'bg-purple-400' : 'bg-orange-400'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 60 - 30],
              x: [0, Math.random() * 60 - 30],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50/80 to-blue-50/80 dark:from-emerald-900/30 dark:to-blue-900/30 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-800/30 mb-6 shadow-lg">
              <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-700 to-blue-700 dark:from-emerald-300 dark:to-blue-300 bg-clip-text text-transparent">
                Global Infrastructure
              </span>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold mb-8 relative"
          >
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Worldwide
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Accessibility
            </span>
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Experience seamless legal education powered by our <span className="font-semibold text-emerald-600 dark:text-emerald-400">global infrastructure</span>. 
            Access your content from anywhere in the world with <span className="font-semibold text-blue-600 dark:text-blue-400">enterprise-grade reliability</span> and lightning-fast performance.
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500"
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Floating orb effect */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`p-4 rounded-2xl ${stat.bgColor} mb-4 w-fit mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
              
              {/* Gradient border effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-3xl"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left side - Enhanced Globe visualization */}
          <motion.div 
            className="lg:col-span-7 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
            }}
          >
            <div className="relative">
              {/* Main globe container with enhanced styling */}
              <motion.div
                className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Globe image with enhanced effects */}
                <motion.div
                  className="relative mx-auto"
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={controls}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      rotateY: 0,
                      transition: { duration: 1.2, delay: 0.3 } 
                    }
                  }}
                >
                  <div className="relative w-96 h-96 mx-auto">
                    <Image 
                      src="/global/globe.png" 
                      width={400} 
                      height={400} 
                      alt="Global Network"
                      className="opacity-80 dark:opacity-60 drop-shadow-2xl"
                    />
                    
                    {/* Enhanced pulse rings */}
                    {[1, 2, 3].map((ring, index) => (
                      <motion.div 
                        key={ring}
                        className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                        animate={{ 
                          scale: [1, 1.2 + (index * 0.1), 1],
                          opacity: [0.8, 0.2, 0.8]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: index * 0.8
                        }}
                      />
                    ))}
                    
                    {/* Connection points */}
                    {Array.from({ length: 6 }).map((_, index) => {
                      const angle = (index * 60) * (Math.PI / 180);
                      const radius = 140 + (index % 2) * 20;
                      const x = Math.cos(angle) * radius + 200;
                      const y = Math.sin(angle) * radius + 200;
                      
                      return (
                        <motion.div
                          key={index}
                          className="absolute w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full shadow-lg"
                          style={{ 
                            left: x - 6, 
                            top: y - 6,
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.div>

                {/* Network activity simulation */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Global Network Status</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">All Systems Operational</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { region: "Americas", latency: "45ms", status: "optimal" },
                      { region: "Europe", latency: "52ms", status: "optimal" },
                      { region: "Asia Pacific", latency: "38ms", status: "optimal" }
                    ].map((region, index) => (
                      <div key={index} className="p-3 rounded-xl bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200/30 dark:border-emerald-800/20">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{region.region}</div>
                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{region.latency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Enhanced floating stats */}
              <motion.div
                className="absolute -top-8 -right-8 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Performance</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Lightning Fast</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8 } }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Security</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Enterprise Grade</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Enhanced Features */}
          <motion.div 
            className="lg:col-span-5 order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Built for Global Scale
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                  Our infrastructure spans multiple continents, ensuring optimal performance and reliability 
                  for legal professionals worldwide, no matter where they are located.
                </p>
              </div>

              {/* Enhanced features grid */}
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-900/30 border border-white/20 dark:border-white/5 hover:border-emerald-200/30 dark:hover:border-emerald-800/20 backdrop-blur-xl hover:shadow-xl transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-600 dark:text-emerald-400 group-hover:from-emerald-100 dark:group-hover:from-emerald-900/50 transition-all">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">{feature.description}</p>
                        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{feature.metric}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Button 
                  asChild 
                  size="lg"
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 border-0 text-white shadow-2xl hover:shadow-emerald-500/25 group px-8 py-3 font-semibold"
                >
                  <Link href="/global-network" className="flex items-center gap-2">
                    Explore Network
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 font-semibold"
                >
                  <Link href="/status">
                    System Status
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default GlobeSection
