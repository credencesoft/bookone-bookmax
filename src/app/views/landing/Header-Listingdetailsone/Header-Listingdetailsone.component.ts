import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TokenStorage } from 'src/token.storage';
import { BusinessUser } from 'src/app/model/user';

@Component({
  selector: 'app-Header-Listingdetailsone',
  templateUrl: './Header-Listingdetailsone.component.html',
  styleUrls: ['./Header-Listingdetailsone.component.css']
})
export class HeaderListingdetailsoneComponent implements OnInit {
  // @Output() bookNowClicked = new EventEmitter<void>();
  @Output() onBookNowClick = new EventEmitter<void>();
  showListItems: boolean = false; // For your existing toggle functionality
  isdone : boolean = false;
  @Input()
  businessUser:any;
  socialmedialist:any;
  showListingDetails: boolean = false;
  website: string;
  logoUrl: string;
  dynamicText: string;
  dynamicCity: string;
  dynamicStreetName: string;
  dynamicLocality: string;
  propertyname: string;
    dynamicCountryName: string;
  dynamicStreetNumber: string;
  propertydetails:BusinessUser;
  PropertyUrl: string;
  showheader: boolean =false;
  websiteUrlBookingEngine: boolean =  false;
  urlLocation: boolean;
  dynamicPropertyId: number;

  // gotopropertydetail() {
  //   let PropertyUrl = this.token.getPropertyUrl();
  //   //console.log(PropertyUrl);

  //   if (PropertyUrl.startsWith('http://') || PropertyUrl.startsWith('https://')) {
  //     console.error("Property URL should be a relative path, not a full URL");
  //   } else {
  //     this.router.navigate([PropertyUrl]);
  //   }
  // }

  goBack(): void {
    this.location.back();
  }

  closeNavbar(): void {
    this.isdone = false; // Hides the vertical navbar
  }

  constructor(private router: Router,
    private location: Location,
    private token:TokenStorage,
    private acRoute: ActivatedRoute,
  ) {
    // this.propertydetails = this.token.getProperty();
    // //console.log("propertydata="+ JSON.stringify(this.propertydetails))
    this.PropertyUrl = this.token.getPropertyUrl();
    //console.log("property url:" + this.PropertyUrl)
    this.website = this.businessUser?.website;

    setTimeout(() => {
      console.log("businessUser",this.businessUser)
    this.website = this.businessUser?.website;
      this.businessUser?.socialMediaLinks?.forEach(element => {
        this.socialmedialist=element
      });
      if (this.businessUser != null ) {
        this.showheader = true
      }
                }, 1000);

   }
 ngAfterViewInit() {
                    this.acRoute.queryParams.subscribe((params) => {
                if (params['bookingEngine'] !== undefined) {
                  this.urlLocation = params['bookingEngine'];
                  let websitebookingURL = 'true';
                  this.websiteUrlBookingEngine = true;
                  console.log("websiteUrlBookingEngine",this.websiteUrlBookingEngine)
                }
    });

 }
  ngOnInit() {
    this.website = this.businessUser?.website;

    //console.log('new link is',this.website);
  }

  toggleListingDetails() {
    this.showListingDetails = !this.showListingDetails;
    this.isdone = true;
    this.website = this.businessUser?.website;
  this.businessUser?.socialMediaLinks.forEach(element => {
    this.socialmedialist=element
  });
    this.propertyname = this.businessUser?.seoFriendlyName;
    this.logoUrl=this.businessUser?.logoUrl;
    //console.log(this.logoUrl);
    //console.log('new link is',this.website);
    //console.log('new link is hello world',this.socialmedialist);
    //console.log('new link is',this.propertyname);


  }
  openWhatsapp() {
  const url = this.getWhatsappShareUrl();
  window.open(url, '_blank'); // opens WhatsApp link in new tab/app
}
    getWhatsappShareUrl(): string {
    const baseUrl = 'https://api.whatsapp.com/send';
    const phoneNumber = '919004126958';
    this.dynamicText = this.businessUser.name;
    this.dynamicPropertyId = this.businessUser.id;
    this.dynamicCity = this.businessUser?.address?.city;
    this.dynamicStreetName = this.businessUser.address?.streetName;
    this.dynamicLocality = this.businessUser.address?.locality;
    this.dynamicStreetNumber = this.businessUser.address?.streetNumber;
    this.dynamicCountryName = this.businessUser.address?.country;
    // The recipient's phone number (optional)
    const message =
      '*This is an Enquiry from :* The HotelMate Website' +
      '\nHotel Name: ' +
      this.dynamicText +
      ',' +
      '\nProperty Id: ' +
      this.dynamicPropertyId +
      ',' +
      '\nAddress: ' +
      this.dynamicStreetNumber +
      ',' +
      this.dynamicStreetName +
      ',' +
      this.dynamicLocality +
      ',' +
      this.dynamicCity +
      ',' +
      this.dynamicCountryName; // The dynamic text you want to include

    return (
      baseUrl + '?phone=' + phoneNumber + '&text=' + encodeURIComponent(message)
    );
  }
  toggleListItems() {
    this.showListItems = !this.showListItems;
  }

  scrollToAccommodation(event: MouseEvent) {
 // Prevent the event from bubbling up
 event.stopPropagation();
    this.onBookNowClick.emit(); // Emit the event when the button is clicked
  }
  navigate(){

  }
}
