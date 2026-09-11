import { Component } from '@angular/core';
import { Payment } from 'src/app/model/payment';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss']
})
export class ConfirmPaymentComponent {
  payment:Payment;
  pvsBookingRefId: string;
  reservationId: string;
  booking: any;
  externals: any;
  paymentOne:Payment;

constructor( private hotelBookingService: HotelBookingService,
 private token:TokenStorage
)
{
  this.payment = this.token.getPaymentData();
  this.pvsBookingRefId = this.token.getPaymentRef();
  this.reservationId = this.token.getreservationId();
  console.log("this.reservationId", this.reservationId)
}
ngOnInit(){
  this.getPaymentInfoByReffId(this.payment.referenceNumber);
  this.getBookingbyRefID(this.reservationId);

}

getBookingbyRefID(reservationId){
  this.hotelBookingService.getPaymentByReffIdOne(reservationId).subscribe((res) => {
    this.booking = res.body;
    console.log("this.booking",this.booking)
    if(this.booking != null && this.booking != undefined) {
      this.booking?.forEach(ele => {
        this.externals = ele.propertyReservationNumber;
      }
    )
      this.getPaymentInfoByReffIdOne(this.externals);

    }
  });
}



getPaymentInfoByReffId(referenceNumber){
  this.hotelBookingService.getPaymentByReffId(referenceNumber).subscribe((res) => {
    this.payment = res.body[0];
  this.updatePayment();

    if (this.payment?.failureCode === null && this.payment.status == 'Paid') {
    //   setTimeout(() => {
    //   this.createBookingPayTM();
    // }, 100);
    }else{
      // //Logger.log('create enquiry')
      // this.createEnquiry();
    }
  });
}

getPaymentInfoByReffIdOne(referenceNumber){
  this.hotelBookingService.getPaymentByReffIdTwo(referenceNumber).subscribe((res) => {
    this.paymentOne = res.body[0];
    this.updatePaymentOne();
  });
}



updatePayment(){
  this.payment.referenceNumber = this.pvsBookingRefId.toString();
  this.hotelBookingService
            .savePayment(this.payment)
            .subscribe((res) => {
this.payment= res.body;
})







                // setTimeout(() => {
                //   this.isSuccess = true;
                //   this.headerTitle = "Success!";
                //   this.bodyMessage = "Payment Details Saved.";
                //   this.showSuccess(this.contentDialog);
                //   this.changeDetectorRefs.detectChanges();
                // }, 5000);

}

updatePaymentOne(){
  this.paymentOne.transactionAmount = this.payment.netReceivableAmount;
  this.paymentOne.paymentMode = "UPI";
  this.paymentOne.status = this.payment.status;
  this.hotelBookingService
            .savePaymentOne(this.paymentOne)
            .subscribe((res) => {
            this.paymentOne = res.body;
})







                // setTimeout(() => {
                //   this.isSuccess = true;
                //   this.headerTitle = "Success!";
                //   this.bodyMessage = "Payment Details Saved.";
                //   this.showSuccess(this.contentDialog);
                //   this.changeDetectorRefs.detectChanges();
                // }, 5000);

}
}
