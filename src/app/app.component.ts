import { Component, Inject } from '@angular/core';
import { AppService } from './app.service';
import { CountryData, StateData, CityData } from './app.model';
import { OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { observable, Observable, of, Subject } from 'rxjs';

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
    country: new FormControl(null, Validators.required),
    state: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required)
  });

  //For subject vs observable example
  obsSub1; 
  obsSub2;
  subjectSub1;
  subjectSub2;

  ngOnInit() {
    this.getCountries();
    this.subVsObs();
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
        if (this.states.length === 0) {
          this.renderError(
            'Oops! No states for this country, please select a different one'
          );
          this.cities = [];
          this.searchForm.controls['state'].reset();
          this.searchForm.controls['city'].reset();
        } else {
          this.renderError('');
          document.getElementById('state').focus();
        }
      },
      error => this.renderError(error.message)
    );
  }

  getCities(event) {
    this.appService
      .getCitiesByState(this.countryCode, event.target.value)
      .subscribe(
        res => {
          this.cities = (res.data as CityData[]).sort(this.sortCriteria);
          if (this.cities.length === 0) {
            this.renderError(
              'Oops! No cities for this state, please select a different one'
            );
          } else {
            this.renderError('');
            document.getElementById('city').focus();
          }
        },
        error => this.renderError(error.message)
      );
    
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
    this.searchForm.reset();
    this.error = '';
    this.countries = [];
    this.states = [];
    this.cities = [];
    this.nearestCities = [];
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

  //Example for the difference between observable and subject that we discussed in the interview
  subVsObs() {
    let observable = Observable.create(obs => obs.next(Math.random()));
    //If of() is used instead of create() then the behavior is similar to Subject (Interview Scenario)
    observable.subscribe(v => this.obsSub1 = v);
    observable.subscribe(v => this.obsSub2 = v);

    let subject = new Subject();
    subject.subscribe(v => this.subjectSub1 = v);
    subject.subscribe(v => this.subjectSub2 = v);
    subject.next(Math.random());
  }
}
