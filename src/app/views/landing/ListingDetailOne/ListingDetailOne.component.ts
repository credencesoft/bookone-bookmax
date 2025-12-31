// import { RatesAndAvailability } from './../../model/ratesAndAvailability';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, isPlatformBrowser, Location, ViewportScroller } from '@angular/common';
import { Booking } from 'src/app/model/booking';
import { BusinessServiceDtoList } from 'src/app/model/businessServiceDtoList';
import { DateModel } from 'src/app/model/dateModel';
import { GoogleReview } from 'src/app/model/googleReview';
import { Review } from 'src/app/model/review';
import { Room } from 'src/app/model/room';
// import { Slots } from 'src/app/model/slots';
// import { BusinessUser } from "src/app/model/user";
// import { BusinessService } from 'src/app/services/business.service';
// import { DateService } from 'src/app/services/date-service.service';
// import { HotelBookingService } from 'src/app/services/hotel-booking.service';
// import { ListingService } from 'src/app/services/listing.service';
// import { Logger } from 'src/app/services/logger.service';
// import { ReviewService } from 'src/app/services/review.service';
// import { TokenStorage } from 'src/app/token.storage';
// import { Details } from '../ListWithSidebar/ListWithSidebar.component';

import { RoomRatePlans } from 'src/app/model/roomRatePlans';
import { DomSanitizer, Meta, SafeUrl, Title } from '@angular/platform-browser';
// import { TriggerEventService } from 'src/app/services/trigger-event.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { API_URL_NZ } from 'src/app/app.component';
import { ScrollBar } from '@ng-bootstrap/ng-bootstrap/util/scrollbar';
// import { ScrollDirective } from '../scroll.directive';
// import { BlogPostService } from 'src/app/services/blog-post.service';
import { Observable } from 'rxjs';
// import { forEach } from 'cypress/types/lodash';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';
import { HotelBookingService, RecommendationPayload } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { ReviewService } from 'src/services/review.service';
import { BlogPostService } from 'src/services/blog-post.service';
import { Logger } from 'src/services/logger.service';
import { TokenStorage } from 'src/token.storage';
import { Details } from 'src/app/model/detail';
import { TriggerEventService } from 'src/services/trigger-event.service';
import { BusinessService } from 'src/services/business.service';
import { BusinessUser } from 'src/app/model/user';
import { RatesAndAvailability } from 'src/app/model/ratesAndAvailability';
import { SchemaService } from 'src/services/schema.service';
// import { Email } from "src/app/pages/Contact/Contact.component";
declare var $: any;
export interface Email {
  fromEmail: string;
  toEmail: string;
  subject: string;
  propertyName: string;
  message: string;
}

interface RoomOne {
  adults: number;
  children: number;
}

@Component({
  selector: 'list-detail-one',
  templateUrl: './ListingDetailOne.component.html',
  styleUrls: ['./ListingDetailOne.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListingDetailOneComponent implements OnInit {
  isLoadingProperty : boolean;
  roomLowestPrices: { [roomId: string]: number | null } = {};
  roomLowestPricesBookingEngine: { [roomId: string]: number | null } = {};
  additionalRooms: RoomOne[] = [];
  @ViewChild('accmd') accmdSection!: ElementRef;
  expandedReviews: { [key: number]: boolean } = {};
  reviews = [
    {
      stars: 5,
      text: 'Cleanliness is a top priority here. The view from my window was simply breathtaking, especially at sunrise.',
      name: 'Alex',
    },
    {
      stars: 4,
      text: 'I felt genuinely pampered throughout. It’s rare to experience this level of attention and care.',
      name: 'Jane',
    },
    {
      stars: 4,
      text: "The room was clean and comfy, but the service could've been a bit quicker.",
      name: 'Doe Guest',
    },
    {
      stars: 5,
      text: 'Amazing hospitality! The staff made me feel right at home from the moment I arrived.',
      name: 'Guest Alex',
    },
    {
      stars: 5,
      text: 'Everything from check-in to check-out was seamless. Highly recommended!',
      name: 'Emma Guest',
    },
  ];

  scrollAmount = 250;

  // @Output() bookNowClicked = new EventEmitter<void>();
  showFullDescription: boolean[] = [];
  hasServiceWithPrice: boolean = false;
  showListingDetails: boolean = false;
  website: string;
  currentUrl: string;
  propertyusername: string;
  websiteUrlBookingEngine: boolean;
  viewAddon: boolean;
  noofRoomsAvailable: any[] = [];
  valueAvailable: any;
  getValueOfRooms: RatesAndAvailability;
  allSavedService: any;
  selectedServicesOne: any;
  checkAvailabilityDisabled: boolean;
  Googlehotelsortrooms: any[];
  ghcOverrideClicked: boolean = false;
  totalAmountPrice: string;
  allTaxAmount: boolean = false;
  bookingPrice: string;
  daterangefilterSeo: string[] = [];
  planWithDateArray: any;
  planPriceSeo: any;
  diffAmount: number;
  activeGoogleHotelCenter: string;
  googleUrlToken: this;
  allTaxAmountPrice: any;
  sortedRoomsLimit: any[] = [];
  taxAmount: any;
  landingrice: number;
  isPopupOpen: boolean = false;
  enteredCoupon: any;
  isValidPrivateCoupon: boolean;
  validCoupon: ' ';
  validCouponCode: string = '';
  privateOffers2: any[];
  privateOffersMinimumAmount: any;
    singleextraChild: number = 0;
  singleextraAdults: number = 0;
  privatePromotionData: any;
  isCardVisible: boolean;
  couponApplied: boolean;
  couponSuccessApplied: boolean = false;
  showSuccessContent: boolean = false;
  isAfterCheckAvilability: boolean;
  primaryColorProperty: any;
  privateCouponPresent: any[];
  phoneNumberBookingEngine: string;
  roomPricePerPlan: any;
  actualroompriceCharge: any;
  extraAdultCharge: number;
  extraChildrenCharge: number;
  extraAdultCount: number;
  extraChildCount: number;
showBookingSummary: boolean = false;
  soldOutRooms: any;
  paramsroomId: any;
  specialDiscountPercentage: any;
  specialDiscountData: any;
  smartLoading: boolean = true;
  categories: { key: string, label: string }[] = [];
currentPage = 0; // page index
  successMessagewhatsapp: string;
  errorMessagewhatsapp: string;
  errorMessagePrivate: string;
  smartRecommendationsBoolean: any;
  taxTotalSingle: number;
  utmMedium: any;
  utmSource: any;
  priceingO: any;
  propertyById: number;
  serviceChargePercentage: any;
  toggleListingDetails() {
    this.showListingDetails = !this.showListingDetails;
  }
  // isPopupVisible = true; // Initially show the popup

  lat = 0;
  lng = 0;
  staticAlertClosed: true;
  error = null;
  showDiv = false;
  name: string;
  phone: string;
  fromEmail: string;
  email: Email;
  adultno: any;
  dynamicCity: string;
  dynamicStreetName: string;
  dynamicLocality: string;
  propertyServiceListData: any[] = [];
  propertyServiceListDataOne: any[] = [];
  savedServices: any[] = [];
  otaNames: string[] = [];
  dynamicCountryName: string;
  dynamicStreetNumber: string;
  description: string;
  ogDescription: string;
  subject = 'Hotel details page Enquiry';
  propertyname: string;
  message: string;
  serviceName: string;
  subscriptions: string[];
  successMessage: boolean = false;
  datewisePriceMap: { [key: string]: number[] } = {};
  div: boolean = true;
  childno: any;
  viewMore: boolean = false;
  success: any = null;
  selectedRoomIndex: number | null = null; // Initially no room selected
  viewMoreOne = false;
  SubAvailableRooms: Room[];

  subjectControl: FormControl = new FormControl();
  nameControl: FormControl = new FormControl([Validators.required]);
  fromEmailControl: FormControl = new FormControl([
    Validators.required,
    Validators.pattern[
      "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/"
    ],
  ]);
  phoneControl: FormControl = new FormControl([
    Validators.required,
    Validators.pattern[
      '+(9[976]d|8[987530]d|6[987]d|5[90]d|42d|3[875]d|2[98654321]d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)d{1,14}$'
    ],
  ]);
  messageControl: FormControl = new FormControl();
  propertyControl: FormControl = new FormControl();
  otaPlans: { otaName: string; price: number }[] = [];

  emailSuccess: Boolean;

  form = new FormGroup({
    subject: this.subjectControl,
    name: this.nameControl,
    fromEmail: this.fromEmailControl,
    propertyname: this.propertyControl,
    phone: this.phoneControl,
    message: this.messageControl,
  });
  currency: string;
  model: NgbDateStruct;
  businessServices: BusinessServiceDtoList[];
  businessService: BusinessServiceDtoList;

  businessServiceDto: BusinessServiceDtoList;
  // showHide:boolean=true
  branchList: any;
  oneDayTrip: boolean = false;
  selectBooking: boolean = true;
  plans: any[] = [];

  businessTypeName: string;

  selectHotelBooking = false;
  availability: boolean;
  otaAvailableRooms: number;
  planDetails: RoomRatePlans;
  countryBase: string = environment.country;
  parentOrganisationId = environment.parentOrganisationId;
  propertyDetails: any = {
    address: '',
  };
  businessUser: BusinessUser;

  data: any = [];
  details: Details;
  selectedServiceName: string;
  selectedIndex: number = -1;

  serviceString: any;
  loader: boolean;

  serviceSelected: any;
  ghcPlanCode: string | null = null;
  prepareDay = 0;
  prepareHour = 0;
  prepareMinute = 0;

  leadMaxDay = 0;
  leadMaxMin = 0;
  leadMaxHour = 0;

  ngbDate: NgbDateStruct;
  enabledDates: NgbDateStruct[];

  roomsone: Room[];
  availableRooms: Room[];
  shortrooms: Room[];
  roomWithGHCPlan: Room[];
  facilities: BusinessUser[];
  roomAvailability = false;
  dayOneTrip: boolean;
  dateModel: DateModel;

  daySelected: string;
  yearSelected: string;
  monthSelected: number;

  daySelected2: string;
  yearSelected2: string;
  monthSelected2: number;

  currentDay: string;

  monthArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  dateSelected = false;
  locationSelected = false;
  resourceSelected = false;
promoSelected = false;
  places: any = [
    {
      image: 'media-be/images/most-img-4.jpg',
    },
  ];

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  todayDate: NgbDate | null;

  oneDayFromDate: NgbDate | null;
  oneDayToDate: NgbDate | null;
  dateFromDate: string;
  dateToDate: string;
  booking: Booking;
  loaderHotelBooking = false;
  allPalnPrice: boolean;
  checkAvailabilityStatusHide = true;
  selectedRoomName =
    'Not Selected, Please choose a room type from `Rooms` menu';
  checkAvailabilityStatus = false;
  checkAvailabilityStatusName: string;
  selectedRoomMaximumOccupancy: number;
  selectedRoomAvailableNumber: number;
  slotSelected: any;
  resourceSelectedList: any[];
  isWorkingTime: boolean = true;
  taxPercentage: number;
  isReviewFound: boolean = false;
  googleReviews: GoogleReview[];
  rate: number;
  slortResource: any;
  // slotSelected2: Slots;
  // title = 'Angular Project Training';
  slotCount = 0;
  bookingTimeListLength: any[];
  availabilityNumber = 0;
  offersList: any[] = [];
  showAlert = false;
  alertType: string;
  isSuccess: boolean;
  headerTitle: string;
  bodyMessage: string;
  hasPlan = false;
  customerReviews: Review[];
  sideMinderUrl: string;
  isCustomerReviewFound = false;
  currentRate = 4.54;
  planpropertyServiceList: any[] = [];
  showDescription: boolean = false;
  taxArraySeo: any[];
  closeResult = '';
  modalImage = '';
  modalTitle = '';
  modalData: Room;
  roomsAndOccupancy = false;
  bookingCity: string;
  adults = 1;
  children = 0;
  rooms = 1;
  noOfrooms = 1;
  DiffDate;
  enddate;
  startDate;
  viewMoreRoomState: { [roomName: string]: boolean } = {};
  slideConfig = {
    centerMode: true,
    centerPadding: '20%',
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,

    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '15%',
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
          arrows: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
          arrows: true,
        },
      },
    ],
  };
  slideConfig2 = {
    centerMode: true,
    centerPadding: '0%',
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,

    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0%',
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
          arrows: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };
  slideConfigOne = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };
  roomCarouselConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };
  modalSlideConfig = {
    centerMode: true,
    centerPadding: '0%',
    slidesToShow: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0%',
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
        },
      },
    ],
  };
  modalSlideConfig12 = {
    centerMode: true,
    centerPadding: '0%',
    slidesToShow: 1,
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0%',
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
        },
      },
    ],
  };
  modalSlideConfig1 = {
    centerMode: false,
    centerPadding: '0%',
    slidesToShow: 2,
    margin: 10,
    dots: false,
    initialSlide: 0,
    // autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0',
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 2,
        },
      },
    ],
  };
  modalSlideConfig156 = {
    centerMode: false,
    centerPadding: '0%',
    slidesToShow: 2,

    dots: false,
    initialSlide: 0,
    // autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0',
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '10',
          slidesToShow: 2,
        },
      },
    ],
  };
  modalSlideConfig2 = {
    centerMode: true,
    centerPadding: '0%',
    slidesToShow: 4,
    dots: true,
    autoplay: true,

    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0%',
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
        },
      },
    ],
  };
  modalSlideConfig3 = {
    centerMode: true,
    centerPadding: '0%',
    slidesToShow: 4,
    dots: false,
    autoplay: true,

    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          centerPadding: '0%',
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
        },
      },
    ],
  };
  bar: string;
  pub: string;
  swimming: string;
  serviceDto: PropertyServiceDTO;
  pet: string;
  ac: string;
  wifi: string;
  tv: string;
  blogPost: any[] = [];
  isReadMore: boolean[] = [];
  bookingMinDate: NgbDate | null;
  bookingMaxDate: NgbDate | null;
  planSelected = false;
  planAmount = 0;
  extraPersonRate = 0;
  maxSelectRoom = 1;
  maxOccupancy = 2;
  MinOccupancy = 1;
  bookingRoomPrice: number;
  totalBeforeTaxAmount: number = 0;
  PlanRoomPrice: number;
  accommodationData: any[] = [];
  restaurantData: any[] = [];
  planObj: any;
  city: string;
  trustedURL: SafeUrl;
  dangerousUrl: string;
  logoUrl: string;
  property: BusinessUser;
  urlLocation: boolean;
  isHotelMate: boolean = true;
  showAll: boolean = false;
