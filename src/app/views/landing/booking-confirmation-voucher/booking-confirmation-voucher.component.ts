import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';

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

  constructor(
    private http: HttpClient,
    private token: TokenStorage,
    private hotelBookingService: HotelBookingService,
    private listingService: ListingService,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
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
    this.sequenceBookingConfirmation();

    const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
    if (bookingDataDetails) {
      this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
      this.calculateTotalGuestsFromPlans();
    }
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
        this.calculateServiceHours();
        this.businessUser?.socialMediaLinks.forEach((element) => {
          this.socialmedialist = element;
        });

        this.token.saveProperty(this.businessUser);
        this.currency = this.businessUser.localCurrency.toUpperCase();

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
  }

  // ✅ NEW: Load calculation state from stored enquiries
  private loadCalculationStateFromEnquiries() {
    const bookedStr = sessionStorage.getItem('BookedEnquiryList');
    if (!bookedStr) return;

    try {
      const bookedEnquiries = JSON.parse(bookedStr);
      if (!Array.isArray(bookedEnquiries) || bookedEnquiries.length === 0) return;

      // Use the first enquiry's calculation state for now (can be enhanced for multiple bookings)
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
      this.grandTotal = firstEnquiry.grandTotal || this.getNewGrandTotal();
      this.payNowAmount = firstEnquiry.payNowAmount || 0;
      this.balanceAtCheckIn = firstEnquiry.balanceAtCheckIn || 0;
      this.selectedAddOns = this.resolveSelectedAddOns(firstEnquiry);

      this.isPaid = this.advancePaymentPercentage === 100 || this.balanceAtCheckIn === 0;

    } catch (error) {
      console.warn('Error loading calculation state from enquiries:', error);
    }
  }

  private resolveSelectedAddOns(firstEnquiry: any): any[] {
    if (Array.isArray(firstEnquiry?.selectedAddOns) && firstEnquiry.selectedAddOns.length > 0) {
      return firstEnquiry.selectedAddOns;
    }
    return this.getSelectedAddOnsFromBookings();
  }

  private getSelectedAddOnsFromBookings(): any[] {
    if (!Array.isArray(this.bookingsResponseList) || this.bookingsResponseList.length === 0) {
      return [];
    }

    return this.bookingsResponseList.flatMap((booking: any) => {
      if (!Array.isArray(booking?.services)) {
        return [];
      }

      return booking.services.map((service: any) => ({
        name: service?.name || service?.serviceType || 'Service',
        quantity: this.toSafeQuantity(service?.quantityApplied ?? service?.count ?? 1),
        servicePrice: this.toSafeAmount(service?.servicePrice ?? service?.beforeTaxAmount ?? 0),
        taxAmount: this.toSafeAmount(service?.taxAmount ?? 0),
      }));
    });
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

  private toSafePercent(value: any): number {
    const num = Number(value);
    return isFinite(num) && num >= 0 && num <= 100 ? num : 0;
  }

  getDiscountColumnLabel(): string {
    if (this.specialDiscountData?.discountPercentage) {
      return 'Coupon / Promo';
    }
    return 'Discount';
  }

  getAccommodationSubtotalLabel(): string {
    if (this.getDisplayedAdvanceDiscountAmount() > 0) {
      return `Accommodation Subtotal (Before Advance Discount)`;
    }
    return `Accommodation Subtotal`;
  }

  getDisplayedBookingSubtotal(booking: any): number {
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
        (sum, booking) => sum + this.getDisplayedBookingSubtotal(booking),
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
      return this.toSafeAmount(
        (this.getDisplayedRoomSubtotal() * this.advanceDiscountPercentage) / 100,
      );
    }
    return 0;
  }

  getDisplayedAccommodationAfterDiscounts(): number {
    return this.toSafeAmount(
      Math.max(0, this.getDisplayedRoomSubtotal() - this.getDisplayedAdvanceDiscountAmount()),
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
    const rowBeforeTax = this.getDisplayedBookingSubtotal(booking);
    const totalBeforeAdvance = this.getDisplayedRoomSubtotal();
    const totalAdvanceDiscount = this.getDisplayedAdvanceDiscountAmount();

    if (rowBeforeTax <= 0 || totalBeforeAdvance <= 0 || totalAdvanceDiscount <= 0) {
      return 0;
    }

    return this.toSafeAmount(
      (totalAdvanceDiscount * rowBeforeTax) / totalBeforeAdvance,
    );
  }

  getDisplayedRowTotalDiscount(booking: any): number {
    // Table discount column intentionally shows coupon/promo only.
    // Advance discount remains in footer summary lines.
    return this.toSafeAmount(booking?.couponDiscountAmount || 0);
  }

  getDisplayedRowAfterDiscounts(booking: any): number {
    const rowBeforeTax = this.getDisplayedBookingSubtotal(booking);
    const rowCouponDiscount = this.getDisplayedRowTotalDiscount(booking);
    return this.toSafeAmount(Math.max(0, rowBeforeTax - rowCouponDiscount));
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
    return this.toSafeAmount(
      this.getDisplayedAccommodationAfterDiscounts() +
        this.getDisplayedRoomTax() +
        this.getServicesTotal() +
        this.getDisplayedConvenienceFee()
    );
  }

  getNewPayNowAmount(): number {
    if (this.advancePaymentPercentage > 0) {
      const advancePct = this.toSafePercent(this.advancePaymentPercentage) / 100;
      const roomsWithTax = this.getDisplayedAccommodationAfterDiscounts() + this.getDisplayedRoomTax();
      return this.toSafeAmount(
        (roomsWithTax * advancePct) + this.getServicesTotal() + this.getDisplayedConvenienceFee(),
      );
    }
    return this.getNewGrandTotal();
  }

  getNewBalanceAtCheckIn(): number {
    if (this.advancePaymentPercentage > 0) {
      return this.toSafeAmount(Math.max(0, this.getNewGrandTotal() - this.getNewPayNowAmount()));
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
        (sum, addon) => sum + ((addon.servicePrice || 0) + (addon.taxAmount || 0)),
        0
      )
    );
  }

  getServicesSubtotal(): number {
    if (!this.selectedAddOns || this.selectedAddOns.length === 0) return 0;
    return this.toSafeAmount(
      this.selectedAddOns.reduce((sum, addon) => sum + (addon.servicePrice || 0), 0)
    );
  }

  getServicesTax(): number {
    if (!this.selectedAddOns || this.selectedAddOns.length === 0) return 0;
    return this.toSafeAmount(
      this.selectedAddOns.reduce((sum, addon) => sum + (addon.taxAmount || 0), 0)
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
}
