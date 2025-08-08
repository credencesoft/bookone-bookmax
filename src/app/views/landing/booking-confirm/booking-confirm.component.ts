import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { API_URL_IN, API_URL_NZ } from 'src/app/app.component';
import { BusinessOfferDto } from 'src/app/model/businessOfferDto';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { TokenStorage } from 'src/token.storage';
import { EnquiryForm } from '../onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { EnquiryDto } from 'src/app/model/enquiry';
import { BusinessUser } from 'src/app/model/user';
import { Booking } from 'src/app/model/booking';
import { Payment } from 'src/app/model/payment';
import { Location, DatePipe } from '@angular/common';

import { externalReservationDtoList } from 'src/app/model/externalReservation';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';
import { BusinessServiceDtoList } from 'src/app/model/businessServiceDtoList';
import { RoomDetail } from 'src/app/model/RoomDetail';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'src/services/listing.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'src/services/logger.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { WhatsappDto } from 'src/app/model/whatsappDto';
import { Template } from 'src/app/model/template';
import { Language } from 'src/app/model/language';
import { Components } from 'src/app/model/components';
import { Para } from 'src/app/model/parameters';
import { Images } from 'src/app/model/image';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
  styleUrls: ['./booking-confirm.component.scss']
})
export class BookingConfirmComponent {
  businessUser: BusinessUser;
  booking: Booking;
  payment: Payment;
  PropertyUrl: string;
  paymentLoader: boolean;
  bookingData: any;
  isSuccess: boolean;
  headerTitle: string;
  externalReservationdto: any;
  bodyMessage: string;
  storedPromo: string;
  businessOfferDto: BusinessOfferDto;
  selectedPromo: any;
  externalReservationDtoList:externalReservationDtoList[];
  showAlert: boolean = false;
  alertType: string;
  bookingConfirmed = false;
  fromDate: any;
  copyTextOne:boolean=false;

  toDate: any;
  adults: number;
  children: number;
  children3to5: number;
  noOfrooms: number;
  currency: string;
  payment2: Payment;
  totalExtraAmount: number = 0;
  totalTaxAmount: number = 0;
  totalBeforeTaxAmount: number = 0;
  addServiceList: any[];
  enquiryForm: any;
  textToCopy: string = 'This is some text to copy';
textToCopyOne: string = 'This is some text to copy';
  showMore:boolean =false;
  enquiryResponse: EnquiryForm;
  successMessage: boolean;
  reservationRoomDetails:RoomDetail[];
  propertyServices:PropertyServiceDTO[];
  API_URL: string;
  accommodationService: any;
  enquirySent: boolean = false;
  submitButtonDisable: boolean;
  savedServices: any[] = [];
  businessServiceDtoList: any[] = [];
  getDetailsData: any;
  dueAmount: number;
  businessServiceDto: BusinessServiceDtoList;
  bookingRoomPrice: any;
  socialmedialist:any;
  promocodeListChip : any[] = [];
  taxAmountOne: number;
  bookinddata: Booking;
  fromTimeDate: string = '';
  toTimeDate: string = '';
  combinedDateFromTime: number;
  combinedDateToTime: number;
  percentage1: number;
  percentage2: number;
  totalPercentage: number;
  isReadMore: boolean[] = [];
  policies = [];
  whatsappForm:WhatsappDto;
  template :Template;
  language:Language;
  componentstype:Components;
  parametertype:Para;
  parameterss:Para[];
  components:Components[];
  parametertype2:Para;
  parameterss2:Para[];
  componentstype2:Components;
  componentstype9:Components;
  componentstype10:Components;
  parametertype20:Para;
  parameterss15:Para[];
  images:Images;
  parametertype3:Para;
  parameterss3:Para[];
  parameterss1:Para[];
  bookingId: any;
  referenceNumber: string;
  DiffDate;
  enddate;
  startDate;
  paymentSucess:boolean = false;
  paymenterror: boolean;
  bookingOne:Booking;
  taxPercentage: number;
  allSubscription: any;
  propertyData: any;
  shortName: any;
  bookingsResponseList: any[] = [];
    bookingSummaryDetails: any;
 referenceNumberAfterBooking: any;
   propertyDetails: any;
     expanded: boolean = false;
       totalPlanAdults: number = 0;
  totalPlanChildren: number = 0;
  constructor(
    private http: HttpClient,
    private token: TokenStorage,
    private acRoute: ActivatedRoute,
    private hotelBookingService: HotelBookingService,
    private ngZone: NgZone,
    private changeDetectorRefs: ChangeDetectorRef,
    private location: Location,
    private router: Router,
    private listingService: ListingService,
    private datePipe: DatePipe,
  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();
    this.whatsappForm = new WhatsappDto();
    this.template =new Template();
    this.language = new Language();
    this.componentstype = new Components();
    this.parametertype = new Para();
    this.parametertype2 = new Para();
    this.componentstype2 = new Components();
    this.componentstype9 = new Components();
    this.componentstype10 = new Components();
    this.parametertype20 = new Para();
    this.parametertype3 = new Para()
    this.parameterss =[];
    this.components = [];
    this.parameterss2 =[];
    this.parameterss3 = [];
    this.parameterss1 = [];

    this.parameterss15 = [];
    this.images = new Images();
    this.externalReservationDtoList =[]
    this.PropertyUrl = this.token.getPropertyUrl();
    this.isReadMore = this.policies.map(() => false);
        this.propertyDetails = this.token.getProperty();
    if (this.token.getPropertyData() != null && this.token.getPropertyData() != undefined)
    {
      this.businessUser = this.token.getPropertyData();
      this.businessServiceDto = this.businessUser.businessServiceDtoList.find(
        (data) => data.name === "Accommodation"
      );
            setInterval(() => {
    this.loadBookingSessionData();
  }, 10);
    }

    setTimeout(() => {
      this.pushDataToDataLayer();
    }, 200);

      setTimeout(() => {
        this.businessUser?.socialMediaLinks.forEach(element => {
          this.socialmedialist=element
        });
                  }, 1000);

    if (this.token.getBookingData() != null && this.token.getBookingData() != undefined)
    {
      this.booking = this.token.getBookingData();
      this.bookinddata =  this.booking;
      if (this.booking.taxDetails.length > 0 ) {
        this.booking.taxDetails.forEach((element) => {
          if (element.name === 'GST') {
            this.booking.taxDetails = [];
            this.booking.taxDetails.push(element);
            this.taxPercentage = element.percentage;
            this.booking.taxPercentage = this.taxPercentage;

            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount > this.booking.beforeTaxAmount &&
                  element2.minAmount < this.booking.beforeTaxAmount
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <
                  this.booking.beforeTaxAmount
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        });

        // this.taxPercentage = this.booking.taxDetails[0].percentage;
      }
      // console.log("this.booking" + JSON.stringify(this.booking))
      this.taxAmountOne = this.booking.taxAmount
      this.dueAmount = this.booking.totalAmount - this.booking.advanceAmount;
    }

    if (this.token.getPaymentData() != null && this.token.getPaymentData() != undefined)
    {
      this.payment = this.token.getPaymentData();
      console.log("this.payment"+JSON.stringify(this.payment))
    }

    if (this.token.getPayment2Data() != null && this.token.getPayment2Data() != undefined)
    {
      this.payment2 = this.token.getPayment2Data();
    }

    this.storedPromo = localStorage.getItem('selectPromo');
    if(this.storedPromo == 'true'){
     const selectedPromoData = JSON.parse( localStorage.getItem('selectedPromoData'));
     this.selectedPromo = selectedPromoData
     // this.businessOfferDto = selectedPromoData
  //  console.log(selectedPromoData)
   }else{
     this.getOfferDetails();
   }
    this.addServiceList = [];
    if (this.token.getServiceData() !== null) {
      this.addServiceList = this.token.getServiceData();
    }
    if (this.token.getBookingData() !== null) {
      this.bookingData = this.token.getBookingData();
      this.booking = this.bookingData;
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
      this.adults = this.booking.noOfPersons;
      this.children = this.booking.noOfChildren;
      // this.children3to5 = this.booking.noOfChildren3To5yrs;
      this.noOfrooms = this.booking.noOfRooms;
    }
    if (this.bookingData?.propertyId != null && this.bookingData?.propertyId != undefined) {
      this.getPropertyDetailsById(this.bookingData.propertyId);
    }
    setTimeout(() => {
      this.savedServices = this.token.getSelectedServices();
                }, 100);

                this.businessServiceDtoList = this.token.getProperty()?.businessServiceDtoList;
                this.businessServiceDtoList?.forEach((element) => {
                  if(element.name === 'Accommodation'){
                  this.getDetailsData = element.advanceAmountPercentage;
                }
                });
                if (this.bookingData.propertyId != null && this.bookingData.propertyId != undefined) {
                  this.getPropertyDetailsById(this.bookingData.propertyId);
                }

                if (this.token.saveBookingRoomPrice(this.booking.roomPrice) !== null) {
                  this.bookingRoomPrice = this.token.getBookingRoomPrice();


                }

      this.propertyData =  this.token.getProperty();
      this.shortName = this.propertyData?.shortName;


  }

  ngOnInit() {

    this.acRoute.queryParams.subscribe((params) => {
      if (params["businessUser"] !== undefined) {
        this.businessUser = JSON.parse(params["businessUser"]);
      }

      if (params["payment"] !== undefined) {
        this.payment = JSON.parse(params["payment"]);
      }

      if (params["payment2"] !== undefined) {
        this.payment2 = JSON.parse(params["payment2"]);
      }

      if (params["addServiceList"] !== undefined) {
        this.addServiceList = [];
        this.payment2 = JSON.parse(params["addServiceList"]);
      }

      if (params["booking"] !== undefined) {
        this.booking = JSON.parse(params["booking"]);

        this.bookingData = this.booking;
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
        this.adults = this.booking.noOfPersons;
        this.children = this.booking.noOfChildren;
        // this.children3to5 = this.booking.noOfChildren3To5yrs;
        this.noOfrooms = this.booking.noOfRooms;
      }

    });


    this.totalExtraAmount = 0;
    this.totalBeforeTaxAmount = 0;
    this.totalTaxAmount = 0;
    this.addServiceList.forEach((element) => {
      this.totalExtraAmount = this.totalExtraAmount + element.afterTaxAmount;
      this.totalTaxAmount = this.totalTaxAmount + element.taxAmount;
      this.totalBeforeTaxAmount =
        this.totalBeforeTaxAmount + element.beforeTaxAmount;
    });
    this.getPaymentInfoByReffId(this.payment.referenceNumber);

    if (this.booking.id !== undefined) {
      this.bookingConfirmed = true;
    }
    this.currency = 'INR';
    this.getDiffDate(this.toDate, this.fromDate);
  }
  loadBookingSessionData(): void {
  const bookingDataDetails = sessionStorage.getItem('bookingSummaryDetails');
  if (bookingDataDetails) {
    this.bookingSummaryDetails = JSON.parse(bookingDataDetails);
    this.calculateTotalGuestsFromPlans();
    console.log('bookingSummaryDetails', this.bookingSummaryDetails);
  }

  const bookingsResponseList = sessionStorage.getItem('bookingsResponseList');
  if (bookingsResponseList) {
    this.bookingsResponseList = JSON.parse(bookingsResponseList);
    this.calculateTotalGuestsFromPlans();
    console.log('bookingsResponseList', this.bookingsResponseList);
  }
}

  backone() {
    sessionStorage.removeItem('bookingsResponseList');
    sessionStorage.removeItem('bookingSummaryDetails');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('BOOKINGDATAOJC');
    sessionStorage.removeItem('bookingSummary');
    sessionStorage.removeItem('EnquiryResponseList');
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
    toggleViewMore(event: Event): void {
    event.preventDefault();
    this.expanded = !this.expanded;
  }
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
  getOfferDetails() {
    this.hotelBookingService
      .getOfferDetailsBySeoFriendlyName(this.businessUser.seoFriendlyName)
      .subscribe((data) => {
        this.businessOfferDto = data.body;
        this.promocodeListChip = this.checkValidCouponOrNot(data.body);
      })
  }
  // Used For handled to check coupons are valid ot not.
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
  pushDataToDataLayer(): void {
    const completeBookingData = {

      hotel_name: this.token.getProperty()?.name || '',
      event_time: new Date().toISOString(),
      reservation_num: this.booking.propertyReservationNumber || '',
      guest_name: this.booking.firstName + this.booking.lastName || '',
      email: this.booking.email || '',
      mobile: this.booking.mobile || '',
      room_name: this.booking.roomName || '',
      destination: this.token.getProperty()?.address?.city || '' ,
      total_amount: this.booking.totalAmount || '',
      num_person: this.booking.noOfPersons || '',
    };

    // Datalayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'booking_complete',
      Hotel: [completeBookingData]
    });


  }
  ngAfterViewInit() {
    if (this.token.getBookingData() != null && this.token.getBookingData() != undefined)
      {
        setTimeout(() => {
          this.booking = this.token.getBookingData();
          // this.bookingOne = this.token.getBookingData();
          this.dueAmount = this.booking.totalAmount - this.booking.advanceAmount;
                    }, 500);

      }
  }
  getPaymentInfoByReffId(referenceNumber){
    this.hotelBookingService.getPaymentByReffId(referenceNumber).subscribe((res) => {
      this.payment = res.body[0];
      if (this.payment?.failureCode === null && this.payment.status == 'Paid') {

        this.createAllBookings();

      }else{
        // //Logger.log('create enquiry')
        this.createEnquiry();
      }
    });


      this.bookingRoomPrice = this.token.getRoomPrice();
console.log("this.bookingRoomPrice" +this.bookingRoomPrice)


  }