showMoreAddons: boolean = false;
selectedAddonNames: string[] = [];
  checkinDay: number;
  propertyDetail: any;
  checkinMonth: number;
  dynamicText: string; // Dynamic text variable
  checkinYear: number;
  nights: number;
  hotelID: number;
  policies = [];
  propertyId: any;
  breakfast: PropertyServiceDTO;
  addServiceList: PropertyServiceDTO[] = [];
  laundry: PropertyServiceDTO;
  totalExtraAmount: number = 0;
  totalTaxAmount: number = 0;
  pickup: PropertyServiceDTO;
  checkout: PropertyServiceDTO;
  dropoff: PropertyServiceDTO;
  lunch: PropertyServiceDTO;
  dinner: PropertyServiceDTO;
  bld: PropertyServiceDTO;
  distance: PropertyServiceDTO;
  isRestaurant: PropertyServiceDTO;
  DistanceRailway: PropertyServiceDTO;
  isDistanceBusStop: PropertyServiceDTO;
  isDistanceTouristPlace: PropertyServiceDTO;
  counterb = 0;
  counterl = 0;
  counterd = 0;
  breakfastservice: any;
  planPrice: any;
  minDateForCheckIn: NgbDate;
  minDateForCheckOut: NgbDate;
  totalplanPrice: any;
  lunchservice: any;
  propertyData: BusinessUser;
  bookingengineurl: string;
  value: any;
  dinnerservice: any;
  activeForGoogleHotelCenter: boolean = false;
  isDiabled: boolean;
  showStaticContent: boolean = false;
  daterange: any;
  daterangefilter: any;
  isHeaderVisible: boolean = false;
  socialmedialist: any;
  sortedRooms: any[] = [];
  sortedRoomsOne: any[] = [];
  isExpanded: boolean = false;
  showFullDescriptionOne: boolean = false;
  selectedServices: any[] = [];
  valSelected: boolean = false;
  showCarousel = false;
  showRoomCarousel = false;
  isLoading = true;
  showHideFlag: boolean = false;
  @ViewChild('scrollContainer', { read: ElementRef })
  scrollContainer!: ElementRef;
  @ViewChild('scrollContainerOne', { read: ElementRef })
  scrollContainerOne!: ElementRef;
  @ViewChild('scrollContainerThree', { read: ElementRef })
  scrollContainerThree!: ElementRef;
  @ViewChild('scrollContainerFour', { read: ElementRef })
  scrollContainerFour!: ElementRef;
  @ViewChild('ScrollingOne', { read: ElementRef }) ScrollingOne!: ElementRef;
  @ViewChild('ScrollingTwo', { read: ElementRef }) ScrollingTwo!: ElementRef;
  slickConfigTen = {
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  selectedPromotion: boolean = false;
  selectedPromotionCouponData: any;
  roomOccupancy: number;
  showError: boolean = false;
  errorMessage: string;
  totalAmount: any;
  totalAmountParam: any;
  taxAmountParam: any;
  googleUrl: string;
  extraPersonChargee: any;
  extraChildChargee: any;
  taxArray: any[];
  allExtraPersonCharge: any;
  allExtraChildCharge: number;
  successMessagePrivate = ' ';
  nearbyPlaces = [
    {
      name: 'Shree Mandir',
      image: 'https://sannidhi.net/wp-content/uploads/2024/01/jagannath1.png',
    },
    {
      name: 'Sea Beach',
      image:
        'https://odishatourism.gov.in/content/dam/tourism/home/discover/attractions/beaches/puri/puri%20corosal2.jpg',
    },
    {
      name: 'Konark Temple',
      image:
        'https://media.istockphoto.com/id/1444924249/photo/konark-sun-temple-at-sunrise-konark-temple-is-a-unesco-world-heritage-site-at-puri-odisha.jpg?s=612x612&w=0&k=20&c=5Gd3UDpZeYh8DejD4a4TTrpAZLoPw5SARAUFT7hfwRk=',
    },
    {
      name: 'Shanti Stupa',
      image:
        'https://plus.unsplash.com/premium_photo-1661949303004-bab6b7a82912?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hhbnRpJTIwc3R1cGF8ZW58MHx8MHx8fDA%3D',
    },
    { name: 'Satapada', image: 'https://www.chilika.com/images/satapada.jpg' },
    {
      name: 'Museum',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq5ht2y_pv9oUiiCVWOzRsWfEUxHz1hiBdeQ&s',
    },
    {
      name: 'Lingaraj Temple',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQd1m_VVctuhzkUI4yhf7Tu65_WNYNQd85TA&s',
    },
    {
      name: 'Udayagiri',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/7/72/Khandagari_and_Udaygiri_featured_image.jpg',
    },
    {
      name: 'Nandankanan',
      image:
        'https://i.ytimg.com/vi/Y7o377iuIxs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLACTvvXv00c7JJxh3aluGtxnsO8eg',
    },
  ];
  dates: Date[] | undefined;
  blogPosts$: Observable<any> | undefined;
  responsiveOptions: any[];
  popupTimeout: any;
  selectedRoomsByPlan: { [planCode: string]: number } = {};
  selectedGuestsByPlan: {
    [planCode: string]: { adults: number; children: number };
  } = {};
  selectedPlansSummary: any[] = [];
  activeImageIndex: number = 0;

  @ViewChild('galleryModalRef') galleryModalRef!: ElementRef;
  @ViewChild('carouselModalRef') carouselModalRef!: ElementRef;
  isPanelOpen = false;
  selectedRoom: any = null;
  products: [] | undefined;
  selectedFacilityNames: string[] = [];
  showGallery = false;
  sliderPopupVisible = false;
guestSelectionErrors: { [planCode: string]: string } = {};
isPanelOpenOne = false;
  isOpen = false;
childAgesByPlan: { [planCode: string]: (number | null)[] } = {};
ageOptions = Array.from({ length: 17 }, (_, i) => i + 1);
  singleextraAdultCount: number;
  singleextraAdultCharge: number;
  singleextraChildCount: number;
  singleextraChildrenCharge: number;
guestDataArray: Array<{
  planCode: string;
  planName: string;
  adults: number;
  children: number;
  childAges: number[];
  roomCount: number;
}> = [];
  smartRecommendations: any = {
    bestFitOptions: [],
    luxuryOptions: [],
    comfortOptions: [],
    budgetOptions: []
  };

  pageIndex = 0;   // current "page"
  pageSize = 2;    // show 2 at a time
  showWhatsappPopup = false;
  whatsappNumber = '';
  isLoadingWhatsapp: boolean = false;
    checkinDate: string;
  checkoutDate: string;
  channelManagerIntegration: boolean = false;
  instantBooking: boolean = false;
  constructor(
    private listingService: ListingService,
    public SchemaService:SchemaService,
    private reviewService: ReviewService,
    private contentfulService: BlogPostService,
    private hotelBookingService: HotelBookingService,
    private offerService: BusinessService,
    private changeDetectorRefs: ChangeDetectorRef,
    private acRoute: ActivatedRoute,
    // private meta:Meta,
    private triggerEventService: TriggerEventService,
    private router: Router,
    private locationBack: Location,
    private calendar: NgbCalendar,

    private http: HttpClient,
    private routerone: ActivatedRoute,
    // private businessService1:BusinessService,
    // private businessService:BusinessService,
    // private scroll:ScrollDirective,
    public formatter: NgbDateParserFormatter,
    private token: TokenStorage,
    private modalService: NgbModal,
    private titleService: Title,
    private metaService: Meta,
    private sanitizer: DomSanitizer,
    private viewportScroller: ViewportScroller,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
        this.acRoute.queryParams.subscribe((params) => {
      if (params['hotelID'] !== undefined) {
        this.hotelID = params['hotelID'];
      }

      if (params['checkinDay'] !== undefined) {
        this.checkinDay = params['checkinDay'];
      }

      if (params['checkinMonth'] !== undefined) {
        this.checkinMonth = params['checkinMonth'];
      }

      if (params['checkinYear'] !== undefined) {
        this.checkinYear = params['checkinYear'];
      }


      if (params['nights'] !== undefined) {
  this.nights = Number(params['nights']);
}

if (params['numGuests'] !== undefined) {
  this.adultno = Number(params['numGuests']);
}

if (params['numAdults'] !== undefined) {
  this.adults = Number(params['numAdults']);
}

if (params['roomId'] !== undefined) {
  this.paramsroomId = Number(params['roomId']);
}

if (params['Children'] !== undefined) {
  this.childno = Number(params['Children']);
  this.children = Number(params['Children']);
}
      if (params['userCurrency'] !== undefined) {
        this.currency = params['userCurrency'];
      }

      if (params['taxAmount'] !== undefined) {
        this.taxAmountParam = params['taxAmount'];
      }

      if (params['totalAmount'] !== undefined) {
        this.totalAmountParam = params['totalAmount'];
      }
      if (this.hotelID != null && this.hotelID != undefined) {
        this.getPropertyDetailsById(this.hotelID);
        this.personChange();
      }
      if (this.checkinDay && this.checkinMonth && this.checkinYear) {
  const year = Number(this.checkinYear);
  const month = Number(this.checkinMonth);
  const day = Number(this.checkinDay);
  const nights = Number(this.nights);

  // ✅ checkin date
  this.checkinDate = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`;
  console.log('Check-in Date:', this.checkinDate);

  // ✅ checkout date
  if (nights) {
    const checkin = new Date(year, month - 1, day);
    checkin.setDate(checkin.getDate() + nights);
    this.checkoutDate = `${checkin.getFullYear()}-${('0' + (checkin.getMonth() + 1)).slice(-2)}-${('0' + checkin.getDate()).slice(-2)}`;
  }
}
           if (params['bookingEngine'] !== undefined) {
        this.urlLocation = params['bookingEngine'];
        let websitebookingURL = 'true';
        this.websiteUrlBookingEngine = true;
        this.token.savewebsitebookingURL(websitebookingURL);

      }
        if (params['bookingEngine'] === undefined) {
                  sessionStorage.removeItem('BookingEngine');
        }

      this.landingrice = Number(
        (this.totalAmountParam - this.taxAmountParam).toFixed(2)
      );
      this.token.saveLandingPrice(this.landingrice);

      if (!params['hotelID'] && !params['BookingEngine']) {
        this.getDynamicNameFromUrl(this.currentUrl);
      }
              if (params['utm_medium'] !== undefined) {
        this.utmMedium = params['utm_medium'];
        sessionStorage.setItem('utm_medium', this.utmMedium);
      } else {
        sessionStorage.removeItem('utm_medium');
      }


      if (params['utm_source'] !== undefined && params['utm_source'] != '') {
        this.utmSource = params['utm_source'];
        sessionStorage.setItem('utm_source', this.utmSource);
      } else {
        sessionStorage.removeItem('utm_source');
      }
    });
    const today = new Date();
    this.minDateForCheckIn = new NgbDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    // this.checkAvailabilityDisabled = true;
    let currenturl = window.location.href;
    let flag = currenturl.includes('bookingEngine');
    this.token.savePropertyUrl(currenturl);
    this.serviceDto = new PropertyServiceDTO();
    this.businessServiceDto = new BusinessServiceDtoList();
    this.businessService = new BusinessServiceDtoList();
    this.businessUser = new BusinessUser();
    this.addServiceList = [];
    this.booking = new Booking();
    this.details = new Details();
    // this.updateTag();
    this.token.clearwebsitebookingURL();
    // this.token.saveSelectedServices(this.selectedServices);
    const savedRooms = sessionStorage.getItem('bookingSummary');
  if (savedRooms) {
    try {
      this.additionalRooms = JSON.parse(savedRooms);
    } catch (e) {
      console.error('Invalid bookingSummary data', e);
      this.additionalRooms = [];
    }
  }
    this.bookingMinDate = calendar.getToday();
    this.bookingengineurl = this.token.getwebsitebookingURL();
    sessionStorage.removeItem('enquiryNo');
    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('EnquiryResponseList');

    this.selectedServicesOne = this.token?.getSelectedServices();
    setTimeout(() => {
      if (this.activeForGoogleHotelCenter == true) {
        this.fetchAndProcessRoomsDataOne();
      } else if (this.activeForGoogleHotelCenter == false) {
        this.fetchAndProcessRoomsData();
      }
    }, 3000);
    this.token.saveBookingEngineBoolean('normalUrl');

    this.selectedServices = [];
    this.oneDayFromDate = calendar.getToday();
    this.triggerEventService.events$.forEach((event) =>
      console.log(this.publishPage(event))
    );
    if (this.token.getBookingCity() !== null) {
      if (
        this.token.getBookingCity() != null &&
        this.token.getBookingCity() != undefined
      ) {
        this.propertyId = this.token.getBookingCity();
      }
      if (this.hotelID != null && this.hotelID != undefined) {
        this.propertyId = this.hotelID;
      }
       if(this.checkinDay && this.checkinMonth && this.checkinYear) {
                  let dateString =
          this.checkinYear + '-' + this.checkinMonth + '-' + this.checkinDay;
        let checkedinday = new Date(dateString);

        let checkedOutday = new Date(checkedinday);
        let day = Number(checkedOutday.getDate()) + Number(this.nights);
        checkedOutday.setDate(day);
            this.booking.fromDate = this.getDateFormatYearMonthDay(
          checkedinday.getDate(),
          checkedinday.getMonth() + 1,
          checkedinday.getFullYear()
        );
        this.fromDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.fromDate).year,
        this.mileSecondToNGBDate(this.booking.fromDate).month,
        this.mileSecondToNGBDate(this.booking.fromDate).day
      );
        this.booking.toDate = this.getDateFormatYearMonthDay(
          checkedOutday.getDate(),
          checkedOutday.getMonth() + 1,
          checkedOutday.getFullYear()
        );

        this.toDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.toDate).year,
        this.mileSecondToNGBDate(this.booking.toDate).month,
        this.mileSecondToNGBDate(this.booking.toDate).day
      );

    } else {
            this.fromDate = this.calendar.getToday();
      this.todayDate = calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    }

      this.selectedServices = [];
           if ( this.adults == null && this.adults == undefined ) {
          this.adults = 1
        }
        if (this.childno == null && this.childno == undefined) {
          this.children = 0;
        } else {
          this.children = Number(this.childno);
        }

      this.noOfrooms = 1;
      this.rooms = 1;

      if (this.hotelID != null && this.hotelID != undefined) {
        this.token.saveBookingEngineBoolean('googlehotelcenter');
        this.getPropertyDetailsById(this.hotelID);
      }
      if (this.token.getServiceData() !== null) {
        this.addServiceList = this.token.getServiceData();
        this.totalExtraAmount = 0;
        this.totalTaxAmount = 0;
        this.totalBeforeTaxAmount = 0;
        this.addServiceList.forEach((element) => {
          this.totalExtraAmount =
            this.totalExtraAmount + element.afterTaxAmount;
          this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
          this.totalBeforeTaxAmount =
            this.totalBeforeTaxAmount + element.beforeTaxAmount;
        });
      }
      this.booking.totalAmount =
        this.booking.beforeTaxAmount +
        this.totalExtraAmount +
        this.booking.taxAmount;
    }
    const savedBooking = sessionStorage.getItem('bookingSummaryDetails');
  if (savedBooking) {
    const data = JSON.parse(savedBooking);
    this.selectedPlansSummary = data.selectedPlansSummary || [];

    // Rebuild selectedGuestsByPlan and selectedRoomsByPlan
    this.selectedGuestsByPlan = {};
    this.selectedRoomsByPlan = {};

    this.selectedPlansSummary.forEach(plan => {
      this.selectedGuestsByPlan[plan.planName] = {
        adults: plan.adults,
        children: plan.children
      };
      this.selectedRoomsByPlan[plan.planName] = plan.selectedRoomnumber;

    });
  }
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    if (
      this.token?.getRoomsData() !== null &&
      this.token?.getRoomsData() !== undefined
    ) {
      this.availableRooms = this.token?.getRoomsData();
      this.shortrooms = this.token.getRoomsData();
    }
    this.acRoute.url.subscribe((urlSegments) => {
      this.currentUrl = window.location.href; // Use window.location.href to get the full URL
    });
    if (
      this.token.getBookingData() !== null &&
      this.token?.getRoomsData() !== undefined
    ) {
      this.booking = this.token.getBookingData();

      // this.trustedURL = this.safePipe.transform(this.sideMinderUrl );

      this.fromDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.fromDate).year,
        this.mileSecondToNGBDate(this.booking.fromDate).month,
        this.mileSecondToNGBDate(this.booking.fromDate).day
      );
      this.toDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.toDate).year,
        this.mileSecondToNGBDate(this.booking.toDate).month,
        this.mileSecondToNGBDate(this.booking.toDate).day
      );
      if (
        this.booking.noOfPersons === null ||
        this.booking.noOfPersons === undefined
      ) {
        this.adults = 1;
      } else {
         const bookingData = this.token.getBookingData();
        if (bookingData) {
          this.booking = bookingData;

          const totalAdults = this.adults || 1;


          const additionalAdults = this.additionalRooms?.reduce(
            (sum, room) => sum + (room.adults || 0),
            0
          );

          this.adults = totalAdults - additionalAdults;

          // Optional for children
          if (this.childno == null && this.childno == undefined) {
          this.children = 0;
        } else {
          this.children = Number(this.childno);
        }
          const totalChildren = this.children || 0;
          const additionalChildren = this.additionalRooms?.reduce(
            (sum, room) => sum + (room.children || 0),
            0
          );

          this.children = totalChildren - additionalChildren;
        }
      }

      this.rooms = this.booking.noOfRooms;

      this.taxPercentage = this.booking.taxPercentage;
    } else {
      if(this.checkinDay && this.checkinMonth && this.checkinYear) {
                  let dateString =
          this.checkinYear + '-' + this.checkinMonth + '-' + this.checkinDay;
        let checkedinday = new Date(dateString);

        let checkedOutday = new Date(checkedinday);
        let day = Number(checkedOutday.getDate()) + Number(this.nights);
        checkedOutday.setDate(day);
            this.booking.fromDate = this.getDateFormatYearMonthDay(
          checkedinday.getDate(),
          checkedinday.getMonth() + 1,
          checkedinday.getFullYear()
        );
        this.fromDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.fromDate).year,
        this.mileSecondToNGBDate(this.booking.fromDate).month,
        this.mileSecondToNGBDate(this.booking.fromDate).day
      );
        this.booking.toDate = this.getDateFormatYearMonthDay(
          checkedOutday.getDate(),
          checkedOutday.getMonth() + 1,
          checkedOutday.getFullYear()
        );

        this.toDate = new NgbDate(
        this.mileSecondToNGBDate(this.booking.toDate).year,
        this.mileSecondToNGBDate(this.booking.toDate).month,
        this.mileSecondToNGBDate(this.booking.toDate).day
      );

    } else {

      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    }
           if ( this.adults == null && this.adults == undefined ) {
      this.adults = 1
     }
     if (this.childno == null && this.childno == undefined) {
          this.children = 0;
        } else {
          this.children = Number(this.childno);
        }
      this.noOfrooms = 1;
      this.rooms = 1;
    }
    if (
      this.token.getBookingData()?.roomName != null &&
      this.token.getBookingData()?.roomName != undefined
    ) {
      this.showDiv = true;
      this.div = true;
    }
    this.routerone.params.subscribe((params) => {
      let uriId = this.routerone.snapshot.params['id'];
      if (uriId != undefined && uriId != null && uriId == 'GoogleHotelCenter') {
        this.activeForGoogleHotelCenter = true;
      } else {
        this.activeForGoogleHotelCenter = false;
      }
    });

    this.bookingPrice = this.token.getBookingRoomPrice();
    (this.googleUrlToken = this), token.getBookingEngineBoolean();

    this.googleUrl = this.token.getPropertyUrl();
    if (this.activeForGoogleHotelCenter === true) {
      this.showDiv = false;
    }



    this.allExtraPersonCharge = this.booking.extraPersonCharge;
    this.allExtraChildCharge = this.booking.extraChildCharge;
    this.token.saveExtraPersonCharge(this.allExtraPersonCharge);
    this.token.saveChildCharge(this.allExtraChildCharge);

    this.booking.createdDate = new Date();
    this.extraPersonChargee = this.token.getExtraPersonCharge();
    if (
      this.extraPersonChargee === 'NaN' ||
      this.extraPersonChargee === null ||
      this.extraPersonChargee === undefined
    ) {
      this.extraPersonChargee = 0;
    }
    this.extraChildChargee = this.token.getChildCharge();
    if (
      this.extraChildChargee === 'NaN' ||
      this.extraChildChargee === null ||
      this.extraChildChargee === undefined
    ) {
      this.extraChildChargee = 0;
    }
    this.blogPosts$ = this.contentfulService.getAllEntries();
  }

  ngOnInit() {
    localStorage.removeItem('selectPromo');

const couponCodeValues = sessionStorage.getItem('selectedPromoData');


if (couponCodeValues) {
  const parsed = JSON.parse(couponCodeValues); // convert to object
  this.specialDiscountData = JSON.parse(couponCodeValues);
if (parsed.couponCode) {
  this.enteredCoupon = parsed.couponCode;
  this.validCouponCode = parsed.couponCode;
}
if (parsed.discountPercentage) {
      this.specialDiscountPercentage = parsed.discountPercentage;
    }
}

    this.restoreGuestSelectionsFromSummary();
const storedBooking = sessionStorage.getItem('bookingSummaryDetails');
if (storedBooking) {
  const bookingData = JSON.parse(storedBooking);
  if(bookingData?.propertyServiceListDataOne) {
    this.selectedFacilityNames = bookingData?.propertyServiceListDataOne?.map(item => item.name);
  }

}



    this.setResponsiveOption();
    if (this.hotelID != null && this.hotelID != undefined) {
      this.token.saveBookingEngineBoolean('googlehotelcenter');
    }

    this.isReadMore = this.policies.map(() => false);
    window.addEventListener('df-request-sent', (event) => {
      this.propertyusername = this.businessUser.name;

      const chatbotElement = document.getElementById('chatbot');
      // ... rest of your code to set chat title
      chatbotElement.setAttribute('chat-title', this.propertyusername);

      chatbotElement.setAttribute('chat-title-icon', this.businessUser.logoUrl);
      const propertyId = this.businessUser.id;
      const propertyName = this.businessUser.name;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      const currentTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      const dataToSend = {
        propertyId: propertyId,
        propertyName: propertyName,
        currentDate: currentTimeString,
      };
      fetch('https://chatbot.api.thehotelmate.co/api/chatbot/receive-payload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .catch((error) => console.error('Error:', error));
    });
    if (this.city != null && this.city != undefined) {
      this.offerService.getPropertyListByCity(this.city).subscribe((res) => {
        this.restaurantData = res.body.filter(
          (entry) => entry.businessType === 'Restaurants'
        );
      });
    }
    // this.token.clearRoomsData();

    // const currentDate = new Date();
    // const fromDate = new NgbDate(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth() + 1,
    //     currentDate.getDate()
    // );

    // const nextDate = new Date(currentDate);
    // nextDate.setDate(currentDate.getDate() + 1);
    // const toDate = new NgbDate(
    //     nextDate.getFullYear(),
    //     nextDate.getMonth() + 1,
    //     nextDate.getDate()
    // );

    // this.fromDate = fromDate;
    // this.toDate = toDate;

    this.email = {
      fromEmail: '',
      toEmail: '',
      subject: '',
      propertyName: '',
      message: '',
    };
    this.city = this.token.getProperty()?.address?.city;
    if (this.token.getProperty() !== null) {
      this.propertyDetail = this.token.getProperty();
          if (
      this.token.getProperty() !== undefined &&
      this.token.getProperty() !== null
    ) {
      this.propertyData = this.token.getProperty();
                   this.accommodationData =
          this.propertyData.businessServiceDtoList?.filter(
            (entry) => entry.name === 'Accommodation'
          );
        this.accommodationData?.forEach((element) => {
          this.smartRecommendationsBoolean = element.smartRecommendation;
          this.serviceChargePercentage = element.serviceChargePercentage;
          console.log('this.serviceChargePercentage', this.serviceChargePercentage);
        });
    }

      if (this.activeForGoogleHotelCenter === true) {
        this.accommodationData =
          this.propertyDetail.businessServiceDtoList?.filter(
            (entry) => entry.name === 'Accommodation'
          );
        this.accommodationData.forEach((element) => {
          if (this.bookingengineurl === 'true') {
            this.value = element.websiteinstantBooking;
          } else if (this.value !== true) {
            this.value = element.instantBooking;
          }
        });
      }
    }
    if (this.token.getBookingCity() !== null) {
      this.bookingCity = this.token.getBookingCity();
    }
    let businessSlug = this.acRoute.snapshot.params['detail'];
    if (this.urlLocation !== undefined && this.urlLocation !== null) {
      this.isHotelMate = false;
    }

    if (businessSlug !== undefined) {
      // if (isNaN(Number(businessSlug)) === true) {
      this.data = businessSlug;
      this.details = this.data;

      if (this.data.id === undefined) {
        this.getPropertyDetailsBySeoName(this.data);
      }
      this.changeDetectorRefs.detectChanges();

      // this.updateTag();
      // }
      //  else {
      //   this.getPropertyDetailsById(Number(businessSlug));
      // }

      // else {
      //   this.getPropertyDetails(this.details.id);
      // }

      // this.addToCartList = [];
      // this.slotTimes = [];
    }

    this.getDiffDate(this.toDate, this.fromDate);
    setTimeout(() => {
      if (this.activeForGoogleHotelCenter == true) {
        this.fetchAndProcessRoomsDataOne();
      } else if (this.activeForGoogleHotelCenter == false) {
        this.fetchAndProcessRoomsData();
      }
    }, 3000);
    // this.adults = this.adults;
    // this.checkingAvailability();
    //  this.getTotalTaxFee();
    localStorage.removeItem('landingrice');
  }
getTotalAdults(): number {
  return this.selectedPlansSummary.reduce((sum, plan) => sum + (plan.adults || 0), 0);
}
getFilteredPlans(plans: any[]) {
  if (!plans) return [];
  return this.websiteUrlBookingEngine
    ? plans.filter(
        p => p.name?.trim().toLowerCase() !== 'economy'
      )
    : plans;
}
getTotalChildren(): number {
  return this.selectedPlansSummary.reduce((sum, plan) => sum + (plan.children || 0), 0);
}
  toggleMoreAddons() {
  this.showMoreAddons = !this.showMoreAddons;
}
removeSession() {
  sessionStorage.removeItem('bookingSummaryDetails');
const storedBooking = sessionStorage.getItem('bookingSummaryDetails');
if (storedBooking) {
  const bookingData = JSON.parse(storedBooking);
  if(bookingData?.propertyServiceListDataOne) {
    this.selectedFacilityNames = bookingData?.propertyServiceListDataOne?.map(item => item.name);
  }

}
    const savedBooking = sessionStorage.getItem('bookingSummaryDetails');
  if (savedBooking) {
    const data = JSON.parse(savedBooking);
    this.selectedPlansSummary = data.selectedPlansSummary || [];

    // Rebuild selectedGuestsByPlan and selectedRoomsByPlan
    this.selectedGuestsByPlan = {};
    this.selectedRoomsByPlan = {};

    this.selectedPlansSummary.forEach(plan => {
      this.selectedGuestsByPlan[plan.planName] = {
        adults: plan.adults,
        children: plan.children
      };
      this.selectedRoomsByPlan[plan.planName] = plan.selectedRoomnumber;

    });
  }
  this.selectedPlansSummary = [];
}
onAddonToggle(addonName: string, checked: boolean) {
  if (checked) {
    if (!this.selectedAddonNames.includes(addonName)) {
      this.selectedAddonNames.push(addonName);
    }
  } else {
    this.selectedAddonNames = this.selectedAddonNames.filter(name => name !== addonName);
  }
}
  get totalAdults(): number {
    return (
      Number(this.adults) + this.additionalRooms.reduce((sum, r) => sum + r.adults, 0)
    );
  }

get totalChildren(): number {
  const childno = Number(this.children); // ensures number
  const additionalChildren = this.additionalRooms.reduce(
    (sum, r) => sum + Number(r.children || 0), 0
  );
  return childno + additionalChildren;
}
    openWhatsappPopup() {
    this.showWhatsappPopup = true;
  }
sendWhatsappMessage() {
   this.isLoadingWhatsapp = true;
  if (!this.whatsappNumber) {
    this.errorMessagewhatsapp = 'Please enter your WhatsApp number';
    this.successMessagewhatsapp = '';
    return;
  }

  const apiUrl = `https://notification.uat.bookone.io/api/whatsapp/generate?propertyId=1965&propertyName=Production Property&mobileNumber=${this.whatsappNumber}`;

  this.http.get(apiUrl, { observe: 'response', responseType: 'json' }).subscribe({
    next: (response) => {

      if (response.status === 200) {
         this.isLoadingWhatsapp = false;
        this.successMessagewhatsapp = 'A message has been sent to your WhatsApp.';
        this.errorMessagewhatsapp = '';
      } else {
        this.errorMessagewhatsapp = 'Something went wrong. Please try again.';
        this.successMessagewhatsapp = '';
      }
    },
    error: (error) => {
       this.isLoadingWhatsapp = false;
      if(error.status === 200) {
        this.successMessagewhatsapp = 'A message has been sent to your WhatsApp';
        this.errorMessagewhatsapp = '';
    setTimeout(() => {
      this.closeWhatsappPopup();
    }, 3000);
      } else {
      this.errorMessagewhatsapp = 'Failed to send WhatsApp message.';
      this.successMessagewhatsapp = '';
      }

    }
  });
}


  closeWhatsappPopup() {
    this.showWhatsappPopup = false;
      this.whatsappNumber = '';
  this.successMessagewhatsapp = '';
  this.errorMessagewhatsapp = '';
  this.isLoadingWhatsapp = false;
  }
  nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
  }
}
prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
  }
}

get totalPages() {
  // 2 categories per page
  return Math.ceil(this.categories.length / 2);
}

get currentCategories() {
  const start = this.currentPage * 2;
  return this.categories.slice(start, start + 2);
}
restoreGuestSelectionsFromSummary() {
  // ✅ Restore selectedPlansSummary
  const savedSummary = sessionStorage.getItem('bookingSummaryDetails');
  if (!savedSummary) return;

  const parsedSummary = JSON.parse(savedSummary);
  const summaryList = parsedSummary.selectedPlansSummary || [];

  this.selectedPlansSummary = summaryList;

  // ✅ Restore guestDataArray
  const savedGuestArray = sessionStorage.getItem('guestDataArray');
  const guestDataArray = savedGuestArray ? JSON.parse(savedGuestArray) : [];

  // ✅ Reset in-memory maps
  this.selectedGuestsByPlan = {};
  this.selectedRoomsByPlan = {};
  this.childAgesByPlan = {};

  guestDataArray.forEach(entry => {
    this.selectedGuestsByPlan[entry.planCode] = {
      adults: entry.adults,
      children: entry.children
    };
    this.selectedRoomsByPlan[entry.planCode] = entry.roomCount;
    this.childAgesByPlan[entry.planCode] = entry.childAges || [];
  });
}


  calculateRoomSummary(): void {
  this.rooms = 1 + this.additionalRooms.length;
}
bookingSummaryView(){
  this.showBookingSummary = !this.showBookingSummary;
}
  onDialogVisibleChange(visible: boolean) {
    this.showBookingSummary = visible;
    this.cd.detectChanges();
  }

  // onHide should fire when the dialog is dismissed (mask, close button, ESC)
  onDialogHide() {
    this.showBookingSummary = false; // ensure state is cleared
    this.cd.detectChanges(); // needed if your component uses OnPush
  }
saveRoomSummary() {
  sessionStorage.setItem('bookingSummary', JSON.stringify(this.additionalRooms));
}

removeRoom(index: number): void {
  this.additionalRooms.splice(index, 1);
  this.saveRoomSummary();
   this.calculateRoomSummary();
}
showSliderPopup() {
  this.sliderPopupVisible = true;
}
  togglePanel(room: any, index: number) {
    this.isPanelOpen = !this.isPanelOpen;

    if (this.isPanelOpen) {
      this.selectedRoom = room; // Save the clicked room data
    } else {
      this.selectedRoom = null;
    }
  }

    togglePanelOne(room: any, index: number) {
    this.isPanelOpenOne = !this.isPanelOpenOne;

    if (this.isPanelOpenOne) {
      this.selectedRoom = room; // Save the clicked room data
    } else {
      this.selectedRoom = null;
    }
  }

  closePannel(){
    this.isPanelOpen = false;
  }


  isBookingAllowed(): boolean {
  const selectedRooms = this.selectedPlansSummary?.reduce(
    (total, plan) => total + (plan.selectedRoomnumber || 0),
    0
  );

  return selectedRooms >= this.rooms;
}

getRoomOptions(totalAvailable: number, roomName: string, currentPlanCode: string): number[] {
  // Filter only plans that belong to this room
  const usedRooms = Object.entries(this.selectedRoomsByPlan)
    .filter(([code]) => code !== currentPlanCode && code.startsWith(roomName + '_'))
    .reduce((sum, [, count]) => sum + (Number(count) || 0), 0);

  const currentKey = roomName + '_' + currentPlanCode;
  const currentSelection = Number(this.selectedRoomsByPlan[currentKey]) || 0;

  const remaining = totalAvailable - usedRooms;
  const maxAllowed = Math.max(currentSelection, remaining);

  return Array.from({ length: maxAllowed + 1 }, (_, i) => i);
}

  setDefaultRoomIfMissing(planCode: string): boolean {
    if (this.selectedRoomsByPlan[planCode] === undefined) {
      this.selectedRoomsByPlan[planCode] = 0;
    }
    return true;
  }
onRoomSelect(roomName: string, planCode: string, count: number | string) {
  const key = roomName + '_' + planCode;
  const selectedCount = Number(count) || 0;

  this.selectedRoomsByPlan[key] = selectedCount;
  if (!this.selectedGuestsByPlan[planCode]) {
    this.selectedGuestsByPlan[planCode] = { adults: 0, children: 0 };
  }
  this.selectedGuestsByPlan[planCode].adults = selectedCount;

}


  getRemainingRooms(): number {
    const totalSelected = Object.values(this.selectedRoomsByPlan).reduce(
      (a, b) => a + b,
      0
    );
    return this.rooms - totalSelected;
  }

  disableRoomIndexList(index: number, roomKey: string): boolean {
    try {
      const selectedKeys = Object.keys(this.selectedRoomsByPlan || {});
      const selectedCount = selectedKeys.length;
      const maxSelectable = this.rooms;

      // Always enable already selected rooms
      if (this.selectedRoomsByPlan[roomKey]) {
        return false;
      }

      // Only allow enabling the next (maxSelectable - selectedCount) slots
      // For example: rooms = 4, selected = 2 → allow only index 0, 1
      return index >= maxSelectable - (maxSelectable - selectedCount);
    } catch (error) {
      console.error('Error in disableRoomIndexList:', error);
      return true;
    }
  }

  openGalleryModal() {
    $(`#${this.galleryModalRef.nativeElement.id}`).modal('show');
  }

  closeGalleryModal() {
    $(`#${this.galleryModalRef.nativeElement.id}`).modal('hide');
  }

  openCarouselModal(index: number, fromGallery: boolean = false) {
    this.activeImageIndex = index;

    if (fromGallery) {
      this.closeGalleryModal();
    }

    setTimeout(() => {
      $(`#${this.carouselModalRef.nativeElement.id}`).modal('show');
    }, 200);
  }

  closeCarouselModal() {
    $(`#${this.carouselModalRef.nativeElement.id}`).modal('hide');

    // Open gallery modal again if coming from it
    setTimeout(() => {
      this.openGalleryModal();
    }, 200);
  }

  nextImage() {
    if (this.activeImageIndex < this.businessUser.imageList.length - 1) {
      this.activeImageIndex++;
    }
  }

  prevImage() {
    if (this.activeImageIndex > 0) {
      this.activeImageIndex--;
    }
  }
  // onIncrement(planCode: string, type: 'adults' | 'children', plan: any) {
  //   const limit = type === 'adults' ? plan.maximumOccupancy : plan.noOfChildren;
  //   const totalAllowed =
  //     type === 'adults' ? this.totalAdults : this.totalChildren;

  //   if (
  //     !this.selectedRoomsByPlan[planCode] ||
  //     this.selectedRoomsByPlan[planCode] === 0
  //   ) {
  //     return; // Stop if no room selected
  //   }

  //   // Initialize selectedGuestsByPlan if not already
  //   if (!this.selectedGuestsByPlan[planCode]) {
  //     this.selectedGuestsByPlan[planCode] = { adults: 0, children: 0 };
  //   }

  //   const current = this.selectedGuestsByPlan[planCode][type];

  //   const totalSelected = Object.values(this.selectedGuestsByPlan).reduce(
  //     (sum, val) => sum + val[type],
  //     0
  //   );

  //   if (current < limit && totalSelected < totalAllowed) {
  //     this.selectedGuestsByPlan[planCode][type]++;
  //   }
  // }

onIncrement(planCode: string, type: 'adults' | 'children', plan: any) {
  this.guestSelectionErrors[planCode] = ''; // reset error

  const selectedRooms = this.selectedRoomsByPlan[planCode] || 0;

  if (selectedRooms === 0) {
    this.showTemporaryError(planCode, 'Please add a room first.');
    return;
  }

  if (!this.selectedGuestsByPlan[planCode]) {
    this.selectedGuestsByPlan[planCode] = { adults: 0, children: 0 };
  }
  if (!this.childAgesByPlan[planCode]) {
    this.childAgesByPlan[planCode] = [];
  }
  if (type === 'adults') {
  const above5Count = this.childAgesByPlan[planCode].filter(a => a !== null && a > 5).length;
    const limit = (plan.maximumOccupancy ) * selectedRooms;
    if (this.selectedGuestsByPlan[planCode].adults < limit) {
      this.selectedGuestsByPlan[planCode].adults++;
    } else {
      this.showTemporaryError(planCode, `Max adults allowed is ${limit}.`);
    }
    return;
  }

  if (type === 'children') {
    const limit = ((plan.maximumOccupancy + plan.noOfChildren) * selectedRooms) - this.selectedGuestsByPlan[planCode].adults;
    const below2yearslimit = 2 * selectedRooms;
    const under2Count = this.childAgesByPlan[planCode].filter(a => a !== null && a <= 2).length;
   const above5Count = this.childAgesByPlan[planCode].filter(a => a !== null && a > 5).length;
    if (under2Count > below2yearslimit) {
    this.showTemporaryError(planCode, `Only ${below2yearslimit} children under 5 years allowed.`);
    return;
  }
    if (above5Count < limit) {
      if (this.childAgesByPlan[planCode].some(a => a === null)) {
        this.showTemporaryError(planCode, 'Please select age for all existing children first.');
        return;
      }
      this.selectedGuestsByPlan[planCode].children++;
      this.childAgesByPlan[planCode].push(null);
    } else {
      this.showTemporaryError(planCode, `Max children above 5 years allowed is ${limit}.`);
    }
    return;
  }


}


private showTemporaryError(planCode: string, message: string) {
  this.guestSelectionErrors[planCode] = message;
  setTimeout(() => {
    this.guestSelectionErrors[planCode] = '';
  }, 4000);
}
onDecrement(planCode: string, type: 'adults' | 'children') {
  if (this.selectedGuestsByPlan[planCode] && this.selectedGuestsByPlan[planCode][type] > 0) {
    this.selectedGuestsByPlan[planCode][type]--;

    if (type === 'children') {
      this.childAgesByPlan[planCode].pop();
    }

    const currentGuests = this.selectedGuestsByPlan[planCode];
    const totalGuests = (currentGuests.adults || 0) + (currentGuests.children || 0);

    if (totalGuests === 0) {
      // ✅ Remove the specific plan object from selectedPlansSummary
      this.selectedPlansSummary = this.selectedPlansSummary.filter(
        plan => plan.planName !== planCode
      );

      // ✅ Optionally remove from localStorage
      const roomCount = this.selectedRoomsByPlan[planCode] || 0;
      const guestDataKey = `guestData_${planCode}_${roomCount}`;
      sessionStorage.removeItem(guestDataKey);

      // ✅ Optionally clean up in-memory maps
      delete this.selectedGuestsByPlan[planCode];
      delete this.selectedRoomsByPlan[planCode];
      delete this.childAgesByPlan[planCode];

      // ✅ Update sessionStorage
      sessionStorage.setItem(
        'bookingSummaryDetails',
        JSON.stringify({ selectedPlansSummary: this.selectedPlansSummary })
      );
    }
  }
}


