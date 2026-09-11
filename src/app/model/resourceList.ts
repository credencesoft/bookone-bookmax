// import { SlotTiming } from 'src/app/model/SlotTiming';
// import { LocationList } from './locationList';

import { SlotTiming } from "./SlotTiming";
import { LocationList } from "./locationList";

export class ResourceList {

  name: string;
  desc: string;
  imageUrl: string;
  availableTimings: SlotTiming[];
  bookedTimings: SlotTiming[];
  locationList: LocationList[];

  constructor()
      { }
}
