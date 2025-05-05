"use client"

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Book, Sparkles, ArrowUpRight, ChevronRight, Scale } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

// Enhanced feature data with SVG patterns
const features = [
  {
    title: "Past Questions",
    description: "Access simplified versions of legal question papers with comprehensive explanations.",
    href: "/dashboard/past-questions",
    buttonText: "Explore",
    icon: <Book className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-emerald-400 to-green-500",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="pastQuestionsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
          </linearGradient>
          <pattern id="pastQuestionsPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="url(#pastQuestionsGradient)" />
            <circle cx="0" cy="0" r="1" fill="url(#pastQuestionsGradient)" />
            <circle cx="0" cy="40" r="1" fill="url(#pastQuestionsGradient)" />
            <circle cx="40" cy="0" r="1" fill="url(#pastQuestionsGradient)" />
            <circle cx="40" cy="40" r="1" fill="url(#pastQuestionsGradient)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pastQuestionsPattern)" />
      </svg>
    )
  },
  {
    title: "AI Legal Assistant",
    description: "Utilize our advanced AI to analyze past questions, cases, statutes, and more.",
    href: "/dashboard/chat",
    buttonText: "Try Now",
    icon: <Sparkles className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-green-400 to-teal-500",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="aiAssistantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.1" />
          </linearGradient>
          <pattern id="aiAssistantPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 10L40 30L30 50L20 30L30 10Z" fill="url(#aiAssistantGradient)" />
            <path d="M10 30L20 20L30 30L20 40L10 30Z" fill="url(#aiAssistantGradient)" />
            <path d="M50 30L60 20L70 30L60 40L50 30Z" fill="url(#aiAssistantGradient)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aiAssistantPattern)" />
      </svg>
    )
  },
  {
    title: "Case Analysis",
    description: "Get detailed, AI-powered analysis of any legal case with citations and references.",
    href: "/dashboard/cases",
    buttonText: "Analyze",
    icon: <Scale className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-teal-400 to-emerald-500",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="caseAnalysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
          </linearGradient>
          <pattern id="caseAnalysisPattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <rect x="10" y="10" width="20" height="2" fill="url(#caseAnalysisGradient)" />
            <rect x="10" y="40" width="20" height="2" fill="url(#caseAnalysisGradient)" />
            <rect x="40" y="10" width="20" height="2" fill="url(#caseAnalysisGradient)" />
            <rect x="40" y="40" width="20" height="2" fill="url(#caseAnalysisGradient)" />
            <rect x="10" y="10" width="2" height="20" fill="url(#caseAnalysisGradient)" />
            <rect x="40" y="10" width="2" height="20" fill="url(#caseAnalysisGradient)" />
            <rect x="10" y="40" width="2" height="20" fill="url(#caseAnalysisGradient)" />
            <rect x="40" y="40" width="2" height="20" fill="url(#caseAnalysisGradient)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#caseAnalysisPattern)" />
      </svg>
    )
  },
];

const HeroSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
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
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  // SVG Components for the background
  const BackgroundGlow = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-radial from-emerald-500/5 to-transparent"></div>
      
      {/* Animated orb */}
      <motion.div 
        className="absolute top-40 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400/10 to-green-500/5 blur-2xl"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* SVG pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heroPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#10B981" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroPattern)" />
      </svg>
    </div>
  );
  
  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-28">
      <BackgroundGlow />
      
      <motion.div 
        className="max-w-6xl mx-auto relative z-10 px-6"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {/* Subtle badge */}
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              AI-Powered Legal Technology
            </span>
          </motion.div>
          
          {/* Simplified heading with underline effect */}
          <motion.h1 
            className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block">Law</span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-transparent bg-clip-text">Stack</span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
          </motion.h1>
          
          {/* Cleaner, more focused description */}
            <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto my-6"
            variants={itemVariants}
            >
            The toolbox we wished we had when we started law. Study smarter, understand deeper.
            </motion.p>

          {/* Simplified stats - condensed to a single line */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-8 text-sm"
            variants={itemVariants}
          >
            <span><strong className="text-emerald-600 dark:text-emerald-400 text-2xl">30+</strong> <span className="text-gray-500">Courses</span></span>
            <span><strong className="text-emerald-600 dark:text-emerald-400 text-2xl">3000+</strong> <span className="text-gray-500">Questions</span></span>
            <span><strong className="text-emerald-600 dark:text-emerald-400 text-2xl">98%</strong> <span className="text-gray-500">Accuracy</span></span>
          </motion.div>

          {/* Focused CTA Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8" 
            variants={itemVariants}
          >
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-5 rounded-full text-base font-medium shadow-lg flex items-center gap-2 border-none"
                size="lg"
              >
                <span>Get Started Now</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </Link>
            
            <Link href="#features">
              <Button 
                variant="outline"
                className="px-5 py-5 rounded-full text-base font-medium border-emerald-500/30 hover:border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
                size="lg"
              >
                <span>See Features</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Enhanced Glassmorphic Feature Cards */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate={controls}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative"
            >
              {/* Glass card with SVG pattern background */}
              <div className="overflow-hidden relative p-6 rounded-xl border border-white/20 bg-white/40 dark:bg-black/30 backdrop-blur-lg shadow-sm h-full flex flex-col justify-between transition-all duration-300">
                {/* SVG Pattern Background */}
                {feature.pattern}
                
                {/* Glass overlay effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 dark:from-black/0 dark:to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                
                <div className="relative z-10">
                  {/* Floating icon with glass effect */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50/90 to-white/80 dark:from-emerald-900/30 dark:to-emerald-800/20 mb-4 p-3 shadow-md group-hover:shadow-emerald-500/10 transition-all duration-300 border border-emerald-100/50 dark:border-emerald-800/30">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Button with subtle hover effect */}
                <Link href={feature.href} className="mt-4 block relative z-10">
                  <Button 
                    variant="ghost"
                    className="p-0 h-auto text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-transparent group-hover:underline"
                    size="sm"
                  >
                    {feature.buttonText} 
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>
                
                {/* Gradient border effect on hover */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Simplified trusted by section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">TRUSTED BY LEGAL PROFESSIONALS</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-60">
            {['ABU LAW', 'UNILAG', 'UNI IBADAN', 'NILE Legal', 'UNILORIN'].map((org, i) => (
              <div key={i} className="text-sm font-medium text-gray-600 dark:text-gray-400">{org}</div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
