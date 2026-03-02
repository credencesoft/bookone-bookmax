import { RoomDetail } from "./RoomDetail";



export class externalReservationDtoList {
  amountBeforeTax: Number;
  bookingStatus: string;
  bookoneReservationId: string;
  channelId: string;
  checkinDate: string;
  checkoutDate: string;
  contactNumber: string;
  createdBy: string;
  createdDate: string;
  createdTimestamp: string;
  currency: string;
  email: string;
  externalTransactionId: string;
  firstName: string;
  id: Number;
  lastModifiedBy: string;
  lastModifiedDate:string;
  lastName: string;
  modeOfPayment: string;
  noOfPerson: string;
  notes: string;
  otaName: string;
  otaReservationId: string;
  otaBooking:boolean;
  paidAmount: Number;
  payloadType: string;
  propertyBusinessEmail: string;
  propertyId: string;
  propertyName: string;
  resType: string;
  roomDetails: RoomDetail[];
  status: string;
  taxAmount: Number;
  totalAmount: Number;
  updatedTimestamp: string;
  constructor() {}
}
