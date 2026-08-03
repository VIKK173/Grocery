'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function NewsletterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      showToast(data.message || 'Subscribed!', data.success ? 'success' : 'error');
    } catch {
      showToast('Subscribed successfully!', 'success');
    }

    setSubscribed(true);
    setLoading(false);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative rounded-[2rem] overflow-hidden hero-gradient shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-grocery-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-grocery-yellow/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 lg:p-16">
            {/* Left */}
            <motion.div variants={itemVariants} className="flex items-center gap-6">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="flex-shrink-0 w-16 h-16 rounded-2xl bg-grocery-green/20 flex items-center justify-center"
              >
                <Mail className="w-7 h-7 text-grocery-lime" />
              </motion.div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Subscribe to our{' '}
                  <span className="text-grocery-yellow">Newsletter</span>
                </h3>
                <p className="mt-2 text-white/50 max-w-md">
                  Get the latest updates on new products, special offers, and
                  healthy eating tips delivered to your inbox.
                </p>
              </div>
            </motion.div>

            {/* Right */}
            <motion.div variants={itemVariants} className="w-full md:w-auto flex-shrink-0">
              <form onSubmit={handleSubscribe}>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1.5 border border-white/10">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 md:w-72 px-5 py-3.5 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading || subscribed}
                    className="flex items-center gap-2 px-6 py-3.5 bg-grocery-yellow text-grocery-darker font-semibold rounded-lg hover:bg-grocery-yellow-dark transition-colors shadow-lg disabled:opacity-60"
                  >
                    {subscribed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Subscribe</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
