export interface CountryData {
  code: string;
  name: string;
  wikiDataId: string;
}

export interface StateData {
  isoCode: string;
  name: string;
  wikiDataId: string;
}

export interface CityData {
  id: number;
  wikiDataId: string;
  name: string;
}

export interface APIResponse {
  data: CountryData[] | StateData[] | CityData[];
}
