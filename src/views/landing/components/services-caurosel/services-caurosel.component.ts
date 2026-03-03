import { Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
@Component({
  selector: 'app-services-caurosel',
  templateUrl: './services-caurosel.component.html',
  styleUrls: ['./services-caurosel.component.scss']
})
export class ServicesCauroselComponent implements OnInit {
  public carouselTileItems: Array<any> = [
    {
      icon: './assets/images/landing/services/services3.svg',
      text: `Specialised & Dedicated team for Property & Hotel On-boarding.`,
      title: 'Guest Booking'
    },
    {
      icon: './assets/images/landing/services/services4.svg',
      text: `User Account Setup.
      Property, Room Setup.
      Local Tax / Tax Slabs Setup.`,
      title: 'Setup'
    },
    {
      icon: './assets/images/landing/services/services5.svg',
      text: `Setting Up Rates.
      Setting Up Availability.
      Realtime Update of Rates & Availability.`,
      title: 'Manage Rates & Availability'
    },
    {
      icon: './assets/images/landing/services/services6.svg',
      text: `New Booking , Payment Link.
      Check-In, Service, Check-Out.
      Invoice, Notification at Each Stage of Booking.`,
      title: 'Booking Management'
    },
    {
      icon: './assets/images/landing/services/services7.svg',
      text: `Create/ Update/ Manage Payment.
      Process Payment, Reporting.
      Sending Payment Link.
      Notification.
      Manage Expense Hotel/ Booking.
      Create/ Update Expense.
      Grouping & Reporting.`,
      title: 'Revenue Management'
    },
    {
      icon: './assets/images/landing/services/services8.svg',
      text: `Manage Rooms
      Check Available Rooms
      Monthly Room View
      Room Allocation
      Instant Room Status`,
      title: 'Room Management'
    }
  ];
  public carouselTiles = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md:3, lg: 4, all: 0 },
    slide: 4,
    speed: 250,
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  constructor() {}

  ngOnInit() {}
}
