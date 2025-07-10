// import { Component } from '@angular/core';
// import { Email } from './../ecosystem/ecosystem.component';
// import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from 'paytm-blink-checkout-angular';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/model/booking';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { TokenStorage } from 'src/token.storage';
// import  {Razorpay} from 'razorpay';
// import Razorpay from 'razorpay';
declare var Razorpay:any;
// declare var Razorpay:any;
@Component({
  selector: 'app-checkout-razorpay',
  templateUrl: './checkout-razorpay.component.html',
  styleUrls: ['./checkout-razorpay.component.scss']
})
export class CheckoutRazorpayComponent {

  businessUser: BusinessUser;
  payment: Payment;
  booking: Booking;

  private subs: Subscription
  paymentLoader: boolean;
  headerTitle: string;
  isSuccess: boolean;
  bodyMessage: string;
  bookingConfirmed: boolean;
  showAlert: boolean;
  alertType: string;
  contentDialog: any;
  DiffDate;
  currency: string;

  constructor(
    // private readonly checkoutService: CheckoutService,

    private token: TokenStorage,
    private hotelBookingService: HotelBookingService,

    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private http:HttpClient
  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();

     this.booking = this.token.getBookingData();
    this.businessUser = this.token.getPropertyData();
    this.payment = this.token.getPaymentData();

    this.currency = this.businessUser.localCurrency;
  }

  ngOnInit(): void {
   const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => this.initiatePayment();
  document.body.appendChild(script);
  }
initiatePayment() {
  if (this.payment.failureMessage !== null) return;

  const options = {
    key: 'rzp_live_zdw5fN3v2hSGdn',
    amount: Math.round(this.payment.amount * 100),
    currency: 'INR',
    name: this.businessUser.name,
    description: "Payment for online services",
    image: this.businessUser.logoUrl,
    order_id: this.payment.razorpayOrderId,
    handler: (response: any) => {
      if (response?.razorpay_payment_id) {
        this.subs = response;
        this.processResponse(response);
      }
    },
    prefill: {
      name: this.booking?.firstName,
      email: this.booking?.email,
      contact: this.booking?.mobile
    },
    notes: {
      address: "online"
    },
    theme: {
      color: '#61CE70'
    },
    modal: {
  ondismiss: () => {
    console.warn('Payment popup closed by user.');
    const redirectUrl = sessionStorage?.getItem('PropertyUrl');
    // Redirect to external URL if it's full path


    window.location.href = redirectUrl;
    }
}

  };

  const razorpayObject = new Razorpay(options);
  razorpayObject.open();

  razorpayObject.on('payment.failed', (response: any) => {
    console.error('Payment failed:', response);
    this.showDanger('Payment failed. Please try again.');
  });
}


  async processResponse(res: any) {
  try {
    console.log("response is " + JSON.stringify(res));
    this.payment.status = "Paid";

    const response = await this.hotelBookingService.savePayment(this.payment).toPromise();

    if (response.status === 200) {
      this.paymentLoader = false;
      this.headerTitle = "Success!";
      this.bodyMessage =
        "Thanks for the booking. Please note the Reservation No: # " +
        this.booking.propertyReservationNumber +
        " and an email is sent with the booking details.";
      this.bookingConfirmed = true;

      this.showSuccess(this.contentDialog);

      if (this.booking.mobile) {
        setTimeout(() => {
          this.changeDetectorRefs.detectChanges();
        }, 1000);
      }

      setTimeout(() => {
        this.isSuccess = true;
        this.headerTitle = "Success!";
        this.bodyMessage = "Payment Details Saved.";
        this.showSuccess(this.contentDialog);
        this.changeDetectorRefs.detectChanges();

        // ✅ Redirect after showing the success message
        this.router.navigate(['/booking-confirm']);
      }, 3000); // Delay redirect by 3 seconds
    } else {
      this.paymentLoader = false;
      setTimeout(() => {
        this.isSuccess = false;
        this.headerTitle = "Error!";
        this.bodyMessage = "Error in updating payment details.";
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      }, 9000);
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors here if needed
  }
}


  notifyMerchantHandler = (eventType, options) => {

    console.log("MERCHANT NOTIFY LOG", eventType, options);
    if (options.body !== undefined) {
      this.payment.failureCode = options?.body?.resultInfo?.resultCode;
      this.payment.failureMessage = options?.body?.resultInfo?.resultMsg;
    }
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
  onGoHome() {
    this.router.navigate(["/"]);
    // this.locationBack.back();
  }
}
