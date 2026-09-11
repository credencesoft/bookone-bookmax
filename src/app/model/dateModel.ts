import { Booking } from "./booking";
import { Payment } from "./payment";
import { Room } from "./room";

export class DateModel {
  checkedin: string;
  checkout: string;

  room: Room;
  booking: Booking;
  payment: Payment;

  constructor() {}
}
