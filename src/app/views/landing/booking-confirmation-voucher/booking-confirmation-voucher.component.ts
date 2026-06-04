import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-booking-confirmation-voucher',
  templateUrl: './booking-confirmation-voucher.component.html',
  styleUrls: ['./booking-confirmation-voucher.component.scss'],
})
export class BookingConfirmationVoucherComponent {
  businessUser: any;
  PropertyUrl: string;
  loadingData = true;
  bookingsResponseList: any[] = [];
  websiteUrlBookingEngine: boolean;
  booking: any;
  totalPlanAdults: number = 0;
  totalPlanChildren: number = 0;
  totalPlanChildrenAboveAgeLimit: number = 0;
  totalPlanChildrenBelowAgeLimit: number = 0;
  totalDiscount = 0;
  bookingSummaryDetails: any;
  specialDiscountData: any;
  specialDiscountPercentage: any;
  accommodationData: any;
  serviceChargePercentage: any;
  copyTextOne: boolean = false;
  currency: any;
  businessServiceDto: any;
  socialmedialist: any;
  policies: any;
  isReadMore: any;
  accommodationService: any;
  roomLabel: string = 'Room';
  cancellationPolicyData: any;
  cancellationRuleRows: { window: string; chargeLabel: string }[] = [];
  cancellationEstimate: {
    deductionAmount: number;
    refundableAmount: number;
    dueAmount: number;
    chargeLabel: string;
  } | null = null;

  // ✅ NEW: Calculation and payment plan tracking properties
  couponDiscountPercentage: number = 0;
  couponDiscountAmount: number = 0;
  advanceDiscountPercentage: number = 0;
  advanceDiscountAmount: number = 0;
  advancePaymentPercentage: number = 0;
  advancePaymentLabel: string = '';
  amountAfterDiscount: number = 0;
  taxOnDiscountedAmount: number = 0;
  convenienceFeeAmount: number = 0;
  grandTotal: number = 0;
  payNowAmount: number = 0;
  balanceAtCheckIn: number = 0;
  selectedAddOns: any[] = [];
  selectedAdvanceDiscountSlab: any = null;
  isPaid: boolean = false;

  exchangeRates: any;

