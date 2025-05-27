'use client';

/**
 * Generates subcounty code based on country code, district code and subcounty name
 */
export function generateSubcountyCode(
  countryCode: string,
  districtCode: string,
  subcountyName: string
): string {
  if (!countryCode || !districtCode || !subcountyName) return '';

  // Extract first 3 letters of subcounty name (or fewer if name is shorter)
  const subcountyPrefix = subcountyName.slice(0, 3).toUpperCase();

  return `${countryCode}-${districtCode}-${subcountyPrefix}`;
}
