import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BookingConfirmationVoucherComponent } from './booking-confirmation-voucher.component';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';

class TestBookingConfirmationVoucherComponent extends BookingConfirmationVoucherComponent {
  override async getPropertyDetailsById(): Promise<void> {
    return Promise.resolve();
  }
}

/**
 * Voucher Math – 14 Booking Scenarios
 *
 * Base room:  ₹100 net, 5% tax, add-on ₹20 + ₹1 tax = ₹21
 * Convenience fee: 2% of ORIGINAL base price (before any discount)
 *
 * Key state fields:
 *   bookingsResponseList[0].beforeTaxAmount  = room price after coupon (API value, pre-advance)
 *   bookingsResponseList[0].roomTariffBeforeDiscount = original room price before coupon
 *   bookingsResponseList[0].taxAmount        = per-row tax from API   (post-coupon, pre-advance)
 *   taxOnDiscountedAmount                    = authoritative tax (post-ALL discounts, stored from checkout)
 *                                              When > 0, getDisplayedRoomTax() uses this instead of per-row sum
 *   convenienceFeeAmount                     = stored from checkout (on ORIGINAL base price)
 *                                              When > 0, getDisplayedConvenienceFee() uses this directly
 */
describe('BookingConfirmationVoucherComponent – 14 booking scenarios', () => {
  let component: BookingConfirmationVoucherComponent;

  const propertyData = {
    id: 11,
    businessType: 'Hotel',
    localCurrency: 'inr',
    businessServiceDtoList: [
      { name: 'Accommodation', serviceChargePercentage: 2 },
    ],
    socialMediaLinks: [],
  };

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    const tokenStorageStub = {
      getPropertyData: () => propertyData,
      saveProperty: jasmine.createSpy('saveProperty'),
      getBookingData: () => null,
    } as unknown as TokenStorage;

    component = new TestBookingConfirmationVoucherComponent(
      {} as HttpClient,
      tokenStorageStub,
      {} as HotelBookingService,
      {} as ListingService,
      { navigate: jasmine.createSpy('navigate') } as unknown as Router,
      { detectChanges: jasmine.createSpy('detectChanges') } as unknown as ChangeDetectorRef,
    );
  });

  /**
   * Configures component state exactly as the checkout flow would have stored it.
   *
   * @param beforeTaxAmount  Room price after coupon (from API); setup derives the original subtotal from it
   * @param perRowTax        Tax from API row (post-coupon, pre-advance) – fallback when taxOnDiscountedAmount=0
   * @param taxOnDiscounted  Post-all-discounts tax stored in sessionStorage (0 when no advance discount)
   * @param advanceDiscount  Advance discount amount
   * @param advancePct       Advance discount percentage label
   * @param payAdvancePct    Advance payment percentage (0 = pay-full)
   * @param convFeeAmount    Convenience fee stored from checkout (0 = no fee)
   * @param withAddOn        Include add-on service: ₹20 + ₹1 tax = ₹21
   * @param couponPct        Coupon percentage for label display
   */
  function setup(cfg: {
    beforeTaxAmount: number;
    perRowTax: number;
    taxOnDiscounted?: number;
    advanceDiscount?: number;
    advancePct?: number;
    payAdvancePct?: number;
    convFeeAmount?: number;
    withAddOn?: boolean;
    couponPct?: number;
  }): void {
    const couponMultiplier = cfg.couponPct ? (100 - cfg.couponPct) / 100 : 1;
    const roomTariffBeforeDiscount = couponMultiplier > 0
      ? cfg.beforeTaxAmount / couponMultiplier
      : cfg.beforeTaxAmount;

    component.bookingsResponseList = [{
      beforeTaxAmount: cfg.beforeTaxAmount,
      roomTariffBeforeDiscount,
      taxAmount: cfg.perRowTax,
      discountAmount: roomTariffBeforeDiscount - cfg.beforeTaxAmount,
      noOfNights: 1,
      noOfRooms: 1,
      extraPersonCharge: 0,
      extraChildCharge: 0,
    }];
    component.specialDiscountData = cfg.couponPct ? { discountPercentage: cfg.couponPct } : null;
    component.advanceDiscountPercentage = cfg.advancePct || 0;
    component.advanceDiscountAmount     = cfg.advanceDiscount || 0;
    component.advancePaymentPercentage  = cfg.payAdvancePct || 0;
    component.taxOnDiscountedAmount     = cfg.taxOnDiscounted || 0;
    component.convenienceFeeAmount      = cfg.convFeeAmount || 0;
    component.serviceChargePercentage   = 0;   // always rely on convenienceFeeAmount stored value
    component.selectedAddOns = cfg.withAddOn
      ? [{ serviceName: 'Airport Pickup', quantity: 1, servicePrice: 20, taxAmount: 1 }]
      : [];
  }

  // ─── No-discount scenarios ────────────────────────────────────────────────

  it('S1: Room only — no discount, no fee', () => {
    setup({ beforeTaxAmount: 100, perRowTax: 5 });
    // room=100, tax=5(per-row fallback), convFee=0, services=0
    expect(component.getDiscountColumnLabel()).toBe('Discount');
    expect(component.getDisplayedRoomSubtotal()).toBe(100);
    expect(component.getDisplayedRoomTax()).toBe(5);
    expect(component.getDisplayedConvenienceFee()).toBe(0);
    expect(component.getNewGrandTotal()).toBeCloseTo(105, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(105, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('S2: Room + Service — no discount, no fee', () => {
    setup({ beforeTaxAmount: 100, perRowTax: 5, withAddOn: true });
    // room=100, tax=5, services=21, convFee=0
    expect(component.getServicesTotal()).toBe(21);
    expect(component.getNewGrandTotal()).toBeCloseTo(126, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(126, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('S3: Room only — no discount, with convenience fee (2% of ₹100)', () => {
    setup({ beforeTaxAmount: 100, perRowTax: 5, convFeeAmount: 2 });
    // room=100, tax=5, convFee=2
    expect(component.getDisplayedConvenienceFee()).toBe(2);
    expect(component.getNewGrandTotal()).toBeCloseTo(107, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(107, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('S4: Room + Service — no discount, with convenience fee', () => {
    setup({ beforeTaxAmount: 100, perRowTax: 5, convFeeAmount: 2, withAddOn: true });
    // room=100, tax=5, services=21, convFee=2
    expect(component.getNewGrandTotal()).toBeCloseTo(128, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(128, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  // ─── Coupon-only scenarios ────────────────────────────────────────────────
  // Coupon 50%: afterCoupon=50, perRowTax=2.5, coupon does not trigger taxOnDiscountedAmount override

  it('S5: Room only — coupon 50%, no fee', () => {
    setup({ beforeTaxAmount: 50, perRowTax: 2.5, couponPct: 50 });
    // room=50, tax=2.5(per-row), convFee=0
    expect(component.getDiscountColumnLabel()).toBe('Coupon / Promo');
    expect(component.getDisplayedRoomSubtotal()).toBe(100);
    expect(component.getDisplayedCouponDiscountAmount()).toBe(50);
    expect(component.getDisplayedRoomTax()).toBe(2.5);
    expect(component.getNewGrandTotal()).toBeCloseTo(52.5, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(52.5, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('S6: Room + Service — coupon 50%, no fee', () => {
    setup({ beforeTaxAmount: 50, perRowTax: 2.5, couponPct: 50, withAddOn: true });
    // room=50, tax=2.5, services=21, convFee=0
    expect(component.getNewGrandTotal()).toBeCloseTo(73.5, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(73.5, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('S7: Room only — coupon 50%, with convenience fee (2% of original ₹100)', () => {
    setup({ beforeTaxAmount: 50, perRowTax: 2.5, couponPct: 50, convFeeAmount: 2 });
    // room=50, tax=2.5, convFee=2(on original 100)
    expect(component.getDisplayedConvenienceFee()).toBe(2);
    expect(component.getNewGrandTotal()).toBeCloseTo(54.5, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(54.5, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('S8: Room + Service — coupon 50%, with convenience fee', () => {
    setup({ beforeTaxAmount: 50, perRowTax: 2.5, couponPct: 50, convFeeAmount: 2, withAddOn: true });
    // room=50, tax=2.5, services=21, convFee=2
    expect(component.getNewGrandTotal()).toBeCloseTo(75.5, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(75.5, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  // ─── Coupon + Advance discount scenarios ─────────────────────────────────
  // Coupon 50%: afterCoupon=50 | Advance 20% of 50=10 | afterAll=40
  // taxOnDiscounted = 40×5% = 2  |  convFee = 2% of original 100 = 2

  it('S9: Room only — coupon 50% + advance discount 20%, 50% advance payment, with fee', () => {
    setup({
      beforeTaxAmount: 50, perRowTax: 2.5, couponPct: 50,
      advancePct: 20, advanceDiscount: 10, payAdvancePct: 50,
      taxOnDiscounted: 2, convFeeAmount: 2,
    });
    // accAfterDisc=40, tax=2, convFee=2
    // Grand = 40+2+0+2 = 44
    // PayNow = 50%*(40+2)+0+2 = 21+2 = 23
    // Balance = 44-23 = 21
    expect(component.getDiscountColumnLabel()).toBe('Coupon / Promo');
    expect(component.getDisplayedRoomSubtotal()).toBe(100);
    expect(component.getDisplayedCouponDiscountAmount()).toBe(50);
    expect(component.getDisplayedAdvanceDiscountAmount()).toBe(10);
    expect(component.getDisplayedAccommodationAfterDiscounts()).toBe(40);
    expect(component.getDisplayedRoomTax()).toBe(2);
    expect(component.getDisplayedConvenienceFee()).toBe(2);
    expect(component.getNewGrandTotal()).toBeCloseTo(44, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(23, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(21, 2);
  });

  it('S10: Room + Service — coupon 50% + advance 20%, 50% advance payment, with fee', () => {
    setup({
      beforeTaxAmount: 50, perRowTax: 2.5, couponPct: 50,
      advancePct: 20, advanceDiscount: 10, payAdvancePct: 50,
      taxOnDiscounted: 2, convFeeAmount: 2, withAddOn: true,
    });
    // Grand = 40+2+21+2 = 65
    // PayNow = 50%*(40+2)+21+2 = 21+23 = 44
    // Balance = 65-44 = 21
    expect(component.getServicesTotal()).toBe(21);
    expect(component.getNewGrandTotal()).toBeCloseTo(65, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(44, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(21, 2);
  });

  // ─── Advance-only scenarios ───────────────────────────────────────────────
  // No coupon, base=100 | Advance 20% of 100=20 | afterAll=80
  // taxOnDiscounted = 80×5% = 4  |  convFee = 2% of 100 = 2

  it('S11: Room only — advance 20%, 50% advance payment, with fee', () => {
    setup({
      beforeTaxAmount: 100, perRowTax: 5,
      advancePct: 20, advanceDiscount: 20, payAdvancePct: 50,
      taxOnDiscounted: 4, convFeeAmount: 2,
    });
    // Grand = 80+4+0+2 = 86
    // PayNow = 50%*(80+4)+0+2 = 42+2 = 44
    // Balance = 86-44 = 42
    expect(component.getDiscountColumnLabel()).toBe('Discount');
    expect(component.getDisplayedAccommodationAfterDiscounts()).toBe(80);
    expect(component.getDisplayedRoomTax()).toBe(4);
    expect(component.getNewGrandTotal()).toBeCloseTo(86, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(44, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(42, 2);
  });

  it('S12: Room + Service — advance 20%, 50% advance payment, with fee', () => {
    setup({
      beforeTaxAmount: 100, perRowTax: 5,
      advancePct: 20, advanceDiscount: 20, payAdvancePct: 50,
      taxOnDiscounted: 4, convFeeAmount: 2, withAddOn: true,
    });
    // Grand = 80+4+21+2 = 107
    // PayNow = 50%*(80+4)+21+2 = 42+23 = 65
    // Balance = 107-65 = 42
    expect(component.getNewGrandTotal()).toBeCloseTo(107, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(65, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(42, 2);
  });

  it('S13: Room only — advance 20%, 50% advance payment, WITHOUT fee', () => {
    setup({
      beforeTaxAmount: 100, perRowTax: 5,
      advancePct: 20, advanceDiscount: 20, payAdvancePct: 50,
      taxOnDiscounted: 4, convFeeAmount: 0,
    });
    // Grand = 80+4+0+0 = 84
    // PayNow = 50%*(80+4) = 42
    // Balance = 84-42 = 42
    expect(component.getDisplayedConvenienceFee()).toBe(0);
    expect(component.getNewGrandTotal()).toBeCloseTo(84, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(42, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(42, 2);
  });

  it('S14: Room + Service — advance 20%, 50% advance payment, WITHOUT fee', () => {
    setup({
      beforeTaxAmount: 100, perRowTax: 5,
      advancePct: 20, advanceDiscount: 20, payAdvancePct: 50,
      taxOnDiscounted: 4, convFeeAmount: 0, withAddOn: true,
    });
    // Grand = 80+4+21+0 = 105
    // PayNow = 50%*(80+4)+21+0 = 42+21 = 63
    // Balance = 105-63 = 42
    expect(component.getNewGrandTotal()).toBeCloseTo(105, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(63, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(42, 2);
  });

  it('regression: advance-only + service + fee keeps row Tax/Total aligned with footer totals', () => {
    setup({
      // Mirrors the screenshot numbers
      beforeTaxAmount: 2,
      perRowTax: 0.10, // pre-advance row tax from API
      advancePct: 50,
      advanceDiscount: 1,
      payAdvancePct: 100,
      taxOnDiscounted: 0.05, // authoritative post-all-discounts tax
      convFeeAmount: 0.04,
      withAddOn: true, // fixed add-on = 20 + 1 in helper
    });

    // Override add-on to screenshot scale
    component.selectedAddOns = [
      { serviceName: 'Service', quantity: 1, servicePrice: 1, taxAmount: 0 },
    ];

    const row = component.bookingsResponseList[0];
    expect(component.getDisplayedRowTax(row)).toBeCloseTo(0.05, 2);
    expect(component.getDisplayedRowTotal(row)).toBeCloseTo(1.05, 2);
    expect(component.getNewGrandTotal()).toBeCloseTo(2.09, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(2.09, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(0, 2);
  });

  it('falls back to backend booking services when enquiry add-ons are unavailable', () => {
    component.bookingsResponseList = [{
      beforeTaxAmount: 100,
      taxAmount: 5,
      services: [
        { name: 'Airport Pickup', quantityApplied: 2, servicePrice: 20, taxAmount: 2 },
        { serviceType: 'Breakfast', count: 1, servicePrice: 10, taxAmount: 1 },
      ],
    }];
    sessionStorage.setItem('BookedEnquiryList', JSON.stringify([{}]));

    (component as any).loadCalculationStateFromEnquiries();

    expect(component.selectedAddOns).toEqual([
      { name: 'Airport Pickup', quantity: 2, servicePrice: 20, taxAmount: 2 },
      { name: 'Breakfast', quantity: 1, servicePrice: 10, taxAmount: 1 },
    ]);
    expect(component.getServicesSubtotal()).toBe(30);
    expect(component.getServicesTax()).toBe(3);
    expect(component.getServicesTotal()).toBe(33);
  });
});
