import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <Container>
        <div className="relative z-10 bg-primary/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-primary/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to transform how you track performance?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of organizations using KPI Tracker to make better
              decisions with their data.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">Schedule a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0,transparent_100%)] opacity-10"></div>
    </section>
  );
}
