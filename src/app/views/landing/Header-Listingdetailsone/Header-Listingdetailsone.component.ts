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



  propertyname: string;
  propertydetails:BusinessUser;
  PropertyUrl: string;
  showheader: boolean =false;
  websiteUrlBookingEngine: boolean =  false;
  urlLocation: boolean;


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
