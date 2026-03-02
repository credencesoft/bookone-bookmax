import { Component, OnInit } from '@angular/core';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-Confirm-Booking',
  templateUrl: './Confirm-Booking.component.html',
  styleUrls: ['./Confirm-Booking.component.css']
})
export class ConfirmBookingComponent implements OnInit {
  PropertyUrl: string;

  constructor(
    private token: TokenStorage,
    ) {
    this.PropertyUrl = this.token.getPropertyUrl();
   }

  ngOnInit() {
  }
  backClicked() {
  }
}
