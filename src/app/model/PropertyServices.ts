export class PropertyServiceDTO {
  id: number;
  businessType: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
  name: string;
  applicableToAdult: boolean;
  applicableToChild: boolean;
  organisationId: number;
  serviceType: string;
  afterTaxAmount: number;
  beforeTaxAmount: number;
  taxAmount: number;
  taxPercentage: number;
  count: number;
  servicePrice: number;
  date: string;
  paymentId: string;

  constructor() {}
}