  toggleView(): void {
    this.showMore = !this.showMore;
  }

  mileSecondToNGBDate(date: string) {
    const dsd = new Date(date);
    const year = dsd.getFullYear();
    const day = dsd.getDate();
    const month = dsd.getMonth() + 1;
    return { year: year, month: month, day: day };
  }
  addServiceToBooking(bookingId, savedServices: any[]) {
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
        (error) => {}
      );
  }
    createAllBookings() {
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
      if (index >= plans.length) return;
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
    const booking: any = {};

    booking.roomRatePlanName = plan.planCodeName;
    booking.roomName = plan.roomName;
    booking.roomType = plan.roomName;
    booking.planCode = plan.planName;
      const bookingSummaryStr = sessionStorage.getItem('bookingSummaryDetails');
            if (bookingSummaryStr) {
          this.bookingSummaryDetails = JSON.parse(bookingSummaryStr);

          if (
            this.bookingSummaryDetails.selectedPlansSummary &&
            this.bookingSummaryDetails.selectedPlansSummary.length > 0
          ) {
            // Get the 0th index plan
            const firstPlan = this.bookingSummaryDetails.selectedPlansSummary[0];
            console.log('First plan pushed:', firstPlan);
            if (firstPlan.planCodeName ===  booking.roomRatePlanName) {
                              if (this.businessServiceDto.advanceAmountPercentage === 50) {
              booking.advanceAmount = Number(
                Number((((firstPlan?.taxPercentageperroom + firstPlan?.price) / 100) * 50).toFixed(2))
              );
            } else if (this.businessServiceDto.advanceAmountPercentage === 100) {
              booking.advanceAmount = Number(
                Number((firstPlan?.taxPercentageperroom + firstPlan?.price).toFixed(2))
              );
            } else {
              booking.advanceAmount = Number(
                Number((((firstPlan?.taxPercentageperroom + firstPlan?.price) / 100) * 20).toFixed(2))
              );
            }
            } else {
              booking.advanceAmount = 0;
            }
          }
        }
    booking.roomId = plan.roomId;
    booking.noOfPersons = plan.adults;
    booking.firstName = this.booking.firstName;
    booking.lastName = this.booking.lastName;
    booking.mobile = this.booking.mobile;
    booking.email = this.booking.email;
    booking.noOfChildren = plan.children;
    booking.noOfNights = plan.nights;
    booking.noOfRooms = Number(plan.selectedRoomnumber);
    booking.netAmount = plan.price;
    booking.beforeTaxAmount = plan.price;
    booking.createdDate = new Date().toISOString();
    booking.propertyId = this.booking.propertyId;
    booking.gstAmount = plan.taxPercentageperroom;
    booking.dayTrip = false;
    booking.discountPercentage = 0;
    booking.discountAmount = 0;
    booking.extraChildCharge = plan.extraPersonChildCountAmount || 0;
    booking.extraPersonCharge = plan.extraPersonCharge || 0;
    booking.roomTariffBeforeDiscount = plan.price;
    booking.totalAmount = plan.price + plan.taxPercentageperroom;
    booking.bookingAmount = booking.totalAmount;
    booking.payableAmount = booking.totalAmount;
    booking.fromDate = bookingSummary.fromDate;
    booking.toDate = bookingSummary.toDate;
    booking.currency = this.businessUser.localCurrency;
    booking.fromTime = Number(this.token.getFromTime());
    booking.toTime = Number(this.token.getToTime());
    booking.modeOfPayment = this.payment.paymentMode;
    booking.externalSite = 'WebSite';
    booking.businessName = this.businessUser.name;
    booking.businessEmail = this.businessUser.email;
    booking.roomBooking = true;
    booking.groupBooking = false;
    booking.available = true;
    booking.roomPrice = plan.actualRoomPrice;
    booking.taxAmount = booking.gstAmount;
    booking.totalRoomTariffBeforeDiscount = plan.price;
    booking.noOfExtraPerson = plan.extraCountAdult;
    booking.noOfExtraChild = plan.extraCountChild;
    booking.purposeOfVisit = '';
    booking.paymentId = this.booking.paymentId;
    booking.includeService = this.booking.includeService;
    booking.taxDetails = this.token
      .getProperty()
      .taxDetails.filter(
        (item) =>
          item.name === 'CGST' || item.name === 'SGST' || item.name === 'GST'
      );
    booking.taxPercentage = plan.taxpercentage;

    Logger.log('createBooking ', JSON.stringify(booking));

    this.paymentLoader = true;

    this.hotelBookingService.createBooking(booking).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        const savedBooking = response.body;
        const existingBookingsStr = sessionStorage.getItem(
          'bookingsResponseList'
        );
        const existingBookings = existingBookingsStr
          ? JSON.parse(existingBookingsStr)
          : [];
        existingBookings.push(savedBooking);
        sessionStorage.setItem(
          'bookingsResponseList',
          JSON.stringify(existingBookings)
        );
        this.token.saveBookingDataObj(savedBooking);
        this.bookingId = savedBooking.id;
        this.referenceNumberAfterBooking =
          savedBooking.propertyReservationNumber;

        this.addServiceToBooking(
          savedBooking.id,
          this.bookingSummaryDetails?.propertyServiceListDataOne
        );
        this.getSubscriptions(savedBooking);
        this.sendWhatsappMessageToTHM(savedBooking);
        // this.router.navigate(['/reservation-confirm-page']);
        // Save payment
        this.payment.referenceNumber = savedBooking.propertyReservationNumber;
        this.payment.externalReference = savedBooking.externalBookingID;
        this.payment.amount = booking.totalAmount;
                    this.updateEnquiryStatusToBooked();

                            this.hotelBookingService
            .savePayment(this.payment)
            .subscribe((res) => {
              if (res.status === 200) {
                // this.openSuccessSnackBar(`Payment Details Saved`);
                this.paymentLoader = false;

                if (this.booking.payableAmount != this.payment.transactionAmount) {
                  if (this.businessServiceDto.advanceAmountPercentage === 50) {
                    this.payment.id = undefined;
                    this.payment.paymentMode = 'Cash';
                    this.payment.status = 'NotPaid';
                    this.payment.taxAmount = (this.booking.taxAmount / 100) * 50;
                    this.payment.netReceivableAmount = (this.booking.netAmount / 100) * 50;
                    this.payment.transactionAmount = (this.booking.totalAmount / 100) * 50;
                    this.payment.referenceNumber = this.booking.propertyReservationNumber;
                    this.payment.amount = (this.booking.totalAmount / 100) * 50;
                    this.booking.advanceAmount = (this.booking.totalAmount / 100) * 50;
                    this.payment.propertyId = this.bookingData.propertyId;
                    this.payment.transactionChargeAmount = (this.booking.totalAmount / 100) * 50;
                  } else {
                    this.payment.id = undefined;
                    this.payment.paymentMode = 'Cash';
                    this.payment.status = 'NotPaid';
                    this.payment.taxAmount = (this.booking.taxAmount / 100) * 80;
                    this.payment.netReceivableAmount = (this.booking.netAmount / 100) * 80;
                    this.payment.transactionAmount = (this.booking.totalAmount / 100) * 80;
                    this.payment.referenceNumber = this.booking.propertyReservationNumber;
                    this.payment.amount = (this.booking.totalAmount / 100) * 80;
                    this.booking.advanceAmount = (this.booking.totalAmount / 100) * 20;
                    this.payment.propertyId = this.bookingData.propertyId;
                    this.payment.transactionChargeAmount = (this.booking.totalAmount / 100) * 80;
                  }
                  this.hotelBookingService
                  .processPayment(this.payment)
                  .subscribe((response2) => {
                    this.payment = response2.body;
                    this.booking.paymentId = response2.body.id;
                    this.booking.modeOfPayment = this.payment.paymentMode;
                    if (this.bookingId != null) {
                      this.submitButtonDisable = true;
                      this.isSuccess = true;
                      this.headerTitle = "Success!";
                      this.bodyMessage =
                        "Thanks for the booking .Please note the Reservation No: # " +
                        this.booking.propertyReservationNumber +
                        " and an email is sent with the booking details.";

                      this.token.clearHotelBooking();
                      // this.showSuccess(this.contentDialog);

                      this.paymentLoader = true;

                      Logger.log("payment " + JSON.stringify(this.payment));
                      // this.paymentIntentPayTm(this.payment);
                    } else {
                      this.paymentLoader = false;
                      this.paymenterror = true;
                    }
                  });
                  }


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

        Logger.log('payment ' + JSON.stringify(this.payment));

        if (callback) callback();
      } else {
        if (callback) callback(); // Proceed even if failed
      }
    });
  }

  createBookingPayTM() {

    this.booking.modeOfPayment = this.payment.paymentMode;
    this.booking.externalSite = 'Website';
    this.booking.businessName = this.businessUser.name;
    this.booking.businessEmail = this.businessUser.email;
    this.booking.roomBooking = true;
    this.booking.bookingAmount = this.booking.totalAmount;
    this.booking.groupBooking = false;
    this.booking.available = true;
    this.booking.payableAmount = this.booking.totalAmount;
    this.booking.currency = this.businessUser.localCurrency;
    this.booking.paymentId = this.payment.id;
    this.booking.fromTime = Number(this.token.getFromTime());
    this.booking.toTime = Number(this.token.getToTime());

    this.booking.taxDetails = this.token.getProperty().taxDetails.filter(item=>item.name === 'CGST' || item.name === 'SGST' || item.name === 'GST');
    this.booking.taxDetails.forEach(item=>{
      if(item.name === 'CGST'){
        this.percentage1 = item.percentage;
      }

      if(item.name === 'SGST'){
        this.percentage2 = item.percentage;
      }
    })
    this.totalPercentage = (this.percentage1 + this.percentage2);

     this.booking.taxAmount = this.booking?.taxAmount;
     console.log('tax amount is',this.booking.taxAmount);
    this.booking.roomPrice = this.booking.beforeTaxAmount;

//     this.propertyServices = this.savedServices;
// this.propertyServices?.forEach(ele => {
//   ele.count = ele.quantity;
//   ele.id = null;
//   ele.date = new Date().toISOString().split('T')[0];
//   ele.logoUrl = null;
//   ele.imageUrl = null;
//   ele.description = null;
// ele.organisationId = null;
// });
// this.booking.services = this.propertyServices;

    //Logger.log('createBooking ', JSON.stringify(this.booking));

    this.paymentLoader = true;
    this.hotelBookingService
      .createBooking(this.booking)
      .subscribe((response) => {
        //  //Logger.log('createBooking ', JSON.stringify(response.body));
        if (response.status === 200) {
          this.paymentLoader = false;
          this.booking = response.body;
          this.referenceNumber = response.body.propertyReservationNumber;
          this.bookingId = String(response.body.id);
          this.booking.fromDate = this.bookingData.fromDate;
          this.booking.toDate = this.bookingData.toDate;
          // this.sendWhatsappMessageToTHM();
          // this.sendWhatsappMessageToTHM1();
          // this.sendWhatsappMessageToTHM2();
          // this.sendWhatsappMessageToTHM3();
          // this.sendWhatsappMessageToTHM4();
          // this.sendWhatsappMessageToTHM5();
          this.payment.referenceNumber = this.booking.propertyReservationNumber;
          this.payment.externalReference = this.booking.externalBookingID;
          if (
            this.savedServices != null &&
            this.savedServices != undefined &&
            this.savedServices.length > 0
          ) {
            this.addSeviceTopBooking(
              response.body.id,
              this.savedServices
            );
          }
          // this.addServiceToBooking(this.booking);
          this.getSubscriptions(this.booking.propertyId);
          this.bookingConfirmed = true;
          this.paymentLoader = true;
          this.changeDetectorRefs.detectChanges();
          this.payment.status = 'Paid';
          //Logger.log('payment ' + JSON.stringify(this.payment));

            this.updateEnquiryStatusToBooked();

          this.hotelBookingService
            .savePayment(this.payment)
            .subscribe((res) => {
              if (res.status === 200) {
                // this.openSuccessSnackBar(`Payment Details Saved`);
                this.paymentLoader = false;

                if (this.booking.payableAmount != this.payment.transactionAmount) {
                  if (this.businessServiceDto.advanceAmountPercentage === 50) {
                    this.payment.id = undefined;
                    this.payment.paymentMode = 'Cash';
                    this.payment.status = 'NotPaid';
                    this.payment.taxAmount = (this.booking.taxAmount / 100) * 50;
                    this.payment.netReceivableAmount = (this.booking.netAmount / 100) * 50;
                    this.payment.transactionAmount = (this.booking.totalAmount / 100) * 50;
                    this.payment.referenceNumber = this.booking.propertyReservationNumber;
                    this.payment.amount = (this.booking.totalAmount / 100) * 50;
                    this.booking.advanceAmount = (this.booking.totalAmount / 100) * 50;
                    this.payment.propertyId = this.bookingData.propertyId;
                    this.payment.transactionChargeAmount = (this.booking.totalAmount / 100) * 50;
                  } else {
                    this.payment.id = undefined;
                    this.payment.paymentMode = 'Cash';
                    this.payment.status = 'NotPaid';
                    this.payment.taxAmount = (this.booking.taxAmount / 100) * 80;
                    this.payment.netReceivableAmount = (this.booking.netAmount / 100) * 80;
                    this.payment.transactionAmount = (this.booking.totalAmount / 100) * 80;
                    this.payment.referenceNumber = this.booking.propertyReservationNumber;
                    this.payment.amount = (this.booking.totalAmount / 100) * 80;
                    this.booking.advanceAmount = (this.booking.totalAmount / 100) * 20;
                    this.payment.propertyId = this.bookingData.propertyId;
                    this.payment.transactionChargeAmount = (this.booking.totalAmount / 100) * 80;
                  }
                  this.hotelBookingService
                  .processPayment(this.payment)
                  .subscribe((response2) => {
                    this.payment = response2.body;
                    this.booking.paymentId = response2.body.id;
                    this.booking.modeOfPayment = this.payment.paymentMode;
                    if (this.booking.id != null) {
                      this.submitButtonDisable = true;
                      this.isSuccess = true;
                      this.headerTitle = "Success!";
                      this.bodyMessage =
                        "Thanks for the booking .Please note the Reservation No: # " +
                        this.booking.propertyReservationNumber +
                        " and an email is sent with the booking details.";

                      this.token.clearHotelBooking();
                      // this.showSuccess(this.contentDialog);

                      this.paymentLoader = true;

                      Logger.log("payment " + JSON.stringify(this.payment));
                      // this.paymentIntentPayTm(this.payment);
                    } else {
                      this.paymentLoader = false;
                      this.paymenterror = true;
                    }
                  });
                  }


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



  addSeviceTopBooking(bookingId, savedServices: any[]) {

    this.hotelBookingService.saveBookingService(bookingId, savedServices).subscribe(
      (data) => {

        this.changeDetectorRefs.detectChanges();
        // Logger.log(JSON.stringify( this.businessServices));
      },
      (error) => {

      }
    );
  }


  toggleReadMore(index: number) {
    // Toggle the read more/less flag for the clicked policy
    this.isReadMore[index] = !this.isReadMore[index];
  }


  async getPropertyDetailsById(id: number) {

    try {

      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation'
        );
        this.calculateServiceHours()
        this.businessUser?.socialMediaLinks.forEach(element => {
          this.socialmedialist=element
        });


        this.token.saveProperty(this.businessUser);
        this.currency = this.businessUser.localCurrency.toUpperCase();

        this.businessServiceDto = this.businessUser?.businessServiceDtoList.find(
          (data) => data.name === this.businessUser.businessType
        );

        if (this.businessUser.primaryColor !== undefined) {
          this.changeTheme(
            this.businessUser.primaryColor,
            this.businessUser.secondaryColor,
            this.businessUser.tertiaryColor
          );
        }





        this.changeDetectorRefs.detectChanges();
      } else {
        this.router.navigate(["/404"]);
      }
    } catch (error) {

      // Handle the error appropriately, if needed.
    }
  }

  getDiffDate(toDate, fromDate) {
    this.enddate = new Date(toDate.year, toDate.month - 1, toDate.day);

    this.startDate = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
    // console.log('this.fromDate: ', this.startDate);
    // console.log('this.toDate: ', this.enddate);
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


  calculateServiceHours (){
    this.accommodationService = this.businessUser.businessServiceDtoList.filter(service => service.name === "Accommodation");
    console.log(" this.accommodationService" + JSON.stringify( this.accommodationService))
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

  getSubscriptions(booking: any) {
    console.log('booking', booking);
    this.hotelBookingService
      .getSubscriptions(booking.propertyId)
      .subscribe((res) => {
        this.allSubscription = res.body;
        const foundSubscription = this.allSubscription.find(
          (ele) => ele.name === 'BookOne Subscription'
        );

        if (foundSubscription) {
          this.externalReservation(booking);
        } else {
          console.log('BookOne Subscription is not found');
        }
      });
  }

  externalReservation(booking) {
    this.reservationRoomDetails = [];
    let roomdetailss = new RoomDetail();
    let externalreservation = new externalReservationDtoList();
    externalreservation.checkinDate = booking.fromDate;
    externalreservation.checkoutDate = booking.toDate;
    externalreservation.currency = booking.currency;
    externalreservation.email = booking.email;
    externalreservation.couponCode = booking.couponCode;
    externalreservation.promotionName = booking.promotionName;
    externalreservation.totalAmount = booking.totalAmount;
    if(booking.advanceAmount) {
      externalreservation.paidAmount = booking.advanceAmount;
    } else {
      externalreservation.paidAmount = 0;
    }

    externalreservation.amountBeforeTax = booking.beforeTaxAmount;
    externalreservation.channelId = '9';
    externalreservation.lastModifiedBy = 'hotelmate';
    externalreservation.modeOfPayment = 'Cash';
    externalreservation.otaReservationId =
      this.propertyData.shortName + '-BE-' + booking.id;
    externalreservation.propertyId = booking.propertyId.toString();
    externalreservation.propertyName = booking.businessName;
    externalreservation.firstName = booking.firstName;
    externalreservation.lastName = booking.lastName;
    externalreservation.bookoneReservationId =
      booking.propertyReservationNumber;
    externalreservation.contactNumber = booking.mobile;
    externalreservation.propertyBusinessEmail = booking.businessEmail;
    externalreservation.externalTransactionId =
      this.propertyData.shortName + '-BE-' + booking.id;
    externalreservation.createdBy = 'hotelmate';
    roomdetailss.checkinDate = booking.fromDate;
    roomdetailss.checkoutDate = booking.toDate;
    roomdetailss.noOfRooms = booking.noOfRooms;
    roomdetailss.noOfadult = booking.noOfPersons;
    roomdetailss.noOfchild = booking.noOfChildren;
    roomdetailss.plan = booking.roomRatePlanName;
    roomdetailss.roomRate = booking.roomPrice;
    roomdetailss.roomTypeId = booking.roomId;
    roomdetailss.roomTypeName = booking.roomName;
    this.reservationRoomDetails.push(roomdetailss);
    externalreservation.roomDetails = this.reservationRoomDetails;
    this.propertyServices = this.savedServices;
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
    externalreservation.taxAmount = booking.taxAmount;
    // externalreservation.lastModifiedDate = new Date().toString();
    externalreservation.noOfPerson = booking.noOfPersons.toString();
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
  updateEnquiryStatusToBooked() {
  const enquiryResponseListStr = sessionStorage.getItem('EnquiryResponseList');

  if (!enquiryResponseListStr) {
    console.error('No EnquiryResponseList found in sessionStorage.');
    return;
  }

  const enquiryResponseList: EnquiryDto[] = JSON.parse(enquiryResponseListStr);

  if (!Array.isArray(enquiryResponseList) || enquiryResponseList.length === 0) {
    console.error('EnquiryResponseList is empty or invalid.');
    return;
  }

  this.paymentLoader = true;

  enquiryResponseList.forEach((enquiry, index) => {
    // Update the status
    enquiry.status = 'Booked';

        this.paymentSucess = true

    this.hotelBookingService.accommodationEnquiry(enquiry).subscribe({
      next: (response) => {
        console.log(`Enquiry ${index + 1} updated successfully:`, response.body);
      },
      error: (err) => {
        console.error(`Error updating enquiry ${index + 1}:`, err);
      },
      complete: () => {
        if (index === enquiryResponseList.length - 1) {
          this.paymentLoader = false;
          this.isSuccess = true;
          this.submitButtonDisable = true;
          this.bookingConfirmed = true;
        }
      }
    });
  });
}

  // accommodationEnquiryBookingData(){

  //   this.enquiryForm = new EnquiryDto();

  //   if (this.token.getProperty().address != null && this.token.getProperty().address != undefined &&
  //     this.token.getProperty().address.city != null && this.token.getProperty().address.city != undefined)
  //   {
  //     this.enquiryForm.address = this.token.getProperty().address;
  //     this.enquiryForm.country = this.token.getProperty().address.country;
  //     this.enquiryForm.location = this.token.getProperty().address.city;
  //     this.enquiryForm.alternativeLocation = this.token.getProperty().address.city;
  //   }
  //   this.payment.netReceivableAmount = this.booking.netAmount;
  //   this.enquiryForm.min = this.booking.totalAmount;
  //   this.enquiryForm.max = this.booking.totalAmount;
  //   this.enquiryForm.totalAmount = this.booking.totalAmount;
  //   this.enquiryForm.advanceAmount = this.booking.advanceAmount;

  //   this.enquiryForm.firstName = this.booking.firstName;
  //   this.enquiryForm.lastName = this.booking.lastName;
  //   this.enquiryForm.email = this.booking.email;
  //   this.enquiryForm.phone = this.booking.mobile;
  //   this.enquiryForm.checkOutDate = this.booking.toDate;
  //   this.enquiryForm.checkInDate = this.booking.fromDate;
  //   this.enquiryForm.noOfPerson = this.booking.noOfPersons;
  //   this.enquiryForm.noOfExtraPerson=this.booking.noOfExtraPerson;
  //   this.enquiryForm.roomId=this.booking.roomId;
  //   this.enquiryForm.couponCode = this.booking.couponCode;
  //   this.enquiryForm.promotionName = this.booking.promotionName;
  //   this.enquiryForm.couponCode = this.booking.couponCode;
  //   this.enquiryForm.promotionName = this.booking.promotionName;
  //   this.enquiryForm.payableAmount=this.booking.netAmount;
  //   this.enquiryForm.roomName=this.booking.roomName;
  //   this.enquiryForm.extraPersonCharge=this.booking.extraPersonCharge;
  //   this.enquiryForm.extraChildCharge = this.booking.extraChildCharge;
  //   this.enquiryForm.noOfExtraChild=this.booking.noOfExtraChild;
  //   this.enquiryForm.externalSite="Website";
  //   this.enquiryForm.source = "Bookone Connect"
  //   this.enquiryForm.beforeTaxAmount=this.booking.beforeTaxAmount;
  //   if(this.token.getProperty().whatsApp === "" || this.token.getProperty().whatsApp === null || this.token.getProperty().whatsApp === undefined){
  //     this.enquiryForm.mobile= this.token.getProperty().mobile;
  //   } else {
  //     this.enquiryForm.mobile = this.token.getProperty().whatsApp;
  //   }
  //   this.enquiryForm.roomType=this.booking.roomType;
  //   this.enquiryForm.roomRatePlanName=this.booking.roomRatePlanName;
  //   this.enquiryForm.roomPrice = this.booking.beforeTaxAmount;
  //   // this.enquiryForm.roomPrice = (Number(this.token.getBookingRoomPrice()) * (this.booking.noOfRooms * this.DiffDate));
  //   console.log('room price is',this.enquiryForm.roomPrice);
  //   this.enquiryForm.createdDate = new Date();
  //   this.enquiryForm.fromTime = Number(this.token.getFromTime());
  //   this.enquiryForm.toTime = Number(this.token.getToTime());
  //   this.enquiryForm.accountManager ='TheHotelMate Team';
  //   this.enquiryForm.consultantPerson ='';
  //   this.enquiryForm.noOfRooms = this.booking.noOfRooms;
  //   this.enquiryForm.noOfChildren = this.booking.noOfChildren;
  //   this.enquiryForm.accommodationType = this.token.getProperty().businessType;
  //   this.enquiryForm.status = "Booked";
  //   this.enquiryForm.specialNotes = this.booking.notes
  //   this.enquiryForm.propertyId = 763;
  //   this.enquiryForm.currency = this.token.getProperty().localCurrency;
  //   this.enquiryForm.taxDetails = this.token.getProperty().taxDetails;
  //   this.enquiryForm.planCode = this.booking.planCode;
  //   this.enquiryForm.bookingReservationId = this.booking.propertyReservationNumber;
  //   this.enquiryForm.bookingId = this.booking.id;
  //   this.enquiryForm.advanceAmount = this.booking.advanceAmount;
  //   this.enquiryForm.taxAmount = this.booking.taxAmount;

  //   this.enquiryForm.bookingPropertyId = this.token.getProperty().id;
  //   this.enquiryForm.propertyName = this.token.getProperty().name;

  //   const TO_EMAIL = 'reservation@thehotelmate.co';
  //   const TO_NAME = 'Support - The Hotel Mate';
  //   const bccEmail = 'samaya.muduli@credencesoft.co.nz';
  //   const bccEmail2 = 'info@bookonepms.com';
  //   const bccName = 'Samaya';

  //   this.enquiryForm.fromName =
  //   this.enquiryForm.firstName + ' ' + this.enquiryForm.lastName;
  //   this.enquiryForm.toName = TO_NAME;
  //   this.enquiryForm.fromEmail = this.enquiryForm.email;
  //   this.enquiryForm.toEmail = TO_EMAIL;
  //   this.enquiryForm.bccEmail = bccEmail;
  //   this.enquiryForm.bccName = bccEmail;
  //   this.enquiryForm.bccEmailTo = bccEmail2;

  //   if (
  //     this.enquiryForm.dietaryRequirement === null ||
  //     this.enquiryForm.dietaryRequirement === undefined
  //   ) {
  //     this.enquiryForm.dietaryRequirement = '';
  //   }
  //   if (
  //     this.enquiryForm.accommodationType === null ||
  //     this.enquiryForm.accommodationType === undefined
  //   ) {
  //     this.enquiryForm.accommodationType = '';
  //   }
  //   if (
  //     this.enquiryForm.specialNotes === null ||
  //     this.enquiryForm.specialNotes === undefined
  //   ) {
  //     this.enquiryForm.specialNotes = '';
  //   }
  //   if (
  //     this.enquiryForm.alternativeLocation === null ||
  //     this.enquiryForm.alternativeLocation === undefined
  //   ) {
  //     this.enquiryForm.alternativeLocation = '';
  //   }
  //   this.enquiryForm.foodOptions = '';
  //   this.enquiryForm.organisationId = environment.parentOrganisationId;
  //   this.paymentLoader = true;
  //   this.enquiryForm.enquiryId = sessionStorage.getItem('enquiryNo');
  //   this.hotelBookingService.accommodationEnquiry(this.enquiryForm).subscribe((response) => {
  //     this.enquiryForm = response.body;
  //     if (this.enquiryForm != null &&  this.enquiryForm != undefined) {
  //       this.paymentSucess = true
  //     }
  //     this.paymentLoader = false;
  //     this.paymentLoader = false;
  //     this.isSuccess = true;
  //     this.submitButtonDisable = true;
  //     this.bookingConfirmed = true;
  //     // this.token.clearFromTime();
  //     // this.token.clearToTime();
  //   })
  // }



  createEnquiry() {
    this.booking.modeOfPayment = this.payment?.paymentMode;
    this.booking.externalSite = 'The Hotel Mate';
    this.booking.businessName = this.businessUser.name;
    this.booking.businessEmail = this.businessUser.email;
    this.booking.roomBooking = true;
    this.booking.bookingAmount = this.booking.totalAmount;
    this.booking.groupBooking = false;
    this.booking.available = true;
    this.booking.payableAmount = this.booking.totalAmount;
    this.booking.currency = this.businessUser.localCurrency;
    this.booking.paymentId = this.payment?.id;

    //Logger.log('createBooking ', JSON.stringify(this.booking));

    this.paymentLoader = true;


    // //Logger.log(JSON.stringify(this.subscriptions));
      const TO_EMAIL = 'subhasmitatripathy37@gmail.com';
      // const TO_EMAIL = 'abir.sayeed@gmail.com';
      const TO_NAME = 'Support - The Hotel Mate';
      const bccEmail = 'rajeshbiswal591@gmail.com';
      // const bccEmail= 'abir.sayeed@credencesoft.co.nz';

      const bccName = 'Samaya';
      this.enquiryForm = new EnquiryForm();
      this.enquiryForm.businessEmail = this.businessUser.email;
      this.enquiryForm.businessName = this.businessUser.name;
      this.enquiryForm.roomBooking = this.booking.roomBooking;
      this.enquiryForm.groupBooking = this.booking.groupBooking;
      this.enquiryForm.roomId = this.booking.roomId;
      this.enquiryForm.roomPrice = this.booking.roomPrice;
      this.enquiryForm.roomName = this.booking.roomName;
      this.enquiryForm.firstName = this.booking.firstName;
      this.enquiryForm.lastName =  this.booking.lastName;
      this.enquiryForm.fromDate =  this.booking.fromDate;
      this.enquiryForm.toDate =  this.booking.toDate;
      // this.enquiryForm.fromTime =  this.booking.fromTime;
      // this.enquiryForm.toTime =  this.booking.toTime;
      this.enquiryForm.checkInDate =  this.booking.fromDate;
      this.enquiryForm.checkOutDate =  this.booking.toDate;
      this.enquiryForm.email =  this.booking.email;
      this.enquiryForm.hsnCode = this.booking.hsnCode;
      this.enquiryForm.phone =  this.booking.mobile;
      this.enquiryForm.mobile =  this.booking.mobile;
      this.enquiryForm.noOfRooms =  this.booking.noOfRooms;
      this.enquiryForm.noOfPerson =  this.booking.noOfPersons;
      this.enquiryForm.noOfChildren =  this.booking.noOfChildren;
      this.enquiryForm.noOfPets = this.booking.noOfPets;
      this.enquiryForm.externalSite = this.booking.externalSite;
      this.enquiryForm.location = '';
      this.enquiryForm.min = 0;
      this.enquiryForm.max = 0;
      this.enquiryForm.roomRatePlanName = this.booking.roomRatePlanName;
      this.enquiryForm.noOfExtraPerson = this.booking.noOfExtraPerson;
      this.enquiryForm.extraPersonCharge = this.booking.extraPersonCharge;
      this.enquiryForm.noOfExtraChild = this.booking.noOfExtraChild;
      this.enquiryForm.extraChildCharge = this.booking.extraChildCharge;
      this.enquiryForm.roomTariffBeforeDiscount = this.booking.roomTariffBeforeDiscount;
      this.enquiryForm.totalBookingAmount = this.booking.totalBookingAmount;
      this.enquiryForm.paymentStatus = this.payment?.status;
      this.enquiryForm.totalRoomTariffBeforeDiscount = this.booking.totalRoomTariffBeforeDiscount;
      this.enquiryForm.discountAmount = this.booking.discountAmount;
      this.enquiryForm.taxAmount = (this.booking.netAmount * this.booking.taxPercentage) / 100
      this.enquiryForm.taxDetails = this.booking.taxDetails;
      this.enquiryForm.payableAmount = this.booking.payableAmount;
      this.enquiryForm.totalAmount = this.booking.totalAmount;
      this.enquiryForm.beforeTaxAmount = this.booking.beforeTaxAmount;
      this.enquiryForm.propertyId = this.booking.propertyId;
      this.enquiryForm.currency = this.booking.currency;
      this.enquiryForm.available = this.booking.available;
      this.enquiryForm.modeOfPayment = this.booking.modeOfPayment;
      this.enquiryForm.includeService = this.booking.includeService;
      this.enquiryForm.customerId = this.booking.customerId;
      this.enquiryForm.businessEmail = this.businessUser.email;
      this.enquiryForm.planCode = this.booking.planCode;

      this.enquiryForm.organisationId = this.businessUser.organisationId;

      this.enquiryForm.counterNumber = '1';
      this.enquiryForm.operatorName = '';

      this.enquirySent = true;

      this.enquiryForm.fromName = this.enquiryForm.firstName + ' ' + this.enquiryForm.lastName;
      this.enquiryForm.toName = TO_NAME;
      this.enquiryForm.fromEmail = this.enquiryForm.email;
      this.enquiryForm.toEmail = TO_EMAIL;
      this.enquiryForm.bccEmail = bccEmail;
      this.enquiryForm.bccName = bccEmail;

      this.enquiryForm.accommodationType = '';
      // this.enquiryForm.dietaryRequirement = form.controls.dietaryRequirement.value;

      this.enquiryForm.accommodationType = this.businessUser.businessSubtype;
      this.enquiryForm.status = "Enquiry";

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



      this.enquiryForm.subject = '';
      this.setApi();
      //Logger.log('form data ' + JSON.stringify(this.enquiryForm));
      //  this.success = true;
      this.http
        .post<EnquiryForm>(
          this.API_URL + '/api/website/enquire',
          this.enquiryForm
        )
        .subscribe((response) => {
          this.enquiryResponse = response;
          this.successMessage = true;
          //Logger.log('save ' + response);
        });
      this.http
        .post<EnquiryForm>(environment.apiUrlBookone + '/api/email/enquire', this.enquiryForm)
        .subscribe((response) => {
          // this.success = response;
          //Logger.log('sent ' + response);


          // this.enquiryForm = new EnquiryForm();
          this.successMessage = true;
        });

    this.paymentLoader = false;

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
  copyTextfour() {

    // Find the element
    const textToCopyOne = document.getElementById('textToCopyOne')?.innerText.trim();

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
    // this.locationBack.back();
    this.token.clearHotelBooking();
  }

  onGoHome(){
    this.router.navigate(["/booking"]);
  }

  sendWhatsappMessageToTHM(booking) {
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type = 'individual';
    this.template.name = '';
    this.template.name = 'bookone_paylater';
    (this.language.code = 'en'), (this.template.language = this.language);
    (this.componentstype.type = 'header'),
      (this.componentstype2.type = 'body'),
      (this.parametertype2 = new Para());
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.firstName);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text = this.businessUser.name);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text = String(booking.propertyReservationNumber));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.fromDate, 'dd-MM-YYYY') + ',');
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text';
    if (this.booking.fromTime) {
      this.parametertype2.text = new Date(
        booking.fromTime
      ).toLocaleTimeString();
    } else {
      this.parametertype2.text = ' ';
    }
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text =
        this.datePipe.transform(booking.toDate, 'dd-MM-YYYY') + ',');
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
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.promotionName
        ? booking.promotionName
        : ' ');
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.totalAmount.toFixed(2));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'), (this.parametertype2.text = ' ');
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'),
      (this.parametertype2.text = booking.totalAmount.toFixed(2));
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    (this.parametertype2.type = 'text'), (this.parametertype2.text = ' ');
    this.parameterss2.push(this.parametertype2);

    this.componentstype2.parameters = this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = 'url';
    this.componentstype9.type = 'button';

    this.parametertype20 = new Para();
    (this.parametertype20.type = 'text'),
      (this.parametertype20.text =
        '/reservation-confirm?bookingId=' + booking.propertyReservationNumber);
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);

    this.template.components = this.components;
    this.whatsappForm.template = this.template;
    (this.whatsappForm.to = '6372198255'),
      (this.whatsappForm.type = 'template'),
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe(
        (response) => {
          this.paymentLoader = false;
        },
        (error) => {
          this.paymentLoader = false;
        }
      );
  }

    // sendWhatsappMessageToTHM1(){
    //   this.whatsappForm = new WhatsappDto();
    //   this.template =new Template();
    //   this.language = new Language();
    //   this.componentstype = new Components();
    //   this.parametertype = new Para();
    //   this.images = new Images();
    //   this.componentstype2 = new Components();
    //   this.componentstype9 = new Components();
    //   this.parametertype2 = new Para();
    //   this.parametertype20 = new Para();
    //   this.parametertype3 = new Para()
    //   this.componentstype9 = new Components();
    //   this.componentstype10 = new Components();
    //   this.parameterss2 =[];
    //   this.parameterss3 = [];
    //   this.parameterss15 = [];
    //   this.components = [];
    //   this.parameterss =[];
    //   this.parameterss1 = [];

    //   this.whatsappForm.messaging_product = 'whatsapp';
    //   this.whatsappForm.recipient_type ='individual';
    //   this.template.name = "";
    //   this.template.name = "payment_confirmation_1";
    //   this.language.code = 'en',
    //   this.template.language = this.language;
    //   this.componentstype.type= 'header',
    //   this.parametertype.type = 'text',
    //   this.parametertype.text = this.booking.businessName;
    //   this.parameterss.push(this.parametertype);
    //   this.componentstype.parameters =this.parameterss;
    //   this.components.push(this.componentstype);
    //   this.componentstype2.type= 'body',
    //   this.parametertype2 = new Para()
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = this.booking.firstName ;
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para()
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = this.businessUser.name;
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = String(this.bookingId);
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = this.datePipe.transform(this.booking.fromDate, 'dd-MM-YYYY') + ",";
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text';
    //       if (this.booking.fromTime) {
    //          this.parametertype2.text = new Date(this.booking.fromTime).toLocaleTimeString();
    //       } else {
    //          this.parametertype2.text = " ";
    //       }
    //   this.parameterss2.push(this.parametertype2);


    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = this.datePipe.transform(this.booking.toDate, 'dd-MM-YYYY') + ",";
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text';
    //       if (this.booking.toTime) {
    //          this.parametertype2.text = new Date(this.booking.toTime).toLocaleTimeString();
    //       } else {
    //          this.parametertype2.text = " ";
    //       }
    //   this.parameterss2.push(this.parametertype2);


    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text';
    //   this.parametertype2.text = " ";
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text';
    //   this.parametertype2.text = this.booking.roomName;
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text';
    //   this.parametertype2.text = String(this.booking.noOfPersons);
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text';
    //   this.parametertype2.text = String(this.booking.noOfChildren);
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = this.booking.totalAmount.toFixed(2);
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',

    //   this.parametertype2.text = String((this.booking.advanceAmount).toFixed(2));
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = 'reservation@thehotelmate.co';
    //   this.parameterss2.push(this.parametertype2);

    //   this.parametertype2 = new Para();
    //   this.parametertype2.type = 'text',
    //   this.parametertype2.text = " ";
    //   this.parameterss2.push(this.parametertype2);


    //   this.componentstype2.parameters =this.parameterss2;
    //   this.components.push(this.componentstype2);

    //   this.componentstype9.index = '0';
    //   this.componentstype9.sub_type = "url";
    //   this.componentstype9.type = "button";

    //   this.parametertype20 = new Para();
    //   this.parametertype20.type = 'text',
    //   this.parametertype20.text = "/booking-confirmation-page?bookingId="+ this.referenceNumber;
    //   this.parameterss15.push(this.parametertype20);
    //   this.componentstype9.parameters = this.parameterss15;
    //   this.components.push(this.componentstype9);


    //   this.template.components = this.components;
    //   this.whatsappForm.template =this.template;
    //   this.whatsappForm.to = "7608935904",
    //   this.whatsappForm.type = 'template',
    //     this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
    //       this.paymentLoader = false;

    //     }, error => {
    //       this.paymentLoader = false;
    //     });
    //   }

      // sendWhatsappMessageToTHM2(){
      //   this.whatsappForm = new WhatsappDto();
      // this.template =new Template();
      // this.language = new Language();
      // this.componentstype = new Components();
      // this.parametertype = new Para();
      // this.images = new Images();
      // this.componentstype2 = new Components();
      // this.componentstype9 = new Components();
      // this.parametertype2 = new Para();
      // this.parametertype20 = new Para();
      // this.parametertype3 = new Para()
      // this.componentstype9 = new Components();
      // this.componentstype10 = new Components();
      // this.parameterss2 =[];
      // this.parameterss3 = [];
      // this.parameterss15 = [];
      // this.components = [];
      // this.parameterss =[];
      // this.parameterss1 = [];

      //   this.whatsappForm.messaging_product = 'whatsapp';
      //   this.whatsappForm.recipient_type ='individual';
      //   this.template.name = "";
      //   this.template.name = "payment_confirmation_1";
      //   this.language.code = 'en',
      //   this.template.language = this.language;
      //   this.componentstype.type= 'header',
      //   this.parametertype.type = 'text',
      //   this.parametertype.text = this.booking.businessName;
      //   this.parameterss.push(this.parametertype);
      //   this.componentstype.parameters =this.parameterss;
      //   this.components.push(this.componentstype);
      //   this.componentstype2.type= 'body',
      //   this.parametertype2 = new Para()
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = this.booking.firstName ;
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para()
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = this.businessUser.name;
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = String(this.referenceNumber);
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = this.datePipe.transform(this.booking.fromDate, 'dd-MM-YYYY') + ",";
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //         this.parametertype2.type = 'text';
      //             if (this.booking.fromTime) {
      //                this.parametertype2.text = new Date(this.booking.fromTime).toLocaleTimeString();
      //             } else {
      //                this.parametertype2.text = " ";
      //             }
      //         this.parameterss2.push(this.parametertype2);


      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = this.datePipe.transform(this.booking.toDate, 'dd-MM-YYYY') + ",";
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //         this.parametertype2.type = 'text';
      //             if (this.booking.toTime) {
      //                this.parametertype2.text = new Date(this.booking.toTime).toLocaleTimeString();
      //             } else {
      //                this.parametertype2.text = " ";
      //             }
      //         this.parameterss2.push(this.parametertype2);


      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text';
      //   this.parametertype2.text = " ";
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text';
      //   this.parametertype2.text = this.booking.roomName;
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text';
      //   this.parametertype2.text = String(this.booking.noOfPersons);
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text';
      //   this.parametertype2.text = String(this.booking.noOfChildren);
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = this.booking.totalAmount.toFixed(2);
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',

      //   this.parametertype2.text = String((this.booking.advanceAmount).toFixed(2));
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = 'reservation@thehotelmate.co';
      //   this.parameterss2.push(this.parametertype2);

      //   this.parametertype2 = new Para();
      //   this.parametertype2.type = 'text',
      //   this.parametertype2.text = " ";
      //   this.parameterss2.push(this.parametertype2);


      //   this.componentstype2.parameters =this.parameterss2;
      //   this.components.push(this.componentstype2);

      //   this.componentstype9.index = '0';
      //   this.componentstype9.sub_type = "url";
      //   this.componentstype9.type = "button";

      //   this.parametertype20 = new Para();
      //   this.parametertype20.type = 'text',
      //   this.parametertype20.text = "/booking-confirmation-page?bookingId="+ this.referenceNumber;
      //   this.parameterss15.push(this.parametertype20);
      //   this.componentstype9.parameters = this.parameterss15;
      //   this.components.push(this.componentstype9);


      //   this.template.components = this.components;
      //   this.whatsappForm.template =this.template;
      //   this.whatsappForm.to = "8328818871",
      //   this.whatsappForm.type = 'template',
      //     this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
      //       this.paymentLoader = false;

      //     }, error => {
      //       this.paymentLoader = false;
      //     });
      //   }

        sendWhatsappMessageToTHM3(){
          this.whatsappForm = new WhatsappDto();
      this.template =new Template();
      this.language = new Language();
      this.componentstype = new Components();
      this.parametertype = new Para();
      this.images = new Images();
      this.componentstype2 = new Components();
      this.componentstype9 = new Components();
      this.parametertype2 = new Para();
      this.parametertype20 = new Para();
      this.parametertype3 = new Para()
      this.componentstype9 = new Components();
      this.componentstype10 = new Components();
      this.parameterss2 =[];
      this.parameterss3 = [];
      this.parameterss15 = [];
      this.components = [];
      this.parameterss =[];
      this.parameterss1 = [];

          this.whatsappForm.messaging_product = 'whatsapp';
          this.whatsappForm.recipient_type ='individual';
          this.template.name = "";
          this.template.name = "payment_confirmation_1";
          this.language.code = 'en',
          this.template.language = this.language;
          this.componentstype.type= 'header',
          this.parametertype.type = 'text',
          this.parametertype.text = this.booking.businessName;
          this.parameterss.push(this.parametertype);
          this.componentstype.parameters =this.parameterss;
          this.components.push(this.componentstype);
          this.componentstype2.type= 'body',
          this.parametertype2 = new Para()
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.booking.firstName ;
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para()
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.businessUser.name;
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = String(this.referenceNumber);
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.datePipe.transform(this.booking.fromDate, 'dd-MM-YYYY') + ",";
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
              this.parametertype2.type = 'text';
                  if (this.booking.fromTime) {
                     this.parametertype2.text = new Date(this.booking.fromTime).toLocaleTimeString();
                  } else {
                     this.parametertype2.text = " ";
                  }
              this.parameterss2.push(this.parametertype2);


          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text =this.datePipe.transform(this.booking.toDate, 'dd-MM-YYYY') + ",";
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text';
              if (this.booking.toTime) {
                 this.parametertype2.text = new Date(this.booking.toTime).toLocaleTimeString();
              } else {
                 this.parametertype2.text = " ";
              }
          this.parameterss2.push(this.parametertype2);


          this.parametertype2 = new Para();
          this.parametertype2.type = 'text';
          this.parametertype2.text = " ";
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
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.booking.totalAmount.toFixed(2);
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',

          this.parametertype2.text = String((this.booking.advanceAmount).toFixed(2));
          this.parameterss2.push(this.parametertype2);

          // this.parametertype2 = new Para();
          // this.parametertype2.type = 'text',
          // this.parametertype2.text = 'reservation@thehotelmate.co';
          // this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.businessUser.name;
          this.parameterss2.push(this.parametertype2);


          this.componentstype2.parameters =this.parameterss2;
          this.components.push(this.componentstype2);

          this.componentstype9.index = '0';
          this.componentstype9.sub_type = "url";
          this.componentstype9.type = "button";

          this.parametertype20 = new Para();
          this.parametertype20.type = 'text',
          this.parametertype20.text = "/booking-confirmation-page?bookingId="+ this.referenceNumber;
          this.parameterss15.push(this.parametertype20);
          this.componentstype9.parameters = this.parameterss15;
          this.components.push(this.componentstype9);


          this.template.components = this.components;
          this.whatsappForm.template =this.template;
          this.whatsappForm.to = "9004146024",
          this.whatsappForm.type = 'template',
            this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
              this.paymentLoader = false;

            }, error => {
              this.paymentLoader = false;
            });
          }

          sendWhatsappMessageToTHM4(){
            this.whatsappForm = new WhatsappDto();
        this.template =new Template();
        this.language = new Language();
        this.componentstype = new Components();
        this.parametertype = new Para();
        this.images = new Images();
        this.componentstype2 = new Components();
        this.componentstype9 = new Components();
        this.parametertype2 = new Para();
        this.parametertype20 = new Para();
        this.parametertype3 = new Para()
        this.componentstype9 = new Components();
        this.componentstype10 = new Components();
        this.parameterss2 =[];
        this.parameterss3 = [];
        this.parameterss15 = [];
        this.components = [];
        this.parameterss =[];
        this.parameterss1 = [];

            this.whatsappForm.messaging_product = 'whatsapp';
            this.whatsappForm.recipient_type ='individual';
            this.template.name = "";
            this.template.name = "payment_confirmation_1";
            this.language.code = 'en',
            this.template.language = this.language;
            this.componentstype.type= 'header',
            this.parametertype.type = 'text',
            this.parametertype.text = this.booking.businessName;
            this.parameterss.push(this.parametertype);
            this.componentstype.parameters =this.parameterss;
            this.components.push(this.componentstype);
            this.componentstype2.type= 'body',
            this.parametertype2 = new Para()
            this.parametertype2.type = 'text',
            this.parametertype2.text = this.booking.firstName ;
            this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para()
            this.parametertype2.type = 'text',
            this.parametertype2.text = this.businessUser.name;
            this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para();
            this.parametertype2.type = 'text',
            this.parametertype2.text = String(this.referenceNumber);
            this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para();
            this.parametertype2.type = 'text',
            this.parametertype2.text = this.datePipe.transform(this.booking.fromDate, 'dd-MM-YYYY') + ",";
            this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para();
            this.parametertype2.type = 'text';
                if (this.booking.fromTime) {
                   this.parametertype2.text = new Date(this.booking.fromTime).toLocaleTimeString();
                } else {
                   this.parametertype2.text = " ";
                }
            this.parameterss2.push(this.parametertype2);


            this.parametertype2 = new Para();
            this.parametertype2.type = 'text',
            this.parametertype2.text = this.datePipe.transform(this.booking.toDate, 'dd-MM-YYYY') + ",";
            this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para();
              this.parametertype2.type = 'text';
                  if (this.booking.toTime) {
                     this.parametertype2.text = new Date(this.booking.toTime).toLocaleTimeString();
                  } else {
                     this.parametertype2.text = " ";
                  }
              this.parameterss2.push(this.parametertype2);


            this.parametertype2 = new Para();
            this.parametertype2.type = 'text';
            this.parametertype2.text = " ";
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
            this.parametertype2.type = 'text',
            this.parametertype2.text = this.booking.totalAmount.toFixed(2);
            this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para();
            this.parametertype2.type = 'text',

            this.parametertype2.text = String((this.booking.advanceAmount).toFixed(2));
            this.parameterss2.push(this.parametertype2);

            // this.parametertype2 = new Para();
            // this.parametertype2.type = 'text',
            // this.parametertype2.text = 'reservation@thehotelmate.co';
            // this.parameterss2.push(this.parametertype2);

            this.parametertype2 = new Para();
            this.parametertype2.type = 'text',
            this.parametertype2.text = this.businessUser.name;
            this.parameterss2.push(this.parametertype2);


            this.componentstype2.parameters =this.parameterss2;
            this.components.push(this.componentstype2);

            this.componentstype9.index = '0';
            this.componentstype9.sub_type = "url";
            this.componentstype9.type = "button";

            this.parametertype20 = new Para();
            this.parametertype20.type = 'text',
            this.parametertype20.text = "/booking-confirmation-page?bookingId="+ this.referenceNumber;
            this.parameterss15.push(this.parametertype20);
            this.componentstype9.parameters = this.parameterss15;
            this.components.push(this.componentstype9);


            this.template.components = this.components;
            this.whatsappForm.template =this.template;
            this.whatsappForm.to = this.booking.mobile,
            this.whatsappForm.type = 'template',
              this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
                this.paymentLoader = false;

              }, error => {
                this.paymentLoader = false;
              });
            }

            sendWhatsappMessageToTHM5(){
              this.whatsappForm = new WhatsappDto();
          this.template =new Template();
          this.language = new Language();
          this.componentstype = new Components();
          this.parametertype = new Para();
          this.images = new Images();
          this.componentstype2 = new Components();
          this.componentstype9 = new Components();
          this.parametertype2 = new Para();
          this.parametertype20 = new Para();
          this.parametertype3 = new Para()
          this.componentstype9 = new Components();
          this.componentstype10 = new Components();
          this.parameterss2 =[];
          this.parameterss3 = [];
          this.parameterss15 = [];
          this.components = [];
          this.parameterss =[];
          this.parameterss1 = [];

              this.whatsappForm.messaging_product = 'whatsapp';
              this.whatsappForm.recipient_type ='individual';
              this.template.name = "";
              this.template.name = "payment_confirmation_1";
              this.language.code = 'en',
              this.template.language = this.language;
              this.componentstype.type= 'header',
              this.parametertype.type = 'text',
              this.parametertype.text = this.booking.businessName;
              this.parameterss.push(this.parametertype);
              this.componentstype.parameters =this.parameterss;
              this.components.push(this.componentstype);
              this.componentstype2.type= 'body',
              this.parametertype2 = new Para()
              this.parametertype2.type = 'text',
              this.parametertype2.text = this.booking.firstName ;
              this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para()
              this.parametertype2.type = 'text',
              this.parametertype2.text = this.businessUser.name;
              this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para();
              this.parametertype2.type = 'text',
              this.parametertype2.text = String(this.referenceNumber);
              this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para();
              this.parametertype2.type = 'text',
              this.parametertype2.text = this.datePipe.transform(this.booking.fromDate, 'dd-MM-YYYY') + ",";
              this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para();
              this.parametertype2.type = 'text';
                  if (this.booking.fromTime) {
                     this.parametertype2.text = new Date(this.booking.fromTime).toLocaleTimeString();
                  } else {
                     this.parametertype2.text = " ";
                  }
              this.parameterss2.push(this.parametertype2);


              this.parametertype2 = new Para();
              this.parametertype2.type = 'text',
              this.parametertype2.text = this.datePipe.transform(this.booking.toDate, 'dd-MM-YYYY') + ",";
              this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para();
              this.parametertype2.type = 'text';
                  if (this.booking.toTime) {
                     this.parametertype2.text = new Date(this.booking.toTime).toLocaleTimeString();
                  } else {
                     this.parametertype2.text = " ";
                  }
              this.parameterss2.push(this.parametertype2);


              this.parametertype2 = new Para();
              this.parametertype2.type = 'text';
              this.parametertype2.text = " ";
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
              this.parametertype2.type = 'text',
              this.parametertype2.text = this.booking.totalAmount.toFixed(2);
              this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para();
              this.parametertype2.type = 'text',

              this.parametertype2.text = String((this.booking.advanceAmount).toFixed(2));
              this.parameterss2.push(this.parametertype2);

              // this.parametertype2 = new Para();
              // this.parametertype2.type = 'text',
              // this.parametertype2.text = 'reservation@thehotelmate.co';
              // this.parameterss2.push(this.parametertype2);

              this.parametertype2 = new Para();
              this.parametertype2.type = 'text',
              this.parametertype2.text = this.businessUser.name;
              this.parameterss2.push(this.parametertype2);


              this.componentstype2.parameters =this.parameterss2;
              this.components.push(this.componentstype2);

              this.componentstype9.index = '0';
              this.componentstype9.sub_type = "url";
              this.componentstype9.type = "button";

              this.parametertype20 = new Para();
              this.parametertype20.type = 'text',
              this.parametertype20.text = "/booking-confirmation-page?bookingId="+ this.referenceNumber;
              this.parameterss15.push(this.parametertype20);
              this.componentstype9.parameters = this.parameterss15;
              this.components.push(this.componentstype9);


              this.template.components = this.components;
              this.whatsappForm.template =this.template;
              this.whatsappForm.to = "9040785705",
              this.whatsappForm.type = 'template',
                this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
                  this.paymentLoader = false;

                }, error => {
                  this.paymentLoader = false;
                });
              }
}
