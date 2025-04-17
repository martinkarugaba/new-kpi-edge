import { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { notFound } from "next/navigation";
import { verifyResetToken } from "@/features/auth/actions/auth";

export const metadata: Metadata = {
  title: "Reset Password | KPI Tracking",
  description: "Reset your password",
};

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = params;

  // Verify the token is valid
  const isValid = await verifyResetToken(token);

  if (!isValid) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0,transparent_100%)] opacity-10" />

      {/* Content */}
      <div className="container relative mx-auto flex w-full max-w-[480px] flex-col items-center justify-center p-4">
        <div className="w-full rounded-xl border bg-card p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
