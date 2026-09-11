// import { BusinessLeadAddress } from './address';
import { BusinessLeadAddress } from './address copy';
import { FollowUps } from './businessLeadfollowUps';
import { RoomDetails } from './roomdetails';
// import { RoomInfo } from './roominfo';
// import { FollowUps } from './businessLeadfollowUps';


export class BusinessLineDTO {

  accountManagerName: string;
  address: BusinessLeadAddress;
  businessType: string;
  email: string;
  coupon: string;
  followUps: FollowUps[];
  howDidYouHearAboutUs:string;
  id: number;
  noOfRooms:number;
  roomInfoList:RoomDetails[];
  landphone: string;
  ownerName:string;
  managerContactNo: string;
  managerEmailAddress: string;
  managerFirstName: string;
  managerLastName: string;
  mobile: string;
  name: string;
  plan: string;
  propertyStatus: string;
  website: string;
  latitude : string;
  longitude : string;
  placeId : string;
  facebook : string;
  instagram : string;
  twitter : string;
  nextFollowUpDate: string;
  onboardedDate: string;
  serialNo : number;
  source : string;
  status : string;
  dataCollectedBy : string;
  dateCollected : string;
  bookingEngine:string;
  googleBusinessSetup:string;
  googleHotelCenter:string;
  otaSetup:string;
  channelManager:string;
  pms:string;
  campaigns:string;
  fileName : string;
  fileUploadStatus : boolean;

  organisationId : number;

  message : string;
  notes : string;
  lastFollowUpDate : string;
  assignedDate : string;
  productLines : string;
  trainingStatus:string;
  propertyId : number;
  dateCollect:string;
  dateCreate:string;
  demoLines:string;
  clientResponse : string;

  frontSideOwnerCardImage : string;
  backSideOwnerCardImage: string;
  advanceAmount: number;
  totalSalesAmount: number;
  invoiceId: number;
  fromDate:string;
  toDate:string;
  logoUrl:string;
}
