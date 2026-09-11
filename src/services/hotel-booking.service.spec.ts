import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HotelBookingService } from './hotel-booking.service';
import { EnquiryDto } from 'src/app/model/enquiry';
import { TokenStorage } from 'src/token.storage';

describe('HotelBookingService', () => {
  let service: HotelBookingService;
  let httpMock: HttpTestingController;
  let tokenStorageSpy: jasmine.SpyObj<TokenStorage>;

  const createEnquiry = (): EnquiryDto => ({
    totalAmount: 100,
    payableAmount: 80,
    externalSite: 'BookMax',
  } as EnquiryDto);

  beforeEach(() => {
    tokenStorageSpy = jasmine.createSpyObj<TokenStorage>('TokenStorage', [
      'getCountry',
      'getSelectedServices',
      'getServiceData',
    ]);
    tokenStorageSpy.getCountry.and.returnValue('India');
    tokenStorageSpy.getSelectedServices.and.returnValue([]);
    tokenStorageSpy.getServiceData.and.returnValue([]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HotelBookingService,
        { provide: TokenStorage, useValue: tokenStorageSpy },
      ],
    });
    service = TestBed.inject(HotelBookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should enrich enquiry from selected services snapshot', () => {
    tokenStorageSpy.getSelectedServices.and.returnValue([
      {
        id: 1,
        name: 'Airport Pickup',
        quantity: 2,
        afterTaxAmount: 59,
        paymentCollectionMode: 'PREPAID',
        sourceChannel: 'BookMax',
      } as any,
    ]);

    service.accommodationEnquiry(createEnquiry()).subscribe();

    const request = httpMock.expectOne((req) => req.url.includes('/api/v1/accommodationEnquiry'));
    expect(request.request.body.selectedServiceCount).toBe(1);
    expect(request.request.body.selectedServiceTotal).toBe(59);
    expect(request.request.body.quotedGrandTotal).toBe(159);
    expect(request.request.body.quotedPayableAmount).toBe(139);
    expect(JSON.parse(request.request.body.serviceQuoteSummary)).toEqual([
      {
        id: 1,
        name: 'Airport Pickup',
        serviceType: null,
        quantity: 2,
        amount: 59,
        paymentCollectionMode: 'PREPAID',
        sourceChannel: 'BookMax',
      },
    ]);
    request.flush({});
  });

  it('should fall back to session add-ons before generic service data', () => {
    sessionStorage.setItem(
      'addOnServices',
      JSON.stringify([
        {
          id: 7,
          name: 'Breakfast',
          count: 1,
          servicePrice: 25,
          taxAmount: 4.5,
          sourceChannel: 'BookMax',
        },
      ])
    );
    tokenStorageSpy.getServiceData.and.returnValue([
      {
        id: 99,
        name: 'Full Service Catalog Item',
        afterTaxAmount: 999,
      } as any,
    ]);

    service.accommodationEnquiry(createEnquiry()).subscribe();

    const request = httpMock.expectOne((req) => req.url.includes('/api/v1/accommodationEnquiry'));
    const summary = JSON.parse(request.request.body.serviceQuoteSummary);
    expect(summary).toEqual([
      {
        id: 7,
        name: 'Breakfast',
        serviceType: null,
        quantity: 1,
        amount: 29.5,
        paymentCollectionMode: null,
        sourceChannel: 'BookMax',
      },
    ]);
    expect(request.request.body.selectedServiceTotal).toBe(29.5);
    request.flush({});
  });

  it('should fall back to generic service data when no selected snapshot exists', () => {
    tokenStorageSpy.getServiceData.and.returnValue([
      {
        id: 3,
        name: 'Dinner',
        count: 1,
        netAmount: 40,
      } as any,
    ]);

    service.accommodationEnquiry(createEnquiry()).subscribe();

    const request = httpMock.expectOne((req) => req.url.includes('/api/v1/accommodationEnquiry'));
    expect(request.request.body.selectedServiceCount).toBe(1);
    expect(request.request.body.selectedServiceTotal).toBe(40);
    request.flush({});
  });
});
