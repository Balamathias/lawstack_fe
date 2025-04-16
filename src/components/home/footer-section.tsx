'use client'

import Link from "next/link";
import React, { FC } from "react";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook, 
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const FooterSection: FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (email) {
        toast.success("Thank you for subscribing!", {
          description: "You'll receive our newsletter shortly.",
          icon: <CheckCircle2 className="text-green-500" />,
        });
        setEmail("");
      } else {
        toast.error("Please enter your email address");
      }
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative w-full bg-white dark:bg-gray-900 py-16 overflow-hidden mt-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
        
        {/* Blurred orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px]"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-green-500/10 blur-[100px]"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 lg:gap-x-12">
          {/* Company Info */}
          <motion.div 
            className="md:col-span-4 flex flex-col"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-6">
              LawStack
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Transforming legal services with cutting-edge AI technology to make justice accessible for everyone.
            </p>
            
            <div className="mt-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Follow us on social media</p>
              <div className="flex space-x-4">
                {[
                  { icon: <Twitter size={18} />, href: "https://twitter.com/lawstack" },
                  { icon: <Linkedin size={18} />, href: "https://linkedin.com/company/lawstack" },
                  { icon: <Github size={18} />, href: "https://github.com/lawstack" },
                  { icon: <Facebook size={18} />, href: "https://facebook.com/lawstack" }
                ].map((social, index) => (
                  <Link 
                    href={social.href} 
                    key={index}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Pricing', 'Contact'].map((item) => (
                <li key={item} className="group">
                  <Link 
                    href="#" 
                    className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer', 'FAQ'].map((item) => (
                <li key={item} className="group">
                  <Link 
                    href="#" 
                    className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="md:col-span-4" variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and insights in legal tech.
            </p>
            
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 pl-4 pr-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 text-gray-800 dark:text-gray-200"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white h-9 w-10 p-0 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 flex-wrap">
                <Mail className="h-5 w-5 text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
                <span>law.stack.ng@gmail.com, contact@lawstack.me</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Phone className="h-5 w-5 text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
                <span>+234 915 4029 724</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
                <span>Galuko Town, Abuja</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} LawStack. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
              Designed with <span className="text-red-500">♥</span> for innovation in legal tech
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default FooterSection;
