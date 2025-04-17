import {
  Header,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
  FaqSection,
  ContactSection,
  Footer,
} from "@/features/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 border-amber-2">
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