onChildAgeChange(planCode: string, plan: any) {
    const selectedRooms = this.selectedRoomsByPlan[planCode] || 0;
  const limit = plan.maximumOccupancy + plan.noOfChildren - this.selectedGuestsByPlan[planCode].adults * selectedRooms;
  const above5Count = this.childAgesByPlan[planCode].filter(a => a !== null && a > 5).length;
  const under2Count = this.childAgesByPlan[planCode].filter(a => a !== null && a <= 2).length;

  // if (above5Count > limit) {
  //   this.showTemporaryError(planCode, `Max children above 5 yrs allowed is ${limit}.`);
  // } else if (under2Count > 2) {
  //   this.showTemporaryError(planCode, 'Only 2 children under 2 years allowed.');
  // }
}
getChildCount(planCode: string) {
  return (this.childAgesByPlan[planCode] || []).filter(age => age > 0).length;
}
resetLastChangedAge(planCode: string) {
  const lastIndex = this.childAgesByPlan[planCode].length - 1;
  this.childAgesByPlan[planCode][lastIndex] = null;
}
  addRoom() {
    if (this.rooms >= 30) return; // max 30 rooms total
    this.additionalRooms.push({ adults: 1, children: 0 });
    this.rooms++;
    this.noOfrooms = this.rooms;
  }
  onMouseEnter() {
    clearTimeout(this.popupTimeout);
    this.roomsAndOccupancy = true;
  }

  onMouseLeave() {
    this.popupTimeout = setTimeout(() => {
      this.roomsAndOccupancy = false;
    }, 200); // 200ms delay to avoid flicker
  }

  closing() {
    this.roomsAndOccupancy = false;
  }

  closeChanges(){
    this.roomsAndOccupancy = false;
  }

  selectRoomsbtn() {
    this.closeGalleryModal();
    setTimeout(() => {
      this.scrollToAccommodationDash();
    }, 500);
  }

  getCodeandSetDefaultGHC(plancode): void {
  const planCode = plancode;

  // 1. Assign default selection
  this.selectedRoomsByPlan[planCode] = 1;
  this.selectedGuestsByPlan[planCode] = {
    adults: this.adults,
    children: this.childno,
  };

  // 2. Trigger plan selection
  this.onPlanSelect(planCode, this.getRateByPlanCode(planCode));
  this.isPanelOpen = false;
  // 3. Scroll to the plan card — even if it's already in view
  setTimeout(() => {
    const el = document.getElementById('plan-' + planCode);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Optionally add a highlight effect
      el.classList.add('scroll-highlight');
      // setTimeout(() => {
      //   el.classList.remove('scroll-highlight');
      // }, 5000);
    }
  }, 100); // slight delay ensures DOM updates
}

  // onPlanSelect(planCode: string, rates: any) {
  //   const selectedRooms = this.selectedRoomsByPlan[planCode];
  //   const selectedGuests = this.selectedGuestsByPlan[planCode];
  //   const plan = rates.roomRatePlans.find((p) => p.code === planCode);
  //   // Reset
  //     this.extraAdultCharge = 0;
  //     this.extraChildrenCharge = 0;
  //     this.extraAdultCount = 0;
  //     this.extraChildCount = 0;
  //     const childAges = (this.childAgesByPlan[planCode] || []).map(a => Number(a));
  //     const below5Count = childAges.filter(a => !isNaN(a) && a <= 5).length;
  //     const above5Count = childAges.filter(a => !isNaN(a) && a > 5).length;


  //     rates.roomRatePlans.forEach((ele1) => {
  //       if (plan.code === ele1.code) {
  //         const totalMinAdults = ele1.minimumOccupancy * selectedRooms;
  //         const totalMinChildren = ele1.noOfChildren * selectedRooms;

  //         const extraAdults =
  //           selectedGuests.adults > totalMinAdults
  //             ? selectedGuests.adults - totalMinAdults
  //             : 0;
  //         const extraChildren =
  //           above5Count > totalMinChildren
  //             ? above5Count - totalMinChildren
  //             : 0;

  //         this.extraAdultCount = extraAdults;
  //         this.extraAdultCharge = extraAdults * ele1.extraChargePerPerson;

  //         this.extraChildCount = extraChildren;
  //         this.extraChildrenCharge = extraChildren * ele1.extraChargePerChild;
  //       }
  //     });
  //   if (selectedRooms && selectedGuests?.adults > 0) {
  //     const roomName = rates.roomName;
  //     const roomId = rates.roomId;
  //     // i have suffle because i have added a condition
  //     const planName = plan.code;
  //     const planCodeName = plan.name;
  //     const nights = this.DiffDate;
  //     if (this.extraAdultCharge && !this.extraChildrenCharge) {
  //       const priceOne =
  //         plan.code === 'GHC' && this.activeForGoogleHotelCenter
  //           ? this.totalplanPrice + this.extraAdultCharge
  //           : plan.amount * nights * selectedRooms + this.extraAdultCharge;
  //           this.actualroompriceCharge = plan.amount;
  //       this.roomPricePerPlan = priceOne;
  //     } else if (this.extraChildrenCharge && !this.extraAdultCharge) {
  //       const priceOne =
  //         plan.code === 'GHC' && this.activeForGoogleHotelCenter
  //           ? this.totalplanPrice + this.extraChildrenCharge
  //           : plan.amount * nights * selectedRooms + this.extraChildrenCharge;
  //       this.actualroompriceCharge = plan.amount;
  //       this.roomPricePerPlan = priceOne;
  //     } else if (this.extraAdultCharge && this.extraChildrenCharge) {
  //       const priceOne =
  //         plan.code === 'GHC' && this.activeForGoogleHotelCenter
  //           ? this.totalplanPrice +
  //             (this.extraChildrenCharge + this.extraAdultCharge)
  //           : plan.amount * nights * selectedRooms +
  //             (this.extraChildrenCharge + this.extraAdultCharge);
  //       this.actualroompriceCharge = plan.amount;
  //       this.roomPricePerPlan = priceOne;
  //     } else {
  //       const priceOne =
  //         plan.code === 'GHC' && this.activeForGoogleHotelCenter
  //           ? this.totalplanPrice
  //           : plan.amount * nights * selectedRooms;
  //       this.roomPricePerPlan = priceOne;
  //       this.actualroompriceCharge = plan.amount;
  //     }
  //     const price = this.roomPricePerPlan;
  //     const actualRoomPrice = this.actualroompriceCharge;
  //     const selectedRoomnumber = selectedRooms;
  //     const extraPersonAdultCountAmount = this.extraAdultCharge;
  //     const extraPersonChildCountAmount = this.extraChildrenCharge;
  //     const extraCountAdult = this.extraAdultCount? this.extraAdultCount: 0;
  //     const extraCountChild = this.extraChildCount? this.extraChildCount: 0;
  //     if (this.businessUser.taxDetails.length > 0) {
  //       this.businessUser.taxDetails.forEach((element) => {
  //         if (element.name === 'GST') {
  //           this.booking.taxDetails = [];
  //           this.booking.taxDetails.push(element);
  //           this.taxPercentage = element.percentage;
  //           this.booking.taxPercentage = this.taxPercentage;
  //           if (
  //             plan?.code === 'GHC' &&
  //             this.activeForGoogleHotelCenter === true
  //           ) {
  //             if (element.taxSlabsList.length > 0) {
  //               element.taxSlabsList.forEach((element2) => {
  //                 if (
  //                   element2.maxAmount >
  //                     price +
  //                       (extraPersonAdultCountAmount +
  //                         extraPersonChildCountAmount) /
  //                         nights &&
  //                   element2.minAmount <
  //                     this.booking.roomPrice +
  //                       (extraPersonAdultCountAmount +
  //                         extraPersonChildCountAmount) /
  //                         nights
  //                 ) {
  //                   this.taxPercentage = element2.percentage;
  //                   this.booking.taxPercentage = this.taxPercentage;
  //                 } else if (
  //                   element2.maxAmount <
  //                   price +
  //                     (extraPersonAdultCountAmount +
  //                       extraPersonChildCountAmount) /
  //                       nights
  //                 ) {
  //                   this.taxPercentage = element2.percentage;
  //                   this.booking.taxPercentage = this.taxPercentage;
  //                 }
  //               });
  //             }
  //           } else {
  //             if (element.taxSlabsList.length > 0) {
  //               element.taxSlabsList.forEach((element2) => {
  //                 if (
  //                   element2.maxAmount > price &&
  //                   element2.minAmount < price
  //                 ) {
  //                   this.taxPercentage = element2.percentage;
  //                   this.booking.taxPercentage = this.taxPercentage;
  //                 } else if (element2.maxAmount < price) {
  //                   this.taxPercentage = element2.percentage;
  //                   this.booking.taxPercentage = this.taxPercentage;
  //                 }
  //               });
  //             }
  //           }
  //         }
  //       });
  //       // this.taxPercentage = this.booking.taxDetails[0].percentage;
  //     }
  //     const taxpercentage = this.booking.taxPercentage;
  //     const taxPercentageperroom = (price * this.booking.taxPercentage) / 100;

  //     const summaryEntry = {
  //       roomName,
  //       actualRoomPrice,
  //       extraPersonChildCountAmount,
  //       extraPersonAdultCountAmount,
  //       roomId,
  //       planName,
  //       adults: selectedGuests.adults,
  //       children: above5Count + below5Count || 0,
  //       nights,
  //       price,
  //       selectedRoomnumber,
  //       taxPercentageperroom,
  //       taxpercentage,
  //       extraCountChild,
  //       extraCountAdult,
  //       planCodeName
  //     };

  //     // Replace if already exists
  //     const index = this.selectedPlansSummary.findIndex(
  //       (p) => p.planName === planName
  //     );
  //     if (index > -1) {
  //       this.selectedPlansSummary[index] = summaryEntry;
  //     } else {
  //       this.selectedPlansSummary.push(summaryEntry);
  //     }
  //     console.log('summaryEntry', summaryEntry);
  //     sessionStorage.setItem(
  //       'bookingSummaryDetails',
  //       JSON.stringify({
  //         selectedPlansSummary: this.selectedPlansSummary
  //         // Add any other relevant data if needed
  //       })
  //     );
  //   }
  // }

  onPlanSelect(planCode: string, rates: any) {
    const selectedRooms = this.selectedRoomsByPlan[planCode];
    const selectedGuests = this.selectedGuestsByPlan[planCode];
    const roomId = rates.roomId;
    const plan = rates.roomRatePlans.find((p) => p.code === planCode && rates.roomId === roomId);
    // Reset
  if (!plan) return;
  const childAges = (this.childAgesByPlan[planCode] || []).map(a => Number(a));
  const below5Count = childAges.filter(a => !isNaN(a) && a <= 5).length;
  const above5Count = childAges.filter(a => !isNaN(a) && a > 5).length;

  // Reset
  this.extraAdultCharge = 0;
  this.extraChildrenCharge = 0;
  this.extraAdultCount = 0;
  this.extraChildCount = 0;
    if ((plan.maximumOccupancy + plan.noOfChildren) * selectedRooms > selectedGuests?.adults + above5Count ||
            (plan.maximumOccupancy + plan.noOfChildren) * selectedRooms === selectedGuests?.adults + above5Count) {
             const savedGuestArray = sessionStorage.getItem('guestDataArray');
            let guestDataArray = savedGuestArray ? JSON.parse(savedGuestArray) : [];

              // Step 2: Prepare the new entry
              const newEntry = {
                planCode: plan.code,
                planName: plan.name,
                adults: selectedGuests.adults,
                children: selectedGuests.children,
                childAges: childAges,
                roomCount: selectedRooms
              };

              // Step 3: Check if the plan already exists
              const existingIndex = guestDataArray.findIndex(
                entry => entry.planCode === plan.code
              );

              // Step 4: Update or add the entry
              if (existingIndex > -1) {
                guestDataArray[existingIndex] = newEntry;
              } else {
                guestDataArray.push(newEntry);
              }

              // Step 5: Save the updated array back to sessionStorage
              sessionStorage.setItem('guestDataArray', JSON.stringify(guestDataArray));



              rates.roomRatePlans.forEach((ele1) => {

    if (plan.code === ele1.code) {
      const totalMinAdults = ele1.minimumOccupancy * selectedRooms;
      const totalMinChildren = ele1.noOfChildren * selectedRooms;
      // if (selectedRooms > 1) {
      // const singleRoomCountOccupancyAdult = ele1.minimumOccupancy * 1;
      // console.log('singleRoomCountOccupancyAdult is',singleRoomCountOccupancyAdult);
      // const singleRoomCountOccupancyChild = ele1.noOfChildren * 1;
      // console.log('singleRoomCountOccupancyChild is',singleRoomCountOccupancyChild);
      //       this.singleextraAdults =
      //   selectedGuests.adults > singleRoomCountOccupancyAdult
      //     ? selectedGuests.adults - (totalMinAdults + singleRoomCountOccupancyAdult)
      //     : 0;
      //     console.log('singleextraAdults is',this.singleextraAdults);
      //  this.singleextraChild =  above5Count > singleRoomCountOccupancyChild
      //     ? above5Count - (totalMinChildren + singleRoomCountOccupancyChild)
      //     : 0;
      //     console.log('singleextraChild is',this.singleextraChild);
      // }
      if (selectedRooms > 1) {
  const singleRoomCountOccupancyAdult = ele1.minimumOccupancy * 1;
  console.log('singleRoomCountOccupancyAdult is', singleRoomCountOccupancyAdult);

  const singleRoomCountOccupancyChild = ele1.noOfChildren * 1;
  console.log('singleRoomCountOccupancyChild is', singleRoomCountOccupancyChild);

  // Calculate total included adults/children for all rooms
  const totalIncludedAdults = ele1.minimumOccupancy * selectedRooms;
  const totalIncludedChildren = ele1.noOfChildren * selectedRooms;

  // Calculate total extra adults and children
  const totalExtraAdults =
    selectedGuests.adults > totalIncludedAdults
      ? selectedGuests.adults - totalIncludedAdults
      : 0;

  const totalExtraChildren =
    above5Count > totalIncludedChildren
      ? above5Count - totalIncludedChildren
      : 0;

  // Divide evenly across rooms (average per room)
  this.singleextraAdults =
    totalExtraAdults > 0 ? totalExtraAdults / selectedRooms : 0;

  this.singleextraChild =
    totalExtraChildren > 0 ? totalExtraChildren / selectedRooms : 0;

  console.log('singleextraAdults per room is', this.singleextraAdults);
  console.log('singleextraChild per room is', this.singleextraChild);
}


      const extraAdults =
        selectedGuests.adults > totalMinAdults
          ? selectedGuests.adults - totalMinAdults
          : 0;
      const extraChildren =
        above5Count > totalMinChildren
          ? above5Count - totalMinChildren
          : 0;

      this.extraAdultCount = extraAdults;
      this.extraAdultCharge = extraAdults * ele1.extraChargePerPerson;
      this.singleextraAdultCount = this.singleextraChild;
      this.singleextraAdultCharge = this.singleextraAdults * ele1.extraChargePerPerson;
      this.extraChildCount = extraChildren;
      this.singleextraChildCount = this.singleextraChild;
      this.singleextraChildrenCharge = this.singleextraChild * ele1.extraChargePerChild;
      this.extraChildrenCharge = extraChildren * ele1.extraChargePerChild;
    }
  });

  if (selectedRooms && selectedGuests?.adults > 0) {
    const roomName = rates.roomName;
    const roomId = rates.roomId;
    const planName = plan.code;
    const planCodeName = plan.name;
    const nights = this.DiffDate;

    if (this.extraAdultCharge && !this.extraChildrenCharge) {
      const priceOne = ((plan.amount * nights * selectedRooms) + (this.extraAdultCharge * nights)) ;
      this.actualroompriceCharge = plan.amount;
      this.roomPricePerPlan = priceOne;
    } else if (this.extraChildrenCharge && !this.extraAdultCharge) {
      const priceOne = ((plan.amount * nights * selectedRooms) + (this.extraChildrenCharge * nights));
      this.actualroompriceCharge = plan.amount;
      this.roomPricePerPlan = priceOne;
    } else if (this.extraAdultCharge && this.extraChildrenCharge) {
      const priceOne = ((plan.amount * nights * selectedRooms) + ((this.extraChildrenCharge + this.extraAdultCharge) * nights)) ;
      this.actualroompriceCharge = plan.amount;
      this.roomPricePerPlan = priceOne;
    } else {
      const priceOne = (plan.amount * selectedRooms) * nights ;
      this.roomPricePerPlan = priceOne;
      this.actualroompriceCharge = plan.amount;
    }

    const price = this.roomPricePerPlan;
    const actualRoomPrice = this.actualroompriceCharge;
    const selectedRoomnumber = selectedRooms;
    const SingleDayextraPersonAdultCountAmount = this.extraAdultCharge;
    const SingleDayextraPersonChildCountAmount = this.extraChildrenCharge;
    const extraPersonAdultCountAmount = this.extraAdultCharge * this.DiffDate;
    const extraPersonChildCountAmount = this.extraChildrenCharge * this.DiffDate;
    const extraCountAdult = this.extraAdultCount ? this.extraAdultCount : 0;
    const extraCountChild = this.extraChildCount ? this.extraChildCount : 0;
    const childrenBelow5years = below5Count;
    const childrenAbove5years = above5Count;
    const singleextraAdultCharges = this.singleextraAdultCharge;
    const singleextraChildrenCharges = this.singleextraChildrenCharge;
    if (this.businessUser.taxDetails.length > 0) {
      this.businessUser.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          // this.booking.taxPercentage = this.taxPercentage;

          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    price +
                      (extraPersonAdultCountAmount +
                        extraPersonChildCountAmount) /
                        nights &&
                  element2.minAmount <=
                    this.booking.roomPrice +
                      (extraPersonAdultCountAmount +
                        extraPersonChildCountAmount) /
                        nights
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  price +
                    (extraPersonAdultCountAmount +
                      extraPersonChildCountAmount) /
                      nights
                ) {
                  this.taxPercentage = element2.percentage;
                  // this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (selectedRooms > 1) {
               if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= (this.actualroompriceCharge + singleextraAdultCharges + singleextraChildrenCharges) &&
                  element2.minAmount <= (this.actualroompriceCharge + singleextraAdultCharges + singleextraChildrenCharges)
                ) {
                  this.taxPercentage = element2.percentage;
                  // this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= (this.actualroompriceCharge + singleextraAdultCharges + singleextraChildrenCharges)) {
                  this.taxPercentage = element2.percentage;
                  // this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
            } else {
               if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= (this.actualroompriceCharge + SingleDayextraPersonAdultCountAmount + SingleDayextraPersonChildCountAmount) &&
                  element2.minAmount <= (this.actualroompriceCharge + SingleDayextraPersonAdultCountAmount + SingleDayextraPersonChildCountAmount)
                ) {
                  this.taxPercentage = element2.percentage;
                  // this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= (this.actualroompriceCharge + SingleDayextraPersonAdultCountAmount + SingleDayextraPersonChildCountAmount)) {
                  this.taxPercentage = element2.percentage;
                  // this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
            }

          }
        }
      });
    }

    const taxpercentage = this.taxPercentage;
                      this.taxTotalSingle = 0;
              this.daterangefilterSeo?.forEach((_, i) => {
                if (selectedRoomnumber > 1) {
                  this.taxTotalSingle += this.calculateTaxAmount(
                    (actualRoomPrice) +
                    (singleextraAdultCharges || 0) +
                    (singleextraChildrenCharges || 0),
                    plan
                  );
                } else {
                  this.taxTotalSingle += this.calculateTaxAmount(
                    (actualRoomPrice * selectedRoomnumber) +
                    (SingleDayextraPersonAdultCountAmount || 0) +
                    (SingleDayextraPersonChildCountAmount || 0),
                    plan
                  );
                }

              });
    const taxPercentageperroom = this.taxTotalSingle * selectedRoomnumber;


    const summaryEntry = {
      roomName,
      actualRoomPrice,
      extraPersonChildCountAmount,
      extraPersonAdultCountAmount,
      SingleDayextraPersonChildCountAmount,
      singleextraAdultCharges,
      singleextraChildrenCharges,
      SingleDayextraPersonAdultCountAmount,
      roomId,
      planName,
      adults: selectedGuests.adults,
      children: this.getChildCount(planCode) || 0,
      nights,
      price,
      selectedRoomnumber,
      taxPercentageperroom,
      taxpercentage,
      extraCountChild,
      extraCountAdult,
      planCodeName,
      childrenAbove5years,
      childrenBelow5years
    };
      // Replace if already exists

      const index = this.selectedPlansSummary.findIndex(
      (p) => p.planName === planName && p.roomId === roomId
    );
      if (index > -1) {
        this.selectedPlansSummary[index] = summaryEntry;
      } else {
        this.selectedPlansSummary.push(summaryEntry);
      }
      console.log('summaryEntry', summaryEntry);
      sessionStorage.setItem(
        'bookingSummaryDetails',
        JSON.stringify({
          selectedPlansSummary: this.selectedPlansSummary
          // Add any other relevant data if needed
        })
      );
    }
  }
}

// getTotalGhCPrice(plan: any): number {
//   let total = 0;
//   if (this.planPrice?.length) {
//     this.planPrice.forEach((price: number) => {
//       total += (price * plan.selectedRoomnumber) + plan.extraPersonAdultCountAmount;
//       total += this.calculateTaxAmount(((price * plan.selectedRoomnumber) + plan.extraPersonAdultCountAmount), plan);
//     });
//   }
//   return total;
// }

// getTotalNonGhCPrice(plan: any): number {
//   let total = 0;
//   if (plan.nights) {
//     for (let i = 0; i < plan.nights; i++) {
//       total += (plan.actualRoomPrice * plan.selectedRoomnumber) + plan.extraPersonAdultCountAmount;
//       total += this.calculateTaxAmount(((plan.actualRoomPrice * plan.selectedRoomnumber) + plan.extraPersonAdultCountAmount), plan);
//     }
//   }
//   return total;
// }


getSubtotalGhCPrice(plan: any): number {
  let subtotal = 0;
  if (this.planPrice?.length) {
    this.planPrice.forEach((price: number) => {
      subtotal += (price * plan.selectedRoomnumber) +  (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount);
    });
  }
  return subtotal;
}

getSubtotalNonGhCPrice(plan: any): number {
  let subtotal = 0;
  if (plan.nights) {
    for (let i = 0; i < plan.nights; i++) {
      subtotal += (plan.actualRoomPrice * plan.selectedRoomnumber) + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount);
    }
  }
  return subtotal;
}

getTotalGhCPrice(plan: any): number {
  const subtotal = this.getSubtotalGhCPrice(plan);
  console.log('subtotal is',subtotal);
  let taxTotalOne = 0;
    this.selectedPlansSummary.forEach((plan: any) => {
    if (plan.planName === 'GHC') {
      this.daterangefilter?.forEach((nights, i) => {
        const priceArray = [this.planPrice[i]];
        priceArray.forEach((price) => {
          if (plan.selectedRoomnumber > 1) {
          taxTotalOne += (this.calculateTaxAmount(
        ((price +
        (plan.singleextraAdultCharges + plan.singleextraChildrenCharges))) ,
        plan) * plan.selectedRoomnumber);
        } else {
          taxTotalOne += (this.calculateTaxAmount(
        ( (price + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount))) ,
        plan
      ) * plan.selectedRoomnumber);
        }
        });
      });

    }
  });
  return subtotal + taxTotalOne;
}

getTotalNonGhCPrice(plan: any): number {
  const subtotal = this.getSubtotalNonGhCPrice(plan);
  let taxTotal = 0;

  // Loop only over date range (if needed)
  this.daterangefilterSeo?.forEach(() => {
    if (plan.planName !== 'GHC') {
      if (plan.selectedRoomnumber > 1) {
        taxTotal +=
          this.calculateTaxAmount(
            plan.actualRoomPrice +
              (plan.singleextraAdultCharges + plan.singleextraChildrenCharges),
            plan
          ) * plan.selectedRoomnumber;
      } else {
        taxTotal +=
          this.calculateTaxAmount(
            plan.actualRoomPrice +
              (plan.SingleDayextraPersonAdultCountAmount +
                plan.SingleDayextraPersonChildCountAmount),
            plan
          ) * plan.selectedRoomnumber;
      }
    }
  });

  return subtotal + taxTotal;
}


getGrandTotal(): number {
  let total = 0;
  this.selectedPlansSummary.forEach((plan: any) => {
    if (plan.planName === 'GHC') {
      total += this.getTotalGhCPrice(plan);
      console.log('totaal is',total);
    } else {
      total += this.getTotalNonGhCPrice(plan);
    }
  });
  return total;
}

getGrandSubtotal(): number {
  let subtotal = 0;
  this.selectedPlansSummary.forEach((plan: any) => {
    if (plan.planName === 'GHC') {
      subtotal += this.getSubtotalGhCPrice(plan);
      console.log('subtotal is',subtotal);
    } else {
      subtotal += this.getSubtotalNonGhCPrice(plan);
    }
  });
  return subtotal;
}

getTaxGhCPrice(plan: any): number {
  const subtotal = this.getSubtotalGhCPrice(plan);
  return this.calculateTaxAmount(subtotal, plan);
}

getTaxNonGhCPrice(plan: any): number {
  const subtotal = this.getSubtotalNonGhCPrice(plan);
  return this.calculateTaxAmount(subtotal, plan);
}

getGrandTaxTotal(): number {
  if(this.specialDiscountPercentage) {
      let taxTotal = 0;

  this.selectedPlansSummary.forEach((plan: any) => {
    if (plan.planName === 'GHC') {


      this.daterangefilter?.forEach((nights, i) => {
        const priceArray = [this.planPrice[i]];
        priceArray.forEach((price) => {
          if (plan.selectedRoomnumber > 1) {
           const dataOne = ((price + plan.singleextraAdultCharges + plan.singleextraChildrenCharges) * this.specialDiscountPercentage) / 100;
          taxTotal += (this.calculateTaxAmount(
        ((price +
        (plan.singleextraAdultCharges + plan.singleextraChildrenCharges)) - dataOne ) ,
        plan
      ) * plan.selectedRoomnumber);
        } else {
           const dataOne = ((price + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount)) * this.specialDiscountPercentage) / 100;
          taxTotal += (this.calculateTaxAmount(
        ( (price + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount)) - dataOne) ,
        plan
      ) * plan.selectedRoomnumber);
        }
        });
      });

    } else {

       this.daterangefilterSeo?.forEach((_, i) => {

        if (plan.selectedRoomnumber > 1) {
           const dataOne = ((plan.actualRoomPrice + plan.singleextraAdultCharges + plan.singleextraChildrenCharges) * this.specialDiscountPercentage) / 100;
          taxTotal += (this.calculateTaxAmount(
        ((plan.actualRoomPrice +
        (plan.singleextraAdultCharges + plan.singleextraChildrenCharges)) - dataOne ) ,
        plan
      ) * plan.selectedRoomnumber);
        } else {
           const dataOne = ((plan.actualRoomPrice + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount)) * this.specialDiscountPercentage) / 100;
          taxTotal += (this.calculateTaxAmount(
        ( (plan.actualRoomPrice + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount)) - dataOne) ,
        plan
      ) * plan.selectedRoomnumber);
        }


    });
    }
  });

  return taxTotal;
  } else {
      let taxTotal = 0;

  this.selectedPlansSummary.forEach((plan: any) => {
    if (plan.planName === 'GHC') {
      this.daterangefilter?.forEach((nights, i) => {
        const priceArray = [this.planPrice[i]];
        priceArray.forEach((price) => {
          taxTotal += this.calculateTaxAmount(price * plan.selectedRoomnumber + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount), plan);
        });
      });

    } else {
       this.daterangefilterSeo?.forEach((_, i) => {
        if (plan.selectedRoomnumber > 1) {
          taxTotal += (this.calculateTaxAmount(
        (plan.actualRoomPrice ) +
        (plan.singleextraAdultCharges + plan.singleextraChildrenCharges),
        plan
      ) * plan.selectedRoomnumber);
        } else {
          taxTotal += (this.calculateTaxAmount(
        (plan.actualRoomPrice ) +
        (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount),
        plan
      ) * plan.selectedRoomnumber);
        }


    });
    }
  });

  return taxTotal;
  }

}



getTotalWithoutTax(plan: any): number {
  let total = 0;

  // GHC part (without tax)
  if (this.planPrice?.length && plan.planName === 'GHC') {
    this.planPrice.forEach((price: number) => {
      total += (price * plan.selectedRoomnumber) + plan.extraPersonAdultCountAmount;
    });
  }

  // Non-GHC part (without tax)
  if (plan.planName !== 'GHC' && plan.nights) {
    for (let i = 0; i < plan.nights; i++) {
      total += (plan.actualRoomPrice * plan.selectedRoomnumber) + plan.extraPersonAdultCountAmount;
    }
  }

  return total;
}



  calculateTaxAmount(basePrice: number, plan: any): number {
  let taxPercentage = 0;

 if (this.businessUser?.taxDetails?.length > 0) {
      this.businessUser.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;
          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    basePrice &&
                  element2.minAmount <=
                    basePrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  basePrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= basePrice &&
                  element2.minAmount <= basePrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= basePrice) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        }
      });
      // this.taxPercentage = this.booking.taxDetails[0].percentage;
    }
  return (basePrice * this.booking.taxPercentage) / 100;
}


