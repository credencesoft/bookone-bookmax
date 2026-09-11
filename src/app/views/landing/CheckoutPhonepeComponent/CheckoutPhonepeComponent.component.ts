import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from 'paytm-blink-checkout-angular';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/model/booking';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-CheckoutPhonepeComponent',
  templateUrl: './CheckoutPhonepeComponent.component.html',
  styleUrls: ['./CheckoutPhonepeComponent.component.css']
})
export class CheckoutPhonepeComponentComponent implements OnInit {

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
  contentDialog: any;
  DiffDate;
  currency: string;


  constructor(
    private readonly checkoutService: CheckoutService,
    private token: TokenStorage,
    private hotelBookingService: HotelBookingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private http: HttpClientModule,
    private router: Router
  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();

    this.booking = this.token.getBookingData();
    this.businessUser = this.token.getPropertyData();
    this.payment = this.token.getPaymentData();

    this.currency = this.businessUser.localCurrency;



      // let endata = `EE5FB4E50B7DA70AFD6B0929CEAD07C65776E8DC49C7BED234AAE1ECC13FD1AC5AAFEA55A0A59359F06030E492CDB662231C08B24B272E58AEBA38704BA15612D836A4B2D41F533B77219BBDC2F7E39F217C8C0F93D89C5622B1C3C549F8925927C9BD1E81BE5AD03FEAA241B81ECFB2BD6C54388F6129B7A8C7AB5C7F586B911050E6F8898D86D36F9E4FFF5530E97100BDE67FAF4A2D7B15C3556967C91555BEC2F0A8C00F801A99156EDDB112557696E31DB08C91E0F4ABAE388C60C005A3BE86C47FC18814DB839EC2EF49365292391CF6C680B7F41AECA83431E2BE4D4AAF93C77CED09FC5451F05FE51A54B29ACB0E57EB98E6903A351E27F7A34E40C26A557782AA8531027C2B3A690021171E0DC4F113DFF7D30B60C79419D8C507AFCB23217FFA1DC6013DB401B5B40BF4821E411D9BC863DC3DCEACB4F8C9C7D3788433B7D682E1EDC8582DF411703D345DFD1A0C6E808D0AAA55A4C9A49B87C78AF73E71CB9C77D53206540F21AF44AB97437F7E1B8DF4E51A3F8B61C0F5FE5BF2DF67846E2BF83FCFB18515015CA85C1C3E66360BEF2E416844462199D522C21B`;
      // let requestUrl = "https://paynetzuat.atomtech.in/paynetz/epi/fts?login=192&encdata=" + endata;
      let requestUrl = this.payment.phonePeUrl;
      // let requestUrl = "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=" + this.payment.encryptedData +"&access_code=AVRV84KG69AH15VRHA";

        // window.open(requestUrl, '_blank', 'location=yes,height=650,width=870,scrollbars=yes,status=yes').onclose(console.log(window.));
        // window.open(requestUrl, '_blank', 'location=yes,height=650,width=870,scrollbars=yes,status=yes');
        window.open(requestUrl);



  }

  ngOnInit(): void {}
  notifyMerchantHandler = (eventType, data): void => {
    console.log('MERCHANT NOTIFY LOG', eventType, data);
    this.payment.failureCode = data.body.resultInfo.resultCode;
    this.payment.failureMessage = data.body.resultInfo.resultMsg;
  };
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();

      this.hotelBookingService.savePayment(this.payment).subscribe((res) => {
        if (res.status === 200) {
          this.paymentLoader = false;
          this.headerTitle = 'Success!';
          this.bodyMessage =
            'Thanks for the booking .Please note the Reservation No: # ' +
            this.booking.propertyReservationNumber +
            ' and an email is sent with the booking details.';
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
            this.headerTitle = 'Success!';
            this.bodyMessage = 'Payment Details Saved.';
            this.showSuccess(this.contentDialog);
            this.changeDetectorRefs.detectChanges();
          }, 5000);
        } else {
          this.paymentLoader = false;
          setTimeout(() => {
            // this.paymentLoader = false;
            this.isSuccess = false;
            this.headerTitle = 'Error!';
            this.bodyMessage = 'Error in updating payment details.';
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
  onGoHome() {
    this.router.navigate(['/']);
    // this.locationBack.back();
  }
}
