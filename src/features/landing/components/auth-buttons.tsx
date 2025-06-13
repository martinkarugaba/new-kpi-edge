"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <>
      <Button variant="outline" asChild className="hidden sm:inline-flex">
        <Link href="/auth/login">Log In</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/register">Get Started</Link>
      </Button>
    </>
  );
}
