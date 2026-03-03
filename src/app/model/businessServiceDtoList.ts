// import { ClosedDays } from './closedDays';
// import { OpenDays } from './openDays';
// import { BusinessServiceTypes } from './businessServiceTypes';

import { BusinessServiceTypes } from "./businessServiceTypes";
import { ClosedDays } from "./closedDays";
import { OpenDays } from "./openDays";

export class BusinessServiceDtoList {
  id: number;
  closedDays: ClosedDays[];
  openDays: OpenDays[];
  name: string;

  businessLocationName: string;
  customerLocationName: string;
  canChangeBusinessAddress: boolean;
  provideBusinessAndCustomerAddress: boolean;

  businessTermLocation: string;
  businessTermResource: string;

  businessProductName: string;
  businessServiceName: string;
  checkInTime: string;
  checkOutTime: string;
  maxLeadTime: number;
  minLeadTime: number;
  stdPrepTime: number;

  description: string;
  propertyId: number;
  businessServiceTypes: BusinessServiceTypes[];
  policy: string;
  serviceCloseList: [
    {
      day: string;
    }
  ];
  serviceOpenList: [
    {
      breakFromTime: string;
      breakToTime: string;
      closingTime: string;
      day: string;
      openingTime: string;
    }
  ];
  constructor() {}
}
