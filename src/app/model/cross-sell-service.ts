export interface CrossSellServiceCatalogDto {
  id: number;
  name: string;
  description?: string;
  displayLabel?: string;
  shortLabel?: string;
  businessType?: string;
  serviceType?: string;
  chargeBasis?: string;
  quantityMode?: string;
  capacityModel?: string;
  capacityPerUnit?: number;
  minQuantity?: number;
  maxQuantity?: number;
  maxUnitsPerBooking?: number;
  minAdults?: number;
  minChildren?: number;
  minNights?: number;
  bookingStage?: string;
  paymentCollectionMode?: string;
  isMandatory?: boolean;
  isAutoAdd?: boolean;
  discountEnabled?: boolean;
  discountStage?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscountAmount?: number;
  isCombinableWithCoupon?: boolean;
  isCombinableWithAdvanceDiscount?: boolean;
  discountPriority?: number;
  productId?: number | null;
  productVariationId?: number | null;
  servicePrice?: number;
  taxPercentage?: number;
  applicableToAdult?: boolean;
  applicableToChild?: boolean;
  logoUrl?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface BookingServiceContextDto {
  totalAdults?: number;
  totalChildren?: number;
  totalRooms?: number;
  totalNights?: number;
  roomTypeIds?: number[];
  ratePlanIds?: number[];
  couponCode?: string;
  advanceDiscountPercentage?: number;
}

export interface SelectedServiceRequestDto {
  serviceId: number;
  quantityRequested?: number;
  productId?: number | null;
  productVariationId?: number | null;
}

export interface ServiceSelectionPreviewRequestDto {
  propertyId: number;
  bookingContext?: BookingServiceContextDto;
  selectedServices: SelectedServiceRequestDto[];
}

export interface CalculatedSelectedServiceDto {
  serviceId: number;
  name: string;
  chargeBasis?: string;
  quantityApplied?: number;
  capacityPerUnitApplied?: number;
  paymentCollectionMode?: string;
  bookingStage?: string;
  unitPrice?: number;
  grossAmount?: number;
  discountAmount?: number;
  taxBaseAmount?: number;
  taxAmount?: number;
  netAmount?: number;
  afterTaxAmount?: number;
  discountTypeApplied?: string;
  discountValueApplied?: number;
  discountCodeApplied?: string;
  paymentStatus?: string;
  paidAmount?: number;
  balanceAmount?: number;
  paymentReference?: string;
  sourceChannel?: string;
  validationMessages?: string[];
}

export interface ServicePricingSummaryDto {
  servicesSubtotal?: number;
  servicesDiscount?: number;
  servicesTax?: number;
  servicesTotal?: number;
}

export interface ServiceSelectionPreviewResponseDto {
  selectedServices: CalculatedSelectedServiceDto[];
  summary?: ServicePricingSummaryDto;
}