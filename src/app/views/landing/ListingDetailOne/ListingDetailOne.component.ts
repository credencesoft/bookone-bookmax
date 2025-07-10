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
import { DatePipe, Location, ViewportScroller } from '@angular/common';
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
import { HotelBookingService } from 'src/services/hotel-booking.service';
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
// import { Email } from "src/app/pages/Contact/Contact.component";

export interface Email {
  fromEmail: string;
  toEmail: string;
  subject: string;
  propertyName: string;
  message: string;
}

@Component({
  selector: 'list-detail-one',
  templateUrl: './ListingDetailOne.component.html',
  styleUrls: ['./ListingDetailOne.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListingDetailOneComponent implements OnInit {
  roomLowestPrices: { [roomId: string]: number | null } = {};
  roomLowestPricesBookingEngine: { [roomId: string]: number | null } = {};

  @ViewChild('accmd') accmdSection!: ElementRef;
  // @Output() bookNowClicked = new EventEmitter<void>();
  showFullDescription: boolean[] = [];
  hasServiceWithPrice:boolean = false;
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
  diffAmount: number;
  activeGoogleHotelCenter: string;
  googleUrlToken: this;
  allTaxAmountPrice: any;
  taxAmount: any;
  landingrice: number;
  isPopupOpen: boolean = false;
  enteredCoupon: any;
  isValidPrivateCoupon: boolean;
  validCoupon: ' ';
  validCouponCode: string = '';
  privateOffers2: any[];
  privateOffersMinimumAmount: any;
  privatePromotionData: any;
  isCardVisible: boolean;
  couponApplied: boolean;
  couponSuccessApplied: boolean = false;
  showSuccessContent: boolean = false;
  isAfterCheckAvilability: boolean;
  primaryColorProperty: any;
  privateCouponPresent: any[];
  phoneNumberBookingEngine: string;
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
  dynamicStreetName: string
  dynamicLocality: string;
  propertyServiceListData: any[] = [];
  propertyServiceListDataOne: any[] =[];
  savedServices: any[] = [];
  otaNames: string[] = [];
  dynamicCountryName: string
  dynamicStreetNumber: string
  description: string;
  ogDescription: string;
  subject = "Hotel details page Enquiry";
  propertyname: string;
  message: string;
  serviceName: string;
  subscriptions: string[];
  successMessage: boolean = false;
  div: boolean = true;
  childno: any;
  viewMore: boolean = false;
  success: any = null;
  selectedRoomIndex: number | null = null; // Initially no room selected
  viewMoreOne = false;

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
  otaPlans: { otaName: string, price: number }[] = [];

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

  places: any = [
    {
      image: 'assets/images/most-img-4.jpg',
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
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 2000,
    "arrows": true,
  };
  roomCarouselConfig = {
   "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 2000,
    "arrows": true,
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
  city: string;
  trustedURL: SafeUrl;
  dangerousUrl: string;
  logoUrl: string;
  property: BusinessUser;
  urlLocation: boolean;
  isHotelMate: boolean = true;
  showAll: boolean = false;


  checkinDay: number;
  propertyDetail: any;
  checkinMonth: number;
  dynamicText: string;  // Dynamic text variable
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
  isDistanceBusStop:PropertyServiceDTO;
  isDistanceTouristPlace:PropertyServiceDTO;
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
  isHeaderVisible:boolean = false;
  socialmedialist:any;
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
  @ViewChild('scrollContainer', { read: ElementRef }) scrollContainer!: ElementRef;
  @ViewChild('scrollContainerOne', { read: ElementRef }) scrollContainerOne!: ElementRef;
  @ViewChild('scrollContainerThree', { read: ElementRef }) scrollContainerThree!: ElementRef;
  @ViewChild('scrollContainerFour', { read: ElementRef }) scrollContainerFour!: ElementRef;
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
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  selectedPromotion : boolean = false;
  selectedPromotionCouponData : any;
  roomOccupancy:number;
  showError : boolean =false;
  errorMessage:string;
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


  constructor(
    private listingService: ListingService,
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
    private viewportScroller: ViewportScroller
  ) {
    const today = new Date();
    this.minDateForCheckIn = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    // this.checkAvailabilityDisabled = true;
    let currenturl = window.location.href
    let flag = currenturl.includes("bookingEngine");
    this.token.savePropertyUrl(currenturl);
    //console.log (currenturl)
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
    this.bookingMinDate = calendar.getToday();
    this.bookingengineurl = this.token.getwebsitebookingURL()
    sessionStorage.removeItem('enquiryNo');

this.selectedServicesOne = this.token?.getSelectedServices();
setTimeout(() => {
  if(this.activeForGoogleHotelCenter == true){
    this.fetchAndProcessRoomsDataOne();
  } else if (this.activeForGoogleHotelCenter == false){
    this.fetchAndProcessRoomsData();
  }
}, 3000);
this.token.saveBookingEngineBoolean('normalUrl')

this.selectedServices =[]
    this.oneDayFromDate = calendar.getToday();
    if (this.token.getBookingCity() !== null) {

      if (this.token.getBookingCity() != null && this.token.getBookingCity() != undefined) {
        this.propertyId = this.token.getBookingCity();
      }
      if (this.hotelID != null && this.hotelID != undefined) {
        this.propertyId = this.hotelID
      }
      this.fromDate = this.calendar.getToday();
      this.todayDate = calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
      this.adults = 1;
      this.children = 0;
      this.noOfrooms = 1;
      this.rooms = 1;

      if (this.hotelID != null && this.hotelID != undefined) {
        this.token.saveBookingEngineBoolean('googlehotelcenter')
        this.getPropertyDetailsById(this.hotelID);
      }

      if (this.token.getServiceData() !== null) {
        this.addServiceList = this.token.getServiceData();
        this.totalExtraAmount = 0;
        this.totalTaxAmount = 0;
        this.totalBeforeTaxAmount = 0;
        this.addServiceList.forEach((element) => {
          this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
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


    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    if (this.token?.getRoomsData() !== null && this.token?.getRoomsData() !== undefined) {
      this.availableRooms = this.token?.getRoomsData();
      this.shortrooms = this.token.getRoomsData()
    }
    this.acRoute.url.subscribe(urlSegments => {
      this.currentUrl = window.location.href; // Use window.location.href to get the full URL
      console.log(this.currentUrl);
    });
    if (this.token.getBookingData() !== null && this.token?.getRoomsData() !== undefined) {
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
      if (this.booking.noOfPersons === null || this.booking.noOfPersons === undefined) {
        this.adults = 1
      }else{
        this.adults = this.booking.noOfPersons;
      }

      this.children = this.booking.noOfChildren;
      this.rooms = this.booking.noOfRooms;

      this.taxPercentage = this.booking.taxPercentage;
      console.log("this.booking.taxPercentage",this.booking.taxPercentage)
    } else {
      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
      this.adults = 1;
      this.children = 0;
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
      if(uriId != undefined && uriId != null && uriId == "GoogleHotelCenter" ){
        this.activeForGoogleHotelCenter = true;
      } else{
        this.activeForGoogleHotelCenter = false;
      }
    });

    this.bookingPrice = this.token.getBookingRoomPrice();
    this.googleUrlToken = this,token.getBookingEngineBoolean();

    this.googleUrl = this.token.getPropertyUrl();
    if ( this.activeForGoogleHotelCenter === true) {
      this.showDiv = false
    }

    this.acRoute.queryParams.subscribe((params) => {
      if (params['BookingEngine'] !== undefined) {
        this.urlLocation = params['BookingEngine'];
        let websitebookingURL = "true";
        this.websiteUrlBookingEngine = true
        this.token.savewebsitebookingURL(websitebookingURL)
      }

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
        this.nights = params['nights'];
      }
      if (params['numGuests'] !== undefined) {
        this.adultno = params['numGuests'];
      }
      if (params['numAdults'] !== undefined) {
        this.adults = params['numAdults'];
        // this.changeDetectorRefs.detectChanges();
      }
      if (params['Children'] !== undefined) {
        this.childno = params['Children'];
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

      this.landingrice = Number((this.totalAmountParam - this.taxAmountParam).toFixed(2));
      this.token.saveLandingPrice((this.landingrice));


      if (this.hotelID != null && this.hotelID != undefined) {
        this.getPropertyDetailsById(this.hotelID);
        this.personChange();
      }
      if (!params['hotelID'] && !params['BookingEngine']) {
        this.getDynamicNameFromUrl(this.currentUrl);
      }
      // //console.log(this.adults);
      // this.updateTag();
    });

     this.allExtraPersonCharge = this.booking.extraPersonCharge;
    this.allExtraChildCharge = this.booking.extraChildCharge;
    this.token.saveExtraPersonCharge(this.allExtraPersonCharge);
    this.token.saveChildCharge(this.allExtraChildCharge);


    this.booking.createdDate = new Date();
    this.extraPersonChargee = this.token.getExtraPersonCharge();
    if(this.extraPersonChargee === 'NaN' || this.extraPersonChargee === null || this.extraPersonChargee === undefined){
       this.extraPersonChargee = 0;
    }
    this.extraChildChargee = this.token.getChildCharge();
      if(this.extraChildChargee === 'NaN' || this.extraChildChargee === null || this.extraChildChargee === undefined){
       this.extraChildChargee = 0;
    }
  }
  blogPosts$: Observable<any> | undefined;
  responsiveOptions: any[];

  ngOnInit() {
    localStorage.removeItem('selectedPromoData');
    localStorage.removeItem('selectPromo');
    this.setResponsiveOption();
    if (this.hotelID != null && this.hotelID != undefined) {
      this.token.saveBookingEngineBoolean('googlehotelcenter')

    }
    const toggleCardBtn = document.getElementById('toggleCardBtn');
    const closeCardBtn = document.getElementById('closeCardBtn');
    const stickyCard = document.getElementById('stickyCard');

    // Toggle the visibility of the sticky card
    toggleCardBtn.addEventListener('click', function() {
      stickyCard.classList.toggle('show');
    });

    closeCardBtn.addEventListener('click', function() {
      stickyCard.classList.remove('show');
    });

    const toggleCardPrivate = document.getElementById('toggleCardPrivate');
    const closeCardPrivate = document.getElementById('closeCardPrivate');
    const stickyPrivate = document.getElementById('stickyPrivate');

    toggleCardPrivate?.addEventListener('click', function() {
      stickyPrivate.classList.toggle('show');
    });

     closeCardPrivate?.addEventListener('click', function() {
      stickyPrivate.classList.remove('show');
    });


    // Close the card when the 'Close' button is clicked

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
        propertyName:propertyName,
        currentDate:currentTimeString,
      };
      fetch('https://chatbot.api.thehotelmate.co/api/chatbot/receive-payload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
    });
if (this.city != null && this.city != undefined) {
  this.offerService.getPropertyListByCity(this.city).subscribe((res) => {
    // this.accommodationData = res.body.filter(entry => entry.businessType === 'Accommodation');
    // //console.log(this.accommodationData)
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

    this.blogPosts$ = this.contentfulService.getAllEntries();
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
      if (this.activeForGoogleHotelCenter === true) {
        this.accommodationData = this.propertyDetail.businessServiceDtoList?.filter(
          (entry) => entry.name === 'Accommodation'
        );
        this.accommodationData.forEach(element => {
          if (this.bookingengineurl === "true") {
            this.value = element.websiteinstantBooking;
            console.log("this.value", this.value)
          } else if (this.value !== true) {
            this.value = element.instantBooking;
            console.log("this.value", this.value)
          }
        });
            }
      // //console.log("property details are" + JSON.stringify(this.propertyDetail))
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
      if(this.activeForGoogleHotelCenter == true){
        this.fetchAndProcessRoomsDataOne();
      } else if (this.activeForGoogleHotelCenter == false){
        this.fetchAndProcessRoomsData();
      }
    }, 3000);
    // this.adults = this.adults;
    // this.checkingAvailability();
    //  this.getTotalTaxFee();
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
    const fullUrl = this.locationBack.prepareExternalUrl(this.locationBack.path(true));

    // You can also access the current URL with window.location.href
    const domain = window.location.hostname; // Get the domain part from the URL
    const name = domain.split('.')[1]; // This will extract 'saanaira-resort-spa'
    this.getPropertyDetailsBySeoName(name)
    return name;

  }
  sortAndLimitRoomsOne() {
    // Sort rooms by roomOnlyPrice in ascending order and take top 2
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

  getLowestPriceBookingEngine(room: any): number | null{
 const allPlans = room?.ratesAndAvailabilityDtos
    ?.flatMap((availability: any) => availability?.roomRatePlans || [])
    .filter((plan: any) => typeof plan?.amount === 'number' && !isNaN(plan.amount) && plan?.code?.toLowerCase() !== 'ghc');

  if (!allPlans?.length) return null;

  const lowestPlan = allPlans.reduce((min, curr) => curr.amount < min.amount ? curr : min);


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
    // //console.log("count"+this.counterl )
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

    if (this.addServiceList.some((data) => data.name === lunchservice.name) === true) {
      let service = this.addServiceList.find((data) => data.name === lunchservice.name);
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

    // //console.log('add service:' + JSON.stringify(this.addServiceList));
    this.totalTaxAmount = 0;
    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.addServiceList?.forEach((element) => {
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
    // //console.log("count"+this.counterb )
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

    if (this.addServiceList.some((data) => data.name === breakfastservice.name) === true) {
      let service = this.addServiceList.find((data) => data.name === breakfastservice.name);
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

    // //console.log('add service:' + JSON.stringify(this.addServiceList));
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
    // //console.log("count"+this.counterd )
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

    if (this.addServiceList.some((data) => data.name === dinnerservice.name) === true) {
      let service = this.addServiceList.find((data) => data.name === dinnerservice.name);
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

    // //console.log('add service:' + JSON.stringify(this.addServiceList));
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
        behavior: 'smooth'
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
    this.selectedServicesOne = this.selectedServices
    this.changeDetectorRefs.detectChanges();
  }

  increaseQuantity(facility) {
    facility.quantity++;
    if (this.selectedServicesOne) {
      const facilityIndex = this.selectedServicesOne.findIndex(ele => ele.id === facility.id);

      if (facilityIndex !== -1) {
          this.selectedServicesOne[facilityIndex].quantity = facility.quantity;
      } else {
          this.selectedServicesOne.push(facility);
      }

      this.token.saveSelectedServices(this.selectedServicesOne);
  }
  else {
    this.token.saveSelectedServices(this.selectedServices);
    this.updateTokenStorage();
  }
}

  decreaseQuantity(facility) {
    if (facility.quantity > 1) {
      facility.quantity--;
      if(this.selectedServicesOne != null && this.selectedServicesOne != undefined){
        this.selectedServicesOne.forEach(ele => {
           if(ele.id === facility.id)
           {
            ele.quantity = facility.quantity;
           }


        });

        this.token.saveSelectedServices(this.selectedServicesOne)

    } else {
       this.token.saveSelectedServices(this.selectedServices);
    this.updateTokenStorage();
    }
    } else if (facility.quantity === 1) {
      facility.isAdded = false;
      facility.quantity = null;
      if (this.selectedServicesOne != null && this.selectedServicesOne != undefined) {
        this.selectedServicesOne = this.selectedServicesOne.filter(ele => {
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
    this.token.clearBookingData();
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
      this.adults = Number(this.adultno);
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
          this.shortrooms = response.body.roomList
          this.checkAvailabilityStatus = response.body.available;
          this.booking.bookingAmount = response.body.bookingAmount;
          // //console.log("check availability");

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
      this.adults = Number(+this.adults + 1);
    } else {
      this.adults = this.adults + 1;
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
    // debugger;
    //console.log("this is clicked");
    Logger.log(JSON.stringify(this.subscriptions));
    const TO_EMAIL = "reservation@thehotelmate.co";
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
  sendemailtosupport(email){
    email.toEmail ='reservation@thehotelmate.co'
   this.http
   .post<Email>(API_URL_NZ + '/api/thm/sendEmailFromWebSite',email)
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
  changeTheme(primary: string, secondary: string, tertiary: string) {
    document.documentElement.style.setProperty('--primary', primary);

    document.documentElement.style.setProperty('--secondary', secondary);
    document.documentElement.style.setProperty('--tertiary', tertiary);
    document.documentElement.style.setProperty('--button-primary', tertiary);
    document.documentElement.style.setProperty(
      '--primary-gradient',
      'linear-gradient( 180deg, ' + tertiary + ', ' + secondary + ')'
    );
    document.documentElement.style.setProperty(
      '--secondary-gradient',
      'linear-gradient( 312deg, ' + primary + ', ' + secondary + ')'
    );
    document.documentElement.style.setProperty(
      '--secondary-one-gradient',
      'linear-gradient( 180deg, ' + primary + ', ' + secondary + ')'
    );

    document.documentElement.style.setProperty(
      '--third-gradient',
      'linear-gradient( 180deg, ' + primary + ', ' + secondary + ')'
    );
  }
  updateTag() {
    let keywords = this.businessUser?.address?.city;

    if (this.businessUser.businessDescription != null && this.businessUser.businessDescription != undefined) {
      this.description = this.businessUser.businessDescription;
    } else {
      this.description = "Contact No: +91-9040785705";
    }
    let title =
      this.businessUser.name +
      ' | Bookone PMS' +
      ' | Contact No: +91-9040785705';

    let ogTitle =
      this.businessUser.name +
      ' | Bookone PMS' +
      ' | Contact No: +91-9040785705';

    if (this.businessUser.businessDescription != null && this.businessUser.businessDescription != undefined) {
      this.ogDescription = this.businessUser.businessDescription;
    } else {
      this.ogDescription = "Contact No: +91-9040785705";
    }

    let ogImage = this.businessUser.logoUrl;
    let ogUrl = 'https://bookonepms.com/' + this.businessUser.seoFriendlyName;
    let ogSiteName = '';
    this.metaService.updateTag({ name: 'title', content: title });
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    // //console.log("the hotelamate" + keywords)
    this.metaService.updateTag({ name: 'description', content: this.description });
    this.metaService.updateTag({ name: 'robots', content: 'index,follow' });
    // fb

    this.metaService.updateTag({ property: 'og:title', content: ogTitle });
    // //console.log("ogTitle :" + ogTitle )
    this.metaService.updateTag(
      {
        property: 'og:description',
        content: this.ogDescription,
      },
      `property='og:description'`
    );
    //  //console.log("ogdescription : " +description)
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    // //console.log("ogImage : " +ogImage)
    this.metaService.updateTag({ property: 'og:url', content: ogUrl });
    this.metaService.updateTag(
      {
        property: 'og:site_name',
        content: ogSiteName,
      },
      `property='og:site_name'`
    );
    // //console.log('site_name : ' + ogSiteName);
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    // //console.log('ogImage :' + ogImage);

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
    this.enddate = new Date(toDate?.year, toDate?.month - 1, toDate?.day);

    this.startDate = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
    // //console.log('this.fromDate: ', this.startDate);
    // //console.log('this.toDate: ', this.enddate);
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
    // debugger
    // this.token.saveBookingEngineBoolean('googlehotelcenter')

    // //console.log("id isequal to" + id)
    try {
      this.loader = true;
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        this.getOfferList(this.businessUser.seoFriendlyName);
        this.getGoogleReview(this.businessUser.id)
        this.showStaticContent = true;
this.isHeaderVisible = true;
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation'
        );



        this.businessUser.propertyServicesList.forEach(ele => {

          if (ele.id != null && ele.id != undefined) {
            this.propertyServiceListData.push(ele)
          }
        });

        this.businessUser?.socialMediaLinks.forEach(element => {
          this.socialmedialist=element
        });

        this.propertyServiceListDataOne = this.businessUser.propertyServicesList;
         this.hasServiceWithPrice = this.propertyServiceListDataOne?.some(
  val => val?.servicePrice != null && val?.servicePrice > 0
);
          if(this.selectedServices != null &&  this.selectedServices != undefined ){
            this.savedServices = this.token?.getSelectedServices()?.forEach(ele => {
              this.propertyServiceListDataOne.forEach(val => {
                if (ele.name === val.name) {
                  this.valSelected = true;
                  this.viewAddon = true;
                val.quantity = ele.quantity;
                }

              })

            console.log("val.quantity", this.propertyServiceListDataOne)
          });
        }
        this.updateTag();
        this.token.saveProperty(this.businessUser);

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
          console.log("this.booking.taxPercentage",this.booking.taxPercentage)
        } else {
          this.taxPercentage = 0;
        }

        if (
          this.businessServiceDto !== undefined &&
          this.businessServiceDto.maxLeadTime !== undefined
        ) {
          const maxLead = new Date(0, 0, 0, 0, this.businessServiceDto.maxLeadTime, 0);
          this.leadMaxDay = Math.floor(this.businessServiceDto.maxLeadTime / 1440);
          this.leadMaxMin = maxLead.getMinutes();
          this.leadMaxHour = maxLead.getHours();
        }

        if (
          this.businessServiceDto !== undefined &&
          this.businessServiceDto.minLeadTime !== undefined
        ) {
          const minLead = new Date(0, 0, 0, 0, this.businessServiceDto.minLeadTime, 0);
          // Do something with minLead?
        }

        if (
          this.businessServiceDto !== undefined &&
          this.businessServiceDto.stdPrepTime !== undefined
        ) {
          const prep = new Date(0, 0, 0, 0, this.businessServiceDto.stdPrepTime, 0);
          this.prepareDay = Math.floor(this.businessServiceDto.maxLeadTime / 1440);
          this.prepareHour = prep.getHours();
          this.prepareMinute = prep.getMinutes();
        }

        this.booking.propertyId = this.businessUser.id;
        this.lat = parseFloat(this.businessUser.latitude);
        this.lng = parseFloat(this.businessUser.longitude);
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      } else {
        this.router.navigate(["/error"]);
      }
    } catch (error) {
      this.loader = false;
      this.router.navigate(["/error"]);
      // Handle the error appropriately, if needed.
    }
  }

  increament(breakfastservice) {

    this.counterb = this.counterb + 1;
    // //console.log("count"+this.counterb )
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

    if (this.addServiceList.some((data) => data.name === breakfastservice.name) === true) {
      let service = this.addServiceList.find((data) => data.name === breakfastservice.name);
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

    // //console.log('add service:' + JSON.stringify(this.addServiceList));
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
    // //console.log("count"+this.counterl )
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

    if (this.addServiceList.some((data) => data.name === lunchservice.name) === true) {
      let service = this.addServiceList.find((data) => data.name === lunchservice.name);
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

    // //console.log('add service:' + JSON.stringify(this.addServiceList));
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
    // //console.log("count"+this.counterd )
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

    if (this.addServiceList.some((data) => data.name === dinnerservice.name) === true) {
      let service = this.addServiceList.find((data) => data.name === dinnerservice.name);
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

    // //console.log('add service:' + JSON.stringify(this.addServiceList));
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

  gotocheckout(){
    this.availableRooms?.forEach((room) => {
      room.ratesAndAvailabilityDtos?.forEach(ele => {
        ele.roomRatePlans?.forEach(ele1 =>{
          if (ele1.name === this.booking.roomRatePlanName) {
            if (this.booking.noOfPersons > ele1.maximumOccupancy) {
              this.roomOccupancy = ele1.maximumOccupancy
              this.showError = true;
              this.errorMessage = `The number of persons exceeds the maximum occupancy of ${this.roomOccupancy} for this plan. Please select a different plan or change the adult count according to the plan occupancy  for book the Room.`;
              this.showErrorPopup();
            } else {
              if(this.booking?.netAmount <= this.selectedPromotionCouponData?.minimumOrderAmount){
                localStorage.removeItem('selectedPromoData');
                localStorage.removeItem('selectPromo');
              }
              this.token.saveBookingRoomPrice(this.booking.roomPrice);
               if (this.booking.planCode === 'GHC') {
                  this.token.saveLandingPrice(this.totalplanPrice + this.booking.extraPersonCharge + this.booking.extraChildCharge);
                } else {
                  this.token.saveLandingPrice(this.booking.netAmount)
                }
              this.router.navigate(['/booking']);
            }
          }
        })

      })

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
         this.getGoogleReview(this.businessUser.id)
          this.showStaticContent = true
          // this.businessUser.businessServiceDtoList.filter(ele =>
          //   )
          this.businessUser.propertyServicesList.forEach(ele => {

            if (ele.id != null && ele.id != undefined) {
              this.propertyServiceListData.push(ele)
            }
          });

          // //console.log("property service list"+ JSON.stringify(this.propertyServiceListData))
          this.policies = this.businessUser.businessServiceDtoList.filter(
            (ele) => ele.name === 'Accommodation'
          );
          // this.policies = this.businessUser.businessServiceDtoList => this.businessUser.businessServiceDtoList.every(ele => ele.policy === null &&  ele.policy === undefined);
          // //console.log("policies are :" +JSON.stringify (this.policies))
          this.updateTag();
          this.changeDetectorRefs.detectChanges();
          this.token.saveProperty(this.businessUser);

          if (this.urlLocation !== undefined && this.urlLocation !== null) {
            this.triggerEventService.newEvent(this.urlLocation);
          }
          // //console.log("no of adults :" + this.adults)
          this.dangerousUrl =
            'https://siteminder-git-main-rekha-credencesoft.vercel.app/propertyId/' +
            this.businessUser.id;
          this.trustedURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.dangerousUrl
          );
          this.currency = this.businessUser.localCurrency.toUpperCase();
          this.getOfferList(seoName);
          this.businessTypeName = this.businessUser.businessType;

          this.businessUser?.socialMediaLinks.forEach(element => {
            this.socialmedialist=element
          });

          // this.getReview(this.businessUser.id);
          // this.getBranch(this.businessUser.id);
          // this.getCustomerReview(this.businessUser.id);

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
          this.propertyServiceListDataOne = this.businessUser.propertyServicesList;
          this.hasServiceWithPrice = this.propertyServiceListDataOne?.some(
  val => val?.servicePrice != null && val?.servicePrice > 0
);
          if(this.selectedServices != null &&  this.selectedServices != undefined ){
          this.savedServices = this.token?.getSelectedServices()?.forEach(ele => {
            this.propertyServiceListDataOne?.forEach(val => {
              if (ele.name === val.name) {
                this.valSelected = true;
                this.viewAddon = true;
              val.quantity = ele.quantity;
              }
            })
            console.log("val.quantity", this.propertyServiceListDataOne)
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
            console.log("this.booking.taxPercentage",this.booking.taxPercentage)
            // //console.log('frodm' + this.taxPercentage);
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
          // this.router.navigate(["/error"]);
        }
      },
      (error) => {
        this.loader = false;
        // this.router.navigate(["/error"]);
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

  showAllTheOfferList : any[] = [];
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
  this.offerService
    .getOfferListFindBySeoFriendlyName(seo)
    .subscribe((data) => {
      // const allOffers = data.body;
      // this.offersList = allOffers;
      this.offersList = data.body;

      // // Filter public offers
      const publicOffers = this.offersList.filter(
        (offer) => offer.promotionAppliedFor !== 'Private'
      );

      //  this.showAllTheOfferList.push(publicOffers);
       this.showAllTheOfferList = this.checkValidCouponOrNot(publicOffers);
         const publicOffersPrivate = this.offersList.filter(
        (offer) => offer.promotionAppliedFor === 'Private'
      );

      this.privateCouponPresent = publicOffersPrivate;
      // // Filter private offers (where user must enter the coupon)
      // const privateOffers = allOffers.filter(
      //   (offer) => offer.promotionAppliedFor === 'Private'
      // );

      // // Check if the entered coupon matches any private offers
      // const matchedPrivateOffer = privateOffers.find(
      //   (offer) => offer.couponCode?.toLowerCase() === this.enteredCoupon?.toLowerCase()
      // );

      // // Combine public offers + matched private offer (if any)
      // this.showAllTheOfferList = [...publicOffers];
      // if (matchedPrivateOffer) {
      //   this.showAllTheOfferList.push(matchedPrivateOffer);
      // }
    });
}

checkValidCouponOrNot(couponList?){
  try{
    const currentDate = new Date();
    const validCoupons = [];
    couponList.forEach((coupon) => {
      if (coupon.startDate && coupon.endDate && coupon.discountPercentage) {
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        // Check if the current date is within the start and end date
        if (currentDate >= startDate && currentDate <= endDate && coupon.discountPercentage != 100) {
          validCoupons.push(coupon);
        }
      }
    });
    return validCoupons;
  }
  catch(error){
    console.error("Error in checkValidCouponOrNot : ",error);
  }
}

  setResponsiveOption(){
    try{
      this.responsiveOptions = [
        {
          breakpoint: '1024px',
          numVisible: 1,
          numScroll: 1
        },
        {
          breakpoint: '768px',
          numVisible: 1,
          numScroll: 1
        }
      ];
    }
    catch(error){
      console.error("Error in setResponsiveOption : ",error);
    }
  }

  selectedPromotionList(promo){
    try{
      this.selectedPromotionCouponData = promo;
      const offerSection = document.getElementById("accmdOne");
      if (offerSection) {
        offerSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
      }
      const offerSection2 = document.getElementById("accmdtwo");
      if (offerSection2) {
        offerSection2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
      }
      this.selectedPromotion = true;
      localStorage.setItem('selectedPromoData', JSON.stringify(promo));
      localStorage.setItem('selectPromo', 'true');
    }
    catch(error){
      console.error("Error in selectedPromotionList : ",error);
    }
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
    this.listingService.getGoogleReview(id).subscribe(
      (response) => {
        this.googleReviews = response.body;
        // this.cdrf.detectChanges();
        // this.chunkReviews();
    console.log("this.googleReviews" + JSON.stringify(this.googleReviews))
      },

    );
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
          // //console.log('response room ' + JSON.stringify(this.roomsone));
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
    this.availableRooms?.forEach((room) => {
      room.ratesAndAvailabilityDtos?.forEach(ele => {
        ele.roomRatePlans?.forEach(ele1 =>{
          if (ele1.name === this.booking.roomRatePlanName) {
            if (this.booking.noOfPersons > ele1.maximumOccupancy) {
              this.roomOccupancy = ele1.maximumOccupancy
              this.showError = true;
              this.errorMessage = `The number of persons exceeds the maximum occupancy of ${this.roomOccupancy} for this plan. Please select a different plan or change the adult count according to the plan occupancy  for book the Room.`;
              this.showErrorPopup();
            }
          }
        })

      })

    });

    // //console.log("ftgyhjkl"+JSON.stringify(this.booking))
    // //console.log("room"+JSON.stringify(room))
    this.booking.roomType = room.name;
    // //console.log("sdfghjkl"+ JSON.stringify(plan))
    this.showDiv = true;
    let elements = document.getElementsByClassName("sticky-button");
(elements[0] as HTMLElement).style.display = "block";
let elementsone = document.getElementsByClassName("sticky-buttonmobile");
(elementsone[0] as HTMLElement).style.display = "block";
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
        if(element.name === 'GST'){
          this.booking.taxDetails = [];
          this.booking.taxDetails.push(element);
          this.taxPercentage = element.percentage;
          this.booking.taxPercentage = this.taxPercentage;
          if (plan?.code === 'GHC' &&
            this.activeForGoogleHotelCenter === true) {
              if (element.taxSlabsList.length > 0) {
                element.taxSlabsList.forEach((element2) => {
                  if (
                    element2.maxAmount > (this.booking.roomPrice + (this.booking.extraPersonCharge + this.booking.extraChildCharge) / this.booking.noOfNights) &&
                    element2.minAmount < (this.booking.roomPrice + (this.booking.extraPersonCharge + this.booking.extraChildCharge) / this.booking.noOfNights)
                  ) {
                    this.taxPercentage = element2.percentage;
                    this.booking.taxPercentage = this.taxPercentage;
                  } else if (
                    element2.maxAmount <
                    (this.booking.roomPrice + (this.booking.extraPersonCharge + this.booking.extraChildCharge) / this.booking.noOfNights)
                  ) {
                    this.taxPercentage = element2.percentage;
                    this.booking.taxPercentage = this.taxPercentage;
                  }
                });
              }
            } else{
              if (element.taxSlabsList.length > 0) {
                element.taxSlabsList.forEach((element2) => {
                  if (
                    element2.maxAmount > this.booking.netAmount &&
                    element2.minAmount < this.booking.netAmount
                  ) {
                    this.taxPercentage = element2.percentage;
                    this.booking.taxPercentage = this.taxPercentage;
                  } else if (
                    element2.maxAmount <
                    this.booking.netAmount
                  ) {
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
    console.log("this.booking.taxPercentage",this.booking.taxPercentage)
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
    document.getElementById("contentOne")?.scrollIntoView();
    Logger.log(JSON.stringify(this.booking));
    Logger.log(JSON.stringify(this.checkAvailabilityStatusHide));
    this.token.saveBookingData(this.booking);
    this.changeDetectorRefs.detectChanges();
    this.checkingAvailability();
    // this.checkingAvailability1();
  }


  const  = document.getElementsByClassName("booking-summary")[0];
if (bookingSummaryElement) {
  bookingSummaryElement.scrollIntoView();
}

  getWhatsappShareUrl(): string {
    const baseUrl = "https://api.whatsapp.com/send";
    const phoneNumber = "919082741973";
    this.dynamicText = this.businessUser.name;
    this.dynamicCity = this.businessUser?.address?.city
    this.dynamicStreetName = this.businessUser.address?.streetName;
    this.dynamicLocality = this.businessUser.address?.locality;
    this.dynamicStreetNumber = this.businessUser.address?.streetNumber;
    this.dynamicCountryName = this.businessUser.address?.country;
    // The recipient's phone number (optional)
    const message = "*This is an Enquiry from :* The HotelMate Website" + '\nHotel Name: ' + this.dynamicText + '\nAddress: ' + this.dynamicStreetNumber + ',' + this.dynamicStreetName + "," + this.dynamicLocality + "," + this.dynamicCity + ',' + this.dynamicCountryName;  // The dynamic text you want to include

    return baseUrl + "?phone=" + phoneNumber + "&text=" + encodeURIComponent(message);
  }

  onBookNowClick() {
    this.scrollToAccommodationDash() ;
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
      const yOffset = -100; // Adjust this value as needed
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      console.log('Scroll target position:', y);
  }
  }


  scrollToAccommodationDash() {
    const element = document.getElementById('accmdOne');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToAccommodationDashmobile(){
    const element = document.getElementById('accmdtwo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToService() {
console.log("lkjhgfgh")
    const element = document.getElementById('serv');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleViewMore() {
    this.viewMoreOne = !this.viewMoreOne;
  }

  scrollToPrivate(){
    const element = document.getElementById('serv');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  customerwhatsappurl(): string {
    const baseUrl = "https://api.whatsapp.com/send";
    const phoneNumber = this.businessUser.whatsApp;
    this.dynamicText = this.businessUser.name;
    this.dynamicCity = this.businessUser?.address?.city
    this.dynamicStreetName = this.businessUser.address?.streetName;
    this.dynamicLocality = this.businessUser.address?.locality;
    this.dynamicStreetNumber = this.businessUser.address?.streetNumber;
    this.dynamicCountryName = this.businessUser.address?.country;
    // The recipient's phone number (optional)
    const message = "*This is an Enquiry from :* The HotelMate Website" + '\nHotel Name: ' + this.dynamicText + '\nAddress: ' + this.dynamicStreetNumber + ',' + this.dynamicStreetName + "," + this.dynamicLocality + "," + this.dynamicCity + ',' + this.dynamicCountryName;  // The dynamic text you want to include

    return baseUrl + "?phone=" + phoneNumber + "&text=" + encodeURIComponent(message);
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
  onRoomSelect(roomIndex: number) {
    this.selectedRoomIndex = roomIndex; // Set the selected room index

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
  oneDayTripShow() { }
  toggleCard() {
    const card = document.getElementById('slideCard');
    card.classList.toggle('active');
  }
resetForm(){
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
clicked(){
  this.checkAvailabilityDisabled = true;
}
  checkingAvailability() {

    if(this.activeForGoogleHotelCenter === true){
      this.showDiv = false
      }

    this.isSuccess = true;
    this.isAfterCheckAvilability = true;
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
    this.booking.noOfPersons = this.adults;
    this.booking.noOfChildren = this.children;
    this.booking.noOfRooms = this.rooms;
    this.booking.noOfNights = this.DiffDate;
    this.token.saveBookingData(this.booking);
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
         this.primaryColorProperty = response.body.primaryColor;
          this.shortrooms =  response.body.roomList;
          let facilities = this.businessUser.propertyServicesList;
          if (
            this.availableRooms !== null &&
            this.availableRooms !== undefined
          ) {
            this.availableRooms?.forEach((room) => {

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
                // //console.log('dayonetrip: ' + this.dayOneTrip);
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

                plan.otaPlanList.forEach((otaPlan) => {
                  const otaName = otaPlan.otaName;
                  const price = otaPlan.price;
                  this.otaPlans.push({ otaName, price });
                });

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
              this.daterange.forEach(timestamp => {
                let formattedDate = datePipe.transform(new Date(timestamp), 'yyyy-MM-dd');
                const inputDate = new Date(timestamp);
                  // formattedDate = inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                 formattedDate = inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });// Adjust the format as needed
                this.daterangefilter.push(formattedDate);
              });

              // Log the array of formatted dates

                      }
                    });
                  }
                  this.daterangefilter =Array.from(new Set(this.daterangefilter));
                  // //console.log(JSON.stringify(this.daterangefilter));

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
              element.otaPlanList.forEach((element2) => {
                if(element2.otaName ==='GHC'){
                  this.planPrice.push((element2.price)* this.booking.noOfRooms);

                  this.extraPersonChargee = this.token.getExtraPersonCharge();
                  let extraPerson = Number(this.extraPersonChargee);

                  if (isNaN(extraPerson)) {
                     extraPerson = 0;
                   }

                 this.extraChildChargee = this.token.getChildCharge();
                 let extraChild = Number(this.extraChildChargee);

                if (isNaN(extraChild)) {
                   extraChild = 0;
                   }

          let noOfNights = Number(this.booking.noOfNights);
          let totalPrice = Number((element2.price)) + ((extraPerson + extraChild) / noOfNights);
          // let totalPrice = Number(element2.price) + Number((this.extraPersonChargee) + Number(this.extraChildChargee) / (this.booking.noOfNights));
                  if(totalPrice <= 7500){
                    this.taxAmount = ((totalPrice * this.booking.noOfRooms) * 12) / 100;
                    this.taxArray.push(this.taxAmount);
                  }

                  if(totalPrice > 7501){
                    this.taxAmount = ((totalPrice * this.booking.noOfRooms) * 18) / 100;
                    this.taxArray.push(this.taxAmount);
                  }

                this.totalplanPrice = this.planPrice.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
                if(this.activeForGoogleHotelCenter === true && element.otaPlanList.length > 0){
                  this.token.saveLandingPrice(this.totalplanPrice);
                  }
                }
                // //console.log(
                //   'ota price is equa;' + JSON.stringify(this.planPrice)
                // );
              });
            });
          });
          this.Googlehotelsortrooms = this.roomWithGHCPlan;
          this.availableRooms?.forEach((des) => {
            const hasAvailableRooms = des?.ratesAndAvailabilityDtos?.some(
              (des2) => {
                // //console.log('my data is ', des2);
                return des2.stopSellOBE !== true && des2.stopSellOBE !== null;
              }
            );

            this.isDiabled = !hasAvailableRooms;
          });

          if (facilities !== null && facilities !== undefined) {
            facilities.forEach((fac) => {
              // //console.log("Image url: "+fac.imageUrl)
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
              if(fac.serviceType == 'DistanceBusStop'){
                this.isDistanceBusStop = fac;
              }

              if(fac.serviceType == 'DistanceTouristPlace'){
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

          this.availableRooms?.forEach((ele) => {
            if (
              ele.ratesAndAvailabilityDtos != null &&
              ele.ratesAndAvailabilityDtos != undefined &&
              ele.ratesAndAvailabilityDtos.length > 0
            ) {
              // //console.log("Available rooms: "+JSON.stringify(ele.ratesAndAvailabilityDtos));
              this.availability = true;
            } else {
              this.allDtosNull();
            }
          });
          // //console.log('this.availability: ' + this.availability);
          // if (this.availableRooms === null && this.availableRooms === undefined) {
          //   this.availability =false;
          // }
          if (response.body.available === true) {
            this.checkAvailabilityStatusName = 'Available';
          } else {
            this.checkAvailabilityStatusName = 'Not Available';
          }

          let currentUrl = window.location.href;

          this.phoneNumberBookingEngine =  currentUrl.includes("BookingEngine") || currentUrl.includes("bookingEngine")
                ? this.businessUser.mobile : "9040785705";

          // Logger.log('checkAvailability ' + JSON.stringify(response.body));
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            Logger.log('checkAvailability error');
          }
        }
      );
        setTimeout(() => {
      if(this.activeForGoogleHotelCenter == true){
        this.fetchAndProcessRoomsDataOne();
      } else if (this.activeForGoogleHotelCenter == false){
        this.fetchAndProcessRoomsData();
      }
    }, 3000);
        this.sortAndLimitRoomsOne();
        this.token.clearAllTaxArray();
      this.getTotalTaxFee();
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
      totaltax = this.taxArray.reduce((acc, curr) => acc + Number(curr || 0), 0);
    }

    this.token.saveAllTaxAray(totaltax);

    return totaltax;
  }

  checkavailabilityCall(){
  this.isLoading = true;
}

  landingTaxAmount(){
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
    this.booking.noOfPersons = this.adults;
    this.booking.noOfChildren = this.children;
    this.booking.noOfRooms = this.rooms;
    this.token.saveBookingData(this.booking);
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
          this.shortrooms = response.body.roomList;
          let facilities = this.businessUser.propertyServicesList;
          if (
            this.availableRooms !== null &&
            this.availableRooms !== undefined
          ) {
            this.availableRooms?.forEach((room) => {

              room?.ratesAndAvailabilityDtos?.forEach((ele) => {
                ele.roomRatePlans?.forEach((e) => {
                  // //console.log(JSON.stringify(e.propertyServicesList));
                  if (e.name === this.booking.roomRatePlanName) {
                    this.planpropertyServiceList = e.propertyServicesList;
                    console.log("this.planpropertyServiceList",this.planpropertyServiceList)
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
                      //   //console.log("dfghjkljhgvg" + JSON.stringify(this.addServiceList))
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
                // //console.log('dayonetrip: ' + this.dayOneTrip);
              } else {
                this.dayOneTrip = false;
              }
            });
          }
          this.roomWithGHCPlan = [];
          this.Googlehotelsortrooms =[];

          let ghcPlan = new RoomRatePlans();
          this.daterange = [];
          this.daterangefilter = []
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
                        this.daterange.forEach(timestamp => {
                          let formattedDate = datePipe.transform(new Date(timestamp), 'yyyy-MM-dd');
                          const inputDate = new Date(timestamp);
                            // formattedDate = inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                           formattedDate = inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });// Adjust the format as needed
                          this.daterangefilter.push(formattedDate);
                        });
                        this.daterangefilter =Array.from(new Set(this.daterangefilter));
                        // //console.log(JSON.stringify(this.daterangefilter));

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
          if(this.activeForGoogleHotelCenter === true){
            this.roomWithGHCPlan[0]?.ratesAndAvailabilityDtos.forEach((e) => {
              e.roomRatePlans.forEach((element) => {
                element.otaPlanList.forEach((element2) => {
                  if(element2.otaName ==='GHC'){
                  this.planPrice.push((element2.price) * this.booking.noOfRooms);
                  this.totalplanPrice = this.planPrice.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  );
                  }
                  this.bookingCity = this.planPrice[0]?.toString();
                  this.token.saveBookingCity(this.bookingCity)

                 this.booking.roomPrice = this.totalplanPrice;

                 this.booking.netAmount = this.booking.roomPrice +
                 this.booking.extraPersonCharge +
                 this.booking.extraChildCharge;
                 this.token.saveBookingData(this.booking);


                });
              });
            });
          }
          this.Googlehotelsortrooms = this.roomWithGHCPlan
          this.availableRooms?.forEach((des) => {
            const hasAvailableRooms = des?.ratesAndAvailabilityDtos?.some(
              (des2) => {
                // //console.log('my data is ', des2);
                return des2.stopSellOBE !== true && des2.stopSellOBE !== null;
              }
            );

            this.isDiabled = !hasAvailableRooms;
          });

          if (facilities !== null && facilities !== undefined) {
            facilities.forEach((fac) => {
              // //console.log("Image url: "+fac.imageUrl)
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
              if(fac.serviceType == 'DistanceBusStop'){
                this.isDistanceBusStop = fac;
              }

              if(fac.serviceType == 'DistanceTouristPlace'){
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

          this.availableRooms?.forEach((ele) => {
            if (
              ele.ratesAndAvailabilityDtos != null &&
              ele.ratesAndAvailabilityDtos != undefined &&
              ele.ratesAndAvailabilityDtos.length > 0
            ) {
              // //console.log("Available rooms: "+JSON.stringify(ele.ratesAndAvailabilityDtos));
              this.availability = true;
            } else {
              this.allDtosNull();
            }
          });
          // //console.log('this.availability: ' + this.availability);
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

  // Filter Private offers
  const privateOffers = this.offersList.filter(
    (offer) => offer.promotionAppliedFor === 'Private'
  );


  // Check if enteredCoupon matches any couponCode (case-insensitive)
  const matchedOffer = privateOffers.find(
    (offer) => offer.couponCode?.trim().toUpperCase() === this.enteredCoupon.toUpperCase()
  );

  // If match found, store it as valid
  if (matchedOffer) {
    this.validCouponCode = matchedOffer.couponCode;
    this.privatePromotionData = matchedOffer; // optional, if you need it later
  } else {
    this.validCouponCode = ''; // reset if not matched
    this.privatePromotionData = null;
  }
}



onYesClick() {

  this.privateOffers2 = this.offersList.filter(
    (offer) => offer.promotionAppliedFor === 'Private'
  );

  const matchingOffer = this.privateOffers2.find(
    item => item.couponCode?.trim().toUpperCase() === this.enteredCoupon?.trim().toUpperCase()
  );

  if (matchingOffer) {
    this.privatePromotionData = matchingOffer;
    this.privateOffersMinimumAmount = matchingOffer.minimumOrderAmount;

    this.successMessagePrivate = 'Applied';
    this.selectedPromotion = true;
    this.isValidPrivateCoupon = true;
    this.couponApplied = true;
    this.couponSuccessApplied = true;

    localStorage.setItem('selectedPromoData', JSON.stringify(this.privatePromotionData));
    localStorage.setItem('selectPromo', 'true');

    // Optional: delay scroll and close
    setTimeout(() => {
      this.isPopupOpen = false;
      const offerSection23 = document.getElementById("accmdOne");
      if (offerSection23) {
        offerSection23.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 1000);
  } else {
    console.log('No matching coupon found.');
    // Optionally show error state or feedback here
  }
}


onYesClickMobileView() {
  this.privateOffers2 = this.offersList.filter(
    (offer) => offer.promotionAppliedFor === 'Private'
  );

  this.privateOffers2.forEach(item1 => {
    this.privatePromotionData = item1;
    this.privateOffersMinimumAmount = item1.minimumOrderAmount;
  });

  if (this.enteredCoupon.trim().toUpperCase() === this.validCouponCode.toUpperCase()) {
    this.successMessagePrivate = 'Applied';
    this.selectedPromotion = true;
    this.isValidPrivateCoupon = true;
    this.couponApplied = true;
    this.couponSuccessApplied = true;

    localStorage.setItem('selectedPromoData', JSON.stringify(this.privatePromotionData));
    localStorage.setItem('selectPromo', 'true');

    // Optional: delay scroll and close
    setTimeout(() => {
      this.isPopupOpen = false;
      const offerSection23 = document.getElementById("accmdtwo");
      if (offerSection23) {
        offerSection23.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 1000);
  }
}

validateAndCloseCard(){
   if (this.enteredCoupon && this.enteredCoupon.trim() === this.validCouponCode) {
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


resetButtonPrivate(){
 this.enteredCoupon = '';
  this.showSuccessContent = false;
  this.couponSuccessApplied = false;
}

clearEnteredCoupon(){
  this.enteredCoupon = ' ';
}


  onNoClick(){
    console.log('data is not present');
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


