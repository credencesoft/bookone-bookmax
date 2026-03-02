import { SlotAvailability } from "./SlotAvailability";
import { SlotPricing } from "./SlotPricing";

export class BusinessServiceType {

  id: number;
  effectiveDate : string;
  expiryDate : string;
  name : string;
  description: string;
  capacityPerSlot :number;

  serviceTags : string;

  businessTermLocation : string;
  businessTermResource : string;

  businessLocationName : string;
  customerLocationName : string;
  canChangeBusinessAddress : boolean;


  slotAvailabilityDto : SlotAvailability;
  slotPricingDto : SlotPricing;
  startDate : string;
  endDate : string;
  durationInMinutes : number;
  bookable : boolean;

  //
  isSelected : boolean = false;

  constructor()
      { }
}
