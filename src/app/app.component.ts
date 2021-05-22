import { Component, Inject } from '@angular/core';
import { AppService } from './app.service';
import { CountryData, StateData, CityData } from './app.model';
import { OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private appService: AppService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  title = 'Find nearest cities';
  countryCode;
  cityId;
  error = '';

  countries: CountryData[] = [];
  states: StateData[] = [];
  cities: CityData[] = [];
  nearestCities: CityData[] = [];

  searchForm = new FormGroup({
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    this.appService
      .getCountries()
      .subscribe(
        res =>
          (this.countries = res.data as CountryData[]).sort(this.sortCriteria),
        error => this.renderError(error.message)
      );
    document.getElementById('country').focus();
  }

  getStates(event) {
    this.countryCode = event.target.value;
    this.appService.getStatesByCountry(this.countryCode).subscribe(
      res => {
        this.states = (res.data as StateData[]).sort(this.sortCriteria);
        this.states.length == 0
          ? this.renderError(
              'Oops! No states for this country, please select a different one'
            )
          : this.renderError('');
      },
      error => this.renderError(error.message)
    );
    document.getElementById('state').focus();
  }

  getCities(event) {
    this.appService
      .getCitiesByState(this.countryCode, event.target.value)
      .subscribe(
        res => {
          this.cities = (res.data as CityData[]).sort(this.sortCriteria);
          this.cities.length == 0
            ? this.renderError(
                'Oops! No cities for this country, please select a different one'
              )
            : this.renderError('');
        },
        error => this.renderError(error.message)
      );
    document.getElementById('city').focus();
  }

  getNearestCities() {
    this.cityId = this.searchForm.get('city').value;
    this.appService.getCitiesNearCity(this.cityId).subscribe(
      res => {
        this.nearestCities = (res.data as CityData[]).sort(this.sortCriteria);
        this.nearestCities.length == 0
          ? this.renderError(
              'Oops! There are no nearest cities for the selection. Please reset the form and make different selection'
            )
          : this.renderError('');
      },
      error => this.renderError(error.message)
    );
  }

  resetSelection() {
    this.searchForm.reset;
    this.error = '';
    this.getCountries();
  }

  renderError(error) {
    this.error = error;
  }

  sortCriteria(a, b) {
    let cityName1 = a.name;
    let cityName2 = b.name;
    if (cityName1 < cityName2) {
      return -1;
    }
    if (cityName1 > cityName2) {
      return 1;
    }
    return 0;
  }
}
