'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FarmSection from '@/components/FarmSection';
import ProductsSection from '@/components/ProductsSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartSidebar from '@/components/CartSidebar';
import SearchModal from '@/components/SearchModal';
import Toast from '@/components/Toast';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <FarmSection />
        <ProductsSection />
        <NewsletterSection />
      </main>
      <Footer />

      {/* Overlays */}
      <AuthModal />
      <CartSidebar />
      <SearchModal />
      <Toast />
    </div>
  );
}
