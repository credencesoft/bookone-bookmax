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
     
if (savedLabel) {
  try {
    const parsedData = JSON.parse(savedLabel);    
    this.roomLabel = parsedData.fullLabel || parsedData.label || 'Room';
    
  } catch (e) {
    this.roomLabel = savedLabel || 'Room';
    console.error("Error parsing label, using raw value instead", e);
  }
} else {
  this.roomLabel = 'Room';
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
    }, 10);
  }
  private sequenceBookingConfirmation() {
    this.loadingData = true;
    const cachedBookings = sessionStorage.getItem('bookingsResponseList');
    if (cachedBookings) {
      this.bookingsResponseList = JSON.parse(cachedBookings);
      this.loadingData = false;
      return;
    }
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

    this.fetchBookingsSequentially(bookedEnquiries);
  }
  private fetchBookingsSequentially(bookedEnquiries: any[]) {
    this.bookingsResponseList = [];
    this.loadingData = true;

    let index = 0;
    let fetchedBookingId: number | null = null;

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
      // If booking already fetched once, don't fetch again
      if (fetchedBookingId === bookingId) {
        next();
        return;
      }

      fetchedBookingId = bookingId;

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
