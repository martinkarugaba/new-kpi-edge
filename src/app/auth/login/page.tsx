import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login | KPI Tracking",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="from-background to-muted/50 relative flex min-h-screen items-center justify-center bg-gradient-to-br">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0,transparent_100%)] opacity-10" />

      {/* Content */}
      <div className="relative container mx-auto flex w-full max-w-[480px] flex-col items-center justify-center p-4">
        <div className="bg-card w-full rounded-xl border p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
          <p className="text-muted-foreground mt-6 text-center text-sm">
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
