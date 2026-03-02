import { Address } from "src/model/address";
import { PropertyStatusType } from "./PropertyStatusType";
import { TaxSlabs } from "./TaxSlabs";
import { TaxDetails } from "./TaxDetails";
import { BusinessService } from "./businessService";
import { Subcription } from "./subcription";
import { BankAccount } from "./BankAccount";
import { BusinessImage } from "./business-images";
import { MobileWallet } from "./mobileWallet";
import { DetailedView } from "./detailedView";
import { BusinessServiceDtoList } from "./businessServiceDtoList";
import { PropertyServiceDTO } from "./PropertyServices";

export class Property {
  bookonePropertyId: number;
  id: number;
  name: string;
  email: string;
  managerName: string;

  count: number;
  longitude: string;
  latitude: string;

  address: Address;
  contactNumber: string;
  landphone: string;
  mobile: string;
  status: PropertyStatusType;
  gstNumber: string;
  userId: string;
  propertyBarCode: Uint8Array[];
  logoUrl: string;
  imageUrl: string;
  website: string;
  slogan: string;

  localCurrency: string;
  propertyStatus: string;
  pricePerNight: string;
  pricePerWeek: string;
  priceFortNight: string;
  priceMonthly: string;
  minimumOccupancy: string;
  maximumOccupancy: string;

  managerFirstName: string;
  managerLastName: string;
  managerContactNo: string;
  managerEmailAddress: string;

  taxDetails: TaxDetails[];

  noOfFloor: number;
  noOfRoomType: number;
  placeId: string;
  organisationId: number;

  businessName: string;

  confirmEmail: string;
  password: string;
  uuid: string;
  resetStatus: boolean;
  passwordResetLink: string;
  confirmPassword: string;
  username: string;
  mobileNumber: string;
  landphoneNumber: string;
  firstname: string; // firstname
  lastname: string; // lastname
  // propertie :GroupUser;
  propertyId: number;
  createdBy: string;
  shortName: string;

  businessType: string;
  businessTypeGroup: string;
  businessDescription: string;

  plan: string;

  twitter: string;
  instagram: string;
  facebook: string;
  seoFriendlyName: string;
  subscriptionList: Subcription[];

  bookingCommissionPercentage: number;
  transactionFee: number;
  cardProcessingFeePercentage: number;

  paymentGateway: string;
  paymentGatewayApiKey: string;
  paymentGatewayApiToken: string;
  paymentGatewayPublicKey: string;

  businessServiceDtoList: BusinessServiceDtoList[];

  imageList: BusinessImage[];

  bankName: string;
  branchName: string;
  verified: boolean;
  bankAccount: BankAccount;
  featuredBusiness: boolean;

  socialMediaLinks: any[];

  numberOfRooms: number;

  mobileWallet: MobileWallet;
  detailedView: DetailedView;
  whatsApp: string;
  videoLink: string;
  businessSubtype: string;
  vatNumber: string;
  propertyServicesList: PropertyServiceDTO[];
  paymentGatewayCallbackUrl: string;
  udyamRegistrationNumber: string;
  fssaiRegNumber: string;
  sacCode: string;
  propertyInvoicePrintHeader: boolean;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;

  constructor() {}
}
