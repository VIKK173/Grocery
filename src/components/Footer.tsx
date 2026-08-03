'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Smartphone,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

const footerLinks = {
  'Customer Service': [
    'Help Center',
    'Returns & Refunds',
    'Shipping Info',
    'Order Tracking',
    'FAQs',
  ],
  'My Account': [
    'Sign In / Register',
    'My Orders',
    'My Wishlist',
    'My Cart',
    'Account Settings',
  ],
  'Download App': [
    'iOS App Store',
    'Google Play',
    'App Features',
    'Version History',
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer id="contact" className="bg-rivora-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Brand */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <a href="#home" className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-rivora-green flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  RIVORA<span className="text-rivora-green">FRESH</span>
                </span>
              </a>
              <p className="text-white/50 leading-relaxed max-w-sm mb-6">
                Premium organic fruits and vegetables delivered fresh to your
                doorstep. We believe in healthy living and sustainable farming
                practices.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/50">
                  <MapPin className="w-4 h-4 text-rivora-green" />
                  <span className="text-sm">123 Farm Road, Green Valley, CA 94102</span>
                </div>
                <div className="flex items-center gap-3 text-white/50">
                  <Phone className="w-4 h-4 text-rivora-green" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-white/50">
                  <Mail className="w-4 h-4 text-rivora-green" />
                  <span className="text-sm">hello@rivorafresh.com</span>
                </div>
              </div>
            </motion.div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <motion.div key={title} variants={itemVariants}>
                <h4 className="text-white font-semibold mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/50 hover:text-rivora-green transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Social & Payment */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
            <div className="flex items-center gap-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-rivora-green hover:border-rivora-green/30 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 mr-2">We accept:</span>
              {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                <div
                  key={method}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-white/30">
              &copy; {new Date().getFullYear()} RivoraFresh. All rights reserved.
              Crafted with{' '}
              <span className="text-rivora-green">care</span> for healthy living.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
