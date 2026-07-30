'use client';

import Link from 'next/link';
import { useAuctions } from '@/features/auctions/hooks/useAuctions';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Lightning, ClockCountdown, Eye, ArrowRight, Compass } from '@phosphor-icons/react';

export default function LandingPage() {
  const { data, isLoading, isError } = useAuctions('active');
  const auctions = data?.data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-32 pb-28">
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-200 h-200 bg-linear-to-br from-indigo-100/50 via-orange-50/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-orange-100/40 via-indigo-50/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Next-Gen Real-Time Bidding Engine
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 font-instrument leading-tight"
            >
              Bid, Win, and Own the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-500 to-orange-500 italic pr-4">
                Extraordinary
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the thrill of the win with our high-frequency, latency-free auction platform. Discover unique items and place your bids in absolute real-time.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                href="/auctions"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl text-white bg-indigo-600 overflow-hidden shadow-lg shadow-indigo-600/20 hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-indigo-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Enter the Arena</span>
                <ArrowRight weight="bold" className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-200 text-base font-semibold rounded-xl text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Compass weight="bold" className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span>View Rules</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. LIVE AUCTIONS SECTION */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-orange-500"></div>
                <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">Happening Now</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight font-instrument">Live on the Block</h2>
            </div>
            <Link href="/auctions" className="group flex items-center gap-2 text-indigo-600 font-medium hover:text-orange-500 transition-colors">
              Explore All Listings 
              <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-100 animate-pulse shadow-sm border border-slate-100"></div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium">Failed to establish connection to the auction engine.</p>
            </div>
          ) : auctions.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-slate-400">📭</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">The floor is quiet</h3>
              <p className="text-slate-500">No active auctions at the moment. Check back soon.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {auctions.slice(0, 4).map((auction) => (
                <motion.div key={auction._id} variants={itemVariants}>
                  <Link href={`/auctions/${auction._id}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-indigo-100 transition-all duration-300">
                    
                    {/* Image Container */}
                    <div className="aspect-4/3 bg-slate-100 relative overflow-hidden">
                      {auction.image ? (
                        <Image width={500} height={500} src={auction.image} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Image</div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                    </div>
                    
                    {/* Content Container */}
                    <div className="p-6 flex flex-col grow">
                      <h3 className="font-semibold text-lg text-slate-900 line-clamp-1 mb-4 group-hover:text-indigo-600 transition-colors">{auction.title}</h3>
                      
                      <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Bid</p>
                          <p className="font-bold text-xl text-indigo-600">${auction.currentBid || auction.startBid}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time Left</p>
                          <p className="font-semibold text-sm text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded-md border border-orange-100">
                            {(() => {
                              if (!auction.startTime || !auction.duration) return 'N/A';
                              const endTime = new Date(new Date(auction.startTime).getTime() + auction.duration * 1000);
                              if (isNaN(endTime.getTime())) return 'N/A';
                              if (endTime < new Date()) return 'Ended';
                              return formatDistanceToNow(endTime);
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. PLATFORM FEATURES - REDESIGNED */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-instrument mb-4 text-slate-900">Engineered for Fairness</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Built on a deterministic real-time engine to ensure every bid is processed accurately and securely.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-linear-to-bl from-orange-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                <Lightning weight="duotone" className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Deterministic Ordering</h3>
              <p className="text-slate-600 leading-relaxed">Our backend processes concurrent bids one-by-one in a latency-independent, explainable order. No lost bids.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-linear-to-bl from-indigo-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                <ClockCountdown weight="duotone" className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Authoritative Sync</h3>
              <p className="text-slate-600 leading-relaxed">Countdown timers are managed securely on the server-side, synchronizing instantly with all clients to prevent manipulation.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-linear-to-bl from-orange-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                <Eye weight="duotone" className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Spectator Mode</h3>
              <p className="text-slate-600 leading-relaxed">Watch the heat of the auction room with live stats, chat, and timelines without modifying the core state.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight font-instrument mb-4">Three Steps to Victory</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Participating in an auction has never been simpler.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Create Profile", desc: "Register an account securely to participate in live rooms." },
              { num: "02", title: "Place Bids", desc: "Watch the countdown and outbid competitors in real-time." },
              { num: "03", title: "Checkout", desc: "Win the auction and pay securely via integrated gateways." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="relative p-10 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all duration-300"
              >
                <div className="text-5xl font-bold text-orange-500/70 mb-6 font-instrument group-hover:text-orange-500/40 transition-colors">{step.num}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}