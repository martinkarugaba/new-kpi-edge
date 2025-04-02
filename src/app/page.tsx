import { Header } from '@/features/landing/components/header';
import { HeroSection } from '@/features/landing/components/hero-section';
import { TestimonialsSection } from '@/features/landing/components/testimonials-section';
import { CTASection } from '@/features/landing/components/cta-section';
import { Footer } from '@/features/landing/components/footer';
import { ContactSection } from '@/features/landing/components/contact-section';
import { FeaturesSection } from '@/features/landing/components/features-section';
import { PricingSection } from '@/features/landing/components/pricing-section';
import { FaqSection } from '@/features/landing/components/faq-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}