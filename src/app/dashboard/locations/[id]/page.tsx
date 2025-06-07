import { notFound } from "next/navigation";
import { getCountryById } from "@/features/locations/actions/countries";
import { CountryDetailClient } from "./client";

interface Props {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CountryDetailPage({ params }: Props) {
  try {
    // Pre-fetch the data for SSR
    const result = await getCountryById(params.id);

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