onSelectPlanFromSmartCard(plan: any): void {
  const planCode = plan.planCode;
  // find the rate from availableRooms
  const rate = this.getRateByPlanCodeSmartCard(planCode);
  if (!rate) {
    console.warn('No matching rate found for planCode:', planCode);
    return;
  }

  // 1. Assign default selection
  this.selectedRoomsByPlan[planCode] = this.rooms;
  this.selectedGuestsByPlan[planCode] = {
    adults: this.booking.noOfPersons,
    children: 0,
  };

  // 2. Trigger plan selection with rate
  this.onPlanSelect(planCode, rate);
  this.isPanelOpen = false;

  // 3. Scroll to the plan card — even if it's already in view
  setTimeout(() => {
    const el = document.getElementById('plan-' + planCode);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('scroll-highlight');
      // setTimeout(() => el.classList.remove('scroll-highlight'), 3000);
    }
  }, 100);
}

onGhCPlanSelect(){
    // this.checkingAvailability();
}


onSelectPlanFromPopup(plan: any): void {
  const planCode = plan.code;

  // 1. Assign default selection
  this.selectedRoomsByPlan[planCode] = 1;
  this.selectedGuestsByPlan[planCode] = {
    adults: 2,
    children: 0,
  };

  // 2. Trigger plan selection
  this.onPlanSelect(planCode, this.getRateByPlanCode(planCode));
  this.isPanelOpen = false;
  // 3. Scroll to the plan card — even if it's already in view
  setTimeout(() => {
    const el = document.getElementById('plan-' + planCode);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Optionally add a highlight effect
      el.classList.add('scroll-highlight');
      // setTimeout(() => {
      //   el.classList.remove('scroll-highlight');
      // }, 3000);
    }
  }, 100); // slight delay ensures DOM updates
}


getRateByPlanCode(planCode: string) {
  for (let rate of this.selectedRoom?.ratesAndAvailabilityDtos || []) {
    const plan = rate.roomRatePlans.find(p => p.code === planCode);
    if (plan) return rate;
  }
  return null;
}

getRateByPlanCodeSmartCard(planCode: string) {
  if (!this.availableRooms) return null;

  for (const room of this.availableRooms) {
    for (const rate of room?.ratesAndAvailabilityDtos || []) {
      const plan = rate.roomRatePlans.find(p => p.code === planCode);
      if (plan) {
        return rate;
      }
    }
  }
  return null;
}


//   removePlan(index: number): void {
//   if (index > -1) {
//     this.selectedPlansSummary.splice(index, 1);

//     // Update session storage
//     sessionStorage.setItem(
//       'bookingSummaryDetails',
//       JSON.stringify({
//         selectedPlansSummary: this.selectedPlansSummary
//       })
//     );
//         const savedBooking = sessionStorage.getItem('bookingSummaryDetails');
//   if (savedBooking) {
//     const data = JSON.parse(savedBooking);
//     this.selectedPlansSummary = data.selectedPlansSummary || [];

//     // Rebuild selectedGuestsByPlan and selectedRoomsByPlan
//     this.selectedGuestsByPlan = {};
//     this.selectedRoomsByPlan = {};

//     this.selectedPlansSummary.forEach(plan => {
//       this.selectedGuestsByPlan[plan.planName] = {
//         adults: plan.adults,
//         children: plan.children
//       };
//       this.selectedRoomsByPlan[plan.planName] = plan.selectedRoomnumber;
//     });
//   }
//   }
// }

removePlan(index: number): void {
  if (index > -1) {
    const removedPlan = this.selectedPlansSummary[index];
    this.selectedPlansSummary.splice(index, 1);
    sessionStorage.setItem(
      'bookingSummaryDetails',
      JSON.stringify({ selectedPlansSummary: this.selectedPlansSummary })
    );
    const savedGuestArray = sessionStorage.getItem('guestDataArray');
    let guestDataArray = savedGuestArray ? JSON.parse(savedGuestArray) : [];
    guestDataArray = guestDataArray.filter(
      entry => entry.planCode !== removedPlan.planName
    );
    sessionStorage.setItem('guestDataArray', JSON.stringify(guestDataArray));
    this.selectedGuestsByPlan = {};
    this.selectedRoomsByPlan = {};
    this.childAgesByPlan = {};

    guestDataArray.forEach(entry => {
      this.selectedGuestsByPlan[entry.planCode] = {
        adults: entry.adults,
        children: entry.children
      };
      this.selectedRoomsByPlan[entry.planCode] = entry.roomCount;
      this.childAgesByPlan[entry.planCode] = entry.childAges || [];
    });
  }
}
  publishPage(event: any) {
    if (
      this.token.getProperty() !== undefined &&
      this.token.getProperty() !== null
    ) {
      this.propertyData = this.token.getProperty();
      if (this.activeForGoogleHotelCenter === true) {
        this.accommodationData =
          this.propertyData.businessServiceDtoList?.filter(
            (entry) => entry.name === 'Accommodation'
          );
        this.accommodationData.forEach((element) => {
          if (this.bookingengineurl === 'true') {
            this.value = element.websiteinstantBooking;
          } else if (this.value !== true) {
            this.value = element.instantBooking;
          }
        });
      }
    }
    if (event !== null && event! + undefined) {
      this.showHideFlag = true;
    }

    this.changeDetectorRefs.detectChanges();
  }
  fetchAndProcessRoomsData() {
    this.isLoading = true;
    this.sortAndLimitRoomsOne();
    this.isLoading = false;
    // setTimeout(() => {

    // }, 1000);
  }

  fetchAndProcessRoomsDataOne() {
    this.isLoading = true;
    this.sortAndLimitRooms();
    this.isLoading = false;
    // setTimeout(() => {

    // }, 1000);
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollLeft -= 250; // Adjust this value to match card width
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollLeft += 250; // Adjust this value to match card width
  }
  scrollLeftOne(index) {
    this.scrollContainerOne.nativeElement.scrollLeft -= 250; // Adjust this value to match card width
  }

  scrollRightOne() {
    this.scrollContainerOne.nativeElement.scrollLeft += 250; // Adjust this value to match card width
  }
  // showhide(){
  openRoomCarousel() {
    this.showRoomCarousel = true;
  }

  toggleDescriptionOne() {
    this.showFullDescriptionOne = !this.showFullDescriptionOne;
  }

  toggleDescription(index: number) {
    this.showFullDescription[index] = !this.showFullDescription[index];
  }
