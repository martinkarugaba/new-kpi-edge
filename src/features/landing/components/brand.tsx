'use client';

import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <span className="text-xl font-bold">KPI Tracker</span>
    </Link>
  );
}
