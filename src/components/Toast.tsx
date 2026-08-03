'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Toast() {
  const { toast, showToast } = useStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[200]"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200'
                : toast.type === 'error'
                ? 'bg-white border-rose-200'
                : 'bg-white border-sky-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
            <span className="text-sm font-medium text-gray-800">{toast.message}</span>
            <button onClick={() => showToast('', 'info')} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