sortAndLimitRooms() {
    // Sort rooms by roomOnlyPrice in ascending order
    this.sortedRooms = this.Googlehotelsortrooms?.sort((a, b) => a.roomOnlyPrice - b.roomOnlyPrice).slice(0, 2);
    this.sortedRooms?.forEach((room) => {
      let totalAvailableRooms = 0;

      room?.ratesAndAvailabilityDtos?.forEach((rate) => {
        if (rate?.roomName === room?.name) {
          totalAvailableRooms += rate?.noOfAvailable || 0;
        }
      });

      // Assign the total available rooms to the room object
      room.roomsAvailable = totalAvailableRooms;
       let planPrices: number[] = [];

    room?.ratesAndAvailabilityDtos?.forEach(rate => {
      rate?.roomRatePlans?.forEach(plan => {
        if (typeof plan?.amount === 'number') {
          planPrices.push(plan.amount);
        }
      });
    });
    this.roomLowestPrices = {}
  // Store lowest price by room ID or room.name
    const lowestPrice = this.getLowestPrice(room);
    this.roomLowestPrices[room.id || room.name] = lowestPrice;
    });
    this.isLoading=false
  }



  getLowestPrice(room: any): number | null {
    const allPlans = room?.ratesAndAvailabilityDtos
      ?.flatMap((availability: any) => availability?.roomRatePlans || [])
      .map((plan: any) => plan?.amount);

    return allPlans?.length ? Math.min(...allPlans) : null;
  }

  getDynamicNameFromUrl(url: string): string | null {
    const fullUrl = this.locationBack.prepareExternalUrl(
      this.locationBack.path(true)
    );

    // You can also access the current URL with window.location.href
    const domain = window.location.hostname; // Get the domain part from the URL
    const name = domain.split('.')[1]; // This will extract 'saanaira-resort-spa'
    if (this.name) {
      this.getPropertyDetailsBySeoName(name);
    }

    return name;
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

 sortAndLimitRoomsOne() {
    this.sortedRoomsOne = this.shortrooms?.sort((a, b) => a.roomOnlyPrice - b.roomOnlyPrice).slice(0, 2);

    this.sortedRoomsOne?.forEach((room) => {
      let totalAvailableRooms = 0;

      room?.ratesAndAvailabilityDtos?.forEach((rate) => {
        if (rate?.roomName === room?.name) {
          totalAvailableRooms += rate?.noOfAvailable || 0;
        }
      });

      // Assign the total available rooms to the room object
      room.roomsAvailable = totalAvailableRooms;

      this.roomLowestPricesBookingEngine = this.roomLowestPricesBookingEngine || {}; // Ensure object is initialized

const lowestPlan = this.getLowestPriceBookingEngine(room); // This returns a number or null

const roomKey = room.id || room.name;

if (roomKey) {
  this.roomLowestPricesBookingEngine[roomKey] = lowestPlan;
}


    });
  }



  getLowestPriceBookingEngine(room: any): number | null {
    const allPlans = room?.ratesAndAvailabilityDtos
      ?.flatMap((availability: any) => availability?.roomRatePlans || [])
      .filter(
        (plan: any) =>
          typeof plan?.amount === 'number' &&
          !isNaN(plan.amount) &&
          plan?.code?.toLowerCase() !== 'ghc'
      );

    if (!allPlans?.length) return null;

    const lowestPlan = allPlans.reduce((min, curr) =>
      curr.amount < min.amount ? curr : min
    );

    return lowestPlan;
  }

  toggleView() {
    this.isExpanded = !this.isExpanded;
  }
  toggleReadMore(index: number) {
    // Toggle the read more/less flag for the clicked policy
    this.isReadMore[index] = !this.isReadMore[index];
  }
  decrementL(lunchservice) {
    if (this.counterl > 0) {
      this.counterl--;
    }

    this.serviceDto = new PropertyServiceDTO();
    this.serviceDto = lunchservice;
    this.serviceDto.count = this.counterl;

    this.serviceDto.organisationId = this.businessUser.organisationId;
    this.serviceDto.logoUrl = this.businessUser.logoUrl;
    this.serviceDto.date = this.booking.fromDate;

    this.serviceDto.beforeTaxAmount =
      this.serviceDto.servicePrice * this.serviceDto.count;
    this.serviceDto.taxAmount =
      (this.serviceDto.beforeTaxAmount / 100) * this.serviceDto.taxPercentage;
    this.serviceDto.afterTaxAmount =
      this.serviceDto.beforeTaxAmount + this.serviceDto.taxAmount;
    //  this.addServiceList.some(e=>{
    // e.id === item.id
    //  })

    if (
      this.addServiceList.some((data) => data.name === lunchservice.name) ===
      true
    ) {
      let service = this.addServiceList.find(
        (data) => data.name === lunchservice.name
      );
      let i = this.addServiceList.indexOf(service);
      this.addServiceList[i].count = this.serviceDto.count;
      if (
        this.addServiceList[i].servicePrice === 0 ||
        this.addServiceList[i].servicePrice === undefined
      ) {
        this.addServiceList[i].servicePrice =
          this.addServiceList[i].beforeTaxAmount;
      }
      this.addServiceList[i].beforeTaxAmount =
        this.addServiceList[i].servicePrice * this.addServiceList[i].count;
      this.addServiceList[i].taxAmount =
        (this.addServiceList[i].beforeTaxAmount / 100) *
        this.addServiceList[i].taxPercentage;
      this.addServiceList[i].afterTaxAmount =
        this.addServiceList[i].beforeTaxAmount +
        this.addServiceList[i].taxAmount;
    } else {
      this.addServiceList.push(this.serviceDto);
    }

    this.serviceDto = new PropertyServiceDTO();


    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.booking.totalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount;
    this.token.saveServiceData(this.addServiceList);
  }

  hidediv() {
    this.div = false;
  }

  slickCarouselConfig = {
    // centerMode: true,
    // centerPadding: '10%',
    centerMode: true,
    centerPadding: '0',
    slidesToShow: 3,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1441,
        settings: {
          centerPadding: '0',
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1025,
        settings: {
          centerPadding: '0',
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
        },
      },
    ],
  };
  toggleRowStyles() {
    this.showAll = !this.showAll;
  }

  decrementb(breakfastservice) {
    if (this.counterb > 0) {
      this.counterb--;
    }

    this.serviceDto = new PropertyServiceDTO();
    this.serviceDto = breakfastservice;
    this.serviceDto.count = this.counterb;

    this.serviceDto.organisationId = this.businessUser.organisationId;
    this.serviceDto.logoUrl = this.businessUser.logoUrl;
    this.serviceDto.date = this.booking.fromDate;

    this.serviceDto.beforeTaxAmount =
      this.serviceDto.servicePrice * this.serviceDto.count;
    this.serviceDto.taxAmount =
      (this.serviceDto.beforeTaxAmount / 100) * this.serviceDto.taxPercentage;
    this.serviceDto.afterTaxAmount =
      this.serviceDto.beforeTaxAmount + this.serviceDto.taxAmount;
    //  this.addServiceList.some(e=>{
    // e.id === item.id
    //  })

    if (
      this.addServiceList.some(
        (data) => data.name === breakfastservice.name
      ) === true
    ) {
      let service = this.addServiceList.find(
        (data) => data.name === breakfastservice.name
      );
      let i = this.addServiceList.indexOf(service);
      this.addServiceList[i].count = this.serviceDto.count;
      if (
        this.addServiceList[i].servicePrice === 0 ||
        this.addServiceList[i].servicePrice === undefined
      ) {
        this.addServiceList[i].servicePrice =
          this.addServiceList[i].beforeTaxAmount;
      }
      this.addServiceList[i].beforeTaxAmount =
        this.addServiceList[i].servicePrice * this.addServiceList[i].count;
      this.addServiceList[i].taxAmount =
        (this.addServiceList[i].beforeTaxAmount / 100) *
        this.addServiceList[i].taxPercentage;
      this.addServiceList[i].afterTaxAmount =
        this.addServiceList[i].beforeTaxAmount +
        this.addServiceList[i].taxAmount;
    } else {
      this.addServiceList.push(this.serviceDto);
    }

    this.serviceDto = new PropertyServiceDTO();


    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.booking.totalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount;
    this.token.saveServiceData(this.addServiceList);
  }
  decrementD(dinnerservice) {
    if (this.counterd > 0) {
      this.counterd--;
    }

    this.serviceDto = new PropertyServiceDTO();
    this.serviceDto = dinnerservice;
    this.serviceDto.count = this.counterd;

    this.serviceDto.organisationId = this.businessUser.organisationId;
    this.serviceDto.logoUrl = this.businessUser.logoUrl;
    this.serviceDto.date = this.booking.fromDate;

    this.serviceDto.beforeTaxAmount =
      this.serviceDto.servicePrice * this.serviceDto.count;
    this.serviceDto.taxAmount =
      (this.serviceDto.beforeTaxAmount / 100) * this.serviceDto.taxPercentage;
    this.serviceDto.afterTaxAmount =
      this.serviceDto.beforeTaxAmount + this.serviceDto.taxAmount;
    //  this.addServiceList.some(e=>{
    // e.id === item.id
    //  })

    if (
      this.addServiceList.some((data) => data.name === dinnerservice.name) ===
      true
    ) {
      let service = this.addServiceList.find(
        (data) => data.name === dinnerservice.name
      );
      let i = this.addServiceList.indexOf(service);
      this.addServiceList[i].count = this.serviceDto.count;
      if (
        this.addServiceList[i].servicePrice === 0 ||
        this.addServiceList[i].servicePrice === undefined
      ) {
        this.addServiceList[i].servicePrice =
          this.addServiceList[i].beforeTaxAmount;
      }
      this.addServiceList[i].beforeTaxAmount =
        this.addServiceList[i].servicePrice * this.addServiceList[i].count;
      this.addServiceList[i].taxAmount =
        (this.addServiceList[i].beforeTaxAmount / 100) *
        this.addServiceList[i].taxPercentage;
      this.addServiceList[i].afterTaxAmount =
        this.addServiceList[i].beforeTaxAmount +
        this.addServiceList[i].taxAmount;
    } else {
      this.addServiceList.push(this.serviceDto);
    }

    this.serviceDto = new PropertyServiceDTO();


    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.booking.totalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount;
    this.token.saveServiceData(this.addServiceList);
  }

  // }
  ngAfterViewInit() {
    // this.token.saveSelectedServices(this.selectedServices);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  }

  backClicked() {
    this.locationBack.back();
  }
  onAdd(facility, index) {
    facility.isAdded = true;
    facility.quantity = 1;
    this.selectedServices.push(facility);
    this.token.saveSelectedServices(this.selectedServices);
    this.updateTokenStorage();
    this.selectedServicesOne = this.selectedServices;
    this.changeDetectorRefs.detectChanges();
  }

  increaseQuantity(facility) {
    facility.quantity++;
    if (this.selectedServicesOne) {
      const facilityIndex = this.selectedServicesOne.findIndex(
        (ele) => ele.id === facility.id
      );

      if (facilityIndex !== -1) {
        this.selectedServicesOne[facilityIndex].quantity = facility.quantity;
      } else {
        this.selectedServicesOne.push(facility);
      }

      this.token.saveSelectedServices(this.selectedServicesOne);
    } else {
      this.token.saveSelectedServices(this.selectedServices);
      this.updateTokenStorage();
    }
  }

  decreaseQuantity(facility) {
    if (facility.quantity > 1) {
      facility.quantity--;
      if (
        this.selectedServicesOne != null &&
        this.selectedServicesOne != undefined
      ) {
        this.selectedServicesOne.forEach((ele) => {
          if (ele.id === facility.id) {
            ele.quantity = facility.quantity;
          }
        });

        this.token.saveSelectedServices(this.selectedServicesOne);
      } else {
        this.token.saveSelectedServices(this.selectedServices);
        this.updateTokenStorage();
      }
    } else if (facility.quantity === 1) {
      facility.isAdded = false;
      facility.quantity = null;
      if (
        this.selectedServicesOne != null &&
        this.selectedServicesOne != undefined
      ) {
        this.selectedServicesOne = this.selectedServicesOne.filter((ele) => {
          // Check if the condition is met
          if (ele.id === facility.id) {
            ele.quantity = facility.quantity; // Update quantity if needed

            return false; // Exclude this element from the new array
          }
          return true;
          // Keep this element in the new array
        });
        this.token.saveSelectedServices(this.selectedServicesOne);
      }

      const index = this.selectedServices.indexOf(facility);
      if (index > -1) {
        this.selectedServices.splice(index, 1);
      }
    }
  }

  // Save selected services to token storage

  updateTokenStorage() {
    this.token.saveSelectedServices(this.selectedServices);
  }
  navigateToSection(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
  reset() {
    this.booking = {} as Booking;
    this.showDiv = false;
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  personChange() {
    if (
      this.adultno != null ||
      (this.adultno != undefined && this.booking.noOfPersons == null) ||
      this.booking.noOfPersons == undefined
    ) {
      this.adults = Number(this.adults);
    }
    if (
      this.childno != null ||
      (this.childno != undefined && this.booking.noOfChildren == null) ||
      this.booking.noOfChildren == undefined
    ) {
      this.children = Number(this.childno);
    }
  }
  checkingAvailabilityOneDay() {
    this.loaderHotelBooking = true;
    this.checkAvailabilityStatusHide = false;
    this.booking.propertyId = this.businessUser.id;

    this.booking.fromDate = this.getDateFormatYearMonthDay(
      this.oneDayFromDate.day,
      this.oneDayFromDate.month,
      this.oneDayFromDate.year
    );

    this.booking.toDate = this.getDateFormatYearMonthDay(
      this.oneDayFromDate.day + 1,
      this.oneDayFromDate.month,
      this.oneDayFromDate.year
    );
    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.adults;

    this.token.saveBookingData(this.booking);

    this.hotelBookingService
      .checkAvailabilityByProperty(
        this.booking.fromDate,
        this.booking.toDate,
        this.booking.noOfRooms,
        this.booking.noOfPersons,
        this.booking.propertyId
      )
      .subscribe(
        (response) => {
          this.loaderHotelBooking = false;
          this.availableRooms = response.body.roomList;
          this.availableRooms = this.availableRooms.filter(room =>
          room.ratesAndAvailabilityDtos?.length > 0 &&
          (room.ratesAndAvailabilityDtos[0]?.stopSellOBE === null || room.ratesAndAvailabilityDtos[0]?.stopSellOBE === false) &&
          (room.ratesAndAvailabilityDtos[0]?.stopSellOTA === null || room.ratesAndAvailabilityDtos[0]?.stopSellOTA === false)
        );
    // Filter sold-out rooms
          this.soldOutRooms = response.body.roomList.filter(room =>
            room.ratesAndAvailabilityDtos === null ||
            (room.ratesAndAvailabilityDtos[0]?.stopSellOBE != null && room.ratesAndAvailabilityDtos[0]?.stopSellOBE !== false) ||
            (room.ratesAndAvailabilityDtos[0]?.stopSellOTA != null && room.ratesAndAvailabilityDtos[0]?.stopSellOTA !== false)
          );
          this.shortrooms = response.body.roomList;
          this.checkAvailabilityStatus = response.body.available;
          this.booking.bookingAmount = response.body.bookingAmount;

          // this.booking.extraPersonCharge = response.body.extraPersonCharge;

          // this.selectedRoomMaximumOccupancy = response.body.noOfPersons;

          if (response.body.available === true) {
            this.checkAvailabilityStatusName = 'Available';
          } else {
            this.checkAvailabilityStatusName = 'Not Available';
          }
          this.oneDayTripShow();
          // Logger.log('checkAvailability ' + JSON.stringify(response.body));
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            Logger.log('checkAvailability error');
          }
        }
      );
  }

  adult() {
    if (this.adultno != null || this.adultno != undefined) {
      this.adults = Number(+this.adults);
    } else {
      this.adults = this.adults;
    }
  }
  onCheckInClosed(): void {
  if (this.fromDate) {
    this.booking.fromDate = this.getDateFormatYearMonthDay(
      this.fromDate.day,
      this.fromDate.month,
      this.fromDate.year
    );

    // Automatically set next day as default checkout if not chosen yet
    if (!this.toDate) {
      this.booking.toDate = this.getDateFormatYearMonthDay(
        this.fromDate.day + 1,
        this.fromDate.month,
        this.fromDate.year
      );
    }

    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.adults;

    this.token.saveBookingData(this.booking);
  }
}

onCheckOutClosed(): void {
  if (this.toDate) {
    this.booking.toDate = this.getDateFormatYearMonthDay(
      this.toDate.day,
      this.toDate.month,
      this.toDate.year
    );

    if (this.fromDate) {
      this.booking.fromDate = this.getDateFormatYearMonthDay(
        this.fromDate.day,
        this.fromDate.month,
        this.fromDate.year
      );
    }

    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.adults;

    this.token.saveBookingData(this.booking);
    this.checkingAvailability();
    if(this.activeForGoogleHotelCenter === false){
       this.getPropertyDetailsBySeoName(this.data);
    }
  }
}

  child() {
    if (this.childno != null || this.childno != undefined) {
      this.children = Number(+this.children + 1);
    } else {
      this.children = this.children + 1;
    }
  }
  navigatePrivacy() {
    // this.token.saveBookingData(this.booking);
    // this.token.saveProperty(this.businessUser);
    this.router.navigate(['privacy']);
  }
  submitForm(form: NgForm) {
    Logger.log(JSON.stringify(this.subscriptions));
    const TO_EMAIL = 'reservation@thehotelmate.co';
    // const TO_EMAIL = 'abir.sayeed@gmail.com';
    // const TO_EMAIL = "subhasmitatripathy37@gmail.com";
    this.email.fromEmail = this.fromEmail;
    this.email.toEmail = TO_EMAIL;
    this.name = this.name;
    this.email.subject = this.subject;
    this.propertyname = this.businessUser?.seoFriendlyName;
    // tslint:disable-next-line: max-line-length
    this.email.message =
      '\nPropertyName: ' +
      this.businessUser.name +
      '\nName: ' +
      this.name +
      '\nEmail: ' +
      this.fromEmail +
      ' \nPhone: ' +
      this.phone +
      ' \nMessage: ' +
      this.message +
      '. \n*****This enquiry is showing from Bookone PMS Website******';

    Logger.log(this.subscriptions + ' ' + this.name);
    this.email.subject = '' + this.subject;
    Logger.log('form data ' + JSON.stringify(this.email));
    //  this.success = true;
    this.http
      .post<Email>(API_URL_NZ + '/api/thm/sendEmailFromWebSite', this.email)
      .subscribe((response) => {
        this.success = response;
        Logger.log(response);
      });
    this.sendemailtosupport(this.email);
  }
  sendemailtosupport(email) {
    email.toEmail = 'reservation@thehotelmate.co';
    this.http
      .post<Email>(API_URL_NZ + '/api/thm/sendEmailFromWebSite', email)
      .subscribe((response) => {
        this.success = response;
        Logger.log(response);
        this.name = '';
        this.fromEmail = '';
        this.phone = '';
        this.subject = '';
        this.propertyname = '';
        this.message = '';
        this.successMessage = true;
      });
  }
  // changeTheme(primary: string, secondary: string, tertiary: string) {
  //   document.documentElement.style.setProperty('--primary', primary);

  //   document.documentElement.style.setProperty('--secondary', secondary);
  //   document.documentElement.style.setProperty('--tertiary', tertiary);
  //   document.documentElement.style.setProperty('--button-primary', tertiary);
  //   document.documentElement.style.setProperty(
  //     '--primary-gradient',
  //     'linear-gradient( 180deg, ' + tertiary + ', ' + secondary + ')'
  //   );
  //   document.documentElement.style.setProperty(
  //     '--secondary-gradient',
  //     'linear-gradient( 312deg, ' + primary + ', ' + secondary + ')'
  //   );
  //   document.documentElement.style.setProperty(
  //     '--secondary-one-gradient',
  //     'linear-gradient( 180deg, ' + primary + ', ' + secondary + ')'
  //   );

  //   document.documentElement.style.setProperty(
  //     '--third-gradient',
  //     'linear-gradient( 180deg, ' + primary + ', ' + secondary + ')'
  //   );
  // }
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

  updateTag() {
    let keywords = this.businessUser?.address?.city;

    if (
      this.businessUser.businessDescription != null &&
      this.businessUser.businessDescription != undefined
    ) {
      this.description = this.businessUser.businessDescription;
    } else {
      this.description = 'Contact No: +91-7326079861';
    }
    let title =
      this.businessUser.name +
      ' | The Hotel Mate' +
      ' | Contact No: +91-7326079861';

    let ogTitle =
      this.businessUser.name +
      ' | The Hotel Mate' +
      ' | Contact No: +91-7326079861';

    if (
      this.businessUser.businessDescription != null &&
      this.businessUser.businessDescription != undefined
    ) {
      this.ogDescription = this.businessUser.businessDescription;
    } else {
      this.ogDescription = 'Contact No: +91-7326079861';
    }

    let ogImage = this.businessUser.logoUrl;
    let ogUrl = 'https://thehotelmate.co/' + this.businessUser.seoFriendlyName;
    let ogSiteName = '';
    this.metaService.updateTag({ name: 'title', content: title });
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({
      name: 'description',
      content: this.description,
    });
    this.metaService.updateTag({ name: 'robots', content: 'index,follow' });
    // fb

    this.metaService.updateTag({ property: 'og:title', content: ogTitle });
    this.metaService.updateTag(
      {
        property: 'og:description',
        content: this.ogDescription,
      },
      `property='og:description'`
    );
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({ property: 'og:url', content: ogUrl });
    this.metaService.updateTag(
      {
        property: 'og:site_name',
        content: ogSiteName,
      },
      `property='og:site_name'`
    );
    this.metaService.updateTag({ property: 'og:image', content: ogImage });


    // twitter
    this.metaService.updateTag({ name: 'twitter:title', content: ogTitle });
    this.metaService.updateTag(
      {
        name: 'twitter:description',
        content: this.ogDescription,
      },
      `name='twitter:description'`
    );
    this.metaService.updateTag({ name: 'twitter:image', content: ogImage });
    this.metaService.updateTag(
      {
        name: 'twitter:image:alt',
        content: this.ogDescription,
      },
      `name='twitter:image:alt'`
    );
    this.changeDetectorRefs.detectChanges();
  }
  mileSecondToNGBDate(date: string) {
    const dsd = new Date(date);
    const year = dsd.getFullYear();
    const day = dsd.getDate();
    const month = dsd.getMonth() + 1;
    return { year: year, month: month, day: day };
  }
  // contefulpage() {
  //   this.router.navigate(["/blogpost"]);
  // }
  getDiffDate(toDate, fromDate) {
    this.enddate = new Date(toDate.year, toDate.month - 1, toDate.day);

    this.startDate = new Date(fromDate.year, fromDate.month - 1, fromDate.day);

    this.DiffDate = Math.floor(
      (Date.UTC(
        this.enddate.getFullYear(),
        this.enddate.getMonth(),
        this.enddate.getDate()
      ) -
        Date.UTC(
          this.startDate.getFullYear(),
          this.startDate.getMonth(),
          this.startDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  }
  toggleRoomsAndOccupancy() {
    if (this.roomsAndOccupancy === false) {
      this.roomsAndOccupancy = true;
    } else if (this.roomsAndOccupancy === true) {
      this.roomsAndOccupancy = false;
    }
  }

  // privtePromotion(){

  // }

  async getPropertyDetailsById(id: number) {
    this.isLoadingProperty = true;
 this.loader = true;
    try {
      this.loader = true;
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        this.propertyData = this.businessUser;
                   this.accommodationData =
          this.propertyData.businessServiceDtoList?.filter(
            (entry) => entry.name === 'Accommodation'
          );
        this.accommodationData?.forEach((element) => {
          this.smartRecommendationsBoolean = element.smartRecommendation;
        });
        this.isLoadingProperty = false;
        this.generateAndSetSchema();
        this.getOfferList(this.businessUser.seoFriendlyName);
        this.getGoogleReview(this.businessUser.id);
        this.showStaticContent = true;
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation'
        );

        this.businessUser.propertyServicesList.forEach((ele) => {
          if (ele.id != null && ele.id != undefined) {
            this.propertyServiceListData.push(ele);
          }
        });

        this.businessUser?.socialMediaLinks.forEach((element) => {
          this.socialmedialist = element;
        });

        this.propertyServiceListDataOne =
          this.businessUser.propertyServicesList.filter(
            (ele) => Number(ele.servicePrice) > 0
          );

        if (
          this.selectedServices != null &&
          this.selectedServices != undefined
        ) {
          this.savedServices = this.token
            ?.getSelectedServices()
            ?.forEach((ele) => {
              this.propertyServiceListDataOne.forEach((val) => {
                if (ele.name === val.name) {
                  this.valSelected = true;
                  this.viewAddon = true;
                  val.quantity = ele.quantity;
                }
              });
            });
        }
        this.updateTag();
        this.token.saveProperty(this.businessUser);

        this.accommodationData?.forEach((element) => {
          this.smartRecommendationsBoolean = element.smartRecommendation;
        });

         this.accommodationData?.forEach((element) => {
          this.channelManagerIntegration = element.cmIntegration;
        });

        this.accommodationData?.forEach((element) =>{
          this.instantBooking = element.instantBooking;
        });

        if (this.urlLocation !== undefined && this.urlLocation !== null) {
          this.triggerEventService.newEvent(this.urlLocation);
        }

        this.dangerousUrl =
          'https://siteminder-git-main-rekha-credencesoft.vercel.app/propertyId/' +
          this.businessUser.id;
        this.trustedURL = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.dangerousUrl
        );
        this.currency = this.businessUser.localCurrency.toUpperCase();
        this.businessTypeName = this.businessUser.businessType;

        if (this.token.getBookingCity() !== null) {
          this.bookingCity = this.token.getBookingCity();
        } else {
          this.token.saveBookingCity(this.bookingCity);
        }

        this.businessServiceDto = this.businessUser.businessServiceDtoList.find(
          (data) => data.name === this.businessUser.businessType
        );

        if (this.businessUser.primaryColor !== undefined) {
          this.changeTheme(
            this.businessUser.primaryColor,
            this.businessUser.secondaryColor,
            this.businessUser.tertiaryColor
          );
        }

        this.maxSelectRoom = this.businessUser.numberOfRooms;
        this.maxOccupancy = this.businessUser.maximumOccupancy;

        this.selectHotelBooking = true;

        let dateString =
          this.checkinYear + '-' + this.checkinMonth + '-' + this.checkinDay;
        let checkedinday = new Date(dateString);

        let checkedOutday = new Date(checkedinday);
        let day = Number(checkedOutday.getDate()) + Number(this.nights);
        checkedOutday.setDate(day);

        this.booking.fromDate = this.getDateFormatYearMonthDay(
          checkedinday.getDate(),
          checkedinday.getMonth() + 1,
          checkedinday.getFullYear()
        );
        this.booking.toDate = this.getDateFormatYearMonthDay(
          checkedOutday.getDate(),
          checkedOutday.getMonth() + 1,
          checkedOutday.getFullYear()
        );

        this.booking.noOfRooms = 1;
        this.booking.noOfPersons = 1;
        this.booking.noOfChildren = 1;

        this.fromDate = new NgbDate(
          this.mileSecondToNGBDate(this.booking.fromDate).year,
          this.mileSecondToNGBDate(this.booking.fromDate).month,
          this.mileSecondToNGBDate(this.booking.fromDate).day
        );
        this.toDate = new NgbDate(
          this.mileSecondToNGBDate(this.booking.toDate).year,
          this.mileSecondToNGBDate(this.booking.toDate).month,
          this.mileSecondToNGBDate(this.booking.toDate).day
        );
        this.noOfrooms = this.booking.noOfRooms;
        this.getDiffDate(this.toDate, this.fromDate);
        this.checkingAvailability();

        if (
          this.booking.taxPercentage != null &&
          this.booking.taxPercentage != undefined
        ) {
          this.taxPercentage = this.booking.taxPercentage;
        } else {
          this.taxPercentage = 0;
        }

        if (
          this.businessServiceDto !== undefined &&
          this.businessServiceDto.maxLeadTime !== undefined
        ) {
          const maxLead = new Date(
            0,
            0,
            0,
            0,
            this.businessServiceDto.maxLeadTime,
            0
          );
          this.leadMaxDay = Math.floor(
            this.businessServiceDto.maxLeadTime / 1440
          );
          this.leadMaxMin = maxLead.getMinutes();
          this.leadMaxHour = maxLead.getHours();
        }

        if (
          this.businessServiceDto !== undefined &&
          this.businessServiceDto.minLeadTime !== undefined
        ) {
          const minLead = new Date(
            0,
            0,
            0,
            0,
            this.businessServiceDto.minLeadTime,
            0
          );
          // Do something with minLead?
        }

        if (
          this.businessServiceDto !== undefined &&
          this.businessServiceDto.stdPrepTime !== undefined
        ) {
          const prep = new Date(
            0,
            0,
            0,
            0,
            this.businessServiceDto.stdPrepTime,
            0
          );
          this.prepareDay = Math.floor(
            this.businessServiceDto.maxLeadTime / 1440
          );
          this.prepareHour = prep.getHours();
          this.prepareMinute = prep.getMinutes();
        }

        this.booking.propertyId = this.businessUser.id;
        this.lat = parseFloat(this.businessUser.latitude);
        this.lng = parseFloat(this.businessUser.longitude);

        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      } else {
        this.isLoadingProperty = false;
        this.router.navigate(["/error"]);
      }
    } catch (error) {
       if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(["/error"]);
      }
      this.isLoadingProperty = false;
      this.loader = false;
      // Handle the error appropriately, if needed.
    }
  }
  generateAndSetSchema() {
    // Guard against missing data.
    if (!this.businessUser || !this.businessUser.address) {
      return;
    }

  const schema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": this.businessUser?.name,
  "url": `https://bookone.io/detail/${this.businessUser?.id}`,
  "identifier": this.businessUser?.id,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": this.businessUser?.address?.streetName,
    "addressLocality": this.businessUser?.address?.city,
    "postalCode": this.businessUser?.address?.postcode,
    "addressCountry": this.businessUser?.address?.country
  },
  "telephone": this.businessUser?.mobile,
  "makesOffer": [{
    "@type": ["Offer", "LodgingReservation"],
    "checkinTime": `${this.checkinDate}T14:00:00`,   // e.g. "2025-11-26T14:00:00"
    "checkoutTime": `${this.checkoutDate}T11:00:00`, // e.g. "2025-11-28T11:00:00"
    "name": "Economy",
    "priceSpecification": {
      "@type": "CompoundPriceSpecification",
      "price": this.totalAmountParam,       // total amount
      "priceCurrency": this.businessUser.localCurrency.toUpperCase(),
      "priceComponent": [
        {
          "@type": "UnitPriceSpecification",
          "name": "Base rate",
          "price": this.totalAmountParam - this.taxAmountParam,
          "priceCurrency": this.businessUser.localCurrency.toUpperCase()
        },
        {
          "@type": "UnitPriceSpecification",
          "name": "Tax",
          "price": this.taxAmountParam,
          "priceCurrency": this.businessUser.localCurrency.toUpperCase()
        }
      ]
    },
    "availability": "https://schema.org/InStock"
  }]
};
  console.log("schema",schema);
    this.SchemaService.setSchema(schema);
  }

  increament(breakfastservice) {
    this.counterb = this.counterb + 1;
    this.serviceDto = new PropertyServiceDTO();
    this.serviceDto = breakfastservice;
    this.serviceDto.count = this.counterb;

    this.serviceDto.organisationId = this.businessUser.organisationId;
    this.serviceDto.logoUrl = this.businessUser.logoUrl;
    this.serviceDto.date = this.booking.fromDate;

    this.serviceDto.beforeTaxAmount =
      this.serviceDto.servicePrice * this.serviceDto.count;
    this.serviceDto.taxAmount =
      (this.serviceDto.beforeTaxAmount / 100) * this.serviceDto.taxPercentage;
    this.serviceDto.afterTaxAmount =
      this.serviceDto.beforeTaxAmount + this.serviceDto.taxAmount;
    //  this.addServiceList.some(e=>{
    // e.id === item.id
    //  })

    if (
      this.addServiceList.some(
        (data) => data.name === breakfastservice.name
      ) === true
    ) {
      let service = this.addServiceList.find(
        (data) => data.name === breakfastservice.name
      );
      let i = this.addServiceList.indexOf(service);
      this.addServiceList[i].count = this.serviceDto.count;
      if (
        this.addServiceList[i].servicePrice === 0 ||
        this.addServiceList[i].servicePrice === undefined
      ) {
        this.addServiceList[i].servicePrice =
          this.addServiceList[i].beforeTaxAmount;
      }
      this.addServiceList[i].beforeTaxAmount =
        this.addServiceList[i].servicePrice * this.addServiceList[i].count;
      this.addServiceList[i].taxAmount =
        (this.addServiceList[i].beforeTaxAmount / 100) *
        this.addServiceList[i].taxPercentage;
      this.addServiceList[i].afterTaxAmount =
        this.addServiceList[i].beforeTaxAmount +
        this.addServiceList[i].taxAmount;
    } else {
      this.addServiceList.push(this.serviceDto);
    }

    this.serviceDto = new PropertyServiceDTO();

    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.booking.totalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount;
    this.token.saveServiceData(this.addServiceList);
  }
  increamentL(lunchservice) {
    this.counterl = this.counterl + 1;

    this.serviceDto = new PropertyServiceDTO();
    this.serviceDto = lunchservice;
    this.serviceDto.count = this.counterl;

    this.serviceDto.organisationId = this.businessUser.organisationId;
    this.serviceDto.logoUrl = this.businessUser.logoUrl;
    this.serviceDto.date = this.booking.fromDate;

    this.serviceDto.beforeTaxAmount =
      this.serviceDto.servicePrice * this.serviceDto.count;
    this.serviceDto.taxAmount =
      (this.serviceDto.beforeTaxAmount / 100) * this.serviceDto.taxPercentage;
    this.serviceDto.afterTaxAmount =
      this.serviceDto.beforeTaxAmount + this.serviceDto.taxAmount;
    //  this.addServiceList.some(e=>{
    // e.id === item.id
    //  })

    if (
      this.addServiceList.some((data) => data.name === lunchservice.name) ===
      true
    ) {
      let service = this.addServiceList.find(
        (data) => data.name === lunchservice.name
      );
      let i = this.addServiceList.indexOf(service);
      this.addServiceList[i].count = this.serviceDto.count;
      if (
        this.addServiceList[i].servicePrice === 0 ||
        this.addServiceList[i].servicePrice === undefined
      ) {
        this.addServiceList[i].servicePrice =
          this.addServiceList[i].beforeTaxAmount;
      }
      this.addServiceList[i].beforeTaxAmount =
        this.addServiceList[i].servicePrice * this.addServiceList[i].count;
      this.addServiceList[i].taxAmount =
        (this.addServiceList[i].beforeTaxAmount / 100) *
        this.addServiceList[i].taxPercentage;
      this.addServiceList[i].afterTaxAmount =
        this.addServiceList[i].beforeTaxAmount +
        this.addServiceList[i].taxAmount;
    } else {
      this.addServiceList.push(this.serviceDto);
    }

    this.serviceDto = new PropertyServiceDTO();

    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.booking.totalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount;
    this.token.saveServiceData(this.addServiceList);
  }
  increamentD(dinnerservice) {
    this.counterd = this.counterd + 1;
    this.serviceDto = new PropertyServiceDTO();
    this.serviceDto = dinnerservice;
    this.serviceDto.count = this.counterd;

    this.serviceDto.organisationId = this.businessUser.organisationId;
    this.serviceDto.logoUrl = this.businessUser.logoUrl;
    this.serviceDto.date = this.booking.fromDate;

    this.serviceDto.beforeTaxAmount =
      this.serviceDto.servicePrice * this.serviceDto.count;
    this.serviceDto.taxAmount =
      (this.serviceDto.beforeTaxAmount / 100) * this.serviceDto.taxPercentage;
    this.serviceDto.afterTaxAmount =
      this.serviceDto.beforeTaxAmount + this.serviceDto.taxAmount;
    //  this.addServiceList.some(e=>{
    // e.id === item.id
    //  })

    if (
      this.addServiceList.some((data) => data.name === dinnerservice.name) ===
      true
    ) {
      let service = this.addServiceList.find(
        (data) => data.name === dinnerservice.name
      );
      let i = this.addServiceList.indexOf(service);
      this.addServiceList[i].count = this.serviceDto.count;
      if (
        this.addServiceList[i].servicePrice === 0 ||
        this.addServiceList[i].servicePrice === undefined
      ) {
        this.addServiceList[i].servicePrice =
          this.addServiceList[i].beforeTaxAmount;
      }
      this.addServiceList[i].beforeTaxAmount =
        this.addServiceList[i].servicePrice * this.addServiceList[i].count;
      this.addServiceList[i].taxAmount =
        (this.addServiceList[i].beforeTaxAmount / 100) *
        this.addServiceList[i].taxPercentage;
      this.addServiceList[i].afterTaxAmount =
        this.addServiceList[i].beforeTaxAmount +
        this.addServiceList[i].taxAmount;
    } else {
      this.addServiceList.push(this.serviceDto);
    }

    this.serviceDto = new PropertyServiceDTO();

    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.booking.totalAmount =
      this.booking.beforeTaxAmount +
      this.totalExtraAmount +
      this.booking.taxAmount;
    this.token.saveServiceData(this.addServiceList);
  }

  gotocheckout() {
    this.availableRooms?.forEach((room) => {
      this.booking.roomType = room.name;
      // this.booking.roomRatePlanName = plan.name;

      // Reset previous error messages
      this.showError = false;
      // this.errorMessage = '';
      room.ratesAndAvailabilityDtos?.forEach((ele) => {
        ele.roomRatePlans?.forEach((ele1) => {
          if (ele1.name === this.booking.roomRatePlanName) {
            const personsPerRoom = Math.ceil(
              this.booking.noOfPersons / this.booking.noOfRooms
            );
            if (personsPerRoom > ele1.maximumOccupancy) {
              this.roomOccupancy = ele1.maximumOccupancy;
              const requiredRooms = Math.ceil(
                this.booking.noOfPersons / ele1.maximumOccupancy
              );
              const additionalRoomsNeeded =
                requiredRooms - this.booking.noOfRooms;
              this.showError = true;
              this.errorMessage = `The number of persons exceeds the maximum occupancy of ${this.roomOccupancy} per room. You need to add ${additionalRoomsNeeded} more room(s) or reduce the number of guests to match the plan occupancy.`;
              this.showErrorPopup();
            } else {
              if (
                this.booking?.netAmount <=
                this.selectedPromotionCouponData?.minimumOrderAmount
              ) {
                localStorage.removeItem('selectedPromoData');
                localStorage.removeItem('selectPromo');
              }

              this.token.saveBookingRoomPrice(this.booking.roomPrice);
              if (this.booking.planCode === 'GHC') {
                this.token.saveLandingPrice(
                  this.totalplanPrice);
              } else {
                this.token.saveLandingPrice(this.booking.netAmount);
              }

              this.router.navigate(['/booking-checkout']);
            }
          }
        });
      });
    });
    // if(this.booking?.netAmount <= this.selectedPromotionCouponData?.minimumOrderAmount){
    //   localStorage.removeItem('selectedPromoData');
    //   localStorage.removeItem('selectPromo');
    // }
    // this.token.saveBookingRoomPrice(this.booking.roomPrice);
    // this.router.navigate(['/booking']);
  }

  showErrorPopup() {
    const bootstrap = window['bootstrap'];
    const modalElement = document.getElementById('errorModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  getPropertyDetailsBySeoName(seoName: string) {
    this.loader = true;
    this.listingService.findPropertyBySEOName(seoName).subscribe(
      (data) => {
        if (data.status === 200) {
          this.businessUser = data.body;
          this.propertyData = this.businessUser;
                   this.accommodationData =
          this.propertyData.businessServiceDtoList?.filter(
            (entry) => entry.name === 'Accommodation'
          );
        this.accommodationData?.forEach((element) => {
          this.smartRecommendationsBoolean = element.smartRecommendation;
        });
          this.getGoogleReview(this.businessUser.id);
          this.showStaticContent = true;
          // this.businessUser.businessServiceDtoList.filter(ele =>
          //   )
          this.businessUser.propertyServicesList.forEach((ele) => {
            if (ele.id != null && ele.id != undefined) {
              this.propertyServiceListData.push(ele);
            }
          });

          this.policies = this.businessUser.businessServiceDtoList.filter(
            (ele) => ele.name === 'Accommodation'
          );

          this.updateTag();
          this.changeDetectorRefs.detectChanges();
          this.token.saveProperty(this.businessUser);

          this.accommodationData?.forEach((element) => {
          this.smartRecommendationsBoolean = element.smartRecommendation;
        });

           this.accommodationData?.forEach((element) => {
          this.channelManagerIntegration = element.cmIntegration;
        });

        this.accommodationData?.forEach((element) =>{
          this.instantBooking = element.instantBooking;
        });

          if (this.urlLocation !== undefined && this.urlLocation !== null) {
            this.triggerEventService.newEvent(this.urlLocation);
          }

          this.dangerousUrl =
            'https://siteminder-git-main-rekha-credencesoft.vercel.app/propertyId/' +
            this.businessUser.id;
          this.trustedURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.dangerousUrl
          );
          this.currency = this.businessUser.localCurrency.toUpperCase();
          this.getOfferList(seoName);
          this.businessTypeName = this.businessUser.businessType;

          this.businessUser?.socialMediaLinks.forEach((element) => {
            this.socialmedialist = element;
          });

          // this.getReview(this.businessUser.id);
          // this.getBranch(this.businessUser.id);
          // this.getCustomerReview(this.businessUser.id);

          if (this.token.getBookingCity() !== null) {
            this.bookingCity = this.token.getBookingCity();
          } else {
            this.token.saveBookingCity(this.bookingCity);
          }
          this.businessServiceDto =
            this.businessUser.businessServiceDtoList.find(
              (data) => data.name === this.businessUser.businessType
            );

          if (this.businessUser.primaryColor !== undefined) {
            this.changeTheme(
              this.businessUser.primaryColor,
              this.businessUser.secondaryColor,
              this.businessUser.tertiaryColor
            );
          }

          // if (this.businessServiceDto !== null && this.businessServiceDto !== undefined) {
          //   this.slotRevdata(this.businessServiceDto);
          // }

          // if (this.businessUser.businessType === 'Accommodation') {
          // this.selectOrder = false;
          this.maxSelectRoom = this.businessUser.numberOfRooms;
          this.maxOccupancy = this.businessUser.maximumOccupancy;

          this.selectHotelBooking = true;
          if (this.token?.getRoomsData() != null) {
            this.checkingAvailability();
          }
          this.propertyServiceListDataOne =
            this.businessUser.propertyServicesList.filter(
              (ele) => Number(ele.servicePrice) > 0
            );
          if (
            this.selectedServices != null &&
            this.selectedServices != undefined
          ) {
            this.savedServices = this.token
              ?.getSelectedServices()
              ?.forEach((ele) => {
                this.propertyServiceListDataOne?.forEach((val) => {
                  if (ele.name === val.name) {
                    this.valSelected = true;
                    this.viewAddon = true;
                    val.quantity = ele.quantity;
                  }
                });
              });
          }

          if (this.token?.getRoomsData() === null) {
            // this.getRoom();
            this.checkingAvailability();

            // this.checkingAvailabilityOneDay();
          }
          // }
          if (
            this.booking.taxPercentage != null &&
            this.booking.taxPercentage != undefined
          ) {
            this.taxPercentage = this.booking.taxPercentage;

          } else {
            this.taxPercentage = 0;
          }
          // Logger.log('this.businessServiceDto : '+JSON.stringify(this.businessServiceDto));

          if (
            this.businessServiceDto !== undefined &&
            this.businessServiceDto.maxLeadTime !== undefined
          ) {
            const maxLead = new Date(
              0,
              0,
              0,
              0,
              this.businessServiceDto.maxLeadTime,
              0
            );

            this.leadMaxDay = Math.floor(
              this.businessServiceDto.maxLeadTime / 1440
            );
            this.leadMaxMin = maxLead.getMinutes();
            this.leadMaxHour = maxLead.getHours();
          }

          if (
            this.businessServiceDto !== undefined &&
            this.businessServiceDto.minLeadTime !== undefined
          ) {
            const minLead = new Date(
              0,
              0,
              0,
              0,
              this.businessServiceDto.minLeadTime,
              0
            );
          }

          if (
            this.businessServiceDto !== undefined &&
            this.businessServiceDto.stdPrepTime !== undefined
          ) {
            const prep = new Date(
              0,
              0,
              0,
              0,
              this.businessServiceDto.stdPrepTime,
              0
            );

            this.prepareDay = Math.floor(
              this.businessServiceDto.maxLeadTime / 1440
            );
            this.prepareHour = prep.getHours();
            this.prepareMinute = prep.getMinutes();
          }

          this.booking.propertyId = this.businessUser.id;
          this.lat = parseFloat(this.businessUser.latitude);
          this.lng = parseFloat(this.businessUser.longitude);

          this.loader = false;
          this.changeDetectorRefs.detectChanges();
        } else {
        }
      },
      (error) => {
        this.loader = false;
        this.router.navigate(['/error']);
        // this.router.navigate(["/error"]);
      }
    );
  }
  getBranch(id) {
    this.listingService.getBusinessBranch(id).subscribe((response) => {
      this.branchList = response.body;
      // Logger.log('this.branchList:' + JSON.stringify(this.branchList));
    });
  }

  showAllTheOfferList: any[] = [];
  // getOfferList(seo) {
  //   this.offerService
  //     .getOfferListFindBySeoFriendlyName(seo)
  //     .subscribe((data) => {
  //       this.offersList = data.body;
  //        const filteredOffers = data.body.filter(
  //       (offer) => offer.promotionAppliedFor !== 'Private'
  //     );
  //       this.showAllTheOfferList = this.checkValidCouponOrNot(filteredOffers);
  //   });
  // }
 getOfferList(seo: string) {
    if (this.activeForGoogleHotelCenter === true) {
  this.offerService
    .getOfferListFindByName(seo, 'Platform Promotion')
    .subscribe((response) => {
      if (response.body && response.body.length > 0) {
        this.offersList = [...this.offersList, ...response.body];
      }


      const currentDate = new Date();
      const validCoupons = this.offersList.filter((coupon: any) => {
        if (coupon.startDate && coupon.endDate && coupon.discountPercentage) {
          const startDate = new Date(coupon.startDate);
          const endDate = new Date(coupon.endDate);
          return (
            currentDate >= startDate &&
            currentDate <= endDate &&
            coupon.discountPercentage != 100
          );
        }
        return false;
      });

      this.showAllTheOfferList = this.checkValidCouponOrNot(validCoupons);

      this.changeDetectorRefs.detectChanges();
    });
}
 else {
      this.offerService
        .getOfferListFindBySeoFriendlyName(seo)
        .subscribe((data) => {
          if (data.body && data.body.length > 0) {
            this.offersList = data.body;
          } else {
            this.offersList = [];
          }
          this.showAllTheOfferList = this.checkValidCouponOrNot(
            this.offersList
          );
          this.changeDetectorRefs.detectChanges();
        });
    }
  }



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
  getInitial(name: string): string {
    return name?.trim().charAt(0).toUpperCase();
  }
  setResponsiveOption() {
    try {
      this.responsiveOptions = [
        {
          breakpoint: '1024px',
          numVisible: 1,
          numScroll: 1,
        },
        {
          breakpoint: '768px',
          numVisible: 1,
          numScroll: 1,
        },
      ];
    } catch (error) {
      console.error('Error in setResponsiveOption : ', error);
    }
  }

  selectedPromotionList(promo) {
    try {
      this.selectedPromotionCouponData = promo;
      const offerSection = document.getElementById('accmdOne');
      if (offerSection) {
        offerSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      const offerSection2 = document.getElementById('accmdtwo');
      if (offerSection2) {
        offerSection2.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      if (this.showPayLater() == false) {
        this.selectedPromotion = true;
        localStorage.setItem('selectedPromoData', JSON.stringify(promo));
        localStorage.setItem('selectPromo', 'true');
      }
    } catch (error) {
      console.error('Error in selectedPromotionList : ', error);
    }
  }
   showPayLater(): boolean {
  this.propertyData = this.token.getProperty();

  // Get accommodation data
  this.accommodationData = this.propertyData.businessServiceDtoList?.filter(
    (entry) => entry.name === 'Accommodation'
  );


  // ✅ 1. Check bookingEngine
  const propertyUrl = this.token.getPropertyUrl();
  const isBookingEngine = propertyUrl?.includes('bookingEngine') || false;

  if (isBookingEngine) {
    return true; // ✅ Show immediately, skip other checks
  }

    // ✅ 2. If any accommodation has payLater = true → show
  const hasPayLater = this.accommodationData?.some((a) => a.payLater);
  if (hasPayLater) {
    return false;
  }

  // ✅ 3. Instancebooking , channelmanagerIntegration false
  if(!this.channelManagerIntegration && !this.instantBooking){
    return false;
  }


  // ✅ 4. Check channelManagerIntegration
  if (this.channelManagerIntegration) {
    return true; // ✅ Show immediately, skip other checks
  }

  // ✅ 5. Both are false → apply 48-hour logic
  const fromDateTimestamp = new Date(this.booking.fromDate).getTime();
  const createdDateTimestamp = new Date(this.booking.createdDate).getTime();
  const hoursDifference =
    (fromDateTimestamp - createdDateTimestamp) / (1000 * 60 * 60);

  // ❌ If booking is within 48 hours → don't show
  if (hoursDifference < 48) {
    return false;
  }

  // ✅ If booking ≥ 48 hours and paymentGateway == null → show
  if (hoursDifference >= 48) {
    return true;
  }

  if (hoursDifference >= 48 && this.businessUser.paymentGateway !== null) {
    return true;
  }

  return false;
}

  getReview(id) {
    this.loader = true;
    this.listingService.getAllReview(id).subscribe(
      (data) => {
        if (data.status === 200) {
          this.googleReviews = data.body;
          Logger.log(
            'this.googleReviews:' + JSON.stringify(this.googleReviews)
          );
          if (this.googleReviews.length > 0) {
            this.isReviewFound = true;
          } else {
            this.isReviewFound = false;
          }
          Logger.log(JSON.stringify(this.googleReviews));
          this.loader = false;
          this.changeDetectorRefs.detectChanges();
        } else if (data.status === 404) {
          this.googleReviews = [];
        }
      },
      (error) => {
        this.loader = false;
        this.isReviewFound = false;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }
  getGoogleReview(id) {
    this.listingService.getGoogleReview(id).subscribe((response) => {
      this.googleReviews = response.body;
      // this.cdrf.detectChanges();
      // this.chunkReviews();
    });
  }
  getCustomerReview(id) {
    this.loader = true;
    this.reviewService
      .getReviewFindByPropertyIdAndReviewStatus(id, 'Approved')
      .subscribe(
        (data) => {
          if (data.status === 200) {
            this.customerReviews = data.body;
            Logger.log(
              'this.customerReviews:' + JSON.stringify(this.customerReviews)
            );
            if (this.customerReviews.length > 0) {
              this.isCustomerReviewFound = true;
            } else {
              this.isCustomerReviewFound = false;
            }
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
          } else if (data.status === 404) {
            this.customerReviews = [];
          }
        },
        (error) => {
          this.loader = false;
          this.isCustomerReviewFound = false;
          this.changeDetectorRefs.detectChanges();
        }
      );
  }
  getRoom() {
    this.hotelBookingService
      .getRoomDetailsByPropertyId(this.businessUser.id)
      .subscribe(
        (response) => {
          this.roomsone = response.body;
          // this.rooms = [];

          // for (var arr in response.body) {
          //   for (var filter in this.availableRooms) {
          //     if (response.body[arr].id === this.availableRooms[filter].roomId) {
          //       this.rooms.push(response.body[arr]);
          //       this.rooms[arr].roomRatePlans = this.availableRooms[filter].roomRatePlans;
          //     }
          //   }
          // }
          // console.log('response room ' + JSON.stringify(this.roomsone));
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
          }
        }
      );
    this.booking.noOfPersons = 1;
    this.booking.noOfRooms = 1;
  }
  getRoomByDate(fromDate: string, toDate: string) {
    this.hotelBookingService
      .getRoomDetailsByPropertyIdAndDate(this.businessUser.id, fromDate, toDate)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.roomAvailability = true;
            // Logger.log('getRoomByDate ' + JSON.stringify(response.body));

            this.roomsone = response.body;
            // Logger.log('getRoomByDate ' + JSON.stringify(this.rooms));
          } else {
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
          }
        }
      );
  }

  onPlanSelected(plan, room) {
    this.booking.roomType = room.name;
    this.booking.roomRatePlanName = plan.name;

    // Reset previous error messages
    this.showError = false;
    this.errorMessage = '';
    this.availableRooms?.forEach((room) => {
      room.ratesAndAvailabilityDtos?.forEach((ele) => {
        ele.roomRatePlans?.forEach((ele1) => {
          if (ele1.name === this.booking.roomRatePlanName) {
            const personsPerRoom = Math.ceil(
              this.booking.noOfPersons / this.booking.noOfRooms
            );
            if (personsPerRoom > ele1.maximumOccupancy) {
              this.roomOccupancy = ele1.maximumOccupancy;
              const requiredRooms = Math.ceil(
                this.booking.noOfPersons / ele1.maximumOccupancy
              );
              const additionalRoomsNeeded =
                requiredRooms - this.booking.noOfRooms;
              this.showError = true;
              this.errorMessage = `The number of persons exceeds the maximum occupancy of ${this.roomOccupancy} per room. You need to add ${additionalRoomsNeeded} more room(s) or reduce the number of guests to match the plan occupancy.`;
              this.showErrorPopup();
            }
          }
        });
      });
    });

    this.booking.roomType = room.name;

    this.showDiv = true;
    let elements = document.getElementsByClassName('sticky-button');
    (elements[0] as HTMLElement).style.display = 'block';
    let elementsone = document.getElementsByClassName('sticky-buttonmobile');
    (elementsone[0] as HTMLElement).style.display = 'block';
    this.div = true;
    this.checkAvailabilityStatus = false;
    this.checkAvailabilityStatusHide = true;
    this.checkAvailabilityStatusName = undefined;
    this.noOfrooms = this.rooms;
    if (this.booking.noOfPersons > room.maximumOccupancy) {
      this.extraPersonRate = plan.extraChargePerPerson;
    }
    this.booking.extraPersonCharge = this.extraPersonRate;
    if (
      plan.minimumOccupancy * this.booking.noOfRooms <
      this.booking.noOfPersons
    ) {
      if (plan.extraChargePerPerson !== 0) {
        this.booking.noOfExtraPerson =
          this.booking.noOfPersons -
          plan.minimumOccupancy * this.booking.noOfRooms;
        this.booking.extraPersonCharge =
          plan.extraChargePerPerson *
          this.booking.noOfExtraPerson *
          this.DiffDate;
      } else {
        this.booking.extraPersonCharge = 0;
      }
    } else {
      this.booking.noOfExtraPerson = 0;
      this.booking.extraPersonCharge = 0;
    }
    if (
      plan.noOfChildren * this.booking.noOfRooms <
      this.booking.noOfChildren
    ) {
      if (plan.extraChargePerChild !== 0) {
        this.booking.noOfExtraChild =
          this.booking.noOfChildren -
          plan.noOfChildren * this.booking.noOfRooms;
        this.booking.extraChildCharge =
          plan.extraChargePerChild *
          this.booking.noOfExtraChild *
          this.DiffDate;
      } else {
        this.booking.extraChildCharge = 0;
      }
    } else {
      this.booking.noOfExtraChild = 0;
      this.booking.extraChildCharge = 0;
    }
    this.booking.roomPrice = plan.amount;
    this.booking.netAmount =
      plan.amount * this.DiffDate * this.noOfrooms +
      this.booking.extraPersonCharge +
      this.booking.extraChildCharge;
    if (this.businessUser.taxDetails.length > 0) {
      this.businessUser.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;
          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    this.booking.roomPrice +
                      (this.booking.extraPersonCharge +
                        this.booking.extraChildCharge) /
                        this.booking.noOfNights &&
                  element2.minAmount <=
                    this.booking.roomPrice +
                      (this.booking.extraPersonCharge +
                        this.booking.extraChildCharge) /
                        this.booking.noOfNights
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  this.booking.roomPrice +
                    (this.booking.extraPersonCharge +
                      this.booking.extraChildCharge) /
                      this.booking.noOfNights
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= this.booking.netAmount &&
                  element2.minAmount <= this.booking.netAmount
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= this.booking.netAmount) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        }
      });
      // this.taxPercentage = this.booking.taxDetails[0].percentage;
    }
    if (plan !== undefined && plan.amount !== undefined) {
      this.bookingRoomPrice =
        plan.amount * this.DiffDate * this.booking.noOfRooms +
        this.booking.extraPersonCharge +
        this.booking.extraChildCharge;
      this.PlanRoomPrice = plan.amount * this.DiffDate * this.booking.noOfRooms;
    } else {
      this.bookingRoomPrice = 0;
      this.PlanRoomPrice = 0;
    }

    this.booking.taxPercentage = this.taxPercentage;
    this.planDetails = plan;
    this.booking.planCode = plan.code;
    this.booking.roomRatePlanName = plan.name;
    this.booking.roomPrice = plan.amount;
    this.planSelected = true;
    this.planAmount = plan.amount;

    let serviceList = plan.propertyServicesList;
    let anotherServiceList = [];
    serviceList
      .filter(
        (n) => n.applicableToAdult !== false || n.applicableToChild !== false
      )
      .forEach((element) => {
        let adultCount = 0;

        let childCount = 0;
        if (element.applicableToAdult === true) {
          adultCount = this.adults;
        }
        if (element.applicableToChild === true) {
          childCount = this.children;
        }

        element.count = adultCount + childCount;
        element.organisationId = this.businessUser.organisationId;
        element.logoUrl = this.businessUser.logoUrl;
        element.date = this.booking.fromDate;
        // this.serviceDto.servicePrice = this.serviceDto.beforeTaxAmount;
        element.beforeTaxAmount = element.servicePrice * element.count;
        element.taxAmount =
          (element.beforeTaxAmount / 100) * element.taxPercentage;
        element.afterTaxAmount = element.beforeTaxAmount + element.taxAmount;
        anotherServiceList.push(element);
      });

    this.token.saveServiceData(anotherServiceList);

    this.allExtraPersonCharge = this.booking.extraPersonCharge;
    this.allExtraChildCharge = this.booking.extraChildCharge;
    this.token.saveExtraPersonCharge(this.allExtraPersonCharge);
    this.token.saveChildCharge(this.allExtraChildCharge);

    // if (
    //   serviceList.length > 0 &&
    //   serviceList !== undefined &&
    //   serviceList !== null
    // ) {
    //   this.router.navigate(["/add-service"]);
    // } else {
    //   this.router.navigate(["/booking-checkout"]);
    // }
    // this.fromDate = undefined;
    // this.toDate = undefined;
    // this.booking.fromDate = undefined;
    // this.booking.toDate = undefined;?
    document.getElementById('contentOne')?.scrollIntoView();
    Logger.log(JSON.stringify(this.booking));
    Logger.log(JSON.stringify(this.checkAvailabilityStatusHide));
    this.changeDetectorRefs.detectChanges();
    // this.checkingAvailability1();
    this.planPriceSeo = [];
    this.getPlanAmount(plan);
  }
  getPlanAmount(plan: any): number[] {
    if (!plan?.name) {
      console.warn('Invalid plan input:', plan);
      console.warn('name plan input:', plan?.name);
      return [];
    }

    this.changeDetectorRefs.detectChanges();

    // ✅ Move reset logic OUTSIDE the loop
    this.taxArraySeo = [];
    this.planPriceSeo = [];
    this.extraPersonChargee = this.token.getExtraPersonCharge();
    this.extraChildChargee = this.token.getChildCharge();

    const matchedAmounts: number[] = [];

    this.planWithDateArray
      .filter(
        (entry) => Array.isArray(entry?.planList) && entry.planList.length
      )
      .forEach((entry) => {
        const matchedPlan = entry.planList.find((p) => p?.name === plan.name);
        if (matchedPlan?.amount != null) {
          matchedAmounts.push(matchedPlan.amount);

          this.planPriceSeo.push(matchedPlan.amount * this.booking.noOfRooms);

          let extraPerson = Number(this.extraPersonChargee);
          let extraChild = Number(this.extraChildChargee);
          let noOfNights = Number(this.booking.noOfNights);

          let totalPrice =
            Number(matchedPlan.amount) +
            (extraPerson + extraChild) / noOfNights;

          if (totalPrice <= 7500) {
            this.taxAmount = (totalPrice * 12) / 100;
            this.taxArraySeo.push(this.taxAmount);
          }

          if (totalPrice > 7501) {
            this.taxAmount = (totalPrice * 18) / 100;
            this.taxArraySeo.push(this.taxAmount);
          }
        }
      });

    this.changeDetectorRefs.detectChanges();

    return matchedAmounts;
  }

  // toggleReviewText(index: number): void {
  //   this.expandedReviews[index] = !this.expandedReviews[index];
  // }
  // const = document.getElementsByClassName('booking-summary')[0];
  // if(bookingSummaryElement) {
  //   bookingSummaryElement.scrollIntoView();
  // }

  getWhatsappShareUrl(): string {
    const baseUrl = 'https://api.whatsapp.com/send';
    const phoneNumber = '919082741973';
    this.dynamicText = this.businessUser.name;
    this.dynamicCity = this.businessUser?.address?.city;
    this.dynamicStreetName = this.businessUser.address?.streetName;
    this.dynamicLocality = this.businessUser.address?.locality;
    this.dynamicStreetNumber = this.businessUser.address?.streetNumber;
    this.dynamicCountryName = this.businessUser.address?.country;
    // The recipient's phone number (optional)
    const message =
      '*This is an Enquiry from :* The HotelMate Website' +
      '\nHotel Name: ' +
      this.dynamicText +
      '\nAddress: ' +
      this.dynamicStreetNumber +
      ',' +
      this.dynamicStreetName +
      ',' +
      this.dynamicLocality +
      ',' +
      this.dynamicCity +
      ',' +
      this.dynamicCountryName; // The dynamic text you want to include

    return (
      baseUrl + '?phone=' + phoneNumber + '&text=' + encodeURIComponent(message)
    );
  }

  onBookNowClick() {
    this.scrollToAccommodationDash();
  }

  scrollToAccommodation() {
    const element = document.getElementById('accmd');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToAccommodationCheckin() {
    const element = document.getElementById('checkin');
    if (element) {
      const yOffset = -2000; // Adjust this value as needed
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      const card = document.getElementById('slideCard');
      if (card && card.classList.contains('active')) {
        card.classList.remove('active');
      }
    }
  }

  scrollToAccommodationDash() {
    const element = document.getElementById('accmdOne');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
    scrollToSmartDash() {
    const element = document.getElementById('smartOne');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
adjustDates() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}



  scrollToAccommodationDashmobile() {
    const element = document.getElementById('accmdtwo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToService() {

    const element = document.getElementById('serv');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleViewMore() {
    this.viewMoreOne = !this.viewMoreOne;
  }

  scrollToPrivate() {
    const element = document.getElementById('serv');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  customerwhatsappurl(): string {
    const baseUrl = 'https://api.whatsapp.com/send';
    const phoneNumber = this.businessUser.whatsApp;
    this.dynamicText = this.businessUser.name;
    this.dynamicCity = this.businessUser?.address?.city;
    this.dynamicStreetName = this.businessUser.address?.streetName;
    this.dynamicLocality = this.businessUser.address?.locality;
    this.dynamicStreetNumber = this.businessUser.address?.streetNumber;
    this.dynamicCountryName = this.businessUser.address?.country;
    // The recipient's phone number (optional)
    const message =
      '*This is an Enquiry from :* The HotelMate Website' +
      '\nHotel Name: ' +
      this.dynamicText +
      '\nAddress: ' +
      this.dynamicStreetNumber +
      ',' +
      this.dynamicStreetName +
      ',' +
      this.dynamicLocality +
      ',' +
      this.dynamicCity +
      ',' +
      this.dynamicCountryName; // The dynamic text you want to include

    return (
      baseUrl + '?phone=' + phoneNumber + '&text=' + encodeURIComponent(message)
    );
  }

  navigate() {
    // if (
    //     serviceList.length > 0 &&
    //     serviceList !== undefined &&
    //     serviceList !== null
    //   ) {
    //     this.router.navigate(["/add-service"]);
    //   } else {
    this.token.saveBookingRoomPrice(this.booking.roomPrice);
    this.router.navigate(['/booking']);
    // }
  }
// onBookNow() {
//   const selectedAddOns = this.propertyServiceListDataOne
//     .filter(item => this.selectedFacilityNames.includes(item.name));

//     if(this.specialDiscountData){
//         const bookingData = {
//     fromDate: this.booking.fromDate,
//     toDate: this.booking.toDate,
//     totalAdults: this.totalAdults,
//     totalChildren: this.totalChildren,
//     totalNights: this.DiffDate,
//     selectedPlansSummary: this.selectedPlansSummary,
//     propertyServiceListDataOne: selectedAddOns, // ✅ only selected items
//     totalPlanPrice: this.getTotalPlanPrice(),
//     totaltaxfacilityAmount: this.getTotalTaxFacility(),
//     totalAddOnsPrice: this.getTotalAfterTaxAmountFacility() + this.getTotalTaxFacility(),
//     totalTax: this.getTotalTaxPrice(),
//     totalAmount:
//       (this.getTotalPlanPrice() +
//       this.getTotalAfterTaxAmountFacility() +
//       this.getTotalTaxPrice()) - ((this.getTotalPlanPrice() * this.specialDiscountPercentage)/100),
//   };
//       sessionStorage.setItem('bookingSummaryDetails', JSON.stringify(bookingData));
//     } else {
//         const bookingData = {
//     fromDate: this.booking.fromDate,
//     toDate: this.booking.toDate,
//     totalAdults: this.totalAdults,
//     totalChildren: this.totalChildren,
//     totalNights: this.DiffDate,
//     selectedPlansSummary: this.selectedPlansSummary,
//     propertyServiceListDataOne: selectedAddOns, // ✅ only selected items
//     totalPlanPrice: this.getTotalPlanPrice(),
//     totaltaxfacilityAmount: this.getTotalTaxFacility(),
//     totalAddOnsPrice: this.getTotalAfterTaxAmountFacility() + this.getTotalTaxFacility(),
//     totalTax: this.getTotalTaxPrice(),
//     totalAmount:
//       this.getTotalPlanPrice() +
//       this.getTotalAfterTaxAmountFacility() +
//       this.getTotalTaxPrice(),
//   };
//     sessionStorage.setItem('bookingSummaryDetails', JSON.stringify(bookingData));
//     }



//   this.router.navigate(['/booking']);
// }
onBookNow() {
  const selectedAddOns = this.propertyServiceListDataOne
    .filter(item => this.selectedFacilityNames.includes(item.name));

  if (this.activeForGoogleHotelCenter && !this.specialDiscountData ) {
  let bookingSummary = JSON.parse(sessionStorage.getItem('bookingSummaryDetails') || '{}');

  if (bookingSummary && bookingSummary.selectedPlansSummary) {
    bookingSummary.selectedPlansSummary = bookingSummary.selectedPlansSummary.map((plan: any) => {
      let newPrice = 0;
      if (plan.planName === 'GHC') {
        newPrice = this.planPrice.reduce(
          (sum, p) => sum + (p * plan.selectedRoomnumber),
          0
        );
      } else {
        newPrice = plan.actualRoomPrice * plan.selectedRoomnumber * plan.nights;
      }
      newPrice += (((plan.SingleDayextraPersonAdultCountAmount || 0) + (plan.SingleDayextraPersonChildCountAmount || 0)) * plan.nights) ;
      const newTax = (newPrice * (plan.taxpercentage || 0)) / 100;
      const newPricNonGHC = (((plan.actualRoomPrice * plan.selectedRoomnumber) + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount)) * plan.nights)
      const newTaxNonGHC = (newPricNonGHC * (plan.taxpercentage || 0)) / 100;
        if (plan.planName === 'GHC') {
                const actualRoomPrice =
      (this.planPrice[0] || 0);
        let taxTotalOne = 0;
    this.selectedPlansSummary.forEach((plan: any) => {
    if (plan.planName === 'GHC') {
      this.daterangefilter?.forEach((nights, i) => {
        const priceArray = [this.planPrice[i]];
        priceArray.forEach((price) => {
          taxTotalOne += this.calculateTaxAmount(price * plan.selectedRoomnumber + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount), plan);
        });
      });

    }
  });
      return {
        ...plan,
        actualRoomPrice: actualRoomPrice,
        price: newPrice,
        taxPercentageperroom: taxTotalOne
      };
        } else {
  let taxTotalTwo = 0;

  if (plan.planName !== 'GHC') {
    if (plan.selectedRoomnumber > 1) {
      taxTotalTwo = this.daterangefilterSeo?.reduce((sum, _, i) => {
      return sum + this.calculateTaxAmount(
        (plan.actualRoomPrice)
        + (plan.singleextraAdultCharges + plan.singleextraChildrenCharges),
        plan
      ) * plan.selectedRoomnumber;
    }, 0) || 0;
    } else {
         taxTotalTwo = this.daterangefilterSeo?.reduce((sum, _, i) => {
      return sum + this.calculateTaxAmount(
        (plan.actualRoomPrice)
        + (plan.SingleDayextraPersonAdultCountAmount + plan.SingleDayextraPersonChildCountAmount),
        plan
      ) * plan.selectedRoomnumber;
    }, 0) || 0;
    }

  }

  return {
    ...plan,
    price: newPricNonGHC,
    taxPercentageperroom: taxTotalTwo,
  };
}
    });
  }

  const totalPlanPrice = bookingSummary.selectedPlansSummary
    ? this.getGrandSubtotal()
    : this.getTotalPlanPrice();

  const totalTax = bookingSummary.selectedPlansSummary
    ? this.getGrandTaxTotal()
    : this.getTotalTaxPrice();

  const selectedAddOns = this.propertyServiceListDataOne
    .filter(item => this.selectedFacilityNames.includes(item.name));

      const  bookingData = {
      fromDate: this.booking.fromDate,
      toDate: this.booking.toDate,
      totalAdults: this.totalAdults,
      totalChildren: this.totalChildren,
      totalNights: this.DiffDate,
      selectedPlansSummary: bookingSummary.selectedPlansSummary,
      propertyServiceListDataOne: selectedAddOns,
      totalPlanPrice: totalPlanPrice,
      totalTax: totalTax,
      totalAddOnsPrice: this.getTotalAfterTaxAmountFacility() + this.getTotalTaxFacility(),
      totaltaxfacilityAmount: this.getTotalTaxFacility(),
      totalAmount: this.specialDiscountPercentage
        ? totalPlanPrice + totalTax +
          this.getTotalAfterTaxAmountFacility() +
          this.getTotalTaxFacility() -
          (totalPlanPrice * this.specialDiscountPercentage) / 100
        : totalPlanPrice + totalTax +
          this.getTotalAfterTaxAmountFacility() +
          this.getTotalTaxFacility(),
    };
    sessionStorage.setItem('bookingSummaryDetails', JSON.stringify(bookingData));
  } else if(this.specialDiscountData && !this.activeForGoogleHotelCenter){
    if (this.specialDiscountData) {
  this.selectedPlansSummary = this.selectedPlansSummary.map(plan => {
    let discountedPrice = plan.price;

          if (this.businessUser?.taxDetails?.length > 0) {
      this.businessUser?.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;

          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    discountedPrice &&
                  element2.minAmount <= discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= discountedPrice &&
                  element2.minAmount <= discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= discountedPrice) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        }
      });
    }

    if (plan.selectedRoomnumber > 1) {
            this.priceingO = plan.actualRoomPrice +
                  (plan.singleextraAdultCharges || 0) +
                  (plan.singleextraChildrenCharges || 0) || 0;
          } else {
            this.priceingO =  plan.actualRoomPrice +
                  (plan.SingleDayextraPersonAdultCountAmount || 0) +
                  (plan.SingleDayextraPersonChildCountAmount || 0) || 0;
          }
            const price = this.priceingO || 0;
          let discountAmount = 0;
           discountAmount = (plan.price * this.specialDiscountData.discountPercentage) / 100;
          discountedPrice = price;

          if (this.specialDiscountData?.discountPercentage) {
            discountedPrice -= discountAmount;
          }
              if (this.businessUser?.taxDetails?.length > 0) {
      this.businessUser?.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;

          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    discountedPrice &&
                  element2.minAmount <= discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (element.taxSlabsList.length >= 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= discountedPrice &&
                  element2.minAmount <= discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= discountedPrice) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        }
      });
    }
    const taxPercent = this.taxPercentage || 0;
    discountedPrice = plan.price - discountAmount;
    const taxAmount = (((discountedPrice * taxPercent) / 100) );

    return {
      ...plan,
      discountedPrice,
      discountAmount,
      taxpercentage: taxPercent,
      taxPercentageperroom: taxAmount,
      finalPrice: discountedPrice + taxAmount
    };
  });
}
        const bookingData = {
    fromDate: this.booking.fromDate,
    toDate: this.booking.toDate,
    totalAdults: this.totalAdults,
    totalChildren: this.totalChildren,
    totalNights: this.DiffDate,
    selectedPlansSummary: this.selectedPlansSummary,
    propertyServiceListDataOne: selectedAddOns, // ✅ only selected items
    totalPlanPrice: this.getTotalPlanPrice(),
    totaltaxfacilityAmount: this.getTotalTaxFacility(),
    totalAddOnsPrice: this.getTotalAfterTaxAmountFacility() + this.getTotalTaxFacility(),
    totalTax: this.getTotalTaxPrice(),
    totalAmount:
      ((this.getTotalPlanPrice() +
      this.getTotalAfterTaxAmountFacility()) - ((this.getTotalPlanPrice() * this.specialDiscountPercentage)/100)) + this.getTotalTaxPrice(),
  };
      sessionStorage.setItem('bookingSummaryDetails', JSON.stringify(bookingData));
    } else if(this.specialDiscountData && this.activeForGoogleHotelCenter){
    if (this.specialDiscountData) {
  this.selectedPlansSummary = this.selectedPlansSummary.map(plan => {
    let discountedPrice = plan.price;

          if (this.businessUser?.taxDetails?.length > 0) {
      this.businessUser?.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;

          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    discountedPrice &&
                  element2.minAmount <= discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= discountedPrice &&
                  element2.minAmount <= discountedPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= discountedPrice) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        }
      });
    }

    let discountAmount = 0;
      discountAmount = (plan.price * this.specialDiscountData.discountPercentage) / 100;
      discountedPrice -= discountAmount;
        let discountedPriceOne = 0;
       if (plan.selectedRoomnumber > 1) {
          discountedPriceOne = ((plan.actualRoomPrice) +
        (plan.singleextraAdultCharges || 0) +
        (plan.singleextraChildrenCharges || 0));

        } else {
          discountedPriceOne = ((plan.actualRoomPrice) +
        (plan.SingleDayextraPersonAdultCountAmount || 0) +
        (plan.SingleDayextraPersonChildCountAmount || 0));

        }
              if (this.businessUser?.taxDetails?.length > 0) {
      this.businessUser?.taxDetails.forEach((element) => {
        if (element.name === 'GST') {
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;

          if (
            plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true
          ) {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >=
                    discountedPriceOne &&
                  element2.minAmount <= discountedPriceOne
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <=
                  discountedPriceOne
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          } else {
            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount >= discountedPriceOne &&
                  element2.minAmount <= discountedPriceOne
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (element2.maxAmount <= discountedPriceOne) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        }
      });
    }
    const taxPercent = this.taxPercentage || 0;
    const taxAmount = (discountedPrice * taxPercent) / 100;

    return {
      ...plan,
      discountedPrice,
      discountAmount,
      taxpercentage: taxPercent,
      taxPercentageperroom: taxAmount,
      finalPrice: discountedPrice + taxAmount
    };
  });
}
        const bookingData = {
    fromDate: this.booking.fromDate,
    toDate: this.booking.toDate,
    totalAdults: this.totalAdults,
    totalChildren: this.totalChildren,
    totalNights: this.DiffDate,
    selectedPlansSummary: this.selectedPlansSummary,
    propertyServiceListDataOne: selectedAddOns, // ✅ only selected items
    totalPlanPrice: this.getTotalPlanPrice(),
    totaltaxfacilityAmount: this.getTotalTaxFacility(),
    totalAddOnsPrice: this.getTotalAfterTaxAmountFacility() + this.getTotalTaxFacility(),
    totalTax: this.getGrandTaxTotal(),
    totalAmount: ((this.getGrandSubtotal() - ((this.getGrandSubtotal() * this.specialDiscountPercentage) / 100)))
                    + this.getGrandTaxTotal(),
  };
      sessionStorage.setItem('bookingSummaryDetails', JSON.stringify(bookingData));
    }else {

   const bookingData = {
      fromDate: this.booking.fromDate,
      toDate: this.booking.toDate,
      totalAdults: this.totalAdults,
      totalChildren: this.totalChildren,
      totalNights: this.DiffDate,
      selectedPlansSummary: this.selectedPlansSummary,
      propertyServiceListDataOne: selectedAddOns,
      totalPlanPrice: this.getTotalPlanPrice(),
      totalTax: this.getTotalTaxPrice(),
      totalAddOnsPrice: this.getTotalAfterTaxAmountFacility() + this.getTotalTaxFacility(),
      totaltaxfacilityAmount: this.getTotalTaxFacility(),
      totalAmount: this.specialDiscountPercentage
        ? this.getTotalPlanPrice() +
          this.getTotalAfterTaxAmountFacility() +
          this.getTotalTaxPrice() -
          (this.getTotalPlanPrice() * this.specialDiscountPercentage) / 100
        : this.getTotalPlanPrice() +
          this.getTotalAfterTaxAmountFacility() +
          this.getTotalTaxPrice(),
    };
    sessionStorage.setItem('bookingSummaryDetails', JSON.stringify(bookingData));
  }

  this.router.navigate(['/booking']);
}

  opendate() {
    this.oneDayTrip = true;
    this.selectBooking = false;
  }
  changedate() {
    this.oneDayTrip = false;
    this.selectBooking = true;
  }
  onDayTripPlanSelected(plan, room) {
    this.checkAvailabilityStatus = false;
    this.checkAvailabilityStatusHide = true;
    this.checkAvailabilityStatusName = undefined;

    this.booking.extraPersonCharge = plan.extraChargePerPerson;
    this.booking.extraChildCharge = plan.extraChargePerChild;

    this.booking.netAmount =
      plan.amount * this.DiffDate * this.noOfrooms +
      this.booking.extraPersonCharge +
      this.booking.extraChildCharge;
    this.booking.notes =
      'Adult (' +
      this.booking.noOfPersons +
      ' X ' +
      this.booking.extraPersonCharge +
      '): ' +
      this.booking.noOfPersons * this.booking.extraPersonCharge +
      ', Child(' +
      this.booking.noOfChildren +
      ' X ' +
      this.booking.extraChildCharge +
      '): ' +
      this.booking.noOfChildren * this.booking.extraChildCharge +
      '';

    // if (this.businessUser.taxDetails.length > 0) {
    //   this.businessUser.taxDetails.forEach((element) => {
    //     if (element.name === 'GST') {
    //       this.booking.taxDetails = [];
    //       this.booking.taxDetails.push(element);
    //       this.taxPercentage = element.percentage;
    //       this.booking.taxPercentage = this.taxPercentage;
    //       if (element.taxSlabsList.length > 0) {
    //         element.taxSlabsList.forEach((element2) => {
    //           if (
    //             element2.maxAmount > this.booking.netAmount &&
    //             element2.minAmount < this.booking.netAmount
    //           ) {
    //             this.taxPercentage = element2.percentage;
    //             this.booking.taxPercentage = this.taxPercentage;
    //           } else if (element2.maxAmount < this.booking.netAmount) {
    //             this.taxPercentage = element2.percentage;
    //             this.booking.taxPercentage = this.taxPercentage;
    //           }
    //         });
    //       }
    //     }
    //   });

    // }
    if (this.businessUser.taxDetails.length > 0) {
      this.taxPercentage = this.businessUser.taxDetails[0].percentage;
    }
    if (this.businessUser.taxDetails[0].taxSlabsList.length > 0) {
      this.businessUser.taxDetails[0].taxSlabsList.forEach((element) => {
        if (
          element.maxAmount > this.booking.netAmount &&
          element.minAmount < this.booking.netAmount
        ) {
          this.taxPercentage = element.percentage;
        } else if (element.maxAmount < this.booking.netAmount) {
          this.taxPercentage = element.percentage;
        }
      });
    }
    if (plan !== undefined && plan.amount !== undefined) {
      this.bookingRoomPrice =
        plan.amount * this.DiffDate * this.booking.noOfRooms +
        this.booking.extraPersonCharge +
        this.booking.extraChildCharge;
      this.PlanRoomPrice = plan.amount * this.DiffDate * this.booking.noOfRooms;
    } else {
      this.bookingRoomPrice = 0;
      this.PlanRoomPrice = 0;
    }
    if (this.businessUser.taxDetails.length > 0) {
      this.taxPercentage = this.businessUser.taxDetails[0].percentage;
    }
    if (this.businessUser.taxDetails[0].taxSlabsList.length > 0) {
      this.businessUser.taxDetails[0].taxSlabsList.forEach((element) => {
        if (
          element.maxAmount > this.booking.netAmount &&
          element.minAmount < this.booking.netAmount
        ) {
          this.taxPercentage = element.percentage;
        } else if (element.maxAmount < this.booking.netAmount) {
          this.taxPercentage = element.percentage;
        }
      });
    }
    this.planDetails = plan;
    this.booking.planCode = plan.code;
    this.booking.roomRatePlanName = plan.name;
    this.booking.roomPrice = plan.amount;
    this.planSelected = true;
    this.planAmount = plan.amount;

    let serviceList = plan.propertyServicesList;
    let anotherServiceList = [];

    serviceList
      .filter(
        (n) => n.applicableToAdult !== false || n.applicableToChild !== false
      )
      .forEach((element) => {
        if (
          element.applicableToAdult === false &&
          element.applicableToChild === false
        ) {
          element = null;
          // anotherServiceList.push(element);
        } else {
          let adultCount = 0;
          let childCount = 0;
          if (element.applicableToAdult === true) {
            adultCount = this.adults;
          }
          if (element.applicableToChild === true) {
            childCount = this.children;
          }

          element.count = adultCount + childCount;
          if (element.count > 0) {
            element.organisationId = this.businessUser.organisationId;
            element.logoUrl = this.businessUser.logoUrl;
            element.date = this.booking.fromDate;
            // this.serviceDto.servicePrice = this.serviceDto.beforeTaxAmount;
            element.beforeTaxAmount = element.servicePrice * element.count;
            element.taxAmount =
              (element.beforeTaxAmount / 100) * element.taxPercentage;
            element.afterTaxAmount =
              element.beforeTaxAmount + element.taxAmount;
            anotherServiceList.push(element);
          }
        }

        // element.count = this.adults+this.children;
      });
    if (
      serviceList.length > 0 &&
      serviceList !== undefined &&
      serviceList !== null
    ) {
      this.router.navigate(['/add-service-odt']);
    } else {
      this.router.navigate(['/booking-odt']);
    }

    this.token.saveServiceData(anotherServiceList);
    // this.fromDate = undefined;
    // this.toDate = undefined;
    // this.booking.fromDate = undefined;
    // this.booking.toDate = undefined;
    Logger.log(JSON.stringify(this.booking));
    Logger.log(JSON.stringify(this.checkAvailabilityStatusHide));
    this.changeDetectorRefs.detectChanges();
    // this.checkingAvailability();
  }
  bookOneDayTrip() {
    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.adults;
    this.booking.noOfChildren = this.children;

    // this.booking.netAmount =
    this.changeDetectorRefs.detectChanges();

    this.token.saveBookingData(this.booking);
    // this.router.navigate(['/add-service-odt']);
  }

  onRoomBook(roomId, index, indexOne) {
    // //console.log("ftgyhjkl"+JSON.stringify(this.booking))
    // this.checkAvailabilityStatus = false;
    // this.selectedRoomIndex = indexOne;
    this.selectedIndex = index;
    this.viewAddon = true;

    this.scrollToService();

    const stickyCard = document.getElementById('stickyCard');

    stickyCard.classList.toggle('show');

    // this.getPlan(roomId);
  }

  getPlan(roomId: string) {
    this.loader = true;
    this.hotelBookingService
      .getPlan(String(this.businessUser.id), roomId)
      .subscribe(
        (data) => {
          if (data.status === 200) {
            this.plans = data.body;
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
            this.hasPlan = true;

            Logger.log('this.plans : ' + JSON.stringify(this.plans));
          } else if (data.status === 404) {
            this.hasPlan = false;
            this.plans = null;
            this.changeDetectorRefs.detectChanges();
            Logger.log('this.plans : ' + JSON.stringify(this.plans));
          }
        },
        (error) => {
          this.hasPlan = false;
          this.plans = null;
          this.changeDetectorRefs.detectChanges();
          Logger.log('this.plans : ' + JSON.stringify(this.plans));
          // Logger.log(JSON.stringify(error));
          this.loader = false;
        }
      );
  }

  getDateDBFormat(date: Date) {
    let currentDay: string;
    let currentMonth: string;

    if (date.getDate().toString().length === 1) {
      currentDay = '0' + date.getDate();
    } else {
      currentDay = '' + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length === 1) {
      currentMonth = '0' + (date.getMonth() + 1);
    } else {
      currentMonth = '' + (date.getMonth() + 1);
    }

    return currentDay + '-' + currentMonth + '-' + date.getFullYear();
  }
  setFromDate() {
    this.booking.fromDate = this.getDateFormatYearMonthDay(
      this.fromDate.day,
      this.fromDate.month,
      this.fromDate.year
    );
  }
  setToDate() {
    this.booking.toDate = this.getDateFormatYearMonthDay(
      this.toDate.day,
      this.toDate.month,
      this.toDate.year
    );
  }
  getDateFormatYearMonthDay(
    day12: number,
    month12: number,
    year12: number
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

    return `${year}-${month1}-${day1}`;
  }
  getDateFormatDayMonthYear(
    day12: number,
    month12: number,
    year12: number
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
  oneDayTripShow() {}
  toggleCard() {
    const card = document.getElementById('slideCard');
    card.classList.toggle('active');
  }
  resetForm() {
    this.checkAvailabilityDisabled = false;
    this.adults = 1;
    this.children = 0;
    this.rooms = 1;
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.isPopupOpen = false;
    this.enteredCoupon = '';
    this.isCardVisible = false;
    this.token.clearAllTaxArray();
    this.token.clearExtraPersonCharge();
    this.token.clearExtraChildCharge();
  }
  clicked() {
    this.checkAvailabilityDisabled = true;
  }

  checkingAvailability() {

    this.smartLoading = true;
    if (this.activeForGoogleHotelCenter === true) {
      this.showDiv = false;
    }
    this.isSuccess = true;
    this.headerTitle = 'Success!';
    this.bodyMessage = 'CheckAvailability Clicked ';

    this.showSuccess(this.contentDialog);
    setTimeout(() => {
      this.showAlert = false;
      this.changeDetectorRefs.detectChanges();
      // document.getElementById("content").scrollIntoView();
    }, 1000);

    this.loaderHotelBooking = true;
    this.checkAvailabilityStatusHide = false;
    this.booking.propertyId = this.businessUser.id;

          if (
      this.fromDate.day != null &&
      this.fromDate.month != null &&
      this.fromDate.year != null
    ) {
      this.booking.fromDate = this.getDateFormatYearMonthDay(
        this.fromDate.day,
        this.fromDate.month,
        this.fromDate.year
      );
    } else {
      let currentDate = new Date();
      this.booking.fromDate = this.getDateFormatYearMonthDay(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
    }
        if (
      this.toDate.day != null &&
      this.toDate.month != null &&
      this.toDate.year != null
    ) {
      this.booking.toDate = this.getDateFormatYearMonthDay(
        this.toDate.day,
        this.toDate.month,
        this.toDate.year
      );
    } else {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      this.booking.toDate = this.getDateFormatYearMonthDay(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
    }




    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.totalAdults;
    this.booking.noOfChildren = this.totalChildren;
    this.booking.noOfRooms = this.rooms;
    this.booking.noOfNights = this.DiffDate;
    this.token.saveBookingData(this.booking);
    sessionStorage.setItem('bookingSummary', JSON.stringify(this.additionalRooms))
    // Logger.log('checkAvailability submit' + JSON.stringify(this.booking));

    this.hotelBookingService
      .checkAvailabilityByProperty(
        this.booking.fromDate,
        this.booking.toDate,
        this.booking.noOfRooms,
        this.booking.noOfPersons,
        this.booking.propertyId
      )
      .subscribe(
        (response) => {
          this.loaderHotelBooking = false;
          this.availableRooms = response.body.roomList;
            this.availableRooms = response.body.roomList.sort(
            (a: any, b: any) => b.roomOnlyPrice - a.roomOnlyPrice
          );

          this.availableRooms = this.availableRooms.filter(room =>
          room.ratesAndAvailabilityDtos?.length > 0 &&
          (room.ratesAndAvailabilityDtos[0]?.stopSellOBE === null || room.ratesAndAvailabilityDtos[0]?.stopSellOBE === false) &&
          (room.ratesAndAvailabilityDtos[0]?.stopSellOTA === null || room.ratesAndAvailabilityDtos[0]?.stopSellOTA === false)
        );

                if(this.activeForGoogleHotelCenter === true) {
          this.getAvailableRoomsForGHC(this.availableRooms);
        }
    // Filter sold-out rooms
          this.soldOutRooms = response.body.roomList.filter(room =>
            room.ratesAndAvailabilityDtos === null ||
            (room.ratesAndAvailabilityDtos[0]?.stopSellOBE != null && room.ratesAndAvailabilityDtos[0]?.stopSellOBE !== false) ||
            (room.ratesAndAvailabilityDtos[0]?.stopSellOTA != null && room.ratesAndAvailabilityDtos[0]?.stopSellOTA !== false)
          );
          this.SubAvailableRooms = response.body.roomList;
          const queryParams = {
             noOfChildren: this.children,
             noOfAdults: this.booking.noOfPersons,
            checkInDate: this.booking.fromDate,
            checkOutDate: this.booking.toDate,
            noOfRooms: this.rooms,
          };

          const roomList = response.body.roomList;

          if(this.smartRecommendationsBoolean) {
            this.hotelBookingService.getRecommendations(queryParams, roomList).subscribe({
            next: (res) => {
              this.smartLoading = false;
              this.smartRecommendations = res;
                this.categories = [];
['bestFitOptions', 'luxuryOptions', 'comfortOptions', 'budgetOptions'].forEach(cat => {
          if (this.smartRecommendations?.[cat]) {
            this.smartRecommendations[cat].forEach((room: any) => {
              room.plans.sort((a: any, b: any) => a.totalPrice - b.totalPrice);
            });
          }
        });

        // Build and sort categories
        const tempCategories: { key: string; label: string; minPrice: number }[] = [];

        if (this.smartRecommendations?.bestFitOptions?.length) {
          tempCategories.push({
            key: 'bestFitOptions',
            label: 'Best-Fit',
            minPrice: this.getCategoryMinPrice(this.smartRecommendations.bestFitOptions)
          });
        }
        if (this.smartRecommendations?.luxuryOptions?.length) {
          tempCategories.push({
            key: 'luxuryOptions',
            label: 'Luxury',
            minPrice: this.getCategoryMinPrice(this.smartRecommendations.luxuryOptions)
          });
        }
        if (this.smartRecommendations?.comfortOptions?.length) {
          tempCategories.push({
            key: 'comfortOptions',
            label: 'Comfort',
            minPrice: this.getCategoryMinPrice(this.smartRecommendations.comfortOptions)
          });
        }
        if (this.smartRecommendations?.budgetOptions?.length) {
          tempCategories.push({
            key: 'budgetOptions',
            label: 'Budget',
            minPrice: this.getCategoryMinPrice(this.smartRecommendations.budgetOptions)
          });
        }
        this.changeDetectorRefs.detectChanges();
        this.categories = tempCategories.sort((a, b) => b.minPrice - a.minPrice);
            },
            error: (err) => {
               this.smartLoading = false;
              console.error('Error fetching recommendations:', err);
            }
          });
          }


          // Sort the rooms so that rooms with the "Economy" rate plan come first
          // const sortedRooms = this.availableRooms.sort((a, b) => {
          //   const hasEconomyA = a.ratesAndAvailabilityDtos.some(dto =>
          //     dto.roomRatePlans.some(plan => plan.name === "Economy")
          //   );
          //   const hasEconomyB = b.ratesAndAvailabilityDtos.some(dto =>
          //     dto.roomRatePlans.some(plan => plan.name === "Economy")
          //   );

          //   // If A has "Economy" and B doesn't, A should come first
          //   if (hasEconomyA && !hasEconomyB) return -1;
          //   if (!hasEconomyA && hasEconomyB) return 1;
          //   return 0; // Keep original order if both have or don't have "Economy"
          // });


          // console.log('sortedRooms is',sortedRooms);

                    this.shortrooms =  response.body.roomList;
          //           console.log('after response is',sortedRooms);

          // (window as any).dataLayer = (window as any).dataLayer.filter(event => event.event !== 'hotel_booking');
          // setTimeout(() => {
          //   this.pushDataToDataLayer();
          // }, 2000);
          let facilities = this.businessUser.propertyServicesList;

          if (
            this.availableRooms !== null &&
            this.availableRooms !== undefined
          ) {
            this.availableRooms.forEach((room) => {
              room?.roomFacilities?.forEach((element) => {
                if (element.name == 'Bar') {
                  this.bar = element;
                }
                if (element.name == 'Pub') {
                  this.pub = element;
                }
                if (element.name == 'Swimming Pool') {
                  this.swimming = element;
                }
                if (element.name == 'Pet Friendly') {
                  this.pet = element;
                }
                if (element.name == 'Air-Condition') {
                  this.ac = element;
                }
                if (element.name == 'Wifi') {
                  this.wifi = element;
                }
                if (element.name == 'Flat TV') {
                  this.tv = element;
                }
              });
              if (room.dayTrip == true) {
                this.dayOneTrip = true;
                // console.log('dayonetrip: ' + this.dayOneTrip);
              } else {
                this.dayOneTrip = false;
              }
            });
          }
          this.roomWithGHCPlan = [];
          this.Googlehotelsortrooms = [];
          let ghcPlan = new RoomRatePlans();
          this.daterange = [];
          this.daterangefilter = [];

          this.availableRooms?.forEach((event) => {
            event?.ratesAndAvailabilityDtos?.forEach((event2) => {
              event2?.roomRatePlans?.forEach((plan) => {
                if (
                  plan?.code === 'GHC' &&
                  this.activeForGoogleHotelCenter === true
                ) {
                  if (
                    plan?.otaPlanList != null &&
                    plan?.otaPlanList != undefined &&
                    plan?.otaPlanList?.length > 0
                  ) {
                    plan.otaPlanList.forEach((element) => {
                      if (element?.otaName === 'GHC') {
                        plan.amount = element?.price;
                        this.daterange.push(event2.date);

                        // Convert timestamps to formatted dates
                        const datePipe = new DatePipe('en-US');
                        this.daterange.forEach((timestamp) => {
                          let formattedDate = datePipe.transform(
                            new Date(timestamp),
                            'yyyy-MM-dd'
                          );
                          const inputDate = new Date(timestamp);
                          // formattedDate = inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          formattedDate = inputDate.toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' }
                          ); // Adjust the format as needed
                          this.daterangefilter.push(formattedDate);
                        });

                        // Log the array of formatted dates
                      }
                    });
                  }
                  this.daterangefilter = Array.from(
                    new Set(this.daterangefilter)
                  );
                  // console.log(JSON.stringify(this.daterangefilter));

                  event2.roomRatePlans = [];
                  ghcPlan = plan;
                  event2.roomRatePlans.push(ghcPlan);
                  this.roomWithGHCPlan?.push(event);
                }
              });
            });
          });
          this.planPrice = [];
          this.taxArray = [];

          this.roomWithGHCPlan[0]?.ratesAndAvailabilityDtos.forEach((e) => {
            e.roomRatePlans.forEach((element) => {
              if (element.otaPlanList.length > 0) {
                this.allPalnPrice = true;
              }
              element.otaPlanList.forEach((element2) => {

                if (element2.otaName === 'GHC') {
                  this.planPrice.push(element2.price * this.booking.noOfRooms);
                  let extraPerson = this.extraAdultCharge;
                  let extraChild = this.extraChildrenCharge;
                  let noOfNights = Number(this.booking.noOfNights);


                  let totalPrice =
                    Number(element2.price) +
                    (extraPerson + extraChild) / noOfNights;
                    // console.log('taxArray is',this.taxArray);
                    // console.log('element2.price is',element2.price);
                    // console.log('extraPerson is',extraPerson);
                    // console.log('extraChild is',extraChild);
                    // console.log('noOfNights is',noOfNights);
                  // let totalPrice = Number(element2.price) + Number((this.extraPersonChargee) + Number(this.extraChildChargee) / (this.booking.noOfNights));
                  if (totalPrice <= 7500) {
                    this.taxAmount =
                      ((totalPrice * this.booking.noOfRooms) * 12) / 100;
                    this.taxArray.push(this.taxAmount);

                  }

                  if (totalPrice > 7501) {
                    this.taxAmount =
                      ((totalPrice * this.booking.noOfRooms) * 18) / 100;
                    this.taxArray.push(this.taxAmount);

                  }

                  this.totalplanPrice = this.planPrice.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  );
                  if (
                    this.activeForGoogleHotelCenter === true &&
                    element.otaPlanList.length > 0
                  ) {
                    this.token.saveLandingPrice(this.totalplanPrice);
                  }
                }
                // console.log(
                //   'ota price is equa;' + JSON.stringify(this.planPrice)
                // );
              });
            });
          });

          this.datewisePriceMap = {}; // reset
          this.daterangefilterSeo = [];
          this.planObj = [];
          this.planWithDateArray = []; // NEW ARRAY
          this.planPriceSeo = [];

          this.availableRooms?.forEach((event) => {
            event?.ratesAndAvailabilityDtos?.forEach((event3) => {
              const inputDate = new Date(event3.date);
              const formattedDate = inputDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              if (!this.datewisePriceMap[formattedDate]) {
                this.datewisePriceMap[formattedDate] = [];
                this.daterangefilterSeo.push(formattedDate);
              }

              this.planWithDateArray.push({
                date: formattedDate,
                planList: event3?.roomRatePlans,
              });
            });
          });
          sessionStorage.setItem(
                  'hasAvailableRoomsData',
                  JSON.stringify(this.availableRooms)
                );
          // localStorage.setItem('totalPlanPrice', this.totalplanPrice.toString());

          this.Googlehotelsortrooms = this.roomWithGHCPlan;
          this.availableRooms?.forEach((des) => {
            const hasAvailableRooms = des?.ratesAndAvailabilityDtos?.some(

              (des2) => {
                des2?.otaAvailabilityList.forEach((element) => {
                  if (element?.otaName === 'GHC') {
                    element.noOfAvailable = this.otaAvailableRooms;
                  }
                });
                // console.log('my data is ', des2);
                return des2.stopSellOBE !== true && des2.stopSellOBE !== null;
              }
            );

            this.isDiabled = !hasAvailableRooms;
          });

          if (facilities !== null && facilities !== undefined) {
            facilities.forEach((fac) => {
              if (fac.name == 'Breakfast (Adult)' || fac.name == 'Breakfast') {
                this.breakfast = fac;
              }
              if (fac.name == 'Laundry') {
                this.laundry = fac;
              }
              if (fac.name == 'Pick Up') {
                this.pickup = fac;
              }
              if (fac.name == 'Late Check-Out') {
                this.checkout = fac;
              }
              if (fac.name == 'Drop Off') {
                this.dropoff = fac;
              }
              if (fac.name == 'Lunch') {
                this.lunch = fac;
              }
              if (fac.name == 'Dinner') {
                this.dinner = fac;
              }
              if (fac.serviceType == 'Distance') {
                this.distance = fac;
              }
              if (fac.serviceType == 'RestaurantHotel') {
                this.isRestaurant = fac;
              }
              if (fac.serviceType == 'DistanceRailway') {
                this.DistanceRailway = fac;
              }
              if (fac.serviceType == 'DistanceBusStop') {
                this.isDistanceBusStop = fac;
              }

              if (fac.serviceType == 'DistanceTouristPlace') {
                this.isDistanceTouristPlace = fac;
              }

              if (fac.name == 'BreakFast, Lunch, Dinner') {
                this.bld = fac;
              }
            });
          }
          this.checkAvailabilityStatus = response.body.available;
          this.booking.bookingAmount = response.body.bookingAmount;
          // this.booking.extraPersonCharge = response.body.extraPersonCharge;
          this.maxSelectRoom = response.body.numberOfRooms;
          // this.selectedRoomMaximumOccupancy = response.body.noOfPersons;

          this.availableRooms.forEach((ele) => {
            if (
              ele.ratesAndAvailabilityDtos != null &&
              ele.ratesAndAvailabilityDtos != undefined &&
              ele.ratesAndAvailabilityDtos.length > 0
            ) {
              // console.log("Available rooms: "+JSON.stringify(ele.ratesAndAvailabilityDtos));
              this.availability = true;
            } else {
              this.allDtosNull();
            }
          });
          // console.log('this.availability: ' + this.availability);
          // if (this.availableRooms === null && this.availableRooms === undefined) {
          //   this.availability =false;
          // }
          if (response.body.available === true) {
            this.checkAvailabilityStatusName = 'Available';
          } else {
            this.checkAvailabilityStatusName = 'Not Available';
          }

          // Logger.log('checkAvailability ' + JSON.stringify(response.body));
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            Logger.log('checkAvailability error');
          }
        }
      );
    setTimeout(() => {
      if (this.activeForGoogleHotelCenter == true) {
        this.fetchAndProcessRoomsDataOne();
      } else if (this.activeForGoogleHotelCenter == false) {
        this.fetchAndProcessRoomsData();
      }
    }, 3000);
    // this.sortAndLimitRoomsOne();
    this.token.clearAllTaxArray();
    this.getTotalTaxFee();
  }
    getCategoryMinPrice(optionRooms: any[]): number {
    let min = Infinity;
    optionRooms.forEach(room => {
      room.plans.forEach((plan: any) => {
        if (plan.totalPrice < min) {
          min = plan.totalPrice;
        }
      });
    });
    return min;
  }

  // get cheapest plan from a category
  getCheapestPlan(categoryKey: string) {
    const rooms = this.smartRecommendations[categoryKey] || [];
    let cheapestPlan: any = null;

    rooms.forEach(room => {
      room.plans.forEach((plan: any) => {
        if (!cheapestPlan || plan.totalPrice < cheapestPlan.totalPrice) {
          cheapestPlan = {
            ...plan,
            roomName: room.roomName,
            availableCount: room.availableCount
          };
        }
      });
    });

    return cheapestPlan;
  }
