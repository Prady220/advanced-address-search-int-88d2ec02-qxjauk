import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_KEY } from './app.constants';
import { APIResponse } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseURL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
  private headers = { 'x-rapidapi-key': API_KEY };
  private options = {
    headers: new HttpHeaders(this.headers)
  };

  constructor(private httpClient: HttpClient) {}

  getCountries() {
    // GET METHOD
    const uri = '/countries';
    return this.httpClient.get<APIResponse>(this.baseURL + uri, this.options);
  }

  getStatesByCountry(countryCode: string) {
    // GET METHOD
    const uri = `/countries/${countryCode}/regions`;
    return this.httpClient.get<APIResponse>(this.baseURL + uri, this.options);
  }

  getCitiesByState(countryCode: string, stateIsoCode: string) {
    // GET METHOD
    const uri = `/countries/${countryCode}/regions/${stateIsoCode}/cities`;
    return this.httpClient.get<APIResponse>(this.baseURL + uri, this.options);
  }

  getCitiesNearCity(cityId: string) {
    // GET METHOD
    const radius = 100; // needed as param query
    const uri = `/cities/${cityId}/nearbyCities`;
    return this.httpClient.get<APIResponse>(this.baseURL + uri, this.options);
  }
}
