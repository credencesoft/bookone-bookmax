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

describe('BookingConfirmationVoucherComponent', () => {
  let component: BookingConfirmationVoucherComponent;

  const propertyData = {
    id: 11,
    businessType: 'Hotel',
    localCurrency: 'inr',
    businessServiceDtoList: [
      { name: 'Accommodation', serviceChargePercentage: 2 },
      { name: 'Hotel' },
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

  function configureVoucherState(options: {
    couponPercent?: number;
    advanceDiscountPercent?: number;
    advancePaymentPercent?: number;
    addOnPrice?: number;
    addOnTax?: number;
  } = {}): void {
    component.bookingsResponseList = [
      {
        beforeTaxAmount: 10.5,
        taxAmount: 0.53,
        discountAmount: options.couponPercent ? 4.5 : options.advanceDiscountPercent ? 2.1 : 0,
        roomPrice: 15,
        noOfNights: 1,
        noOfRooms: 1,
        extraPersonCharge: 0,
        extraChildCharge: 0,
        totalAmount: 11.03,
      },
    ];
    component.specialDiscountData = options.couponPercent
      ? { discountPercentage: options.couponPercent }
      : null;
    component.advanceDiscountPercentage = options.advanceDiscountPercent || 0;
    component.advanceDiscountAmount = options.advanceDiscountPercent ? 2.1 : 0;
    component.advancePaymentPercentage = options.advancePaymentPercent || 0;
    component.advancePaymentLabel = options.advancePaymentPercent ? `Pay ${options.advancePaymentPercent}% Advance` : '';
    component.serviceChargePercentage = 2;
    component.selectedAddOns = options.addOnPrice || options.addOnTax
      ? [
          {
            serviceName: 'Airport Pickup',
            quantity: 1,
            servicePrice: options.addOnPrice || 0,
            taxAmount: options.addOnTax || 0,
          },
        ]
      : [];
  }

  it('computes voucher totals for no coupon and no advance', () => {
    configureVoucherState();

    expect(component.getDiscountColumnLabel()).toBe('Discount');
    expect(component.getDisplayedRoomSubtotal()).toBe(10.5);
    expect(component.getDisplayedAdvanceDiscountAmount()).toBe(0);
    expect(component.getDisplayedConvenienceFee()).toBe(0.21);
    expect(component.getNewGrandTotal()).toBeCloseTo(11.24, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(11.24, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('computes voucher totals for coupon-only case', () => {
    configureVoucherState({ couponPercent: 30 });

    expect(component.getDiscountColumnLabel()).toBe('Coupon Discount (30%)');
    expect(component.getDisplayedRoomSubtotal()).toBe(10.5);
    expect(component.getDisplayedAdvanceDiscountAmount()).toBe(0);
    expect(component.getNewGrandTotal()).toBeCloseTo(11.24, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(11.24, 2);
    expect(component.getNewBalanceAtCheckIn()).toBe(0);
  });

  it('computes voucher totals for advance-only case', () => {
    configureVoucherState({ advanceDiscountPercent: 20, advancePaymentPercent: 50 });

    expect(component.getDiscountColumnLabel()).toBe('Advance Discount (20%)');
    expect(component.getDisplayedAdvanceDiscountAmount()).toBeCloseTo(2.1, 2);
    expect(component.getDisplayedAccommodationAfterDiscounts()).toBeCloseTo(8.4, 2);
    expect(component.getNewGrandTotal()).toBeCloseTo(9.14, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(4.68, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(4.46, 2);
  });

  it('computes voucher totals for coupon and advance case with add-ons', () => {
    configureVoucherState({
      couponPercent: 30,
      advanceDiscountPercent: 20,
      advancePaymentPercent: 50,
      addOnPrice: 1,
      addOnTax: 0,
    });

    expect(component.getDiscountColumnLabel()).toBe('Coupon Discount (30%)');
    expect(component.getDisplayedAdvanceDiscountAmount()).toBeCloseTo(2.1, 2);
    expect(component.getServicesTotal()).toBe(1);
    expect(component.getNewGrandTotal()).toBeCloseTo(10.14, 2);
    expect(component.getNewPayNowAmount()).toBeCloseTo(5.68, 2);
    expect(component.getNewBalanceAtCheckIn()).toBeCloseTo(4.46, 2);
  });
});
