import { HotelBookingService } from './../../../../services/hotel-booking.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccount } from 'src/app/model/BankAccount';
import { Booking } from 'src/app/model/booking';
import { BusinessServiceDtoList } from 'src/app/model/businessServiceDtoList';
import { MobileWallet } from 'src/app/model/mobileWallet';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';
// import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { Logger } from 'src/services/logger.service';
import { TokenStorage } from 'src/token.storage';
// import { HotelBookingService } from 'src/app/services/hotel-booking.service';
// import { ListingService } from 'src/app/services/listing.service';
// import { Logger } from 'src/app/services/logger.service';
// import { OrderService } from 'src/app/services/order.service';


declare var Stripe: any;

declare var window: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [DatePipe],
})
export class PaymentComponent implements OnInit {

  businessUser: BusinessUser;
  payment: Payment;
  booking: Booking;
  // room: Room;
  bookingNumber: number;
  bookingEmail: string;
  loader = false;

  businessServiceDto: BusinessServiceDtoList;
  taxPercentage = 0;
  subTotalAmount: number = 0;
  totalAmount: number = 0;
  timeDifferenceInDays: number;

  paymentLoader: boolean = false;

  bankAccount: BankAccount;
  mobileWallet: MobileWallet;

  private ewaySecureFieldCode: string;
  private ewayErrors: string = null;
  private ewayInitComplete: boolean = false;
  cardPaymentAvailable: boolean;
  taxDetails: any[] = [];
  currency:string;
  DiffDate;
  enddate;
  startDate;
  cashPayment: boolean;
  headerTitle: string;
  bodyMessage: string;
  isSuccess: boolean;
  contentDialog: any;
  alertType: string;
  showAlert: boolean;
  prvpaymentref: string;
  advPanyment: any;
  services: any;
  totalServiceCost: number =0;
  calculatedServices: any;
  noOfExtraChild: string;
  showContent: boolean = false;
  loadingOne: boolean = false;
  constructor(
    private acRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    private listingService: ListingService,
    private orderService: OrderService,
    public datepipe: DatePipe,
    private token:TokenStorage,
    private datePipe: DatePipe,
    private router: Router,
    private ngZone: NgZone,
    private bookingService :HotelBookingService,
    private hotelBookingService: HotelBookingService
  ) {
    this.businessServiceDto = new BusinessServiceDtoList();
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();
    this.acRoute.queryParams.subscribe((params) => {
      if (params["BookingReferenceNumber"] !== undefined) {
        this.bookingNumber = params["BookingReferenceNumber"];
      }
      if (params["Amount"] !== undefined) {
        this.advPanyment = params["Amount"];
      }
      if (params["BookingEmail"] !== undefined) {
        this.bookingEmail = params["BookingEmail"];
      }
      this.getBookingDetails(this.bookingNumber, this.bookingEmail);
    });
    }


  ngOnInit() {
    // window["angularComponentReference"] = {
    //   component: this,
    //   zone: this.ngZone,
    //   loadAngularFunction: () => this.stripePaymentSuccess(),
    // };
  }

  mileSecondToNGBDate(date: string) {
    const dsd = new Date(date);
    const year = dsd.getFullYear();
    const day = dsd.getDate();
    const month = dsd.getMonth() + 1;
    return { year: year, month: month, day: day };
  }
  getDiffDate(toDate, fromDate) {
    this.enddate = new Date(toDate.year, toDate.month - 1, toDate.day);
    this.startDate = new Date(fromDate.year, fromDate.month - 1, fromDate.day);

    if (this.startDate > this.enddate) {
      // console.warn(
      //   'Start Date is after End Date. Swapping dates.',
      //   { startDate: this.startDate, endDate: this.enddate }
      // );
      [this.startDate, this.enddate] = [this.enddate, this.startDate];
    }

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

    // console.log('Difference in Days:', this.DiffDate);
  }
  getAllServicesById(){
    this.calculatedServices =[]
    this.bookingService.getAllServicesByBooking(this.booking.id).subscribe(
      (response1) => {
        if (response1.status === 200) {
          this.services = response1.body;

          this.services?.forEach(element => {
            let serviceCost = element.afterTaxAmount * element.count;
            // console.log("total services" + element.quantity)
            // console.log("total services" + element.quantity)
            this.calculatedServices.push(serviceCost);
            this.totalServiceCost += serviceCost; // Accumulating the total cost
          });

          //  if (this.totalServiceCost > 0) {
          //   this.enquiry.totalAmount = this.enquiry.totalAmount + this.totalServiceCost
          //  }

        }
      })
  }


