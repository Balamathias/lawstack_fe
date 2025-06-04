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
  // Enhanced SVG Components for premium background effects
  const BackgroundGlow = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full bg-gradient-radial from-emerald-500/8 via-emerald-400/4 to-transparent"></div>
      
      {/* Animated floating orbs */}
      <motion.div 
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400/10 via-green-400/5 to-transparent blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/8 via-emerald-500/4 to-transparent blur-2xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Premium grid pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="premiumHeroPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="#10B981" />
            <circle cx="15" cy="15" r="0.5" fill="#10B981" />
            <circle cx="45" cy="15" r="0.5" fill="#10B981" />
            <circle cx="15" cy="45" r="0.5" fill="#10B981" />
            <circle cx="45" cy="45" r="0.5" fill="#10B981" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#premiumHeroPattern)" />
      </svg>
      
      {/* Subtle line connections */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M0,100 Q300,50 600,100 T1200,100" stroke="url(#connectionGradient)" strokeWidth="1" fill="none" />
        <path d="M0,200 Q400,150 800,200 T1600,200" stroke="url(#connectionGradient)" strokeWidth="0.5" fill="none" />
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
            {/* Enhanced heading with sophisticated typography */}
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent font-black">
              Law
            </span>
            <span className="relative inline-block ml-2">
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 text-transparent bg-clip-text font-black">
                Stack
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-500/30"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              />
              {/* Floating accent */}
              <motion.div
                className="absolute -top-4 -right-8 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.h1>
            {/* Enhanced description with better typography */}
            <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto my-8 leading-relaxed font-medium"
            variants={itemVariants}
            >
            The revolutionary platform that transforms legal education with{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">
              AI-powered intelligence
            </span>
            {" "}and comprehensive resources.
            </motion.p>

          {/* Simplified stats - condensed to a single line */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-8 text-sm"
            variants={itemVariants}
          >
            <span><strong className="text-emerald-600 dark:text-emerald-400 text-2xl">30+</strong> <span className="text-gray-500">Courses</span></span>
            <span><strong className="text-emerald-600 dark:text-emerald-400 text-2xl">3000+</strong> <span className="text-gray-500">Questions</span></span>
            <span><strong className="text-emerald-600 dark:text-emerald-400 text-2xl">98%</strong> <span className="text-gray-500">Accuracy</span></span>
          </motion.div>          {/* Enhanced CTA Buttons with sophisticated styling */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-10" 
            variants={itemVariants}
          >
            <Link href="/dashboard">
              <Button 
                className="group relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-2xl shadow-emerald-500/25 hover:shadow-3xl hover:shadow-emerald-500/40 border-none overflow-hidden transition-all duration-300 hover:scale-105"
                size="lg"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Journey
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/30 to-green-400/30 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            
            <Link href="/features">
              <Button 
                variant="outline"
                className="group relative px-8 py-6 rounded-2xl text-lg font-semibold border-2 border-gray-300/60 dark:border-gray-700/60 hover:border-emerald-500/50 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 backdrop-blur-xl bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Features
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>        {/* Enhanced Glassmorphic Feature Cards with premium styling */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate={controls}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Enhanced glass card with premium borders and effects */}
              <div className="overflow-hidden relative p-8 rounded-3xl border border-white/30 dark:border-gray-800/30 bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-2xl hover:shadow-3xl h-full flex flex-col justify-between transition-all duration-500 hover:border-emerald-500/30">
                {/* Enhanced SVG Pattern Background */}
                <div className="absolute inset-0 opacity-30">
                  {feature.pattern}
                </div>
                
                {/* Premium glass overlay effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-white/5 to-green-500/5 dark:from-emerald-400/5 dark:via-gray-900/5 dark:to-green-400/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl"></div>
                
                {/* Floating orb effect */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Enhanced floating icon with premium glass effect */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white/80 to-emerald-100/90 dark:from-emerald-900/40 dark:via-emerald-800/30 dark:to-emerald-900/40 mb-6 p-4 shadow-xl shadow-emerald-500/10 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 transition-all duration-500 border border-emerald-200/50 dark:border-emerald-700/30 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Enhanced button with premium styling */}
                <Link href={feature.href} className="mt-6 block relative z-10">
                  <Button 
                    variant="ghost"
                    className="group/btn w-full p-0 h-auto text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 rounded-xl py-3 px-4 border border-emerald-200/50 dark:border-emerald-700/30 hover:border-emerald-300/70 dark:hover:border-emerald-600/50 transition-all duration-300"
                    size="sm"
                  >
                    <span className="flex items-center justify-center gap-2 font-semibold">
                      {feature.buttonText} 
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </span>
                  </Button>
                </Link>
                
                {/* Enhanced gradient border effect */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-b-3xl"></div>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
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
