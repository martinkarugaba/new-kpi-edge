import { atom } from 'jotai';
import type { ICity, ICountry, IState } from 'country-state-city';

// Types for location selection
export interface LocationSelection {
  countryCode: string;
  countryName: string;
  districts: {
    districtCode: string;
    districtName: string;
    subCounties: string[];
  }[];
}

export const countriesAtom = atom<ICountry[]>([]);
export const districtsAtom = atom<IState[]>([]);
export const subCountiesAtom = atom<ICity[]>([]);

// Current selection atoms with proper types
export const currentCountryAtom = atom<{ code: string; name: string } | null>(
  null
);
export const currentDistrictAtom = atom<{ code: string; name: string } | null>(
  null
);
export const districtSubCountiesAtom = atom<Record<string, string[]>>({});
export const selectedLocationsAtom = atom<LocationSelection[]>([]);
export const currentSubCountiesAtom = atom<string[]>([]);
