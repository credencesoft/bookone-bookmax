import { CallToActionComponent } from './../../../../views/landing/components/call-to-action/call-to-action.component';
// import { Components } from './../../model/components';
// import { Template } from './../../model/template';

import { Router } from '@angular/router';
// import { Customer } from "./../../model/customer";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Location, DatePipe, formatDate } from '@angular/common';
import { suburbList } from 'src/app/data/cityList.data';
import { Booking } from 'src/app/model/booking';
import {
  AdvanceDiscountSlab,
  BusinessServiceDtoList,
} from 'src/app/model/businessServiceDtoList';

import { MessageDto } from 'src/app/model/MessageDto';
import { Msg } from 'src/app/model/msg';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';

import {
  API_URL_IN,
  API_URL_NZ,
  EMAIL_Expression,
  SMS_NUMBER,
} from 'src/app/app.component';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BankAccount } from 'src/app/model/BankAccount';
import { MobileWallet } from 'src/app/model/mobileWallet';
import { BusinessOfferDto } from 'src/app/model/businessOfferDto';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';
import { environment } from 'src/environments/environment';
// import { EnquiryForm } from "../Enquiry/Enquiry.component";
import { EnquiryDto } from 'src/app/model/enquiry';
// import { forEach } from "cypress/types/lodash";
import { json } from 'express';
import { WhatsappDto } from 'src/app/model/whatsappDto';
import { Para } from 'src/app/model/parameters';
import { Images } from 'src/app/model/image';
import { Language } from 'src/app/model/language';
import { Room } from 'src/app/model/room';
import { TokenStorage } from 'src/token.storage';
import { ListingService } from 'src/services/listing.service';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { Logger } from 'src/services/logger.service';
import { Template } from 'src/app/model/template';
import { Components } from 'src/app/model/components';
import { Customer } from 'src/app/model/customer';
import { EnquiryForm } from '../onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { PropertyEnquiryDto } from 'src/model/propertyEnquiryDto';
import { externalReservationDtoList } from 'src/app/model/externalReservation';
import { RoomDetail } from 'src/app/model/RoomDetail';
import {
  CountryList,
  CountryListInterFace,
} from 'src/app/model/country';
import { MessageService } from 'primeng/api';
declare var Stripe: any;

