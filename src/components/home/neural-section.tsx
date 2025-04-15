'use client'

import Image from 'next/image'
import React, { useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Brain, Sparkles, ArrowRight, Lightbulb, Zap, FileText, Scale } from 'lucide-react'
import { motion, useAnimation, useInView } from 'framer-motion'

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Analysis",
    description: "Our AI analyzes legal documents and extracts key insights automatically."
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Case Precedents",
    description: "Find relevant case precedents with our intelligent search technology."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Document Generation",
    description: "Generate legal documents and contracts using AI assistance."
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Predictive Insights",
    description: "Get predictions on case outcomes based on historical data."
  }
];

const NeuralSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Set up the neural network animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Neural network canvas animation
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
    
    // Create nodes
    const nodes: {x: number; y: number; vx: number; vy: number; radius: number}[] = [];
    const nodeCount = 30;
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
    
    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.globalAlpha = 1 - distance / 100;
            ctx.stroke();
            ctx.globalAlpha = 1;
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
        
        {/* Neural network image */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <Image 
            src="/global/neural.png" 
            fill
            quality={100} 
            alt="Neural Network" 
            className="object-cover object-center"
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/50 dark:bg-emerald-900/20 backdrop-blur-sm mb-4">
              <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">AI-Powered Technology</span>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent"
          >
            Legal Intelligence
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Our advanced AI technology analyzes legal documents, identifies patterns, and provides insights that would take humans hours to discover.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left side - AI Brain visual */}
          <motion.div 
            className="lg:col-span-5 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
            }}
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-transparent to-transparent blur-2xl"
              />
              
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <Image
                  src="/global/ai-brain.png"
                  width={500}
                  height={500}
                  alt="AI Legal Intelligence"
                  className="rounded-3xl"
                />
                
                {/* Animated pulse effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 border-2 border-emerald-500/30 rounded-3xl"
                />
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-8 -right-8 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Fast Processing</h4>
                    <p className="text-xs text-gray-500">500x faster than manual review</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8 } }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">99.8% Accuracy</h4>
                    <p className="text-xs text-gray-500">Better than industry average</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right side - Features and CTA */}
          <motion.div 
            className="lg:col-span-7 order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 shadow-xl p-8 relative overflow-hidden"
            >
              {/* Background effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                AI-Powered Legal Solutions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-white/20 dark:border-white/5 hover:border-emerald-500/20 transition-all hover:shadow-lg group"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-600 dark:text-emerald-400 group-hover:shadow-inner">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                LawStack's AI is trained on millions of legal documents, cases, and precedents, providing you with accurate, contextual insights for your legal research and decision-making processes.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 border-0 text-white shadow-lg hover:shadow-emerald-500/20 group"
                >
                  <Link href="/ai-features" className="flex items-center gap-2">
                    Explore AI Features
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/demo">Watch Demo</Link>
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
