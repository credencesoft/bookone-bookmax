
export interface CountryListInterFace {
  value: string;
  viewValue: string;
}

export class CountryList {

  countries: CountryListInterFace[] = [
    { value: 'New Zeland', viewValue: 'New Zeland' },
    { value: 'India', viewValue: 'India' },
    { value: 'Africa', viewValue: 'Africa' },
    { value: 'Austrilia', viewValue: 'Austrilia' },
    { value: 'Bangladesh', viewValue: 'Bangladesh' },
    { value: 'United Kingdom', viewValue: 'United Kingdom' },
  ];


  constructor() {
   }
}
