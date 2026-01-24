import { HttpClient } from '@angular/common/http';
// import { TokenStorage } from './../../token.storage';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Booking } from 'src/app/model/booking';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';
// import { Logger } from 'src/app/services/logger.service';
// import { HotelBookingService } from 'src/app/services/hotel-booking.service';/
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Location, DatePipe, formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/services/logger.service';
// import { EnquiryForm } from '../Enquiry/Enquiry.component';
import { API_URL_NZ, API_URL_IN } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquiryForm } from '../onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { TokenStorage } from 'src/token.storage';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { EnquiryDto } from 'src/app/model/enquiry';
import { RoomDetail } from 'src/app/model/RoomDetail';
import { externalReservationDtoList } from 'src/app/model/externalReservation';
import { ListingService } from 'src/services/listing.service';
import { BusinessServiceDtoList } from 'src/app/model/businessServiceDtoList';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';
import { WhatsappDto } from 'src/app/model/whatsappDto';
import { Template } from 'src/app/model/template';
import { Language } from 'src/app/model/language';
import { Components } from 'src/app/model/components';
import { Para } from 'src/app/model/parameters';
import { Images } from 'src/app/model/image';
import { SharedModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-booking-complete',
  templateUrl: './booking-complete.component.html',
  styleUrls: ['./booking-complete.component.scss'],
  standalone:true,
  imports:[SharedModule]
})
export class BookingCompleteComponent implements OnInit {
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
  externalReservationDtoList:externalReservationDtoList[];
  showAlert: boolean = false;
  alertType: string;
  bookingConfirmed = false;
  fromDate: any;
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
  enquiryResponse: EnquiryForm;
  successMessage: boolean;
  reservationRoomDetails:RoomDetail[];
  propertyServices:PropertyServiceDTO[];
  API_URL: string;
  enquirySent: boolean = false;
  submitButtonDisable: boolean;
  savedServices: any[] = [];
  businessServiceDtoList: any[] = [];
  getDetailsData: any;
  dueAmount: number;
  businessServiceDto: BusinessServiceDtoList;
  bookingRoomPrice: any;
  socialmedialist:any;
  taxAmountOne: number;
  bookinddata: Booking;
  percentage1: number;
  percentage2: number;
  totalPercentage: number;
  whatsappForm:WhatsappDto;
  template :Template;
  language:Language;
  componentstype:Components;
  parametertype:Para;
  images:Images;
  parameterss:Para[];
  parameterss1:Para[];
  components:Components[];
  componentstype2:Components;
  componentstype9:Components;
  componentstype10:Components;
  parametertype2:Para;
  parametertype20:Para;
  parametertype8:Para;
  parametertype3:Para;
  parameterss2:Para[];
  parameterss3:Para[];
  parameterss5:Para[];
  parameterss15:Para[];
  bookingId: number;
  referenceNumber: number;


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
  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();
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
    this.externalReservationDtoList =[]
    this.components = [];
    this.parameterss =[];
    this.parameterss1 = [];
    this.PropertyUrl = this.token.getPropertyUrl();

    if (this.token.getPropertyData() != null && this.token.getPropertyData() != undefined)
    {
      this.businessUser = this.token.getPropertyData();

    }


      setTimeout(() => {
        this.businessUser?.socialMediaLinks.forEach(element => {
          this.socialmedialist=element
        });
                  }, 1000);

    if (this.token.getBookingData() != null && this.token.getBookingData() != undefined)
    {
      this.booking = this.token.getBookingData();
      this.bookinddata =  this.booking
      // console.log("this.booking" + JSON.stringify(this.booking))
      this.taxAmountOne = this.booking.taxAmount
      this.dueAmount = this.booking.totalAmount - this.booking.advanceAmount;
    }

    if (this.token.getPaymentData() != null && this.token.getPaymentData() != undefined)
    {
      this.payment = this.token.getPaymentData();
    }

