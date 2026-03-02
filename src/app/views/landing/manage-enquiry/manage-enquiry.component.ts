import { finalize } from 'rxjs/operators';
import { Component, Input, NgModule,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { MessageDto } from 'src/app/model/MessageDto';
import { Booking } from 'src/app/model/booking';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { Logger } from 'src/services/logger.service';
import { TokenStorage } from 'src/token.storage';
import { Msg } from 'src/app/model/msg';
import { SMS_NUMBER } from 'src/app/app.component';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import { timestamp } from 'rxjs';
import { BusinessUser } from 'src/app/model/user';
import { HeaderListingdetailsoneComponent } from '../Header-Listingdetailsone/Header-Listingdetailsone.component';
// import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
@Component({
  selector: 'app-manage-enquiry',
  templateUrl: './manage-enquiry.component.html',
  styleUrls: ['./manage-enquiry.component.css']
})



// @NgModule({
//   declarations: [
    
//     HeaderListingdetailsoneComponent // Add the component here
//   ],
//   imports: [
    
//   ]
// })

export class ManageEnquiryComponent {


  @Input() businessUser: string;
  verifyOption = "sms";
  verificationCode: string ='';
  loader = false;

  message: MessageDto;
  selectedTab: string = 'booking';
  phoneNumber: string = '';
  OTPNumber: string = '';
  paymentLoader: boolean = false;

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
  verifySuccessMessage: boolean = false;
  isSuccess: boolean;
  verificationSend = false;
  sendBtn = "Send";
  lookup = false;
  bookingstatus: string;
  fromdate: any;
  Todate: any;
  createdDate: any;
  selectedOption: string = 'EmailRadio';
  selectedOptionenquiry: string = 'emailRadio1';
  email: string = '';
  mobile: string = '';
  bookingId: string = '';
  nodatafound: boolean = false;
  constructor(private token: TokenStorage,
    private listing:ListingService,
    private calendar: NgbCalendar,
    private hotelBookingService: HotelBookingService,
    private datePipe: DatePipe,
    private  route: ActivatedRoute,
    private router: Router,){
      this.message = new MessageDto();
  
      if(this.phoneNumber == undefined){
        this.phoneNumber = '';
      }
  }
  ngonInit(){
    this.businessUser = history.state.businessUser;
  this.tab3();
  
  }
  
  searchenquiry() {
    if (this.selectedOptionenquiry === 'email') {
  
      console.log(`Searching for email: ${this.email}`);
    } else if (this.selectedOptionenquiry === 'mobile') {
  
      console.log(`Searching for mobile number: ${this.mobile}`);
    }
    else if (this.selectedOptionenquiry === 'bookingId') {
  
      console.log(`Searching for Booking ID: ${this.bookingId}`);
    }
  }
  search() {
    this.resetBookings();
    if (this.selectedOption === 'email') {
  
      console.log(`Searching for email: ${this.email}`);
    } else if (this.selectedOption === 'mobile') {
  
      console.log(`Searching for mobile number: ${this.mobile}`);
    }
    else if (this.selectedOption === 'bookingId') {
  
      console.log(`Searching for Booking ID: ${this.bookingId}`);
    }
  }
  
  resetBookings() {
    this.bookings = null;
  if (this.bookings?.length === 0 || this.bookings === null ) {
    console.log(`Searching for Bookings: ${this.bookings}`);
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
      console.log('OTPNumber:', this.OTPNumber);
      this.isOTPNumberValid = /^\d{5}$/.test(this.OTPNumber);
      console.log('isOTPNumberValid:', this.isOTPNumberValid);
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
  
      try {
        this.bookingstatus = 'ENQUIRY';
  
  
        const data = await this.listing.findPropertiesByMobilenumberenquiry(this.phoneNumber, this.bookingstatus).toPromise();
  
        this.bookings = data.body;
        this.verificationSuccessenquiry = true;
  
        for (const element of this.bookings) {
          const fromDate = new Date(element.fromDate);
          const formattedFromDate = `${fromDate.getDate()} ${fromDate.toLocaleString('default', { month: 'long' })} ${fromDate.getFullYear()}`;
          element.fromDate = formattedFromDate;
  
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
        console.log("Formatted bookings:", this.bookings);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  
    async getbookingsbybookingIdenquiry() {
  
      try {
        const data = await this.listing.findPropertiesBybookingId(this.bookingId).toPromise();
  
        this.bookings = data.body;
  
        if (this.bookings !== null && this.bookings !== undefined && this.bookings.length !== 0) {
          this.verificationenquirySuccess2= true;
  
  
            this.fromdate =  this.bookings.fromDate;
            const date = new Date(this.fromdate);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;
            console.log(formattedDate);
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
  
        if (this.bookings === null || this.bookings.bookingStatus != "ENQUIRY") {
          this.nodatafound = true;
        } else {
          this.nodatafound = false;
          // Handle the case when bookings are found
        }
  
        console.log("Bookings: " + JSON.stringify(this.bookings));
      } catch (error) {
        // Handle errors here
        console.error(error);
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
            console.log(formattedDate);
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
  
        if (this.bookings === null || this.bookings.bookingStatus === 'ENQUIRY') {
          this.nodatafound = true;
        } else {
          this.nodatafound = false;
          // Handle the case when bookings are found
        }
  
        console.log("Bookings: " + JSON.stringify(this.bookings));
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
            console.log(formattedDate);
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
  
        console.log("Bookings: " + JSON.stringify(this.bookings));
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
            this.fromdate = element.fromDate;
            const date = new Date(this.fromdate);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;
            console.log(formattedDate);
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
  
        console.log("Bookings: " + JSON.stringify(this.bookings));
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }
  
  
  
    async getbookingsbyenquiryemail() {
      try {
        this.verificationSuccessenquiry = true;
        this.bookingstatus = 'ENQUIRY';
  
        // Assuming this.listing.findPropertiesByemailenquiry returns a Promise
        const data = await this.listing.findPropertiesByemailenquiry(this.email, this.bookingstatus).toPromise();
  
        this.bookings = data.body;
  
        for (const element of this.bookings) {
          this.fromdate = element.fromDate;
  
          const date = new Date(this.fromdate);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;
  
          console.log(formattedDate);
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
  
      // console.log('Sending request with phoneNumber:', this.phoneNumber);
  
      // if (this.isPhoneNumberValid) {
      //       this.showOTPInput = true;
      //       this.buttonremove = false;
      //     }
      // console.log('message is ' + this.message.toNumber)
      // console.log('message is ' + this.message.phoneNumber)
  
      if (this.isPhoneNumberValid) {
            this.showOTPInput = true;
            this.buttonremove = false;
          }
  
      console.log('Sending request with phoneNumber:', this.phoneNumber);
        this.message.toNumber = this.phoneNumber;
        // this.message.email = null;
  
  
      this.sendBtn = "Resend";
      this.hotelBookingService
      .authorisationToken(this.message)
      .subscribe(
        (response) => {
          this.loader = false;
          console.log('Response from server:', response);
          Logger.log("authorisationToken data", JSON.stringify(response));
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
      console.log("verification code is "+this.verificationCode)
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
  