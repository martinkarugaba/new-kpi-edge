import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city/lib/interface";

export function getAllCountries(): ICountry[] {
  return Country.getAllCountries();
}

export function getStatesOfCountry(countryCode: string): IState[] {
  return State.getStatesOfCountry(countryCode);
}

export function getCitiesOfState(
  countryCode: string,
  stateCode: string,
): ICity[] {
  return City.getCitiesOfState(countryCode, stateCode);
}

// For Uganda specifically
export function getUgandaDistricts(): IState[] {
  return State.getStatesOfCountry("UG");
}

// Helper function to get districts (states) of any country
export function getDistricts(countryCode: string): IState[] {
  return State.getStatesOfCountry(countryCode);
}

// Helper function to get sub-counties (cities) of a district
export function getSubCounties(
  countryCode: string,
  districtCode: string,
): ICity[] {
  return City.getCitiesOfState(countryCode, districtCode);
}
