import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CheckoutService } from "paytm-blink-checkout-angular";
// import { CheckoutService } from "paytm-blink-checkout-angular";
import { Subscription } from "rxjs";
import { Booking } from "src/app/model/booking";
import { Payment } from "src/app/model/payment";
import { BusinessUser } from "src/app/model/user";
import { HotelBookingService } from "src/services/hotel-booking.service";
import { TokenStorage } from "src/token.storage";
import { Location} from "@angular/common";


@Component({
  selector: "app-checkout",
  templateUrl: "./checkout-payment.component.html",
  styleUrls: ["./checkout-payment.component.css"],
})
export class CheckoutPaymentComponent implements OnInit {
  businessUser: BusinessUser;
  payment: Payment;
  booking: Booking;
  private subs: Subscription;
  paymentLoader: boolean;
  headerTitle: string;
  isSuccess: boolean;
  bodyMessage: string;
  bookingConfirmed: boolean;
  showAlert: boolean;
  alertType: string;
  PropertyUrl: string;
  contentDialog: any;
  DiffDate;
  currency: string;
  loadersnipper: boolean = true;
  headertitl1one: string;
  headertitlePayment: string;
  bodyMessagePayment: string;

  constructor(
    private readonly checkoutService: CheckoutService,
    private token: TokenStorage,
    private locationBack:Location,
    private hotelBookingService: HotelBookingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router
  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();
    this.PropertyUrl = this.token.getPropertyUrl();
    this.booking = this.token.getBookingData();
    this.businessUser = this.token.getPropertyData();
    this.payment = this.token.getPaymentData();

    this.currency = this.businessUser.localCurrency;
  }

  ngOnInit(): void {
    setTimeout(() => {
     this.loadersnipper=false
    }, 3000);
    if (this.payment.failureMessage !== null) {
    } else {
      this.checkoutService.init(
        //config
        {
          data: {
            orderId: this.payment.referenceNumber,
            amount: this.payment.transactionAmount,
            token: this.payment.token,
            tokenType: "TXN_TOKEN",
          },
          merchant: {
            mid: "sVBwUY63148880604192",
            name: this.businessUser.name,
            logo: this.businessUser.logoUrl,
            redirect: true,
          },

          flow: "DEFAULT",
          handler: {
            notifyMerchant: this.notifyMerchantHandler,
          },

        },
        // {
        //   env: "PROD",
        //   openInPopup: true
        // },
      );

      this.subs = this.checkoutService.checkoutJsInstance$.subscribe(
        (instance) => console.log("kj"+instance)
      );
    }
  }
  notifyMerchantHandler = (eventType, data): void => {
    // console.log("MERCHANT NOTIFY LOG1", eventType, data);
    if (eventType === "APP_CLOSED") {
      // Handle the popup close event
      this.paymentLoader = false; // Stop the loader
      this.isSuccess = false; // Mark the payment as unsuccessful
      this.headertitlePayment = "Payment Incomplete!";
      this.bodyMessagePayment = "The payment popup was closed before completing the transaction.";
      this.showDanger(this.contentDialog); // Show an error alert
      this.changeDetectorRefs.detectChanges(); // Trigger UI update
    } else if (data.body !== undefined) {
      this.payment.failureCode = data?.body?.resultInfo?.resultCode;
      this.payment.failureMessage = data?.body?.resultInfo?.resultMsg;
    }
  };
  closewindow(){
   this.locationBack.back();
   setTimeout(() => {
    window.location.reload();
  }, 100);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();

      this.hotelBookingService.savePayment(this.payment).subscribe((res) => {
        if (res.status === 200) {
          this.paymentLoader = false;
          this.headerTitle = "Success!";
          this.bodyMessage =
            "Thanks for the booking .Please note the Reservation No: # " +
            this.booking.propertyReservationNumber +
            " and an email is sent with the booking details.";
          this.bookingConfirmed = true;

          // this.token.clearHotelBooking();
          this.showSuccess(this.contentDialog);
          if (
            this.booking.mobile !== null &&
            this.booking.mobile !== undefined
          ) {
            setTimeout(() => {
              // this.backClicked();
              // this.router.navigate(['/']);
              // this.sendConfirmationMessage();
              this.changeDetectorRefs.detectChanges();
            }, 1000);
            // this.sendConfirmationMessage();
          }
          setTimeout(() => {
            this.isSuccess = true;
            this.headerTitle = "Success!";
            this.bodyMessage = "Payment Details Saved.";
            this.showSuccess(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          }, 5000);
        } else {
          this.paymentLoader = false;
          setTimeout(() => {
            // this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = "Error!";
            this.bodyMessage = "Error in updating payment details.";
            this.showDanger(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          }, 9000);
        }
      });
      setTimeout(() => {
        this.showAlert = false;
        this.changeDetectorRefs.detectChanges();
      }, 9000);
      setTimeout(() => {
        // this.backClicked();
        // this.router.navigate(['/']);
        this.changeDetectorRefs.detectChanges();
      }, 10000);
      this.paymentLoader = false;
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
