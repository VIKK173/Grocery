'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CategorySection from '@/components/CategorySection';
import FarmSection from '@/components/FarmSection';
import ProductsSection from '@/components/ProductsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import StatsSection from '@/components/StatsSection';
import CTABanner from '@/components/CTABanner';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import CartSidebar from '@/components/CartSidebar';
import CheckoutModal from '@/components/CheckoutModal';
import SearchModal from '@/components/SearchModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import Toast from '@/components/Toast';
import HelpCenterModal from '@/components/HelpCenterModal';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CategorySection />
        <FarmSection />
        <ProductsSection />
        <TestimonialsSection />
        <StatsSection />
        <CTABanner />
        <NewsletterSection />
      </main>
      <Footer />

      {/* Overlays */}
      <AuthModal />
      <ProfileModal />
      <CartSidebar />
      <CheckoutModal />
      <SearchModal />
      <ProductDetailModal />
      <HelpCenterModal />
      <Toast />
    </div>
  );
}
