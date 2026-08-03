'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf, Truck, ShieldCheck, Star } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { setAuthOpen, setAuthMode } = useStore();

  return (
    <section className="py-20 md:py-28 bg-rivora-light" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] overflow-hidden hero-gradient shadow-2xl"
        >
          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rivora-lime/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-rivora-green/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-16">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rivora-lime/10 text-rivora-lime text-sm font-medium mb-5">
                <Leaf className="w-3.5 h-3.5" />
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Get <span className="text-rivora-lime">20% Off</span>
                <br />
                Your First Order
              </h2>
              <p className="mt-4 text-white/50 text-lg max-w-md">
                Join thousands of happy customers enjoying fresh organic produce
                delivered to their doorstep. Use code <span className="text-rivora-yellow font-bold">FRESH20</span> at checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(163,230,53,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                  className="px-8 py-4 bg-gradient-to-r from-rivora-lime to-rivora-green text-rivora-darker font-bold rounded-2xl shadow-xl shadow-rivora-lime/20 text-sm tracking-wide"
                >
                  Get Started Free
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:border-rivora-lime/50 hover:text-rivora-lime transition-all text-sm"
                >
                  Learn More
                </motion.button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="hidden md:flex flex-col gap-4">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: ShieldCheck, text: '100% Secure' },
                { icon: Star, text: '4.8/5 Rating' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl glass"
                >
                  <item.icon className="w-5 h-5 text-rivora-lime" />
                  <span className="text-sm font-medium text-white/80">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
