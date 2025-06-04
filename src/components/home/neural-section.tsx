'use client'

import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Brain, Sparkles, ArrowRight, Scale, FileSearch, Shield, Gavel, BookOpen, TrendingUp } from 'lucide-react'
import { motion, useAnimation, useInView } from 'framer-motion'

const legalFeatures = [
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Legal Precedent Analysis",
    description: "AI-powered analysis of case law and precedents to strengthen your legal arguments and research.",
    metric: "95% accuracy"
  },
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: "Contract Intelligence",
    description: "Automated contract review, risk assessment, and clause optimization for better legal outcomes.",
    metric: "80% faster review"
  },
  {
    icon: <Gavel className="w-6 h-6" />,
    title: "Case Outcome Prediction",
    description: "Predictive analytics for case outcomes based on historical data and legal patterns.",
    metric: "92% prediction rate"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Compliance Monitoring",
    description: "Real-time monitoring of regulatory changes and compliance requirements across jurisdictions.",
    metric: "24/7 monitoring"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Legal Research Assistant",
    description: "Advanced legal research with AI-curated results from millions of legal documents and cases.",
    metric: "10x faster research"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Legal Analytics",
    description: "Comprehensive analytics on legal trends, judge patterns, and case success rates.",
    metric: "Deep insights"
  },
];

const NeuralSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Set up the legal network animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % legalFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced legal network canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create legal network nodes (representing legal documents, cases, etc.)
    const nodes: {x: number; y: number; vx: number; vy: number; radius: number; type: string; pulse: number}[] = [];
    const nodeCount = 25;
    const nodeTypes = ['case', 'statute', 'precedent', 'contract'];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 3 + 2,
        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }
    
    let time = 0;
    
    // Animation
    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions
      nodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.05;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node based on type
        const pulseIntensity = (Math.sin(node.pulse) + 1) * 0.5;
        const baseOpacity = 0.4 + pulseIntensity * 0.3;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        // Different colors for different legal document types
        switch (node.type) {
          case 'case':
            ctx.fillStyle = `rgba(16, 185, 129, ${baseOpacity})`;
            break;
          case 'statute':
            ctx.fillStyle = `rgba(59, 130, 246, ${baseOpacity})`;
            break;
          case 'precedent':
            ctx.fillStyle = `rgba(147, 51, 234, ${baseOpacity})`;
            break;
          case 'contract':
            ctx.fillStyle = `rgba(245, 158, 11, ${baseOpacity})`;
            break;
        }
        
        ctx.fill();
        
        // Add glow effect for active connections
        if (index === Math.floor(time * 2) % nodes.length) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = ctx.fillStyle as any;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      
      // Draw intelligent connections (representing legal relationships)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.3;
            
            // Different connection styles for different relationships
            if (nodes[i].type === nodes[j].type) {
              ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
              ctx.setLineDash([]);
            } else {
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.7})`;
              ctx.setLineDash([3, 3]);
            }
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, type: "spring", stiffness: 100 }
    },
  };

  return (
    <section ref={ref} className='py-24 sm:py-32 relative overflow-hidden my-20'>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Neural network canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full opacity-40" 
        />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
        
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50/80 to-blue-50/80 dark:from-emerald-900/30 dark:to-blue-900/30 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-800/30 mb-6 shadow-lg">
              <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-700 to-blue-700 dark:from-emerald-300 dark:to-blue-300 bg-clip-text text-transparent">
                Advanced Legal AI
              </span>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold mb-8 relative"
          >
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Legal Intelligence
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Reimagined
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
            Experience the future of legal practice with our cutting-edge AI platform. From case analysis to contract intelligence, 
            LawStack transforms how legal professionals work with <span className="font-semibold text-emerald-600 dark:text-emerald-400">unprecedented accuracy</span> and 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> lightning-fast insights</span>.
          </motion.p>
        </motion.div>        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left side - Enhanced Legal AI visualization */}
          <motion.div 
            className="lg:col-span-7 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
            }}
          >
            <div className="relative">
              {/* Premium legal AI interface mockup */}
              <motion.div
                className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm font-mono text-gray-500 dark:text-gray-400">LawStack AI Engine</div>
                </div>

                {/* Active feature showcase */}
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-xl">
                      {legalFeatures[activeFeature].icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{legalFeatures[activeFeature].title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{legalFeatures[activeFeature].description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{legalFeatures[activeFeature].metric}</div>
                    </div>
                  </div>

                  {/* Simulated legal document analysis */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Analysis Progress</span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">Processing...</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                    </div>
                    
                    {/* Sample insights */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {[
                        { label: "Risk Score", value: "Low", color: "green" },
                        { label: "Compliance", value: "98%", color: "blue" },
                        { label: "Precedents", value: "12 Found", color: "purple" },
                        { label: "Review Time", value: "2.3 min", color: "orange" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-white/10"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                          <div className={`font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Feature indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {legalFeatures.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === activeFeature ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating legal stats */}
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
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Legal Accuracy</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">99.7% Success Rate</p>
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
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Time Saved</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Average 15hrs/week</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
            {/* Right side - Enhanced Features Grid */}
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
                  Transforming Legal Practice
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                  Our AI platform is specifically designed for legal professionals, trained on millions of legal documents, 
                  cases, and precedents to provide unparalleled accuracy and insights.
                </p>
              </div>

              {/* Enhanced features grid */}
              <div className="grid grid-cols-1 gap-4">
                {legalFeatures.slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      index === activeFeature % 4 
                        ? 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 border-emerald-200/50 dark:border-emerald-800/30 shadow-lg' 
                        : 'bg-white/50 dark:bg-gray-900/30 border-white/20 dark:border-white/5 hover:border-emerald-200/30 dark:hover:border-emerald-800/20'
                    } backdrop-blur-xl hover:shadow-xl`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onHoverStart={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl transition-all ${
                        index === activeFeature % 4
                          ? 'bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-600 dark:text-emerald-400 group-hover:from-emerald-100 dark:group-hover:from-emerald-900/50'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                            {feature.metric}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Button 
                  asChild 
                  size="lg"
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 border-0 text-white shadow-2xl hover:shadow-emerald-500/25 group px-8 py-3 font-semibold"
                >
                  <Link href="/ai-features" className="flex items-center gap-2">
                    Explore Legal AI
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 font-semibold"
                >
                  <Link href="/demo">Schedule Demo</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default NeuralSection