declare var window: any;
type StepStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Step {
  label: string;
  status: StepStatus;
}
@Component({
  selector: 'booking',
  templateUrl: './Booking.component.html',
  styleUrls: ['./Booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class BookingComponent implements OnInit {
  bookingContextMissing = false;
  bookingContextMessage =
    'Your booking session has expired. Please reselect your room to continue.';
  PropertyUrl: string;
  currency: string;
  message: MessageDto;
  enquiryForm: EnquiryDto;
  template: Template;
  components: Components[];
  components2: Components[];
  parameterss: Para[];
  parameterss2: Para[];
  tokenFromTime: number;
  tokenToTime: number;
  visiblePromotion: boolean = false; // Used for handled when user open Offers dialog box
  promocodeListChip: any[] = []; // Used for handled to get the promo list and stored in this variable.
  showTheSelectedCoupon: boolean = false; // Usedd For handled to open the selected coupon section.
  storedActualNetAmount: number; // Used For handled to stored the Current netAmount.
  selectedCouponList: any; // Used For handled to store the selected coupon data.
  storeNightPerRoom: number; // Used for handled to set the room price per night
  howingReceiptData: any;
  showingSuccessMessage: boolean = false;
  appliedCoupon: number;
  grandTotalAmount: number;
  actualTaxAmount: number;

  parameterss3: Para[];
  socialmedialist: any;
  externalReservationDtoList: externalReservationDtoList[];
  propertyServices: PropertyServiceDTO[];
  policies = [];
  businessTypeName: string;
  parameterss4: Para[];
  language: Language;
  showAlert: boolean = false;
  alertType: string;
  propertyDetails: BusinessUser;
  fromTime: string;
  toTime: string;

  totalExtraAmount: number = 0;
  images: Images;
  verifyOption = 'email';
  // smsOption: string = '';
  sendBtn = 'Send';
  submitButtonDisable: boolean = false;
  loader = false;
  verificationCode: string;
  lookup = false;
  checkCustomerLookup = false;
  customerVerified = false;
  verificationSend = false;
  paymentLoader: boolean = false;
  verified = false;
  customerExist = false;
  verifiedPending: boolean = false;
  verifySuccessMessage: boolean = false;
  isReservationList: boolean = false;
  headerTitle: string;
  bodyMessage: string;
  payment: Payment;
  homeDelivery = false;
  cashPayment = false;
  totalTaxAmount: number = 0;
  isSuccess: boolean;
  localityList: any = suburbList;
  suburbsLists: any;
  businessUser: BusinessUser;
  expanded: { [key: number]: boolean } = {};
  // totalQuantity: number ;
  // totalPrice: number;
  combinedDateFromTime: number;
  combinedDateToTime: number;
  myDate: any;
  whatsappForm: WhatsappDto;
  whatsappForm2: WhatsappDto;
  // slotReservation: SlotReservation;
  // slotReservations: SlotReservation[];
  businessServiceDto: BusinessServiceDtoList;
  customerDto: Customer;
  // payment: Payment;
  prepareDay: number;
  prepareHour: number;
  prepareMinute: number;
  propertyId: any;
  hotelID: number;

  leadHour: number;
  leadDay: number;
  leadMin: number;

  leadMaxDay: number;
  leadMaxMin: number;
  leadMaxHour: number;
  componentstype: Components;
  componentstype2: Components;
  componentstype3: Components;
  componentstype4: Components;
  contentDialog: any;

  ngbDate: any;
  mobileHasError: boolean = false;
  countryCode: string = '';
  phoneWithoutCode: string = '';
  selectedCountry: string = '';
  CountryArray: CountryList;
  taxPercentage = 0;
  subTotalAmount: number = 0;
  totalAmount: number = 0;
  bookingData: any;
  propertyData: any;
  booking: Booking;
  timeDifferenceInDays: number;
  totalBeforeTaxAmount: number = 0;
  isVerified: boolean = false;
  parametertype: Para;
  parametertype2: Para;
  reservationRoomDetails: RoomDetail[];

  parametertype3: Para;
  parametertype4: Para;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  upiPayment: boolean;
  roomsAndOccupancy: boolean = false;
  bookingCity: string;
  adults: number = 2;
  avedServices: any[] = [];
  children: number = 0;
  noOfrooms: number = 1;
  DiffDate;
  enddate;
  startDate;
  bookingConfirmed = false;

  bankAccount: BankAccount;
  mobileWallet: MobileWallet;
  businessOfferDto: BusinessOfferDto;
  promoCode: string;
  discountPercentage: number;
  promoMessage = '';
  addServiceList: PropertyServiceDTO[];
  accommodationvalue = [];
  private ewaySecureFieldCode: string;
  private ewayErrors: string = null;
  private ewayInitComplete: boolean = false;
  cardPaymentAvailable: boolean;
  API_URL: string;

  isEnquiry: Boolean = false;
  enquiryNo: string;
  accommodationData: any;
  value: any;
  availableRooms: Room[];
  pet: string;
  externalReservationdto: any;

  propertyenquiryone: PropertyEnquiryDto;
  equitycreatedData: any;
  success: EnquiryForm;
  bookingengineurl: any;
  savedServices: any;
  calculatedServices: any;
  totalServiceCost: number = 0;
  bookingRoomPrice: any;
  noOfExtraChild: any;
  enquiriesNo: any;
  url: string;
  activeGoogleCenter: boolean = false;
  percentage1: number;
  percentage2: number;
  totalPercentage: number;
  netAmount: number;
  taxAmountBooking: number;
  bookingroomPrice: string;
  calculateBookingId: any;
  loadingOne: boolean = false;
  saveResponseBooking: Booking;
  selectedPromotionCheck: boolean = false;
  referenceNumberAfterBooking: any;
  bookingId: number;
  componentstype9: Components;
  parametertype20: Para;
  parameterss15: Para[];
  componentstype10: Components;
  parameterss1: Para[];
  valueHours: boolean = false;
  allSubscription: any;
  otaTaxAmountValue: any;
  googleCenter: string;
  otaPlanPrice: any;
  OtaPlanAllPrice: number;
  otaTaxAmount: any;
  validCoupons: any[];
  bookingSummaryDetails: any;
  totalPlanAdults: number = 0;
  totalPlanChildren: number = 0;
  bookingsResponseList: any[] = [];
  termsAccepted = false;
  groupBookingId: number;
  smartRecommendations: any;
  specialDiscountPercentage: any;
  specialDiscountData: any;
  enteredCoupon: any;
  // Multi-Discount Tracking Properties
  couponDiscountAmount: number = 0;
  advanceDiscountAmount: number = 0;
  totalDiscountAmount: number = 0;
  amountAfterDiscount: number = 0;
  taxOnDiscountedAmount: number = 0;
  convenienceFeeAmount: number = 0;
  advancePaymentAmount: number = 0;
  remainingPaymentAmount: number = 0;
  showTermsUniquePopup: boolean = false;
  showPrivacyUniquePopup: boolean = false;
  thmEnquiryDataList: Booking;
  propertyDataObj: Booking;
  thmMail: string;
  bookingEmailSent: boolean = false;
  channelManagerIntegration: any;
  isPayNowDisabled: boolean = false;
  websiteUrlBookingEngine: boolean;
  isEnquiryDisabled = false;
  isCashPayDisabled = false;
  isPayDisabled = false;
  showMobileBookingDetails: boolean = false;
  propertyMobileNumber: string;
  components1: Components[];
  bookoneActiveData: any;
  serviceChargePercentage: any;
  soldOutRooms: any;
  availableRoomsOne: any;
  availableRoomIdSet = new Set<number>();
  soldOutSectionRef!: HTMLElement;
  availabilityLoaded = false;
  showModal = false;
  enquiryResponseList: any[] = [];
  steps: Step[] = [
    { label: 'Enquiry', status: 'pending' },
    { label: 'Payment', status: 'pending' },
    { label: 'Confirm', status: 'pending' },
  ];

  activeStep = 0;
  completed = false;
  failed = false;

  progressPercent = 0;
  private targetProgress = 0;
  aiMessage = 'Initializing secure connection...';

  private progressTimer: any;
  private enquiryId!: number;
  private transactionId!: string;
  private paymentStartDelayTimer: any;
  private paymentDelayTimer: any;
  private paymentPoller: any;
  private bookingPoller: any;
  private paymentStartTime!: number;
  private isPmsConversionTriggered = false;
  pmsResponses: any[] = [];
  private pmsSuccessCount = 0;
  private bookedEnquiries: any[] = [];
  private STEP_MESSAGES = {
    enquiry: 'Enquiry created successfully. Preparing payment...',
    paymentProcessing: 'Securely verifying payment with bank...',
    paymentSuccess: 'Payment confirmed. Creating booking...',
    paymentFailure: 'Payment failed or cancelled.',
    bookingProcessing: 'Finalizing booking and generating confirmation...',
    bookingSuccess: 'Booking confirmed successfully!',
    bookingTimeout: 'Booking creation is taking longer than expected.',
  };
  errorData: any;
  paidEnquiry = false;
  private bookingStartTime: number;
  private BOOKING_TIMEOUT = 50 * 1000; // 50 seconds
  remainingSeconds = 150;
  private countdownTimer: any;
  roomLabel: string = 'Room';
  advanceDiscountSlabs: AdvanceDiscountSlab[] = [];
  selectedAdvanceDiscountSlab: AdvanceDiscountSlab | null = null;
  selectedPlansSummary: any[] = [];
  
  // ✅ Phase 4: Add-on Services Tracking
  addOnServices: any[] = [];                    // Available add-ons to display
  selectedAddOns: any[] = [];                   // User-selected add-ons
  selectedAddOnNames: string[] = [];            // Track selected add-on names
  isAddOnServiceLoading: boolean = false;
  showAddOnServices: boolean = false;
  addOnsTaxPercentage: number = 18;             // Service tax (can be configured)
  addOnsDiscountPercentage: number = 0;         // Service-level discount (optional)
  totalAddOnsAmount: number = 0;                // Subtotal before tax
  totalAddOnsTax: number = 0;                   // Tax on add-ons
  totalAddOnsDiscount: number = 0;              // Discount on add-ons
  private readonly enableCalculationDebug = false;
  
  constructor(
    private token: TokenStorage,
    private ngZone: NgZone,
    private locationBack: Location,
    private changeDetectorRefs: ChangeDetectorRef,
    private datePipe: DatePipe,
    private listingService: ListingService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private hotelBookingService: HotelBookingService,
  ) {
    this.message = new MessageDto();
    this.myDate = new Date();
    this.parametertype = new Para();
    this.parametertype2 = new Para();
    this.parametertype3 = new Para();
    this.parametertype4 = new Para();
    this.componentstype = new Components();
    this.componentstype2 = new Components();
    this.componentstype3 = new Components();
    this.componentstype4 = new Components();
    this.componentstype9 = new Components();
    this.componentstype10 = new Components();
    this.parametertype20 = new Para();
    this.parameterss15 = [];
    this.components1 = [];
    this.images = new Images();
    this.whatsappForm = new WhatsappDto();
    this.whatsappForm2 = new WhatsappDto();
    this.template = new Template();
    this.businessOfferDto = new BusinessOfferDto();
    // this.slotReservation = new SlotReservation();
    this.businessServiceDto = new BusinessServiceDtoList();
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.components = [];
    this.components2 = [];
    this.language = new Language();
    this.propertyenquiryone = new PropertyEnquiryDto();
    this.payment = new Payment();
    this.mobileWallet = new MobileWallet();
    this.bankAccount = new BankAccount();
    this.customerDto = new Customer();
    this.CountryArray = new CountryList();
    this.addServiceList = [];
    this.parameterss = [];
    this.parameterss2 = [];
    this.externalReservationDtoList = [];
    this.externalReservationdto = [];
    this.parameterss3 = [];
    this.parameterss4 = [];
    this.parameterss1 = [];
    if (!this.hasRequiredBookingContext()) {
      this.handleMissingBookingContext();
      return;
    }
    if (this.token.getServiceData() !== null) {
      this.addServiceList = this.token.getServiceData();
    }
    if (this.token.getProperty() !== null) {
      this.propertyData = this.token.getProperty();

      this.propertyData.shortName = this.token.getProperty().shortName;
    }

    this.savedServices = this.token.getSelectedServices();

    const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
    if (bookingDataDetails) {
      this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
      this.calculateTotalGuestsFromPlans();
    }
    setTimeout(() => {
      this.businessUser?.socialMediaLinks.forEach((element) => {
        this.socialmedialist = element;
      });
    }, 100);

    this.bookingengineurl = this.token.getwebsitebookingURL();
    if (this.token.getBookingData() !== null) {
      this.bookingData = this.token.getBookingData();
      this.booking = this.bookingData;
      this.fromDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.fromDate).year,
        this.mileSecondToNGBDate(this.booking.fromDate).month,
        this.mileSecondToNGBDate(this.booking.fromDate).day,
      );
      this.toDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.toDate).year,
        this.mileSecondToNGBDate(this.booking.toDate).month,
        this.mileSecondToNGBDate(this.booking.toDate).day,
      );
      this.adults = this.booking.noOfPersons;
      this.children = this.booking.noOfChildren;
      this.noOfrooms = this.booking.noOfRooms;
    }
    if (this.token.getBookingCity() !== null) {
      this.bookingCity = this.token.getBookingCity();
    }
    if (this.token.saveBookingRoomPrice(this.booking.roomPrice) !== null) {
      this.bookingRoomPrice = this.token.getBookingRoomPrice();
    }

    if (this.token.saveExtraPerson(this.booking.noOfExtraChild) !== null) {
      this.noOfExtraChild = this.token.getExtraChildCharge();
    }

    if (this.token.saveRoomPrice(this.booking.roomPrice) !== null) {
      this.bookingroomPrice = this.token.getRoomPrice();
    }

    this.calculateserviceprice();

    this.booking.fromTime =
      new Date(this.booking.fromDate).getTime() + 21600000;
    this.booking.toTime = new Date(this.booking.toDate).getTime() + 21600000;

    // this.bookingData = this.token.getBookingData();
    // this.booking = this.bookingData;
    // this.calculateDateDeference();
    this.getDiffDate(this.toDate, this.fromDate);
    // this.booking.roomId = this.bookingData.roomId;
    this.url = this.token.getBookingEngineBoolean();
    if (this.url === 'googlehotelcenter') {
      this.activeGoogleCenter = true;
    }
    // this.booking.roomType = this.bookingData.roomType;
    // this.booking.noOfRooms = this.bookingData.noOfRooms;
    // this.booking.noOfPersons = this.bookingData.noOfPersons;
    if (this.addServiceList.length > 0) {
      this.booking.includeService = true;
    } else {
      this.booking.includeService = false;
    }

    this.booking.discountAmount = 0;
    this.booking.dayTrip = false;
    this.booking.netAmount = this.booking.netAmount;

    this.booking.gstAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.booking.taxAmount = this.booking.gstAmount;
    this.booking.beforeTaxAmount =
      this.booking.netAmount - this.booking.discountAmount;
    this.booking.roomTariffBeforeDiscount = Number(
      this.token.getBookingRoomPrice(),
    );
    this.getPropertyDetails(this.booking.propertyId);
    this.checkingAvailabilityOne();
    this.payment.expYear = '';
    this.payment.expMonth = '';

    if (this.booking.email === undefined) {
      this.booking.email = '';
    }

    if (this.booking.mobile === undefined) {
      this.booking.mobile = '';
    }

    this.PropertyUrl = this.token.getPropertyUrl();

    let isBookingEngine = false;

    if (this.PropertyUrl && this.PropertyUrl.includes('bookingEngine')) {
      isBookingEngine = true;
    }
    if (this.propertyData && this.token.getProperty()) {
      this.propertyData.shortName = this.token.getProperty().shortName;
    }
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
    if (this.bookingContextMissing) {
      return;
    }
    this.clearFormField(this.booking);
    this.initializeCountrySelection();
    const couponCodeValues = sessionStorage.getItem('selectedPromoData');
    
    if (couponCodeValues) {
      const parsed = JSON.parse(couponCodeValues); // convert to object
      this.specialDiscountData = JSON.parse(couponCodeValues);
      if (parsed.couponCode) {
        this.enteredCoupon = parsed.couponCode;
      }
      if (parsed.discountPercentage) {
        this.specialDiscountPercentage = parsed.discountPercentage;
      }
    }
    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;
    if (!bookingSummary?.selectedPlansSummary?.length) {
      this.handleMissingBookingContext();
      return;
    }
    this.selectedPlansSummary = bookingSummary.selectedPlansSummary;
    if (this.selectedPlansSummary.length >= 2) {
      this.groupBookingId = Math.floor(10000000 + Math.random() * 90000000);
    }
    this.otaPlanPrice = this.token.getLandingPrice();
    this.otaTaxAmount = this.token.getAllTaxArray();
    this.googleCenter = this.token.getBookingEngineBoolean();
    if (this.otaPlanPrice > 0) {
      const OtaPlanAllPrice = Number(this.otaPlanPrice);
      this.storedActualNetAmount = OtaPlanAllPrice;
      this.otaTaxAmountValue = this.otaTaxAmount;
    } else {
      // Use booking summary total price if available
      this.storedActualNetAmount = bookingSummary?.totalPlanPrice || this.booking.netAmount;
    }
    // this.storedActualNetAmount = this.booking.netAmount;
    this.actualTaxAmount = this.booking.gstAmount;
    this.storeNightPerRoom = this.bookingRoomPrice;
    this.taxAmountBackUp = this.booking.taxAmount;
    // this.sendWhatsappMessageToPropertyOwner();

    this.accommodationData = this.propertyData.businessServiceDtoList?.filter(
      (entry) => entry.name === 'Accommodation',
    );
    // if(!this.activeGoogleCenter){
    this.accommodationData.forEach((element) => {
      this.serviceChargePercentage = element.serviceChargePercentage;
    });
    // }

    this.accommodationData.forEach((element) => {
      if (this.bookingengineurl === 'true') {
        this.value = element.websiteinstantBooking;
      } else if (this.value !== true) {
        this.value = element.instantBooking;
      }
    });
    this.initializeAdvancePaymentPlans();
    this.setApi();
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.totalTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.grandTotalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount +
      this.totalServiceCost;
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunction: () => this.stripePaymentSuccess(),
    };
    // Initialize multi-discount tracking properties
    this.couponDiscountAmount = 0;
    this.advanceDiscountAmount = 0;
    this.totalDiscountAmount = 0;
    this.amountAfterDiscount = this.storedActualNetAmount || this.booking.netAmount;
    this.taxOnDiscountedAmount = bookingSummary?.totalTax || this.booking.taxAmount || 0;
    this.convenienceFeeAmount = this.calculateConvenienceFee(this.amountAfterDiscount, this.serviceChargePercentage);
    this.advancePaymentAmount = 0;
    this.remainingPaymentAmount = this.amountAfterDiscount + (this.taxOnDiscountedAmount) + this.convenienceFeeAmount;

    // If coupon was loaded from sessionStorage, initialize selectedCouponList and recalculate
    if (this.specialDiscountData && this.specialDiscountData.discountPercentage) {
      console.log('[DEBUG] Coupon found in sessionStorage:', this.specialDiscountData);
      console.log('[DEBUG] storedActualNetAmount:', this.storedActualNetAmount);
      console.log('[DEBUG] bookingSummary?.totalPlanPrice:', bookingSummary?.totalPlanPrice);
      console.log('[DEBUG] bookingSummary?.totalTax:', bookingSummary?.totalTax);
      this.selectedCouponList = this.specialDiscountData;
      this.showTheSelectedCoupon = true;
      this.calculateMultiDiscountAndTax();
      console.log('[DEBUG] After calculateMultiDiscountAndTax - couponDiscountAmount:', this.couponDiscountAmount);
      console.log('[DEBUG] After calculateMultiDiscountAndTax - totalDiscountAmount:', this.totalDiscountAmount);
    } else {
      console.log('[DEBUG] No coupon in sessionStorage');
    }

    const storedPromo = localStorage.getItem('selectPromo');
    if (storedPromo == 'true') {
      this.selectedPromotionCheck = true;
      const selectedPromoData = localStorage.getItem('selectedPromoData');
      this.selectedCoupon(JSON.parse(selectedPromoData));
    }

    // Phase 4: Initialize Add-ons from sessionStorage
    this.initializeAddOnServices();

    this.token.clearBookingDataObj();
  }

  getTotalRooms(): number {
    return this.selectedPlansSummary?.reduce(
      (total, plan) => total + (plan.selectedRoomnumber || 0),
      0
    ) || 0;
  }

  private hasRequiredBookingContext(): boolean {
    const bookingSummaryDetails = sessionStorage.getItem('bookingSummaryDetails');
    const bookingData = this.token.getBookingData();

    return !!bookingSummaryDetails && !!bookingData;
  }

  private handleMissingBookingContext(): void {
    if (this.bookingContextMissing) {
      return;
    }

    this.bookingContextMissing = true;
    this.showAlert = true;
    this.alertType = 'danger';
    this.headerTitle = 'Session expired';
    this.bodyMessage = this.bookingContextMessage;

    setTimeout(() => {
      this.redirectToPropertyPage();
    }, 1500);
  }

  private redirectToPropertyPage(): void {
    const propertyUrl = this.token.getPropertyUrl();
    const property = this.token.getProperty();

    if (propertyUrl) {
      if (/^https?:\/\//i.test(propertyUrl)) {
        window.location.href = propertyUrl;
        return;
      }

      this.router.navigateByUrl(propertyUrl);
      return;
    }

    if (property?.seoFriendlyName) {
      this.router.navigate(['/', property.seoFriendlyName]);
      return;
    }

    this.router.navigate(['/']);
  }
  getFirstWords(text: string, count: number): string {
    return text.split(' ').slice(0, count).join(' ');
  }
  openBookingProcess(enquiryId: number, transactionId: string) {
    if (this.businessUser.paymentGateway === 'PayU') {
      this.resetState();

      this.enquiryId = enquiryId;
      this.transactionId = transactionId;

      this.showModal = true;

      // STEP 1 – enquiry already completed
      this.markEnquiryCompleted();

      // STEP 2 – start payment polling after 40 seconds
      this.paymentDelayTimer = setTimeout(() => {
        if (!this.showModal || this.failed || this.completed) return;
        this.startPaymentStatusPolling();
      }, 20000);
    } else if (this.businessUser.paymentGateway === 'razorpay') {
      this.resetState();

      this.enquiryId = enquiryId;
      this.transactionId = transactionId;

      this.showModal = true;

      // STEP 1 – enquiry already completed
      this.markEnquiryCompleted();

      // STEP 2 – start payment polling after 40 seconds
      this.paymentDelayTimer = setTimeout(() => {
        if (!this.showModal || this.failed || this.completed) return;
        this.startPaymentStatusPolling();
      }, 20000);
    }
  }
  private markEnquiryCompleted() {
    this.activeStep = 0;
    this.steps[0].status = 'completed';
    this.steps[1].status = 'processing';

    this.aiMessage = this.STEP_MESSAGES.enquiry;
    this.animateProgressTo(30);
  }
  private onPaymentPending() {
    if (this.progressPercent < 65) {
      this.progressPercent += 1;
    }
  }
  private startPaymentStatusPolling() {
    if (this.paymentPoller) return;

    this.activeStep = 1;
    this.aiMessage = this.STEP_MESSAGES.paymentProcessing;
    this.paymentStartTime = Date.now();

    const TWO_MINUTES = 2.5 * 60 * 1000;
    this.remainingSeconds = 150;
    this.startCountdown();
    this.paymentPoller = setInterval(() => {
      const elapsedTime = Date.now() - this.paymentStartTime;

      // ⏱ 4 minute timeout
      if (elapsedTime >= TWO_MINUTES) {
        clearInterval(this.paymentPoller);
        this.paymentPoller = null;

        // Only fail if still not completed
        if (!this.completed) {
          this.aiMessage = 'Payment verification timed out.';
          this.handlePaymentFailure();
        }

        return;
      }
      if (this.businessUser.paymentGateway === 'razorpay') {
        this.checkPaymentStatusRazorpay();
      } else {
        this.checkPaymentStatus();
      }
    }, 5000);
  }

  get minutes(): number {
    return Math.floor(this.remainingSeconds / 60);
  }

  get seconds(): number {
    return this.remainingSeconds % 60;
  }

  startCountdown() {
    this.remainingSeconds = 150;
    this.countdownTimer = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }
  private checkPaymentStatusRazorpay() {
    this.hotelBookingService
      .checkPaymentStatusRazorPay(this.businessUser.id, this.transactionId)
      .subscribe({
        next: (res) => {
          const status = res.status.toLowerCase();
          // this.errorData = tx.error_Message;

          if (status === 'paid') {
            this.handlePaymentSuccess();
          } else if (status === 'failed') {
            this.handlePaymentFailure();
          } else {
            this.onPaymentPending();
          }
        },
        error: () => {
          // network or gateway lag ≠ failure
          this.onPaymentPending();
        },
      });
  }

  private checkPaymentStatus() {
    this.hotelBookingService
      .checkPaymentStatus(this.businessUser.id, this.transactionId)
      .subscribe({
        next: (res) => {
          const tx = res?.transaction_details?.[this.transactionId];
          if (!tx) return;

          const status = (tx.status || '').toLowerCase();
          this.errorData = tx.error_Message;

          if (status === 'success') {
            this.handlePaymentSuccess();
          } else if (status === 'pending' || status === 'not found') {
            this.onPaymentPending();
          } else {
            this.handlePaymentFailure();
          }
        },
        error: () => {
          // network or gateway lag ≠ failure
          this.onPaymentPending();
        },
      });
  }

  private animateProgressTo(target: number) {
    this.targetProgress = target;

    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }

    this.progressTimer = setInterval(() => {
      if (this.progressPercent >= this.targetProgress) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
        return;
      }
      this.progressPercent += 1;
    }, 60);
  }

  private handlePaymentFailure() {
    this.stopAllTimers();

    this.failed = true;
    this.steps[this.activeStep].status = 'failed';
    this.aiMessage = 'Payment or booking could not be completed.';
  }

  private onBookingPending() {
    if (this.progressPercent < 95) {
      this.progressPercent += 1;
    }
  }
  private handlePaymentSuccess() {
    this.clearPaymentPoller();
    this.clearCountdownTimer();

    this.steps[1].status = 'completed';
    this.aiMessage = 'Payment confirmed. Syncing with PMS...';

    this.animateProgressTo(75);

    this.handlePmsSuccess();
    // this.convertEnquiriesToPMS();
  }

  private convertEnquiriesToPMS() {
    const enquiryStr = sessionStorage.getItem('EnquiryResponseList');
    if (!enquiryStr) return;

    const enquiryList = JSON.parse(enquiryStr);
    if (!Array.isArray(enquiryList) || enquiryList.length === 0) return;

    this.pmsSuccessCount = 0;

    enquiryList.forEach((enquiry) => {
      const payload = {
        ...enquiry,
        paymentStatus: 'Paid',
        paymentReceived: true,
        paymentReference: this.payment.referenceNumber,
        paymentGateway:
          this.payment.paymentGateway || this.businessUser?.paymentGateway || null,
        paymentMode: this.payment.paymentMode || null,
        updatedDate: new Date().toISOString(),
      };

      this.hotelBookingService.convertEnquiryToPMS(payload).subscribe({
        next: (res) => {
          if (res.status === 200 || res.status === 201 || res.status === 409) {
            this.pmsSuccessCount++;
          }

          if (this.pmsSuccessCount === enquiryList.length) {
            this.handlePmsSuccess();
          }
        },
        error: (err) => {
          console.warn('PMS sync issue, continuing booking flow', err);

          this.pmsSuccessCount++;

          if (this.pmsSuccessCount === enquiryList.length) {
            this.handlePmsSuccess();
          }
        },
      });
    });
  }

  private handlePmsSuccess() {
    this.activeStep = 2;
    this.steps[2].status = 'processing';
    this.aiMessage = this.STEP_MESSAGES.bookingProcessing;
    this.animateProgressTo(85);
    this.startBookingPolling();
  }

  private isBackendFinalizedGateway(): boolean {
    const gateway = (
      this.businessUser?.paymentGateway ||
      this.token.getProperty()?.paymentGateway ||
      ''
    )
      .toString()
      .trim()
      .toLowerCase();

    return gateway === 'payu' || gateway === 'razorpay';
  }

  private continueBackendBookingFinalization(): boolean {
    const enquiryStr = sessionStorage.getItem('EnquiryResponseList');
    if (!enquiryStr) {
      return false;
    }

    sessionStorage.removeItem('bookingsResponseList');
    this.bookedEnquiries = [];
    this.bookingsResponseList = [];
    this.showModal = true;
    this.steps[0].status = 'completed';
    this.steps[1].status = 'completed';
    this.steps[2].status = 'processing';
    this.activeStep = 2;
    this.completed = false;
    this.failed = false;
    this.paidEnquiry = false;
    this.aiMessage = this.STEP_MESSAGES.bookingProcessing;
    this.animateProgressTo(85);
    this.startBookingPolling();
    return true;
  }

  private startBookingPolling() {
    const enquiryStr = sessionStorage.getItem('EnquiryResponseList');
    if (!enquiryStr) return;

    const enquiryList = JSON.parse(enquiryStr);

    this.clearBookingPoller();
    this.bookingStartTime = Date.now();

    this.bookingPoller = setInterval(() => {
      const elapsed = Date.now() - this.bookingStartTime;

      // ⏱ If booking not created within timeout
      if (elapsed > this.BOOKING_TIMEOUT) {
        clearInterval(this.bookingPoller);
        this.bookingPoller = null;

        if (!this.completed) {
          this.handlePaidEnquiryState();
        }

        return;
      }

      enquiryList.forEach((enquiry) => {
        this.checkBookingStatus(enquiry);
      });
    }, 5000);
  }
  private handlePaidEnquiryState() {
    this.clearCountdownTimer();
    this.paidEnquiry = true;
    this.completed = false;
    this.failed = false;
    this.activeStep = 2;
    this.steps[2].status = 'processing';

    this.aiMessage = 'Payment received. Awaiting booking confirmation...';

    this.animateProgressTo(100);
  }

  private checkBookingStatus(enquiry: any) {
    this.hotelBookingService.checkBookingStatus(enquiry.enquiryId).subscribe({
      next: (res) => {
        if (res?.bookingId) {
          this.handleBookingSuccess(enquiry, res.bookingId);
        }
      },
      error: (err) => {
        // booking may not be created yet – do NOT fail
        console.warn(
          'Booking not ready yet for enquiry:',
          enquiry.enquiryId,
          err,
        );
      },
    });
  }

  private handleBookingSuccess(enquiry: any, bookingId: number) {
    // prevent duplicates
    const exists = this.bookedEnquiries.find(
      (e) => e.enquiryId === enquiry.enquiryId,
    );
    if (exists) return;

    enquiry.bookingId = bookingId;
    enquiry.bookingReservationId = bookingId;
    enquiry.updatedDate = new Date().toISOString();

    this.bookedEnquiries.push(enquiry);

    const originalList = JSON.parse(
      sessionStorage.getItem('EnquiryResponseList') || '[]',
    );

    if (this.bookedEnquiries.length === originalList.length) {
      this.clearBookingPoller();
      this.storeBookedEnquiries();
      this.cacheFinalizedBookings();
      this.completeBookingFlow();
    }
  }
  private completeBookingFlow() {
    this.stopAllTimers();
    this.activeStep = 2;
    this.steps[2].status = 'completed';
    this.completed = true;
    this.paidEnquiry = false;
    this.aiMessage = this.STEP_MESSAGES.bookingSuccess;
    this.animateProgressTo(100);
  }

  private cacheFinalizedBookings() {
    const uniqueBookingIds = Array.from(
      new Set(
        this.bookedEnquiries
          .map((enquiry) =>
            Number(enquiry?.bookingId || enquiry?.bookingReservationId || 0),
          )
          .filter((bookingId) => bookingId > 0),
      ),
    );

    if (uniqueBookingIds.length === 0) {
      return;
    }

    const resolvedBookings: any[] = [];

    uniqueBookingIds.forEach((bookingId) => {
      this.hotelBookingService.fetchBookingById(bookingId).subscribe({
        next: (booking) => {
          if (booking) {
            resolvedBookings.push(booking);
          }
        },
        error: (error) => {
          console.warn('Unable to preload booking for confirmation view', bookingId, error);
        },
        complete: () => {
          if (resolvedBookings.length === uniqueBookingIds.length) {
            sessionStorage.setItem(
              'bookingsResponseList',
              JSON.stringify(resolvedBookings),
            );
          }
        },
      });
    });
  }

  private storeBookedEnquiries() {
    // ✅ Enhance with calculation and payment plan state for voucher confirmation page
    const enhancedEnquiries = this.bookedEnquiries.map((enquiry) => ({
      ...enquiry,
      // Discount info
      couponDiscountPercentage: this.selectedCouponList?.discountPercentage || 0,
      couponDiscountAmount: this.couponDiscountAmount,
      advanceDiscountPercentage: this.selectedAdvanceDiscountSlab?.discountPercentage || 0,
      advanceDiscountAmount: this.advanceDiscountAmount,
      totalDiscountAmount: this.totalDiscountAmount,
      // Payment plan info
      advancePaymentPercentage: this.selectedAdvanceDiscountSlab?.advancePercentage || 0,
      advancePaymentLabel: this.selectedAdvanceDiscountSlab ? `Pay ${this.selectedAdvanceDiscountSlab.advancePercentage}% Advance` : null,
      // Calculation state
      amountAfterDiscount: this.amountAfterDiscount,
      taxOnDiscountedAmount: this.taxOnDiscountedAmount,
      serviceChargePercentage: this.serviceChargePercentage,
      convenienceFeeAmount: this.convenienceFeeAmount,
      // Summary amounts
      grandTotal: this.getNewGrandTotal(),
      payNowAmount: this.getNewPayNowAmount(),
      balanceAtCheckIn: this.getNewBalanceAtCheckIn(),
      // Add-ons
      selectedAddOns: this.selectedAddOns,
    }));

    sessionStorage.setItem(
      'BookedEnquiryList',
      JSON.stringify(enhancedEnquiries),
    );
  }

  private handleBookingTimeout() {
    this.clearBookingPoller();

    this.steps[2].status = 'failed';
    this.failed = true;

    this.aiMessage = this.STEP_MESSAGES.bookingTimeout;
  }
  private startProgressAnimation() {
    this.progressTimer = setInterval(() => {
      if (this.progressPercent < 98) {
        this.progressPercent += Math.floor(Math.random() * 2) + 1;
      }
    }, 250);
  }
  private clearPaymentPoller() {
    if (this.paymentPoller) {
      clearInterval(this.paymentPoller);
      this.paymentPoller = null;
    }
  }

  private clearCountdownTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private clearBookingPoller() {
    if (this.bookingPoller) {
      clearInterval(this.bookingPoller);
      this.bookingPoller = null;
    }
  }

  private stopAllTimers() {
    this.clearPaymentPoller();
    this.clearBookingPoller();
    this.clearCountdownTimer();

    if (this.paymentDelayTimer) {
      clearTimeout(this.paymentDelayTimer);
      this.paymentDelayTimer = null;
    }

    if (this.paymentStartDelayTimer) {
      clearTimeout(this.paymentStartDelayTimer);
      this.paymentStartDelayTimer = null;
    }

    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private updateStatusText(stepName: string) {
    this.aiMessage =
      this.STEP_MESSAGES[stepName] || 'Processing your request securely...';
  }

  private resetState() {
    this.stopAllTimers();

    this.progressPercent = 0;
    this.activeStep = 0;
    this.completed = false;
    this.failed = false;
    this.paidEnquiry = false;
    this.errorData = null;
    this.bookedEnquiries = [];

    this.steps = [
      { label: 'Enquiry', status: 'pending' },
      { label: 'Payment', status: 'pending' },
      { label: 'Confirm', status: 'pending' },
    ];
  }

  closeModal() {
    this.resetState();
    this.showModal = false;
    this.submitButtonDisable = false;
    this.isPayNowDisabled = false;
    this.paymentLoader = false;
    this.isPayDisabled = false;
  }

  ngOnDestroy() {
    this.resetState();
  }

  goToConfirmation() {
    this.router.navigate(['/booking-confirmation']).then(() => {
      this.closeModal();
    });
  }

  calculateConvenienceFee(totalAmount: number, percentage: number): number {
    if (!totalAmount || !percentage) {
      return 0;
    }
    const fee = (totalAmount * percentage) / 100;
    return Number(fee.toFixed(2));
  }
  openTermsUniquePopup() {
    this.showTermsUniquePopup = true;
  }
  openPrivacyUniquePopup() {
    this.showPrivacyUniquePopup = true;
  }
  closePrivacyUniquePopup() {
    this.showPrivacyUniquePopup = false;
    this.showTermsUniquePopup = false;
  }
  closeTermsUniquePopup() {
    this.showTermsUniquePopup = false;
    this.showPrivacyUniquePopup = false;
  }
  toggleViewMore(index: number, event: Event): void {
    event.preventDefault(); // prevent page jump
    this.expanded[index] = !this.expanded[index];
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
  clearFormField(bookingData?) {
    try {
      bookingData.firstName = '';
      bookingData.lastName = '';
      bookingData.email = '';
      bookingData.mobile = '';
      this.phoneWithoutCode = '';
      this.mobileHasError = false;
      if (this.booking.notes) bookingData.notes = '';
    } catch (error) {
      console.error('Error in clearFormField : ', error);
    }
  }

  setApi() {
    if (this.token.getCountry() === 'New Zealand') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'Fiji') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'Australia') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'Samoa') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'India') {
      this.API_URL = API_URL_IN;
    } else {
      this.API_URL = API_URL_IN;
    }
  }

  ngAfterViewInit() {
    let radios = document.querySelectorAll('.payment-tab-trigger > input');

    for (let i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', expandAccordion);
    }

    function expandAccordion(event) {
      let allTabs = document.querySelectorAll('.payment-tab');
      for (let i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove('payment-tab-active');
      }
      event.target.parentNode.parentNode.classList.add('payment-tab-active');
    }
  }

  showPayNow(): boolean {
    if (this.bookoneActiveData === false) {
      return false;
    }
    if (this.bookoneActiveData === false) {
      const from = new Date(this.booking.fromDate);
      const to = new Date(this.booking.toDate);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize time to midnight

      // FIXED END: Jan 31, 2026
      const jan31_2026 = new Date(2026, 0, 31); // Jan=0

      // Restriction check: both dates between TODAY → Jan 31, 2026
      const isRestricted =
        from >= today && from <= jan31_2026 && to >= today && to <= jan31_2026;

      if (isRestricted) {
        return false;
      }
    }

    if (this.channelManagerIntegration) return true;

    this.propertyData = this.token.getProperty();
    this.accommodationData = this.propertyData.businessServiceDtoList?.filter(
      (entry) => entry.name === 'Accommodation',
    );
    const hasPayLater = this.accommodationData?.some((a) => a.payLater);
    if (hasPayLater) return false;
    const propertyUrl = this.token.getPropertyUrl();
    const isBookingEngine = propertyUrl?.includes('bookingEngine');
    if (isBookingEngine) return this.businessUser.paymentGateway != null;
    if (!this.channelManagerIntegration && !this.value) return false;
    const fromDateTimestamp = new Date(this.booking.fromDate).getTime();
    const createdDateTimestamp = new Date(this.booking.createdDate).getTime();
    const hoursDifference =
      (fromDateTimestamp - createdDateTimestamp) / (1000 * 60 * 60);

    return hoursDifference >= 24 && this.businessUser.paymentGateway != null;
  }

  showPayLater(): boolean {
    if (this.bookoneActiveData === false) {
      return false;
    }
    if (this.bookoneActiveData === false) {
      const from = new Date(this.booking.fromDate);
      const to = new Date(this.booking.toDate);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize time to midnight

      // FIXED END: Jan 31, 2026
      const jan31_2026 = new Date(2026, 0, 31); // Jan=0

      // Restriction check: both dates between TODAY → Jan 31, 2026
      const isRestricted =
        from >= today && from <= jan31_2026 && to >= today && to <= jan31_2026;

      if (isRestricted) {
        return false;
      }
    }

    this.propertyData = this.token.getProperty();
    this.accommodationData = this.propertyData.businessServiceDtoList?.filter(
      (entry) => entry.name === 'Accommodation',
    );

    const hasPayLater = this.accommodationData?.some((a) => a.payLater);
    if (hasPayLater) return true;
    if (this.channelManagerIntegration) return false;
    if (!this.channelManagerIntegration && !this.value) return false;
    const propertyUrl = this.token.getPropertyUrl();
    const isBookingEngine = propertyUrl?.includes('bookingEngine');
    if (isBookingEngine) return false;

    const fromDateTimestamp = new Date(this.booking.fromDate).getTime();
    const createdDateTimestamp = new Date(this.booking.createdDate).getTime();
    const hoursDifference =
      (fromDateTimestamp - createdDateTimestamp) / (1000 * 60 * 60);

    if (hoursDifference < 24) return true;

    if (hoursDifference >= 24 && this.businessUser.paymentGateway == null)
      return true;

    return false;
  }

  calculateserviceprice() {
    this.calculatedServices = [];
    if (this.savedServices != null && this.savedServices != undefined) {
      this.savedServices?.forEach((element) => {
        let serviceCost = element.afterTaxAmount * element.quantity;
        this.calculatedServices.push(serviceCost);
        this.totalServiceCost += serviceCost; // Accumulating the total cost
      });
    }
  }

  getSubscriptions(booking: any, plan: any) {
    this.hotelBookingService
      .getSubscriptions(booking.propertyId)
      .subscribe((res) => {
        this.allSubscription = res.body;
        const foundSubscription = this.allSubscription.find(
          (ele) => ele.name === 'BookOne Subscription',
        );

        if (foundSubscription) {
          this.externalReservation(booking, plan);
        } else {
        }

        if (foundSubscription) {
          this.sendWhatsappMessageToTHMCopy(this.booking);
          this.sendWhatsappMessageToTHM1Copy(this.booking);
          this.sendWhatsappMessageToTHM2Copy(this.booking);
          this.sendWhatsappMessageToTHM3Copy(this.booking);
          this.sendWhatsappMessageToTHM4Copy(this.booking);
        } else {
          this.sendWhatsappMessageToTHM(this.booking);
          this.sendWhatsappMessageToTHM1(this.booking);
          this.sendWhatsappMessageToTHM2(this.booking);
          this.sendWhatsappMessageToTHM3(this.booking);
        }
      });
  }

  externalReservation(booking, plan) {
    this.reservationRoomDetails = [];
    let roomdetailss = new RoomDetail();
    let externalreservation = new externalReservationDtoList();
    const couponCodeValues = sessionStorage.getItem('selectedPromoData');
    const parsed = JSON.parse(couponCodeValues);
    this.specialDiscountData = JSON.parse(couponCodeValues);
    externalreservation.checkinDate = booking?.fromDate;
    externalreservation.checkoutDate = booking?.toDate;
    externalreservation.currency = booking?.currency;
    externalreservation.email = booking?.email;
    externalreservation.couponCode = this.specialDiscountData?.couponCode;
    externalreservation.discountAmount = booking?.discountAmount;
    externalreservation.promotionName = booking?.promotionName;
    externalreservation.totalAmount = booking?.totalAmount;
    externalreservation.amountBeforeTax = booking?.beforeTaxAmount;
    externalreservation.channelId = '9';
    externalreservation.lastModifiedBy = 'hotelmate';
    externalreservation.modeOfPayment = 'Cash';
    if (this.groupBookingId) {
      externalreservation.groupBookingId = null;
    }
    let propertyReservationNumber = booking?.propertyReservationNumber;
    let updatedCode = propertyReservationNumber.replace('-B-', '-BE-');
    externalreservation.otaReservationId = updatedCode;
    externalreservation.propertyId = booking?.propertyId.toString();
    externalreservation.propertyName = booking?.businessName;
    externalreservation.firstName = booking?.firstName;
    externalreservation.lastName = booking?.lastName;
    externalreservation.bookoneReservationId =
      booking?.propertyReservationNumber;
    externalreservation.contactNumber = this.buildFullPhoneNumber(
      booking?.mobile,
    );
    externalreservation.propertyBusinessEmail = booking?.businessEmail;
    externalreservation.noOfChildrenAbove5Years = booking?.noOfChildren;
    externalreservation.noOfChildrenBelow5Years =
      booking?.noOfChildrenUnder5years;
    externalreservation.externalTransactionId =
      this.propertyData.shortName + '-BE-' + booking?.id;
    externalreservation.createdBy = 'hotelmate';
    roomdetailss.checkinDate = booking?.fromDate;
    roomdetailss.checkoutDate = booking?.toDate;
    roomdetailss.noOfRooms = booking?.noOfRooms;
    roomdetailss.noOfadult = booking?.noOfPersons;
    roomdetailss.noOfchild =
      booking?.noOfChildrenUnder5years + booking?.noOfChildren;
    roomdetailss.noOfExtraPerson = booking.noOfExtraPerson;
    roomdetailss.extraPersonCharge = plan.singleextraAdultChargeBookOne;
    roomdetailss.plan = booking?.roomRatePlanName;
    roomdetailss.roomRate = booking?.roomPrice;
    roomdetailss.roomTypeId = booking?.roomId;
    roomdetailss.roomTypeName = booking?.roomName;
    this.reservationRoomDetails.push(roomdetailss);
    externalreservation.roomDetails = this.reservationRoomDetails;
    this.propertyServices =
      this.bookingSummaryDetails?.propertyServiceListDataOne;
    this.propertyServices?.forEach((ele) => {
      ele.count = ele.quantity;
      ele.id = null;
      ele.date = new Date().toISOString().split('T')[0];
      ele.logoUrl = null;
      ele.imageUrl = null;
      ele.description = null;
      ele.organisationId = null;
    });
    externalreservation.services = this.propertyServices;
    externalreservation.taxAmount = booking?.taxAmount;
    // externalreservation.lastModifiedDate = new Date().toString();
    externalreservation.noOfPerson = booking?.noOfPersons.toString();
    externalreservation.resType = '';
    externalreservation.otaBooking = false;
    externalreservation.otaName = 'WebSite';
    externalreservation.bookingStatus = 'Confirmed';
    externalreservation.payloadType = 'json';
    this.externalReservationDtoList = [];
    this.externalReservationDtoList.push(externalreservation);
    this.hotelBookingService
      .externalReservation(this.externalReservationDtoList)
      .subscribe((res) => {
        if (res.status === 200) {
          this.externalReservationdto = res.body;
          // setTimeout(() => {
          //   this.createBookingReservation();
          // }, 300);
        }
      });
  }
  getOfferDetails() {
    this.hotelBookingService
      .getOfferDetailsBySeoFriendlyName(this.businessUser.seoFriendlyName)
      .subscribe((data) => {
        this.businessOfferDto = data.body;
        this.validCoupons = this.checkValidCouponOrNot(data.body);
        this.promocodeListChip = this.validCoupons.filter(
          (coupon) => coupon.promotionAppliedFor !== 'Private',
        );
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
  // Used For handled to set the selected coupon
  selectedCoupon(coupon?) {
    try {
      if (this.isPresentCouponOffer(coupon)) {
        return;
      }
      if (this.showTheSelectedCoupon) {
        this.bookingRoomPrice = this.storeNightPerRoom;
        this.booking.netAmount = this.storedActualNetAmount;
      }
      this.selectedCouponList = coupon;
      this.showTheSelectedCoupon = true;
      this.visiblePromotion = false;
      this.showingSuccessMessage = true;
      
      // Always use multi-discount calculation to ensure all properties updated
      this.calculateMultiDiscountAndTax();
      
      localStorage.setItem('selectedPromoData', JSON.stringify(coupon));
      localStorage.setItem('selectPromo', 'true');
      
      // Trigger change detection
      this.changeDetectorRefs.markForCheck();
      
      setTimeout(() => {
        this.showingSuccessMessage = false;
      }, 3000);
    } catch (error) {
      console.error('Error in selectedCoupon : ', error);
    }
  }

  getApplicableTaxPercentage(): void {
    const coupon = this.appliedCoupon;
    const taxDetailsList = this.booking?.taxDetails;
    if (Array.isArray(taxDetailsList)) {
      taxDetailsList.forEach((item) => {
        const taxSlabsList = item.taxSlabsList;
        if (Array.isArray(taxSlabsList)) {
          taxSlabsList.forEach((item1) => {
            if (coupon > 7501) {
              this.booking.taxPercentage = item1.percentage;
            }
          });
        }
      });
    } else {
      console.error('Invalid taxDetailsList or empty array.');
    }
  }
  // Used For handled to clear the selected offer
  clearSelectedCoupons() {
    try {
      this.showTheSelectedCoupon = false;
      this.selectedCouponList = [];
      this.couponDiscountAmount = 0;
      this.booking.netAmount = this.storedActualNetAmount;
      this.bookingRoomPrice = this.storeNightPerRoom;
      
      // Recalculate with only advance discount if it's selected
      if (this.selectedAdvanceDiscountSlab) {
        this.calculateMultiDiscountAndTax();
      } else {
        // No discounts applied
        const netAmount = this.toSafeAmount(this.booking.netAmount);
        const taxPct = this.toSafePercent(this.booking.taxPercentage);
        this.taxOnDiscountedAmount = this.toSafeAmount(
          (netAmount * taxPct) / 100,
        );
        this.amountAfterDiscount = netAmount;
        this.convenienceFeeAmount = this.toSafeAmount(
          this.calculateConvenienceFee(netAmount, this.serviceChargePercentage),
        );
        const grandTotal = this.toSafeAmount(
          netAmount +
            this.taxOnDiscountedAmount +
            this.toSafeAmount(this.getServicesTotal()) +
            this.convenienceFeeAmount,
        );
        this.booking.totalAmount = grandTotal;
        this.booking.payableAmount = grandTotal;
        this.totalDiscountAmount = 0;
        this.advanceDiscountAmount = 0;
        this.advancePaymentAmount = 0;
        this.remainingPaymentAmount = grandTotal;
        this.logCalculationSnapshot('clearSelectedCoupons-no-discount', {
          netAmount,
          taxPct,
          taxOnDiscountedAmount: this.taxOnDiscountedAmount,
          convenienceFeeAmount: this.convenienceFeeAmount,
          servicesTotal: this.toSafeAmount(this.getServicesTotal()),
          grandTotal,
          payNowAmount: this.advancePaymentAmount,
          balanceAtCheckIn: this.remainingPaymentAmount,
        });
      }
      
      this.visiblePromotion = false;
      
      // Trigger change detection
      this.changeDetectorRefs.markForCheck();
    } catch (error) {
      console.error('Error in clearSelectedCoupons : ', error);
    }
  }
  // Used for handled to calculate the discount percentage
  calculateDiscountedPrice(
    originalAmount: number,
    discountPercentage: number,
  ): number {
    try {
      originalAmount = this.storedActualNetAmount;
      const discountAmount =
        this.storedActualNetAmount -
        (originalAmount * discountPercentage) / 100;
      return discountAmount;
    } catch (error) {
      console.error('Error in calculateDiscountedPrice : ', error);
    }
  }
  // Method to open the modal
  openPromoListData(): void {
    try {
      this.visiblePromotion = true;
    } catch (error) {
      console.error('Error in openPromoListData : ', error);
    }
  }
  isPresentCouponOffer(coupon?) {
    try {
      if (
        coupon?.discountPercentage ==
        this.selectedCouponList?.discountPercentage
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error in isPresentCouponOffer : ', error);
    }
  }
  applyPromoCode(offer) {
    if (offer !== '') {
      const f = new Date(this.booking.fromDate);
      const s = new Date(offer.startDate);

      const t = new Date(this.booking.toDate);
      const e = new Date(offer.endDate);
      if (s.getTime() <= f.getTime() && e.getTime() >= t.getTime()) {
        this.discountPercentage = offer.discountPercentage;
        this.booking.discountPercentage = offer.discountPercentage;
        this.booking.discountAmount =
          this.booking.netAmount * (this.booking.discountPercentage / 100);
        this.booking.totalAmount =
          this.booking.netAmount +
          (this.booking.netAmount * this.taxPercentage) / 100 -
          this.booking.discountAmount +
          this.totalServiceCost;

        this.promoMessage = offer.couponCode + ' applied!';
      } else {
        this.promoMessage = offer.couponCode + ' has expired!';
      }
    } else {
      this.discountPercentage = 0;
      this.booking.discountPercentage = 0;
      this.booking.discountAmount =
        this.booking.netAmount * (this.booking.discountPercentage / 100);
      this.booking.totalAmount =
        this.booking.netAmount +
        (this.booking.netAmount * this.taxPercentage) / 100 -
        this.booking.discountAmount;

      this.promoMessage = 'Not available!';
    }
  }
  mileSecondToNGBDate(date: string) {
    const dsd = new Date(date);
    const year = dsd.getFullYear();
    const day = dsd.getDate();
    const month = dsd.getMonth() + 1;
    return { year: year, month: month, day: day };
  }
  getDiffDate(toDate: any, fromDate: any) {
    if (!toDate || !fromDate) {
      this.DiffDate = 0;
      return;
    }

    const endDate = new Date(toDate.year, toDate.month - 1, toDate.day);
    const startDate = new Date(fromDate.year, fromDate.month - 1, fromDate.day);

    this.DiffDate = Math.floor(
      (Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
        Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        )) /
        (1000 * 60 * 60 * 24),
    );
  }

  toggleRoomsAndOccupancy() {
    if (this.roomsAndOccupancy === false) {
      this.roomsAndOccupancy = true;
    } else if (this.roomsAndOccupancy === true) {
      this.roomsAndOccupancy = false;
    }
  }
  onReload() {
    window.location.reload(true);
  }
  calculateDateDeference() {
    // Here are the two dates to compare
    const date1 = this.booking.fromDate;
    const date2 = this.booking.toDate;

    // First we split the values to arrays date1[0] is the year, [1] the month and [2] the day
    const date1a = date1.split('-');
    const date2a = date2.split('-');

    // Now we convert the array to a Date object, which has several helpful methods
    let date1b = new Date(
      Number(date1a[0]),
      Number(date1a[1]) + 1,
      Number(date1a[2]),
    );
    let date2b = new Date(
      Number(date2a[0]),
      Number(date2a[1]) + 1,
      Number(date2a[2]),
    );

    // We use the getTime() method and get the unixtime (in milliseconds, but we want seconds, therefore we divide it through 1000)
    const date1_unixtime = Number(date1b.getTime() / 1000);
    const date2_unixtime = Number(date2b.getTime() / 1000);

    // This is the calculated difference in seconds
    const timeDifference = date2_unixtime - date1_unixtime;

    // in Hours
    const timeDifferenceInHours = timeDifference / 60 / 60;

    // and finaly, in days :)
    this.timeDifferenceInDays = timeDifferenceInHours;
  }
  private getZoneByCountry(country?: string): string {
    return country?.toUpperCase() === 'INDIA' ? 'Asia/Kolkata' : 'UTC';
  }
  private getTimestamp(
    formattedDate: string, // dd-MM-yyyy
    time: string | null, // HH:mm
    country?: string,
  ): number {
    const zone = this.getZoneByCountry(country);

    // parse date (dd-MM-yyyy)
    const [day, month, year] = formattedDate.split('-').map(Number);

    // parse time or default 12:00
    const [hour, minute] = time ? time.split(':').map(Number) : [12, 0];

    // create UTC baseline
    const utcBase = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // extract exact date-time in target zone
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(utcBase);

    const map: any = {};
    parts.forEach((p) => (map[p.type] = p.value));

    // ZonedDateTime → Instant
    return Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
    );
  }
  displayPropertyTime(timestamp: number, zone: string = 'Asia/Kolkata') {
    return new Date(timestamp).toLocaleString('en-GB', {
      timeZone: zone,
      hour12: false,
    });
  }

  getPropertyDetails(id: number) {
    this.loader = true;
    // this.listingService.findByPropertyId(id).subscribe(
    //   (data) => {
    //     this.businessUser = data.body;
    this.businessUser = this.token.getProperty();
    this.businessUser.businessServiceDtoList.forEach((item) => {
      if (item.name === 'Accommodation') {
        this.fromTime = item.checkInTime ?? '';
        this.toTime = item.checkOutTime ?? '';
        this.channelManagerIntegration = item.cmIntegration;
        this.bookoneActiveData = item.bookoneActive;
      }
    });
    // 1️⃣ Property timezone
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    this.token.saveTime(String(this.tokenFromTime));
    this.token.saveToTime(String(this.tokenToTime));
    this.accommodationvalue = this.businessUser.businessServiceDtoList.filter(
      (ele) => ele.name === 'Accommodation',
    );
    this.currency = this.businessUser.localCurrency.toUpperCase();
    this.getOfferDetails();
    this.bookingData = this.token.getBookingData();
    this.getPropertyDetailsById(this.bookingData?.propertyId);
    // if (this.bookingData.propertyId != null && this.bookingData.propertyId != undefined) {

    // }
    this.mobileWallet = this.businessUser.mobileWallet;
    this.bankAccount = this.businessUser.bankAccount;
    //  Logger.log(' this.businessUser ===='+JSON.stringify( this.businessUser));
    if (this.businessUser.taxDetails.length > 0) {
      this.businessUser.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;

          if (this.bookingCity != null && this.bookingCity != undefined) {
            this.booking.roomPrice = Number(this.bookingCity);
          }
          // debugger
          if (element.taxSlabsList.length > 0) {
            element.taxSlabsList.forEach((element2) => {
              this.url = this.token.getBookingEngineBoolean();
              if (this.url === 'googlehotelcenter') {
                if (
                  element2.maxAmount >
                    this.booking.roomPrice +
                      (this.booking.extraPersonCharge +
                        this.booking.extraChildCharge) /
                        this.booking.noOfNights &&
                  element2.minAmount <
                    this.booking.roomPrice +
                      (this.booking.extraPersonCharge +
                        this.booking.extraChildCharge) /
                        this.booking.noOfNights
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <
                  this.booking.roomPrice +
                    (this.booking.extraPersonCharge +
                      this.booking.extraChildCharge) /
                      this.booking.noOfNights
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              } else {
                if (
                  element2.maxAmount > this.booking.netAmount &&
                  element2.minAmount < this.booking.netAmount
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount < this.booking.netAmount) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              }
            });
          }
        }
      });
      // console.log("this.taxPercentage1" +this.taxPercentage)

      // this.taxPercentage = this.booking.taxDetails[0].percentage;
    }

    this.booking.taxAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.booking.totalAmount =
      this.booking.netAmount +
      this.booking.gstAmount -
      this.booking.discountAmount +
      this.totalServiceCost;
    this.businessServiceDto = this.businessUser.businessServiceDtoList.find(
      (data) => data.name === 'Accommodation',
    );
    this.initializeAdvancePaymentPlans();

    if (this.businessServiceDto.checkInTime !== null) {
      this.booking.fromTime =
        new Date(this.booking.fromDate).getTime() +
        Number(this.businessServiceDto.checkInTime);
      this.booking.toTime =
        new Date(this.booking.toDate).getTime() +
        Number(this.businessServiceDto.checkOutTime);
    } else {
      this.booking.fromTime =
        new Date(this.booking.fromDate).getTime() + 43200000;
      this.booking.toTime = new Date(this.booking.toDate).getTime() + 43200000;
    }

    this.loader = false;
    //   },
    //   (_error) => {
    //     this.loader = false;
    //   }
    // );
  }

  clickPhone() {
    this.booking.email = '';
  }

  clickEmail() {
    this.booking.mobile = '';
    this.phoneWithoutCode = '';
    this.mobileHasError = false;
  }
  checkCustomer() {
    this.loader = true;
    this.syncBookingMobile();

    if (this.verifyOption === 'email') {
      this.message.email = this.booking.email;
      this.message.toNumber = null;
    } else if (this.verifyOption === 'sms') {
      this.message.toNumber = this.booking.mobile;
      this.message.email = null;
    }

    this.sendBtn = 'Resend';
    (this.hotelBookingService
      .authorisationToken(this.message)
      .subscribe((response) => {
        this.loader = false;
        Logger.log('authorisationToken data', JSON.stringify(response));
        const data: any = response;
        this.message.verificationStatus = data.verificationStatus;
        this.message.sid = data.sid;
        this.message.notificationStatus = data.notificationStatus;
      }),
      (error) => {
        this.loader = false;
      });
    // Logger.log('authorisationToken data', JSON.stringify(this.message));
    this.lookup = true;
    this.loader = false;
    this.verificationSend = true;
  }
  phoneHasError(obj) {
    Logger.log(JSON.stringify(obj));
    this.mobileHasError = obj;
  }
  removeItem(item) {
    this.addServiceList.splice(this.addServiceList.indexOf(item), 1);
    this.totalTaxAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
  }
  getNumber(obj) {
    Logger.log(JSON.stringify(obj));
    this.setMobileNumberByCode(obj);
  }
  onVerified() {
    this.isVerified = true;
  }
  mobileTextChange() {
    this.mobileHasError = true;
    this.isVerified = false;
  }
  customerLookup() {
    if (this.verifyOption === 'email') {
      this.hotelBookingService
        .getCustomerDetailsByEmail(this.booking.email)
        .subscribe(
          (data) => {
            this.bookingData.customerDtoList = [];
            // Logger.log('Get customer ' + JSON.stringify(data.body));
            this.booking.firstName = data.body.firstName;
            this.booking.lastName = data.body.lastName;
            //this.booking.mobile = data.body.mobile;
            this.setMobileNumberByCode(data.body.mobile);
            this.bookingData.customerDtoList.push(data.body);
            this.booking.customerId = this.bookingData.customerDtoList[0].id;
            this.lookup = true;
            this.customerExist = true;
            this.verified = true;
          },
          (_error) => {
            this.loader = false;
            this.lookup = true;
            this.customerExist = false;
          },
        );
    } else if (this.verifyOption === 'sms') {
      this.hotelBookingService
        .getCustomerDetailsByMobile(this.booking.mobile)
        .subscribe(
          (data) => {
            this.bookingData.customerDtoList = [];
            //  Logger.log('Get customer ' + JSON.stringify(data.body));
            this.booking.firstName = data.body.firstName;
            this.booking.lastName = data.body.lastName;
            // this.booking.mobile = data.body.mobile;
            this.booking.email = data.body.email;
            this.bookingData.customerDtoList.push(data.body);
            this.booking.customerId = this.bookingData.customerDtoList[0].id;
            this.lookup = true;
            this.customerExist = true;
            this.verified = true;
          },
          (_error) => {
            this.loader = false;
            this.lookup = true;
            this.customerExist = false;
          },
        );
    }
  }
  varificationSend() {
    this.loader = true;

    if (this.verifyOption === 'email') {
      this.message.email = this.booking.email;
      this.message.toNumber = null;
    } else if (this.verifyOption === 'sms') {
      this.message.toNumber = this.booking.mobile;
      this.message.email = null;
    }
    this.message.verificationCode = this.verificationCode;
    this.hotelBookingService.verifyAuthorisationToken(this.message).subscribe(
      (response) => {
        this.loader = false;

        const data: any = response;
        this.message.verificationStatus = data.verificationStatus;
        this.message.notificationStatus = data.notificationStatus;
        if (data.verificationStatus === 'approved') {
          this.verifiedPending = false;
          this.verified = true;
          this.verifySuccessMessage = true;
          setTimeout(function () {
            this.verifySuccessMessage = false;
          }, 5000);
        } else if (data.verificationStatus === 'pending') {
          this.isSuccess = false;
          this.verifiedPending = true;
          this.verified = false;
          this.verifySuccessMessage = true;
          setTimeout(function () {
            this.verifySuccessMessage = false;
          }, 5000);
        } else {
          this.verified = false;
        }
      },
      (_error) => {
        this.loader = false;
      },
    );
  }
  onSubmit(orderForm) {}

  showSuccess(content) {
    this.alertType = 'success';
    this.showAlert = true;
  }
  showWarning(content) {
    this.alertType = 'warning';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.changeDetectorRefs.detectChanges();
    }, 3000);
  }
  showDanger(content) {
    this.alertType = 'danger';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.changeDetectorRefs.detectChanges();
    }, 3000);
  }
  backClicked() {
    this.PropertyUrl = this.token.getPropertyUrl();
    window.location.href = this.PropertyUrl;
  }
  getDateFormatDayMonthYear(
    day12: number,
    month12: number,
    year12: number,
  ): string {
    const year = year12;
    const date = day12;

    const month = month12;

    let month1;
    let day1;
    if (Number(month) < 10) {
      month1 = `0${month}`;
    } else {
      month1 = `${month}`;
    }
    if (Number(date) < 10) {
      day1 = `0${date}`;
    } else {
      day1 = `${date}`;
    }

    return `${day1}-${month1}-${year}`;
  }

  onCardPaymentSubmit() {
    this.payment.paymentMode = 'Card';
    this.payment.status = 'Paid';
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.payment.transactionAmount = this.booking.totalAmount;
    this.payment.amount = this.booking.totalAmount;
    this.payment.propertyId = this.bookingData.propertyId;
    this.payment.transactionChargeAmount = this.booking.totalAmount;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.currency = this.businessUser.localCurrency;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.payment.taxAmount = this.booking.gstAmount;
    this.chargeCreditCard(this.payment);
  }
  onWalletPaymentSubmit() {
    this.payment.paymentMode = 'Wallet';
    this.payment.status = 'Paid';
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.payment.transactionAmount = this.booking.totalAmount;
    this.payment.amount = this.booking.totalAmount;
    this.payment.propertyId = this.booking.propertyId;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.transactionChargeAmount = this.booking.totalAmount;
    this.payment.currency = this.businessUser.localCurrency;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.payment.taxAmount = this.booking.gstAmount;

    this.processPayment(this.payment);
  }
  onBankPaymentSubmit(content) {
    this.payment.paymentMode = 'BankTransfer';
    this.payment.status = 'Paid';
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.payment.transactionAmount = this.booking.totalAmount;
    this.payment.amount = this.booking.totalAmount;
    this.payment.propertyId = this.bookingData.propertyId;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.transactionChargeAmount = this.booking.totalAmount;
    this.payment.currency = this.businessUser.localCurrency;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.payment.taxAmount = this.booking.gstAmount;

    this.processPayment(this.payment);
  }

  validateFrom() {
    this.syncBookingMobile();
    if (
      EMAIL_Expression.test(this.booking.email) === true &&
      this.booking.firstName != null &&
      this.booking.firstName != undefined &&
      this.booking.firstName != '' &&
      this.booking.lastName != null &&
      this.booking.lastName != undefined &&
      this.booking.lastName != '' &&
      // this.booking.mobile != null &&
      // this.booking.mobile != undefined &&
      // this.booking.mobile != '' &&
      this.phoneWithoutCode != null &&
      this.phoneWithoutCode != undefined &&
      this.phoneWithoutCode != '' &&
      this.validateForm()
    ) {
      return true;
    } else {
      return false;
    }
  }
  Upi() {
    this.cashPayment = false;
  }

  submitFormOne() {
    // console.log("taxxation", this.booking.taxAmount)
    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    if (bookingSummaryStr) {
      this.bookingSummaryDetails = JSON.parse(bookingSummaryStr);

      if (
        this.bookingSummaryDetails.selectedPlansSummary &&
        this.bookingSummaryDetails.selectedPlansSummary.length > 0
      ) {
        // Get the 0th index plan
        const firstPlan = this.bookingSummaryDetails.selectedPlansSummary[0];
      }
    }
    this.enquiryForm = new EnquiryDto();
    if (
      this.token.getProperty().address != null &&
      this.token.getProperty().address != undefined &&
      this.token.getProperty().address.city != null &&
      this.token.getProperty().address.city != undefined
    ) {
      this.enquiryForm.address = this.token.getProperty().address;
      this.enquiryForm.country = this.token.getProperty().address.country;
      this.enquiryForm.location = this.token.getProperty().address.city;
      this.enquiryForm.alternativeLocation =
        this.token.getProperty().address.city;
    }
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.enquiryForm.min = Number(this.booking.totalAmount.toFixed(2));
    this.enquiryForm.max = Number(this.booking.totalAmount.toFixed(2));

    this.enquiryForm.firstName = this.booking.firstName;
    this.enquiryForm.lastName = this.booking.lastName;
    this.enquiryForm.email = this.booking.email;
    this.enquiryForm.phone = this.getFullPhoneNumber();
    this.enquiryForm.checkOutDate = this.booking.toDate;
    this.enquiryForm.checkInDate = this.booking.fromDate;
    // const toDate = new Date(this.booking.toDate);
    // this.enquiryForm.toTime = toDate.getTime();
    // const fromDate = new Date(this.booking.fromDate);
    // this.enquiryForm.fromTime = fromDate.getTime();
    this.enquiryForm.noOfPerson = this.booking.noOfPersons;
    this.enquiryForm.noOfExtraPerson = this.booking.noOfExtraPerson;
    this.enquiryForm.roomId = this.booking.roomId;
    // Grand total = rooms after all discounts + tax + services + convenience.
    // getNewGrandTotal() is the single authoritative source used by the payment gateway too.
    const grandTotal = this.toSafeAmount(this.getNewGrandTotal());
    const servicesTotalForEnquiry = this.toSafeAmount(this.getServicesTotal());
    this.enquiryForm.totalAmount = grandTotal;
    this.enquiryForm.payableAmount = grandTotal;
    // beforeTaxAmount = rooms after ALL discounts (coupon + advance) — amountAfterDiscount
    this.enquiryForm.beforeTaxAmount = this.toSafeAmount(this.amountAfterDiscount);
    // advanceAmount = Pay Now amount (booking.advanceAmount set by calculateMultiDiscountAndTax / applyAuthoritativeGatewayAmounts)
    this.enquiryForm.advanceAmount = this.toSafeAmount(this.getNewPayNowAmount());
    this.enquiryForm.selectedServiceTotal = servicesTotalForEnquiry;
    if (this.savedServices && this.savedServices.length > 0) {
      this.enquiryForm.selectedServices = this.savedServices;
    }
    this.enquiryForm.roomName = this.booking.roomName;
    this.enquiryForm.extraPersonCharge = this.booking.extraPersonCharge;
    this.enquiryForm.extraChildCharge = this.booking.extraChildCharge;
    this.enquiryForm.noOfExtraChild = this.booking.noOfExtraChild;
    this.enquiryForm.externalSite = 'WebSite';
    this.enquiryForm.source = 'The Hotel Mate';
    if (
      this.token.getProperty().whatsApp === '' ||
      this.token.getProperty().whatsApp === null ||
      this.token.getProperty().whatsApp === undefined
    ) {
      this.enquiryForm.mobile = this.token.getProperty().mobile;
    } else {
      this.enquiryForm.mobile = this.token.getProperty().whatsApp;
    }
    this.enquiryForm.roomType = this.booking.roomType;
    this.enquiryForm.roomRatePlanName = this.booking.roomRatePlanName;

    this.enquiryForm.createdDate = new Date().getTime();
    this.businessUser = this.token.getProperty();
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    this.enquiryForm.fromTime = this.tokenFromTime;
    this.enquiryForm.toTime = this.tokenToTime;
    this.token.saveTime(String(this.enquiryForm.fromTime));
    this.token.saveToTime(String(this.enquiryForm.toTime));
    this.enquiryForm.accountManager = '';
    this.enquiryForm.consultantPerson = '';
    this.enquiryForm.noOfRooms = this.booking.noOfRooms;
    this.enquiryForm.noOfChildren = this.booking.noOfChildren;
    this.enquiryForm.accommodationType = this.token.getProperty().businessType;
    this.enquiryForm.couponCode = this.booking.couponCode;
    this.enquiryForm.promotionName = this.booking.promotionName;
    this.enquiryForm.discountAmountPercentage = this.booking.discountPercentage;
    this.enquiryForm.status = 'Enquiry';
    this.enquiryForm.specialNotes = this.booking.notes;
    this.enquiryForm.propertyId = 107;
    this.enquiryForm.currency = this.token.getProperty().localCurrency;
    this.enquiryForm.taxDetails = this.token
      .getProperty()
      .taxDetails.filter(
        (item) =>
          item.name === 'CGST' || item.name === 'SGST' || item.name === 'GST',
      );
    this.enquiryForm.taxDetails.forEach((item) => {
      if (item.name === 'CGST') {
        this.percentage1 = item.percentage;
      }

      if (item.name === 'SGST') {
        this.percentage2 = item.percentage;
      }
    });
    this.totalPercentage = this.percentage1 + this.percentage2;

    this.enquiryForm.taxAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.enquiryForm.planCode = this.booking.planCode;

    this.enquiryForm.bookingPropertyId = this.token.getProperty().id;
    this.enquiryForm.propertyName = this.token.getProperty().name;

    const TO_EMAIL = 'reservation@thehotelmate.co';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'samaya.muduli@credencesoft.co.nz';
    const bccEmail2 = 'info@bookonepms.com';
    const bccName = 'Samaya';

    this.enquiryForm.fromName =
      this.enquiryForm.firstName + ' ' + this.enquiryForm.lastName;
    this.enquiryForm.toName = TO_NAME;
    this.enquiryForm.fromEmail = this.enquiryForm.email;
    this.enquiryForm.toEmail = TO_EMAIL;
    this.enquiryForm.bccEmail = bccEmail;
    this.enquiryForm.bccName = bccEmail;
    this.enquiryForm.bccEmailTo = bccEmail2;
    this.enquiryForm.status = 'Enquiry';

    if (
      this.enquiryForm.dietaryRequirement === null ||
      this.enquiryForm.dietaryRequirement === undefined
    ) {
      this.enquiryForm.dietaryRequirement = '';
    }
    if (
      this.enquiryForm.accommodationType === null ||
      this.enquiryForm.accommodationType === undefined
    ) {
      this.enquiryForm.accommodationType = '';
    }
    if (
      this.enquiryForm.specialNotes === null ||
      this.enquiryForm.specialNotes === undefined
    ) {
      this.enquiryForm.specialNotes = '';
    }
    if (
      this.enquiryForm.alternativeLocation === null ||
      this.enquiryForm.alternativeLocation === undefined
    ) {
      this.enquiryForm.alternativeLocation = '';
    }
    this.enquiryForm.foodOptions = '';
    this.enquiryForm.organisationId = environment.parentOrganisationId;
    this.enquiryForm.bookingCommissionAmount = 0;
    this.paymentLoader = true;
    // roomPrice sent to LMS must be the per-room-per-night tariff BEFORE any discount.
    // LMS (BookingPaymentOrchestrationServiceImpl) multiplies: roomPrice × noOfRooms × noOfNights.
    // Previously this used netAmount (post-discount total for all nights) causing double-multiplication of nights.
    this.enquiryForm.roomPrice = this.booking.roomTariffBeforeDiscount;
    this.enquiryForm.couponCode = this.booking.couponCode;
    this.enquiryForm.promotionName = this.booking.promotionName;
    this.enquiryForm.discountAmount = this.booking.discountAmount;
    this.enquiryForm.discountAmountPercentage = this.booking.discountPercentage;
    this.hotelBookingService.accommodationEnquiry(this.enquiryForm).subscribe(
      (response) => {
        this.equitycreatedData = response.body;
        this.isEnquiry = true;
        this.paymentLoader = false;
        this.paymentLoader = false;
        this.isSuccess = true;
        this.submitButtonDisable = true;
        // this.bookingConfirmed = true;
        this.enquiryNo = 'THM-' + response.body.enquiryId;
        this.enquiriesNo = response.body.enquiryId;

        sessionStorage.setItem('enquiryNo', this.enquiriesNo);
      },
      (error) => {
        this.paymentLoader = false;
      },
    );
  }

  async createAllEnquiriesBooking() {
    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;

    if (!bookingSummary || !bookingSummary.selectedPlansSummary?.length) {
      console.error('No valid booking summary found.');
      return;
    }

    const bookingList = bookingSummary.selectedPlansSummary;
    this.equitycreatedData = null;

    for (let i = 0; i < bookingList.length; i++) {
      const _booking = bookingList[i];

      await this.submitFormBooking(_booking, bookingList, i);
    }
  }

  async submitFormBooking(plan: any, bookingSummary: any, index: number = 0) {
    const booking: any = this.booking;
    const isFirstEnquiryPayload = index === 0;

    // booking discount/advance fields are set authoritatively by calculateMultiDiscountAndTax() — do NOT overwrite.

    const enquiryForm = new EnquiryDto();

    if (this.token.getProperty()?.address?.city) {
      enquiryForm.address = this.token.getProperty().address;
      enquiryForm.country = this.token.getProperty().address.country;
      enquiryForm.location = this.token.getProperty().address.city;
      enquiryForm.alternativeLocation = this.token.getProperty().address.city;
    }

    const planBeforeTaxAmount = this.toSafeAmount(
      this.getPlanAmountAfterDiscount(plan),
    );
    const planTaxAmount = this.toSafeAmount(this.getPlanTaxAfterDiscount(plan));
    const planRoomTotalAmount = this.toSafeAmount(
      planBeforeTaxAmount + planTaxAmount,
    );
    const selectedServiceTotal = isFirstEnquiryPayload
      ? this.toSafeAmount(this.getServicesTotal())
      : 0;
    const convenienceFee = isFirstEnquiryPayload
      ? this.toSafeAmount(this.getDisplayedConvenienceFeeAmount())
      : 0;
    const planTotalAmount = this.toSafeAmount(
      planBeforeTaxAmount +
        planTaxAmount +
        selectedServiceTotal +
        convenienceFee,
    );
    this.payment.netReceivableAmount = planRoomTotalAmount;
    enquiryForm.min = planRoomTotalAmount;
    enquiryForm.max = planRoomTotalAmount;
    if (this.groupBookingId) {
      enquiryForm.groupEnquiryId = this.groupBookingId;
      sessionStorage.setItem('groupbookingId', enquiryForm.groupEnquiryId);
    }
    enquiryForm.firstName = booking.firstName;
    enquiryForm.lastName = booking.lastName;
    enquiryForm.email = booking.email;
    enquiryForm.phone = this.buildFullPhoneNumber(booking.mobile);
    enquiryForm.checkOutDate = booking.toDate;
    enquiryForm.checkInDate = booking.fromDate;
    enquiryForm.noOfPerson = plan.adults;
    enquiryForm.enquiryType = 'Pay Now';
    enquiryForm.noOfExtraPerson = plan.extraCountAdult;
    enquiryForm.roomId = plan.roomId;
    if (this.token?.getProperty()?.paymentGateway === 'PayU') {
      enquiryForm.modeOfPayment = 'PayU';
    }
    enquiryForm.payableAmount = planTotalAmount;
    enquiryForm.roomName = plan.roomName;
    enquiryForm.extraPersonCharge = plan.extraPersonAdultCountAmount;
    enquiryForm.extraChildCharge = plan?.extraPersonChildCountAmount;
    enquiryForm.noOfExtraChild = plan.extraCountChild;
    const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
    this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
    const utmSessionValue = sessionStorage.getItem('utm_source');
    if (utmSessionValue && !this.websiteUrlBookingEngine) {
      enquiryForm.utmSource = sessionStorage.getItem('utm_source');
      enquiryForm.utmMedium = sessionStorage.getItem('utm_medium');
    } else if (this.websiteUrlBookingEngine && utmSessionValue) {
      enquiryForm.utmSource = sessionStorage.getItem('utm_source');
      enquiryForm.utmMedium = sessionStorage.getItem('utm_medium');
    } else if (this.websiteUrlBookingEngine && !utmSessionValue) {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'bookingEngine';
    } else if (this.activeGoogleCenter && !utmSessionValue) {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'ghc';
    } else {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'unknown';
    }

    // roomPrice must be per-room-per-night tariff so LMS can multiply: roomPrice × noOfRooms × noOfNights.
    // plan.actualRoomPrice is the per-room-per-night rate; do NOT subtract extra charges (different units).
    enquiryForm.roomPrice = plan.actualRoomPrice;

    enquiryForm.externalSite = 'WebSite';
    enquiryForm.source = 'Bookone Connect';
    enquiryForm.couponCode = booking.couponCode;
    enquiryForm.promotionName = booking.promotionName;
    enquiryForm.discountAmount = this.toSafeAmount(
      this.getPlanDiscountAmount(plan),
    );
    // beforeTaxAmount = this room type after ALL discounts (coupon + advance).
    enquiryForm.beforeTaxAmount = planBeforeTaxAmount;

    enquiryForm.mobile =
      this.token.getProperty().whatsApp || this.token.getProperty().mobile;

    enquiryForm.roomType = plan.roomName;
    enquiryForm.roomRatePlanName = plan.planCodeName;
    enquiryForm.createdDate = new Date().getTime();

    this.businessUser = this.token.getProperty();
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    enquiryForm.fromTime = this.tokenFromTime;
    enquiryForm.toTime = this.tokenToTime;
    this.token.saveTime(String(enquiryForm.fromTime));
    this.token.saveToTime(String(enquiryForm.toTime));
    enquiryForm.accountManager = '';
    enquiryForm.consultantPerson = '';
    enquiryForm.noOfRooms = Number(plan.selectedRoomnumber);
    enquiryForm.noOfChildren = plan.children;
    enquiryForm.accommodationType = this.token.getProperty().businessType;
    enquiryForm.status = 'Enquiry';
    enquiryForm.specialNotes = booking.notes || '';
    enquiryForm.propertyId = 107;
    enquiryForm.bookingPropertyId = this.token.getProperty().id;
    enquiryForm.propertyName = this.token.getProperty().name;
    enquiryForm.taxDetails = this.token
      .getProperty()
      .taxDetails.filter((item) => ['CGST', 'SGST', 'GST'].includes(item.name));
    enquiryForm.taxAmount = planTaxAmount;

    const TO_EMAIL = 'reservation@thehotelmate.co';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'samaya.muduli@credencesoft.co.nz';
    const bccEmail2 = 'info@bookonepms.com';

    enquiryForm.fromName = `${enquiryForm.firstName} ${enquiryForm.lastName}`;
    enquiryForm.toName = TO_NAME;
    enquiryForm.fromEmail = enquiryForm.email;
    enquiryForm.toEmail = TO_EMAIL;
    enquiryForm.bccEmail = bccEmail;
    enquiryForm.bccName = bccEmail;
    enquiryForm.bccEmailTo = bccEmail2;

    enquiryForm.dietaryRequirement = enquiryForm.dietaryRequirement || '';
    enquiryForm.accommodationType = enquiryForm.accommodationType || '';
    enquiryForm.specialNotes = enquiryForm.specialNotes || '';
    enquiryForm.alternativeLocation = enquiryForm.alternativeLocation || '';
    enquiryForm.roomTariffBeforeDiscount = plan.actualRoomPrice.toFixed(2);
    enquiryForm.totalRoomTariffBeforeDiscount =
      enquiryForm.roomTariffBeforeDiscount *
      plan.nights *
      plan.selectedRoomnumber;
    // Room payload values stay room-specific. Pay Now amount, add-ons and convenience
    // fee are attached only to the first enquiry in a multi-room group.
    enquiryForm.totalAmount = planTotalAmount;
    enquiryForm.payableAmount = planTotalAmount;
    enquiryForm.advanceAmount = isFirstEnquiryPayload
      ? this.toSafeAmount(this.getNewPayNowAmount())
      : 0;
    enquiryForm.convenienceFee = convenienceFee;
    enquiryForm.discountAmountPercentage = booking.discountPercentage;
    enquiryForm.selectedServiceTotal = selectedServiceTotal;
    if (
      isFirstEnquiryPayload &&
      this.savedServices &&
      this.savedServices.length > 0
    ) {
      enquiryForm.selectedServices = this.savedServices;
    }
    enquiryForm.noOfNights = plan.nights;
    enquiryForm.foodOptions = '';
    enquiryForm.organisationId = environment.parentOrganisationId;
    enquiryForm.bookingCommissionAmount = 0;
    enquiryForm.taxPercentage = plan.taxpercentage;
    // Do NOT overwrite room-specific totals here with booking-level totals.

    this.paymentLoader = true;
    try {
      const response: HttpResponse<EnquiryDto> = await this.hotelBookingService
        .accommodationEnquiry(enquiryForm)
        .toPromise();
      if (response) {
        this.paymentLoader = false;
        const createdEnquiry = response.body;
        if (isFirstEnquiryPayload || !this.equitycreatedData) {
          this.equitycreatedData = createdEnquiry;
          this.token.saveEnquiryData(this.equitycreatedData);
          this.enquiryNo = 'THM-' + createdEnquiry.enquiryId;
        }
        const existingEnquirysStr = sessionStorage.getItem(
          'EnquiryResponseList',
        );
        const existingEnquiries = existingEnquirysStr
          ? JSON.parse(existingEnquirysStr)
          : [];
        existingEnquiries.push(createdEnquiry);
        sessionStorage.setItem(
          'EnquiryResponseList',
          JSON.stringify(existingEnquiries),
        );
        this.isEnquiry = true;
        this.paymentLoader = false;
        this.paymentLoader = false;
        this.isSuccess = true;
        this.submitButtonDisable = true;
      }
    } catch (e) {
      console.error('Submit failed', e);
    }

    return false;
  }

  isRoomSoldOut(plan: any): boolean {
    if (!this.availabilityLoaded) {
      return false;
    }
    return !this.availableRoomIdSet.has(plan.roomId);
  }

  hasAnySoldOutRoom(): boolean {
    if (!this.availabilityLoaded) return false;
    return this.bookingSummaryDetails?.selectedPlansSummary?.some((plan) =>
      this.isRoomSoldOut(plan),
    );
  }

  scrollToSoldOut() {
    const el = document.getElementById('soldOutSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToSoldOutOne() {
    const el = document.getElementById('soldOutSectionOne');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onEditBooking() {
    this.PropertyUrl = this.token.getPropertyUrl();
    if (!this.PropertyUrl) return;

    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('EnquiryResponseList');

    // tell the previous page where to scroll
    sessionStorage.setItem('scrollTo', 'accmdOne');

    window.location.href = this.PropertyUrl; // no # in URL
  }

  checkingAvailabilityOne(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.availabilityLoaded = false;
      this.isSuccess = true;
      this.headerTitle = 'Success!';
      this.bodyMessage = 'CheckAvailability Clicked ';

      this.showSuccess(this.contentDialog);

      setTimeout(() => {
        this.showAlert = false;
        this.changeDetectorRefs.detectChanges();
      }, 1000);

      this.booking.propertyId = this.businessUser.id;

      this.hotelBookingService
        .checkAvailabilityByProperty(
          this.booking.fromDate,
          this.booking.toDate,
          this.booking.noOfRooms,
          this.booking.noOfPersons,
          this.booking.propertyId,
        )
        .subscribe(
          (response) => {
            const roomListOne = response.body.roomList || [];

            const sortedRoomsOne = roomListOne.sort(
              (a: any, b: any) => b.roomOnlyPrice - a.roomOnlyPrice,
            );

            this.availableRoomsOne = sortedRoomsOne.filter((room) => {
              const rates = room.ratesAndAvailabilityDtos;
              if (!rates || rates.length === 0) return false;

              const isStopSellOBE =
                rates[0]?.stopSellOBE !== null &&
                rates[0]?.stopSellOBE !== false;

              const isStopSellOTA =
                rates[0]?.stopSellOTA !== null &&
                rates[0]?.stopSellOTA !== false;

              return (
                rates.length === this.booking.noOfNights &&
                !isStopSellOBE &&
                !isStopSellOTA
              );
            });
            console.log('this.availableRoomsOne', this.availableRoomsOne);
            this.soldOutRooms = sortedRoomsOne.filter((room) => {
              const rates = room.ratesAndAvailabilityDtos;
              if (!rates || rates.length !== this.booking.noOfNights)
                return true;

              const isStopSellOBE =
                rates[0]?.stopSellOBE !== null &&
                rates[0]?.stopSellOBE !== false;

              const isStopSellOTA =
                rates[0]?.stopSellOTA !== null &&
                rates[0]?.stopSellOTA !== false;

              return isStopSellOBE || isStopSellOTA;
            });
            this.availableRoomIdSet.clear();
            this.availableRoomsOne.forEach((room) => {
              this.availableRoomIdSet.add(room.id);
            });

            this.availabilityLoaded = true;

            resolve(this.hasAnySoldOutRoom());
          },
          (error) => {
            this.availabilityLoaded = true;
            reject(error);
          },
        );
    });
  }

  async payAndCheckout() {
    if (this.isPayDisabled) return;
    this.isPayDisabled = true;
    const hasSoldOut = await this.checkingAvailabilityOne();
    if (hasSoldOut) {
      if (this.hasAnySoldOutRoom()) {
        this.scrollToSoldOut();
        this.scrollToSoldOutOne();
        return;
      }
    }
    sessionStorage.removeItem('EnquiryResponseList');
    this.isPayNowDisabled = true;

    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;
    const plans = bookingSummary.selectedPlansSummary;
    if (plans.length >= 2) {
      this.groupBookingId = Math.floor(10000000 + Math.random() * 90000000);
    }
    if (bookingSummaryStr) {
      this.bookingSummaryDetails = JSON.parse(bookingSummaryStr);

      if (
        this.bookingSummaryDetails.selectedPlansSummary &&
        this.bookingSummaryDetails.selectedPlansSummary.length > 0
      ) {
        // Get the 0th index plan
        const firstPlan = this.bookingSummaryDetails.selectedPlansSummary[0];
        // booking.discountAmount, discountPercentage, promotionName, netAmount, advanceAmount
        // are set authoritatively by calculateMultiDiscountAndTax() — do NOT overwrite them here.
        this.calculateMultiDiscountAndTax();
        const checkoutTaxAmount = this.toSafeAmount(this.getTotalTax());
        this.booking.taxAmount = checkoutTaxAmount;
        this.booking.gstAmount = checkoutTaxAmount;
        this.bookingSummaryDetails.totalTax = checkoutTaxAmount;
        this.bookingroomPrice = firstPlan?.actualRoomPrice;
        await this.createAllEnquiriesBooking();
        this.payment.callbackUrl =
          environment.callbackUrl +
          this.booking.propertyReservationNumber +
          '&BookingEngine=true';
        if (this.businessUser.paymentGateway === 'paytm') {
          this.payment.paymentMode = 'UPI';
          this.payment.status = 'NotPaid';
          this.payment.businessServiceName = 'Accommodation';
          this.payment.firstName = this.booking.firstName;
          this.payment.lastName = this.booking.lastName;
          this.payment.name =
            this.booking.firstName + ' ' + this.booking.lastName;

          this.payment.email = this.booking.email;
          this.payment.businessEmail = this.businessUser.email;
          this.payment.currency = this.businessUser.localCurrency;
          this.payment.propertyId = this.businessUser.id;
          this.booking.taxAmount = firstPlan?.taxPercentageperroom;
          if (this.businessServiceDto.advanceAmountPercentage === 100) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (this.bookingSummaryDetails?.totalPlanPrice *
                  this.serviceChargePercentage) /
                100;
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.amount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.amount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.booking.advanceAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.transactionChargeAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
            }
          } else if (this.businessServiceDto.advanceAmountPercentage === 50) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
            }
          } else {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
            }
          }

          if (this.specialDiscountData) {
            const firstPlanOne =
              this.bookingSummaryDetails.selectedPlansSummary[0];
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlanOne.discountedPrice * this.serviceChargePercentage) /
                100;
              this.booking.netAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                const serviceChargeAmount =
                  ((this.bookingSummaryDetails?.totalPlanPrice -
                    (this.bookingSummaryDetails?.totalPlanPrice *
                      this.specialDiscountData?.discountPercentage) /
                      100) *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.booking.advanceAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              } else {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 20).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              }
            } else {
              this.booking.netAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.booking.advanceAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 50).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
              } else {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
              }
            }
          }

          // if (this.selectedAdvanceDiscountSlab) {
          //   const firstPlan = this.bookingSummaryDetails.selectedPlansSummary[0];

          //   const discountPercentage =
          //     this.selectedAdvanceDiscountSlab.discountPercentage ?? 0;

          //   const advancePercentage =
          //     this.selectedAdvanceDiscountSlab.advancePercentage ?? 0;

          //   const hasServiceCharge =
          //     this.serviceChargePercentage && this.serviceChargePercentage > 0;

          //   let serviceChargeAmount = 0;

          //   if (hasServiceCharge) {
          //     serviceChargeAmount =
          //       (firstPlan.discountedPrice * this.serviceChargePercentage) / 100;
          //   }

          //   const baseAmount = firstPlan.discountedPrice + serviceChargeAmount;

          //   this.booking.netAmount = Number(baseAmount.toFixed(2));
          //   this.booking.gstAmount = Number(
          //     firstPlan.taxPercentageperroom.toFixed(2)
          //   );
          //   this.booking.discountPercentage = discountPercentage;
          //   this.booking.discountAmount = Number(
          //     firstPlan.discountAmount.toFixed(2)
          //   );
          //   this.booking.beforeTaxAmount = Number(baseAmount.toFixed(2));
          //   this.booking.taxAmount = Number(
          //     firstPlan.taxPercentageperroom.toFixed(2)
          //   );

          //   const advanceAmount = Number(
          //     ((baseAmount * advancePercentage) / 100).toFixed(2)
          //   );

          //   const advanceTax = Number(
          //     (
          //       (this.bookingSummaryDetails.totalTax * advancePercentage) /
          //       100
          //     ).toFixed(2)
          //   );

          //   this.payment.taxAmount = advanceTax;
          //   this.payment.netReceivableAmount = advanceAmount;
          //   this.payment.transactionAmount = advanceAmount;
          //   this.payment.amount = advanceAmount;
          //   this.payment.transactionChargeAmount = advanceAmount;

          //   this.booking.advanceAmount = Math.min(
          //     advanceAmount,
          //     this.bookingSummaryDetails.totalAmount
          //   );
          // }
          
          this.payment.referenceNumber = new Date().getTime().toString();
          this.payment.deliveryChargeAmount = 0;
          this.payment.date = this.datePipe.transform(
            new Date().getTime(),
            'yyyy-MM-dd',
          );
          // Logger.log("this.payment " + JSON.stringify(this.payment));
          // this.token.saveBookingData(this.booking);
          // this.token.savePaymentData(this.payment);

          this.payment.callbackUrl = environment.callbackUrl;

          this.processPaymentPayTM(this.payment);
          // this.processPaymentPayTM(this.payment);

          this.cardPaymentAvailable = true;
        } else if (this.businessUser.paymentGateway === 'atom') {
          this.payment.paymentMode = 'UPI';
          this.payment.status = 'NotPaid';
          this.payment.businessServiceName = 'Accommodation';
          this.payment.firstName = this.booking.firstName;
          this.payment.lastName = this.booking.lastName;
          this.payment.name =
            this.booking.firstName + ' ' + this.booking.lastName;

          this.payment.email = this.booking.email;
          this.payment.businessEmail = this.businessUser.email;
          this.payment.currency = this.businessUser.localCurrency;
          this.payment.propertyId = this.businessUser.id;
          this.booking.taxAmount = firstPlan?.taxPercentageperroom;
          if (this.businessServiceDto.advanceAmountPercentage === 100) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (this.bookingSummaryDetails?.totalPlanPrice *
                  this.serviceChargePercentage) /
                100;
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.amount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.amount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.booking.advanceAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.transactionChargeAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
            }
          } else if (this.businessServiceDto.advanceAmountPercentage === 50) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
            }
          } else {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
            }
          }

          if (this.specialDiscountData) {
            const firstPlanOne =
              this.bookingSummaryDetails.selectedPlansSummary[0];
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlanOne.discountedPrice * this.serviceChargePercentage) /
                100;
              this.booking.netAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                const serviceChargeAmount =
                  ((this.bookingSummaryDetails?.totalPlanPrice -
                    (this.bookingSummaryDetails?.totalPlanPrice *
                      this.specialDiscountData?.discountPercentage) /
                      100) *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.booking.advanceAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              } else {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 20).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              }
            } else {
              this.booking.netAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.booking.advanceAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 50).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
              } else {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
              }
            }
          }

          // if (this.selectedAdvanceDiscountSlab) {
          //   const firstPlanOne =
          //     this.bookingSummaryDetails.selectedPlansSummary[0];

          //   const advancePercentage =
          //     this.selectedAdvanceDiscountSlab.advancePercentage ?? 0;

          //   const discountPercentage =
          //     this.selectedAdvanceDiscountSlab.discountPercentage ?? 0;

          //   if (
          //     this.serviceChargePercentage &&
          //     this.serviceChargePercentage > 0
          //   ) {
          //     const serviceChargeAmount =
          //       (firstPlanOne.discountedPrice * this.serviceChargePercentage) / 100;

          //     this.booking.netAmount = Number(
          //       (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
          //     );

          //     this.booking.gstAmount = Number(
          //       firstPlanOne.taxPercentageperroom.toFixed(2),
          //     );

          //     this.booking.discountPercentage = discountPercentage;

          //     this.booking.discountAmount = Number(
          //       firstPlanOne.discountAmount.toFixed(2),
          //     );

          //     this.booking.beforeTaxAmount = Number(
          //       (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
          //     );

          //     this.booking.taxAmount = Number(
          //       firstPlanOne.taxPercentageperroom.toFixed(2),
          //     );

          //     const advanceAmount = Number(
          //       (
          //         (firstPlanOne.finalPrice * advancePercentage) / 100 +
          //         serviceChargeAmount
          //       ).toFixed(2),
          //     );

          //     const advanceTax = Number(
          //       (
          //         (this.bookingSummaryDetails?.totalTax * advancePercentage) /
          //         100
          //       ).toFixed(2),
          //     );

          //     this.payment.taxAmount = advanceTax;

          //     this.payment.netReceivableAmount = advanceAmount;

          //     this.payment.transactionAmount = advanceAmount;

          //     this.payment.amount = advanceAmount;

          //     this.booking.advanceAmount = advanceAmount;

          //     this.payment.transactionChargeAmount = advanceAmount;
          //   } else {
          //     this.booking.netAmount = Number(
          //       firstPlanOne.discountedPrice.toFixed(2),
          //     );

          //     this.booking.gstAmount = Number(
          //       firstPlanOne.taxPercentageperroom.toFixed(2),
          //     );

          //     this.booking.discountPercentage = discountPercentage;

          //     this.booking.discountAmount = Number(
          //       firstPlanOne.discountAmount.toFixed(2),
          //     );

          //     this.booking.beforeTaxAmount = Number(
          //       firstPlanOne.discountedPrice.toFixed(2),
          //     );

          //     this.booking.taxAmount = Number(
          //       firstPlanOne.taxPercentageperroom.toFixed(2),
          //     );

          //     const advanceAmount = Number(
          //       ((firstPlanOne.finalPrice * advancePercentage) / 100).toFixed(2),
          //     );

          //     const advanceTax = Number(
          //       (
          //         (this.bookingSummaryDetails?.totalTax * advancePercentage) /
          //         100
          //       ).toFixed(2),
          //     );

          //     this.payment.taxAmount = advanceTax;

          //     this.payment.netReceivableAmount = advanceAmount;

          //     this.payment.transactionAmount = advanceAmount;

          //     this.payment.amount = advanceAmount;

          //     this.booking.advanceAmount = advanceAmount;

          //     this.payment.transactionChargeAmount = advanceAmount;
          //   }
          // }






          this.payment.referenceNumber = new Date().getTime().toString();
          this.payment.deliveryChargeAmount = 0;
          this.payment.date = this.datePipe.transform(
            new Date().getTime(),
            'yyyy-MM-dd',
          );
          Logger.log('this.payment ' + JSON.stringify(this.payment));
          // this.token.saveBookingData(this.booking);
          // this.token.savePaymentData(this.payment);

          // this.createBookingAtom();
          this.processPaymentAtom(this.payment);

          this.cardPaymentAvailable = true;
        } else if (this.businessUser.paymentGateway === 'hdfc') {
          this.payment.paymentMode = 'UPI';
          this.payment.status = 'NotPaid';
          this.payment.businessServiceName = 'Accommodation';
          this.payment.firstName = this.booking.firstName;
          this.payment.lastName = this.booking.lastName;
          this.payment.name =
            this.booking.firstName + ' ' + this.booking.lastName;

          this.payment.email = this.booking.email;
          this.payment.businessEmail = this.businessUser.email;
          this.payment.currency = this.businessUser.localCurrency;
          this.payment.propertyId = this.businessUser.id;
          this.booking.taxAmount = firstPlan?.taxPercentageperroom;
          if (this.businessServiceDto.advanceAmountPercentage === 100) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (this.bookingSummaryDetails?.totalPlanPrice *
                  this.serviceChargePercentage) /
                100;
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.amount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.amount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.booking.advanceAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.transactionChargeAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
            }
          } else if (this.businessServiceDto.advanceAmountPercentage === 50) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
            }
          } else {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
            }
          }

          if (this.specialDiscountData) {
            const firstPlanOne =
              this.bookingSummaryDetails.selectedPlansSummary[0];
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlanOne.discountedPrice * this.serviceChargePercentage) /
                100;
              this.booking.netAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                const serviceChargeAmount =
                  ((this.bookingSummaryDetails?.totalPlanPrice -
                    (this.bookingSummaryDetails?.totalPlanPrice *
                      this.specialDiscountData?.discountPercentage) /
                      100) *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.booking.advanceAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              } else {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 20).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              }
            } else {
              this.booking.netAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.booking.advanceAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 50).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
              } else {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
              }
            }
          }











          this.payment.referenceNumber = new Date().getTime().toString();
          this.payment.deliveryChargeAmount = 0;
          this.payment.date = this.datePipe.transform(
            new Date().getTime(),
            'yyyy-MM-dd',
          );
          Logger.log('this.payment ' + JSON.stringify(this.payment));
          // this.token.saveBookingData(this.booking);
          // this.token.savePaymentData(this.payment);

          // this.createBookingAtom();
          this.processPaymentHDFC(this.payment);

          this.cardPaymentAvailable = true;
        } else if (this.businessUser.paymentGateway === 'phonepe') {
          this.payment.paymentMode = 'UPI';
          this.payment.status = 'NotPaid';
          this.payment.businessServiceName = 'Accommodation';
          this.payment.firstName = this.booking.firstName;
          this.payment.lastName = this.booking.lastName;
          this.payment.name =
            this.booking.firstName + ' ' + this.booking.lastName;

          this.payment.email = this.booking.email;
          this.payment.businessEmail = this.businessUser.email;
          this.payment.currency = this.businessUser.localCurrency;
          this.payment.propertyId = this.businessUser.id;
          this.booking.taxAmount = firstPlan?.taxPercentageperroom;
          // this.payment.taxAmount = Number((Number(((this.booking.taxAmount / 100) * 20).toFixed(2)) + Number(((this.totalTaxAmount / 100) * 20).toFixed(2))).toFixed(2));
          // this.payment.netReceivableAmount = Number((Number(((this.booking.netAmount / 100)* 20).toFixed(2)) + Number(((this.totalBeforeTaxAmount  / 100) * 20).toFixed(2))).toFixed(2));
          // this.payment.transactionAmount = Number((Number(((this.booking.totalAmount / 100) * 20).toFixed(2))));
          // this.payment.amount = Number((Number(((this.booking.totalAmount / 100) * 20).toFixed(2))));
          // this.booking.advanceAmount = Number((Number(((this.booking.totalAmount / 100) * 20).toFixed(2)) + Number(((this.totalExtraAmount / 100) * 20).toFixed(2))).toFixed(2));
          // this.payment.transactionChargeAmount = Number((Number(((this.booking.totalAmount / 100) * 20).toFixed(2)) + Number(((this.totalExtraAmount /100) * 20).toFixed(2))).toFixed(2));
          if (this.businessServiceDto.advanceAmountPercentage === 100) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (this.bookingSummaryDetails?.totalPlanPrice *
                  this.serviceChargePercentage) /
                100;
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.amount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.amount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.booking.advanceAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.transactionChargeAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
            }
          } else if (this.businessServiceDto.advanceAmountPercentage === 50) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
            }
          } else {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
            }
          }

          if (this.specialDiscountData) {
            const firstPlanOne =
              this.bookingSummaryDetails.selectedPlansSummary[0];
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlanOne.discountedPrice * this.serviceChargePercentage) /
                100;
              this.booking.netAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                const serviceChargeAmount =
                  ((this.bookingSummaryDetails?.totalPlanPrice -
                    (this.bookingSummaryDetails?.totalPlanPrice *
                      this.specialDiscountData?.discountPercentage) /
                      100) *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.booking.advanceAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              } else {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 20).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              }
            } else {
              this.booking.netAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.booking.advanceAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 50).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
              } else {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
              }
            }
          }
          this.payment.referenceNumber = new Date().getTime().toString();
          this.payment.deliveryChargeAmount = 0;
          this.payment.date = this.datePipe.transform(
            new Date().getTime(),
            'yyyy-MM-dd',
          );
          Logger.log('this.payment ' + JSON.stringify(this.payment));
          // this.token.saveBookingData(this.booking);
          // this.token.savePaymentData(this.payment);

          // this.createBookingAtom();
          this.payment.callbackUrl = environment.callbackUrl;
          this.processPaymentPhonepe(this.payment);

          this.cardPaymentAvailable = true;
        } else if (this.businessUser.paymentGateway === 'razorpay') {
          this.showModal = true;
          this.payment.paymentMode = 'Razorpay';
          this.payment.status = 'NotPaid';
          this.payment.businessServiceName = 'Accommodation';
          this.payment.firstName = this.booking.firstName;
          this.payment.lastName = this.booking.lastName;
          this.payment.name =
            this.booking.firstName + ' ' + this.booking.lastName;

          this.payment.email = this.booking.email;
          this.payment.businessEmail = this.businessUser.email;
          this.payment.currency = this.businessUser.localCurrency || 'INR';
          this.payment.propertyId = this.businessUser.id;
          this.payment.orderId = this.equitycreatedData.enquiryId;
          this.payment.externalSite =
            this.equitycreatedData?.externalSite || this.booking.externalSite;
          this.payment.sourceChannel = this.equitycreatedData?.source || null;
          this.booking.taxAmount = firstPlan?.taxPercentageperroom;
          if (this.businessServiceDto.advanceAmountPercentage === 100) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (this.bookingSummaryDetails?.totalPlanPrice *
                  this.serviceChargePercentage) /
                100;
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.amount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.amount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.booking.advanceAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.transactionChargeAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
            }
          } else if (this.businessServiceDto.advanceAmountPercentage === 50) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
            }
          } else {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
            }
          }

          if (this.specialDiscountData) {
            const firstPlanOne =
              this.bookingSummaryDetails.selectedPlansSummary[0];
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlanOne.discountedPrice * this.serviceChargePercentage) /
                100;
              this.booking.netAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                const serviceChargeAmount =
                  ((this.bookingSummaryDetails?.totalPlanPrice -
                    (this.bookingSummaryDetails?.totalPlanPrice *
                      this.specialDiscountData?.discountPercentage) /
                      100) *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.booking.advanceAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              } else {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 20).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              }
            } else {
              this.booking.netAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.booking.advanceAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 50).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
              } else {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
              }
            }
          }

          this.payment.referenceNumber = new Date().getTime().toString();
          this.payment.deliveryChargeAmount = 0;
          this.payment.date = this.datePipe.transform(
            new Date().getTime(),
            'yyyy-MM-dd',
          );
          Logger.log('this.payment ' + JSON.stringify(this.payment));
          // this.token.saveBookingData(this.booking);
          // this.token.savePaymentData(this.payment);

          // this.createBookingAtom();
          this.processPaymentRazorpay(this.payment);

          this.cardPaymentAvailable = true;
        } else if (this.businessUser.paymentGateway === 'PayU') {
          this.showModal = true;
          this.payment.paymentMode = 'UPI';
          this.payment.status = 'NotPaid';
          this.payment.failureCode = environment.failureCode;
          this.payment.businessServiceName = 'Accommodation';
          this.payment.firstName = this.booking.firstName;
          this.payment.lastName = this.booking.lastName;
          this.payment.name =
            this.booking.firstName + ' ' + this.booking.lastName;
          this.payment.callbackUrl = environment.callbackUrl;

          this.payment.email = this.booking.email;
          this.payment.businessEmail = this.businessUser.email;
          this.payment.currency = 'INR';
          this.payment.propertyId = this.businessUser.id;
          this.payment.orderId = this.equitycreatedData.enquiryId;
          this.booking.taxAmount = firstPlan?.taxPercentageperroom;
          if (this.businessServiceDto.advanceAmountPercentage === 100) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (this.bookingSummaryDetails?.totalPlanPrice *
                  this.serviceChargePercentage) /
                100;
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.amount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    this.bookingSummaryDetails?.totalAmount +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalTax).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.amount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.booking.advanceAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
              this.payment.transactionChargeAmount = Number(
                Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
              );
            }
          } else if (this.businessServiceDto.advanceAmountPercentage === 50) {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      50 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 50).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    50
                  ).toFixed(2),
                ),
              );
            }
          } else {
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlan?.price * this.serviceChargePercentage) / 100;
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                      20 +
                    serviceChargeAmount
                  ).toFixed(2),
                ),
              );
            } else {
              this.payment.taxAmount = Number(
                Number(
                  ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                ).toFixed(2),
              );
              this.payment.netReceivableAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ).toFixed(2),
              );
              this.payment.transactionAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.amount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );

              this.booking.advanceAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
              this.payment.transactionChargeAmount = Number(
                Number(
                  (
                    ((firstPlan?.taxPercentageperroom + firstPlan?.price) /
                      100) *
                    20
                  ).toFixed(2),
                ),
              );
            }
          }

          if (this.specialDiscountData) {
            const firstPlanOne =
              this.bookingSummaryDetails.selectedPlansSummary[0];
            if (
              this.serviceChargePercentage &&
              this.serviceChargePercentage > 0
            ) {
              const serviceChargeAmount =
                (firstPlanOne.discountedPrice * this.serviceChargePercentage) /
                100;
              this.booking.netAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                (firstPlanOne.discountedPrice + serviceChargeAmount).toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                const serviceChargeAmount =
                  ((this.bookingSummaryDetails?.totalPlanPrice -
                    (this.bookingSummaryDetails?.totalPlanPrice *
                      this.specialDiscountData?.discountPercentage) /
                      100) *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.booking.advanceAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      this.bookingSummaryDetails?.totalAmount +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 50 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              } else {
                const serviceChargeAmount =
                  (firstPlanOne.discountedPrice *
                    this.serviceChargePercentage) /
                  100;
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 20).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.amount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );

                this.booking.advanceAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(
                    (
                      (firstPlanOne?.finalPrice / 100) * 20 +
                      serviceChargeAmount
                    ).toFixed(2),
                  ),
                );
              }
            } else {
              this.booking.netAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.gstAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.discountPercentage =
                this.specialDiscountData.discountPercentage;
              this.booking.discountAmount = Number(
                firstPlanOne.discountAmount.toFixed(2),
              );
              this.booking.beforeTaxAmount = Number(
                firstPlanOne.discountedPrice.toFixed(2),
              );
              this.booking.taxAmount = Number(
                firstPlanOne.taxPercentageperroom.toFixed(2),
              );
              this.booking.couponCode = this.specialDiscountData.couponCode;
              this.booking.promotionName = this.specialDiscountData.name;

              if (this.businessServiceDto.advanceAmountPercentage === 100) {
                this.payment.taxAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalTax).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    (this.bookingSummaryDetails?.totalAmount).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.booking.advanceAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number((this.bookingSummaryDetails?.totalAmount).toFixed(2)),
                );
              } else if (
                this.businessServiceDto.advanceAmountPercentage === 50
              ) {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlanOne?.taxPercentageperroom / 100) * 50).toFixed(
                      2,
                    ),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 50).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 50).toFixed(2)),
                );
              } else {
                this.payment.taxAmount = Number(
                  Number(
                    ((firstPlan?.taxPercentageperroom / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.netReceivableAmount = Number(
                  Number(
                    ((firstPlanOne?.finalPrice / 100) * 20).toFixed(2),
                  ).toFixed(2),
                );
                this.payment.transactionAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.amount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );

                this.booking.advanceAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
                this.payment.transactionChargeAmount = Number(
                  Number(((firstPlanOne?.finalPrice / 100) * 20).toFixed(2)),
                );
              }
            }
          }

          this.payment.referenceNumber = this.equitycreatedData.enquiryId;

          this.payment.deliveryChargeAmount = 0;
          this.payment.date = this.datePipe.transform(
            new Date().getTime(),
            'yyyy-MM-dd',
          );
          Logger.log('this.payment ' + JSON.stringify(this.payment));
          // this.token.saveBookingData(this.booking);
          // this.token.savePaymentData(this.payment);

          // this.createBookingAtom();
          this.processPaymentPayU(this.payment);

          this.cardPaymentAvailable = true;
        }
      }
    }
  }
  processPaymentRazorpay(payment: Payment) {
    // Keep gateway charge in sync with unified checkout summary values.
    this.applyAuthoritativeGatewayAmounts(payment, 'razorpay');
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);

            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;

            //for post booking create

            this.paymentIntentRayzorpay(this.payment);

            // for pre booking create

            // this.addServiceToBooking(this.booking.id,this.savedServices);
          }
        } else {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  paymentIntentRayzorpay(payment: Payment) {
    this.paymentLoader = true;
    payment.paymentGateway = 'Razorpay';

    this.hotelBookingService
      .paymentIntentRayzorpay(payment)
      .subscribe((response) => {
        this.paymentLoader = false;
        if (response.status === 200) {
          this.payment = response.body;
          this.openBookingProcess(
            this.equitycreatedData.enquiryId,
            this.payment.razorpayOrderId,
          );
          this.token.saveBookingData(this.booking);
          this.token.savePaymentData(this.payment);
          this.token.savePropertyData(this.businessUser);
          const url = `${window.location.origin}/checkout-rayzorpay`;
          const paymentWindow = window.open(url, '_blank');

          const TWO_MINUTES = 3.3 * 60 * 1000;

          setTimeout(() => {
            if (paymentWindow && !paymentWindow.closed) {
              paymentWindow.close();
            }
          }, TWO_MINUTES);
          // this.router.navigate(['/checkout-rayzorpay']);
        }
      });
  }

  processPaymentPayU(payment: Payment) {
    // Keep gateway charge in sync with unified checkout summary values.
    this.applyAuthoritativeGatewayAmounts(payment, 'payu');
    payment.paymentGateway = 'PayU';
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);

            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;
            this.openBookingProcess(
              this.equitycreatedData.enquiryId,
              this.payment.referenceNumber,
            );
            this.token.saveBookingData(this.booking);
            this.token.savePaymentData(this.payment);
            this.token.savePropertyData(this.businessUser);
            //for post booking create

            this.paymentIntentPayU();

            // for pre booking create

            // this.addServiceToBooking(this.booking.id,this.savedServices);
          }
        } else {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  paymentIntentPayU() {
    const params = new HttpParams()
      .set('propertyId', this.businessUser.id)
      .set('transactionAmount', this.payment.transactionAmount)
      .set('reference', this.payment.referenceNumber)
      .set('customerName', this.payment.name)
      .set('customerMobile', this.booking.mobile)
      .set('customerEmail', this.payment.email)
      .set('source', 'THM')
      .set('callbackUrl', environment.callbackUrl)
      .set('failureCode', environment.failureCode);

    const url = `${environment.payuUrl}/api/payu/paymentIntent/THM?${params.toString()}`;

    const paymentWindow = window.open(url, '_blank');

    const TWO_MINUTES = 3.3 * 60 * 1000;

    setTimeout(() => {
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
    }, TWO_MINUTES);
  }

  processPaymentPayTM(payment: Payment) {
    //this.applyAdvancePlanToPayment(payment);
    this.applyAuthoritativeGatewayAmounts(payment, 'paytm');
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);

            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;
            //for post booking create

            this.paymentIntentPayTm(this.payment);

            // for pre booking create

            // this.addServiceToBooking(this.booking);
          }
        } else {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  processPaymentAtom(payment: Payment) {
    //this.applyAdvancePlanToPayment(payment);
    this.applyAuthoritativeGatewayAmounts(payment, 'atom');
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);

            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;

            //for post booking create

            this.paymentIntentAtom(this.payment);

            // for pre booking create

            // this.addServiceToBooking(this.booking);
          }
        } else {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  processPaymentHDFC(payment: Payment) {
    //this.applyAdvancePlanToPayment(payment);
    this.applyAuthoritativeGatewayAmounts(payment, 'hdfc');
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);

            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;

            //for post booking create

            this.paymentIntentHdfc(this.payment);

            // for pre booking create

            // this.addServiceToBooking(this.booking);
          }
        } else {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  processPaymentPhonepe(payment: Payment) {
    this.applyAuthoritativeGatewayAmounts(payment, 'phonepe');
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);

            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;

            //for post booking create

            this.paymentIntentPhonepe(this.payment);

            // for pre booking create

            this.addServiceToBooking(this.booking.id, this.savedServices);
          }
        } else {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  paymentIntentPhonepe(payment: Payment) {
    this.paymentLoader = true;

    this.hotelBookingService
      .paymentIntentPhonepe(payment)
      .subscribe((response) => {
        this.paymentLoader = false;
        if (response.status === 200) {
          this.payment = response.body;

          this.token.saveBookingData(this.booking);
          this.token.savePaymentData(this.payment);
          this.token.savePropertyData(this.businessUser);

          this.router.navigate(['/checkout-phonepe']);
        }
      });
  }
  createBookingPayTM() {
    this.booking.modeOfPayment = this.payment.paymentMode;
    this.booking.externalSite = 'WebSite';
    this.booking.businessName = this.businessUser.name;
    this.booking.businessEmail = this.businessUser.email;
    this.booking.roomBooking = true;
    this.booking.bookingAmount = this.booking.totalAmount;
    this.booking.groupBooking = false;
    this.booking.available = true;
    this.booking.payableAmount = this.booking.totalAmount;
    this.booking.currency = this.businessUser.localCurrency;
    this.booking.paymentId = this.payment.id;

    Logger.log('createBooking ', JSON.stringify(this.booking));

    this.paymentLoader = true;
    this.hotelBookingService
      .createBooking(this.booking)
      .subscribe((response) => {
        //  Logger.log('createBooking ', JSON.stringify(response.body));
        if (response.status === 200) {
          this.paymentLoader = false;
          this.booking = response.body;
          this.booking.fromDate = this.bookingData.fromDate;
          this.booking.toDate = this.bookingData.toDate;

          this.payment.referenceNumber = this.booking.propertyReservationNumber;
          this.payment.externalReference = this.booking.externalBookingID;
          this.payment.amount;
          this.paymentLoader = true;

          Logger.log('payment ' + JSON.stringify(this.payment));

          this.hotelBookingService
            .savePayment(this.payment)
            .subscribe((res) => {
              if (res.status === 200) {
                // this.openSuccessSnackBar(`Payment Details Saved`);
                this.paymentLoader = false;

                this.payment.id = undefined;
                this.payment.paymentMode = 'Cash';
                this.payment.status = 'NotPaid';
                this.booking.taxAmount =
                  (this.booking.netAmount * this.booking.taxPercentage) / 100;
                this.payment.taxAmount = (this.booking.taxAmount / 100) * 20;
                this.payment.netReceivableAmount =
                  (this.booking.netAmount / 100) * 20;
                this.payment.transactionAmount =
                  (this.booking.totalAmount / 100) * 20;
                this.payment.amount = (this.booking.totalAmount / 100) * 20;
                this.booking.advanceAmount =
                  (this.booking.totalAmount / 100) * 20;
                this.payment.propertyId = this.bookingData.propertyId;
                this.payment.transactionChargeAmount =
                  (this.booking.totalAmount / 100) * 20;
                this.hotelBookingService
                  .processPayment(this.payment)
                  .subscribe((response2) => {
                    this.payment = response2.body;
                    this.booking.paymentId = response2.body.id;
                    this.booking.modeOfPayment = this.payment.paymentMode;
                    if (this.booking.id != null) {
                      this.submitButtonDisable = true;
                      this.isSuccess = true;
                      this.headerTitle = 'Success!';
                      this.bodyMessage =
                        'Thanks for the booking .Please note the Reservation No: # ' +
                        this.booking.propertyReservationNumber +
                        ' and an email is sent with the booking details.';

                      this.token.clearHotelBooking();
                      // this.showSuccess(this.contentDialog);

                      this.paymentLoader = true;

                      Logger.log('payment ' + JSON.stringify(this.payment));
                      this.paymentIntentPayTm(this.payment);
                    } else {
                      this.paymentLoader = false;
                    }
                  });

                // setTimeout(() => {
                //   this.isSuccess = true;
                //   this.headerTitle = "Success!";
                //   this.bodyMessage = "Payment Details Saved.";
                //   this.showSuccess(this.contentDialog);
                //   this.changeDetectorRefs.detectChanges();
                // }, 5000);
              } else {
                this.paymentLoader = false;
                // this.openErrorSnackBar(`Error in updating payment details`);
                // setTimeout(() => {
                //   // this.paymentLoader = false;
                //   this.isSuccess = false;
                //   this.headerTitle = "Error!";
                //   this.bodyMessage = "Error in updating payment details.";
                //   this.showDanger(this.contentDialog);
                //   this.changeDetectorRefs.detectChanges();
                // }, 9000);
              }
            });
        } else {
          this.paymentLoader = false;
        }
      });
    /*setTimeout(() => {
        this.msgs = [];
        createBookingObsr.unsubscribe();
        this.spinner = false;
        this.msgs.push({
          severity: 'error',
          summary: 'The server is taking more than usual time,please try again after sometime.'
        });
      }, 25000); */
  }
  paymentIntentPayTm(payment: Payment) {
    this.paymentLoader = true;

    this.hotelBookingService.paymentIntent(payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;
        this.token.saveBookingData(this.booking);
        this.token.savePaymentData(this.payment);
        this.token.savePropertyData(this.businessUser);

        this.router.navigate(['/checkout']);
      }
    });
  }
  createBookingAtom() {
    this.booking.modeOfPayment = this.payment.paymentMode;
    this.booking.externalSite = 'WebSite';
    this.booking.businessName = this.businessUser.name;
    this.booking.businessEmail = this.businessUser.email;
    this.booking.roomBooking = true;
    this.booking.bookingAmount = this.booking.totalAmount;
    this.booking.groupBooking = false;
    this.booking.available = true;
    this.booking.payableAmount = this.booking.totalAmount;
    this.booking.currency = this.businessUser.localCurrency;
    this.booking.paymentId = this.payment.id;

    Logger.log('createBooking ', JSON.stringify(this.booking));

    this.paymentLoader = true;
    this.hotelBookingService
      .createBooking(this.booking)
      .subscribe((response) => {
        //  Logger.log('createBooking ', JSON.stringify(response.body));
        if (response.status === 200) {
          this.paymentLoader = false;
          this.booking = response.body;
          this.booking.fromDate = this.bookingData.fromDate;
          this.booking.toDate = this.bookingData.toDate;

          this.payment.referenceNumber = this.booking.propertyReservationNumber;
          this.payment.externalReference = this.booking.externalBookingID;
          this.payment.amount;
          this.paymentLoader = true;

          Logger.log('payment ' + JSON.stringify(this.payment));

          this.hotelBookingService
            .savePayment(this.payment)
            .subscribe((res) => {
              if (res.status === 200) {
                // this.openSuccessSnackBar(`Payment Details Saved`);
                this.paymentLoader = false;

                this.payment = res.body;
                this.booking.paymentId = res.body.id;
                this.booking.modeOfPayment = this.payment.paymentMode;
                if (this.booking.id !== null) {
                  this.submitButtonDisable = true;
                  this.isSuccess = true;
                  this.headerTitle = 'Success!';
                  this.bodyMessage =
                    'Thanks for the booking .Please note the Reservation No: # ' +
                    this.booking.propertyReservationNumber +
                    ' and an email is sent with the booking details.';

                  this.token.clearHotelBooking();
                  // this.showSuccess(this.contentDialog);

                  this.paymentLoader = true;

                  Logger.log('payment ' + JSON.stringify(this.payment));
                  this.paymentIntentAtom(this.payment);
                } else {
                  this.paymentLoader = false;
                }

                // setTimeout(() => {
                //   this.isSuccess = true;
                //   this.headerTitle = 'Success!';
                //   this.bodyMessage = 'Payment Details Saved.';
                //   this.showSuccess(this.contentDialog);
                //   this.changeDetectorRefs.detectChanges();
                // }, 5000);
              } else {
                this.paymentLoader = false;
                // this.openErrorSnackBar(`Error in updating payment details`);
                // setTimeout(() => {
                //   // this.paymentLoader = false;
                //   this.isSuccess = false;
                //   this.headerTitle = 'Error!';
                //   this.bodyMessage = 'Error in updating payment details.';
                //   this.showDanger(this.contentDialog);
                //   this.changeDetectorRefs.detectChanges();
                // }, 9000);
              }
            });
        } else {
          this.paymentLoader = false;
        }
      });
    /*setTimeout(() => {
        this.msgs = [];
        createBookingObsr.unsubscribe();
        this.spinner = false;
        this.msgs.push({
          severity: 'error',
          summary: 'The server is taking more than usual time,please try again after sometime.'
        });
      }, 25000); */
  }
  paymentIntentAtom(payment: Payment) {
    this.paymentLoader = true;

    this.hotelBookingService.paymentIntent(payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;

        this.token.saveBookingData(this.booking);
        this.token.savePaymentData(this.payment);
        this.token.savePropertyData(this.businessUser);

        this.router.navigate(['/checkout-atom']);
      }
    });
  }
  paymentIntentHdfc(payment: Payment) {
    this.paymentLoader = true;

    this.hotelBookingService.paymentIntent(payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;

        this.token.saveBookingData(this.booking);
        this.token.savePaymentData(this.payment);
        this.token.savePropertyData(this.businessUser);

        this.router.navigate(['/checkout-hdfc']);
      }
    });
  }

  taxAmountBackUp: number;
  onCashPaymentSubmit() {
    if (this.isCashPayDisabled) return; // prevent multiple clicks
    this.isCashPayDisabled = true;
    // localStorage.removeItem('selectedPromoData');
    // localStorage.removeItem('selectPromo');
    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;

    this.loadingOne = true;
    this.payment.paymentMode = 'Cash';
    this.payment.status = 'NotPaid';
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.netAmount = this.booking.netAmount;
    this.taxAmountBooking =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    if (
      this.totalServiceCost != null &&
      this.totalServiceCost != undefined &&
      this.totalServiceCost > 0
    ) {
      this.payment.transactionAmount = bookingSummary.totalAmount;
    } else {
      this.payment.transactionAmount = bookingSummary.totalAmount;
    }

    this.payment.amount = bookingSummary.totalAmount;
    this.payment.propertyId = this.bookingData.propertyId;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.transactionChargeAmount = bookingSummary.totalAmount;
    this.payment.currency = this.businessUser.localCurrency;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.payment.taxAmount = bookingSummary.totalTax;
    this.booking.totalRoomTariffBeforeDiscount = bookingSummary.totalPlanPrice;
    this.booking.taxDetails = this.token
      .getProperty()
      .taxDetails.filter(
        (item) =>
          item.name === 'CGST' || item.name === 'SGST' || item.name === 'GST',
      );
    this.booking.taxDetails.forEach((item) => {
      if (item.name === 'CGST') {
        this.percentage1 = item.percentage;
      }

      if (item.name === 'SGST') {
        this.percentage2 = item.percentage;
      }
    });
    this.totalPercentage = this.percentage1 + this.percentage2;

    this.booking.taxAmount = bookingSummary.totalTax;
    this.processPayment(this.payment);
  }

  chargeCreditCard(payment: Payment) {
    this.paymentLoader = true;
    if (this.businessUser.paymentGateway === 'eway') {
      const eWAY = (window as any).eWAY;

      const comp = this;

      eWAY.saveAllFields(() => {
        comp.paymentLoader = false;

        if (
          comp.ewaySecureFieldCode === null ||
          comp.ewaySecureFieldCode === undefined ||
          comp.ewaySecureFieldCode.trim().length < 5
        ) {
          comp.paymentLoader = false;
          comp.isSuccess = false;
          comp.headerTitle = 'Error!';
          comp.bodyMessage = 'Missing card information!';
          comp.showDanger(comp.contentDialog);
          comp.changeDetectorRefs.detectChanges();
        } else if (comp.ewayErrors !== null && comp.ewayErrors !== undefined) {
          comp.paymentLoader = false;
          comp.isSuccess = false;
          comp.headerTitle = 'Error!';
          comp.bodyMessage =
            'Wrong card information!' + ' Codes: ' + comp.ewayErrors;
          comp.showDanger(comp.contentDialog);
          comp.changeDetectorRefs.detectChanges();
        } else {
          payment.token = comp.ewaySecureFieldCode;
          comp.processPayment(payment);
        }
      }, 2000);
    } else {
      ((window as any).Stripe.card.createToken(
        {
          number: payment.cardNumber,
          exp_month: payment.expMonth,
          exp_year: payment.expYear,
          cvc: payment.cvv,
        },
        (status: number, response: any) => {
          if (status === 200) {
            const token = response.id;
            payment.token = token;

            this.processPayment(payment);
            this.changeDetectorRefs.detectChanges();
          } else if (status === 402) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage = 'Wrong card information!' + ' Code: ' + status;
            this.showDanger(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage = 'Card Payment Faied!' + ' Code: ' + status;
            this.showDanger(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          }
        },
      ),
        (error) => {
          this.paymentLoader = false;
        });
    }
    // (window as any).Stripe.card.createToken(
    //   {
    //     number: payment.cardNumber,
    //     exp_month: payment.expMonth,
    //     exp_year: payment.expYear,
    //     cvc: payment.cvv,
    //   },
    //   (status: number, response: any) => {
    //     if (status === 200) {
    //       const token = response.id;
    //       payment.token = token;

    //       // Logger.log('credit card info done' + JSON.stringify(this.payment));
    //       this.createBooking(this.booking);
    //       this.changeDetectorRefs.detectChanges();
    //     } else if (status === 402) {
    //       this.paymentLoader = false;
    //       this.isSuccess = false;
    //       this.headerTitle = 'Error!';
    //       this.bodyMessage = 'Wrong card information!' + ' Code: ' + status;
    //       this.showDanger(this.contentDialog);
    //       this.changeDetectorRefs.detectChanges();
    //     } else {
    //       this.paymentLoader = false;
    //       this.isSuccess = false;
    //       this.headerTitle = 'Error!';
    //       this.bodyMessage = 'Card Payment Faied!' + ' Code: ' + status;
    //       this.showDanger(this.contentDialog);
    //       this.changeDetectorRefs.detectChanges();
    //     }
    //   }
    // ),
    //   (error) => {
    //     this.paymentLoader = false;
    //   };
  }
  // savePaymentProcess() {
  //   this.orderService.savePayment(this.payment).subscribe((res1) => {
  //     if (res1.status === 200) {
  //       this.payment = res1.body;
  //       // Logger.log('res1 save payment : ' + JSON.stringify(res1.body));
  //       // Logger.log('s : ' + JSON.stringify(this.slotReservation));

  //       this.bookingData.paymentId = this.payment.id;
  //       this.booking.modeOfPayment = this.payment.paymentMode;
  //       this.createBooking(this.booking);
  //     } else {
  //       this.paymentLoader = false;
  //     }
  //   });
  // }

  addServiceToBooking(bookingId, savedServices: any[]) {
    if (this.isBackendFinalizedGateway()) {
      return;
    }

    this.savedServices?.forEach((element) => {
      element.count = element.quantity;
      element.afterTaxAmount = element.quantity * element.servicePrice;
      element.date = new Date();
    });
    this.hotelBookingService
      .saveBookingService(bookingId, savedServices)
      .subscribe(
        (data) => {
          this.changeDetectorRefs.detectChanges();
          // Logger.log(JSON.stringify( this.businessServices));
        },
        (error) => {},
      );
  }

  processPayment(payment: Payment) {
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage =
              'Unable to process payment' +
              ' Code: ' +
              response.body.failureMessage;
            this.showDanger(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.payment = response.body;
            this.booking.paymentId = response.body.id;
            this.booking.modeOfPayment = this.payment.paymentMode;

            this.hotelBookingService.savePayment(this.payment).subscribe(
              (res1) => {
                if (res1.status === 200) {
                  this.paymentLoader = false;
                  this.changeDetectorRefs.detectChanges();

                  this.createAllBookings();
                } else {
                  this.paymentLoader = false;
                  this.isSuccess = false;
                  this.headerTitle = 'Error!';
                  this.bodyMessage =
                    'Unable to save payment' + ' Code: ' + status;
                  this.showDanger(this.contentDialog);

                  this.paymentLoader = false;
                  this.changeDetectorRefs.detectChanges();
                }
              },
              (error) => {
                this.paymentLoader = false;
                this.isSuccess = false;
                this.headerTitle = 'Error!';
                this.bodyMessage =
                  'Saving Payment Failed! Code: ' + error.status;
                this.showDanger(this.contentDialog);
                this.changeDetectorRefs.detectChanges();
              },
            );
          }
        } else {
          this.paymentLoader = false;
          this.loadingOne = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Payment Failed! Code: ' + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.loadingOne = false;
        this.isSuccess = false;
        this.headerTitle = 'Error!';
        this.bodyMessage = 'Payment Failed! Code: ' + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      },
    );
  }
  cashOnDelivery() {
    this.cashPayment = true;
  }
  cardPayment() {
    this.cashPayment = false;
    if (this.businessUser.paymentGateway === 'stripe') {
      this.loadStripe();

      this.payment.paymentMode = 'Card';
      this.payment.status = 'Paid';
      this.payment.firstName = this.booking.firstName;
      this.payment.lastName = this.booking.lastName;
      this.payment.netReceivableAmount = this.booking.netAmount;
      this.payment.transactionAmount = this.booking.totalAmount;
      this.payment.amount = this.booking.totalAmount;
      this.payment.propertyId = this.bookingData.propertyId;
      this.payment.transactionChargeAmount = this.booking.totalAmount;
      this.payment.email = this.booking.email;
      this.payment.businessEmail = this.businessUser.email;
      this.payment.currency = this.businessUser.localCurrency;

      this.booking.taxAmount =
        (this.booking.netAmount * this.booking.taxPercentage) / 100;
      this.payment.taxAmount = this.booking.taxAmount;
      this.payment.deliveryChargeAmount = 0;
      this.payment.date = this.datePipe.transform(
        new Date().getTime(),
        'yyyy-MM-dd',
      );
      this.booking.outstandingAmount = 0;
      this.paymentIntent(this.payment);
      this.cardPaymentAvailable = true;
    }
  }
  bankPayment() {
    this.cashPayment = false;
  }
  MobileWallet() {
    this.cashPayment = false;
  }

  redirectToBooking() {
    this.locationBack.back();
  }

  sendConfirmationMessage() {
    this.paymentLoader = true;
    let msg = new Msg();
    msg.fromNumber = SMS_NUMBER;
    msg.toNumber = this.booking.mobile;
    msg.message = `Dear ${this.booking.firstName},Rsvn#:${this.booking.id},${this.booking.roomName},Chk-In:${this.booking.fromDate},Chk-Out:${this.booking.toDate},Amt:${this.booking.payableAmount}NZD.Thx.${this.booking.businessName},${this.booking.mobile}`;
    this.hotelBookingService.sendTextMessage(msg).subscribe(
      (response1) => {
        msg = response1.body;
        if (msg.sid !== undefined || msg.sid !== null) {
          this.paymentLoader = false;
          // this.submitButtonDisable = true;
          this.isSuccess = true;
          this.headerTitle = 'Success!';
          this.bodyMessage = 'Booking Confirmation Sent.';
          this.showSuccess(this.contentDialog);
          setTimeout(() => {
            this.showAlert = false;
            this.changeDetectorRefs.detectChanges();
          }, 10000);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.paymentLoader = false;
          this.isSuccess = false;
          this.headerTitle = 'Error!';
          this.bodyMessage = 'Error in sending sms.';
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
    );
  }
  // createAllBookings() {
  //   this.createAllPayLaterEnquiries();
  //   const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
  //   const bookingSummary = bookingSummaryStr
  //     ? JSON.parse(bookingSummaryStr)
  //     : null;

  //   if (!bookingSummary || !bookingSummary.selectedPlansSummary?.length) {
  //     console.error('No valid booking summary found.');
  //     return;
  //   }

  //   const plans = bookingSummary.selectedPlansSummary;

  //   const processPlan = (index: number) => {
  //     if (index >= plans.length) return;
  //     const currentPlan = plans[index];

  //     this.createBooking(currentPlan, bookingSummary, () => {
  //       setTimeout(() => {
  //         processPlan(index + 1);
  //       }, 1000);
  //     });
  //   };

  //   processPlan(0);
  // }

  createAllBookings() {
    if (this.isBackendFinalizedGateway() && this.continueBackendBookingFinalization()) {
      return;
    }

    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;

    if (!bookingSummary || !bookingSummary.selectedPlansSummary?.length) {
      console.error('No valid booking summary found.');
      return;
    }

    const plans = bookingSummary.selectedPlansSummary;

    const processPlan = (index: number) => {
      if (index >= plans.length) {
        const existingBookingsStr = sessionStorage.getItem(
          'bookingsResponseList',
        );
        const existingBookings = existingBookingsStr
          ? JSON.parse(existingBookingsStr)
          : [];

        // if (existingBookings.length > 0) {
        //   const lastBooking = existingBookings[existingBookings.length - 1];
        //   this.hotelBookingService
        //     .sendBookingEmailToCustomer(lastBooking.id)
        //     .subscribe({
        //       next: (emailResponse) => {
        //         console.log('Booking email sent successfully:', emailResponse);
        //       },
        //       error: (err) => {
        //         console.error('Failed to send booking email:', err);
        //       },
        //     });
        // }
        this.createAllPayLaterEnquiries();
        return;
      }

      const currentPlan = plans[index];

      this.createBooking(currentPlan, bookingSummary, () => {
        setTimeout(() => {
          processPlan(index + 1);
        }, 1000);
      });
    };

    processPlan(0);
  }

  createBooking(plan: any, bookingSummary: any, callback?: () => void) {
    if (this.isBackendFinalizedGateway()) {
      if (callback) callback();
      return;
    }

    const booking: any = {};
    this.businessUser = this.token.getProperty();
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    booking.roomRatePlanName = plan.planCodeName;
    booking.roomName = plan.roomName;
    booking.roomType = plan.roomName;
    booking.planCode = plan.planName;
    booking.roomId = plan.roomId;
    booking.noOfPersons = plan.adults;
    booking.firstName = this.booking.firstName;
    booking.lastName = this.booking.lastName;
    booking.mobile = this.booking.mobile;
    booking.email = this.booking.email;
    booking.noOfChildren = plan.childrenAbove5years;
    // if(this.groupBookingId){
    //   booking.groupBookingId = this.groupBookingId;
    // }
    booking.groupBookingId = null;
    booking.noOfChildrenUnder5years = plan.childrenBelow5years;
    booking.noOfNights = plan.nights;
    booking.noOfRooms = Number(plan.selectedRoomnumber);
    booking.netAmount = plan.price.toFixed(2);
    booking.beforeTaxAmount = plan.price.toFixed(2);
    booking.createdDate = new Date().toISOString();
    booking.propertyId = this.booking.propertyId;
    booking.gstAmount = plan.taxPercentageperroom;
    booking.dayTrip = false;
    booking.discountPercentage = 0;
    booking.discountAmount = 0;
    booking.extraChildCharge = plan.extraPersonChildCountAmount || 0;
    booking.extraPersonCharge = plan.extraPersonAdultCountAmount || 0;
    booking.roomTariffBeforeDiscount = plan.actualRoomPrice.toFixed(2);
    booking.totalAmount = (plan.price + plan.taxPercentageperroom).toFixed(2);
    booking.bookingAmount = (plan.price + plan.taxPercentageperroom).toFixed(2);
    booking.payableAmount = this.showTheSelectedCoupon
      ? (plan.price + plan.taxPercentageperroom).toFixed(2)
      : (plan.price + plan.taxPercentageperroom).toFixed(2);
    booking.fromDate = bookingSummary.fromDate;
    booking.toDate = bookingSummary.toDate;
    booking.currency = this.businessUser.localCurrency;
    booking.fromTime = this.tokenFromTime;
    booking.toTime = this.tokenToTime;
    booking.modeOfPayment = this.payment.paymentMode;
    booking.externalSite = 'WebSite';
    booking.businessName = this.businessUser.name;
    booking.businessEmail = this.businessUser.email;
    booking.roomBooking = true;
    booking.groupBooking = false;
    booking.available = true;
    booking.roomPrice = plan.actualRoomPrice.toFixed(2);
    booking.totalServiceAmount = this.totalServiceCost || 0;
    booking.taxAmount = booking.gstAmount.toFixed(2);
    booking.totalRoomTariffBeforeDiscount = (
      plan.actualRoomPrice *
      plan.nights *
      plan.selectedRoomnumber
    ).toFixed(2);
    booking.noOfExtraPerson = plan.extraCountAdult;
    booking.noOfExtraChild = plan.extraCountChild;
    booking.purposeOfVisit = '';
    booking.advanceAmount = 0;
    booking.paymentId = this.booking.paymentId;
    booking.includeService = this.booking.includeService;
    booking.taxDetails = this.token
      .getProperty()
      .taxDetails.filter(
        (item) =>
          item.name === 'CGST' || item.name === 'SGST' || item.name === 'GST',
      );

    booking.taxPercentage = plan.taxpercentage;
    if (this.specialDiscountData) {
      const finalPrice = plan.discountedPrice;

      booking.netAmount = Number(finalPrice.toFixed(2));
      booking.gstAmount = Number(plan.taxPercentageperroom.toFixed(2));
      booking.discountPercentage = this.specialDiscountData.discountPercentage;
      booking.discountAmount = Number(plan.discountAmount.toFixed(2));
      booking.beforeTaxAmount = Number(plan.price.toFixed(2));
      booking.taxAmount = Number(plan.taxPercentageperroom.toFixed(2));
      booking.couponCode = this.specialDiscountData.couponCode;
      booking.promotionName = this.specialDiscountData.name;
      booking.payableAmount = Number(plan.finalPrice.toFixed(2));
      booking.totalAmount = Number(plan.finalPrice.toFixed(2));
    } else {
      booking.discountPercentage = 0;
    }
    //this.applyAdvancePlanToBooking(booking);

    Logger.log('createBooking ', JSON.stringify(booking));

    this.paymentLoader = true;

    this.hotelBookingService.createBooking(booking).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        const savedBooking = response.body;
        if (savedBooking) {
          const existingBookingsStr = sessionStorage.getItem(
            'bookingsResponseList',
          );
          const existingBookings = existingBookingsStr
            ? JSON.parse(existingBookingsStr)
            : [];
          existingBookings.push(savedBooking);
          sessionStorage.setItem(
            'bookingsResponseList',
            JSON.stringify(existingBookings),
          );
          this.token.saveBookingDataObj(savedBooking);
          this.bookingId = savedBooking.id;
          this.referenceNumberAfterBooking =
            savedBooking.propertyReservationNumber;

          this.addServiceToBooking(
            savedBooking.id,
            this.bookingSummaryDetails?.propertyServiceListDataOne,
          );
          this.getSubscriptions(savedBooking, plan);
          // this.sendWhatsappMessageToTHM(savedBooking);
          // this.sendWhatsappMessageToTHM1(savedBooking);
          // this.sendWhatsappMessageToTHM2(savedBooking);
          // this.sendWhatsappMessageToTHM3(savedBooking);
          //  this.sendWhatsappMessageToTHM7(savedBooking)
          // // this.sendWhatsappMessageToTHM4(savedBooking);
          //  setTimeout(() => {
          //       this.accommodationEnquiryBookingData();
          //     }, 3000);
          // this.createAllPayLaterEnquiries();
          this.router.navigate(['/reservation-confirm-page']);

          this.loadingOne = false;

          // Save payment
          this.payment.referenceNumber = savedBooking.propertyReservationNumber;
          this.payment.externalReference = savedBooking.externalBookingID;
          this.payment.amount = booking.totalAmount;

          Logger.log('payment ' + JSON.stringify(this.payment));
        }

        if (callback) callback();
      } else {
        this.loadingOne = false;
        if (callback) callback(); // Proceed even if failed
      }
    });
  }
  async createAllPayLaterEnquiries() {
    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;

    if (!bookingSummary || !bookingSummary.selectedPlansSummary?.length) {
      console.error('No valid booking summary found.');
      return;
    }

    const bookingList = bookingSummary.selectedPlansSummary;

    for (let i = 0; i < bookingList.length; i++) {
      const _booking = bookingList[i];
      await this.submitFormPaylaterCRM(_booking, bookingList);
    }
  }

  async submitFormPaylaterCRM(plan: any, bookingSummary: any) {
    const booking: any = this.booking;
    const bookingsStr = sessionStorage.getItem('bookingsResponseList');
    const bookings = bookingsStr ? JSON.parse(bookingsStr) : [];

    // Match booking based on roomId (or another unique property)
    const matchedBooking = bookings.find((b: any) => b.roomId === plan.roomId);
    if (this.specialDiscountData) {
      booking.netAmount = Number(plan.discountedPrice.toFixed(2));
      booking.gstAmount = Number(plan.taxPercentageperroom.toFixed(2));
      booking.discountPercentage = this.specialDiscountData.discountPercentage;
      booking.discountAmount = Number(plan.discountAmount.toFixed(2));
      booking.beforeTaxAmount = Number(plan.discountedPrice.toFixed(2));
      booking.taxAmount = Number(plan.taxPercentageperroom.toFixed(2));
      booking.couponCode = this.specialDiscountData.couponCode;
      booking.promotionName = this.specialDiscountData.name;
    } else {
      booking.discountPercentage = 0;
    }

    const enquiryForm = new EnquiryDto();

    if (this.token.getProperty()?.address?.city) {
      enquiryForm.address = this.token.getProperty().address;
      enquiryForm.country = this.token.getProperty().address.country;
      enquiryForm.location = this.token.getProperty().address.city;
      enquiryForm.alternativeLocation = this.token.getProperty().address.city;
    }

    this.payment.netReceivableAmount = plan.price + plan.taxPercentageperroom;
    enquiryForm.min = Number(this.payment.netReceivableAmount.toFixed(2));
    enquiryForm.max = Number(this.payment.netReceivableAmount.toFixed(2));
    enquiryForm.enquiryType = 'Pay Later';
    enquiryForm.firstName = booking.firstName;
    enquiryForm.lastName = booking.lastName;
    enquiryForm.email = booking.email;
    enquiryForm.phone = this.buildFullPhoneNumber(booking.mobile);
    enquiryForm.checkOutDate = booking.toDate;
    enquiryForm.checkInDate = booking.fromDate;
    enquiryForm.noOfPerson = plan.adults;
    enquiryForm.noOfExtraPerson = plan.extraCountAdult;
    enquiryForm.roomId = plan.roomId;
    enquiryForm.payableAmount = plan.price + plan.taxPercentageperroom;
    enquiryForm.roomName = plan.roomName;
    enquiryForm.extraPersonCharge = plan.extraPersonAdultCountAmount;
    enquiryForm.extraChildCharge = plan.extraPersonChildCountAmount;
    enquiryForm.noOfExtraChild = plan.extraCountChild;
    const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
    this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
    const utmSessionValue = sessionStorage.getItem('utm_source');
    if (utmSessionValue && !this.websiteUrlBookingEngine) {
      enquiryForm.utmSource = sessionStorage.getItem('utm_source');
      enquiryForm.utmMedium = sessionStorage.getItem('utm_medium');
    } else if (this.websiteUrlBookingEngine && utmSessionValue) {
      enquiryForm.utmSource = sessionStorage.getItem('utm_source');
      enquiryForm.utmMedium = sessionStorage.getItem('utm_medium');
    } else if (this.websiteUrlBookingEngine && !utmSessionValue) {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'bookingEngine';
    } else if (this.activeGoogleCenter && !utmSessionValue) {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'ghc';
    } else {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'unknown';
    }

    // roomPrice must be per-room-per-night tariff so LMS can multiply: roomPrice × noOfRooms × noOfNights.
    enquiryForm.roomPrice = plan.actualRoomPrice;

    enquiryForm.externalSite = 'WebSite';
    enquiryForm.source = 'Bookone Connect';
    enquiryForm.couponCode = booking.couponCode;
    enquiryForm.promotionName = booking.promotionName;
    enquiryForm.discountAmount = booking.discountAmount;
    enquiryForm.beforeTaxAmount = plan.price;

    enquiryForm.mobile =
      this.token.getProperty().whatsApp || this.token.getProperty().mobile;

    enquiryForm.roomType = plan.roomName;
    enquiryForm.roomRatePlanName = plan.planCodeName;
    enquiryForm.createdDate = new Date().getTime();
    this.businessUser = this.token.getProperty();
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    enquiryForm.fromTime = this.tokenFromTime;
    enquiryForm.toTime = this.tokenToTime;
    this.token.saveTime(String(enquiryForm.fromTime));
    this.token.saveToTime(String(enquiryForm.toTime));
    if (this.groupBookingId) {
      enquiryForm.groupEnquiryId = this.groupBookingId;
    }
    enquiryForm.accountManager = '';
    enquiryForm.consultantPerson = '';
    enquiryForm.noOfRooms = Number(plan.selectedRoomnumber);
    enquiryForm.noOfChildren = plan.children;
    enquiryForm.accommodationType = this.token.getProperty().businessType;
    enquiryForm.status = 'Booked';
    enquiryForm.specialNotes = booking.notes || '';
    enquiryForm.propertyId = 107;
    enquiryForm.bookingPropertyId = this.token.getProperty().id;
    enquiryForm.propertyName = this.token.getProperty().name;
    enquiryForm.bookingReservationId =
      matchedBooking?.propertyReservationNumber || '';
    enquiryForm.bookingId = matchedBooking?.id || '';
    enquiryForm.taxDetails = this.token
      .getProperty()
      .taxDetails.filter((item) => ['CGST', 'SGST', 'GST'].includes(item.name));
    enquiryForm.taxAmount = plan.taxPercentageperroom;

    const TO_EMAIL = 'reservation@thehotelmate.co';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'samaya.muduli@credencesoft.co.nz';
    const bccEmail2 = 'info@bookonepms.com';

    enquiryForm.fromName = `${enquiryForm.firstName} ${enquiryForm.lastName}`;
    enquiryForm.toName = TO_NAME;
    enquiryForm.fromEmail = enquiryForm.email;
    enquiryForm.toEmail = TO_EMAIL;
    enquiryForm.bccEmail = bccEmail;
    enquiryForm.bccName = bccEmail;
    enquiryForm.bccEmailTo = bccEmail2;

    enquiryForm.dietaryRequirement = enquiryForm.dietaryRequirement || '';
    enquiryForm.accommodationType = enquiryForm.accommodationType || '';
    enquiryForm.specialNotes = enquiryForm.specialNotes || '';
    enquiryForm.alternativeLocation = enquiryForm.alternativeLocation || '';

    enquiryForm.totalAmount = plan.price + plan.taxPercentageperroom;
    enquiryForm.discountAmountPercentage = booking.discountPercentage;
    enquiryForm.noOfNights = plan.nights;
    enquiryForm.foodOptions = '';
    enquiryForm.organisationId = environment.parentOrganisationId;
    enquiryForm.bookingCommissionAmount = 0;
    enquiryForm.taxPercentage = plan.taxpercentage;
    if (this.specialDiscountData) {
      enquiryForm.payableAmount = Number(plan.finalPrice.toFixed(2));
      enquiryForm.beforeTaxAmount = Number(plan.discountedPrice.toFixed(2));
      enquiryForm.taxPercentage = plan.taxpercentage;
      enquiryForm.totalAmount = Number(plan.finalPrice.toFixed(2));
    }
    // this.applyAdvancePlanToEnquiryForm(
    //   enquiryForm,
    //   enquiryForm.totalAmount || enquiryForm.payableAmount,
    // );

    this.paymentLoader = true;
    try {
      const response: HttpResponse<EnquiryDto> = await this.hotelBookingService
        .accommodationEnquiry(enquiryForm)
        .toPromise();
      if (response) {
        return true;
      }
    } catch (e) {
      console.error('Submit failed', e);
    }

    return false;
  }
  createBookingReservation() {
    this.externalReservationdto?.forEach((ele) => {
      this.saveResponseBooking.message = ele.otaReservationId;
    });

    this.hotelBookingService
      .createBooking(this.saveResponseBooking)
      .subscribe((response) => {});
  }

  getAmenityIcon(name: string): string {
    const iconMap: { [key: string]: string } = {
      'Air-Condition': 'fa-fan',
      Wifi: 'fa-wifi',
      'Free Parking': 'fa-square-parking',
      'Family Room': 'fa-people-roof',
      Restaurant: 'fa-utensils',
      'Restaurant Available': 'fa-utensils',
      'Room Service': 'fa-bell-concierge',
      '24 Hours Room Service': 'fa-bell-concierge',
      'Pet Friendly': 'fa-dog',
      'Non Smoking Room': 'fa-ban-smoking',
      'Smoking Zone': 'fa-smoking',
      'Hand Sanitizer': 'fa-pump-soap',
      Bathtub: 'fa-bath',
      'Flat TV': 'fa-tv',
      Spa: 'fa-spa',
      'Airport Shuttle': 'fa-shuttle-van',
      'Swimming Pool': 'fa-person-swimming',
      Breakfast: 'fa-mug-hot',
      Bar: 'fa-champagne-glasses',
      Fitness: 'fa-dumbbell',
      Geyser: 'fa-fire',
    };

    return iconMap[name.trim()] || 'fa-circle-question'; // fallback icon
  }
  sendWhatsappMessageToTHM(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = '7326079861'));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = 'reservation@thehotelmate.co'));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = booking.mobile),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHMCopy(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    this.propertyMobileNumber = this.token.getProperty().mobile;
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyMobileNumber));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.businessEmail));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '6372198255'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }
  sendWhatsappMessageToTHM1(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = '7326079861'));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = 'reservation@thehotelmate.co'));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '9004146024'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM1Copy(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    this.propertyMobileNumber = this.token.getProperty().mobile;
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyMobileNumber));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.businessEmail));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '7326079861'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM2(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = '7326079861'));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = 'reservation@thehotelmate.co'));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '9583637921'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM2Copy(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    this.propertyMobileNumber = this.token.getProperty().mobile;
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyMobileNumber));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.businessEmail));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '9583637921'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM3(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = '7326079861'));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = 'reservation@thehotelmate.co'));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '7326079861'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM3Copy(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    this.propertyMobileNumber = this.token.getProperty().mobile;
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyMobileNumber));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.businessEmail));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '9004146024'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM4Copy(booking) {
    this.propertyDataObj = this.token.getBookingDataObj();
    this.propertyMobileNumber = this.token.getProperty().mobile;
    let propertyReservationNumber =
      this.propertyDataObj.propertyReservationNumber;
    let updatedCode = propertyReservationNumber?.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = ' ';
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.propertyDataObj.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.propertyDataObj.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.specialDiscountData?.couponCode
        ? this.specialDiscountData?.couponCode
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyMobileNumber));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.propertyDataObj.businessEmail));
    this.parameterss2.push(this.parametertype2);

    this.componentstype.parameters = this.parameterss3;
    this.components.push(this.componentstype);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' +
        this.propertyDataObj.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = booking.mobile),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }
  sendWhatsappMessageToTHM7(booking) {
    let propertyReservationNumber = booking.propertyReservationNumber;
    let updatedCode = propertyReservationNumber.replace('-B-', '-BE-');
    this.parameterss2 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = updatedCode));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(booking.toTime).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(booking.noOfRooms);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = booking.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(booking.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(booking.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.promotionName
        ? booking.promotionName
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' + booking.propertyReservationNumber));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = this.booking.mobile),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  sendWhatsappMessageToTHM4() {
    this.whatsappForm = new WhatsappDto();
    this.template = new Template();
    this.language = new Language();
    this.componentstype = new Components();
    this.parametertype = new Para();
    this.images = new Images();
    this.componentstype2 = new Components();
    this.componentstype9 = new Components();
    this.parametertype2 = new Para();
    this.parametertype20 = new Para();
    this.parametertype3 = new Para();
    this.componentstype9 = new Components();
    this.componentstype10 = new Components();
    this.parameterss2 = [];
    this.parameterss3 = [];
    this.parameterss15 = [];
    this.components = [];
    this.parameterss = [];
    this.parameterss1 = [];

    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    ((this.language.code = 'en'), (this.template.language = this.language));
    ((this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para()));
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.booking.firstName));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = String(this.referenceNumberAfterBooking)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(this.booking.fromDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        this.booking.fromTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(this.booking.toDate, 'dd-MM-yyyy') + ','));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.toTime) {
      this.parametertype2.text = new Date(
        this.booking.toTime,
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.booking.noOfRooms);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = this.booking.roomName;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.booking.noOfPersons);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    this.parametertype2.text = String(this.booking.noOfChildren);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.booking.promotionName
        ? this.booking.promotionName
        : ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.booking.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.booking.totalAmount.toFixed(2)));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    ((this.parametertype2.type = 'text'), (this.parametertype2.text = ' '));
    this.parameterss2.push(this.parametertype2);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    ((this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' + this.referenceNumberAfterBooking));
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    ((this.whatsappForm.to = '9583637921'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        },
      ));
  }

  onGoHome() {
    this.locationBack.back();
  }

  // Home() {
  //   this.router.navigate(['/']);
  //   this.token.clearHotelBooking();
  // }

  paymentIntent(payment: Payment) {
    this.paymentLoader = true;
    payment.date = this.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd');
    this.hotelBookingService.paymentIntent(payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;
        // console.log("payment Intent Response: " + response);
      }
    });
  }
  accommodationEnquiryBookingData() {
    this.enquiryForm = new EnquiryDto();

    if (
      this.token.getProperty().address != null &&
      this.token.getProperty().address != undefined &&
      this.token.getProperty().address.city != null &&
      this.token.getProperty().address.city != undefined
    ) {
      this.enquiryForm.address = this.token.getProperty().address;
      this.enquiryForm.country = this.token.getProperty().address.country;
      this.enquiryForm.location = this.token.getProperty().address.city;
      this.enquiryForm.alternativeLocation =
        this.token.getProperty().address.city;
    }
    this.payment.netReceivableAmount = this.netAmount;

    // this.enquiryForm.totalAmount = this.booking.totalAmount;

    this.enquiryForm.firstName = this.booking.firstName;
    this.enquiryForm.lastName = this.booking.lastName;
    this.enquiryForm.email = this.booking.email;
    this.enquiryForm.phone = this.getFullPhoneNumber();
    this.enquiryForm.taxAmount = this.taxAmountBooking;
    this.enquiryForm.min =
      this.booking.totalAmount + this.booking.totalServiceAmount;
    this.enquiryForm.max =
      this.booking.totalAmount + this.booking.totalServiceAmount;

    this.enquiryForm.checkOutDate = this.booking.toDate;
    this.enquiryForm.checkInDate = this.booking.fromDate;
    this.enquiryForm.noOfPerson = this.booking.noOfPersons;
    this.enquiryForm.noOfExtraPerson = this.booking.noOfExtraPerson;
    this.enquiryForm.roomId = this.booking.roomId;
    this.enquiryForm.payableAmount = this.booking.netAmount;
    this.enquiryForm.roomName = this.booking.roomName;
    this.enquiryForm.extraPersonCharge = this.booking.extraPersonCharge;
    this.enquiryForm.extraChildCharge = this.booking.extraChildCharge;
    this.enquiryForm.noOfExtraChild = this.booking.noOfExtraChild;
    this.enquiryForm.couponCode = this.booking.couponCode;
    this.enquiryForm.promotionName = this.booking.promotionName;
    this.enquiryForm.externalSite = 'WebSite';
    this.enquiryForm.source = 'Bookone Connect';
    this.enquiryForm.beforeTaxAmount = this.booking.beforeTaxAmount;
    if (
      this.token.getProperty().whatsApp === '' ||
      this.token.getProperty().whatsApp === null ||
      this.token.getProperty().whatsApp === undefined
    ) {
      this.enquiryForm.mobile = this.token.getProperty().mobile;
    } else {
      this.enquiryForm.mobile = this.token.getProperty().whatsApp;
    }
    this.enquiryForm.roomType = this.booking.roomName;
    this.enquiryForm.roomRatePlanName = this.booking.roomRatePlanName;

    this.enquiryForm.createdDate = new Date().getTime();

    this.businessUser = this.token.getProperty();
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    this.enquiryForm.fromTime = this.tokenFromTime;
    this.enquiryForm.toTime = this.tokenToTime;
    this.token.saveTime(String(this.enquiryForm.fromTime));
    this.token.saveToTime(String(this.enquiryForm.toTime));
    this.enquiryForm.accountManager = 'TheHotelMate Team';
    this.enquiryForm.consultantPerson = '';
    this.enquiryForm.noOfRooms = this.booking.noOfRooms;
    this.enquiryForm.noOfChildren = this.booking.noOfChildren;
    this.enquiryForm.noOfNights = this.booking.noOfNights;
    this.enquiryForm.accommodationType = this.token.getProperty().businessType;
    this.enquiryForm.discountAmount = this.booking.discountAmount;
    this.enquiryForm.discountAmountPercentage = this.booking.discountPercentage;
    this.enquiryForm.status = 'Booked';
    this.enquiryForm.specialNotes = this.booking.notes;
    this.enquiryForm.propertyId = 107;

    // totalAmount must include add-on services so LMS/PMS/THM show the correct grand total.
    // booking.totalAmount = rooms + tax + convenienceFee (post-discount).
    // booking.totalServiceAmount = add-ons subtotal (always paid in full).
    const servicesTotalForEnquiry = this.toSafeAmount(this.booking.totalServiceAmount);
    this.enquiryForm.totalAmount = Number(
      (this.booking.totalAmount + servicesTotalForEnquiry).toFixed(2),
    );
    this.enquiryForm.payableAmount = this.enquiryForm.totalAmount;
    // advanceAmount = what the guest pays now (Pay Now on screen).
    // booking.advanceAmount is set by calculateMultiDiscountAndTax() = roomAdvance + services + convenienceFee.
    this.enquiryForm.advanceAmount = this.booking.advanceAmount;
    this.enquiryForm.selectedServiceTotal = servicesTotalForEnquiry; // LMS field: selectedServiceTotal (not totalServiceAmount)
    // Serialize selected services so BookingPaymentOrchestrationServiceImpl can recreate ServiceDto rows.
    if (this.savedServices && this.savedServices.length > 0) {
      this.enquiryForm.selectedServices = this.savedServices;
    }
    // this.enquiryForm.taxDetails = this.booking.taxDetails;
    // this.enquiryForm.currency = this.token.getProperty().localCurrency;
    let taxarray = this.token.getProperty().taxDetails;
    taxarray = taxarray.filter(
      (tax) => tax.name !== 'IGST' && tax.name !== 'GST',
    );
    this.enquiryForm.taxDetails = taxarray;
    // this.enquiryForm.planCode = this.booking.planCode;
    this.enquiryForm.bookingReservationId =
      this.booking.propertyReservationNumber;
    this.enquiryForm.bookingId = this.booking.id;

    this.enquiryForm.bookingPropertyId = this.token.getProperty().id;
    this.enquiryForm.propertyName = this.token.getProperty().name;
    this.enquiryForm.taxDetails = this.token
      .getProperty()
      .taxDetails.filter(
        (item) =>
          item.name === 'CGST' || item.name === 'SGST' || item.name === 'GST',
      );

    const TO_EMAIL = 'reservation@thehotelmate.co';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'samaya.muduli@credencesoft.co.nz';
    const bccEmail2 = 'info@bookonepms.com';
    const bccName = 'Samaya';

    this.enquiryForm.fromName =
      this.enquiryForm.firstName + ' ' + this.enquiryForm.lastName;
    this.enquiryForm.toName = TO_NAME;
    this.enquiryForm.fromEmail = this.enquiryForm.email;
    this.enquiryForm.toEmail = TO_EMAIL;
    this.enquiryForm.bccEmail = bccEmail;
    this.enquiryForm.bccName = bccEmail;
    this.enquiryForm.bccEmailTo = bccEmail2;

    if (
      this.enquiryForm.dietaryRequirement === null ||
      this.enquiryForm.dietaryRequirement === undefined
    ) {
      this.enquiryForm.dietaryRequirement = '';
    }
    if (
      this.enquiryForm.accommodationType === null ||
      this.enquiryForm.accommodationType === undefined
    ) {
      this.enquiryForm.accommodationType = '';
    }
    if (
      this.enquiryForm.specialNotes === null ||
      this.enquiryForm.specialNotes === undefined
    ) {
      this.enquiryForm.specialNotes = '';
    }
    if (
      this.enquiryForm.alternativeLocation === null ||
      this.enquiryForm.alternativeLocation === undefined
    ) {
      this.enquiryForm.alternativeLocation = '';
    }
    this.enquiryForm.foodOptions = '';
    this.enquiryForm.organisationId = environment.parentOrganisationId;
    this.enquiryForm.noOfExtraChild = Number(this.token.getExtraChildCharge());
    this.enquiryForm.bookingCommissionAmount = 0;
    this.paymentLoader = true;
    // roomPrice sent to LMS must be the per-room-per-night tariff BEFORE any discount.
    // booking.roomPrice is already per-room-per-night; do NOT subtract extraPersonCharge
    // (which is a total-for-stay amount) — mixing dimensions produces a wrong value.
    // LMS (BookingPaymentOrchestrationServiceImpl) multiplies: roomPrice × noOfRooms × noOfNights.
    this.enquiryForm.roomPrice = this.booking.roomTariffBeforeDiscount;
    this.hotelBookingService
      .accommodationEnquiry(this.enquiryForm)
      .subscribe((response) => {
        this.enquiryForm = response.body;
        this.paymentLoader = false;
        this.paymentLoader = false;
        this.isSuccess = true;
        this.submitButtonDisable = true;
        this.bookingConfirmed = true;
      });
  }

  async getPropertyDetailsById(id: number) {
    try {
      this.loader = true;
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        const zone = 'Asia/Kolkata'; // India

        const accommodation = this.businessUser.businessServiceDtoList.find(
          (item) => item.name === 'Accommodation',
        );
        const fromTime = accommodation?.checkInTime ?? '12:00';
        const toTime = accommodation?.checkOutTime ?? '12:00';

        const getPropertyTimestamp = (
          guestDate: string,
          propertyTime: string,
        ) => {
          const [year, month, day] =
            guestDate.includes('-') && guestDate.split('-')[0].length === 4
              ? guestDate.split('-').map(Number) // yyyy-MM-dd
              : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

          const [hour, minute] = propertyTime.split(':').map(Number);

          // India is UTC+5:30
          const IST_OFFSET = 5.5 * 60; // in minutes

          // Convert property date + time to UTC timestamp
          const utcTimestamp =
            Date.UTC(year, month - 1, day, hour, minute) -
            IST_OFFSET * 60 * 1000;

          return utcTimestamp;
        };

        this.combinedDateFromTime = getPropertyTimestamp(
          this.booking.fromDate,
          fromTime,
        );
        this.combinedDateToTime = getPropertyTimestamp(
          this.booking.toDate,
          toTime,
        );

        this.tokenFromTime = this.combinedDateFromTime;
        this.tokenToTime = this.combinedDateToTime;
        this.token.saveTime(String(this.tokenFromTime));
        this.token.saveToTime(String(this.tokenToTime));
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation',
        );
        this.token.saveProperty(this.businessUser);
        this.currency = this.businessUser.localCurrency.toUpperCase();
        this.businessTypeName = this.businessUser.businessType;
        this.businessServiceDto = this.businessUser.businessServiceDtoList.find(
          (data) => data.name === this.businessUser.businessType,
        );
        this.initializeAdvancePaymentPlans();

        this.businessUser?.socialMediaLinks.forEach((element) => {
          this.socialmedialist = element;
        });

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
      this.loader = false;
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

  loadStripe() {
    // Your Stripe public key
    const stripe = Stripe(this.businessUser.paymentGatewayPublicKey);

    // Create `card` element that will watch for updates
    // and display error messages
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
    card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-error');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Listen for form submission, process the form with Stripe,
    // and get the
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', (event) => {
      event.preventDefault();

      payWithCard(stripe, card, this.payment.clientSecret);
    });

    const payWithCard = function (_stripe, _card, clientSecret) {
      loading(true);
      _stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: _card,
          },
        })
        .then(function (result) {
          if (result.error) {
            // Show error to your customer
            showError(result.error.message);
          } else {
            // The payment succeeded!
            loading(false);

            orderComplete();
          }
        });
    };

    const loading = function (isLoading) {
      if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector('button').disabled = true;
        document.querySelector('#spinner').classList.remove('hidden');
        document.querySelector('#button-text').classList.add('hidden');
      } else {
        document.querySelector('button').disabled = false;
        document.querySelector('#spinner').classList.add('hidden');
        document.querySelector('#button-text').classList.remove('hidden');
      }
    };
    const showError = function (errorMsgText) {
      loading(false);
      var errorMsg = document.querySelector('#card-error');
      errorMsg.textContent = errorMsgText;
      setTimeout(function () {
        errorMsg.textContent = '';
      }, 4000);
    };
    let orderComplete = function () {
      window.angularComponentReference.zone.run(() => {
        window.angularComponentReference.loadAngularFunction();
      });
    };
  }
  stripePaymentSuccess() {
    this.hotelBookingService.savePayment(this.payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;
        // console.log("payment Intent Response: " + response);

        this.booking.paymentId = response.body.id;
        this.booking.modeOfPayment = this.payment.paymentMode;
        this.booking.outstandingAmount = 0;
        Logger.log('Card info done' + JSON.stringify(this.payment));
        this.changeDetectorRefs.detectChanges();

        this.createAllBookings();
      }
    });
  }
  async createAllEnquiries() {
    if (this.isEnquiryDisabled) return;
    this.isEnquiryDisabled = true;
    const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
    const bookingSummary = bookingSummaryStr
      ? JSON.parse(bookingSummaryStr)
      : null;

    if (!bookingSummary || !bookingSummary.selectedPlansSummary?.length) {
      console.error('No valid booking summary found.');
      return;
    }

    const bookingList = bookingSummary.selectedPlansSummary;

    for (let i = 0; i < bookingList.length; i++) {
      const _booking = bookingList[i];
      await this.submitForm(_booking, bookingList);
    }
  }

  async submitForm(plan: any, bookingSummary: any) {
    const booking: any = this.booking;
    if (this.specialDiscountData) {
      booking.netAmount = Number(plan.discountedPrice.toFixed(2));
      booking.gstAmount = Number(plan.taxPercentageperroom.toFixed(2));
      booking.discountPercentage = this.specialDiscountData.discountPercentage;
      booking.discountAmount = Number(plan.discountAmount.toFixed(2));
      booking.beforeTaxAmount = Number(plan.discountedPrice.toFixed(2));
      booking.taxAmount = Number(plan.taxPercentageperroom.toFixed(2));
      booking.couponCode = this.specialDiscountData.couponCode;
      booking.promotionName = this.specialDiscountData.name;
    } else {
      booking.discountPercentage = 0;
    }

    const enquiryForm = new EnquiryDto();

    if (this.token.getProperty()?.address?.city) {
      enquiryForm.address = this.token.getProperty().address;
      enquiryForm.country = this.token.getProperty().address.country;
      enquiryForm.location = this.token.getProperty().address.city;
      enquiryForm.alternativeLocation = this.token.getProperty().address.city;
    }

    this.payment.netReceivableAmount = plan.price + plan.taxPercentageperroom;
    enquiryForm.min = Number(this.payment.netReceivableAmount.toFixed(2));
    enquiryForm.max = Number(this.payment.netReceivableAmount.toFixed(2));

    enquiryForm.firstName = booking.firstName;
    enquiryForm.lastName = booking.lastName;
    enquiryForm.email = booking.email;
    enquiryForm.phone = this.buildFullPhoneNumber(booking.mobile);
    enquiryForm.checkOutDate = booking.toDate;
    enquiryForm.checkInDate = booking.fromDate;
    enquiryForm.noOfPerson = plan.adults;
    enquiryForm.noOfExtraPerson = plan.extraCountAdult;
    enquiryForm.roomId = plan.roomId;
    if (this.groupBookingId) {
      enquiryForm.groupEnquiryId = this.groupBookingId;
    }
    enquiryForm.payableAmount = plan.price + plan.taxPercentageperroom;
    enquiryForm.roomName = plan.roomName;
    enquiryForm.extraPersonCharge = plan.extraPersonAdultCountAmount;
    enquiryForm.extraChildCharge = plan.extraPersonChildCountAmount;
    enquiryForm.noOfExtraChild = plan.extraCountChild;
    const bookingEngineFlag = sessionStorage.getItem('BookingEngine');
    this.websiteUrlBookingEngine = bookingEngineFlag === 'true';
    const utmSessionValue = sessionStorage.getItem('utm_source');
    if (utmSessionValue && !this.websiteUrlBookingEngine) {
      enquiryForm.utmSource = sessionStorage.getItem('utm_source');
      enquiryForm.utmMedium = sessionStorage.getItem('utm_medium');
    } else if (this.websiteUrlBookingEngine && utmSessionValue) {
      enquiryForm.utmSource = sessionStorage.getItem('utm_source');
      enquiryForm.utmMedium = sessionStorage.getItem('utm_medium');
    } else if (this.websiteUrlBookingEngine && !utmSessionValue) {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'bookingEngine';
    } else if (this.activeGoogleCenter && !utmSessionValue) {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'ghc';
    } else {
      enquiryForm.utmSource = 'organic';
      enquiryForm.utmMedium = 'unknown';
    }

    // roomPrice must be per-room-per-night tariff so LMS can multiply: roomPrice × noOfRooms × noOfNights.
    enquiryForm.roomPrice = plan.actualRoomPrice;

    enquiryForm.externalSite = 'WebSite';
    enquiryForm.source = 'Bookone Connect';
    enquiryForm.couponCode = booking.couponCode;
    enquiryForm.promotionName = booking.promotionName;
    enquiryForm.discountAmount = booking.discountAmount;
    enquiryForm.beforeTaxAmount = plan.price;

    enquiryForm.mobile =
      this.token.getProperty().whatsApp || this.token.getProperty().mobile;

    enquiryForm.roomType = plan.roomName;
    enquiryForm.roomRatePlanName = plan.planCodeName;
    enquiryForm.createdDate = new Date().getTime();
    enquiryForm.enquiryType = 'Enquiry';
    this.businessUser = this.token.getProperty();
    const zone = 'Asia/Kolkata'; // India

    const accommodation = this.businessUser.businessServiceDtoList.find(
      (item) => item.name === 'Accommodation',
    );
    const fromTime = accommodation?.checkInTime ?? '12:00';
    const toTime = accommodation?.checkOutTime ?? '12:00';

    const getPropertyTimestamp = (guestDate: string, propertyTime: string) => {
      const [year, month, day] =
        guestDate.includes('-') && guestDate.split('-')[0].length === 4
          ? guestDate.split('-').map(Number) // yyyy-MM-dd
          : guestDate.split('-').reverse().map(Number); // dd-MM-yyyy

      const [hour, minute] = propertyTime.split(':').map(Number);

      // India is UTC+5:30
      const IST_OFFSET = 5.5 * 60; // in minutes

      // Convert property date + time to UTC timestamp
      const utcTimestamp =
        Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET * 60 * 1000;

      return utcTimestamp;
    };

    this.combinedDateFromTime = getPropertyTimestamp(
      this.booking.fromDate,
      fromTime,
    );
    this.combinedDateToTime = getPropertyTimestamp(this.booking.toDate, toTime);

    this.tokenFromTime = this.combinedDateFromTime;
    this.tokenToTime = this.combinedDateToTime;
    enquiryForm.fromTime = this.tokenFromTime;
    enquiryForm.toTime = this.tokenToTime;
    this.token.saveTime(String(enquiryForm.fromTime));
    this.token.saveToTime(String(enquiryForm.toTime));

    enquiryForm.accountManager = '';
    enquiryForm.consultantPerson = '';
    enquiryForm.noOfRooms = Number(plan.selectedRoomnumber);
    enquiryForm.noOfChildren = plan.children;
    enquiryForm.accommodationType = this.token.getProperty().businessType;
    enquiryForm.status = 'Enquiry';
    enquiryForm.specialNotes = booking.notes || '';
    enquiryForm.propertyId = 107;
    enquiryForm.bookingPropertyId = this.token.getProperty().id;
    enquiryForm.propertyName = this.token.getProperty().name;
    enquiryForm.taxDetails = this.token
      .getProperty()
      .taxDetails.filter((item) => ['CGST', 'SGST', 'GST'].includes(item.name));
    enquiryForm.taxAmount = plan.taxPercentageperroom;

    const TO_EMAIL = 'reservation@thehotelmate.co';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'samaya.muduli@credencesoft.co.nz';
    const bccEmail2 = 'info@bookonepms.com';

    enquiryForm.fromName = `${enquiryForm.firstName} ${enquiryForm.lastName}`;
    enquiryForm.toName = TO_NAME;
    enquiryForm.fromEmail = enquiryForm.email;
    enquiryForm.toEmail = TO_EMAIL;
    enquiryForm.bccEmail = bccEmail;
    enquiryForm.bccName = bccEmail;
    enquiryForm.bccEmailTo = bccEmail2;

    enquiryForm.dietaryRequirement = enquiryForm.dietaryRequirement || '';
    enquiryForm.accommodationType = enquiryForm.accommodationType || '';
    enquiryForm.specialNotes = enquiryForm.specialNotes || '';
    enquiryForm.alternativeLocation = enquiryForm.alternativeLocation || '';

    enquiryForm.totalAmount = plan.price + plan.taxPercentageperroom;
    enquiryForm.discountAmountPercentage = booking.discountPercentage;
    enquiryForm.noOfNights = plan.nights;
    enquiryForm.foodOptions = '';
    enquiryForm.organisationId = environment.parentOrganisationId;
    enquiryForm.bookingCommissionAmount = 0;
    enquiryForm.taxPercentage = plan.taxpercentage;
    enquiryForm.businessEmail = this.token.getProperty().email;
    if (this.specialDiscountData) {
      enquiryForm.payableAmount = Number(plan.finalPrice.toFixed(2));
      enquiryForm.beforeTaxAmount = Number(plan.discountedPrice.toFixed(2));
      enquiryForm.taxPercentage = plan.taxpercentage;
      enquiryForm.totalAmount = Number(plan.finalPrice.toFixed(2));
    }
    // this.applyAdvancePlanToEnquiryForm(
    //   enquiryForm,
    //   enquiryForm.totalAmount || enquiryForm.payableAmount,
    // );
    this.paymentLoader = true;
    const bookingForm = new Booking();
    bookingForm.businessEmail = this.token.getProperty().email;
    bookingForm.businessName = this.token.getProperty().name;
    bookingForm.firstName = booking.firstName;
    bookingForm.lastName = booking.lastName;
    bookingForm.email = booking.email;
    bookingForm.mobile = booking.mobile;
    bookingForm.toDate = booking.toDate;
    bookingForm.fromDate = booking.fromDate;
    bookingForm.noOfPersons = plan.adults;
    bookingForm.noOfExtraPerson = plan.extraCountAdult;
    bookingForm.roomId = plan.roomId;
    bookingForm.payableAmount = plan.price + plan.taxPercentageperroom;
    bookingForm.roomName = plan.roomName;
    bookingForm.extraPersonCharge = plan.extraPersonAdultCountAmount;
    bookingForm.extraChildCharge = plan.extraPersonChildCountAmount;
    bookingForm.noOfExtraChild = plan.extraCountChild;

    bookingForm.roomPrice = plan.actualRoomPrice;

    bookingForm.externalSite = 'WebSite';
    bookingForm.couponCode = booking.couponCode;
    bookingForm.promotionName = booking.promotionName;
    bookingForm.discountAmount = booking.discountAmount;
    bookingForm.beforeTaxAmount = plan.price;

    bookingForm.mobile =
      this.token.getProperty().whatsApp || this.token.getProperty().mobile;

    bookingForm.roomName = plan.roomName;
    bookingForm.roomRatePlanName = plan.planCodeName;
    bookingForm.createdDate = new Date().getTime();

    // Combine date and time
    const checkInDateTimeOne = new Date(
      `${bookingForm.fromDate} ${this.fromTime}`,
    ).getTime();
    const checkOutDateTimeOne = new Date(
      `${bookingForm.toDate} ${this.toTime}`,
    ).getTime();
    bookingForm.fromTime = checkInDateTimeOne;
    bookingForm.toTime = checkOutDateTimeOne;
    this.token.saveTime(String(checkInDateTimeOne));
    this.token.saveToTime(String(checkOutDateTimeOne));

    bookingForm.noOfRooms = Number(plan.selectedRoomnumber);
    bookingForm.noOfChildren = plan.children;
    bookingForm.propertyId = 107;
    bookingForm.propertyId = this.token.getProperty().id;
    bookingForm.taxDetails = this.token
      .getProperty()
      .taxDetails.filter((item) => ['CGST', 'SGST', 'GST'].includes(item.name));
    bookingForm.taxAmount = plan.taxPercentageperroom;
    if (this.groupBookingId) {
      bookingForm.groupBookingId = null;
    }
    bookingForm.totalAmount = plan.price + plan.taxPercentageperroom;
    bookingForm.discountPercentage = booking.discountPercentage;
    bookingForm.noOfNights = plan.nights;
    bookingForm.taxPercentage = plan.taxpercentage;
    bookingForm.roomTariffBeforeDiscount = plan.actualRoomPrice;
    bookingForm.totalRoomTariffBeforeDiscount =
      plan.actualRoomPrice * plan.nights * plan.selectedRoomnumber;
    bookingForm.totalBookingAmount = bookingForm.totalRoomTariffBeforeDiscount;
    if (this.specialDiscountData) {
      bookingForm.payableAmount = Number(plan.finalPrice.toFixed(2));
      bookingForm.beforeTaxAmount = Number(plan.discountedPrice.toFixed(2));
      bookingForm.taxPercentage = plan.taxpercentage;
      bookingForm.totalAmount = Number(plan.finalPrice.toFixed(2));
    }
    //this.applyAdvancePlanToBooking(bookingForm);
    this.saveEnquiryTHM(bookingForm);
    try {
      const response: HttpResponse<EnquiryDto> = await this.hotelBookingService
        .accommodationEnquiry(enquiryForm)
        .toPromise();
      if (response) {
        this.paymentLoader = false;
        this.submitFormMobileBizzApp(enquiryForm);
        enquiryForm.checkOutDate = this.datePipe.transform(
          enquiryForm.checkInDate,
          'dd-MM-yyyy',
        );
        enquiryForm.checkInDate = this.datePipe.transform(
          enquiryForm.checkInDate,
          'dd-MM-yyyy',
        );
        this.equitycreatedData = response.body;
        enquiryForm.enquiryId = this.equitycreatedData.enquiryId;
        const existingEnquirysStr = sessionStorage.getItem(
          'EnquiryResponseList',
        );
        const existingEnquiries = existingEnquirysStr
          ? JSON.parse(existingEnquirysStr)
          : [];
        existingEnquiries.push(this.equitycreatedData);
        sessionStorage.setItem(
          'EnquiryResponseList',
          JSON.stringify(existingEnquiries),
        );
        this.token.saveEnquiryData(this.equitycreatedData);
        this.isEnquiry = true;
        this.isSuccess = true;
        this.submitButtonDisable = true;
        this.bookingConfirmed = true;
        this.enquiryNo = 'THM-' + response.body.enquiryId;

        // Send notifications
        this.propertyenquiryemails(enquiryForm);
        // this.hotelBookingService.emailEnquire(enquiryForm).subscribe(
        //   () => {
        //     this.paymentLoader = false;
        //     this.router.navigate(['/confirm']);
        //   },
        //   () => {
        //     this.paymentLoader = false;
        //   }
        // );
        this.sendenquirytoproperty();
        this.sendWhatsappMessageToCustomer();
        this.sendWhatsappMessageToPropertyOwner();
        this.router.navigate(['/confirm']);
        return true;
      }
    } catch (e) {
      console.error('Submit failed', e);
    }

    return false;
  }

  async submitFormMobileBizzApp(enquiryForm) {
    enquiryForm.propertyId = this.token?.getProperty()?.id;
    try {
      const response: HttpResponse<EnquiryDto> = await this.hotelBookingService
        .accommodationEnquiry(enquiryForm)
        .toPromise();
      if (response) {
        this.paymentLoader = false;
        enquiryForm.checkInDate = this.datePipe.transform(
          this.booking?.fromDate,
          'dd-MM-yyyy',
        );
        enquiryForm.checkOutDate = this.datePipe.transform(
          this.booking?.toDate,
          'dd-MM-yyyy',
        );
        this.equitycreatedData = response.body;
        this.token.saveEnquiryData(this.equitycreatedData);
        this.isEnquiry = true;
        this.isSuccess = true;
        this.submitButtonDisable = true;
        this.bookingConfirmed = true;
        this.enquiryNo = 'THM-' + response.body.enquiryId;
        enquiryForm.taxAmount = this.equitycreatedData.taxAmount.toFixed(2);
        enquiryForm.totalAmount = this.equitycreatedData.totalAmount.toFixed(2);
        enquiryForm.payableAmount =
          this.equitycreatedData.payableAmount.toFixed(2);
        // Send notifications
        this.propertyenquiryemails(enquiryForm);
        this.hotelBookingService.emailEnquireToMail(enquiryForm).subscribe(
          () => {
            this.paymentLoader = false;
            this.router.navigate(['/confirm']);
          },
          () => {
            this.paymentLoader = false;
          },
        );
        // this.sendWhatsappMessageToCustomer();
        // this.sendWhatsappMessageToPropertyOwner();
        return true;
      }
    } catch (e) {
      console.error('Submit failed', e);
    }

    return false;
  }

  saveEnquiryTHM(booking: Booking) {
    const createBookingObsr = this.hotelBookingService
      .saveEnquireTHM(booking)
      .subscribe((response) => {
        if (response.status === 200) {
          this.thmEnquiryDataList = response.body;
          const thmData = sessionStorage.getItem('EnquiryTHMList');
          // const existingEnquiriesThm = thmData ? JSON.parse(thmData) : [];

          // existingEnquiriesThm.push(this.thmEnquiryDataList);

          // sessionStorage.setItem(
          //   'EnquiryTHMList',
          //   JSON.stringify(existingEnquiriesThm)
          // );
        }
      });
  }

  propertyenquiryemails(enquiryForm) {
    // console.log(this.equitycreatedData.enquiryId)
    this.propertyenquiryone.customerName = enquiryForm.fromName;
    this.propertyenquiryone.propertyEnquiryId =
      this.equitycreatedData.enquiryId;
    this.propertyenquiryone.propertyId = this.businessUser.id;
    this.propertyenquiryone.propertyName = this.businessUser.name;
    this.propertyenquiryone.propertyLandPhone = this.businessUser.mobile;
    this.propertyenquiryone.propertyMobile = this.businessUser.mobile;

    this.http
      .post<EnquiryForm>(
        'https://api.bookonelocal.in/api-lms/api/v1/propertyEnquiry',
        this.propertyenquiryone,
      )
      .subscribe((response) => {
        this.success = response;
        Logger.log('sent ' + response);

        // this.name = '';
        // this.fromEmail = '';
        // this.phone = '';
        // this.subject = '';

        // this.accommodationType = '';
        // this.noOfPerson = 0;
        // this.noOfRooms = 0;
        // this.noOfChildren = 0;
        // this.noOfPets = 0;
        // this.location = '';
        // this.alternativeLocation = '';
        // this.phone = '';
        // this.email = '';
        // this.checkInDate = '';
        // this.checkOutDate = '';
        // this.foodOptions = '';
        // this.dietaryRequirement = '';
        // this.min = 0;
        // this.max = 0;
        // this.specialNotes = '';

        //  this.enquiryForm = new EnquiryForm();
        //  this.successMessage = true;
      });
  }
  sendenquirytoproperty() {
    const payload = {
      fromEmail: 'reservation@thehotelmate.co',
      toEmail: this.businessUser.email,
      roomPrice: this.booking.totalAmount,
      phone: '',
      email: '',
    };
    this.http
      .post<EnquiryForm>(
        environment.apiUrlBookone + '/api/email/enquire',
        payload,
      )
      .subscribe((response) => {
        this.success = response;
        Logger.log('sent ' + response);

        // this.name = '';
        // this.fromEmail = '';
        // this.phone = '';
        // this.subject = '';

        // this.accommodationType = '';
        // this.noOfPerson = 0;
        // this.noOfRooms = 0;
        // this.noOfChildren = 0;
        // this.noOfPets = 0;
        // this.location = '';
        // this.alternativeLocation = '';
        // this.phone = '';
        // this.email = '';
        // this.checkInDate = '';
        // this.checkOutDate = '';
        // this.foodOptions = '';
        // this.dietaryRequirement = '';
        // this.min = 0;
        // this.max = 0;
        // this.specialNotes = '';

        // this.enquiryForm = new EnquiryForm();
        // this.successMessage = true;
      });

    //  this.propertyenquiryemails(enquiryForm);
  }
