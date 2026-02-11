import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {

  ngOnInit(): void {
    // Notify parent window
    if (window.opener) {
      window.opener.postMessage(
        { type: 'PAYMENT_SUCCESS_REDIRECT' },
        window.location.origin
      );
    }

    // Close payment window
    setTimeout(() => {
      window.close();
    }, 2500);
  }
}