isPlanSelected(planName: string): boolean {
  return this.selectedPlansSummary.some(
    (p) => p.planName === planName
  );

}


  toggleDropdownNights(index) {
    this.isOpen = !this.isOpen;
  }

onFacilityToggle(name: string, isChecked: boolean): void {
  if (isChecked) {
    this.selectedFacilityNames.push(name);
  } else {
    this.selectedFacilityNames = this.selectedFacilityNames.filter(n => n !== name);
  }
}


getTotalAfterTaxAmountFacility(): number {
  const limit = this.viewMore ? this.propertyServiceListDataOne.length : 4;
  return this.propertyServiceListDataOne
    .slice(0, limit)
    .filter(item => this.selectedFacilityNames.includes(item.name))
    .reduce((sum, item) => sum + (item?.servicePrice || 0), 0);
}
getTotalTaxFacility(): number {
  const limit = this.viewMore ? this.propertyServiceListDataOne.length : 4;
  return this.propertyServiceListDataOne
    .slice(0, limit)
    .filter(item => this.selectedFacilityNames.includes(item.name))
    .reduce((sum, item) => sum + (item?.taxAmount || 0), 0);
}
get totalEachPlanPrice(): number {
  return this.planPrice?.reduce((sum, price) => sum + price, 0) || 0;
}

