// import { Component } from '@angular/core';
// import { Email } from './../ecosystem/ecosystem.component';
// import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
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
  loading: boolean;
  businessProfileName: string;
  businessProfilelogo: string;

  constructor(
    // private readonly checkoutService: CheckoutService,
    private zone: NgZone,
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
              if (this.businessUser.primaryColor !== undefined) {
            this.changeTheme(
              this.businessUser.primaryColor,
              this.businessUser.secondaryColor,
              this.businessUser.tertiaryColor
            );
          }
    this.payment = this.token.getPaymentData();

    this.currency = this.businessUser.localCurrency;
  }

  ngOnInit(): void {
   const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => this.initiatePayment();
  document.body.appendChild(script);

  }
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
initiatePayment() {
  if (this.payment.failureMessage !== null) return;
let keyId = 'rzp_live_RURdDEsmd8BUzY';
if (this.businessUser.paymentGatewayApiKey === keyId) {
  this.businessProfileName = 'THEHOTELMATE TECHNOLOGIES PRIVATE LIMITED';
  this.businessProfilelogo = 'https://thehotelmate.co/media-be/images/THM-logo-new.svg';
} else {
  this.businessProfileName = this.businessUser.name;
  this.businessProfilelogo = this.businessUser.logoUrl;
}
  const options = {
    key: this.businessUser.paymentGatewayApiKey,
    amount: Math.round(this.payment.amount * 100),
    currency: 'INR',
    name: this.businessProfileName,
    description: "Payment for online services",
    image: this.businessProfilelogo,
    order_id: this.payment.razorpayOrderId,
    handler: (response: any) => {
      if (response?.razorpay_payment_id) {
        // 👇 Make sure Angular knows about this async callback
        this.zone.run(() => {
          this.processResponse(response);
        });
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
        this.zone.run(() => {
          this.router.navigate(['/payment-failure']); // fallback page
        });
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
    this.loading = true;
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
        this.loading = false;
        this.router.navigate(['/payment-confirmation']);
      }, 1000);
    } else {
      this.paymentLoader = false;
      setTimeout(() => {
        this.isSuccess = false;
        this.loading = false;
        this.headerTitle = "Error!";
        this.bodyMessage = "Error in updating payment details.";
        this.showDanger(this.contentDialog);
        this.changeDetectorRefs.detectChanges();
      }, 9000);
    }
  } catch (error) {
    this.loading = false;
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
