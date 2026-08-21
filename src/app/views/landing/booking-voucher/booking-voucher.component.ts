import { Booking } from './../../../model/booking';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessOfferDto } from 'src/app/model/businessOfferDto';
import { BusinessUser } from 'src/app/model/user';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-booking-voucher',
  templateUrl: './booking-voucher.component.html',
  styleUrls: ['./booking-voucher.component.scss'],
})
export class BookingVoucherComponent {
  propertyDetails: any;
  PropertyUrl: string;
  booking: any;
  promocodeListChip: any[] = []; // Used for handled to get the promo list and stored in this variable.

  savedServices: any;
  currency: any;
  businessOfferDto: BusinessOfferDto;
  showMore: boolean = false;
  storedPromo: string;
  selectedPromo: any;
  loader: boolean;
  policies = [];
  accommodationCheckInTime: any;
  accommodationService: any;
  copyTextOne: boolean = false;
  isReadMore: boolean[] = [];
  businessUser: BusinessUser;
  propertyServiceListData: any[] = [];
  textToCopy: string = 'This is some text to copy';
  bookingSummaryDetails: any;
  totalPlanAdults: number = 0;
  totalPlanChildren: number = 0;
  totalPlanChildrenAboveAgeLimit: number = 0;
  totalPlanChildrenBelowAgeLimit: number = 0;
  bookingsResponseList: any;
  expanded: boolean = false;
    totalDiscount = 0;
      websiteUrlBookingEngine: boolean = false;
  roomLabel: string = 'Room';
  constructor(
    private token: TokenStorage,
    private hotelBookingService: HotelBookingService,
    private listingService: ListingService,
    private router: Router,
    private acRoute: ActivatedRoute
  ) {
    this.businessOfferDto = new BusinessOfferDto();
    this.businessUser = new BusinessUser();
    this.propertyDetails = this.token.getProperty();
    this.booking = this.token.getEnquiryData();
    if (this.booking) {
      const thmRef = this.booking.enquiryReference || this.booking.propertyReservationNumber;
      const lmsId = this.booking.enquiryId;
      if (thmRef && lmsId && thmRef !== lmsId) {
        this.booking.enquiryId = `${thmRef} (${lmsId})`;
      } else if (thmRef) {
        this.booking.enquiryId = thmRef;
      }
    }
    this.savedServices = this.token.getSelectedServices();
    this.resolveActiveCurrency();
    this.storedPromo = localStorage.getItem('selectPromo');
    if (this.storedPromo == 'true') {
      const selectedPromoData = JSON.parse(
        localStorage.getItem('selectedPromoData')
      );
      this.selectedPromo = selectedPromoData;
      // this.businessOfferDto = selectedPromoData
    } else {
      this.getOfferDetails();
    }

    this.calculateServiceHours();
    this.PropertyUrl = this.token.getPropertyUrl();
    this.isReadMore = this.policies.map(() => false);
    if (
      this.booking?.bookingPropertyId != null &&
      this.booking?.bookingPropertyId != undefined
    ) {
      this.getPropertyDetailsById(this.booking.bookingPropertyId);
    }
    const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
    if (bookingDataDetails) {
      this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
      this.calculateTotalGuestsFromPlans();
    }

    const bookingsResponseList = sessionStorage.getItem('EnquiryResponseList');
    if (bookingsResponseList) {
      this.bookingsResponseList = JSON.parse(bookingsResponseList);
             this.totalDiscount = this.bookingsResponseList.reduce(
    (sum, booking) => sum + (booking.discountAmount || 0),
    0
  );
      this.calculateTotalGuestsFromPlans();
    }
          setInterval(() => {
    this.checkBookingEngineFlag();
  }, 10);

   const savedLabel = localStorage.getItem('savedBookingLabel');
    if (savedLabel) {
    try {
      const parsedData = JSON.parse(savedLabel);
      this.roomLabel = parsedData.label || 'Room'; 
    } catch (e) {
      console.error("Error parsing token", e);
    }
    this.calculateTotalGuestsFromPlans();
  }
  }

  ngOnInIt() {}

  async getPropertyDetailsById(id: number) {
    // debugger
    // this.token.saveBookingEngineBoolean('googlehotelcenter')

    // //console.log("id isequal to" + id)
    try {
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        this.resolveActiveCurrency();
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
  checkBookingEngineFlag(): void {
  const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
  this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
}
getTrimmedDescription(description: string): string {
  if (!description) return '';

  const words = description.split(/\s+/); // split by spaces
  if (words.length <= 35) {
    return description;
  }

  return words.slice(0, 35).join(' ') + '...';
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
  callNow() {
    if (this.businessUser?.mobile && this.websiteUrlBookingEngine) {
    window.location.href = 'tel:' + this.businessUser?.mobile;
  } else {
    window.location.href = 'tel:' + 7326079861;
  }
}

  toggleViewMore(event: Event): void {
    event.preventDefault();
    this.expanded = !this.expanded;
  }

  backone() {
    window.location.href = this.PropertyUrl;
    sessionStorage.removeItem('EnquiryResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('BOOKINGDATAOJC');
    sessionStorage.removeItem('bookingSummary');
    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('BOOKINGDATAOJC');
    sessionStorage.removeItem('bookingSummary');
    sessionStorage.removeItem('EnquiryResponseList');
    sessionStorage.removeItem('selectedPromoData');
    sessionStorage.clear();
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
      ) || this.booking?.noOfPerson || 0;

    this.totalPlanChildren =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.children || 0),
        0
      ) || this.booking?.noOfChildren || 0;

    this.totalPlanChildrenAboveAgeLimit =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.childrenAbove5years || 0),
        0
      ) || 0;

    this.totalPlanChildrenBelowAgeLimit =
      this.bookingSummaryDetails?.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan.childrenBelow5years || 0),
        0
      ) || 0;
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
  calculateServiceHours() {
    this.accommodationService =
      this.propertyDetails?.businessServiceDtoList.filter(
        (service) => service.name === 'Accommodation'
      );
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

  resolveActiveCurrency() {
    const isGhc = (this.token.getBookingEngineBoolean() === 'googlehotelcenter');

    let urlCurrency = null;
    if (this.acRoute && this.acRoute.snapshot && this.acRoute.snapshot.queryParams) {
      urlCurrency = this.acRoute.snapshot.queryParams['currency'] || this.acRoute.snapshot.queryParams['userCurrency'];
    }

    const bookingCurrency = this.booking?.currency || (this.token.getBookingData()?.currency);
    const savedCurrency = sessionStorage.getItem('selected_currency');
    const localCurrency = this.businessUser?.localCurrency || this.propertyDetails?.localCurrency || this.token.getProperty()?.localCurrency;

    if (urlCurrency) {
      this.currency = urlCurrency.toUpperCase();
    } else if (savedCurrency) {
      this.currency = savedCurrency.toUpperCase();
    } else if (bookingCurrency) {
      this.currency = bookingCurrency.toUpperCase();
    } else if (isGhc) {
      this.currency = 'INR'; // Defaults GHC to INR if no other parameter is specified
    } else if (localCurrency) {
      this.currency = localCurrency.toUpperCase();
    } else {
      this.currency = 'INR';
    }

    if (this.booking) {
      this.booking.currency = this.currency;
    }
  }
}
