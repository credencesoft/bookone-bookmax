export class RoomRatePlans {
  active: boolean;
  amount: number;
  applicableToOta: null;
  code: string;
  currencyCode: string;
  description: string;
  deviationFromStandardPlan: number;
  effectiveDate: string;
  expiryDate: string;
  maximumLengthOfStay: number;
  minimumLengthOfStay: number;
  name: string;
  restriction: string;
  roomId: number;
  status: string;
  propertyServicesList: any[];
  otaPlanList:any[];

  constructor() {}
}