  constructor(
    private http: HttpClient,
    private token: TokenStorage,
    private hotelBookingService: HotelBookingService,
    private listingService: ListingService,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private acRoute: ActivatedRoute,
    private currencyService: CurrencyService,
  ) {
    this.businessUser = this.token.getPropertyData();
    this.getPropertyDetailsById(this.businessUser.id);

    const savedLabel = localStorage.getItem('savedBookingLabel');
    console.log('savedLabel data is',savedLabel);
    if (savedLabel) {
    try {
      const parsedData = JSON.parse(savedLabel);
      this.roomLabel = parsedData.label || 'Room'; 
    } catch (e) {
      console.error("Error parsing token", e);
    }
  }
  }
  ngOnInit() {
    this.acRoute.queryParams.subscribe((params) => {
      if (params['currency'] !== undefined) {
        this.currency = params['currency'].toUpperCase();
        try {
          sessionStorage.setItem('selected_currency', this.currency);
        } catch (e) {
          console.error('Error writing to sessionStorage selected_currency:', e);
        }
      } else if (params['userCurrency'] !== undefined) {
        this.currency = params['userCurrency'].toUpperCase();
        try {
          sessionStorage.setItem('selected_currency', this.currency);
        } catch (e) {
          console.error('Error writing to sessionStorage selected_currency:', e);
        }
      }

      const countryParam =
        params['country'] ||
        params['user_country'] ||
        params['userCountry'] ||
        params['user_country_code'] ||
        params['userCountryCode'];
      if (countryParam) {
        this.token.saveCountry(countryParam);
      }
    });

    this.currencyService.getLatestRates().subscribe(
      (data) => {
        if (data && data.rates) {
          this.exchangeRates = data.rates;
          this.resolveActiveCurrency();
          this.changeDetectorRefs.detectChanges();
        } else {
          this.exchangeRates = null;
          this.resolveActiveCurrency();
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        console.error('Failed to load exchange rates in BookingConfirmationVoucherComponent:', error);
        this.exchangeRates = null;
        this.resolveActiveCurrency();
        this.changeDetectorRefs.detectChanges();
      }
    );

    this.sequenceBookingConfirmation();

    const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
    if (bookingDataDetails) {
      this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
      this.calculateTotalGuestsFromPlans();
    }
    this.loadCalculationStateFromEnquiries();
    const couponCodeValues = sessionStorage.getItem('selectedPromoData');
    if (couponCodeValues) {
      const parsed = JSON.parse(couponCodeValues); // convert to object
      this.specialDiscountData = JSON.parse(couponCodeValues);
      console.log('this.privatePromotionData', this.specialDiscountData);
      if (parsed.discountPercentage) {
        this.specialDiscountPercentage = parsed.discountPercentage;
      }
    }
    this.accommodationData = this.businessUser.businessServiceDtoList?.filter(
      (entry) => entry.name === 'Accommodation',
    );
    this.cancellationPolicyData = this.accommodationData?.[0]?.cancellationPolicy;
    this.buildCancellationRuleRows();
    this.computeCancellationEstimate();
    this.accommodationData.forEach((element) => {
      this.serviceChargePercentage = element.serviceChargePercentage;
    });
    this.isReadMore = this.policies?.map(() => false);
    setInterval(() => {
      this.loadBookingSessionData();
      this.checkBookingEngineFlag();
      if (
        this.token.getBookingData() != null &&
        this.token.getBookingData() != undefined
      ) {
        this.booking = this.token.getBookingData();
      }
      // ✅ NEW: Load calculation state from stored enquiries
      this.loadCalculationStateFromEnquiries();
    }, 2000);
  }
  private sequenceBookingConfirmation() {
    this.loadingData = true;
    const cachedBookings = sessionStorage.getItem('bookingsResponseList');
    const bookedStr = sessionStorage.getItem('BookedEnquiryList');
    if (!bookedStr) {
      console.error('BookedEnquiryList missing');
      this.loadingData = false;
      return;
    }

    const bookedEnquiries = JSON.parse(bookedStr);
    if (!Array.isArray(bookedEnquiries) || bookedEnquiries.length === 0) {
      console.error('BookedEnquiryList empty');
      this.loadingData = false;
      return;
    }

    if (cachedBookings) {
      try {
        const parsedCachedBookings = JSON.parse(cachedBookings);
        if (this.isCachedBookingsAlignedWithEnquiries(parsedCachedBookings, bookedEnquiries)) {
          this.bookingsResponseList = parsedCachedBookings;
          this.loadingData = false;
          return;
        }
      } catch (error) {
        console.warn('Invalid cached bookingsResponseList. Refetching from API.', error);
      }
    }

    this.fetchBookingsSequentially(bookedEnquiries);
  }

  private isCachedBookingsAlignedWithEnquiries(cachedBookings: any[], bookedEnquiries: any[]): boolean {
    if (!Array.isArray(cachedBookings) || cachedBookings.length === 0) {
      return false;
    }

    const enquiryBookingIds = Array.from(
      new Set(
        bookedEnquiries
          .map((enquiry) => Number(enquiry?.bookingId || enquiry?.bookingReservationId || 0))
          .filter((id) => id > 0),
      ),
    );

    if (enquiryBookingIds.length === 0) {
      return false;
    }

    const cachedBookingIds = Array.from(
      new Set(
        cachedBookings
          .map((booking) => Number(booking?.id || booking?.bookingId || booking?.bookingReservationId || 0))
          .filter((id) => id > 0),
      ),
    );

    if (cachedBookingIds.length !== enquiryBookingIds.length) {
      return false;
    }

    return enquiryBookingIds.every((id) => cachedBookingIds.includes(id));
  }

  private fetchBookingsSequentially(bookedEnquiries: any[]) {
    this.bookingsResponseList = [];
    this.loadingData = true;

    let index = 0;
    const fetchedBookingIds = new Set<number>();

    const next = () => {
      // ✅ Finished processing all enquiries
      if (index >= bookedEnquiries.length) {
        this.finalizeBookings();
        return;
      }

      const enquiry = bookedEnquiries[index];
      const bookingId = enquiry.bookingId || enquiry.bookingReservationId;

      index++;

      // ⏭ Skip if enquiry has no booking yet
      if (!bookingId) {
        next();
        return;
      }

      // 🛑 GROUP BOOKING PROTECTION
      // If booking already fetched once, don't fetch again.
      if (fetchedBookingIds.has(Number(bookingId))) {
        next();
        return;
      }

      fetchedBookingIds.add(Number(bookingId));

      this.hotelBookingService.fetchBookingById(bookingId).subscribe({
        next: (booking) => {
          if (booking) {
            this.bookingsResponseList.push(booking);
          }
        },
        error: (err) => {
          console.error('❌ Booking fetch failed:', bookingId, err);
        },
        complete: () => {
          next();
        },
      });
    };

    next();
  }

  private finalizeBookings() {
    sessionStorage.setItem(
      'bookingsResponseList',
      JSON.stringify(this.bookingsResponseList),
    );

    this.loadingData = false;
  }

  checkBookingEngineFlag(): void {
    const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
    this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
  }

  getUpdatedReservationNumber(value: string): string {
    return value ? value.replace('-B-', '-BE-') : '';
  }
  getTrimmedDescription(description: string): string {
    if (!description) return '';

    const words = description.split(/\s+/); // split by spaces
    if (words.length <= 35) {
      return description;
    }

    return words.slice(0, 35).join(' ') + '...';
  }
  loadBookingSessionData(): void {
    const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
    if (bookingDataDetails) {
      this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
      this.totalDiscount = this.bookingsResponseList.reduce(
        (sum, booking) => sum + (booking.discountAmount || 0),
        0,
      );
      this.calculateTotalGuestsFromPlans();
      // console.log('bookingSummaryDetails', this.bookingSummaryDetails);
    }

    const bookingsResponseList = sessionStorage.getItem('bookingsResponseList');
    if (bookingsResponseList) {
      this.bookingsResponseList = JSON.parse(bookingsResponseList);
      this.calculateTotalGuestsFromPlans();
      // console.log('bookingsResponseList', this.bookingsResponseList);
    }
  }

  calculateServiceHours() {
    this.accommodationService = this.businessUser.businessServiceDtoList.filter(
      (service) => service.name === 'Accommodation',
    );
    // console.log(" this.accommodationService" + JSON.stringify( this.accommodationService))
  }

  backone() {
    this.PropertyUrl = this.token.getPropertyUrl();
    window.location.href = this.PropertyUrl;
    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('BOOKINGDATAOJC');
    sessionStorage.removeItem('bookingSummary');
    sessionStorage.removeItem('EnquiryResponseList');
    sessionStorage.clear();
  }

  calculateConvenienceFee(totalAmount: number, percentage: number): number {
    if (!totalAmount || !percentage) {
      return 0;
    }
    const fee = (totalAmount * percentage) / 100;
    return Number(fee.toFixed(2));
  }
  copyTexttwo() {
    // Find the element
    const textToCopy = document.getElementById('textToCopy')?.innerText.trim();

    if (textToCopy) {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;

      // Add to the document body
      document.body.appendChild(textarea);

      // Select and copy the content
      textarea.select();
      document.execCommand('copy');

      // Remove the textarea element
      document.body.removeChild(textarea);

      // Notify the user
      // alert('Enquiry ID copied to clipboard!');
      this.copyTextOne = true;
      setTimeout(() => {
        this.copyTextOne = false;
      }, 1000);
    } else {
      // alert('Failed to copy text.');
      this.copyTextOne = false;
    }
  }

  async getPropertyDetailsById(id: number) {
    try {
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation',
        );
        this.cancellationPolicyData = this.policies?.[0]?.cancellationPolicy;
        this.buildCancellationRuleRows();
        this.computeCancellationEstimate();
        this.calculateServiceHours();
        this.businessUser?.socialMediaLinks.forEach((element) => {
          this.socialmedialist = element;
        });

        this.token.saveProperty(this.businessUser);
        this.resolveActiveCurrency();

        this.businessServiceDto =
          this.businessUser?.businessServiceDtoList.find(
            (data) => data.name === this.businessUser.businessType,
          );

        if (this.businessUser.primaryColor !== undefined) {
          this.changeTheme(
            this.businessUser.primaryColor,
            this.businessUser.secondaryColor,
            this.businessUser.tertiaryColor,
          );
        }

        this.changeDetectorRefs.detectChanges();
      } else {
        this.router.navigate(['/404']);
      }
    } catch (error) {
      // Handle the error appropriately, if needed.
    }
  }

  changeTheme(primary?: string, secondary?: string, tertiary?: string) {
    // Default colors if none are passed
    const defaultPrimary = '#232A45'; // blue
    const defaultSecondary = '#0B01CC'; // green
    const defaultTertiary = '#fff'; // yellow

    const p = primary || defaultPrimary;
    const s = secondary || defaultSecondary;
    const t = tertiary || defaultTertiary;

    document.documentElement.style.setProperty('--primary', p);
    document.documentElement.style.setProperty('--secondary', s);
    document.documentElement.style.setProperty('--tertiary', t);
    document.documentElement.style.setProperty('--button-primary', t);

    document.documentElement.style.setProperty(
      '--primary-gradient',
      `linear-gradient(180deg, ${t}, ${s})`,
    );
    document.documentElement.style.setProperty(
      '--secondary-gradient',
      `linear-gradient(312deg, ${p}, ${s})`,
    );
    document.documentElement.style.setProperty(
      '--secondary-one-gradient',
      `linear-gradient(180deg, ${p}, ${s})`,
    );
    document.documentElement.style.setProperty(
      '--third-gradient',
      `linear-gradient(180deg, ${p}, ${s})`,
    );
  }

  private loadBookingsFromSession() {
    const bookedStr = sessionStorage.getItem('BookedEnquiryList');

    if (!bookedStr) {
      console.error('BookedEnquiryList not found');
      this.loadingData = false;
      return;
    }

    const bookedEnquiries = JSON.parse(bookedStr);

    if (!Array.isArray(bookedEnquiries) || bookedEnquiries.length === 0) {
      console.error('BookedEnquiryList is empty');
      this.loadingData = false;
      return;
    }

    this.bookingsResponseList = [];
    let completedCount = 0;

    bookedEnquiries.forEach((enquiry) => {
      const bookingId = enquiry.bookingId || enquiry.bookingReservationId;

      if (!bookingId) {
        completedCount++;
        return;
      }

      this.hotelBookingService.fetchBookingById(bookingId).subscribe({
        next: (booking) => {
          this.bookingsResponseList.push(booking);
        },
        error: (err) => {
          console.error('Booking fetch failed for:', bookingId, err);
        },
        complete: () => {
          completedCount++;
          if (completedCount === bookedEnquiries.length) {
            this.onAllBookingsLoaded();
          }
        },
      });
    });
  }

  calculateTotalGuestsFromPlans() {
    this.totalPlanAdults =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.adults || 0),
        0,
      );

    this.totalPlanChildren =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.children || 0),
        0,
      );

    this.totalPlanChildrenAboveAgeLimit =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.childrenAbove5years || 0),
        0,
      );

    this.totalPlanChildrenBelowAgeLimit =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.childrenBelow5years || 0),
        0,
      );
  }

  // ✅ NEW: Load calculation state from stored enquiries
  private loadCalculationStateFromEnquiries() {
    const bookedStr = sessionStorage.getItem('BookedEnquiryList');
    if (!bookedStr) {
      this.selectedAddOns = this.getSelectedAddOnsFromPersistedState();
      return;
    }

    try {
      const bookedEnquiries = JSON.parse(bookedStr);
      if (!Array.isArray(bookedEnquiries) || bookedEnquiries.length === 0) {
        this.selectedAddOns = this.getSelectedAddOnsFromPersistedState();
        return;
      }

      // Group totals are stored on every enquiry, so use the first one for the
      // payment state and aggregate only the per-room add-on lines below.
      const firstEnquiry = bookedEnquiries[0];

      this.couponDiscountPercentage = firstEnquiry.couponDiscountPercentage || 0;
      this.couponDiscountAmount = firstEnquiry.couponDiscountAmount || 0;
      this.advanceDiscountPercentage = firstEnquiry.advanceDiscountPercentage || 0;
      this.advanceDiscountAmount = firstEnquiry.advanceDiscountAmount || 0;
      this.advancePaymentPercentage = firstEnquiry.advancePaymentPercentage || 0;
      this.advancePaymentLabel = firstEnquiry.advancePaymentLabel || '';
      this.amountAfterDiscount = firstEnquiry.amountAfterDiscount || 0;
      this.taxOnDiscountedAmount = firstEnquiry.taxOnDiscountedAmount || 0;
      this.serviceChargePercentage = firstEnquiry.serviceChargePercentage || this.serviceChargePercentage;
      this.convenienceFeeAmount = firstEnquiry.convenienceFeeAmount || 0;
      this.selectedAddOns = this.resolveSelectedAddOns(bookedEnquiries);
      this.grandTotal = firstEnquiry.grandTotal || this.getNewGrandTotal();
      this.payNowAmount = firstEnquiry.payNowAmount || 0;
      this.balanceAtCheckIn = firstEnquiry.balanceAtCheckIn || 0;

      this.isPaid = this.advancePaymentPercentage === 100 || this.balanceAtCheckIn === 0;

    } catch (error) {
      console.warn('Error loading calculation state from enquiries:', error);
    }
  }

  private resolveSelectedAddOns(bookedEnquiries: any[]): any[] {
    if (this.hasConfirmedBooking()) {
      const addOnsFromBookings = this.getSelectedAddOnsFromBookings();
      if (addOnsFromBookings.length > 0) {
        return addOnsFromBookings;
      }
    }

    const addOnsFromQuotes = this.getSelectedAddOnsFromEnquiryQuotes(bookedEnquiries);
    if (addOnsFromQuotes.length > 0) {
      return addOnsFromQuotes;
    }

    const addOnsFromEnquiries = this.getSelectedAddOnsFromEnquiries(bookedEnquiries);
    if (addOnsFromEnquiries.length > 0) {
      return addOnsFromEnquiries;
    }

    const persistedAddOns = this.getSelectedAddOnsFromPersistedState();
    if (persistedAddOns.length > 0) {
      return persistedAddOns;
    }

    return this.getSelectedAddOnsFromBookings();
  }

  private hasConfirmedBooking(): boolean {
    if (!Array.isArray(this.bookingsResponseList) || this.bookingsResponseList.length === 0) {
      return false;
    }

    return this.bookingsResponseList.some((booking: any) =>
      this.isBookingConfirmed(booking),
    );
  }

  private isBookingConfirmed(booking: any): boolean {
    const bookingStatus = (booking?.bookingStatus || booking?.status || '')
      .toString()
      .trim()
      .toUpperCase();

    if (!bookingStatus) {
      return false;
    }

    return bookingStatus !== 'ENQUIRY' && bookingStatus !== 'PENDING';
  }

  private getSelectedAddOnsFromPersistedState(): any[] {
    const tokenSelectedServices = this.getSelectedAddOnsFromToken();
    if (tokenSelectedServices.length > 0) {
      return tokenSelectedServices;
    }

    const summarySelectedServices = this.getSelectedAddOnsFromBookingSummary();
    if (summarySelectedServices.length > 0) {
      return summarySelectedServices;
    }

    const sessionSelectedServices = this.getSelectedAddOnsFromSessionStorage();
    if (sessionSelectedServices.length > 0) {
      return sessionSelectedServices;
    }

    return [];
  }

  private getSelectedAddOnsFromToken(): any[] {
    try {
      const selectedServices = this.token.getSelectedServices();
      if (!Array.isArray(selectedServices)) {
        return [];
      }

      return this.aggregateAddOns(
        selectedServices.map((service: any) => this.normalizeAddOn(service)),
      );
    } catch (error) {
      return [];
    }
  }

  private getSelectedAddOnsFromBookingSummary(): any[] {
    const selectedServices = this.bookingSummaryDetails?.propertyServiceListDataOne;
    if (!Array.isArray(selectedServices)) {
      return [];
    }

    return this.aggregateAddOns(
      selectedServices.map((service: any) => this.normalizeAddOn(service)),
    );
  }

  private getSelectedAddOnsFromSessionStorage(): any[] {
    try {
      const storedAddOns = sessionStorage.getItem('SELECTED_SERVICE_DATA');
      if (!storedAddOns) {
        return [];
      }

      const selectedServices = JSON.parse(storedAddOns);
      if (!Array.isArray(selectedServices)) {
        return [];
      }

      return this.aggregateAddOns(
        selectedServices.map((service: any) => this.normalizeAddOn(service)),
      );
    } catch (error) {
      return [];
    }
  }

  private getSelectedAddOnsFromEnquiryQuotes(bookedEnquiries: any[]): any[] {
    const quoteAddOns = bookedEnquiries.flatMap((enquiry: any) =>
      this.parseServiceQuoteSummary(enquiry?.serviceQuoteSummary),
    );

    return this.aggregateAddOns(quoteAddOns);
  }

  private parseServiceQuoteSummary(serviceQuoteSummary: any): any[] {
    if (!serviceQuoteSummary) {
      return [];
    }

    try {
      const parsed =
        typeof serviceQuoteSummary === 'string'
          ? JSON.parse(serviceQuoteSummary)
          : serviceQuoteSummary;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((service: any) => this.normalizeAddOn(service));
    } catch (error) {
      console.warn('Invalid serviceQuoteSummary on booked enquiry:', error);
      return [];
    }
  }

  private getSelectedAddOnsFromEnquiries(bookedEnquiries: any[]): any[] {
    const enquiryAddOns = bookedEnquiries.flatMap((enquiry: any) => {
      const selectedServices = [
        ...(Array.isArray(enquiry?.selectedAddOns) ? enquiry.selectedAddOns : []),
        ...(Array.isArray(enquiry?.selectedServices) ? enquiry.selectedServices : []),
      ];

      return selectedServices.map((service: any) => this.normalizeAddOn(service));
    });

    return this.aggregateAddOns(enquiryAddOns);
  }

  private getSelectedAddOnsFromBookings(): any[] {
    if (!Array.isArray(this.bookingsResponseList) || this.bookingsResponseList.length === 0) {
      return [];
    }

    const bookingAddOns = this.bookingsResponseList.flatMap((booking: any) => {
      if (!Array.isArray(booking?.services)) {
        return [];
      }

      return booking.services.map((service: any) => this.normalizeAddOn(service));
    });

    return this.aggregateAddOns(bookingAddOns);
  }

  private normalizeAddOn(service: any): any {
    const quantity = this.toSafeQuantity(
      service?.quantityApplied ?? service?.quantity ?? service?.count ?? 1,
    );
    const servicePrice = this.toSafeAmount(
      service?.beforeTaxAmount ??
        service?.servicePrice ??
        service?.amount ??
        service?.netAmount ??
        0,
    );
    const unitPrice = this.toSafeAmount(
      service?.unitPrice ?? servicePrice / quantity,
    );
    const taxAmount = this.toSafeAmount(service?.taxAmount ?? 0);

    return {
      id: service?.id,
      name: service?.name || service?.serviceName || service?.serviceType || 'Service',
      quantity,
      unitPrice,
      servicePrice,
      taxAmount,
    };
  }

  private aggregateAddOns(addOns: any[]): any[] {
    const groupedAddOns = new Map<string, any>();

    addOns.forEach((addon) => {
      const key = this.getAddOnGroupKey(addon);
      const current = groupedAddOns.get(key);

      if (current) {
        current.quantity += this.toSafeQuantity(addon?.quantity);
        current.servicePrice = this.toSafeAmount(
          current.servicePrice + this.toSafeAmount(addon?.servicePrice),
        );
        current.taxAmount = this.toSafeAmount(
          current.taxAmount + this.toSafeAmount(addon?.taxAmount),
        );
        current.unitPrice = this.getAddOnBasePrice(current);
        return;
      }

      groupedAddOns.set(key, {
        ...addon,
        quantity: this.toSafeQuantity(addon?.quantity),
        unitPrice: this.toSafeAmount(addon?.unitPrice),
        servicePrice: this.toSafeAmount(addon?.servicePrice),
        taxAmount: this.toSafeAmount(addon?.taxAmount),
      });
    });

    return Array.from(groupedAddOns.values());
  }

  private getAddOnGroupKey(addon: any): string {
    const name = (addon?.name || addon?.serviceName || addon?.serviceType || '')
      .toString()
      .trim()
      .toLowerCase();

    return name || `${addon?.id || 'service'}`;
  }

  // ✅ NEW: Guard functions
  private toSafeAmount(value: any): number {
    const num = Number(value);
    return isFinite(num) ? num : 0;
  }

  private toSafeQuantity(value: any): number {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : 1;
  }

  getAddOnBasePrice(addon: any): number {
    const unitPrice = this.toSafeAmount(addon?.unitPrice);
    if (unitPrice > 0) {
      return unitPrice;
    }

    return this.toSafeAmount(
      this.toSafeAmount(addon?.servicePrice) / this.toSafeQuantity(addon?.quantity),
    );
  }

  private toSafePercent(value: any): number {
    const num = Number(value);
    return isFinite(num) && num >= 0 && num <= 100 ? num : 0;
  }

  isDayTripBooking(booking: any): boolean {
    return booking?.dayTrip === true || booking?.roomDetails?.dayTrip === true;
  }

  getBookingRoomTariffLabel(booking: any): string {
    return this.isDayTripBooking(booking) ? 'Day Trip' : 'Tariff';
  }

  getBookingNightsLabel(booking: any): string | number {
    return this.isDayTripBooking(booking) ? 'Single Day' : booking?.noOfNights;
  }

  getBookingDisplayCheckoutDate(booking: any): any {
    return this.isDayTripBooking(booking) ? booking?.fromDate : booking?.toDate;
  }

  getBookingRoomCountLabel(booking: any): string | number {
    return this.isDayTripBooking(booking) ? 1 : booking?.noOfRooms;
  }

  getDiscountColumnLabel(): string {
    if (this.specialDiscountData?.discountPercentage) {
      return 'Coupon / Promo';
    }
    return 'Discount';
  }

  getAccommodationSubtotalLabel(): string {
    if (this.getDisplayedCouponDiscountAmount() > 0 || this.getDisplayedAdvanceDiscountAmount() > 0) {
      return `Accommodation Subtotal (Before Discounts)`;
    }
    return `Accommodation Subtotal`;
  }

  private getDisplayedBookingBaseAmount(booking: any): number {
    if (this.isDayTripBooking(booking)) {
      return this.toSafeAmount(
        this.toSafeAmount(booking?.extraPersonCharge) +
          this.toSafeAmount(booking?.extraChildCharge),
      );
    }

    const roomTariff = this.toSafeAmount(booking?.roomTariffBeforeDiscount);
    const noOfRooms = this.toSafeAmount(booking?.noOfRooms);
    const noOfNights = this.toSafeAmount(booking?.noOfNights);
    const extraPerson = this.toSafeAmount(booking?.extraPersonCharge);
    const extraChild = this.toSafeAmount(booking?.extraChildCharge);

    const roomTotal = roomTariff * noOfRooms * noOfNights;
    const displayedSubtotal = roomTotal + extraPerson + extraChild;

    return this.toSafeAmount(
      displayedSubtotal > 0 ? displayedSubtotal : booking?.beforeTaxAmount,
    );
  }

  getDisplayedBookingSubtotal(booking: any): number {
    return this.toSafeAmount(
      Math.max(
        0,
        this.getDisplayedBookingBaseAmount(booking) -
          this.getDisplayedRowTotalDiscount(booking),
      ),
    );
  }

  getDisplayedBookingSubtotalWithoutDiscount(booking: any): number {
    return this.getDisplayedBookingBaseAmount(booking);
  }

  getDisplayedBookingTax(booking: any): number {
    return this.toSafeAmount(booking?.taxAmount);
  }

  getDisplayedBookingTotal(booking: any): number {
    return this.toSafeAmount(
      this.getDisplayedBookingSubtotal(booking) + this.getDisplayedBookingTax(booking),
    );
  }

  getDisplayedRoomSubtotal(): number {
    if (!this.bookingsResponseList || this.bookingsResponseList.length === 0) return 0;

    return this.toSafeAmount(
      this.bookingsResponseList.reduce(
        (sum, booking) => sum + this.getDisplayedBookingSubtotalWithoutDiscount(booking),
        0,
      ),
    );
  }

  getDisplayedRoomTax(): number {
    if (!this.bookingsResponseList || this.bookingsResponseList.length === 0) {
      return this.toSafeAmount(this.bookingSummaryDetails?.totalTax || 0);
    }
    return this.toSafeAmount(
      this.bookingsResponseList.reduce(
        (sum, booking) => sum + this.getDisplayedBookingTax(booking),
        0,
      ),
    );
  }

  getDisplayedAdvanceDiscountAmount(): number {
    if (this.advanceDiscountAmount > 0) {
      return this.toSafeAmount(this.advanceDiscountAmount);
    }
    if (this.advanceDiscountPercentage > 0) {
      const accommodationAfterCoupon =
        this.getDisplayedRoomSubtotal() - this.getDisplayedCouponDiscountAmount();

      return this.toSafeAmount(
        (Math.max(0, accommodationAfterCoupon) * this.advanceDiscountPercentage) / 100,
      );
    }
    return 0;
  }

  getDisplayedCouponDiscountAmount(): number {
    const discountPercentage = this.toSafePercent(this.specialDiscountData?.discountPercentage);
    if (discountPercentage > 0) {
      return this.toSafeAmount(
        (this.getDisplayedRoomSubtotal() * discountPercentage) / 100,
      );
    }
    return 0;
  }

  getDisplayedAccommodationAfterDiscounts(): number {
    return this.toSafeAmount(
      Math.max(
        0,
        this.getDisplayedRoomSubtotal() -
          this.getDisplayedCouponDiscountAmount() -
          this.getDisplayedAdvanceDiscountAmount(),
      ),
    );
  }

  getDisplayedConvenienceFee(): number {
    // Prefer convenienceFeeAmount (stored from checkout flow) over recomputing.
    if (this.convenienceFeeAmount > 0) {
      return this.toSafeAmount(this.convenienceFeeAmount);
    }
    return this.calculateConvenienceFee(
      this.getDisplayedAccommodationAfterDiscounts(),
      this.toSafePercent(this.serviceChargePercentage),
    );
  }

  getDisplayedRowAdvanceDiscount(booking: any): number {
    const rowBeforeTax = this.getDisplayedBookingBaseAmount(booking);
    const rowCouponDiscount = this.getDisplayedRowCouponDiscount(booking);
    const rowAfterCoupon = Math.max(0, rowBeforeTax - rowCouponDiscount);
    const totalBeforeAdvance =
      this.getDisplayedRoomSubtotal() - this.getDisplayedCouponDiscountAmount();
    const totalAdvanceDiscount = this.getDisplayedAdvanceDiscountAmount();

    if (rowAfterCoupon <= 0 || totalBeforeAdvance <= 0 || totalAdvanceDiscount <= 0) {
      return 0;
    }

    return this.toSafeAmount(
      (totalAdvanceDiscount * rowAfterCoupon) / totalBeforeAdvance,
    );
  }

  getDisplayedRowCouponDiscount(booking: any): number {
    const rowBeforeDiscounts = this.getDisplayedBookingBaseAmount(booking);
    const totalBeforeDiscounts = this.getDisplayedRoomSubtotal();
    const totalCouponDiscount = this.getDisplayedCouponDiscountAmount();

    if (rowBeforeDiscounts <= 0 || totalBeforeDiscounts <= 0 || totalCouponDiscount <= 0) {
      return 0;
    }

    return this.toSafeAmount(
      (totalCouponDiscount * rowBeforeDiscounts) / totalBeforeDiscounts,
    );
  }

  getDisplayedRowTotalDiscount(booking: any): number {
    return this.toSafeAmount(
      this.getDisplayedRowCouponDiscount(booking) +
        this.getDisplayedRowAdvanceDiscount(booking),
    );
  }

  getDisplayedRowAfterDiscounts(booking: any): number {
    return this.getDisplayedBookingSubtotal(booking);
  }

  getDisplayedRowTax(booking: any): number {
    const authoritativeRoomTax = this.getDisplayedRoomTax();
    const totalAfterDiscounts = this.getDisplayedAccommodationAfterDiscounts();
    const rowAfterDiscounts = this.getDisplayedRowAfterDiscounts(booking);

    if (authoritativeRoomTax <= 0 || totalAfterDiscounts <= 0 || rowAfterDiscounts <= 0) {
      return 0;
    }

    return this.toSafeAmount(
      (authoritativeRoomTax * rowAfterDiscounts) / totalAfterDiscounts,
    );
  }

  getDisplayedRowTotal(booking: any): number {
    return this.toSafeAmount(
      this.getDisplayedRowAfterDiscounts(booking) + this.getDisplayedRowTax(booking),
    );
  }

  // Unified calculation helpers based on displayed voucher values
  getNewGrandTotal(): number {
  if (this.grandTotal > 0) {
    return this.toSafeAmount(this.grandTotal);
  }
  return this.toSafeAmount(
    this.getDisplayedAccommodationAfterDiscounts() +
      this.getDisplayedRoomTax() +
      this.getServicesTotal() +
      this.getDisplayedConvenienceFee()
  );
}

  getNewPayNowAmount(): number {
  if (this.payNowAmount > 0) {
    return this.toSafeAmount(this.payNowAmount);
  }
  if (this.advancePaymentPercentage > 0) {
    const advancePct = this.toSafePercent(this.advancePaymentPercentage) / 100;
    const roomsWithTax =
      this.getDisplayedAccommodationAfterDiscounts() + this.getDisplayedRoomTax();
    return this.toSafeAmount(
      (roomsWithTax + this.getDisplayedConvenienceFee()) * advancePct +
        this.getServicesTotal()
    );
  }
  return this.getNewGrandTotal();
}


  getNewBalanceAtCheckIn(): number {
  if (this.balanceAtCheckIn > 0) {
    return this.toSafeAmount(this.balanceAtCheckIn);
  }
  if (this.advancePaymentPercentage > 0) {
    return this.toSafeAmount(
      Math.max(0, this.getNewGrandTotal() - this.getNewPayNowAmount())
    );
  }
  return 0;
}

  // isPaid(): boolean {
  //   return this.getNewBalanceAtCheckIn() === 0;
  // }

  hasSelectedAdvancePaymentPlan(): boolean {
    return this.advancePaymentPercentage > 0;
  }

  getServicesTotal(): number {
    if (!this.selectedAddOns || this.selectedAddOns.length === 0) return 0;
    return this.toSafeAmount(
      this.selectedAddOns.reduce(
        (sum, addon) =>
          sum +
          this.toSafeAmount(addon?.servicePrice) +
          this.toSafeAmount(addon?.taxAmount),
        0
      )
    );
  }

  getServicesSubtotal(): number {
    if (!this.selectedAddOns || this.selectedAddOns.length === 0) return 0;
    return this.toSafeAmount(
      this.selectedAddOns.reduce(
        (sum, addon) => sum + this.toSafeAmount(addon?.servicePrice),
        0,
      )
    );
  }

  getServicesTax(): number {
    if (!this.selectedAddOns || this.selectedAddOns.length === 0) return 0;
    return this.toSafeAmount(
      this.selectedAddOns.reduce(
        (sum, addon) => sum + this.toSafeAmount(addon?.taxAmount),
        0,
      )
    );
  }
  private onAllBookingsLoaded() {
    sessionStorage.setItem(
      'bookingsResponseList',
      JSON.stringify(this.bookingsResponseList),
    );

    this.loadingData = false;
  }
  callNow() {
    const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
    this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
    if (this.businessUser?.mobile && this.websiteUrlBookingEngine) {
      window.location.href = 'tel:' + this.businessUser?.mobile;
    } else {
      window.location.href = 'tel:' + 7326079861;
    }
  }

  onGenerateVouchers() {
    if (!this.bookingsResponseList || this.bookingsResponseList.length === 0) {
      console.warn('No booking details found');
      return;
    }

    this.bookingsResponseList.forEach((booking: any) => {
      this.hotelBookingService.generateBookingVoucher(booking.id).subscribe({
        next: (response) => {
          console.log(
            `Voucher generated for bookingId ${booking.id}:`,
            response,
          );

          if (response.voucherUrl) {
            // ✅ Call backend API to download directly
            this.hotelBookingService
              .downloadVoucher(response.voucherUrl)
              .subscribe({
                next: (blob) => {
                  const downloadUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `voucher-${booking.id}.pdf`; // filename
                  a.click();
                  window.URL.revokeObjectURL(downloadUrl);
                },
                error: (err) => {
                  console.error(
                    `Error downloading voucher for bookingId ${booking.id}:`,
                    err,
                  );
                },
              });
          }
        },
        error: (err) => {
          console.error(
            `Error generating voucher for bookingId ${booking.id}:`,
            err,
          );
        },
      });
    });
  }

  private parsePolicyDurationToHours(value: string): number {
    const upper = String(value || '').toUpperCase();
    if (upper === 'P-INF') return Number.POSITIVE_INFINITY;
    const match = upper.match(/^P-(\d+)H$/);
    return match ? Number(match[1]) : 0;
  }

  private formatChargeLabel(type: string, value: number): string {
    const normalized = String(type || '').toLowerCase();
    const safeValue = Number(value || 0);
    if (normalized === 'none') return 'No deduction';
    if (normalized === 'full') return '100% deduction';
    if (normalized === 'fixed') return `Fixed Rs. ${safeValue}`;
    return `${safeValue}% deduction`;
  }

  private formatPolicyWindow(from: string, to: string): string {
    const parse = (value: string) => {
      const upper = String(value || '').toUpperCase();
      if (upper === 'P-INF') return 'Anytime';
      const match = upper.match(/^P-(\d+)H$/);
      return match ? `${match[1]}h` : upper;
    };
    const fromText = parse(from);
    const toText = parse(to);
    if (String(from || '').toUpperCase() === 'P-INF') return `Before ${toText}`;
    return `${fromText} to ${toText} before check-in`;
  }

  private buildCancellationRuleRows() {
    const rules = this.cancellationPolicyData?.rules || [];
    this.cancellationRuleRows = rules.map((rule: any) => ({
      window: this.formatPolicyWindow(rule?.from, rule?.to),
      chargeLabel: this.formatChargeLabel(rule?.charge_type, Number(rule?.charge_value || 0)),
    }));
  }

  private calculateCancellationDeduction(baseAmount: number, chargeType: string, chargeValue: number): number {
    const safeBase = Math.max(0, Number(baseAmount || 0));
    const normalized = String(chargeType || '').toLowerCase();
    const value = Number(chargeValue || 0);
    if (normalized === 'none') return 0;
    if (normalized === 'full') return safeBase;
    if (normalized === 'fixed') return Math.min(value, safeBase);
    return Math.min((safeBase * Math.max(0, value)) / 100, safeBase);
  }

  private getCancellationChargeAmount(): number {
    const booking = this.bookingsResponseList?.[0] || {};
    const bookingSummary = this.bookingSummaryDetails || {};
    const bookingCommission = this.toSafeAmount(
      booking?.convenienceFee ??
        booking?.convenienceFeeAmount ??
        booking?.bookingCommissionAmount ??
        booking?.commissionAmount ??
        bookingSummary?.convenienceFee ??
        bookingSummary?.convenienceFeeAmount ??
        bookingSummary?.bookingCommissionAmount ??
        bookingSummary?.commissionAmount ??
        this.convenienceFeeAmount ??
        0,
    );

    if (bookingCommission > 0) {
      return bookingCommission;
    }

    return this.toSafeAmount(this.getDisplayedConvenienceFee());
  }


  private getCancellationBookingAmount(): number {
    const booking = this.bookingsResponseList?.[0] || {};
    const bookingSummary = this.bookingSummaryDetails || {};
    return this.toSafeAmount(
      booking?.advanceAmount ??
        bookingSummary?.advanceAmount ??
        this.getNewPayNowAmount() ??
        booking?.totalPaymentAmount ??
        booking?.totalAmount ??
        bookingSummary?.grandTotal ??
        bookingSummary?.totalAmount ??
        this.grandTotal ??
        0,
    );
  }

  private getCancellationPaidAmount(
    cancellationBookingAmount: number,
    bookingTotalAmount: number,
  ): number {
    const booking = this.bookingsResponseList?.[0] || {};
    const bookingSummary = this.bookingSummaryDetails || {};

    return this.toSafeAmount(
      this.getNewPayNowAmount() ||
        booking?.advanceAmount ||
        bookingSummary?.advanceAmount ||
        cancellationBookingAmount ||
        bookingTotalAmount,
    );
  }
  private computeCancellationEstimate() {
    const policy = this.cancellationPolicyData;
    const checkInDate = this.bookingSummaryDetails?.fromDate || this.bookingsResponseList?.[0]?.fromDate;
    const bookingTotalAmount = this.toSafeAmount(this.getNewGrandTotal());
    const cancellationBookingAmount = this.getCancellationBookingAmount();
    const cancellationChargeAmount = this.getCancellationChargeAmount();
    const cancellationBaseAmount = Math.max(0, cancellationBookingAmount - cancellationChargeAmount);

    if (!policy?.enabled || !checkInDate || cancellationBaseAmount <= 0) {
      this.cancellationEstimate = null;
      return;
    }

    const serviceStart = new Date(checkInDate);
    if (Number.isNaN(serviceStart.getTime())) {
      this.cancellationEstimate = null;
      return;
    }

    const hoursBeforeStart = Math.max(0, (serviceStart.getTime() - Date.now()) / (1000 * 60 * 60));
    const matchedRule = (policy?.rules || []).find((rule: any) => {
      const fromH = this.parsePolicyDurationToHours(rule?.from);
      const toH = this.parsePolicyDurationToHours(rule?.to);
      const maxH = Number.isFinite(fromH) ? fromH : Number.POSITIVE_INFINITY;
      return hoursBeforeStart <= maxH && hoursBeforeStart >= toH;
    });

    const chargeType = matchedRule?.charge_type || policy?.no_show_charge_type || 'none';
    const chargeValue = Number(matchedRule?.charge_value ?? policy?.no_show_charge_value ?? 0);
    const policyPenaltyAmount = this.calculateCancellationDeduction(
      cancellationBaseAmount,
      chargeType,
      chargeValue,
    );
    const paidAmount = this.getCancellationPaidAmount(
      cancellationBookingAmount,
      bookingTotalAmount,
    );
    const totalPenaltyAmount = policyPenaltyAmount + cancellationChargeAmount;
    const deductionAmount = Math.min(totalPenaltyAmount, paidAmount);
    const refundableAmount = Math.max(paidAmount - deductionAmount, 0);
    const dueAmount = Math.max(totalPenaltyAmount - paidAmount, 0);

    this.cancellationEstimate = {
      deductionAmount,
      refundableAmount,
      dueAmount,
      chargeLabel: this.formatChargeLabel(chargeType, chargeValue),
    };
  }

  resolveActiveCurrency() {
    if (!this.exchangeRates) {
      this.currency = (this.businessUser && this.businessUser.localCurrency) ? this.businessUser.localCurrency.toUpperCase() : 'INR';
      return;
    }

    const queryCurrency = this.acRoute.snapshot.queryParams['currency'] || this.acRoute.snapshot.queryParams['userCurrency'];
    if (queryCurrency) {
      this.currency = queryCurrency.toUpperCase();
      try {
        sessionStorage.setItem('selected_currency', this.currency);
      } catch (e) {
        console.error('Error writing to sessionStorage selected_currency:', e);
      }
      return;
    }

    const queryCountry = this.acRoute.snapshot.queryParams['country'];
    if (queryCountry) {
      const countryCurrency = this.getCurrencyFromCountry(queryCountry);
      if (countryCurrency) {
        this.currency = countryCurrency;
        try {
          sessionStorage.setItem('selected_currency', this.currency);
        } catch (e) {
          console.error('Error writing to sessionStorage selected_currency:', e);
        }
        return;
      }
    }

    const savedCurrency = sessionStorage.getItem('selected_currency');
    if (savedCurrency) {
      this.currency = savedCurrency.toUpperCase();
    } else {
      this.currency = (this.businessUser && this.businessUser.localCurrency) ? this.businessUser.localCurrency.toUpperCase() : 'INR';
    }
  }

  getCurrencyFromCountry(country: string): string {
    const mapping = {
      'US': 'USD',
      'IN': 'INR',
      'AU': 'AUD',
      'NZ': 'NZD',
      'GB': 'GBP',
      'EU': 'EUR',
      'CA': 'CAD',
      'BD': 'BDT'
    };
    return mapping[country.toUpperCase()] || null;
  }
}



