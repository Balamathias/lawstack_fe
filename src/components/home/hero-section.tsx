"use client"

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Book, FileText, Scale, Sparkles, ArrowUpRight, ChevronRight, BarChart } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

const features = [
  {
    title: "Past Questions",
    description: "Access simplified versions of legal question papers with comprehensive explanations.",
    href: "/dashboard/past-questions",
    buttonText: "Explore",
    icon: <Book className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-emerald-400 to-green-500",
  },
  {
    title: "AI Legal Assistant",
    description: "Utilize our advanced AI to analyze past questions, cases, statutes, and more.",
    href: "/dashboard/chat",
    buttonText: "Try Now",
    icon: <Sparkles className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-green-400 to-teal-500",
  },
  {
    title: "Case Analysis",
    description: "Get detailed, AI-powered analysis of any legal case with citations and references.",
    href: "/dashboard/cases",
    buttonText: "Analyze",
    icon: <Scale className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-teal-400 to-emerald-500",
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
        delayChildren: 0.3,
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
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.5 + i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };
  
  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-32 mb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circle gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-emerald-500/10 to-transparent"></div>
        
        {/* Animated dots grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400/20 to-green-500/10 blur-xl"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-teal-400/10 to-green-500/20 blur-xl"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <motion.div 
        className="flex flex-col gap-y-8 items-center justify-center max-w-7xl mx-auto relative z-10 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400/10 to-green-500/10 backdrop-blur-sm mb-6 border border-emerald-500/20"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              AI-Powered Legal Technology
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Law<span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 to-green-600 text-transparent bg-clip-text">Stack</span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6"
            variants={itemVariants}
          >
            Your gateway to legal excellence powered by cutting-edge AI technology.
            <span className="block mt-2">Learn Law the smart way with our comprehensive suite of tools.</span>
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-10"
            variants={itemVariants}
          >
            {[
              { value: "30+", label: "Courses" },
              { value: "3000+", label: "Questions" },
              { value: "98%", label: "Accuracy Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.2, duration: 0.5 }}
              >
                <span className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-8" 
          variants={itemVariants}
        >
          <Link href="/dashboard">
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border-none"
              size="lg"
            >
              <span>Get Started Now</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>
          
          <Link href="#features">
            <Button 
              variant="outline"
              className="px-8 py-6 rounded-full text-lg font-medium border-emerald-500/30 hover:border-emerald-500/50 text-emerald-700 dark:text-emerald-400 transition-all duration-300"
              size="lg"
            >
              <span>See Features</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 w-full max-w-6xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate={controls}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden"
            >
              <div className="p-6 rounded-2xl border border-white/20 bg-white/40 dark:bg-black/20 backdrop-blur-sm shadow-xl relative h-full flex flex-col justify-between transition-all duration-300">
                {/* Gradient overlay that appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-600/0 opacity-0 group-hover:opacity-100 group-hover:from-emerald-500/10 group-hover:to-green-600/10 transition-all duration-500 rounded-2xl"></div>
                
                <div>
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 mb-6 shadow-inner p-3 group-hover:shadow-emerald-500/10 transition-all duration-300">
                    {feature.icon}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-green-500/0 group-hover:from-emerald-400/5 group-hover:to-green-500/5 transition-all duration-500 rounded-2xl blur-2xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  whileHover={{ 
                    scale: 1.05, 
                    opacity: 1,
                    transition: { duration: 0.2 } 
                  }}
                  className="mt-8"
                >
                  <Link href={feature.href}>
                    <Button 
                      className={`rounded-full bg-gradient-to-r ${feature.color} text-white hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex items-center gap-2 border-none`}
                    >
                      {feature.buttonText}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </Link>
                </motion.div>
                
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/20 rounded-2xl transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Trusted by section */}
        <motion.div 
          className="mt-24 text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-sm text-muted-foreground mb-6">TRUSTED BY LEGAL PROFESSIONALS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-70">
            {['Harvard Law', 'Stanford Legal', 'Oxford Law', 'Yale Justice', 'Cambridge Legal'].map((org, i) => (
              <div key={i} className="text-xl font-semibold text-muted-foreground">{org}</div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
