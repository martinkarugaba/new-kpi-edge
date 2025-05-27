'use client';

/**
 * Generates district code based on country code and district name
 */
export function generateDistrictCode(
  countryCode: string,
  districtName: string
): string {
  if (!countryCode || !districtName) return '';

  // Extract any three letters from the district name (remove spaces and special characters)
  const cleanedName = districtName.replace(/[^a-zA-Z]/g, '');
  const districtPrefix = cleanedName.slice(0, 3).toUpperCase();

  return `${countryCode}-${districtPrefix}`;
}
