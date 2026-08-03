'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Priya Sharma', role: 'Regular Customer', text: 'Grocery has completely changed how I shop for groceries. The organic produce is always fresh and delivered right to my door. Love the Alphonso mangoes!', avatar: 'photo-1494790108377-be9c29b29330', rating: 5 },
  { name: 'Rahul Verma', role: 'Health Enthusiast', text: 'The quality of vegetables is unmatched. I have been ordering weekly veggie boxes for 3 months now. The 20% savings are a great bonus!', avatar: 'photo-1507003211169-0a1dd7228f2d', rating: 5 },
  { name: 'Anita Desai', role: 'Working Mom', text: 'With a busy schedule, having fresh groceries delivered is a lifesaver. The app is so easy to use and delivery is always on time.', avatar: 'photo-1438761681033-6461ffad8d80', rating: 4 },
  { name: 'Vikram Patel', role: 'Chef', text: 'As a professional chef, I need the freshest ingredients. This service delivers restaurant-quality produce consistently. Highly recommended!', avatar: 'photo-1472099645785-5658abf4ff4e', rating: 5 },
  { name: 'Meera Reddy', role: 'Organic Lover', text: 'Finally found a reliable source for organic spices and herbs. The turmeric powder and basil are exceptional quality at fair prices.', avatar: 'photo-1544725176-7c40e128a544', rating: 5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-grocery-green/10 text-grocery-green text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            What Our <span className="text-grocery-green">Customers</span> Say
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.slice(current, current + 3).map((t) => (
              <motion.div
                key={t.name}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-grocery-light hover:bg-white hover:shadow-xl transition-all duration-500"
              >
                <Quote className="w-8 h-8 text-grocery-green/30 mb-4" />
                <p className="text-gray-600 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-grocery-yellow text-grocery-yellow' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://images.unsplash.com/${t.avatar}?w=48&h=48&fit=crop&crop=face`}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrent(Math.max(0, current - 3))}
              disabled={current === 0}
              className="w-10 h-10 rounded-full bg-grocery-light flex items-center justify-center text-gray-500 hover:text-grocery-green disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-2">
              {[0, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${current === i ? 'bg-grocery-green w-8' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrent(Math.min(testimonials.length - 3, current + 3))}
              disabled={current >= testimonials.length - 3}
              className="w-10 h-10 rounded-full bg-grocery-light flex items-center justify-center text-gray-500 hover:text-grocery-green disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
