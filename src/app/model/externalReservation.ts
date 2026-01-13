import { PropertyServiceDTO } from "./PropertyServices";
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
  commissionAmount: any;
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
  couponCode:string;
  promotionName:string;
  resType: string;
  roomDetails: RoomDetail[];
  services:PropertyServiceDTO[];
  status: string;
  taxAmount: Number;
  totalAmount: Number;
  updatedTimestamp: string;
  discountAmount:number;
  noOfChildrenBelow5Years: any;
  noOfChildrenAbove5Years: any;
  groupBookingId: any;
  paymentReference: any;
  constructor() {}
}
