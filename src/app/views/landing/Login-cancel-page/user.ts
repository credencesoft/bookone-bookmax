import { LoginUserRole } from "./UserRole";
import { GroupUser } from "src/model/group";
import { UserRole } from "src/app/model/user-role";
import { Address } from "src/model/address";
export class ApplicationUser {
  id: number;
  businessName: string;
  address: Address;
  email: string;
  logoUrl: string;
  confirmEmail: string;
  password: string;
  uuid: string;
  resetStatus: boolean;
  passwordResetLink: string;
  confirmPassword: string;
  username: string;
  mobileNumber: string;
  landphoneNumber: string;
  maxBookingDiscountPercentage: number;
  maxOrderDiscountPercentage: number;
  firstName: string; // firstname
  lastName: string; // lastname
  pin: number;
  roles: Array<LoginUserRole>;
  properties: Array<GroupUser>;
  constructor() {}
}
