import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
// import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageDto } from 'src/app/model/MessageDto';
import { Booking } from 'src/app/model/booking';

import { Msg } from 'src/app/model/msg';
import { SMS_NUMBER } from 'src/app/app.component';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import { timestamp } from 'rxjs';
import { TokenStorage } from 'src/token.storage';
import { ListingService } from 'src/services/listing.service';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { Payment } from 'src/app/model/payment';
import { environment } from 'src/environments/environment';
import { BusinessUser } from 'src/app/model/user';
import { BusinessService } from 'src/services/business.service';
import { CancelService } from '../cancel.service';
import { Cancel } from '../cancel';
import { CountryList } from 'src/model/country';
import { Property } from 'src/app/model/property';


@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {

  verifyOption = "sms";
  verificationCode: string ='';
  loader = false;
  totalTaxAmount: number = 0;
  payment: Payment;
  message: MessageDto;
  selectedTab: string = 'booking';
  phoneNumber: string = '';
  OTPNumber: string = '';
  paymentLoader: boolean = false;
  contentDialog: any;
  selectedTabdefault: boolean = true;
  isPhoneNumberValid: boolean = false;
  isOTPNumberValid: boolean = false;
  showOTPInput: boolean = false;
  enquiryphoneNumber: string = '';
  enquiryisPhoneNumberValid: boolean = false;
  enquiryshowOTPInput: boolean = false;
  verificationSuccess: boolean = false;
  verificationSuccess2: boolean = false;
  verificationenquirySuccess2: boolean = false;
  bookedmsg: boolean = true;
  selectedTabdefaultenquiry: boolean = true;
  verificationSuccessenquiry: boolean = false;
  enquirybuttonremove: boolean = true;
  buttonremove: boolean = true;
  bookings: any;
  booking: Booking;
  verifiedPending: boolean = false;
  verified = false;
  isVerified=false
  businessUser: BusinessUser;
  verifySuccessMessage: boolean = false;
  isSuccess: boolean;
  verificationSend = false;
  sendBtn = "Send";
  lookup = false;
  showAlert: boolean = false;
  alertType: string;
  bookingstatus: string;
  fromdate: any;
  Todate: any;
  headerTitle: string;
  bodyMessage: string;
  createdDate: any;
  selectedOption: string = 'EmailRadio';
  selectedOptionenquiry: string = 'emailRadio1';
  email: string = '';
  mobile: string = '';
  bookingId: string = '';
  nodatafound: boolean = false;
  cardPaymentAvailable: boolean;
  totalBeforeTaxAmount: number;
  propertyDetials: any;
  propertyid: any;
  localCurrency: any;
  businessEmail: any;
  businessUserEmail: any;
  pathString: any;
  enquiryId: number;
  bookingEnquiry: any;


  cancelId: any;
  roomType: any;
  roomRatePlanName: any;
  externalSite: any;

  currentPage = 1;
  pageSize = 6;
  // totalPages: number;
  paginatedBookings: any[] = [];
  page: number;
  pageNumber: number;
  noOfPage: number;
  // noOfPageList: PaginationInterface[];
  serialNo: number;
  paginatedData: any[] = [];
  totalPagess: number;
  id: number;
  countryCode: CountryList;
   property: Property;
  CodeNumber: string;
  propertyDetails: BusinessUser;

constructor(private token: TokenStorage,
  private listing:ListingService,
  private businessService: BusinessService,
  private changeDetectorRefs: ChangeDetectorRef,
  private calendar: NgbCalendar,
  private hotelBookingService: HotelBookingService,
  private datePipe: DatePipe,
  private router: Router,
  private cancelService:CancelService,
  ){
    this.message = new MessageDto();
    this.payment = new Payment();
    this.countryCode = new CountryList();
    this.businessUser = new BusinessUser();
    this.cancelId = new Cancel();
    if(this.phoneNumber == undefined){
      this.phoneNumber = '';
    }



}

  externalSites:any[] = [
    { externalSiteName: "The Hotel Mate", logo: "https://bookonelocal.in/cdn/2023-12-12-111128535-The_Hotel_Mate_Logo (2).png" },
    { externalSiteName: "Easemytrip", logo: "https://bookonelocal.in/cdn/2023-12-01-080647948-emt-logo.png" },
    { externalSiteName: "GOBIBO,MMT", logo: "https://bookonelocal.in/cdn/2023-12-01-063051657-Makemytrip_logo (1).png" },
    { externalSiteName: "Agoda", logo: "https://bookonelocal.in/cdn/2023-12-01-072538528-agoda_logo_new.png" },
    { externalSiteName: "Yatra", logo: "https://bookonelocal.in/cdn/2023-12-01-075907997-yatra-removebg-preview.png" },
    { externalSiteName: "Booking.com", logo: "https://bookonelocal.in/cdn/2023-12-01-081659323-booking.com_logo.png" },
    { externalSiteName: "Expedia", logo: "https://bookonelocal.in/cdn/2023-12-12-104013814-expedia_logo_new (2).png" },
    { externalSiteName: "SiteMinder", logo: "https://bookonelocal.in/cdn/2023-12-01-123046823-siteminder_logo.png" },
    { externalSiteName: "BookOne Connect", logo: "https://bookonelocal.in/cdn/2023-12-12-110404816-Logo_Bookone_local.png" },
    { externalSiteName: "Google Hotel Ads", logo: "https://bookonelocal.in/cdn/2023-12-12-111128535-The_Hotel_Mate_Logo (2).png" },
    { externalSiteName: "Airbnb", logo: "https://bookonelocal.in/cdn/2023-12-13-082950342-Airbnb-logo.png" },
    { externalSiteName: "Trivago", logo: "https://bookonelocal.in/cdn/2023-12-13-083356894-Trivago-logo.png" },
    { externalSiteName: "Clear trip", logo: "https://bookonelocal.in/cdn/2023-12-13-084555101-cleartrip_logo.png" },
    { externalSiteName: "OYO", logo: "https://bookonelocal.in/cdn/2024-01-04-081037581-oyo_logo.png" },
    { externalSiteName: "Via.com", logo: "https://bookonelocal.in/cdn/2024-01-09-092714198-via.com_logo.png" },
    { externalSiteName: "Travel Guru", logo: "https://bookonelocal.in/cdn/2024-01-09-101557113-travelguru_logo (2).png" },
    { externalSiteName: "IRCTC", logo: "https://bookonelocal.in/cdn/2024-01-09-094852627-IRCTC-Symbol.png" },
    { externalSiteName: "Hotels.com", logo: "https://bookonelocal.in/cdn/2024-01-09-095428572-Hotels.com_logo.png" },
    { externalSiteName: "BookingJini", logo: "https://bookonelocal.in/cdn/2024-01-09-100813946-bookingjini_logo.png" },
    { externalSiteName: "Fab", logo: "https://bookonelocal.in/cdn/2024-01-18-065632560-fab_hotels_logo (3).png" },
    { externalSiteName: "Treebo", logo: "https://bookonelocal.in/cdn/2024-01-18-092540471-Treebo-Hotels-logo.png" },
    { externalSiteName: "Go Room Go", logo: "https://bookonelocal.in/cdn/2024-01-27-131106600-goroomgo_logo.png" },
    { externalSiteName: "Pie Rooms", logo: "https://bookonelocal.in/cdn/2024-04-26-064814509-pielogo.png" },


  ]


ngOnInit(){
  this.propertyDetails = this.token.getProperty();
  // this.tab3();
  this.checkDefaultCountryCode();
  }

  checkDefaultCountryCode() {
    if (
        this.propertyDetails?.address != undefined &&
        this.propertyDetails?.address != null &&
        this.propertyDetails?.address.country != null &&
        this.propertyDetails?.address.country != undefined
    ) {
        let code = this.countryCode?.countries.find(
            (data) =>
                data.value.toLowerCase() ===
                this.propertyDetails?.address?.country.toLowerCase()
        ).countryCode;

        if (code != undefined) {
            this.CodeNumber = code;
        }
    }
  }


searchenquiry() {
  if (this.selectedOptionenquiry === 'email') {

    //console.log(`Searching for email: ${this.email}`);
  } else if (this.selectedOptionenquiry === 'mobile') {

    //console.log(`Searching for mobile number: ${this.mobile}`);
  }
  else if (this.selectedOptionenquiry === 'bookingId') {

    //console.log(`Searching for Booking ID: ${this.bookingId}`);
  }
  this.bookings.forEach(ele=>{
    this.cancelId = ele;
    //console.log('cancel is',this.cancelId);
  })
}

enquiryStatusVoid(enquiryId:number){


  this.cancelService.enquiryStatusVoid(enquiryId).subscribe(res =>{
      //console.log('cancel is',res);
      // if (this.email != null && this.email != undefined) {
      //   //console.log("email is "+ this.email)
      //   this.getbookingsbyenquiryemail()
      // } else if (this.phoneNumber != null && this.phoneNumber != undefined) {
      //   this.getbookingsbymobileNumber2()
      // }else if (this.bookingId != null && this.bookingId != undefined) {
      //   this.getbookingsbybookingIdenquiry()
      // }
      // //console.log("jhgfg"+ this.selectedOptionenquiry)
      if (this.selectedOptionenquiry === 'mobileRadio1') {
        this.getbookingsbymobileNumber2();
      }if(this.selectedOptionenquiry === 'bookingIdRadio1'){
  this.getbookingsbybookingIdenquiry();
      }if (this.selectedOptionenquiry === 'emailRadio1' ) {
this.getbookingsbyenquiryemail();
      }

  })
}
search() {
  this.resetBookings();
  if (this.selectedOption === 'email') {

    //console.log(`Searching for email: ${this.email}`);
  } else if (this.selectedOption === 'mobile') {

    //console.log(`Searching for mobile number: ${this.mobile}`);
  }
  else if (this.selectedOption === 'bookingId') {

    //console.log(`Searching for Booking ID: ${this.bookingId}`);
  }
}

resetBookings() {
  this.bookings = null;
  this.paginatedData = null;
  this.bookingEnquiry = null;
  this.currentPage = 1;
if (this.bookings?.length === 0 || this.bookings === null ) {
  //console.log(`Searching for Bookings: ${this.bookings}`);
    this.nodatafound = false;
  }
  this.phoneNumber ='';
  this.email ='',
  this.bookingId = ''
}
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  validatePhoneNumber() {
    const phoneNumberPattern = /^\d{10}$/;
  this.isPhoneNumberValid = phoneNumberPattern.test(this.phoneNumber);
  }
  validateOTPNumber() {
    //console.log('OTPNumber:', this.OTPNumber);
    this.isOTPNumberValid = /^\d{5}$/.test(this.OTPNumber);
    //console.log('isOTPNumberValid:', this.isOTPNumberValid);
    this.verifyOTP();
  }


  sendOTP() {
    if (this.isPhoneNumberValid) {
      this.showOTPInput = true;
      this.buttonremove = false;
    }
  }

  verifyOTP() {
      this.showOTPInput = false;
      this.verificationSuccess = true;
      this.selectedTabdefault = false;

  }
  tab1(){
    this.getbookingsbymobileNumber();
  }
  tab2(){
    this.getbookingsbymobileNumber2();
  }

  tab3(){
    this.getbookingsbyemail();
  }
  async getbookingsbymobileNumber2() {
    this.currentPage = 1;
    try {
      this.bookingstatus = 'ENQUIRY';


      const data = await this.listing.findPropertiesByMobilenumberenquiryLms(this.phoneNumber).toPromise();

      this.bookings = data.body;
      this.bookings.reverse();
      this.bookings = this.bookings.filter(ele => ele.status != 'Void')
      //console.log ("my data is",this.bookings )
      this.bookings.forEach(ele=>{
        this.roomType = ele.roomType;
        this.roomRatePlanName = ele.roomRatePlanName;
        this.externalSite = ele.externalSite;
        this.enquiryId = ele.enquiryId;
        //console.log('enquiryId is',this.enquiryId);
        //console.log('externalSite is',this.externalSite);
      })

      this.pageNumber = (this.bookings.length), (_, i) => `Item  ${i + 1}`;
      this.totalPagess = this.bookings.length;
      //console.log('page is',this.pageNumber);
      //console.log('total page is',this.totalPagess);
      this.updatePaginatedData();
      this.bookings.forEach(ele=>{
        this.enquiryId = ele;
      })
      this.verificationSuccessenquiry = true;

      for (const element of this.bookings) {
        const createdDate = new Date(element.createdDate);
        const formattedFromDate = `${createdDate.getDate()} ${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;
        element.createdDate = formattedFromDate;

        if (element.toDate !== null && element.toDate !== undefined) {
          const toDate = new Date(element.toDate);
          const formattedToDate = `${toDate.getDate()} ${toDate.toLocaleString('default', { month: 'long' })} ${toDate.getFullYear()}`;
          element.toDate = formattedToDate;
        }
      }
      if (this.bookings.length === 0) {
        this.nodatafound = true;
      } else {
        this.nodatafound = false;
        // Handle the case when bookings are found
      }
      //console.log("Formatted bookings:", this.bookings);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  updatePaginatedData(){
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    //console.log('starting index',startIndex)
    //console.log('endIndex index',endIndex)
    this.paginatedData = this.bookings.slice(startIndex, endIndex);
    //console.log('total Data is',this.paginatedData);

  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalPagess / this.pageSize);
  }


  async getbookingsbybookingIdenquiry() {
    this.bookingEnquiry = null;
    this.currentPage = 1;

    try {
      const data = await this.listing.findPropertiesBybookingIdLms(Number(this.bookingId)).toPromise();
      this.bookingEnquiry = data.body;
      //console.log('dataaaaaa is', this.bookingEnquiry);

      if (this.bookingEnquiry !== null && this.bookingEnquiry !== undefined && this.bookingEnquiry.length !== 0) {
        this.verificationenquirySuccess2 = true;

        //console.log('my booking data is', JSON.stringify(this.bookingEnquiry));

        this.createdDate = this.bookingEnquiry.createdDate;
        const date = new Date(this.createdDate);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;
        //console.log(formattedDate);
        this.bookingEnquiry.createdDate = formattedDate;

        if (this.bookingEnquiry.toDate !== null && this.bookingEnquiry.toDate !== undefined) {
          this.Todate = this.bookingEnquiry.toDate;
          const date1 = new Date(this.Todate);
          const day1 = date1.getDate();
          const month1 = date1.toLocaleString('default', { month: 'long' });
          const year1 = date1.getFullYear();
          const formattedDate1 = `${day1} ${month1} ${year1}`;
          this.bookingEnquiry.toDate = formattedDate1;
        }

        this.nodatafound = true;
      } else {
        this.nodatafound = false;
      }

      if (this.bookingEnquiry === null || this.bookingEnquiry.status !== "ENQUIRY") {
        this.nodatafound = false;
      } else {
        this.nodatafound = true;
      }

      //console.log("Bookings: " + JSON.stringify('hello my data is', this.bookingEnquiry));
    } catch (error) {
      console.error(error);
      this.nodatafound = true;
    }
  }

  PayViaUpi(item){
    this.booking = item
    let itemName = item.propertyName
    const itemNameWithoutQuotes = itemName.replace(/^"(.*)"$/, '$1');
    this.getPropertiesBySearch(itemNameWithoutQuotes)
  }
  async getPropertiesBySearch(propertyName) {
    this.businessUser.name = propertyName;
    try {
        const data = await this.businessService.getBusinessBySearch(this.businessUser).toPromise();
        //console.log("details " + JSON.stringify(data.body));
        this.propertyDetials = data.body;
        this.propertyDetials.forEach(element => {
            //console.log("fghjk" + element.id);
            this.propertyid = element.id;
            this.localCurrency = element.localCurrency;
            this.businessUserEmail = element.email;
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
    }
    this.payAndCheckout();
}

  payAndCheckout() {

    this.payment.callbackUrl = environment.callbackUrl + this.booking?.propertyReservationNumber + "&BookingEngine=true";


      this.payment.paymentMode = "UPI";
      this.payment.status = "NotPaid";
      this.payment.businessServiceName = "Accommodation";
      this.payment.firstName = this.booking.firstName;
      this.payment.lastName = this.booking.lastName;
      this.payment.name = this.booking.firstName + " " + this.booking.lastName;
//console.log("business email"+ this.businessUserEmail)
      this.payment.email = this.booking.email;
      this.payment.businessEmail = this.businessUserEmail
      this.payment.currency = this.localCurrency
      this.payment.propertyId = this.propertyid;
      this.booking.taxAmount = ((this.booking.netAmount * this.booking.taxPercentage) / 100);
      this.payment.taxAmount = Number((Number(((this.booking.taxAmount / 100) * 20).toFixed(2)) + Number(((this.totalTaxAmount / 100) * 20).toFixed(2))).toFixed(2));
      this.payment.netReceivableAmount = Number((Number(((this.booking.netAmount / 100)* 20).toFixed(2)) + Number(((this.totalBeforeTaxAmount  / 100) * 20).toFixed(2))).toFixed(2));
      this.payment.transactionAmount = Number((Number(((this.booking.payableAmount / 100) * 20).toFixed(2))));
      this.payment.amount = Number((Number(((this.booking.payableAmount / 100) * 20).toFixed(2))));
      this.booking.advanceAmount = Number((Number(((this.booking.payableAmount / 100) * 20).toFixed(2))));
      this.payment.transactionChargeAmount = Number((Number(((this.booking.payableAmount / 100) * 20).toFixed(2))));
      this.payment.referenceNumber = new Date().getTime().toString();
      this.payment.deliveryChargeAmount = 0;
      this.payment.date = this.datePipe.transform( new Date().getTime(), "yyyy-MM-dd" );
      // Logger.log("this.payment "+ JSON.stringify(this.payment));
      this.token.saveBookingData(this.booking);
      this.token.savePaymentData(this.payment);

      this.payment.callbackUrl = environment.callbackUrl;

      this.processPaymentPayTM(this.payment);
      // this.processPaymentPayTM(this.payment);

      this.cardPaymentAvailable = true;

  }
  processPaymentPayTM(payment: Payment) {
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage !== null) {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = "Error!";
            this.bodyMessage =
              "Unable to process payment" +
              " Code: " +
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
          this.headerTitle = "Error!";
          this.bodyMessage = "Payment Failed! Code: " + response.status;
          this.showDanger(this.contentDialog);
          this.changeDetectorRefs.detectChanges();
        }
      },
      (error) => {
        this.paymentLoader = false;
        this.isSuccess = false;
        this.headerTitle = "Error!";
        this.bodyMessage = "Payment Failed! Code: " + error.status;
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      }
    );
  }
  showSuccess(content) {
    this.alertType = "success";
    this.showAlert = true;
  }
  showWarning(content) {
    this.alertType = "warning";
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.changeDetectorRefs.detectChanges();
    }, 3000);
  }
  showDanger(content) {
    this.alertType = "danger";
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.changeDetectorRefs.detectChanges();
    }, 3000);
  }
  async paymentIntentPayTm(payment: Payment) {
    try {
      this.paymentLoader = true;

      const response = await this.hotelBookingService.paymentIntent(payment).toPromise();

      if (response.status === 200) {
        this.payment = response.body;
        this.token.saveBookingData(this.booking);
        this.token.savePaymentData(this.payment);
        this.token.savePropertyData(this.propertyDetials);

        this.router.navigate(["/checkout"]);
      }
    } catch (error) {
      // Handle errors here
    } finally {
      this.paymentLoader = false;

  }

  }






  async getbookingsbybookingId() {

    try {
      const data = await this.listing.findPropertiesBybookingId(this.bookingId).toPromise();

      this.bookings = data.body;

      if (this.bookings !== null && this.bookings !== undefined && this.bookings.length !== 0) {
        this.verificationSuccess2 = true;


          this.fromdate =  this.bookings.fromDate;
          const date = new Date(this.fromdate);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;
          //console.log(formattedDate);
          this.bookings.fromDate = formattedDate;

          if ( this.bookings.toDate !== null &&  this.bookings.toDate !== undefined) {
            this.Todate =  this.bookings.toDate;
            const date1 = new Date(this.Todate);
            const day1 = date1.getDate();
            const month1 = date1.toLocaleString('default', { month: 'long' });
            const year1 = date1.getFullYear();
            const formattedDate1 = `${day1} ${month1} ${year1}`;
            this.bookings.toDate = formattedDate1;
          }

      }

      if (this.bookings === null || this.bookings.status === 'ENQUIRY') {
        this.nodatafound = true;
      } else {
        this.nodatafound = false;
        // Handle the case when bookings are found
      }

      //console.log("Bookings: " + JSON.stringify(this.bookings));
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  }



  async getbookingsbyemail() {
    try {
      const data = await this.listing.findPropertiesByemail(this.email).toPromise();

      this.bookings = data.body;


      if (this.bookings !== null && this.bookings !== undefined && this.bookings.length > 0) {
        this.verificationSuccess = true;

        this.bookings.forEach(async (element) => {
          this.fromdate = element.fromDate;
          const date = new Date(this.fromdate);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;
          //console.log(formattedDate);
          element.fromDate = formattedDate;

          if (element.toDate !== null && element.toDate !== undefined) {
            this.Todate = element.toDate;
            const date1 = new Date(this.Todate);
            const day1 = date1.getDate();
            const month1 = date1.toLocaleString('default', { month: 'long' });
            const year1 = date1.getFullYear();
            const formattedDate1 = `${day1} ${month1} ${year1}`;
            element.toDate = formattedDate1;
          }
        });
      }

      if (this.bookings.length === 0) {
        this.nodatafound = true;
      } else {
        this.nodatafound = false;
        // Handle the case when bookings are found
      }

      //console.log("Bookings: " + JSON.stringify(this.bookings));
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  }



  async getbookingsbymobileNumber() {
    try {
      const data = await this.listing.findPropertiesByMobilenumber( this.phoneNumber).toPromise();

      this.bookings = data.body;

      if (this.bookings !== null && this.bookings !== undefined && this.bookings.length > 0) {
        this.verificationSuccess = true;

        this.bookings.forEach(async (element) => {
          this.createdDate = element.createdDate;
          const date = new Date(this.createdDate);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;
          //console.log(formattedDate);
          element.createdDate = formattedDate;

          if (element.toDate !== null && element.toDate !== undefined) {
            this.Todate = element.toDate;
            const date1 = new Date(this.Todate);
            const day1 = date1.getDate();
            const month1 = date1.toLocaleString('default', { month: 'long' });
            const year1 = date1.getFullYear();
            const formattedDate1 = `${day1} ${month1} ${year1}`;
            element.toDate = formattedDate1;
          }
        });
      }

      if (this.bookings.length === 0) {
        this.nodatafound = true;
      } else {
        this.nodatafound = false;
        // Handle the case when bookings are found
      }

      //console.log("Bookings: " + JSON.stringify(this.bookings));
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  }



  async getbookingsbyenquiryemail() {
    this.currentPage = 1;
    try {
      this.verificationSuccessenquiry = true;
      this.bookingstatus = 'ENQUIRY';

      // Assuming this.listing.findPropertiesByemailenquiry returns a Promise
      const data = await this.listing.findPropertiesByemailenquirylms(this.email).toPromise();

      this.bookings = data.body;
      this.bookings.reverse();
      //console.log('dataaaaaa is', this.bookingEnquiry);
      this.bookings = this.bookings.filter(ele => ele.status != 'Void')
      this.pageNumber = (this.bookings.length), (_, i) => `Item  ${i + 1}`;
      this.totalPagess = this.bookings.length;
      //console.log('pageNumber is',this.pageNumber);
      //console.log('total page is',this.totalPagess);
      this.updatePaginatedData();

      for (const element of this.bookings) {
        this.createdDate = element.createdDate;

        const date = new Date(this.createdDate);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;

        //console.log(formattedDate);
        element.createdDate = formattedDate;

        if (element.toDate !== null && element.toDate !== undefined) {
          this.Todate = element.toDate;
          const date1 = new Date(this.Todate);
          const day1 = date1.getDate();
          const month1 = date1.toLocaleString('default', { month: 'long' });
          const year1 = date1.getFullYear();
          const formattedDate1 = `${day1} ${month1} ${year1}`;
          element.toDate = formattedDate1;
        }
      }

      this.verificationSuccess = true;
      if (this.bookings.length === 0) {
        this.nodatafound = true;
      } else {
        this.nodatafound = false;
        // Handle the case when bookings are found
      }

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error as needed.
    }
  }



  enquiryvalidatePhoneNumber() {
    this.enquiryisPhoneNumberValid = /^\d{10}$/.test(this.enquiryphoneNumber);
  }


  enquirysendOTP() {
    if (this.enquiryisPhoneNumberValid) {
      this.enquiryshowOTPInput = true;
      this.enquirybuttonremove = false;
    }
  }

  enquiryvalidateOTPNumber() {
    this.isOTPNumberValid = /^\d{10}$/.test(this.OTPNumber);
    this. enquiryverifyOTP();
  }

  enquiryverifyOTP() {
    this.enquiryshowOTPInput = false;
    this.verificationSuccessenquiry = true;
    this.selectedTabdefaultenquiry = false;

  }

  // checkCustomer() {
  //   this.loader = true;
  //   if (this.isPhoneNumberValid) {
  //     this.showOTPInput = true;
  //     this.buttonremove = false;
  //   }

  //   if (this.verifyOption == "sms") {
  //     this.message.toNumber = this.phoneNumber;
  //     // this.message.email = null;
  //   }

  //   this.sendBtn = "Resend";
  //   this.hotelBookingService
  //     .authorisationToken(this.message)
  //     .subscribe((response) => {
  //       this.loader = false;
  //       Logger.log("authorisationToken data", JSON.stringify(response));
  //       const data: any = response;
  //       this.message.verificationStatus = data.verificationStatus;
  //       this.message.sid = data.sid;
  //       this.message.notificationStatus = data.notificationStatus;
  //     }),
  //     (error) => {
  //       this.loader = false;
  //     };
  //   // Logger.log('authorisationToken data', JSON.stringify(this.message));
  //   this.lookup = true;
  //   this.loader = false;
  //   this.verificationSend = true;
  // }
  checkCustomer() {

    this.loader = true;

    // //console.log('Sending request with phoneNumber:', this.phoneNumber);

    // if (this.isPhoneNumberValid) {
    //       this.showOTPInput = true;
    //       this.buttonremove = false;
    //     }
    // //console.log('message is ' + this.message.toNumber)
    // //console.log('message is ' + this.message.phoneNumber)

    if (this.isPhoneNumberValid) {
          this.showOTPInput = true;
          this.buttonremove = false;
        }

    //console.log('Sending request with phoneNumber:', this.phoneNumber);
      this.message.toNumber = this.phoneNumber;
      // this.message.email = null;


    this.sendBtn = "Resend";
    this.hotelBookingService
    .authorisationToken(this.message)
    .subscribe(
      (response) => {
        this.loader = false;
        //console.log('Response from server:', response);
        // Logger.log("authorisationToken data", JSON.stringify(response));
        const data: any = response;
        this.message.verificationStatus = data.verificationStatus;
        this.message.sid = data.sid;
        this.message.notificationStatus = data.notificationStatus;
      }),
      (error) => {
        this.loader = false;
        console.error('Error from server:', error);
      };
    // Logger.log('authorisationToken data', JSON.stringify(this.message));
    this.lookup = true;
    this.loader = false;
    this.verificationSend = true;
  }
  onVerified() {
    this.isVerified = true;

  }

  varificationSend() {
    this.loader = true;
    if (this.isPhoneNumberValid) {
      // this.showOTPInput = true;
      // this.buttonremove = false;
    }
if (this.verifyOption == "sms") {
      this.message.toNumber = this.phoneNumber;
      this.message.email = null;
    }else if (this.verifyOption == "email") {
      this.message.email = this.email;
      this.message.toNumber = null;
    }
    //console.log("verification code is "+this.verificationCode)
    this.message.verificationCode = this.verificationCode;
    this.hotelBookingService.verifyAuthorisationToken(this.message).subscribe(
      (response) => {
        this.loader = false;

        const data: any = response;
        this.message.verificationStatus = data.verificationStatus;
        this.message.notificationStatus = data.notificationStatus;
        if (data.verificationStatus === "approved") {
          this.verifiedPending = false;
          this.verified = true;
          this.verifySuccessMessage = true;
          this.tab1();
          this.tab3();
          setTimeout(function () {
            this.verifySuccessMessage = false;
          }, 5000);
        } else if (data.verificationStatus === "pending") {
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
      }
    );
  }

  sendConfirmationMessage() {
    this.paymentLoader = true;
    let msg = new Msg();
    msg.fromNumber = SMS_NUMBER;
    msg.toNumber = this.booking.mobile;
    msg.message = `Dear ${this.booking.firstName},Rsvn#:${this.booking.id},${this.booking.roomName},Chk-In:${this.booking.fromDate},Chk-Out:${this.booking.toDate},Amt:${this.booking.payableAmount}NZD.Thx.${this.booking.businessName},${this.booking.mobile}`;
    // this.hotelBookingService.sendTextMessage(msg).subscribe(
    //   (response1) => {
    //     msg = response1.body;
    //     if (msg.sid !== undefined || msg.sid !== null) {
    //       this.paymentLoader = false;
    //       // this.submitButtonDisable = true;
    //       this.isSuccess = true;
    //       this.headerTitle = "Success!";
    //       this.bodyMessage = "Booking Confirmation Sent.";
    //       this.showSuccess(this.contentDialog);
    //       setTimeout(() => {
    //         this.showAlert = false;
    //         this.changeDetectorRefs.detectChanges();
    //       }, 10000);
    //       this.changeDetectorRefs.detectChanges();
    //     }
    //   },
    // (error) => {
    //   if (error instanceof HttpErrorResponse) {
    //     this.paymentLoader = false;
    //     this.isSuccess = false;
    //     this.headerTitle = "Error!";
    //     this.bodyMessage = "Error in sending sms.";
    //     this.showDanger(this.contentDialog);
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // }
    // );
  }

}
