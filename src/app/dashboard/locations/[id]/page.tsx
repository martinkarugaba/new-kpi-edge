import { notFound } from "next/navigation";
import { getCountryById } from "@/features/locations/actions/countries";
import { CountryDetailClient } from "./client";

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    // Await the params promise to get the id
    const { id } = await params;

    // Pre-fetch the data for SSR
    const result = await getCountryById(id);

    if (!result.success || !result.data) {
      return notFound();
    }

    // Pass the data to the client component for hydration
    return <CountryDetailClient country={result.data} />;
  } catch (_error) {
    // If there's an error during SSR, let the client component handle it
    return <CountryDetailClient />;
  }
}