calculateConvenienceFee(totalAmount: number, percentage: number): number {
  if (!totalAmount || !percentage) {
    return 0;
  }

  const fee = (totalAmount * percentage) / 100;
  return Number(fee.toFixed(2));
}

  getTotalPlanPrice(): number {
    return (
      this.selectedPlansSummary?.reduce(
        (sum, plan) => sum + (plan?.price || 0),
        0
      ) || 0
    );
  }

//   getTotalTaxPrice(): number {
//         const savedBooking = sessionStorage.getItem('bookingSummaryDetails');
//   if (savedBooking) {
//     const data = JSON.parse(savedBooking);
//     this.selectedPlansSummary = data.selectedPlansSummary
//   }
//   const couponCodeValues = sessionStorage.getItem('selectedPromoData');
// if (couponCodeValues) {
//   const parsed = JSON.parse(couponCodeValues); // convert to object
//   this.specialDiscountData = JSON.parse(couponCodeValues);
// }
//           if(this.selectedPlansSummary){
//           if(this.specialDiscountData){
//       return (
//     this.selectedPlansSummary?.reduce((sum, plan) => {
//       const price = plan?.actualRoomPrice || 0;

//       const taxPercent = plan?.taxpercentage || 0;
//       let discountedPrice = price;
//       if (this.specialDiscountData?.discountPercentage) {
//         const discountAmount = (price * this.specialDiscountData.discountPercentage) / 100;
//         discountedPrice -= discountAmount;
//       } else {
//         if (this.businessUser?.taxDetails?.length > 0) {
//       this.businessUser?.taxDetails.forEach((element) => {
//         if (element.name === 'GST') {
//           this.booking.taxDetails = [];
//           this.booking.taxDetails.push(element);
//           this.taxPercentage = element.percentage;
//           this.booking.taxPercentage = this.taxPercentage;

