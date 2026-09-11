// import { SlotAvailability } from './SlotAvailability';
// import { SlotPricing } from './SlotPricing';

import { SlotAvailability } from "./SlotAvailability";
import { SlotPricing } from "./SlotPricing";


export class SlotTiming {

  id: number;
  duration: string;
  finishTime: string;
  startTime: string;
  notes: string;
  slotAvailabilityDto: SlotAvailability;
  slotPricingDto: SlotPricing;

  constructor()
      { }
}
