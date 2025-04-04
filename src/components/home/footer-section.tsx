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
  Phone
} from "lucide-react";
import { toast } from "sonner";

const FooterSection: FC = () => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info(`This feature is coming soon!`);
  };

  return (
    <footer className="w-full bg-gradient-to-r from-gray-900 to-gray-950 text-white py-16 mt-20 rounded-2xl overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-blue-500"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mb-20"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -ml-48"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">LawStack</h2>
            <p className="text-gray-300 mt-4 max-w-xs">
              Transforming legal services with cutting-edge AI technology to make justice accessible for everyone.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-violet-500 transition-all duration-300">
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-violet-500 transition-all duration-300">
                <Linkedin className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-violet-500 transition-all duration-300">
                <Github className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-violet-500 transition-all duration-300">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Pricing', 'Contact'].map((item) => (
                <li key={item} className="group">
                  <Link href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                    <span className="mr-2 text-xs opacity-0 group-hover:opacity-100">
                      →
                    </span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer', 'FAQ'].map((item) => (
                <li key={item} className="group">
                  <Link href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                    <span className="mr-2 text-xs opacity-0 group-hover:opacity-100">
                      →
                    </span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-gray-800 w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bg-gradient-to-r from-violet-500 to-blue-500 p-2 rounded-md"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <p className="text-xs text-gray-400">We respect your privacy. Unsubscribe at any time.</p>
            </form>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-5 w-5 text-violet-400" strokeWidth={1.5} />
                <span>law.stack.ng@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-5 w-5 text-violet-400" strokeWidth={1.5} />
                <span>contact@lawstack.ai</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-5 w-5 text-violet-400" strokeWidth={1.5} />
                <span>+234 915 4029 724</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-5 w-5 text-violet-400" strokeWidth={1.5} />
                <span>Galuko Town, Abuja.</span>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-800 my-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} LawStack. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400">
              Designed with ♥ for innovation in legal tech
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
