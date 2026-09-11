import { Booking } from './booking';
import { BookingPricing } from './booking-pricing';
import { PropertyServiceDTO } from './PropertyServices';

export class BookingCommand {
  booking: Booking;
  pricing?: BookingPricing;
  selectedServices: PropertyServiceDTO[];
  sourceChannel?: string;
  pricingVerified?: boolean;

  constructor() {
    this.selectedServices = [];
  }
}