  getBookingDetails(bookingNumber: number, bookingEmail: string) {

    this.loader = true;
    this.hotelBookingService
      .getBookingDetails(bookingNumber, bookingEmail)
      .subscribe(
        (data) => {
          this.booking = data.body.bookingDetails;
          this.token.saveReservationID(this.booking.message);
          console.log(this.booking, "this.booking")
          this.getAllServicesById()
          this.getPropertyDetails(this.booking.propertyId);
          this.payment = data.body.paymentDetails[0];

          // this.room = data.body.roomDetails;

          // console.log(" this.payment =" + JSON.stringify(this.payment));
          // console.log(" this.booking =" + JSON.stringify(this.booking));
          //  Logger.log(' this.room ='+JSON.stringify( this.room));
          // this.payment.transactionChargeAmount = this.payment.transactionAmount;
          this.getDiffDate(
            this.mileSecondToNGBDate(this.booking.fromDate),
            this.mileSecondToNGBDate(this.booking.toDate)
          );


          this.loader = false;
          // this.changeDetectorRefs.detectChanges();
        },
        (_error) => {
          this.loader = false;
        }
      );
  }

  getPropertyDetails(id: number) {

// this.businessUser = new BusinessUser()
    this.loader = true;
    this.listingService.findByPropertyId(id).subscribe(
      (data) => {
        this.businessUser = data.body;
        if (this.businessUser != null && this.businessUser != undefined ) {
  this.showContent  = true
        }
        this.currency = this.businessUser.localCurrency.toUpperCase();
        // console.log(' this.businessUser ===='+JSON.stringify( this.businessUser));
        if (this.businessUser.taxDetails.length > 0) {
          this.taxPercentage = this.businessUser.taxDetails[0].percentage;
        }
        if (this.businessUser.taxDetails[0].taxSlabsList.length > 0) {
          this.businessUser.taxDetails[0].taxSlabsList.forEach((element) => {
            if (
              element.maxAmount >= this.booking.netAmount &&
              element.minAmount <= this.booking.netAmount
            ) {
              this.taxPercentage = element.percentage;
            } else if (element.maxAmount <= this.booking.netAmount) {
              this.taxPercentage = element.percentage;
            }
          });
        }

        this.booking.totalAmount =
          this.booking.netAmount +
          this.booking.netAmount * (this.taxPercentage / 100);

        this.businessServiceDto = this.businessUser.businessServiceDtoList.find(
          (data) => data.name === this.businessUser.businessType
        );

        this.loader = false;
      },
      (_error) => {
        this.loader = false;
      }
    );
  }
  cashOnDelivery() {
    this.cashPayment = true;
  }
  phonepay(){
    this.loadingOne = true;
    this.payment.callbackUrl = environment.callbackUrlPayment ;


      this.payment.paymentMode = "UPI";
      this.payment.status = "NotPaid";
      this.payment.businessServiceName = "Accommodation";
      this.payment.firstName = this.booking.firstName;
      this.payment.lastName = this.booking.lastName;
      this.payment.name = this.booking.firstName + " " + this.booking.lastName;

      this.payment.email = this.booking.email;
      this.payment.businessEmail = this.businessUser.email;
      this.payment.currency = this.businessUser.localCurrency;
      this.payment.propertyId = this.businessUser.id;
      this.booking.taxAmount = ((this.booking.netAmount * this.booking.taxPercentage) / 100);


        if(this.advPanyment > 0){
          this.payment.netReceivableAmount = this.advPanyment
          this.payment.transactionAmount = this.advPanyment;
          this.payment.amount =this.advPanyment;
          this.booking.advanceAmount = this.advPanyment;
          this.payment.transactionChargeAmount =this.advPanyment;
          this.payment.taxAmount = 0 ;
        }else{
          this.payment.netReceivableAmount = this.payment.transactionAmount;
          this.payment.transactionAmount = this.payment.transactionAmount;
          this.payment.amount =this.payment.transactionAmount;
          this.booking.advanceAmount = this.payment.transactionAmount;
          this.payment.transactionChargeAmount =this.payment.transactionAmount ;
          this.payment.taxAmount = this.payment.taxAmount ;
        }

        this.prvpaymentref = this.payment.referenceNumber;
        this.token.savePaymentRef(this.prvpaymentref )
      this.payment.referenceNumber =new Date().getTime().toString();  ;
      this.payment.deliveryChargeAmount = 0;
      this.payment.date = this.datePipe.transform( new Date().getTime(), "yyyy-MM-dd" );
      Logger.log("this.payment "+ JSON.stringify(this.payment));
      // this.businessUser.paymentGateway = "paytm"
      this.token.saveBookingData(this.booking);
      this.token.savePaymentData(this.payment);

      this.payment.callbackUrl = environment.callbackUrlPayment;

      this.processPaymentPayTM(this.payment);
      // this.paymentIntentPayTm(this.payment);
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
          this.loadingOne = false;
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
  paymentIntentPayTm(payment: Payment) {
    this.paymentLoader = true;

    this.hotelBookingService.paymentIntent(payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;

        this.token.saveBookingData(this.booking);
        this.token.savePaymentData(this.payment);
        this.token.savePropertyData(this.businessUser);

        this.router.navigate(["/checkout-payment"]);
        this.loadingOne = false;
      }
    });
  }
  cardPayment() {
    this.cashPayment = false;
    if (this.businessUser.paymentGateway == "stripe") {
      this.loadStripe();

      this.payment.paymentMode = "Card";
      this.payment.status = "Paid";
      this.payment.firstName = this.booking.firstName;
      this.payment.lastName = this.booking.lastName;
      // this.payment.netReceivableAmount = this.booking.netAmount;
      // this.payment.transactionAmount = this.booking.totalAmount;
      // this.payment.amount = this.booking.totalAmount;
      this.payment.propertyId = this.businessUser.id;
      this.payment.transactionChargeAmount = this.booking.totalAmount;
      this.payment.email = this.booking.email;
      this.payment.businessEmail = this.businessUser.email;
      this.payment.currency = this.businessUser.localCurrency;

      this.booking.taxAmount =
        (this.booking.netAmount * this.booking.taxPercentage) / 100;
      // this.payment.taxAmount = this.booking.taxAmount;
      this.payment.deliveryChargeAmount = 0;
      this.payment.date = this.datepipe.transform(
        new Date().getTime(),
        "yyyy-MM-dd"
      );

      this.paymentIntent(this.payment);
      this.cardPaymentAvailable = true;
    }
  }
  bankPayment() {
    this.cashPayment = false;
  }
  onCardPaymentSubmit() {
    // this.contentDialog = content;

    //  if (this.homeDelivery == true) {
    //     this.slotReservation.shipToAddress = this.address;
    //   }else {
    //     this.order.shipToAddress = this.businessUser.address;
    //   }

    // this.slotReservation.orderedTime = this.getOrderTimeformatAMPM(new Date);

    this.payment.paymentMode = "Card";
    this.payment.status = "Paid";
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.payment.transactionAmount = this.booking.totalAmount;
    this.payment.amount = this.booking.totalAmount;
    this.payment.propertyId = this.businessUser.id;
    this.payment.transactionChargeAmount = this.booking.totalAmount;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.currency = this.businessUser.localCurrency;

    this.booking.taxAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.payment.taxAmount = this.booking.taxAmount;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = this.datepipe.transform(
      new Date().getTime(),
      "yyyy-MM-dd"
    );

    this.chargeCreditCard(this.payment);
  }
  onWalletPaymentSubmit() {
    this.payment.paymentMode = "Wallet";
    this.payment.status = "Paid";
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

    this.booking.taxAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.payment.taxAmount = this.booking.taxAmount;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = this.datepipe.transform(
      new Date().getTime(),
      "yyyy-MM-dd"
    );

    this.processPayment(this.payment);
  }
  onBankPaymentSubmit() {
    this.payment.paymentMode = "BankTransfer";
    this.payment.status = "Paid";
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.payment.transactionAmount = this.booking.totalAmount;
    this.payment.amount = this.booking.totalAmount;
    this.payment.propertyId = this.businessUser.id;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.transactionChargeAmount = this.booking.totalAmount;
    this.payment.currency = this.businessUser.localCurrency;
    // Logger.log('Bank Transfer' + JSON.stringify(this.order));
    this.booking.taxAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.payment.taxAmount = this.booking.taxAmount;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = this.datepipe.transform(
      new Date().getTime(),
      "yyyy-MM-dd"
    );

    this.processPayment(this.payment);
  }
  onCashPaymentSubmit() {
    // if (this.homeDelivery == true) {
    //   this.order.shipToAddress = this.address;
    // } else {
    //   this.order.shipToAddress = this.businessUser.address;
    // }
    // this.contentDialog = content;

    // this.order.orderedTime = this.getOrderTimeformatAMPM(new Date);

    this.payment.paymentMode = "Cash";
    this.payment.status = "NotPaid";
    this.payment.firstName = this.booking.firstName;
    this.payment.lastName = this.booking.lastName;
    this.payment.netReceivableAmount = this.booking.netAmount;
    this.payment.transactionAmount = this.booking.totalAmount;
    this.payment.amount = this.booking.totalAmount;
    this.payment.propertyId = this.businessUser.id;
    this.payment.email = this.booking.email;
    this.payment.businessEmail = this.businessUser.email;
    this.payment.transactionChargeAmount = this.booking.totalAmount;
    this.payment.currency = this.businessUser.localCurrency;

    this.booking.taxAmount =
      (this.booking.netAmount * this.booking.taxPercentage) / 100;
    this.payment.taxAmount = this.booking.taxAmount;
    this.payment.deliveryChargeAmount = 0;
    this.payment.date = this.datepipe.transform(
      new Date().getTime(),
      "yyyy-MM-dd"
    );

    // Logger.log('payment', JSON.stringify(this.payment));
    this.processPayment(this.payment);
    // this.createBooking(this.booking);
  }
  processPayment(payment: Payment) {
    this.paymentLoader = true;
    this.changeDetectorRefs.detectChanges();

    this.hotelBookingService.processPayment(payment).subscribe(
      (response) => {
        if (response.status === 200) {
          if (response.body.failureMessage != null) {
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
            this.booking.paymentId = response.body.id;
            this.booking.modeOfPayment = this.payment.paymentMode;
            this.payment.date = this.datepipe.transform(
              new Date().getTime(),
              "yyyy-MM-dd"
            );
            this.hotelBookingService.savePayment(this.payment).subscribe(
              (res1) => {
                if (res1.status === 200) {
                  this.paymentLoader = false;
                  this.changeDetectorRefs.detectChanges();

                  // this.createBooking(this.booking);
                } else {
                  this.paymentLoader = false;
                  this.isSuccess = false;
                  this.headerTitle = "Error!";
                  this.bodyMessage =
                    "Unable to save payment" + " Code: " + status;
                  this.showDanger(this.contentDialog);

                  this.paymentLoader = false;
                  this.changeDetectorRefs.detectChanges();
                }
              },
              (error) => {
                this.paymentLoader = false;
                this.isSuccess = false;
                this.headerTitle = "Error!";
                this.bodyMessage =
                  "Saving Payment Failed! Code: " + error.status;
                this.showDanger(this.contentDialog);
                this.changeDetectorRefs.detectChanges();
              }
            );
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

  chargeCreditCard(payment: Payment) {
    this.paymentLoader = true;
    if (this.businessUser.paymentGateway == "eway") {
      const eWAY = (window as any).eWAY;

      const comp = this;

      eWAY.saveAllFields(() => {
        comp.paymentLoader = false;

        if (
          comp.ewaySecureFieldCode == null ||
          comp.ewaySecureFieldCode == undefined ||
          comp.ewaySecureFieldCode.trim().length < 5
        ) {
          comp.paymentLoader = false;
          comp.isSuccess = false;
          comp.headerTitle = "Error!";
          comp.bodyMessage = "Missing card information!";
          comp.showDanger(comp.contentDialog);
          comp.changeDetectorRefs.detectChanges();
        } else if (comp.ewayErrors != null && comp.ewayErrors != undefined) {
          comp.paymentLoader = false;
          comp.isSuccess = false;
          comp.headerTitle = "Error!";
          comp.bodyMessage =
            "Wrong card information!" + " Codes: " + comp.ewayErrors;
          comp.showDanger(comp.contentDialog);
          comp.changeDetectorRefs.detectChanges();
        } else {
          payment.token = comp.ewaySecureFieldCode;
          comp.processPayment(payment);
        }
      }, 2000);
    } else {
      (window as any).Stripe.card.createToken(
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
            this.headerTitle = "Error!";
            this.bodyMessage = "Wrong card information!" + " Code: " + status;
            this.showDanger(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          } else {
            this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = "Error!";
            this.bodyMessage = "Card Payment Faied!" + " Code: " + status;
            this.showDanger(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          }
        }
      ),
        (error) => {
          this.paymentLoader = false;
        };
    }
  }
  paymentIntent(payment: Payment) {
    this.paymentLoader = true;
    payment.date = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    this.orderService.paymentIntent(payment).subscribe((response) => {

      if (response.status === 200) {
        this.paymentLoader = false;
        this.payment = response.body;
        // console.log("payment Intent Response: " + response);
      } else{
        this.paymentLoader = false;
      }
    });
  }
  loadStripe() {
    // Your Stripe public key
    const stripe = Stripe(this.businessUser.paymentGatewayPublicKey);

    // Create `card` element that will watch for updates
    // and display error messages
    const elements = stripe.elements();
    const card = elements.create("card");
    card.mount("#card-element");
    card.addEventListener("change", (event) => {
      const displayError = document.getElementById("card-error");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Listen for form submission, process the form with Stripe,
    // and get the
    const paymentForm = document.getElementById("payment-form");
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      payWithCard(stripe, card, this.payment.clientSecret);
    });

    const payWithCard = function (stripe, card, clientSecret) {
      loading(true);
      stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
          },
        })
        .then(function (result) {
          if (result.error) {
            // Show error to your customer
            showError(result.error.message);
          } else {
            // The payment succeeded!
            loading(false);
            console.log(JSON.stringify(result));
            orderComplete();
          }
        });
    };

    const loading = function (isLoading) {
      if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
      } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
      }
    };
    const showError = function (errorMsgText) {
      loading(false);
      var errorMsg = document.querySelector("#card-error");
      errorMsg.textContent = errorMsgText;
      setTimeout(function () {
        errorMsg.textContent = "";
      }, 4000);
    };
    let orderComplete = function () {
      window.angularComponentReference.zone.run(() => {
        window.angularComponentReference.loadAngularFunction();
      });
    };
  }
  stripePaymentSuccess() {
    this.orderService.savePayment(this.payment).subscribe((response) => {
      this.paymentLoader = false;
      if (response.status === 200) {
        this.payment = response.body;
        // console.log("payment Intent Response: " + response);

        this.booking.paymentId = response.body.id;
        this.booking.modeOfPayment = this.payment.paymentMode;

        Logger.log("Card info done" + JSON.stringify(this.payment));
        this.changeDetectorRefs.detectChanges();
        this.headerTitle = "Success!";
        this.bodyMessage = "Payment Successfully Paid!";
        this.showSuccess(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
        this.businessUser.paymentGateway = null;
        // this.createBooking(this.booking);
      }
    });
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
  backClicked() {
    // this.locationBack.back();
    this.router.navigate(['/']);
    // window.location.reload();
  }
}
