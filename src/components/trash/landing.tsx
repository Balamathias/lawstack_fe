"use client";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    { title: "Document Automation", description: "Generate and process legal documents with AI" },
    { title: "Smart Contracts", description: "Automated contract analysis and management" },
    { title: "Case Management", description: "Organize and track cases efficiently" },
    { title: "Legal Research", description: "AI-powered legal research assistant" },
    { title: "Client Portal", description: "Secure client communication platform" },
    { title: "Compliance Tools", description: "Automated compliance checking and updates" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="space-y-6 py-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            The Future of Legal Tech
          </motion.h1>
          <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto">
            Transform your legal practice with AI-powered tools and automation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Base glass effect */}
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[8px] rounded-xl" />
              
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
              
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10" />
              
              {/* Content container */}
              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
