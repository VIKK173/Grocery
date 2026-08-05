'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, FileText, MessageCircle, PhoneCall, HelpCircle } from 'lucide-react';
import { useStore } from '@/lib/store';

const faqs = [
  { question: "How do I track my order?", answer: "You can track your order in the 'My Orders' section of your account or by clicking the tracking link in your email." },
  { question: "What is your return policy?", answer: "We offer a 100% satisfaction guarantee. If you're unhappy with an item, you can return it within 7 days for a full refund." },
  { question: "Do you deliver to my area?", answer: "We deliver to most major cities. Please enter your zip code at checkout to confirm delivery availability." },
  { question: "How can I change my delivery time?", answer: "You can update your delivery slot from 'My Orders' up to 4 hours before the scheduled delivery window." },
];

export default function HelpCenterModal() {
  const { isHelpCenterOpen, setHelpCenterOpen } = useStore();

  return (
    <AnimatePresence>
      {isHelpCenterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelpCenterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-grocery-dark p-6 text-white relative">
              <button
                onClick={() => setHelpCenterOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-grocery-yellow flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-grocery-darker" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Help Center</h2>
                  <p className="text-sm text-white/70">How can we help you today?</p>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 outline-none focus:border-grocery-yellow/50 transition-colors"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <h3 className="text-lg font-bold text-grocery-darker mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-grocery-green/30 hover:shadow-sm transition-all">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-grocery-green shrink-0 mt-0.5" />
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-500 pl-6">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-grocery-darker mt-8 mb-4">Contact Us</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-grocery-green/50 hover:bg-grocery-green/5 transition-colors group text-left">
                  <div className="w-10 h-10 rounded-full bg-grocery-green/10 flex items-center justify-center group-hover:bg-grocery-green group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5 text-grocery-green group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Live Chat</p>
                    <p className="text-xs text-gray-500">Usually replies in 5m</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-grocery-green/50 hover:bg-grocery-green/5 transition-colors group text-left">
                  <div className="w-10 h-10 rounded-full bg-grocery-green/10 flex items-center justify-center group-hover:bg-grocery-green group-hover:text-white transition-colors">
                    <PhoneCall className="w-5 h-5 text-grocery-green group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Call Us</p>
                    <p className="text-xs text-gray-500">1-800-GROCERY</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
