declare module 'ug-locale' {
  interface UgDistrict {
    name: string;
    region: string;
    code?: string;
    id?: string;
  }

  export const districts: UgDistrict[];
  export const regions: string[];
  export const centralRegion: string[];
  export const easternRegion: string[];
  export const northernRegion: string[];
  export const westernRegion: string[];
}
