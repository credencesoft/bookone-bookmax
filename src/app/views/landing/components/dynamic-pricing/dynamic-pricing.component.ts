import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CurrencyService } from 'src/app/services/currency.service';
import { SubmitData } from './submitData';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
// import { constructor } from 'jquery';

@Component({
  selector: 'app-dynamic-pricing',
  templateUrl: './dynamic-pricing.component.html',
  styleUrls: ['./dynamic-pricing.component.scss'],
  animations: [SharedAnimations]
})
export class DynamicPricingComponent implements OnInit {
  currency = '$';
  country = 'US';
  propertySize = 2;
  noOfRoom = 1;
  rates = [];
  symbol = '$';
  cRate = 1;


  HWChecked = false;
  BEChecked = true;
  BMChecked = false;
  CMChecked = false;
  RevenueMChecked = false;
  AnalyticsChecked = false;
  RoomMChecked = false;
  MAChecked = false;
  CRMChecked = false;
  MUChecked = false;
  OPIChecked = false;
  HMAChecked = false;

  selectedSubscriptionArray: string[];

  subscriptionCount = 1;
  discountAmount = 0;

  quarterlyDiscount = 2;
  halfYearlyDiscount = 5;
  yearlyDiscount = 10;
  twoYearDiscount = 15;


  HWPrice = 4;
  BEPrice = 4;
  BMPrice = 0;
  CMPrice = 10;
  RevenueMPrice = 4;
  AnalyticsPrice = 4;
  RoomMPrice = 0;
  MAPrice = 0.2;
  CRMPrice = 4;
  MUPrice = 0;
  OPIPrice = 0;
  HMAPrice = 4;

  // tslint:disable-next-line: max-line-length
 basePrice =  4 ;



  monthlyPrice: any;
  halfyearlyPrice: any;
  yearlyPrice: any;
  twoYearlyPrice: any;
  checked = true;
  Currency:  any;

  submitData: SubmitData;

  constructor(private currencyService: CurrencyService,
    private router: Router) {
    this.submitData = new SubmitData();
  }
  noOfRoomControl: FormControl = new FormControl('', [Validators.max(200), Validators.min(0)]);


  ngOnInit() {
    this.viewPrice();
// this.setCurrencyRate();
  }

  getUserLocation() {

  }
setCurrencyRate() {
    this.currencyService.getCurrencyRate()
      .subscribe(response => {
        this.Currency = response.body;
      console.log('currency : ' + JSON.stringify( response.body.quotes ));
      this.rates = this.Currency.quotes;
    });
    console.log('data ' + JSON.stringify(this.rates));
  }

HWcheck() {
  if (this.HWChecked !== false) {
    this.HWChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.HWPrice;
  } else {
    this.HWChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.HWPrice;
  }
  this.viewPrice();
}
BEcheck() {
  if (this.BEChecked !== false) {
    this.BEChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.BEPrice;
  } else {
    this.BEChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.BEPrice;
  }
  this.viewPrice();
}
BMcheck() {
  if (this.BMChecked !== false) {
    this.BMChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.BMPrice;
  } else {
    this.BMChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.BMPrice;
  }
  this.viewPrice();
}
CMcheck() {
  if (this.CMChecked !== false) {
    this.CMChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.CMPrice;
  } else {
    this.CMChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.CMPrice;
  }
  this.viewPrice();
}
RevenueMcheck() {
  if (this.RevenueMChecked !== false) {
    this.RevenueMChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.RevenueMPrice;
  } else {
    this.RevenueMChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.RevenueMPrice;
  }
  this.viewPrice();
}
Analyticscheck() {
  if (this.AnalyticsChecked !== false) {
    this.AnalyticsChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.AnalyticsPrice;
  } else {
    this.AnalyticsChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.AnalyticsPrice;
  }
  this.viewPrice();
}
RoomMcheck() {
  if (this.RoomMChecked !== false) {
    this.RoomMChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.RoomMPrice;
  } else {
    this.RoomMChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.RoomMPrice;
  }
  this.viewPrice();
}
MAcheck() {
  if (this.MAChecked !== false) {
    this.MAChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.MAPrice;
  } else {
    this.MAChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.MAPrice;
  }
  this.viewPrice();
}
CRMcheck() {
  if (this.CRMChecked !== false) {
    this.CRMChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.CRMPrice;
  } else {
    this.CRMChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.CRMPrice;
  }
  this.viewPrice();
}
MUcheck() {
  if (this.MUChecked !== false) {
    this.MUChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.MUPrice;
  } else {
    this.MUChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.MUPrice;
  }
  this.viewPrice();
}
OPIcheck() {
  if (this.OPIChecked !== false) {
    this.OPIChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.OPIPrice;
  } else {
    this.OPIChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.OPIPrice;
  }
  this.viewPrice();
}
HMAcheck() {
  if (this.HMAChecked !== false) {
    this.HMAChecked = false;
    this.subscriptionCount--;
    this.basePrice = this.basePrice - this.HMAPrice;
  } else {
    this.HMAChecked = true;
    this.subscriptionCount++;
    this.basePrice = this.basePrice + this.HMAPrice;
  }
  this.viewPrice();
}
onCountryChange() {
  // this.monthlyPrice =  Number(this.basePrice) *  Number(this.country);
  // this.viewPrice();
   if (this.country === 'BD') {
     this.symbol = '৳';
     this.cRate = 84.47;
    } else if (this.country === 'IN') {
      this.symbol = '₹';
      this.cRate = 71.44;
    } else if (this.country === 'US') {
      this.symbol = '$';
      this.cRate = 1;
    } else if (this.country === 'AU') {
      this.symbol = '$';
      this.cRate = 1.49;
    } else if (this.country === 'EU') {
      this.symbol = '€'
      this.cRate = 0.92;
    } else if (this.country === 'UK') {
      this.symbol = '£';
      this.cRate = 0.76;
    } else if (this.country === 'NZ') {
      this.symbol = '$';
      this.cRate = 1.55;
    } else if (this.country === 'CA') {
      this.symbol = '$';
      this.cRate = 1.33;
    }
}
onPropertyChange() {
  this.discountAmount = Number(this.propertySize) + Number(this.subscriptionCount);
  if (this.propertySize == 2) {
    this.noOfRoom = 1;
  }if (this.propertySize == 5) {
    this.noOfRoom = 11;
  }if (this.propertySize == 10) {
    this.noOfRoom = 21;
  }if (this.propertySize == 15) {
    this.noOfRoom = 41;
  }if (this.propertySize == 20) {
    this.noOfRoom = 101;
  }
}
onRoomChange() {
  // this.basePrice = this.basePrice * this.noOfRoom;
  if (this.noOfRoom >= 1 && this.noOfRoom <= 10) {
    this.propertySize = 2;
  }if (this.noOfRoom >= 11 && this.noOfRoom <= 20) {
    this.propertySize = 5;
  }if (this.noOfRoom >= 21 && this.noOfRoom <= 40) {
    this.propertySize = 10;
  }if (this.noOfRoom >= 41 && this.noOfRoom <= 100) {
    this.propertySize = 15;
  }if (this.noOfRoom >= 101) {
    this.propertySize = 20;
  }
}

