import { RoomRatePlans } from "./roomRatePlans";

export class RatesAndAvailability {
  id: number;
  roomId: number;
  roomIds: [];
  propertyId: number;
  fromDate: string;
  toDate: string;
  price: number;
  noOfRooms: number;
  available: true;
  bookingAmount: number;
  date: string;
  totalNoRooms: number;
  noOfBooked: number;
  noOfAvailable: number;
  noOfOnHold: number;
  extraPersonCharge: number;
  noOfExtraPerson: number;
  noOfPersons: number;
  planCode: string;
  roomName: string;
  propertyName: string;
  updateType: string;
  roomRatePlans: RoomRatePlans[];
  stopSellOBE:boolean;
  constructor() {
   }
}
