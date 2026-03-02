import { Country } from './country';
import { Suburb } from './suburbDto';
import { State } from './state';


export class City {

  id: number;
  name: string;
  code: string;
  description: string;
  iconUrl: string;
  imageUrl: string;
  latitude: string;
  longitude: string;
  stateOrRegionName: string;
  stateId: number;
  stateDto: State;
  countryName: string;
  suburbs: Suburb[];

  countryDto: Country;
  constructor()
  { }
}
