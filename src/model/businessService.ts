import { TaxDetails } from "src/app/model/TaxDetails";
import { BusinessServiceType } from "src/app/model/businessServicetype";
// import { ClosedDays } from "src/app/model/closedDays";
// import { OpenDays } from "src/app/model/openDays";
// import { OpenDays } from "src/app/model/openDays";
import { ServiceCharge } from "src/app/model/serviceCharge";

export class BusinessService {
  id: number;
  // closedDays: ClosedDays[];
  // openDays: OpenDays[];
  name: string;
  description: string;
  propertyId: number;
  instantBooking:boolean;
  maxLeadTime: number;
  minLeadTime: number;
  stdPrepTime: number;

  groupName: string;
  code: string;
  brandName: string;
  brandSlogan: string;
  policy: string;
  terms:string;
  sendInstantConfirmation: boolean;
  organisationId: number;
  businessLocationName: string;
  customerLocationName: string;
  bookingButtonLabelText: string;
  canChangeBusinessAddress: boolean;
  provideBusinessAndCustomerAddress: boolean;

  businessTermLocation: string;
  businessTermResource: string;

  businessProductName: string;
  businessServiceName: string;

  businessServiceTypes: BusinessServiceType[]; //businessOnboard
  businessServiceTypeList: BusinessServiceType[];

  businessTypeId: number;
  fontAwesomeUrl: string;
  imageUrl: string;
  serviceChargePercentage: number;
  // serviceOpenList: OpenDays[];
  // serviceCloseList: ClosedDays[];
  twentyFourHoursCheckOut:boolean;
  taxDetails: TaxDetails[];
  priceInclusiveOfTax: boolean;
  active: boolean;
  serviceReservation: boolean;
  serviceChargeList: ServiceCharge[];

  checkInTime: string;
  checkOutTime: string;
  logoUrl: string;
  gstNumber: string;
  phoneNumber: string;
  includeService: boolean;

  constructor() { }
}
