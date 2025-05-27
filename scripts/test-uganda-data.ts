import { Country, State, City } from 'country-state-city';

// Get Uganda's data
const uganda = Country.getCountryByCode('UG');
console.log('Uganda data:', uganda);

// Get all states (districts) in Uganda
const states = State.getStatesOfCountry('UG');
console.log('\nNumber of districts:', states.length);
console.log('First few districts:', states.slice(0, 3));

// Get cities for a few districts
for (const state of states.slice(0, 3)) {
  const cities = City.getCitiesOfState('UG', state.isoCode);
  console.log(`\nCities in ${state.name}:`, cities.length);
  console.log('First few cities:', cities.slice(0, 3));
}