  viewPrice() {
    this.discountAmount = Number(this.propertySize) + Number(this.subscriptionCount);
    this.monthlyPrice =  this.basePrice ;
    this.halfyearlyPrice = this.monthlyPrice * 6;
    this.yearlyPrice = this.monthlyPrice * 12 ;
    this.twoYearlyPrice = this.monthlyPrice * 24;
    console.log('discount ' + this.discountAmount + ' s ' + this.subscriptionCount + ' room ' + this.noOfRoom + ' p ' + this.propertySize);
  }
selectedSubscription() {
  this.selectedSubscriptionArray = [];
  this.submitData.country = this.country;
  this.submitData.noOfRoom = this.noOfRoom;
  this.submitData.propertySize = this.propertySize;

  if (this.HWChecked === true) {
    this.selectedSubscriptionArray.push('Hotel Website');
  }

  if (this.BEChecked === true) {
    this.selectedSubscriptionArray.push('Booking Engine');
  }

  if (this.BMChecked === true) {
    this.selectedSubscriptionArray.push('Booking Management');
  }

  if (this.CMChecked === true) {
    this.selectedSubscriptionArray.push('Channel Management');
  }


  if (this.HMAChecked === true) {
    this.selectedSubscriptionArray.push('Hotel Mobile App');
  }

  if (this.OPIChecked === true) {
    this.selectedSubscriptionArray.push('Online Payment Integration');
  }

  if (this.MUChecked === true) {
    this.selectedSubscriptionArray.push('Multi User Setup');
  }

  if (this.CRMChecked === true) {
    this.selectedSubscriptionArray.push('CRM');
  }

  if (this.MAChecked === true) {
    this.selectedSubscriptionArray.push('Bookone Mobile App');
  }

  if (this.RoomMChecked === true) {
    this.selectedSubscriptionArray.push('Room Management');
  }

  if (this.AnalyticsChecked === true) {
    this.selectedSubscriptionArray.push('Analytics');
  }

  if (this.RevenueMChecked === true) {
    this.selectedSubscriptionArray.push('Revenue Management');
  }

  this.submitData.SubscriptionArray = this.selectedSubscriptionArray;


  const navigationExtras: NavigationExtras = {
    queryParams: {
        object: JSON.stringify(this.submitData),
    }
  };
  this.router.navigate(['/contact'], navigationExtras);
}
  onmonthlySubscription() {
    this.submitData.onmonthly = true;
this.selectedSubscription();
  }
  onhalfYearSubscription() {
    this.submitData.onhalfYear = true;
this.selectedSubscription();
  }
  onYearSubscription() {
    this.submitData.onYear = true;
this.selectedSubscription();
  }
  on2YearSubscription() {
    this.submitData.on2Year = true;
this.selectedSubscription();
  }
}
