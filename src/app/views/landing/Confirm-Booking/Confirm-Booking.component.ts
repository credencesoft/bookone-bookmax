import { HttpClient } from '@angular/common/http';
// import { TokenStorage } from './../../token.storage';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Booking } from 'src/app/model/booking';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';
// import { Logger } from 'src/app/services/logger.service';
// import { HotelBookingService } from 'src/app/services/hotel-booking.service';/
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Location, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/services/logger.service';
// import { EnquiryForm } from '../Enquiry/Enquiry.component';
import { API_URL_NZ, API_URL_IN } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingCommand } from 'src/app/model/booking-command';
import { BookingPricing } from 'src/app/model/booking-pricing';
import { EnquiryForm } from '../onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { TokenStorage } from 'src/token.storage';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { EnquiryDto } from 'src/app/model/enquiry';
import { RoomDetail } from 'src/app/model/RoomDetail';
import { externalReservationDtoList } from 'src/app/model/externalReservation';
import { ListingService } from 'src/services/listing.service';
import { BusinessServiceDtoList } from 'src/app/model/businessServiceDtoList';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';

@Component({
  selector: 'app-Confirm-Booking',
  templateUrl: './Confirm-Booking.component.html',
  providers: [DatePipe],
  styleUrls: ['./Confirm-Booking.component.scss'],
})
export class ConfirmBookingComponent implements OnInit {
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
  externalReservationDtoList: externalReservationDtoList[];
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
  totalExtraAmount: number = 0;
  totalTaxAmount: number = 0;
  totalBeforeTaxAmount: number = 0;
  addServiceList: any[];
  enquiryForm: any;
  enquiryResponse: EnquiryForm;
  successMessage: boolean;
  reservationRoomDetails: RoomDetail[];
  propertyServices: PropertyServiceDTO[];
  API_URL: string;
  enquirySent: boolean = false;
  submitButtonDisable: boolean;
  savedServices: any[] = [];
  businessServiceDtoList: any[] = [];
  getDetailsData: any;
  dueAmount: number;
  businessServiceDto: BusinessServiceDtoList;
  bookingRoomPrice: any;
  socialmedialist: any;
  taxAmountOne: number;
  bookinddata: Booking;
  percentage1: number;
  percentage2: number;
  totalPercentage: number;
  extraChildCharge: any;

