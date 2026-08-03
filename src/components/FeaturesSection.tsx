'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Truck, Leaf, Shield, Clock, Headphones, CreditCard } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'Free delivery on all orders above ₹299. Fast and reliable shipping across the city.', color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
  { icon: Leaf, title: '100% Organic', desc: 'All our products are certified organic and sourced directly from trusted farms.', color: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-400' },
  { icon: Shield, title: 'Secure Payment', desc: 'Your payments are protected with industry-standard encryption and security.', color: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet-400' },
  { icon: Clock, title: 'Fast Delivery', desc: 'Get your groceries delivered within 30 minutes. Freshness guaranteed.', color: 'from-amber-500/20 to-yellow-500/20', iconColor: 'text-amber-400' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our customer support team is always available to help you with any queries.', color: 'from-rose-500/20 to-pink-500/20', iconColor: 'text-rose-400' },
  { icon: CreditCard, title: 'Easy Returns', desc: 'Not satisfied? Get a full refund with our hassle-free return policy.', color: 'from-teal-500/20 to-emerald-500/20', iconColor: 'text-teal-400' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 md:py-28 bg-rivora-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rivora-green/10 text-rivora-green text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            We Provide <span className="text-rivora-green">Best Services</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Experience the premium difference with our curated selection of organic
            products and exceptional service.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5`}>
                  <feat.icon className={`w-6 h-6 ${feat.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
