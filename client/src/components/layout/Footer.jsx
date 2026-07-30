'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-12 lg:col-span-5">
            <Link href="/" className="inline-block text-3xl font-instrument font-bold text-slate-900 tracking-tight hover:opacity-80 transition-opacity">
              BidArena
            </Link>
            <p className="mt-4 text-slate-500 leading-relaxed max-w-sm">
              The premier destination for live online auctions. Discover rare items, bid in real-time, and win the extraordinary.
            </p>
            
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Subscribe to our newsletter</h4>
              <form className="flex max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full min-w-0 px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-5">
                Explore
              </h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li>
                  <Link href="/auctions" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    All Auctions
                  </Link>
                </li>
                <li>
                  <Link href="/live" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    Live Bidding
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    Start Selling
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-5">
                Support
              </h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li>
                  <Link href="/how-it-works" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-5">
                Legal
              </h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li>
                  <Link href="/terms" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/auction-rules" className="hover:text-indigo-600 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                    Auction Rules
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} BidArena Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            {/* Social Icons */}
            <a href="#" className="text-slate-400 hover:text-indigo-600 hover:-translate-y-1 transition-all duration-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 hover:-translate-y-1 transition-all duration-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
