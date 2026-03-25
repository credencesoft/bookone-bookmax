import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/model/booking';
import { BusinessOfferDto } from 'src/app/model/businessOfferDto';
import { BusinessUser } from 'src/app/model/user';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-paylater-confirm',
  templateUrl: './paylater-confirm.component.html',
  styleUrls: ['./paylater-confirm.component.scss'],
})
export class PaylaterConfirmComponent {
  propertyDetails: any;
  booking: any;
  promocodeListChip: any[] = []; // Used for handled to get the promo list and stored in this variable.
  textToCopy: string = 'This is some text to copy';
  textToCopyOne: string = 'This is some text to copy';
  smartRecommendations: any;
  specialDiscountPercentage: any;
  specialDiscountData: any;
  smartLoading: boolean = true;
  savedServices: any;
  taxPercentage: number;
  currency: any;
  businessOfferDto: BusinessOfferDto;
  showMore: boolean = false;
  storedPromo: string;
  selectedPromo: any;
  accommodationCheckInTime: any;
  accommodationService: any;
  bookingone: Booking;
  copyTextOne: boolean = false;
  businessUser: BusinessUser;
  isReadMore: boolean[] = [];
  policies = [];
  loader: boolean;
  PropertyUrl: string;
  propertyServiceListData: any[] = [];
  bookingSummaryDetails: any;
  totalPlanAdults: number = 0;
  totalPlanChildren: number = 0;
  bookingsResponseList: any;
  expanded: boolean = false;
    url: string;
    activeGoogleCenter: boolean = false;
    totalDiscount = 0;
  websiteUrlBookingEngine: boolean = false;
    roomLabel: string = 'Room';
  constructor(
    private token: TokenStorage,
    private hotelBookingService: HotelBookingService,
    private listingService: ListingService,
    private router: Router
  ) {
    this.businessOfferDto = new BusinessOfferDto();
    this.businessUser = new BusinessUser();
    this.PropertyUrl = this.token.getPropertyUrl();
    this.propertyDetails = this.token.getProperty();
    this.bookingone = this.token.getBookingData();
    this.booking = this.token.getBookingDataObj();
    const couponCodeValues = sessionStorage.getItem('selectedPromoData');

      if (couponCodeValues) {
        const parsed = JSON.parse(couponCodeValues); // convert to object
        this.specialDiscountData = JSON.parse(couponCodeValues);
          console.log("this.privatePromotionData", this.specialDiscountData);
      if (parsed.discountPercentage) {
            this.specialDiscountPercentage = parsed.discountPercentage;
          }
      }
    if (this.bookingone.taxDetails?.length > 0) {
      this.bookingone.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;

          if (element.taxSlabsList.length > 0) {
            element.taxSlabsList.forEach((element2) => {
              if (
                element2.maxAmount > this.booking.roomPrice &&
                element2.minAmount < this.booking.roomPrice
              ) {
                this.taxPercentage = element2.percentage;
                this.booking.taxPercentage = this.taxPercentage;
              } else if (element2.maxAmount < this.booking.roomPrice) {
                this.taxPercentage = element2.percentage;
                this.booking.taxPercentage = this.taxPercentage;
              }
            });
          }
        }
      });

      // this.taxPercentage = this.booking.taxDetails[0].percentage;
    }
    this.savedServices = this.token.getSelectedServices();
    this.currency = this.propertyDetails.localCurrency.toUpperCase();
    this.storedPromo = localStorage.getItem('selectPromo');
    if (this.storedPromo == 'true') {
      const selectedPromoData = JSON.parse(
        localStorage.getItem('selectedPromoData')
      );
      this.selectedPromo = selectedPromoData;
      // this.businessOfferDto = selectedPromoData
      // console.log(selectedPromoData);
    } else {
      this.getOfferDetails();
    }

    this.calculateServiceHours();
    this.isReadMore = this.policies.map(() => false);
    if (
      this.booking?.propertyId != null &&
      this.booking?.propertyId != undefined
    ) {
      this.getPropertyDetailsById(this.booking.propertyId);
      // console.log('this.booking.proprtyId', this.booking.propertyId);
    }
      setInterval(() => {
    this.loadBookingSessionData();
    this.checkBookingEngineFlag();
  }, 10);

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

  ngOnInIt() {

  }
  loadBookingSessionData(): void {
  const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
  if (bookingDataDetails) {
    this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
    this.calculateTotalGuestsFromPlans();
    // console.log('bookingSummaryDetails', this.bookingSummaryDetails);
  }

  const bookingsResponseList = sessionStorage.getItem('bookingsResponseList');
  if (bookingsResponseList) {
    this.bookingsResponseList = JSON.parse(bookingsResponseList);
          this.totalDiscount = this.bookingsResponseList.reduce(
    (sum, booking) => sum + (booking.discountAmount || 0),
    0
  );
    this.calculateTotalGuestsFromPlans();
    // console.log('bookingsResponseList', this.bookingsResponseList);
  }
}
getTrimmedDescription(description: string): string {
  if (!description) return '';

  const words = description.split(/\s+/); // split by spaces
  if (words.length <= 35) {
    return description;
  }

  return words.slice(0, 35).join(' ') + '...';
}
checkBookingEngineFlag(): void {
  const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
  this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
}
callNow() {
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
        console.log(`Voucher generated for bookingId ${booking.id}:`, response);

        if (response.voucherUrl) {
          // ✅ Call backend API to download directly
          this.hotelBookingService.downloadVoucher(response.voucherUrl).subscribe({
            next: (blob) => {
              const downloadUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `voucher-${booking.id}.pdf`; // filename
              a.click();
              window.URL.revokeObjectURL(downloadUrl);
            },
            error: (err) => {
              console.error(`Error downloading voucher for bookingId ${booking.id}:`, err);
            }
          });
        }
      },
      error: (err) => {
        console.error(`Error generating voucher for bookingId ${booking.id}:`, err);
      }
    });
  });
}




  calculateServiceHours() {
    this.accommodationService =
      this.propertyDetails.businessServiceDtoList.filter(
        (service) => service.name === 'Accommodation'
      );
    console.log(
      ' this.accommodationService' + JSON.stringify(this.accommodationService)
    );
  }
  toggleViewMore(event: Event): void {
    event.preventDefault();
    this.expanded = !this.expanded;
  }
    ngOnDestroy() {
    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('BOOKINGDATAOJC');
    sessionStorage.removeItem('bookingSummary');
    sessionStorage.removeItem('EnquiryResponseList');
    sessionStorage.removeItem('selectedPromoData');
    window.location.href = this.PropertyUrl;
  }
  backone() {
    window.location.href = this.PropertyUrl;
    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('BOOKINGDATAOJC');
    sessionStorage.removeItem('bookingSummary');
    sessionStorage.removeItem('EnquiryResponseList');
        sessionStorage.clear();
  }

  // Strip HTML and get first 20 words, then wrap in a span
  getFirstWords(html: string, wordLimit: number): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    const words = textContent.split(/\s+/);
    const firstWords = words.slice(0, wordLimit).join(' ');

    return `<span>${firstWords}...</span>`;
  }

  // Check if more than 20 words exist
  shouldShowViewMore(html: string): boolean {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.trim().split(/\s+/).length > 20;
  }
  calculateTotalGuestsFromPlans() {
    this.totalPlanAdults =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.adults || 0),
        0
      );

    this.totalPlanChildren =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.children || 0),
        0
      );
  }
  async getPropertyDetailsById(id: number) {
    // debugger
    this.url = this.token.getBookingEngineBoolean();
    if (this.url === 'googlehotelcenter') {
      this.activeGoogleCenter = true;
    }
    try {
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation'
        );

        this.businessUser.propertyServicesList.forEach((ele) => {
          if (ele.id != null && ele.id != undefined) {
            this.propertyServiceListData.push(ele);
          }
        });
                if (this.businessUser.primaryColor !== undefined) {
          this.changeTheme(
            this.businessUser.primaryColor,
            this.businessUser.secondaryColor,
            this.businessUser.tertiaryColor
          );
        }
      } else {
        this.router.navigate(['/404']);
      }
    } catch (error) {
      this.loader = false;
      // Handle the error appropriately, if needed.
    }
  }

    changeTheme(primary?: string, secondary?: string, tertiary?: string) {
  // Default colors if none are passed
  const defaultPrimary = "#232A45";   // blue
  const defaultSecondary = "#0B01CC"; // green
  const defaultTertiary = "#fff";  // yellow

  const p = primary || defaultPrimary;
  const s = secondary || defaultSecondary;
  const t = tertiary || defaultTertiary;

  document.documentElement.style.setProperty('--primary', p);
  document.documentElement.style.setProperty('--secondary', s);
  document.documentElement.style.setProperty('--tertiary', t);
  document.documentElement.style.setProperty('--button-primary', t);

  document.documentElement.style.setProperty(
    '--primary-gradient',
    `linear-gradient(180deg, ${t}, ${s})`
  );
  document.documentElement.style.setProperty(
    '--secondary-gradient',
    `linear-gradient(312deg, ${p}, ${s})`
  );
  document.documentElement.style.setProperty(
    '--secondary-one-gradient',
    `linear-gradient(180deg, ${p}, ${s})`
  );
  document.documentElement.style.setProperty(
    '--third-gradient',
    `linear-gradient(180deg, ${p}, ${s})`
  );
}
  toggleReadMore(index: number) {
    // Toggle the read more/less flag for the clicked policy
    this.isReadMore[index] = !this.isReadMore[index];
  }

  copyText() {
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
  copyTextone() {
    // Find the element
    const textToCopyOne = document
      .getElementById('textToCopyOne')
      ?.innerText.trim();

    if (textToCopyOne) {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = textToCopyOne;

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
  getOfferDetails() {
    this.hotelBookingService
      .getOfferDetailsBySeoFriendlyName(this.propertyDetails.seoFriendlyName)
      .subscribe((data) => {
        this.businessOfferDto = data.body;
        this.promocodeListChip = this.checkValidCouponOrNot(data.body);
      });
  }
  // Used For handled to check coupons are valid ot not.
  checkValidCouponOrNot(couponList?) {
    try {
      const currentDate = new Date();
      const validCoupons = [];
      couponList.forEach((coupon) => {
        if (coupon.startDate && coupon.endDate && coupon.discountPercentage) {
          const startDate = new Date(coupon.startDate);
          const endDate = new Date(coupon.endDate);
          // Check if the current date is within the start and end date
          if (
            currentDate >= startDate &&
            currentDate <= endDate &&
            coupon.discountPercentage != 100
          ) {
            validCoupons.push(coupon);
          }
        }
      });
      return validCoupons;
    } catch (error) {
      console.error('Error in checkValidCouponOrNot : ', error);
    }
  }
  toggleView(): void {
    this.showMore = !this.showMore;
  }
}
