import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import * as motion from 'motion/react-client';

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-flex items-center rounded-full border border-border/40 bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now with AI-powered insights
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Track Your KPIs with{' '}
              <span className="relative">
                <span className="relative z-10 text-primary">Precision</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              The ultimate KPI tracking platform for businesses of all sizes.
              Monitor, analyze, and improve your performance metrics with our
              powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group" asChild>
                <Link href="/signup">
                  <span className="flex items-center gap-2">
                    Get Started for Free
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href="#demo">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 transition-transform group-hover:scale-110"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Watch Demo
                  </span>
                </Link>
              </Button>
            </div>
            <div className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Trusted by leading companies
              </p>
              <div className="flex flex-wrap gap-6 items-center opacity-70">
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Company A
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Company B
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Company C
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Company D
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] lg:h-[500px] rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 p-4 shadow-2xl"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm"></div>
            <div className="absolute inset-0 rounded-2xl border border-border/20"></div>
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
              <div className="text-lg font-medium text-muted-foreground">
                Dashboard Preview
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_60%,var(--sidebar-primary)_0,transparent_100%)] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0,transparent_50%)] opacity-5"></div>
      </div>
    </section>
  );
}