//           if (
//             plan?.code === 'GHC' &&
//             this.activeForGoogleHotelCenter === true
//           ) {
//             if (element.taxSlabsList.length > 0) {
//               element.taxSlabsList.forEach((element2) => {
//                 if (
//                   element2.maxAmount >=
//                     discountedPrice &&
//                   element2.minAmount <= discountedPrice
//                 ) {
//                   this.taxPercentage = element2.percentage;
//                   this.booking.taxPercentage = this.taxPercentage;
//                 } else if (
//                   element2.maxAmount <=
//                   discountedPrice
//                 ) {
//                   this.taxPercentage = element2.percentage;
//                   this.booking.taxPercentage = this.taxPercentage;
//                 }
//               });
//             }
//           } else {
//             if (element.taxSlabsList.length > 0) {
//               element.taxSlabsList.forEach((element2) => {
//                 if (
//                   element2.maxAmount >= discountedPrice &&
//                   element2.minAmount <= discountedPrice
//                 ) {
//                   this.taxPercentage = element2.percentage;
//                   this.booking.taxPercentage = this.taxPercentage;
//                 } else if (element2.maxAmount <= discountedPrice) {
//                   this.taxPercentage = element2.percentage;
//                   this.booking.taxPercentage = this.taxPercentage;
//                 }
//               });
//             }
//           }
//         }
//       });
//     }
//       }

//       const taxAmount = (discountedPrice * this.taxPercentage) / 100;

//       return sum + taxAmount;
//     }, 0) || 0
//   );
//     } else {
//                let taxTotal = 0;
//   this.daterangefilterSeo?.forEach((_, i) => {
//     this.selectedPlansSummary.forEach(plan => {
//         if(plan.selectedRoomnumber > 1) {
//           taxTotal  += this.calculateTaxAmount(
//         (plan.actualRoomPrice) +
//         (plan.singleextraAdultCharges || 0) +
//         (plan.singleextraChildrenCharges || 0),
//         plan
//       ) * plan.selectedRoomnumber;
//         } else {
//           taxTotal  += this.calculateTaxAmount(
//         (plan.actualRoomPrice) +
//         (plan.SingleDayextraPersonAdultCountAmount || 0) +
//         (plan.SingleDayextraPersonChildCountAmount || 0),
//         plan
//       ) * plan.selectedRoomnumber;
//         }

//     });
//   });
//   return taxTotal;
//     }
//       }
//   }

getTotalTaxPrice(): number {
  const savedBooking = sessionStorage.getItem('bookingSummaryDetails');
  if (savedBooking) {
    const data = JSON.parse(savedBooking);
    this.selectedPlansSummary = data.selectedPlansSummary;
  }

  const couponCodeValues = sessionStorage.getItem('selectedPromoData');
  if (couponCodeValues) {
    const parsed = JSON.parse(couponCodeValues); // convert to object
    this.specialDiscountData = parsed;
  }

  if (this.selectedPlansSummary) {
    if (this.specialDiscountData) {
      return (
        this.selectedPlansSummary?.reduce((sum, plan) => {
          if (plan.selectedRoomnumber > 1) {
            this.priceingO = plan.actualRoomPrice +
                  (plan.singleextraAdultCharges || 0) +
                  (plan.singleextraChildrenCharges || 0) || 0;
          } else {
            this.priceingO =  plan.actualRoomPrice +
                  (plan.SingleDayextraPersonAdultCountAmount || 0) +
                  (plan.SingleDayextraPersonChildCountAmount || 0) || 0;
          }
            const price = this.priceingO || 0;
          const taxPercent = plan?.taxpercentage || 0;
          let discountedPrice = price;
          if (this.specialDiscountData?.discountPercentage) {
            const discountAmount =
              (price * this.specialDiscountData.discountPercentage) / 100;
            discountedPrice -= discountAmount;
          }

          // ✅ Ensure taxPercentage is set even when coupon applied
          if (this.businessUser?.taxDetails?.length > 0) {
            this.businessUser?.taxDetails.forEach((element) => {
              if (element.name === 'GST') {
                this.booking.taxDetails = [];
                this.booking.taxDetails.push(element);
                this.taxPercentage = element.percentage;
                this.booking.taxPercentage = this.taxPercentage;

                if (
                  plan?.code === 'GHC' &&
                  this.activeForGoogleHotelCenter === true
                ) {
                  if (element.taxSlabsList.length > 0) {
                    element.taxSlabsList.forEach((element2) => {
                      if (
                        element2.maxAmount >= discountedPrice &&
                        element2.minAmount <= discountedPrice
                      ) {
                        this.taxPercentage = element2.percentage;
                        this.booking.taxPercentage = this.taxPercentage;
                      } else if (element2.maxAmount <= discountedPrice) {
                        this.taxPercentage = element2.percentage;
                        this.booking.taxPercentage = this.taxPercentage;
                      }
                    });
                  }
                } else {
                  if (element.taxSlabsList.length > 0) {
                    element.taxSlabsList.forEach((element2) => {
                      if (
                        element2.maxAmount >= discountedPrice &&
                        element2.minAmount <= discountedPrice
                      ) {
                        this.taxPercentage = element2.percentage;
                        this.booking.taxPercentage = this.taxPercentage;
                      } else if (element2.maxAmount <= discountedPrice) {
                        this.taxPercentage = element2.percentage;
                        this.booking.taxPercentage = this.taxPercentage;
                      }
                    });
                  }
                }
              }
            });
          }

          const taxAmount = (discountedPrice * this.taxPercentage) / 100;
          return ((sum + taxAmount) * plan.selectedRoomnumber) * plan.nights;
        }, 0) || 0
      );
    } else {
      let taxTotal = 0;
      this.daterangefilterSeo?.forEach((_, i) => {
        this.selectedPlansSummary.forEach((plan) => {
          if (plan.selectedRoomnumber > 1) {
            taxTotal +=
              this.calculateTaxAmount(
                plan.actualRoomPrice +
                  (plan.singleextraAdultCharges || 0) +
                  (plan.singleextraChildrenCharges || 0),
                plan
              ) * plan.selectedRoomnumber;
          } else {
            taxTotal +=
              this.calculateTaxAmount(
                plan.actualRoomPrice +
                  (plan.SingleDayextraPersonAdultCountAmount || 0) +
                  (plan.SingleDayextraPersonChildCountAmount || 0),
                plan
              ) * plan.selectedRoomnumber;
          }
        });
      });
      return taxTotal;
    }
  }
  return 0;
}


  getTotalTaxFee(): number {
    let url = new URL(this.googleUrl);
    let params = new URLSearchParams(url.search);

    // Get the taxAmount value if it exists
    let taxAmount = params.get('taxAmount');
    let totaltax: number;

    if (taxAmount !== null && this.isSuccess === false) {
      totaltax = Number(taxAmount);
    } else {
      if (!this.taxArray || !this.taxArray.length) return 0;
      totaltax = this.taxArray.reduce(
        (acc, curr) => acc + Number(curr || 0),
        0
      );
    }

    this.token.saveAllTaxAray(totaltax);

    return totaltax;
  }
  getTotalTaxFeeSeo(): number {
    let url = new URL(this.googleUrl);
    let params = new URLSearchParams(url.search);

    // Get the taxAmount value if it exists
    let taxAmount = params.get('taxAmount');
    let totaltax: number;

    if (taxAmount !== null && this.isSuccess === false) {
      totaltax = Number(taxAmount);
    } else {
      if (!this.taxArraySeo || !this.taxArraySeo.length) return 0;
      totaltax = this.taxArraySeo.reduce(
        (acc, curr) => acc + Number(curr || 0),
        0
      );
    }

    this.token.saveAllTaxAray(totaltax);

    return totaltax;
  }
  checkavailabilityCall() {
    this.isLoading = true;
  }

  landingTaxAmount() {
    this.allTaxAmount = true;
    this.token.clearLandingPrice();
    // this.getTotalTaxFee();
  }
  goToEnquiry() {
    this.router.navigate(['/enquiry']);
  }
  contentDialog(contentDialog: any) {
    throw new Error('Method not implemented.');
  }

  allDtosNull(): boolean {
    return this.availableRooms?.every(
      (dto) => dto.ratesAndAvailabilityDtos === null
    );
  }

  onDateSelection(date: NgbDate, type: string) {
    if (type === 'checkin') {
      if (date.before(this.minDateForCheckIn)) {
        return; // Prevent past date selection
      }
      this.fromDate = date;
      this.toDate = null;
      this.minDateForCheckOut = date; // Disable dates before check-in for checkout
    } else if (type === 'checkout') {
      if (this.fromDate && date.after(this.fromDate)) {
        this.toDate = date;
      }
    }

    // Call only if both dates are selected
    if (this.fromDate && this.toDate) {
      this.getDiffDate(this.toDate, this.fromDate);
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
  hasPercentage(roomOnlyPrice, planAmount) {
    if (((roomOnlyPrice - planAmount) / roomOnlyPrice) * 100 > 0) {
      return true;
    } else {
      return false;
    }
  }
  bookRoomNow() {
    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.adults;
    this.booking.noOfChildren = this.children;
    // this.booking.netAmount =
    this.changeDetectorRefs.detectChanges();
    this.extraPersonChargee = this.token.getExtraPersonCharge();
    this.extraChildChargee = this.token.getChildCharge();
    this.token.saveProperty(this.businessUser);
    this.token.saveBookingData(this.booking);
  }

  validateNoOfrooms(event: number, no) {
    if (event > no) {
      this.noOfrooms = no;
    } else if (event < no) {
      this.noOfrooms = 0;
    } else {
      this.noOfrooms = event;
    }
  }
  showMessage() {
    this.isSuccess = false;
    this.headerTitle = 'Warning!';
    this.bodyMessage = 'This Slot Not Available';
    this.showWarning(this.bodyMessage);
  }
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
  open(content, src, title) {
    this.modalData = src;
    this.modalTitle = title;
    this.modalService
      .open(content, { size: 'xl', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  // openImage(content, src, title) {
  //   this.modalImage = src;
  //   this.modalTitle = title;
  //   this.modalService
  //     .open(content, { size: 'lg', scrollable: true })
  //     .result.then(
  //       (result) => {
  //         this.closeResult = `Closed with: ${result}`;
  //       },
  //       (reason) => {
  //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //       }
  //     );
  // }
  openImage() {
    // Set this to true to open the modal with the carousel
    this.showCarousel = true;
  }

  toggleRoomViewMore(roomName: string): void {
    this.viewMoreRoomState[roomName] = !this.viewMoreRoomState[roomName];
  }

  expandedRooms: string[] = [];

isPlanVisible(filteredPlans: any[], roomName: string) {
  // If websiteBookingEngine is true, remove "Economy" plans first
  this.websiteUrlBookingEngine;
  let plans = this.websiteUrlBookingEngine
    ? filteredPlans.filter(
        (plan: any) => plan.name?.trim().toLowerCase() !== 'economy'
      )
    : filteredPlans;

  // Then handle expanded/collapsed logic
  return this.expandedRooms.includes(roomName)
    ? plans
    : plans.slice(0, 3);
}

  toggleRoomExpansion(roomName: string): void {
    const index = this.expandedRooms.indexOf(roomName);
    if (index > -1) {
      this.expandedRooms.splice(index, 1);
    } else {
      this.expandedRooms.push(roomName);
    }
  }

  isRoomExpanded(roomName: string): boolean {
    return this.expandedRooms.includes(roomName);
  }

  checkingAvailability1() {
    this.isSuccess = true;
    this.headerTitle = 'Success!';
    this.bodyMessage = 'CheckAvailability Clicked ';

    this.showSuccess(this.contentDialog);
    setTimeout(() => {
      this.showAlert = false;
      this.changeDetectorRefs.detectChanges();
      // document.getElementById("content").scrollIntoView();
    }, 1000);

    this.loaderHotelBooking = true;
    this.checkAvailabilityStatusHide = false;
    this.booking.propertyId = this.businessUser.id;
    this.token.saveBookingRoomPrice(this.booking.roomPrice);



    this.booking.noOfRooms = this.noOfrooms;
    this.booking.noOfPersons = this.adults;
    this.booking.noOfChildren = this.children;
    this.booking.noOfRooms = this.rooms;
    // this.token.saveBookingData(this.booking);
    // Logger.log('checkAvailability submit' + JSON.stringify(this.booking));

    this.hotelBookingService
      .checkAvailabilityByProperty(
        this.booking.fromDate,
        this.booking.toDate,
        this.booking.noOfRooms,
        this.booking.noOfPersons,
        this.booking.propertyId
      )
      .subscribe(
        (response) => {
          this.loaderHotelBooking = false;
          this.availableRooms = response.body.roomList;
                    this.availableRooms = this.availableRooms.filter(room =>
          room.ratesAndAvailabilityDtos?.length > 0 &&
          (room.ratesAndAvailabilityDtos[0]?.stopSellOBE === null || room.ratesAndAvailabilityDtos[0]?.stopSellOBE === false) &&
          (room.ratesAndAvailabilityDtos[0]?.stopSellOTA === null || room.ratesAndAvailabilityDtos[0]?.stopSellOTA === false)
        );
        if(this.activeForGoogleHotelCenter === true) {
          this.getAvailableRoomsForGHC(this.availableRooms);
        }
    // Filter sold-out rooms
          this.soldOutRooms = response.body.roomList.filter(room =>
            room.ratesAndAvailabilityDtos === null ||
            (room.ratesAndAvailabilityDtos[0]?.stopSellOBE != null && room.ratesAndAvailabilityDtos[0]?.stopSellOBE !== false) ||
            (room.ratesAndAvailabilityDtos[0]?.stopSellOTA != null && room.ratesAndAvailabilityDtos[0]?.stopSellOTA !== false)
          );
          this.shortrooms = response.body.roomList;
          let facilities = this.businessUser.propertyServicesList;
          if (
            this.availableRooms !== null &&
            this.availableRooms !== undefined
          ) {
            this.availableRooms.forEach((room) => {
              room?.ratesAndAvailabilityDtos?.forEach((ele) => {
                ele.roomRatePlans?.forEach((e) => {
                  // console.log(JSON.stringify(e.propertyServicesList));
                  if (e.name === this.booking.roomRatePlanName) {
                    this.planpropertyServiceList = e.propertyServicesList;
                    this.planpropertyServiceList?.forEach((service) => {
                      if (service.name == 'Breakfast' || 'Breakfast (Adult)') {
                        this.breakfastservice = service;
                      }
                      if (service.name == 'Lunch') {
                        this.lunchservice = service;
                      }
                      if (service.name == 'Dinner') {
                        this.dinnerservice = service;
                      }
                      // if (service.name != 'Breakfast' || 'Breakfast (Adult)' || 'Lunch' || 'Dinner') {
                      //   this.addServiceList = [];
                      //   console.log("dfghjkljhgvg" + JSON.stringify(this.addServiceList))
                      // }
                    });
                  }
                });
              });
              room?.roomFacilities?.forEach((element) => {
                if (element.name == 'Bar') {
                  this.bar = element;
                }
                if (element.name == 'Pub') {
                  this.pub = element;
                }
                if (element.name == 'Swimming Pool') {
                  this.swimming = element;
                }
                if (element.name == 'Pet Friendly') {
                  this.pet = element;
                }
                if (element.name == 'Air-Condition') {
                  this.ac = element;
                }
                if (element.name == 'Wifi') {
                  this.wifi = element;
                }
                if (element.name == 'Flat TV') {
                  this.tv = element;
                }
              });
              if (room.dayTrip == true) {
                this.dayOneTrip = true;
                // console.log('dayonetrip: ' + this.dayOneTrip);
              } else {
                this.dayOneTrip = false;
              }
            });
          }
          this.roomWithGHCPlan = [];
          let ghcPlan = new RoomRatePlans();
          this.daterange = [];
          this.daterangefilter = [];
          this.availableRooms?.forEach((event) => {
            event?.ratesAndAvailabilityDtos?.forEach((event2) => {
              event2?.roomRatePlans?.forEach((plan) => {
                if (
                  plan?.code === 'GHC' &&
                  this.activeForGoogleHotelCenter === true
                ) {
                  if (
                    plan?.otaPlanList != null &&
                    plan?.otaPlanList != undefined &&
                    plan?.otaPlanList?.length > 0
                  ) {
                    plan.otaPlanList.forEach((element) => {
                      if (element?.otaName === 'GHC') {
                        plan.amount = element?.price;
                        this.daterange.push(event2.date);

                        // Convert timestamps to formatted dates
                        const datePipe = new DatePipe('en-US');
                        this.daterange.forEach((timestamp) => {
                          let formattedDate = datePipe.transform(
                            new Date(timestamp),
                            'yyyy-MM-dd'
                          );
                          const inputDate = new Date(timestamp);
                          // formattedDate = inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          formattedDate = inputDate.toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' }
                          ); // Adjust the format as needed
                          this.daterangefilter.push(formattedDate);
                        });
                        this.daterangefilter = Array.from(
                          new Set(this.daterangefilter)
                        );
                        // console.log(JSON.stringify(this.daterangefilter));
                      }
                    });
                  }
                  event2.roomRatePlans = [];
                  ghcPlan = plan;
                  event2.roomRatePlans.push(ghcPlan);
                  this.roomWithGHCPlan?.push(event);
                }
              });
            });
          });
          this.planPrice = [];
          if (this.activeForGoogleHotelCenter === true) {
            this.roomWithGHCPlan[0]?.ratesAndAvailabilityDtos.forEach((e) => {
              e.roomRatePlans.forEach((element) => {
                element.otaPlanList.forEach((element2) => {
                  if (element2.otaName === 'GHC') {
                    this.planPrice.push(element2.price);
                    this.totalplanPrice = this.planPrice.reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      0
                    );
                  }
                  this.bookingCity = this.planPrice[0]?.toString();
                  this.token.saveBookingCity(this.bookingCity);

                  this.booking.roomPrice = this.totalplanPrice;

                  this.booking.netAmount =
                    this.booking.roomPrice * this.noOfrooms +
                    this.booking.extraPersonCharge +
                    this.booking.extraChildCharge;
                  //  this.token.saveBookingData(this.booking);
                });
              });
            });
          }
          this.Googlehotelsortrooms = this.roomWithGHCPlan;
          this.availableRooms?.forEach((des) => {
            const hasAvailableRooms = des?.ratesAndAvailabilityDtos?.some(
              (des2) => {
                // console.log('my data is ', des2);
                return des2.stopSellOBE !== true && des2.stopSellOBE !== null;
              }
            );

            this.isDiabled = !hasAvailableRooms;
          });

          if (facilities !== null && facilities !== undefined) {
            facilities.forEach((fac) => {
              // console.log("Image url: "+fac.imageUrl)
              if (fac.name == 'Breakfast (Adult)' || fac.name == 'Breakfast') {
                this.breakfast = fac;
              }
              if (fac.name == 'Laundry') {
                this.laundry = fac;
              }
              if (fac.name == 'Pick Up') {
                this.pickup = fac;
              }
              if (fac.name == 'Late Check-Out') {
                this.checkout = fac;
              }
              if (fac.name == 'Drop Off') {
                this.dropoff = fac;
              }
              if (fac.name == 'Lunch') {
                this.lunch = fac;
              }
              if (fac.name == 'Dinner') {
                this.dinner = fac;
              }
              if (fac.serviceType == 'Distance') {
                this.distance = fac;
              }
              if (fac.serviceType == 'RestaurantHotel') {
                this.isRestaurant = fac;
              }
              if (fac.serviceType == 'DistanceRailway') {
                this.DistanceRailway = fac;
              }

              if (fac.serviceType == 'DistanceBusStop') {
                this.isDistanceBusStop = fac;
              }

              if (fac.serviceType == 'DistanceTouristPlace') {
                this.isDistanceTouristPlace = fac;
              }

              if (fac.name == 'BreakFast, Lunch, Dinner') {
                this.bld = fac;
              }
            });
          }
          this.checkAvailabilityStatus = response.body.available;
          this.booking.bookingAmount = response.body.bookingAmount;
          // this.booking.extraPersonCharge = response.body.extraPersonCharge;
          this.maxSelectRoom = response.body.numberOfRooms;
          // this.selectedRoomMaximumOccupancy = response.body.noOfPersons;

          this.availableRooms.forEach((ele) => {
            if (
              ele.ratesAndAvailabilityDtos != null &&
              ele.ratesAndAvailabilityDtos != undefined &&
              ele.ratesAndAvailabilityDtos.length > 0
            ) {
              // console.log("Available rooms: "+JSON.stringify(ele.ratesAndAvailabilityDtos));
              this.availability = true;
            } else {
              this.allDtosNull();
            }
          });
          // console.log('this.availability: ' + this.availability);
          // if (this.availableRooms === null && this.availableRooms === undefined) {
          //   this.availability =false;
          // }
          if (response.body.available === true) {
            this.checkAvailabilityStatusName = 'Available';
          } else {
            this.checkAvailabilityStatusName = 'Not Available';
          }

          // Logger.log('checkAvailability ' + JSON.stringify(response.body));
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            Logger.log('checkAvailability error');
          }
        }
      );
  }

getAvailableRoomsForGHC(availableRooms: any[]) {
  availableRooms.forEach((room) => {
    room?.ratesAndAvailabilityDtos?.forEach((rate) => {
      rate?.roomRatePlans?.forEach((plan) => {
        if (plan.code === 'GHC' && room.id === Number(this.paramsroomId)) {

          plan?.otaPlanList?.forEach((otaPlan) => {
              const planCode = plan.code;

              // 1. Assign default selection
              this.selectedRoomsByPlan[planCode] = 1;
              this.selectedGuestsByPlan[planCode] = {
                adults: this.adults,
                children: this.childno,
              };

              // 2. Trigger plan selection
              this.onPlanSelect(plan.code, rate);
              this.isPanelOpen = false;
              // 3. Scroll to the plan card — even if it's already in view
              setTimeout(() => {
                const el = document.getElementById('plan-' + planCode);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

                  // Optionally add a highlight effect
                  el.classList.add('scroll-highlight');
                  // setTimeout(() => {
                  //   el.classList.remove('scroll-highlight');
                  // }, 3000);
                }
              }, 100); // slight delay ensures DOM updates
          });
        }
      });
    });
  });
}



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //    privtePromotion() {
  //   this.isPopupOpen = true;
  // }

  privtePromotion() {
    this.isPopupOpen = true;
    this.isValidPrivateCoupon = false; // reset the flag

    const privateOffers = this.offersList.filter(
      (offer) => offer.promotionAppliedFor === 'Private'
    );

    if (privateOffers.length > 0) {
      this.validCouponCode = privateOffers[0].couponCode;

    }
  }

  // onCouponInputChange(event:string){
  //    this.enteredCoupon = event;
  //     const privateOffers = this.offersList.filter(
  //     (offer) => offer.promotionAppliedFor === 'Private'
  //   );
  //   console.log('privateOffers is',privateOffers);

  //   privateOffers.forEach(item2 =>{
  //     console.log('item2 is',item2);
  //   })

  //    if (privateOffers.length > 0) {
  //      this.validCouponCode = privateOffers[0].couponCode;
  //   }
  // }

onCouponInputChange(event: string) {
  this.enteredCoupon = event.trim();

  if (!this.enteredCoupon) {
    this.resetCoupon();
    return;
  }

  const matchedOffer = this.offersList.find(
    (offer) =>
      offer.couponCode?.trim().toUpperCase() ===
      this.enteredCoupon.toUpperCase()
  );

  if (matchedOffer) {

    this.validCouponCode = matchedOffer.couponCode;
    this.privatePromotionData = matchedOffer;
    this.specialDiscountData = matchedOffer;
    this.specialDiscountPercentage = matchedOffer.discountPercentage || null;

    sessionStorage.setItem('selectedPromoData', JSON.stringify(matchedOffer));
    sessionStorage.setItem('selectPromo', 'true');
    this.promoSelected = true;
  } else {
    this.resetCoupon();
  }
}
  private resetCoupon() {
  this.validCouponCode = '';
  this.privatePromotionData = null;
  this.specialDiscountData = null;
  this.specialDiscountPercentage = null;
  this.promoSelected = false;

  sessionStorage.removeItem('selectedPromoData');
  sessionStorage.removeItem('selectPromo');
  this.enteredCoupon = '';
}
  applyCoupon(product: any, couponSection: HTMLElement) {

  sessionStorage.removeItem('selectedPromoData');
  sessionStorage.removeItem('selectPromo');
  this.enteredCoupon = product.couponCode;
  // couponSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

  this.onYesClick();
   this.promoSelected = sessionStorage.getItem('selectPromo') === 'true';
}


onYesClick() {
  const matchingOffer = this.offersList.find(
    (item) =>
      item.couponCode?.trim().toUpperCase() ===
      this.enteredCoupon?.trim().toUpperCase()
  );

  if (matchingOffer) {
    this.privatePromotionData = matchingOffer;
    this.privateOffersMinimumAmount = matchingOffer.minimumOrderAmount;

    const bookingFrom = new Date(this.booking.fromDate).getTime();
    const bookingTo = new Date(this.booking.toDate).getTime();

    const promoStart = Number(matchingOffer.startDate);
    const promoEnd = Number(matchingOffer.endDate);

    if (promoStart <= bookingFrom && promoEnd >= bookingTo) {
      // ✅ Booking is fully inside promo period → Apply
      this.successMessagePrivate = 'Applied';
      this.errorMessagePrivate = '';
      this.selectedPromotion = true;
      this.isValidPrivateCoupon = true;
      this.couponApplied = true;
      this.couponSuccessApplied = true;

      sessionStorage.setItem(
        'selectedPromoData',
        JSON.stringify(this.privatePromotionData)
      );
      sessionStorage.setItem('selectPromo', 'true');
      this.promoSelected = sessionStorage.getItem('selectPromo') === 'true';

      const couponCodeValues = sessionStorage.getItem('selectedPromoData');
      if (couponCodeValues) {
        const parsed = JSON.parse(couponCodeValues);
        this.specialDiscountData = parsed;

        if (parsed.couponCode) {
          this.enteredCoupon = parsed.couponCode;
          this.validCouponCode = parsed.couponCode;
        }
        if (parsed.discountPercentage) {
          this.specialDiscountPercentage = parsed.discountPercentage;
        }
      }

      // Optional: auto-scroll and close popup
      setTimeout(() => {
        this.isPopupOpen = false;
        const offerSection23 = document.getElementById('accmdOne');
        if (offerSection23) {
          offerSection23.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 1000);
    } else {
      this.successMessagePrivate = '';
      this.errorMessagePrivate = 'Validity Expired';
      setTimeout(() => {
        this.errorMessagePrivate = '';
      }, 3000);
      this.isValidPrivateCoupon = false;
      this.couponApplied = false;
      this.couponSuccessApplied = false;
    }
  } else {
  }
}



  onYesClickMobileView() {
    this.privateOffers2 = this.offersList.filter(
      (offer) => offer.promotionAppliedFor === 'Private'
    );

    this.privateOffers2.forEach((item1) => {
      this.privatePromotionData = item1;
      this.privateOffersMinimumAmount = item1.minimumOrderAmount;
    });

    if (
      this.enteredCoupon.trim().toUpperCase() ===
      this.validCouponCode.toUpperCase()
    ) {
      this.successMessagePrivate = 'Applied';
      this.selectedPromotion = true;
      this.isValidPrivateCoupon = true;
      this.couponApplied = true;
      this.couponSuccessApplied = true;

      localStorage.setItem(
        'selectedPromoData',
        JSON.stringify(this.privatePromotionData)
      );
      localStorage.setItem('selectPromo', 'true');

      // Optional: delay scroll and close
      setTimeout(() => {
        this.isPopupOpen = false;
        const offerSection23 = document.getElementById('accmdtwo');
        if (offerSection23) {
          offerSection23.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 1000);
    }
  }

  validateAndCloseCard() {
    if (
      this.enteredCoupon &&
      this.enteredCoupon.trim() === this.validCouponCode
    ) {
      this.isPopupOpen = false; // close popup
      const card = document.getElementById('stickyPrivate');
      if (card) {
        card.style.display = 'none'; // hide the card
      }
    }

    if (this.couponSuccessApplied) {
      this.showSuccessContent = true;
    }
  }

  resetButtonPrivate() {
    this.enteredCoupon = '';
    this.showSuccessContent = false;
    this.couponSuccessApplied = false;
  }

  clearEnteredCoupon() {
    this.enteredCoupon = ' ';
  }

  onNoClick() {
    this.isPopupOpen = false;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
  onYes() {
    this.isPopupOpen = false;
  }

  onNo() {
    this.isPopupOpen = false;
  }
}


