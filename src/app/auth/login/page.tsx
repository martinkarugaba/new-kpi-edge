import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login | KPI Tracking',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0,transparent_100%)] opacity-10" />

      {/* Content */}
      <div className="container relative mx-auto flex w-full max-w-[480px] flex-col items-center justify-center p-4">
        <div className="w-full rounded-xl border bg-card p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
