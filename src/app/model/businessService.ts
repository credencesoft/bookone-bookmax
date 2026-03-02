import { TaxDetails } from './TaxDetails';
import { BusinessServiceType } from './businessServicetype';
// import { ClosedDays } from "./closeddays";
// import { OpenDays } from "./opendays";
import { ServiceCharge } from './serviceCharge';

export class BusinessService {
  id: number;
  // closedDays: ClosedDays[];
  // openDays: OpenDays[];
  name: string;
  description: string;
  propertyId: number;
  instantBooking: boolean;
  maxLeadTime: number;
  minLeadTime: number;
  stdPrepTime: number;

  groupName: string;
  code: string;
  brandName: string;
  brandSlogan: string;
  policy: string;
  terms: string;
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
  twentyFourHoursCheckOut: boolean;
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

  constructor() {}
}
