export class BookingPricing {
  roomPrice?: number;
  beforeTaxAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  payableAmount?: number;
  advanceAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
  totalServiceAmount?: number;
  serviceAmountPaid?: number;
  serviceAmountPending?: number;
  roomTariffBeforeDiscount?: number;
  totalRoomTariffBeforeDiscount?: number;
  roomTariffPaid?: number;
  roomTariffPending?: number;
  convenienceFee?: number;
  bookingCommissionAmount?: number;
  couponCode?: string;
  promotionName?: string;
  currency?: string;

  constructor() {}
}