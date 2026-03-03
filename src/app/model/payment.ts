
export class Payment {

    id: number;
    referenceNumber: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    businessEmail: string;
    amount: number;
    currency: string;
    state: string;
    date: string;
    token: string;
    expYear: string;
    callBackUrl: void;
  callbackUrl: string;
    expMonth: string;
    cardNumber: string;
    cvv: string;
    description: string;
    status: string;
    receiptNumber: string;
    failureMessage: string;
    failureCode: string;
    deliveryChargeAmount: number;
    paymentMode: string;
    externalReference: string;
    propertyId: number;
    businessName: string;
    transactionAmount: number;
    transactionChargeAmount: number;
    netReceivableAmount: number;
    otherChargesAmount: number;
    taxAmount: number;
    bankName: string;
    branchName: string;
    swiftCode:string;
    accountName:string;
    accountNumber:string;
    bankReferenceNumber: number;
    bookingCommissionAmount: number;
  clientSecret: string;
  businessServiceName: string;
  encryptedData: any;
  lastModifiedDate: any;
    constructor() {
    }
}
