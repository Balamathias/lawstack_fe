"use client"

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Book, FileText, Scale, Search, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Past Questions",
    description: "Access an extensive database of past questions and answers",
    href: "/dashboard/past-questions",
    buttonText: "Start Exploring",
    icon: <Book className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-emerald-400/20 to-green-500/20",
    hoverColor: "from-emerald-500 to-green-600",
  },
  {
    title: "Law Stack AI Agent",
    description: "Automate legal document creation and processing",
    href: "/dashboard/chat",
    buttonText: "Dive In",
    icon: <FileText className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-green-400/20 to-teal-500/20",
    hoverColor: "from-green-500 to-teal-600",
  },
  {
    title: "Case Analysis",
    description: "Streamline your case workflow and organization",
    href: "/dashboard/case-management",
    buttonText: "Jump In",
    icon: <Scale className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />,
    color: "from-teal-400/20 to-emerald-500/20",
    hoverColor: "from-teal-500 to-emerald-600",
  },
];

const HeroSection = () => {
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
    <section className="relative overflow-hidden px-4 py-20 bg-transparent rounded-2xl">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full blur-[120px] opacity-20 dark:opacity-10" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-80 h-80 bg-green-400 rounded-full blur-[120px] opacity-20 dark:opacity-10" 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.25, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />
      
      <motion.div 
        className="flex flex-col gap-y-8 items-center justify-center max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero heading */}
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Next-gen legal tech platform
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl sm:text-7xl font-bold leading-tight font-delius tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Law <span className="bg-gradient-to-br from-emerald-400 to-green-600 text-transparent bg-clip-text">Stack</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6"
            variants={itemVariants}
          >
            Your gateway to legal excellence powered by cutting-edge AI technology.
            Learn Law the smart way with our comprehensive suite of tools.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mt-4">
          <Link href="/dashboard">
            <Button 
              className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-7 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border-0"
              size="lg"
            >
              <span>Get Started</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-6xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} group-hover:${feature.hoverColor} opacity-80 transition-all duration-500 rounded-2xl`}></div>
              <div className="absolute inset-0 backdrop-blur-[2px] group-hover:backdrop-blur-[5px] transition-all duration-300"></div>
              
              <div className="p-7 rounded-2xl border border-white/20 bg-white/30 dark:bg-black/5 shadow-lg relative h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/70 dark:bg-green-800/70 backdrop-blur-sm mb-5 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-white/90 transition-colors">
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
                  className="mt-5"
                >
                  <Link href={feature.href}>
                    <Button className="rounded-full mt-2 transition-all duration-300 backdrop-blur-sm flex gap-2 items-center">
                      {feature.buttonText}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