  constructor(
    private http: HttpClient,
    private token: TokenStorage,
    private acRoute: ActivatedRoute,
    private hotelBookingService: HotelBookingService,
    private ngZone: NgZone,
    private changeDetectorRefs: ChangeDetectorRef,
    private location: Location,
    private router: Router,
    private datePipe: DatePipe,
    private listingService: ListingService
  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();
    this.externalReservationDtoList = [];
    this.PropertyUrl = this.token.getPropertyUrl();

    if (
      this.token.getPropertyData() != null &&
      this.token.getPropertyData() != undefined
    ) {
      this.businessUser = this.token.getPropertyData();
    }

    setTimeout(() => {
      this.businessUser?.socialMediaLinks?.forEach((element) => {
        this.socialmedialist = element;
      });
    }, 1000);

    if (
      this.token?.getBookingDataObj() != null &&
      this.token?.getBookingDataObj() != undefined
    ) {
      this.booking = this.token.getBookingDataObj();
      this.bookinddata = this.booking;
      // console.log("this.booking" + JSON.stringify(this.booking))
      this.taxAmountOne = this.booking.taxAmount;
      this.dueAmount =
        this.booking.totalAmount +
        this.booking.totalServiceAmount -
        this.booking.advanceAmount;
    }

    if (
      this.token?.getPaymentData() != null &&
      this.token?.getPaymentData() != undefined
    ) {
      this.payment = this.token.getPaymentData();
    }

    this.addServiceList = [];
    if (this.token.getServiceData() !== null) {
      this.addServiceList = this.token.getServiceData();
    }
    if (this.token.getBookingDataObj() !== null) {
      this.bookingData = this.token.getBookingDataObj();
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

    this.businessServiceDtoList =
      this.token.getProperty()?.businessServiceDtoList;
    this.businessServiceDtoList?.forEach((element) => {
      if (element.name === 'Accommodation') {
        this.getDetailsData = element.advanceAmountPercentage;
      }
    });
    if (
      this.bookingData?.propertyId != null &&
      this.bookingData?.propertyId != undefined
    ) {
      this.getPropertyDetailsById(this.bookingData?.propertyId);
    }
  }

  ngOnInit() {
    this.acRoute.queryParams.subscribe((params) => {
      if (params['businessUser'] !== undefined) {
        this.businessUser = JSON.parse(params['businessUser']);
      }

      if (params['payment'] !== undefined) {
        this.payment = JSON.parse(params['payment']);
      }

      if (params['addServiceList'] !== undefined) {
        this.addServiceList = [];
        this.addServiceList = JSON.parse(params['addServiceList']);
      }

      if (params['booking'] !== undefined) {
        this.booking = JSON.parse(params['booking']);

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
    // this.getPaymentInfoByReffId(this.payment.referenceNumber);

    if (this.booking.id !== undefined) {
      this.bookingConfirmed = true;
    }
    this.currency = 'INR';
    this.extraChildCharge = this.token.getExtraChildCharge();
  }
  ngAfterViewInit() {
    if (
      this.token.getBookingDataObj() != null &&
      this.token.getBookingDataObj() != undefined
    ) {
      setTimeout(() => {
        this.booking = this.token.getBookingDataObj();
        this.dueAmount =
          this.booking.totalAmount +
          this.booking.totalServiceAmount -
          this.booking.advanceAmount;
      }, 500);
    }
  }
  getPaymentInfoByReffId(referenceNumber) {
    this.hotelBookingService
      .getPaymentByReffId(referenceNumber)
      .subscribe((res) => {
        this.payment = res.body[0];
        if (
          this.payment?.failureCode === null &&
          this.payment.status == 'Paid'
        ) {
          setTimeout(() => {
            this.createBookingPayTM();
          }, 100);
        } else {
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

  clearLegacyServicePaymentState() {
    this.token.clearLegacyPayment2Data();
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

    this.booking.taxDetails = this.token
      .getProperty()
      .taxDetails.filter(
        (item) => item.name === 'CGST' || item.name === 'SGST'
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

    this.booking.taxAmount =
      (this.bookingRoomPrice * this.totalPercentage) / 100;
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
    const bookingCommand = this.buildBookingCommand();
    this.hotelBookingService
      .createBookingCommand(bookingCommand)
      .subscribe((response) => {
        //  //Logger.log('createBooking ', JSON.stringify(response.body));
        if (response.status === 200) {
          this.paymentLoader = false;
          this.booking = response.body;
          this.booking.fromDate = this.bookingData.fromDate;
          this.booking.toDate = this.bookingData.toDate;
          this.clearLegacyServicePaymentState();

          this.payment.referenceNumber = this.booking.propertyReservationNumber;
          this.payment.externalReference = this.booking.externalBookingID;
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

                if (
                  this.booking.payableAmount != this.payment.transactionAmount
                ) {
                  this.payment.id = undefined;
                  this.payment.paymentMode = 'Cash';
                  this.payment.status = 'NotPaid';
                  this.booking.taxAmount =
                    (this.booking.netAmount * this.booking.taxPercentage) / 100;
                  this.payment.taxAmount = (this.booking.taxAmount / 100) * 80;
                  this.payment.netReceivableAmount =
                    (this.booking.netAmount / 100) * 80;
                  this.payment.transactionAmount =
                    (this.booking.totalAmount / 100) * 80;
                  this.payment.referenceNumber =
                    this.booking.propertyReservationNumber;
                  this.payment.amount = (this.booking.totalAmount / 100) * 80;
                  this.booking.advanceAmount =
                    (this.booking.totalAmount / 100) * 20;
                  this.payment.propertyId = this.bookingData.propertyId;
                  this.payment.transactionChargeAmount =
                    (this.booking.totalAmount / 100) * 80;
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

  private buildBookingCommand(): BookingCommand {
    const command = new BookingCommand();
    const pricing = new BookingPricing();

    pricing.roomPrice = this.booking.roomPrice;
    pricing.beforeTaxAmount = this.booking.beforeTaxAmount;
    pricing.taxAmount = this.booking.taxAmount;
    pricing.totalAmount = this.booking.totalAmount;
    pricing.payableAmount = this.booking.payableAmount;
    pricing.advanceAmount = this.booking.advanceAmount;
    pricing.discountAmount = this.booking.discountAmount;
    pricing.discountPercentage = this.booking.discountPercentage;
    pricing.totalServiceAmount = this.booking.totalServiceAmount;
    pricing.roomTariffBeforeDiscount = this.booking.roomTariffBeforeDiscount;
    pricing.totalRoomTariffBeforeDiscount = this.booking.totalRoomTariffBeforeDiscount;
    pricing.couponCode = this.booking.couponCode;
    pricing.promotionName = this.booking.promotionName;
    pricing.currency = this.booking.currency;

    command.booking = this.booking;
    command.pricing = pricing;
    command.selectedServices = (this.savedServices || []) as PropertyServiceDTO[];
    command.sourceChannel = this.booking?.externalSite || 'WebSite';
    command.pricingVerified = true;

    return command;
  }

  addSeviceTopBooking(bookingId, savedServices: any[]) {
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

  async getPropertyDetailsById(id: number) {
    try {
      const data = await this.listingService?.findByPropertyId(id).toPromise();
      if (data.status === 200) {
        this.businessUser = data.body;

        this.businessUser?.socialMediaLinks.forEach((element) => {
          this.socialmedialist = element;
        });

        this.token.saveProperty(this.businessUser);
        this.currency = this.businessUser.localCurrency.toUpperCase();

        this.businessServiceDto =
          this.businessUser?.businessServiceDtoList.find(
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
        this.router.navigate(['/404']);
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

  public externalReservation(booking: Booking): void {
    const currentBooking = booking || this.booking;
    if (!currentBooking) {
      return;
    }

    const bookingService = this.hotelBookingService;
    const externalReservationList = this.externalReservationDtoList || [];
    const propertyServices = ((this.savedServices || []) as PropertyServiceDTO[]).map((service) => ({
      ...service,
    }));
    this.externalReservationDtoList = externalReservationList;

    this.reservationRoomDetails = [];
    const roomdetailss = new RoomDetail();
    const externalreservation = new externalReservationDtoList();

    externalreservation.checkinDate = currentBooking.fromDate;
    externalreservation.checkoutDate = currentBooking.toDate;
    externalreservation.currency = currentBooking.currency;
    externalreservation.email = currentBooking.email;
    externalreservation.totalAmount =
      currentBooking.totalAmount + currentBooking.totalServiceAmount;
    externalreservation.amountBeforeTax = currentBooking.beforeTaxAmount;
    externalreservation.channelId = '24';
    externalreservation.lastModifiedBy = 'hotelmate';
    externalreservation.couponCode = currentBooking.couponCode;
    externalreservation.promotionName = currentBooking.promotionName;
    externalreservation.modeOfPayment = 'Cash';
    externalreservation.externalTransactionId = 'THM-' + currentBooking.id;
    externalreservation.otaReservationId = 'THM-' + currentBooking.id;
    externalreservation.propertyId = currentBooking.propertyId.toString();
    externalreservation.propertyName = currentBooking.businessName;
    externalreservation.firstName = currentBooking.firstName;
    externalreservation.lastName = currentBooking.lastName;
    externalreservation.bookoneReservationId = currentBooking.propertyReservationNumber;
    externalreservation.contactNumber = currentBooking.mobile;
    externalreservation.propertyBusinessEmail = currentBooking.businessEmail;
    externalreservation.paidAmount = currentBooking.advanceAmount;
    externalreservation.createdBy = 'hotelmate';

    roomdetailss.checkinDate = currentBooking.fromDate;
    roomdetailss.checkoutDate = currentBooking.toDate;
    roomdetailss.noOfRooms = currentBooking.noOfRooms;
    roomdetailss.noOfadult = currentBooking.noOfPersons;
    roomdetailss.noOfchild = currentBooking.noOfChildren;
    roomdetailss.plan = currentBooking.roomRatePlanName;
    roomdetailss.roomRate =
      currentBooking.roomTariffBeforeDiscount +
      currentBooking.extraChildCharge +
      currentBooking.extraPersonCharge;
    roomdetailss.roomTypeId = currentBooking.roomId.toString();
    roomdetailss.roomTypeName = currentBooking.roomName;
    this.reservationRoomDetails.push(roomdetailss);
    externalreservation.roomDetails = this.reservationRoomDetails;

    this.propertyServices = propertyServices;
    propertyServices.forEach((ele) => {
      ele.count = ele.quantity;
      ele.id = null;
      ele.date = new Date().toISOString().split('T')[0];
      ele.logoUrl = null;
      ele.imageUrl = null;
      ele.description = null;
      ele.organisationId = null;
    });

    externalreservation.services = propertyServices;
    externalreservation.taxAmount = currentBooking.taxAmount;
    externalreservation.noOfPerson = String(currentBooking.noOfPersons);
    externalreservation.resType = '';
    externalreservation.otaName = 'Thehotelmate.com';
    externalreservation.bookingStatus = 'Confirmed';
    externalreservation.payloadType = 'json';

    externalReservationList.push(externalreservation);
    bookingService
      .externalReservation(externalReservationList)
      .subscribe((res) => {
        if (res.status === 200) {
          this.externalReservationdto = res.body;
        }
      });
  }

  public addSeviceTopBookingPMS(bookingId: number, savedServices: any[]): void {
    this.hotelBookingService
      .saveBookingServicePMS(bookingId, savedServices)
      .subscribe(
        (data) => {
          this.changeDetectorRefs.detectChanges();
          // Logger.log(JSON.stringify( this.businessServices));
        },
        (error) => {}
      );
  }
  public accommodationEnquiryBookingData(): void {
    const booking = this.booking;
    const payment = this.payment;
    const property = this.token.getProperty();
    if (!booking || !payment || !property) {
      return;
    }

    const enquiryForm = new EnquiryDto();
    this.enquiryForm = enquiryForm;

    if (
      property.address != null &&
      property.address != undefined &&
      property.address.city != null &&
      property.address.city != undefined
    ) {
      enquiryForm.address = property.address;
      enquiryForm.country = property.address.country;
      enquiryForm.location = property.address.city;
      enquiryForm.alternativeLocation = property.address.city;
    }

    payment.netReceivableAmount = booking.netAmount;
    enquiryForm.min = booking.totalAmount;
    enquiryForm.max = booking.totalAmount;
    enquiryForm.totalAmount = booking.totalAmount;
    enquiryForm.couponCode = booking.couponCode;
    enquiryForm.promotionName = booking.promotionName;
    enquiryForm.advanceAmount = booking.advanceAmount;
    enquiryForm.firstName = booking.firstName;
    enquiryForm.lastName = booking.lastName;
    enquiryForm.email = booking.email;
    enquiryForm.phone = booking.mobile;
    enquiryForm.checkOutDate = booking.toDate;
    enquiryForm.checkInDate = booking.fromDate;
    enquiryForm.noOfPerson = booking.noOfPersons;
    enquiryForm.noOfExtraPerson = booking.noOfExtraPerson;
    enquiryForm.roomId = booking.roomId;
    enquiryForm.payableAmount = booking.netAmount;
    enquiryForm.roomName = booking.roomName;
    enquiryForm.extraPersonCharge = booking.extraPersonCharge;
    enquiryForm.extraChildCharge = booking.extraChildCharge;
    enquiryForm.noOfExtraChild = booking.noOfExtraChild;
    enquiryForm.externalSite = 'Website';
    enquiryForm.source = 'Bookone Connect';
    enquiryForm.beforeTaxAmount = booking.beforeTaxAmount;
    enquiryForm.mobile = booking.mobile;
    enquiryForm.roomType = booking.roomType;
    enquiryForm.roomRatePlanName = booking.roomRatePlanName;
    enquiryForm.roomPrice = booking.roomTariffBeforeDiscount;
    enquiryForm.createdDate = new Date();
    enquiryForm.fromTime = Number(this.token.getFromTime());
    enquiryForm.toTime = Number(this.token.getToTime());
    enquiryForm.accountManager = 'TheHotelMate Team';
    enquiryForm.consultantPerson = '';
    enquiryForm.noOfRooms = booking.noOfRooms;
    enquiryForm.noOfChildren = booking.noOfChildren;
    enquiryForm.accommodationType = property.businessType;
    enquiryForm.status = 'Booked';
    enquiryForm.specialNotes = booking.notes;
    enquiryForm.propertyId = 107;
    enquiryForm.currency = property.localCurrency;
    enquiryForm.taxDetails = property.taxDetails;
    enquiryForm.planCode = booking.planCode;
    enquiryForm.bookingReservationId = booking.propertyReservationNumber;
    enquiryForm.bookingId = booking.id;
    enquiryForm.advanceAmount = booking.advanceAmount;
    enquiryForm.taxAmount = (booking.netAmount * booking.taxPercentage) / 100;
    enquiryForm.bookingPropertyId = property.id;
    enquiryForm.propertyName = property.name;

    const TO_EMAIL = 'reservation@thehotelmate.co';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'samaya.muduli@credencesoft.co.nz';
    const bccEmail2 = 'info@bookonepms.com';
    const bccName = 'Samaya';

    enquiryForm.fromName = enquiryForm.firstName + ' ' + enquiryForm.lastName;
    enquiryForm.toName = TO_NAME;
    enquiryForm.fromEmail = enquiryForm.email;
    enquiryForm.toEmail = TO_EMAIL;
    enquiryForm.bccEmail = bccEmail;
    enquiryForm.bccName = bccEmail;
    enquiryForm.bccEmailTo = bccEmail2;

    if (
      enquiryForm.dietaryRequirement === null ||
      enquiryForm.dietaryRequirement === undefined
    ) {
      enquiryForm.dietaryRequirement = '';
    }
    if (
      enquiryForm.accommodationType === null ||
      enquiryForm.accommodationType === undefined
    ) {
      enquiryForm.accommodationType = '';
    }
    if (
      enquiryForm.specialNotes === null ||
      enquiryForm.specialNotes === undefined
    ) {
      enquiryForm.specialNotes = '';
    }
    if (
      enquiryForm.alternativeLocation === null ||
      enquiryForm.alternativeLocation === undefined
    ) {
      enquiryForm.alternativeLocation = '';
    }
    enquiryForm.foodOptions = '';
    enquiryForm.organisationId = environment.parentOrganisationId;
    this.paymentLoader = true;
    enquiryForm.enquiryId = Number(sessionStorage.getItem('enquiryNo'));
    this.hotelBookingService
      .accommodationEnquiry(enquiryForm)
      .subscribe((response) => {
        this.enquiryForm = response.body;
        this.paymentLoader = false;
        this.isSuccess = true;
        this.submitButtonDisable = true;
        this.bookingConfirmed = true;
      });
  }

  public createEnquiry(): void {
    const booking = this.booking;
    const payment = this.payment;
    const businessUser = this.businessUser;
    if (!booking || !payment || !businessUser) {
      return;
    }

    booking.modeOfPayment = payment.paymentMode;
    booking.externalSite = 'The Hotel Mate';
    booking.businessName = businessUser.name;
    booking.businessEmail = businessUser.email;
    booking.roomBooking = true;
    booking.bookingAmount = booking.totalAmount;
    booking.groupBooking = false;
    booking.available = true;
    booking.payableAmount = booking.totalAmount;
    booking.currency = businessUser.localCurrency;
    booking.paymentId = payment.id;

    this.paymentLoader = true;

    const TO_EMAIL = 'subhasmitatripathy37@gmail.com';
    const TO_NAME = 'Support - The Hotel Mate';
    const bccEmail = 'rajeshbiswal591@gmail.com';

    const enquiryForm: any = new EnquiryForm();
    this.enquiryForm = enquiryForm;

    enquiryForm.businessEmail = businessUser.email;
    enquiryForm.businessName = businessUser.name;
    enquiryForm.roomBooking = booking.roomBooking;
    enquiryForm.groupBooking = booking.groupBooking;
    enquiryForm.roomId = booking.roomId;
    enquiryForm.roomPrice = booking.roomPrice;
    enquiryForm.roomName = booking.roomName;
    enquiryForm.firstName = booking.firstName;
    enquiryForm.lastName = booking.lastName;
    enquiryForm.fromDate = booking.fromDate;
    enquiryForm.toDate = booking.toDate;
    enquiryForm.checkInDate = booking.fromDate;
    enquiryForm.checkOutDate = booking.toDate;
    enquiryForm.email = booking.email;
    enquiryForm.hsnCode = booking.hsnCode;
    enquiryForm.phone = booking.mobile;
    enquiryForm.mobile = booking.mobile;
    enquiryForm.noOfRooms = booking.noOfRooms;
    enquiryForm.noOfPerson = booking.noOfPersons;
    enquiryForm.noOfChildren = booking.noOfChildren;
    enquiryForm.noOfPets = booking.noOfPets;
    enquiryForm.externalSite = booking.externalSite;
    enquiryForm.location = '';
    enquiryForm.min = 0;
    enquiryForm.max = 0;
    enquiryForm.roomRatePlanName = booking.roomRatePlanName;
    enquiryForm.noOfExtraPerson = booking.noOfExtraPerson;
    enquiryForm.extraPersonCharge = booking.extraPersonCharge;
    enquiryForm.noOfExtraChild = booking.noOfExtraChild;
    enquiryForm.extraChildCharge = booking.extraChildCharge;
    enquiryForm.roomTariffBeforeDiscount = booking.roomTariffBeforeDiscount;
    enquiryForm.totalBookingAmount = booking.totalBookingAmount;
    enquiryForm.paymentStatus = payment.status;
    enquiryForm.totalRoomTariffBeforeDiscount = booking.totalRoomTariffBeforeDiscount;
    enquiryForm.discountAmount = booking.discountAmount;
    enquiryForm.taxAmount = (booking.netAmount * booking.taxPercentage) / 100;
    enquiryForm.taxDetails = booking.taxDetails;
    enquiryForm.payableAmount = booking.payableAmount;
    enquiryForm.totalAmount = booking.totalAmount;
    enquiryForm.beforeTaxAmount = booking.beforeTaxAmount;
    enquiryForm.propertyId = booking.propertyId;
    enquiryForm.currency = booking.currency;
    enquiryForm.available = booking.available;
    enquiryForm.modeOfPayment = booking.modeOfPayment;
    enquiryForm.includeService = booking.includeService;
    enquiryForm.customerId = booking.customerId;
    enquiryForm.planCode = booking.planCode;
    enquiryForm.organisationId = businessUser.organisationId;
    enquiryForm.counterNumber = '1';
    enquiryForm.operatorName = '';

    this.enquirySent = true;

    enquiryForm.fromName = enquiryForm.firstName + ' ' + enquiryForm.lastName;
    enquiryForm.toName = TO_NAME;
    enquiryForm.fromEmail = enquiryForm.email;
    enquiryForm.toEmail = TO_EMAIL;
    enquiryForm.bccEmail = bccEmail;
    enquiryForm.bccName = bccEmail;
    enquiryForm.accommodationType = businessUser.businessSubtype || '';
    enquiryForm.status = 'Enquiry';

    if (enquiryForm.dietaryRequirement === null || enquiryForm.dietaryRequirement === undefined) {
      enquiryForm.dietaryRequirement = '';
    }
    if (enquiryForm.accommodationType === null || enquiryForm.accommodationType === undefined) {
      enquiryForm.accommodationType = '';
    }
    if (enquiryForm.specialNotes === null || enquiryForm.specialNotes === undefined) {
      enquiryForm.specialNotes = '';
    }
    if (enquiryForm.alternativeLocation === null || enquiryForm.alternativeLocation === undefined) {
      enquiryForm.alternativeLocation = '';
    }

    enquiryForm.foodOptions = '';
    enquiryForm.subject = '';
    this.setApi();

    this.http
      .post<EnquiryForm>(this.API_URL + '/api/website/enquire', enquiryForm)
      .subscribe((response) => {
        this.enquiryResponse = response;
        this.successMessage = true;
      });

    this.http
      .post<EnquiryForm>(environment.apiUrlBookone + '/api/email/enquire', enquiryForm)
      .subscribe(() => {
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

  onGoHome() {
    this.router.navigate(['/booking']);
  }

  goback() {
    this.token.clearBookingDataObj();
  }
}