sendWhatsappMessageToCustomer() {

  if (this.token.getProperty() !== null) {
    this.propertyData = this.token.getProperty();
  }

  const propertyUrl = this.token.getPropertyUrl();
  const isBookingEngine = propertyUrl?.includes('bookingEngine');

  this.whatsappForm2 = new WhatsappDto();
  this.language = new Language();
  this.template = new Template();

  this.whatsappForm2.messaging_product = 'whatsapp';
  this.whatsappForm2.recipient_type = 'individual';

  this.template.name = 'bookone_guest_enquiry';
  this.language.code = 'en';
  this.template.language = this.language;

  let components: any[] = [];

  /* HEADER */
  const headerComponent = {
    type: 'header',
    parameters: [
      {
        type: 'text',
        text: this.businessUser.name
      }
    ]
  };

  /* BODY */
  const bodyParameters: any[] = [
    { type: 'text', text: this.equitycreatedData.enquiryId },
    { type: 'text', text: this.booking.fromDate },
    { type: 'text', text: this.booking.toDate },
    { type: 'text', text: this.booking?.noOfPersons?.toString() },
    { type: 'text', text: this.booking?.noOfChildren?.toString() },
    { type: 'text', text: this.equitycreatedData.roomName }
  ];

  /* Conditional numbers */
  if (isBookingEngine) {

    bodyParameters.push(
      { type: 'text', text: this.businessUser.whatsApp },
      { type: 'text', text: this.businessUser.mobile }
    );

  } else {

    bodyParameters.push(
      { type: 'text', text: '7326079861' },
      { type: 'text', text: '7326079861' }
    );

  }

  const bodyComponent = {
    type: 'body',
    parameters: bodyParameters
  };

  components.push(headerComponent);
  components.push(bodyComponent);

  this.template.components = components;

  this.whatsappForm2.template = this.template;
  this.whatsappForm2.to = this.booking.mobile;
  this.whatsappForm2.type = 'template';

  this.hotelBookingService.whatsAppMsg(this.whatsappForm2).subscribe(
    (response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
      }
    },
    (error) => {
      this.paymentLoader = false;
      console.error(error);
    }
  );
}
sendWhatsappMessageToPropertyOwner() {

  this.whatsappForm2 = new WhatsappDto();
  this.language = new Language();
  this.template = new Template();

  this.whatsappForm2.messaging_product = 'whatsapp';
  this.whatsappForm2.recipient_type = 'individual';

  this.template.name = 'guest_enquiry';
  this.language.code = 'en';
  this.template.language = this.language;

  const components: any[] = [];

  /* HEADER */
  const headerComponent = {
    type: 'header',
    parameters: [
      {
        type: 'text',
        text: this.businessUser.name
      }
    ]
  };

  /* BODY */
  const bodyComponent = {
    type: 'body',
    parameters: [
      {
        type: 'text',
        text: this.booking.fromDate
      },
      {
        type: 'text',
        text: this.booking.toDate
      },
      {
        type: 'text',
        text: this.booking?.noOfPersons?.toString()
      },
      {
        type: 'text',
        text: this.booking?.noOfChildren?.toString()
      },
      {
        type: 'text',
        text: this.equitycreatedData.roomName
      }
    ]
  };

  components.push(headerComponent);
  components.push(bodyComponent);

  this.template.components = components;

  this.whatsappForm2.template = this.template;
  this.whatsappForm2.to = this.businessUser.mobile;
  this.whatsappForm2.type = 'template';

  this.hotelBookingService.whatsAppMsg(this.whatsappForm2).subscribe(
    (response) => {
      if (response.status === 200) {
        // success
      }
      this.paymentLoader = false;
    },
    (error) => {
      this.paymentLoader = false;
    }
  );
}
  checkingAvailability() {
    this.hotelBookingService
      .checkAvailabilityByProperty(
        this.booking.fromDate,
        this.booking.toDate,
        this.booking.noOfRooms,
        this.booking.noOfPersons,
        this.booking.propertyId,
      )
      .subscribe((response) => {
        this.availableRooms = response.body.roomList;
        let facilities = this.businessUser.propertyServicesList;
        if (this.availableRooms !== null && this.availableRooms !== undefined) {
          this.availableRooms.forEach((room) => {
            room?.roomFacilities?.forEach((element) => {
              if (element.name == 'Pet Friendly') {
                this.pet = element;
              }
            });
          });
        }
      });
  }

  private roundToTwo(value: number): number {
    return Number((Number(value) || 0).toFixed(2));
  }

  private shouldLogCalculationDebug(): boolean {
    if (this.enableCalculationDebug) {
      return true;
    }
    if (typeof window === 'undefined' || !window?.localStorage) {
      return false;
    }
    return window.localStorage.getItem('debugBookingCalc') === 'true';
  }

  private logCalculationSnapshot(
    context: string,
    snapshot: Record<string, any>,
  ): void {
    if (!this.shouldLogCalculationDebug()) {
      return;
    }
    console.log('[BOOKING_CALC]', context, {
      ...snapshot,
      timestamp: new Date().toISOString(),
    });
  }

  private toSafeAmount(value: any): number {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return 0;
    }
    return Math.max(0, this.roundToTwo(num));
  }

  private toSafePercent(value: any): number {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return 0;
    }
    return Math.min(100, Math.max(0, num));
  }

  private getAccommodationService(): BusinessServiceDtoList | undefined {
    return this.businessUser?.businessServiceDtoList?.find(
      (item) => item.name === 'Accommodation',
    );
  }

  private initializeAdvancePaymentPlans(): void {
    const accommodation = this.getAccommodationService();
    this.businessServiceDto = accommodation || this.businessServiceDto;
    this.advanceDiscountSlabs = (accommodation?.advanceDiscountSlabs || [])
      .filter(
        (slab) =>
          slab &&
          Number(slab.advancePercentage) > 0 &&
          Number(slab.discountPercentage) >= 0,
      )
      .sort((a, b) => Number(a.advancePercentage) - Number(b.advancePercentage));

    if (this.selectedAdvanceDiscountSlab && !this.advanceDiscountSlabs.some(
        (slab) =>
          Number(slab.advancePercentage) ===
          Number(this.selectedAdvanceDiscountSlab?.advancePercentage) &&
          Number(slab.discountPercentage) ===
          Number(this.selectedAdvanceDiscountSlab?.discountPercentage),
      )
    ) {
      this.selectedAdvanceDiscountSlab = null;
    }
  }

  /**
   * Handle advance payment plan selection
   * Recalculates all discounts and taxes when user selects an advance payment plan
   */
  selectAdvancePaymentPlan(slab: AdvanceDiscountSlab): void {
    try {
      this.selectedAdvanceDiscountSlab = slab;
      // Always recalculate to update all discount and payment amounts
      this.calculateMultiDiscountAndTax();
      // Trigger change detection
      this.changeDetectorRefs.markForCheck();
    } catch (error) {
      console.error('Error in selectAdvancePaymentPlan:', error);
    }
  }

  /**
   * Check if a specific advance payment plan is selected
   */
  /**
   * Calculate multi-discount with proper tax application
   * Formula: 
   * 1. Apply coupon discount to base amount
   * 2. Apply advance discount to already discounted amount
   * 3. Calculate tax on final discounted amount
   * 4. Calculate advance and remaining payment amounts
   */
  calculateMultiDiscountAndTax(): void {
    console.log('booking data is',this.booking);
    try {
      const baseAmount = this.toSafeAmount(
        this.storedActualNetAmount ||
          this.bookingSummaryDetails?.totalPlanPrice ||
          this.booking?.netAmount,
      );

      if (!baseAmount) {
        this.couponDiscountAmount = 0;
        this.advanceDiscountAmount = 0;
        this.totalDiscountAmount = 0;
        this.amountAfterDiscount = 0;
        this.taxOnDiscountedAmount = 0;
        this.convenienceFeeAmount = 0;
        this.advancePaymentAmount = 0;
        this.remainingPaymentAmount = 0;
        this.booking.netAmount = 0;
        this.booking.discountAmount = 0;
        this.booking.taxAmount = 0;
        this.booking.totalAmount = 0;
        this.booking.advanceAmount = 0;
        this.booking.payableAmount = 0;
        this.logCalculationSnapshot('empty-base-amount', {
          baseAmount,
          couponDiscountAmount: this.couponDiscountAmount,
          advanceDiscountAmount: this.advanceDiscountAmount,
          totalDiscountAmount: this.totalDiscountAmount,
          amountAfterDiscount: this.amountAfterDiscount,
          taxOnDiscountedAmount: this.taxOnDiscountedAmount,
          convenienceFeeAmount: this.convenienceFeeAmount,
          servicesTotal: 0,
          grandTotal: this.booking.totalAmount,
          payNowAmount: this.advancePaymentAmount,
          balanceAtCheckIn: this.remainingPaymentAmount,
        });
        this.changeDetectorRefs.markForCheck();
        return;
      }

      console.log('[CALC] baseAmount:', baseAmount, 'selectedCouponList:', this.selectedCouponList, 'advanceSlab:', this.selectedAdvanceDiscountSlab);
      let currentAmount = baseAmount;
      const couponPct = this.toSafePercent(this.selectedCouponList?.discountPercentage);
      const advanceDiscountPct = this.toSafePercent(this.selectedAdvanceDiscountSlab?.discountPercentage);
      const advancePayPct = this.toSafePercent(this.selectedAdvanceDiscountSlab?.advancePercentage);
      const roomTaxPct = this.toSafePercent(this.booking?.taxPercentage);
      const servicesTotal = this.toSafeAmount(this.getServicesTotal());

      // Step 1: Apply Coupon Discount
      this.couponDiscountAmount = 0;
      if (couponPct > 0) {
        this.couponDiscountAmount =
          (baseAmount * couponPct) / 100;
        currentAmount = Math.max(0, baseAmount - this.couponDiscountAmount);
        console.log('[CALC] Coupon applied: discountPercentage=', couponPct, 'couponDiscountAmount=', this.couponDiscountAmount, 'currentAmount=', currentAmount);
      }

      // Step 2: Apply Advance Discount (percentage-based on already discounted amount)
      this.advanceDiscountAmount = 0;
      if (advanceDiscountPct > 0) {
        this.advanceDiscountAmount =
          (currentAmount * advanceDiscountPct) /
          100;
        currentAmount = Math.max(0, currentAmount - this.advanceDiscountAmount);
      }

      // Step 3: Calculate Total Discount Amount
      this.totalDiscountAmount = this.toSafeAmount(
        this.couponDiscountAmount + this.advanceDiscountAmount,
      );
      this.amountAfterDiscount = this.toSafeAmount(currentAmount);

      // Step 4: Apply Tax on Final Discounted Amount
      this.getApplicableTaxPercentage();
      this.taxOnDiscountedAmount =
        (this.amountAfterDiscount * roomTaxPct) / 100;
      this.taxOnDiscountedAmount = this.toSafeAmount(this.taxOnDiscountedAmount);

      // Step 5: Calculate Convenience Fee on final discounted room amount
      this.convenienceFeeAmount = this.toSafeAmount(
        this.calculateConvenienceFee(this.amountAfterDiscount, this.serviceChargePercentage),
      );

      // Step 6: Calculate final totals with add-ons + advance split
      const roomsWithTax = this.toSafeAmount(
        this.amountAfterDiscount + this.taxOnDiscountedAmount,
      );
      const grandTotalAmount = this.toSafeAmount(
        roomsWithTax + servicesTotal + this.convenienceFeeAmount,
      );

      if (this.selectedAdvanceDiscountSlab) {
        const roomAdvancePortion = this.toSafeAmount(
          (roomsWithTax * advancePayPct) / 100,
        );
        this.advancePaymentAmount = this.toSafeAmount(
          roomAdvancePortion + servicesTotal + this.convenienceFeeAmount,
        );
        this.remainingPaymentAmount = this.toSafeAmount(
          roomsWithTax - roomAdvancePortion,
        );
      } else {
        this.advancePaymentAmount = 0;
        this.remainingPaymentAmount = grandTotalAmount;
      }
      
      console.log('[CALC] Convenience Fee (on post-discount amount):', this.convenienceFeeAmount);
      console.log('[CALC] Total Payment with Convenience Fee:', grandTotalAmount);

      // Update booking object with calculated values
      this.booking.netAmount = this.amountAfterDiscount;
      this.booking.discountAmount = this.totalDiscountAmount;
      // Effective combined discount percentage — the single % that produced discountAmount from baseAmount.
      // This keeps discountPercentage and discountAmount mathematically consistent for LMS, PMS, THM and templates.
      this.booking.discountPercentage = baseAmount > 0
        ? Math.round((this.totalDiscountAmount / baseAmount) * 10000) / 100
        : 0;
      // Human-readable breakdown sent via promotionName so hotel can see what composed the discount.
      const promotionParts: string[] = [];
      if (couponPct > 0) {
        promotionParts.push(`Coupon ${couponPct}%`);
      }
      if (advanceDiscountPct > 0) {
        promotionParts.push(`Advance ${advanceDiscountPct}%`);
      }
      // Always write — joins to '' when no discounts, clearing any stale value from a previous selection.
      this.booking.promotionName = promotionParts.join(' + ');
      this.booking.taxAmount = this.taxOnDiscountedAmount;
      this.booking.totalAmount = grandTotalAmount;
      this.booking.advanceAmount = this.advancePaymentAmount;
      this.booking.payableAmount = grandTotalAmount;
      this.logCalculationSnapshot('calculateMultiDiscountAndTax', {
        baseAmount,
        couponPct,
        advanceDiscountPct,
        advancePayPct,
        roomTaxPct,
        couponDiscountAmount: this.couponDiscountAmount,
        advanceDiscountAmount: this.advanceDiscountAmount,
        totalDiscountAmount: this.totalDiscountAmount,
        amountAfterDiscount: this.amountAfterDiscount,
        taxOnDiscountedAmount: this.taxOnDiscountedAmount,
        convenienceFeeAmount: this.convenienceFeeAmount,
        servicesTotal,
        grandTotal: grandTotalAmount,
        payNowAmount: this.advancePaymentAmount,
        balanceAtCheckIn: this.remainingPaymentAmount,
      });
      
      // Trigger change detection to update UI
      this.changeDetectorRefs.markForCheck();
    } catch (error) {
      console.error('Error in calculateMultiDiscountAndTax:', error);
    }
  }

  /**
   * Get the selected advance discount percentage
   */
  getSelectedAdvanceDiscountPercentage(): number {
    return this.selectedAdvanceDiscountSlab?.discountPercentage || 0;
  }

  /**
   * Get the advance payment percentage (what percentage to pay now)
   */
  getSelectedAdvancePaymentPercentage(): number {
    return this.selectedAdvanceDiscountSlab?.advancePercentage || 0;
  }

  hasAdvancePaymentPlans(): boolean {
    return this.advanceDiscountSlabs.length > 0;
  }

  hasSelectedAdvancePaymentPlan(): boolean {
    return !!this.selectedAdvanceDiscountSlab;
  }

  isAdvancePaymentPlanRequired(): boolean {
    return this.hasAdvancePaymentPlans() && !this.hasSelectedAdvancePaymentPlan();
  }

  private ensureSelectedAdvancePaymentPlan(): AdvanceDiscountSlab | null {
    if (this.hasAdvancePaymentPlans() && !this.selectedAdvanceDiscountSlab) {
      this.selectedAdvanceDiscountSlab = this.advanceDiscountSlabs[0] || null;
    }

    return this.selectedAdvanceDiscountSlab;
  }

  private getAdvancePercentageForPlan(
    slab: AdvanceDiscountSlab | null = null,
  ): number {
    const selectedSlab = slab ?? this.ensureSelectedAdvancePaymentPlan();
    return Number(
      selectedSlab?.advancePercentage ??
      this.businessServiceDto?.advanceAmountPercentage ??
      0,
    );
  }

  private getAdvanceDiscountPercentageForPlan(
    slab: AdvanceDiscountSlab | null = null,
  ): number {
    const selectedSlab = slab ?? this.ensureSelectedAdvancePaymentPlan();
    return Number(selectedSlab?.discountPercentage ?? 0);
  }

  private calculateAmountByPercentage(
    amount: number,
    percentage: number,
  ): number {
    return this.roundToTwo((Number(amount) * Number(percentage)) / 100);
  }

  // private getAdvancePlanCalculation(
  //   slab: AdvanceDiscountSlab | null = null,
  //   totalAmount?: number,
  // ): {
  //   baseAmount: number;
  //   discountAmount: number;
  //   discountedTotal: number;
  //   payableAmount: number;
  // } {
  //   const baseAmount = this.roundToTwo(
  //     Number(totalAmount ?? this.getCurrentBookingTotalForAdvancePlan()),
  //   );
  //   const discountAmount = this.calculateAmountByPercentage(
  //     baseAmount,
  //     this.getAdvanceDiscountPercentageForPlan(slab),
  //   );
  //   const discountedTotal = this.roundToTwo(
  //     Math.max(baseAmount - discountAmount, 0),
  //   );
  //   const payableAmount = this.calculateAmountByPercentage(
  //     discountedTotal,
  //     this.getAdvancePercentageForPlan(slab),
  //   );

  //   return {
  //     baseAmount,
  //     discountAmount,
  //     discountedTotal,
  //     payableAmount,
  //   };
  // }

  isAdvancePaymentPlanSelected(slab: AdvanceDiscountSlab | null): boolean {
    return (
      !!slab &&
      !!this.selectedAdvanceDiscountSlab &&
      Number(slab.advancePercentage) ===
      Number(this.selectedAdvanceDiscountSlab.advancePercentage) &&
      Number(slab.discountPercentage) ===
      Number(this.selectedAdvanceDiscountSlab.discountPercentage)
    );
  }

  getCurrentBookingTotalForAdvancePlan(): number {
    const summaryTotal = Number(this.bookingSummaryDetails?.totalAmount || 0);
    if (!summaryTotal) {
      return Number(this.booking?.totalAmount || 0);
    }

    const totalPlanPrice = Number(this.bookingSummaryDetails?.totalPlanPrice || 0);
    const couponDiscountPercentage = Number(
      this.specialDiscountData?.discountPercentage || 0,
    );
    const discountedPlanPrice =
      totalPlanPrice - (totalPlanPrice * couponDiscountPercentage) / 100;
    const feeBase = this.toSafeAmount(
      this.amountAfterDiscount || (couponDiscountPercentage > 0 ? discountedPlanPrice : totalPlanPrice),
    );
    const convenienceFee =
      this.serviceChargePercentage && Number(this.serviceChargePercentage) > 0
        ? this.calculateConvenienceFee(
          feeBase,
          this.serviceChargePercentage,
        )
        : 0;

    return this.roundToTwo(summaryTotal + Number(convenienceFee || 0));
  }

  // getAdvancePlanGrossAmount(totalAmount?: number): number {
  //   return this.getAdvancePlanCalculation(null, totalAmount).payableAmount;
  // }

  // getAdvancePlanGrossAmountForSlab(
  //   slab: AdvanceDiscountSlab | null,
  //   totalAmount?: number,
  // ): number {
  //   return this.getAdvancePlanCalculation(slab, totalAmount).payableAmount;
  // }

  // getAdvancePlanDiscountAmount(totalAmount?: number): number {
  //   return this.getAdvancePlanCalculation(null, totalAmount).discountAmount;
  // }

  // getAdvancePlanDiscountAmountForSlab(
  //   slab: AdvanceDiscountSlab | null,
  //   totalAmount?: number,
  // ): number {
  //   return this.getAdvancePlanCalculation(slab, totalAmount).discountAmount;
  // }

  // getAdvancePlanTotalAfterDiscount(totalAmount?: number): number {
  //   return this.getAdvancePlanCalculation(null, totalAmount).discountedTotal;
  // }

  // getAdvancePlanTotalAfterDiscountForSlab(
  //   slab: AdvanceDiscountSlab | null,
  //   totalAmount?: number,
  // ): number {
  //   return this.getAdvancePlanCalculation(slab, totalAmount).discountedTotal;
  // }

  // getAdvancePlanPayableAmount(totalAmount?: number): number {
  //   return this.getAdvancePlanCalculation(null, totalAmount).payableAmount;
  // }

  // getAdvancePlanPayableAmountForSlab(
  //   slab: AdvanceDiscountSlab | null,
  //   totalAmount?: number,
  // ): number {
  //   return this.getAdvancePlanCalculation(slab, totalAmount).payableAmount;
  // }

  // private applyAdvancePlanToPayment(payment: Payment): void {
  //   if (!payment) {
  //     return;
  //   }

  //   this.ensureSelectedAdvancePaymentPlan();

  //   const totalAmount = Number(
  //     payment.transactionAmount ||
  //     payment.amount ||
  //     payment.netReceivableAmount ||
  //     this.getCurrentBookingTotalForAdvancePlan(),
  //   );

  //   const payableAdvanceAmount = this.getAdvancePlanPayableAmount(totalAmount);
  //   payment.netReceivableAmount = payableAdvanceAmount;
  //   payment.transactionAmount = payableAdvanceAmount;
  //   payment.amount = payableAdvanceAmount;
  //   payment.transactionChargeAmount = payableAdvanceAmount;
  //   this.booking.advanceAmount = payableAdvanceAmount;
  // }

  // private applyAdvancePlanToEnquiryForm(
  //   enquiryForm: EnquiryDto,
  //   planTotalAmount?: number,
  // ): void {
  //   if (!enquiryForm) {
  //     return;
  //   }

  //   this.ensureSelectedAdvancePaymentPlan();

  //   const totalAmount = Number(
  //     planTotalAmount ?? enquiryForm.totalAmount ?? enquiryForm.payableAmount ?? 0,
  //   );
  //   enquiryForm.advanceAmount = this.getAdvancePlanPayableAmount(totalAmount);
  // // }

  // private applyAdvancePlanToBooking(booking: Booking | any): void {
  //   if (!booking) {
  //     return;
  //   }

  //   this.ensureSelectedAdvancePaymentPlan();

  //   const totalAmount = Number(booking.totalAmount || booking.payableAmount || 0);
  //   booking.advanceAmount = this.getAdvancePlanPayableAmount(totalAmount);
  // }












































  private getPhonePattern(): RegExp {
    return /^[0-9]{6,15}$/;
  }

  private normalizeCountrySearchValue(value: string): string {
    return (value || '')
      .toLowerCase()
      .replace(/zealand/g, 'zeland')
      .replace(/[^a-z0-9]/g, '');
  }

  private findCountry(searchValue: string): CountryListInterFace | undefined {
    if (!searchValue) {
      return undefined;
    }

    const normalizedSearch = this.normalizeCountrySearchValue(searchValue);
    return this.CountryArray?.countries?.find((country) => {
      const normalizedValue = this.normalizeCountrySearchValue(country.value);
      const normalizedViewValue = this.normalizeCountrySearchValue(
        country.viewValue,
      );

      return (
        normalizedValue === normalizedSearch ||
        normalizedViewValue === normalizedSearch ||
        country.countryCode === searchValue
      );
    });
  }

  private getDefaultCountry(): CountryListInterFace {
    const preferredCountry =
      this.propertyData?.address?.country ||
      this.token.getCountry() ||
      this.token.getProperty()?.address?.country ||
      'India';

    return (
      this.findCountry(preferredCountry) ||
      this.findCountry('India') ||
      this.CountryArray.countries[0]
    );
  }

  private initializeCountrySelection(): void {
    this.CountryArray = new CountryList();
    const defaultCountry = this.getDefaultCountry();

    this.selectedCountry = defaultCountry?.value || '';
    this.countryCode = defaultCountry?.countryCode || '';

    if (this.booking?.mobile) {
      this.setMobileNumberByCode(this.booking.mobile);
      return;
    }

    this.syncBookingMobile();
  }

  private syncBookingMobile(): void {
    this.booking.mobile =
      this.phoneWithoutCode && this.countryCode
        ? `${this.countryCode}${this.phoneWithoutCode}`
        : '';
  }

  private extractMatchedCountryFromPhoneNumber(
    phoneNumber: string,
  ): CountryListInterFace | undefined {
    const sanitizedNumber = (phoneNumber || '').trim();
    if (!sanitizedNumber) {
      return undefined;
    }

    const sortedCountries = [...(this.CountryArray?.countries || [])].sort(
      (a, b) => b.countryCode.length - a.countryCode.length,
    );

    return sortedCountries.find((country) => {
      const countryCodeDigits = country.countryCode.replace('+', '');

      return (
        sanitizedNumber.startsWith(country.countryCode) ||
        sanitizedNumber.startsWith(countryCodeDigits)
      );
    });
  }

  private buildFullPhoneNumber(phoneNumber?: string): string {
    const rawNumber = (phoneNumber ?? '').toString().trim();
    if (!rawNumber) {
      return '';
    }

    if (rawNumber.startsWith('+')) {
      return rawNumber;
    }

    const matchedCountry = this.extractMatchedCountryFromPhoneNumber(rawNumber);
    if (matchedCountry) {
      return `+${rawNumber.replace(/^\+/, '')}`;
    }

    const localNumber = rawNumber.replace(/\D/g, '');
    if (!localNumber || !this.countryCode) {
      return '';
    }

    return `${this.countryCode}${localNumber}`;
  }

  private getFullPhoneNumber(): string {
    this.syncBookingMobile();
    return this.booking.mobile || '';
  }

  setCountry(code: string): void {
    const selectedCountry =
      this.findCountry(code) ||
      this.findCountry(this.selectedCountry) ||
      this.getDefaultCountry();

    this.selectedCountry = selectedCountry?.value || '';
    this.countryCode = selectedCountry?.countryCode || '';
    this.syncBookingMobile();

    if (this.phoneWithoutCode) {
      this.validateMobile();
    }
  }

  validateMobile(): void {
    const mobile = (this.phoneWithoutCode || '').trim();
    this.mobileHasError = !(mobile && this.getPhonePattern().test(mobile));
    this.syncBookingMobile();
  }

  validateForm(): boolean {
    const mobile = (this.phoneWithoutCode || '').trim();
    if (mobile != null && mobile !== '') {
      this.mobileHasError = !this.getPhonePattern().test(mobile);
    } else {
      this.mobileHasError = true;
    }

    this.syncBookingMobile();
    return !this.mobileHasError;
  }

  setMobileNumberByCode(phoneNumber: string): void {
    const sanitizedNumber = (phoneNumber || '').toString().trim();
    const defaultCountry = this.getDefaultCountry();

    if (!sanitizedNumber) {
      this.selectedCountry = defaultCountry?.value || '';
      this.countryCode = defaultCountry?.countryCode || '';
      this.phoneWithoutCode = '';
      this.mobileHasError = false;
      this.syncBookingMobile();
      return;
    }

    const matchedCountry = this.extractMatchedCountryFromPhoneNumber(
      sanitizedNumber,
    );

    if (matchedCountry) {
      this.selectedCountry = matchedCountry.value;
      this.countryCode = matchedCountry.countryCode;
      const normalizedNumber = sanitizedNumber.startsWith('+')
        ? sanitizedNumber
        : `+${sanitizedNumber}`;
      this.phoneWithoutCode = normalizedNumber
        .slice(matchedCountry.countryCode.length)
        .replace(/\D/g, '');
    } else {
      this.selectedCountry = defaultCountry?.value || '';
      this.countryCode = defaultCountry?.countryCode || '';
      this.phoneWithoutCode = sanitizedNumber.replace(/\D/g, '');
    }

    this.validateMobile();
  }

  getTotalAmount(plan: any): number {
    const d1 = this.specialDiscountData?.discountPercentage || 0;
    const d2 = this.selectedAdvanceDiscountSlab?.discountPercentage || 0;

    const totalDiscount = Math.min(d1 + d2, 100);

    const discountedPrice =
      plan.price - (plan.price * totalDiscount) / 100;

    const tax = (discountedPrice * plan.taxpercentage) / 100;

    return discountedPrice + tax;
  }

  getPlanAmountAfterDiscount(plan: any): number {
    const price = this.toSafeAmount(plan?.price);
    const couponPercentage = this.toSafePercent(
      this.specialDiscountData?.discountPercentage ??
        this.selectedCouponList?.discountPercentage,
    );
    const advanceDiscountPercentage = this.toSafePercent(
      this.selectedAdvanceDiscountSlab?.discountPercentage,
    );

    const afterCoupon = Math.max(0, price - (price * couponPercentage) / 100);
    const afterAdvanceDiscount = Math.max(
      0,
      afterCoupon - (afterCoupon * advanceDiscountPercentage) / 100,
    );

    return this.toSafeAmount(afterAdvanceDiscount);
  }

  getPlanDiscountAmount(plan: any): number {
    const price = this.toSafeAmount(plan?.price);

    return this.toSafeAmount(price - this.getPlanAmountAfterDiscount(plan));
  }

  getPlanTaxAfterDiscount(plan: any): number {
    const taxPercentage = this.toSafePercent(plan?.taxpercentage);
    const amountAfterDiscount = this.getPlanAmountAfterDiscount(plan);

    return this.toSafeAmount((amountAfterDiscount * taxPercentage) / 100);
  }

  getTotalTax(): number {
    let totalTax = 0;

    this.bookingSummaryDetails?.selectedPlansSummary?.forEach(plan => {
      totalTax += this.getPlanTaxAfterDiscount(plan);

    });

    this.taxOnDiscountedAmount = this.toSafeAmount(totalTax);
    
    return this.taxOnDiscountedAmount;
  }

  /**
   * Calculate what the add-ons tax would be at the same effective rate as room tax.
   * This ensures add-ons are taxed at the same % as the room (e.g. 5%),
   * so the combined "Tax & Services" line in the payment summary is correct.
   */
  getAddOnsTaxAtRoomRate(): number {
    if (!this.amountAfterDiscount || this.amountAfterDiscount === 0 || this.totalAddOnsAmount === 0) {
      return 0;
    }
    const effectiveRate = this.taxOnDiscountedAmount / this.amountAfterDiscount;
    return this.totalAddOnsAmount * effectiveRate;
  }

  /**
   * Phase 4: Initialize Add-ons from sessionStorage   * Retrieves add-ons data that was set by ListingDetailOne component
   * Prepares UI for add-on selection and calculation
   */
  initializeAddOnServices(): void {
    try {
      const addOnsData = sessionStorage.getItem('addOnServices');
      if (addOnsData) {
        this.addOnServices = JSON.parse(addOnsData);
        const persistedSelectedAddOns = this.token.getSelectedServices();
        this.selectedAddOns = Array.isArray(persistedSelectedAddOns)
          ? persistedSelectedAddOns
          : [];
        this.selectedAddOnNames = this.selectedAddOns
          .map((service) => service?.name)
          .filter((name) => !!name);
        this.calculateAddOnsTotals();
        console.log('[DEBUG] Add-ons initialized from sessionStorage:', this.addOnServices);
        this.showAddOnServices = this.addOnServices.length > 0;
      } else {
        console.log('[DEBUG] No add-ons found in sessionStorage');
        this.addOnServices = [];
        this.selectedAddOns = [];
        this.selectedAddOnNames = [];
        this.showAddOnServices = false;
      }
    } catch (error) {
      console.error('[ERROR] Failed to parse add-ons from sessionStorage:', error);
      this.addOnServices = [];
      this.selectedAddOns = [];
      this.selectedAddOnNames = [];
      this.showAddOnServices = false;
    }
  }

  /**
   * Phase 4: Add-on Calculation Methods
   * Independent calculation engine for "Enhance Your Stay" add-ons
   * Tax: 18% (different from room tax 5%)
   * Discount: Optional service discount, separate from coupon/advance
   */

  /**
   * Toggle add-on service selection
   * Adds/removes service from selectedAddOns array
   */
  toggleAddOnSelection(service: any): void {
    const index = this.selectedAddOns.findIndex(s => s.id === service.id);
    if (index > -1) {
      // Remove from selection
      this.selectedAddOns.splice(index, 1);
      const nameIndex = this.selectedAddOnNames.findIndex(n => n === service.name);
      if (nameIndex > -1) {
        this.selectedAddOnNames.splice(nameIndex, 1);
      }
    } else {
      // Add to selection
      this.selectedAddOns.push(service);
      this.selectedAddOnNames.push(service.name);
    }
    // Recalculate totals on selection change
    this.calculateAddOnsTotals();
    this.syncSelectedAddOnsToCheckoutState();
  }

  /**
   * Check if service is currently selected
   */
  isAddOnSelected(service: any): boolean {
    return this.selectedAddOns.some(s => s.id === service.id);
  }

  /**
   * Get array of selected add-on services
   */
  getSelectedAddOns(): any[] {
    return this.selectedAddOns;
  }

  /**
   * Calculate add-ons subtotal (before tax and discount)
   * Sum of all selected service prices
   */
  calculateTotalAddOnsAmount(): number {
    return this.selectedAddOns.reduce((total, service) => {
      return total + (Number(service.servicePrice) || 0);
    }, 0);
  }

  /**
   * Calculate add-ons tax at 18% rate
   * Tax applied AFTER discount (if any)
   */
  calculateAddOnsTax(): number {
    // First subtract discount from subtotal
    const subtotalAfterDiscount = this.calculateTotalAddOnsAmount() - this.totalAddOnsDiscount;
    // Then apply 18% tax
    return (subtotalAfterDiscount * this.addOnsTaxPercentage) / 100;
  }

  /**
   * Calculate add-ons discount (if service-level discount configured)
   * Discount is optional and separate from coupon/advance
   */
  calculateAddOnsDiscount(): number {
    if (this.addOnsDiscountPercentage <= 0) {
      return 0;
    }
    const subtotal = this.calculateTotalAddOnsAmount();
    return (subtotal * this.addOnsDiscountPercentage) / 100;
  }

  /**
   * Calculate all add-ons totals at once
   * Called whenever selection changes or discount config changes
   */
  calculateAddOnsTotals(): void {
    this.totalAddOnsAmount = this.calculateTotalAddOnsAmount();
    this.totalAddOnsDiscount = this.calculateAddOnsDiscount();
    this.totalAddOnsTax = this.calculateAddOnsTax();
  }

  /**
   * Get add-ons grand total (subtotal - discount + tax)
   * Ready to add to room total for final payment
   */
  getAddOnsGrandTotal(): number {
    return this.totalAddOnsAmount - this.totalAddOnsDiscount + this.totalAddOnsTax;
  }

  /**
   * Get final grand total: room total + add-ons total + convenience fee
   * This is the amount user pays at checkout
   */
  getGrandTotalWithAddOns(): number {
    let roomTotal = 0;

    // Calculate room total from all selected plans
    if (this.bookingSummaryDetails?.selectedPlansSummary?.length > 0) {
      roomTotal = this.bookingSummaryDetails.selectedPlansSummary.reduce((total, plan) => {
        return total + this.getTotalAmount(plan);
      }, 0);
    }

    // Get add-ons total
    const addOnsTotal = this.getAddOnsGrandTotal();

    // Convenience fee (if applicable, configured separately)
    const convenienceFee = this.bookingSummaryDetails?.convenienceFeeAmount || 0;

    return roomTotal + addOnsTotal + convenienceFee;
  }

  /**
   * Clear all add-on selections
   * Reset arrays and recalculate totals
   */
  clearAddOnSelections(): void {
    this.selectedAddOns = [];
    this.selectedAddOnNames = [];
    this.calculateAddOnsTotals();
    this.syncSelectedAddOnsToCheckoutState();
  }

  private syncSelectedAddOnsToCheckoutState(): void {
    const normalizedAddOns = (this.selectedAddOns || []).map((service) => ({
      ...service,
      quantity: service?.quantity ?? service?.count ?? 1,
      count: service?.count ?? service?.quantity ?? 1,
      afterTaxAmount:
        service?.afterTaxAmount ??
        ((Number(service?.servicePrice) || 0) + (Number(service?.taxAmount) || 0)),
      netAmount: service?.netAmount ?? service?.servicePrice ?? 0,
      servicePrice: service?.servicePrice ?? service?.beforeTaxAmount ?? 0,
      sourceChannel: service?.sourceChannel ?? this.booking?.externalSite ?? 'BookMax',
    }));

    this.token.saveSelectedServices(normalizedAddOns);
    sessionStorage.setItem('addOnServices', JSON.stringify(normalizedAddOns));
  }

  /**
   * Phase 4: Add-on Calculation Methods (END)
   */

  // ── Section 2: Add-On Services table helpers ──────────────────────────────

  /** Sum of servicePrice for all selected add-ons (before tax) */
  getServicesSubtotal(): number {
    return (this.selectedAddOns || []).reduce((sum, addon) => sum + (Number(addon.servicePrice) || 0), 0);
  }

  /** Sum of taxAmount for all selected add-ons */
  getServicesTax(): number {
    return (this.selectedAddOns || []).reduce((sum, addon) => sum + (Number(addon.taxAmount) || 0), 0);
  }

  /** Grand total for selected add-ons (servicePrice + taxAmount per addon) */
  getServicesTotal(): number {
    return (this.selectedAddOns || []).reduce(
      (sum, addon) => sum + (Number(addon.servicePrice) || 0) + (Number(addon.taxAmount) || 0), 0
    );
  }

  getDisplayedConvenienceFeeAmount(): number {
    const discountedAmount = this.toSafeAmount(this.amountAfterDiscount);
    const feePercent = this.toSafePercent(this.serviceChargePercentage);

    if (discountedAmount > 0 && feePercent > 0) {
      return this.toSafeAmount(
        this.calculateConvenienceFee(discountedAmount, feePercent),
      );
    }

    return this.toSafeAmount(this.convenienceFeeAmount || 0);
  }

  // ── Section 3: Order Summary helpers ─────────────────────────────────────

  /** Grand Total = rooms after discounts + room tax + services (full) + convenience fee */
  getNewGrandTotal(): number {
    return (this.amountAfterDiscount || 0)
      + this.getTotalTax()
      + this.getServicesTotal()
      + this.getDisplayedConvenienceFeeAmount();
  }

  /**
   * Pay Now = advance% of (rooms after all discounts + room tax)
   *         + services total in full (add-ons always paid completely now)
   *         + convenience fee in full
   */
  getNewPayNowAmount(): number {
    if (!this.selectedAdvanceDiscountSlab) { return this.getNewGrandTotal(); }
    const advancePct = this.toSafePercent(this.selectedAdvanceDiscountSlab.advancePercentage) / 100;
    const roomsWithTax = (this.amountAfterDiscount || 0) + (this.taxOnDiscountedAmount || 0);
    return (roomsWithTax * advancePct) + this.getServicesTotal() + this.getDisplayedConvenienceFeeAmount();
  }

  /** Balance at Check-in = remaining room portion (after advance %) */
  getNewBalanceAtCheckIn(): number {
    if (!this.selectedAdvanceDiscountSlab) { return 0; }
    const advancePct = this.toSafePercent(this.selectedAdvanceDiscountSlab.advancePercentage) / 100;
    const roomsWithTax = (this.amountAfterDiscount || 0) + (this.taxOnDiscountedAmount || 0);
    return roomsWithTax * (1 - advancePct);
  }

  private applyAuthoritativeGatewayAmounts(
    payment: Payment,
    source: string,
  ): void {
    const grandTotal = this.toSafeAmount(this.getNewGrandTotal());
    const payNowAmount = this.toSafeAmount(this.getNewPayNowAmount());
    const roomTaxTotal = this.toSafeAmount(this.getTotalTax());
    const advancePct = this.selectedAdvanceDiscountSlab
      ? this.toSafePercent(this.selectedAdvanceDiscountSlab.advancePercentage) / 100
      : 1;
    const payableRoomTax = this.toSafeAmount(roomTaxTotal * advancePct);
    const balanceAtCheckIn = this.toSafeAmount(
      Math.max(0, grandTotal - payNowAmount),
    );

    payment.taxAmount = payableRoomTax;
    payment.netReceivableAmount = payNowAmount;
    payment.transactionAmount = payNowAmount;
    payment.amount = payNowAmount;
    payment.transactionChargeAmount = payNowAmount;

    this.booking.taxAmount = roomTaxTotal;
    this.booking.gstAmount = roomTaxTotal;
    this.booking.totalAmount = grandTotal;
    this.booking.payableAmount = grandTotal;
    this.booking.advanceAmount = payNowAmount;
    this.booking.outstandingAmount = balanceAtCheckIn;

    this.logCalculationSnapshot('gateway-amount-sync', {
      source,
      roomTaxTotal,
      payableRoomTax,
      grandTotal,
      payNowAmount,
      balanceAtCheckIn,
    });
  }

}


