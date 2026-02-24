import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment-failure',
    templateUrl: './payment-failure.component.html',
    styleUrls: ['./payment-failure.component.scss'],
    standalone: false
})
export class PaymentFailureComponent implements OnInit {

  ngOnInit(): void {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'PAYMENT_FAILURE_REDIRECT' },
        window.location.origin
      );
    }

    setTimeout(() => {
      window.close();
    }, 3500);
  }
}
