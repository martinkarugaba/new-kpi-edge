declare module "all-the-cities" {
  export interface City {
    name: string;
    country: string;
    state?: string;
    cityId: number;
    population: number;
    loc: {
      type: string;
      coordinates: [number, number];
    };
  }

  const cities: City[];
  export default cities;
}