    if (this.token.getPayment2Data() != null && this.token.getPayment2Data() != undefined)
    {
      this.payment2 = this.token.getPayment2Data();
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
  }
  ngAfterViewInit() {
    if (this.token.getBookingData() != null && this.token.getBookingData() != undefined)
      {
        setTimeout(() => {
          this.booking = this.token.getBookingData();
          this.dueAmount = this.booking.totalAmount - this.booking.advanceAmount;
                    }, 500);

      }
  }
  getPaymentInfoByReffId(referenceNumber){
    this.hotelBookingService.getPaymentByReffId(referenceNumber).subscribe((res) => {
      this.payment = res.body[0];
      if (this.payment?.failureCode === null && this.payment.status == 'Paid') {
        setTimeout(() => {
        this.createBookingPayTM();
      }, 100);
      }else{
        // //Logger.log('create enquiry')
        this.createEnquiry();
      }
    });

    if (this.token.saveBookingRoomPrice(this.booking.roomPrice) !== null) {
      this.bookingRoomPrice = this.token.getBookingRoomPrice();


    }
  }




  mileSecondToNGBDate(date: string) {
    const dsd = new Date(date);
    const year = dsd.getFullYear();
    const day = dsd.getDate();
    const month = dsd.getMonth() + 1;
    return { year: year, month: month, day: day };
  }
  addServiceToBooking(booking) {
    if (this.addServiceList.length > 0) {
      this.hotelBookingService
        .addServicesToBooking(this.addServiceList, booking.id)
        .subscribe((serviceRes) => {
          // //Logger.log('before Payment: ', JSON.stringify(this.payment));

          // //Logger.log('addServiceList ', JSON.stringify(serviceRes.body));
          this.payment2 = this.payment;
          this.payment2.id = undefined;
          this.payment2.paymentMode = 'UPI';
          this.payment2.status = 'NotPaid';
          this.payment2.propertyId = this.bookingData.propertyId;
          this.payment2.email = this.booking.email;
          this.payment2.businessEmail = this.businessUser.email;
          this.payment2.currency = this.businessUser.localCurrency;
          this.payment2.transactionAmount = Number((this.totalExtraAmount ).toFixed(2));
          this.payment2.netReceivableAmount = Number((this.totalBeforeTaxAmount ).toFixed(2));
          this.payment2.transactionAmount = Number((this.totalExtraAmount ).toFixed(2));
          this.payment2.amount = Number((this.totalExtraAmount ).toFixed(2));
          this.payment2.transactionChargeAmount = Number((this.totalExtraAmount ).toFixed(2));
          this.payment2.deliveryChargeAmount = 0;
          this.payment2.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          this.payment2.taxAmount = this.totalTaxAmount ;
          this.payment2.businessServiceName = 'Restaurants';
          this.hotelBookingService
            .processPayment(this.payment2)
            .subscribe((res) => {
              // //Logger.log('Extra Payment: ', JSON.stringify(res.body));
            });
        });
    }
  }
  createBookingPayTM() {

    this.booking.modeOfPayment = this.payment.paymentMode;
    this.booking.externalSite = 'The Hotel Mate';
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

    this.booking.taxDetails = this.token.getProperty().taxDetails.filter(item=>item.name === 'CGST' || item.name === 'SGST');
    this.booking.taxDetails.forEach(item=>{
      if(item.name === 'CGST'){
        this.percentage1 = item.percentage;
      }

      if(item.name === 'SGST'){
        this.percentage2 = item.percentage;
      }
    })
    this.totalPercentage = (this.percentage1 + this.percentage2);

    this.booking.taxAmount = (this.bookingRoomPrice * this.totalPercentage) / 100;
    this.booking.roomPrice = Number(this.token.getRoomPrice());

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
          this.referenceNumber = Number(response.body.propertyReservationNumber);
          this.bookingId = response.body.id;
          this.booking.fromDate = this.bookingData.fromDate;
          this.booking.toDate = this.bookingData.toDate;

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
          this.addServiceToBooking(this.booking);
          this.externalReservation(this.booking);
          this.bookingConfirmed = true;
          this.paymentLoader = true;
          this.changeDetectorRefs.detectChanges();
          this.payment.status = 'Paid';
          //Logger.log('payment ' + JSON.stringify(this.payment));

          this.hotelBookingService
            .savePayment(this.payment)
            .subscribe((res) => {
              if (res.status === 200) {
                // this.openSuccessSnackBar(`Payment Details Saved`);
                this.paymentLoader = false;

                if (this.booking.payableAmount != this.payment.transactionAmount) {
                  this.payment.id = undefined;
                  this.payment.paymentMode = "Cash";
                  this.payment.status = "NotPaid";
                  this.booking.taxAmount =
                    (this.booking.netAmount * this.booking.taxPercentage) / 100;
                  this.payment.taxAmount = (this.booking.taxAmount / 100) * 80;
                  this.payment.netReceivableAmount = (this.booking.netAmount /100) * 80;
                  this.payment.transactionAmount = (this.booking.totalAmount / 100) * 80 ;
                  this.payment.referenceNumber = this.booking.propertyReservationNumber;
                  this.payment.amount = (this.booking.totalAmount / 100) * 80;
                  this.booking.advanceAmount = (this.booking.totalAmount / 100) * 20;
                  this.payment.propertyId = this.bookingData.propertyId;
                  this.payment.transactionChargeAmount =
(this.booking.totalAmount / 100)* 80;
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
    this.sendWhatsappMessageToTHM();
    this.sendWhatsappMessageToTHM1();
    this.sendWhatsappMessageToTHM2();
    this.sendWhatsappMessageToTHM3();
    // this.showSuccess(this.contentDialog);

    this.paymentLoader = true;

    Logger.log("payment " + JSON.stringify(this.payment));
    // this.paymentIntentPayTm(this.payment);
  } else {
    this.paymentLoader = false;
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
      setTimeout(() => {
        this.accommodationEnquiryBookingData();
    }, 3000);
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

  async getPropertyDetailsById(id: number) {

    try {

      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;

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


  externalReservation(booking){
    this.reservationRoomDetails =[];
    let roomdetailss = new RoomDetail();

let externalreservation = new externalReservationDtoList();
externalreservation.checkinDate = this.booking.fromDate;
externalreservation.checkoutDate = this.booking.toDate;
externalreservation.currency = this.booking.currency;
externalreservation.email = this.booking.email;
externalreservation.totalAmount = this.booking.totalAmount;
externalreservation.amountBeforeTax = this.booking.beforeTaxAmount;
externalreservation.channelId = "24";
externalreservation.lastModifiedBy ='hotelmate';
externalreservation.modeOfPayment = "Cash";
externalreservation.externalTransactionId = "THM-"+this.booking.id;
externalreservation.otaReservationId = "THM-"+this.booking.id;
externalreservation.propertyId = this.booking.propertyId.toString();
externalreservation.propertyName = this.booking.businessName;
externalreservation.firstName = this.booking.firstName
externalreservation.lastName = this.booking.lastName;
externalreservation.bookoneReservationId = this.booking.propertyReservationNumber;
externalreservation.contactNumber = this.booking.mobile;
externalreservation.propertyBusinessEmail = this.booking.businessEmail;
externalreservation.paidAmount = this.booking.advanceAmount;
// externalreservation.externalTransactionId = this.booking.paymentId.toString();
externalreservation.createdBy = 'hotelmate';
roomdetailss.checkinDate = this.booking.fromDate;
roomdetailss.checkoutDate = this.booking.toDate;
roomdetailss.noOfRooms = this.booking.noOfRooms;
roomdetailss.noOfadult = this.booking.noOfPersons;
roomdetailss.noOfchild = this.booking.noOfChildren;
roomdetailss.plan = this.booking.roomRatePlanName;
roomdetailss.roomRate = this.booking.roomTariffBeforeDiscount + this.booking.extraChildCharge + this.booking.extraPersonCharge;
roomdetailss.roomTypeId = this.booking.roomId.toString();
roomdetailss.roomTypeName = this.booking.roomName;
this.reservationRoomDetails.push(roomdetailss);
externalreservation.roomDetails = this.reservationRoomDetails;

this.propertyServices = this.savedServices;
this.propertyServices?.forEach(ele => {
  ele.count = ele.quantity;
  ele.id = null;
  ele.date = new Date().toISOString().split('T')[0];
  ele.logoUrl = null;
  ele.imageUrl = null;
  ele.description = null;
ele.organisationId = null;
});
externalreservation.services = this.propertyServices;
externalreservation.taxAmount = this.booking.taxAmount;
// externalreservation.lastModifiedDate = new Date().toString();
externalreservation.noOfPerson = this.booking.noOfPersons.toString();
externalreservation.resType ='';
externalreservation.otaName = 'Thehotelmate.com'
externalreservation.bookingStatus ='Confirmed';
externalreservation.payloadType ='json';
this.externalReservationDtoList.push(externalreservation)
    this.hotelBookingService
    .externalReservation(this.externalReservationDtoList)
    .subscribe((res) => {
     if (res.status === 200) {
this.externalReservationdto =res.body
     }
    });
  }
  accommodationEnquiryBookingData(){

    this.enquiryForm = new EnquiryDto();

    if (this.token.getProperty().address != null && this.token.getProperty().address != undefined &&
      this.token.getProperty().address.city != null && this.token.getProperty().address.city != undefined)
    {
      this.enquiryForm.address = this.token.getProperty().address;
      this.enquiryForm.country = this.token.getProperty().address.country;
      this.enquiryForm.location = this.token.getProperty().address.city;
      this.enquiryForm.alternativeLocation = this.token.getProperty().address.city;
    }
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.enquiryForm.min = this.booking.totalAmount;
    this.enquiryForm.max = this.booking.totalAmount;
    this.enquiryForm.totalAmount = this.booking.totalAmount;
    this.enquiryForm.advanceAmount = this.booking.advanceAmount;

    this.enquiryForm.firstName = this.booking.firstName;
    this.enquiryForm.lastName = this.booking.lastName;
    this.enquiryForm.email = this.booking.email;
    this.enquiryForm.phone = this.booking.mobile;
    this.enquiryForm.checkOutDate = this.booking.toDate;
    this.enquiryForm.checkInDate = this.booking.fromDate;
    this.enquiryForm.noOfPerson = this.booking.noOfPersons;
    this.enquiryForm.noOfExtraPerson=this.booking.noOfExtraPerson;
    this.enquiryForm.roomId=this.booking.roomId;
    this.enquiryForm.payableAmount=this.booking.netAmount;
    this.enquiryForm.roomName=this.booking.roomName;
    this.enquiryForm.extraPersonCharge=this.booking.extraPersonCharge;
    this.enquiryForm.extraChildCharge = this.booking.extraChildCharge;
    this.enquiryForm.noOfExtraChild=this.booking.noOfExtraChild;
    this.enquiryForm.externalSite="Website";
    this.enquiryForm.source = "Bookone Connect"
    this.enquiryForm.beforeTaxAmount=this.booking.beforeTaxAmount;
    this.enquiryForm.mobile=this.booking.mobile;
    this.enquiryForm.roomType=this.booking.roomType;
    this.enquiryForm.roomRatePlanName=this.booking.roomRatePlanName;
    this.enquiryForm.roomPrice = this.booking.roomTariffBeforeDiscount;
    this.enquiryForm.createdDate = new Date();
    this.enquiryForm.fromTime = Number(this.token.getFromTime());
    this.enquiryForm.toTime = Number(this.token.getToTime());

    this.enquiryForm.accountManager ='TheHotelMate Team';
    this.enquiryForm.consultantPerson ='';
    this.enquiryForm.noOfRooms = this.booking.noOfRooms;
    this.enquiryForm.noOfChildren = this.booking.noOfChildren;
    this.enquiryForm.accommodationType = this.token.getProperty().businessType;
    this.enquiryForm.status = "Booked";
    this.enquiryForm.specialNotes = this.booking.notes
    this.enquiryForm.propertyId = 107;
    this.enquiryForm.currency = this.token.getProperty().localCurrency;
    this.enquiryForm.taxDetails = this.token.getProperty().taxDetails;
    this.enquiryForm.planCode = this.booking.planCode;
    this.enquiryForm.bookingReservationId = this.booking.propertyReservationNumber;
    this.enquiryForm.bookingId = this.booking.id;
    this.enquiryForm.advanceAmount = this.booking.advanceAmount;
    this.enquiryForm.taxAmount = (this.booking.netAmount * this.booking.taxPercentage) / 100

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
    this.paymentLoader = true;
    this.enquiryForm.enquiryId = sessionStorage.getItem('enquiryNo');
    this.hotelBookingService.accommodationEnquiry(this.enquiryForm).subscribe((response) => {
      this.enquiryForm = response.body;
      this.paymentLoader = false;
      this.paymentLoader = false;
      this.isSuccess = true;
      this.submitButtonDisable = true;
      this.bookingConfirmed = true;
    })
  }

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
    this.booking.paymentId = this.payment.id;

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
      this.enquiryForm.paymentStatus = this.payment.status;
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

  sendWhatsappMessageToTHM(){
    this.whatsappForm.messaging_product = 'whatsapp';
    this.whatsappForm.recipient_type ='individual';
    this.template.name = "";
    this.template.name = "uat_bookone_booking_confirm";
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
    this.parametertype2.text = String(this.bookingId);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = this.booking.fromDate;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = " ";
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = this.booking.toDate;
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = " ";
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
    this.parametertype2.text = this.booking.totalAmount.toString();
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = String(this.booking.advanceAmount);
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = "reservation@thehotelmate.co";
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = " ";
    this.parameterss2.push(this.parametertype2);


    this.componentstype2.parameters =this.parameterss2;
    this.components.push(this.componentstype2);

    this.componentstype9.index = '0';
    this.componentstype9.sub_type = "url";
    this.componentstype9.type = "button";

    this.parametertype20 = new Para();
    this.parametertype20.type = 'text',
    this.parametertype20.text = "https://uat.bookone.io/booking-confirmation-page?ReferenceNumber" + this.referenceNumber;
    this.parameterss15.push(this.parametertype20);
    this.componentstype9.parameters = this.parameterss15;
    this.components.push(this.componentstype9);


    this.template.components = this.components;
    this.whatsappForm.template =this.template;
    this.whatsappForm.to = "9337930186",
    this.whatsappForm.type = 'template',
      this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
        this.paymentLoader = false;

      }, error => {
        this.paymentLoader = false;
      });
    }

    sendWhatsappMessageToTHM1(){
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
      this.template.name = "uat_bookone_booking_confirm";
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
      this.parametertype2.text = String(this.bookingId);
      this.parameterss2.push(this.parametertype2);

      this.parametertype2 = new Para();
      this.parametertype2.type = 'text',
      this.parametertype2.text = this.booking.fromDate;
      this.parameterss2.push(this.parametertype2);

      this.parametertype2 = new Para();
      this.parametertype2.type = 'text',
      this.parametertype2.text = " ";
      this.parameterss2.push(this.parametertype2);

      this.parametertype2 = new Para();
      this.parametertype2.type = 'text',
      this.parametertype2.text = this.booking.toDate;
      this.parameterss2.push(this.parametertype2);

      this.parametertype2 = new Para();
      this.parametertype2.type = 'text',
      this.parametertype2.text = " ";
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
      this.parametertype2.text = this.booking.totalAmount.toString();
      this.parameterss2.push(this.parametertype2);

      this.parametertype2 = new Para();
      this.parametertype2.type = 'text',

      this.parametertype2.text = (this.booking.advanceAmount.toString());
      this.parameterss2.push(this.parametertype2);

      this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = "reservation@thehotelmate.co";
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = " ";
    this.parameterss2.push(this.parametertype2);


      this.componentstype2.parameters =this.parameterss2;
      this.components.push(this.componentstype2);

      this.componentstype9.index = '0';
      this.componentstype9.sub_type = "url";
      this.componentstype9.type = "button";

      this.parametertype20 = new Para();
      this.parametertype20.type = 'text',
      this.parametertype20.text = "https://uat.bookone.io/booking-confirmation-page?ReferenceNumber"+ this.referenceNumber;
      this.parameterss15.push(this.parametertype20);
      this.componentstype9.parameters = this.parameterss15;
      this.components.push(this.componentstype9);


      this.template.components = this.components;
      this.whatsappForm.template =this.template;
      this.whatsappForm.to = "6372198255",
      this.whatsappForm.type = 'template',
        this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
          this.paymentLoader = false;

        }, error => {
          this.paymentLoader = false;
        });
      }

      sendWhatsappMessageToTHM2(){
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
        this.template.name = "uat_bookone_booking_confirm";
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
        this.parametertype2.text = String(this.bookingId);
        this.parameterss2.push(this.parametertype2);

        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text = this.booking.fromDate;
        this.parameterss2.push(this.parametertype2);

        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text = " ";
        this.parameterss2.push(this.parametertype2);

        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text = this.booking.toDate;
        this.parameterss2.push(this.parametertype2);

        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text = " ";
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
        this.parametertype2.text = this.booking.totalAmount.toString();
        this.parameterss2.push(this.parametertype2);

        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',

        this.parametertype2.text = (this.booking.advanceAmount.toString());
        this.parameterss2.push(this.parametertype2);

        this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = "reservation@thehotelmate.co";
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = " ";
    this.parameterss2.push(this.parametertype2);


        this.componentstype2.parameters =this.parameterss2;
        this.components.push(this.componentstype2);

        this.componentstype9.index = '0';
        this.componentstype9.sub_type = "url";
        this.componentstype9.type = "button";

        this.parametertype20 = new Para();
        this.parametertype20.type = 'text',
        this.parametertype20.text = "https://uat.bookone.io/booking-confirmation-page?ReferenceNumber"+ this.referenceNumber;
        this.parameterss15.push(this.parametertype20);
        this.componentstype9.parameters = this.parameterss15;
        this.components.push(this.componentstype9);


        this.template.components = this.components;
        this.whatsappForm.template =this.template;
        this.whatsappForm.to = "9777141738",
        this.whatsappForm.type = 'template',
          this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
            this.paymentLoader = false;

          }, error => {
            this.paymentLoader = false;
          });
        }

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
          this.template.name = "uat_bookone_booking_confirm";
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
          this.parametertype2.text = String(this.bookingId);
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.booking.fromDate;
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = " ";
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = this.booking.toDate;
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',
          this.parametertype2.text = " ";
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
          this.parametertype2.text = this.booking.totalAmount.toString();
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
          this.parametertype2.type = 'text',

          this.parametertype2.text = (this.booking.advanceAmount.toString());
          this.parameterss2.push(this.parametertype2);

          this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = "reservation@thehotelmate.co";
    this.parameterss2.push(this.parametertype2);

    this.parametertype2 = new Para();
    this.parametertype2.type = 'text',
    this.parametertype2.text = " ";
    this.parameterss2.push(this.parametertype2);


          this.componentstype2.parameters =this.parameterss2;
          this.components.push(this.componentstype2);

          this.componentstype9.index = '0';
          this.componentstype9.sub_type = "url";
          this.componentstype9.type = "button";

          this.parametertype20 = new Para();
          this.parametertype20.type = 'text',
          this.parametertype20.text = "https://uat.bookone.io/booking-confirmation-page?ReferenceNumber"+ this.referenceNumber;
          this.parameterss15.push(this.parametertype20);
          this.componentstype9.parameters = this.parameterss15;
          this.components.push(this.componentstype9);


          this.template.components = this.components;
          this.whatsappForm.template =this.template;
          this.whatsappForm.to = "7326079861",
          this.whatsappForm.type = 'template',
            this.hotelBookingService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
              this.paymentLoader = false;

            }, error => {
              this.paymentLoader = false;
            });
          }

}
