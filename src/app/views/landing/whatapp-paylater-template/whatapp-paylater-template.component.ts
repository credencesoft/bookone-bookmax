import { HeaderListingdetailsoneComponent } from './../Header-Listingdetailsone/Header-Listingdetailsone.component';

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from 'src/app/model/booking';
import { BusinessOfferDto } from 'src/app/model/businessOfferDto';
import { BusinessUser } from 'src/app/model/user';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-whatapp-paylater-template',
  imports: [CommonModule,HeaderListingdetailsoneComponent] ,
  standalone: true,
  templateUrl: './whatapp-paylater-template.component.html',
  styleUrls: ['./whatapp-paylater-template.component.css']
})
export class WhatappPaylaterTemplateComponent implements OnInit {
  bookingId: any;
  bookingdetails: any;
 booking: Booking;
 bookingRoomPrice: any;
 businessUser: BusinessUser;
 accommodationService: any;
 propertyDetails:any;
 savedServices: any;
 promocodeListChip : any[] = [];
 storedPromo: string;
 selectedPromo: any;
 PropertyUrl: string;
 copyTextOne:boolean=false;
 policies = [];
 loader: boolean;
 propertyServiceListData: any[] = [];
 propertyId: any;
 isReadMore: boolean[] = [];
 businessOfferDto: BusinessOfferDto;
 bookingOne:Booking;
  percentage1: number;
  percentage2: number;
  totalPercentage: any;
  currency: any;
  taxPercentage: number;
  // totalPercentage: number;
  showMore:boolean  =false
  socialmedialist:any;
  constructor(
    private acRoute: ActivatedRoute,
    private hotelbooking:HotelBookingService,
     private token: TokenStorage,
       private listingService: ListingService,
        private router: Router,
        private hotelBookingService: HotelBookingService,
        private changeDetectorRefs: ChangeDetectorRef,
  ) {
    this.businessUser = new BusinessUser();
    this.bookingOne = this.token.getBookingData();

  //   this.storedPromo = localStorage.getItem('selectPromo');
  //   if(this.storedPromo == 'true'){
  //    const selectedPromoData = JSON.parse( localStorage.getItem('selectedPromoData'));
  //    this.selectedPromo = selectedPromoData
  //    // this.businessOfferDto = selectedPromoData
  //  console.log(selectedPromoData)
  //  }else{
  //    this.getOfferDetails();
  //  }

  }

  ngOnInit() {
    this.acRoute.queryParams.subscribe((params) => {
      if (params["bookingId"] !== undefined) {
        this.bookingId = params["bookingId"];
      }
    });
    this.getBookingByid(this.bookingId);
  }


  async getBookingByid(bookingId:string) {


    try {
      const response = await this.hotelbooking.getBookingDetailsone(this.bookingId).toPromise();


      if (response.body) {
        this.bookingdetails = response.body;
        this.booking = this.bookingdetails.bookingDetails;
        this.savedServices = this.bookingdetails.serviceDetails;
        await this.getPropertyDetailsById(this.booking.propertyId);
        console.log('booking is',this.booking);
        this.booking.taxDetails.forEach(item=>{
          if(item.name === 'CGST'){
            this.percentage1 = item.percentage;
          }

          if(item.name === 'SGST'){
            this.percentage2 = item.percentage;
          }
        })
        this.totalPercentage =  this.percentage1 +  this.percentage2;
        if (this.token.saveBookingRoomPrice(this.booking.roomPrice) !== null) {
          this.bookingRoomPrice = this.token.getBookingRoomPrice();
        }

        this.bookingdetails.bookingDetails.taxDetails.forEach(item=>{
          if(item.name === 'CGST'){
            this.percentage1 = item.percentage;
          }

          if(item.name === 'SGST'){
            this.percentage2 = item.percentage;
          }
        })
        this.taxPercentage = (this.percentage1 + this.percentage2);



       this.propertyId = this.bookingdetails.bookingDetails.propertyId;
        await this.getpropertyByid(this.bookingdetails.bookingDetails.propertyId);
      } else {


      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
callNow() {
    window.location.href = 'tel:' + 7326079861;
}
     async getPropertyDetailsById(id: number) {


        try {


          const data = await this.listingService?.findByPropertyId(id).toPromise();
          if (data.status === 200) {
            this.businessUser = data.body;
            this.policies = this.businessUser.businessServiceDtoList.filter(
              (ele) => ele.name === 'Accommodation'
            );
            this.calculateServiceHours()
            this.businessUser?.socialMediaLinks.forEach(element => {
              this.socialmedialist=element
            });




            this.token.saveProperty(this.businessUser);
            this.currency = this.businessUser.localCurrency.toUpperCase();


            // this.businessServiceDto = this.businessUser?.businessServiceDtoList.find(
            //   (data) => data.name === this.businessUser.businessType
            // );


                    if (this.businessUser.primaryColor !== undefined) {
          this.changeTheme(
            this.businessUser.primaryColor,
            this.businessUser.secondaryColor,
            this.businessUser.tertiaryColor
          );
        }


            this.changeDetectorRefs.detectChanges();
          } else {
            this.router.navigate(["/404"]);
          }
        } catch (error) {


          // Handle the error appropriately, if needed.
        }
      }
               changeTheme(primary?: string, secondary?: string, tertiary?: string) {
  // Default colors if none are passed
  const defaultPrimary = "#232A45";   // blue
  const defaultSecondary = "#0B01CC"; // green
  const defaultTertiary = "#fff";  // yellow

  const p = primary || defaultPrimary;
  const s = secondary || defaultSecondary;
  const t = tertiary || defaultTertiary;

  document.documentElement.style.setProperty('--primary', p);
  document.documentElement.style.setProperty('--secondary', s);
  document.documentElement.style.setProperty('--tertiary', t);
  document.documentElement.style.setProperty('--button-primary', t);

  document.documentElement.style.setProperty(
    '--primary-gradient',
    `linear-gradient(180deg, ${t}, ${s})`
  );
  document.documentElement.style.setProperty(
    '--secondary-gradient',
    `linear-gradient(312deg, ${p}, ${s})`
  );
  document.documentElement.style.setProperty(
    '--secondary-one-gradient',
    `linear-gradient(180deg, ${p}, ${s})`
  );
  document.documentElement.style.setProperty(
    '--third-gradient',
    `linear-gradient(180deg, ${p}, ${s})`
  );
}
onGenerateVouchers() {

    this.hotelBookingService.generateBookingVoucher(this.booking.id).subscribe({
      next: (response) => {
        console.log(`Voucher generated for bookingId ${this.booking.id}:`, response);

        if (response.voucherUrl) {
          this.hotelBookingService.downloadVoucher(response.voucherUrl).subscribe({
            next: (blob) => {
              const downloadUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `voucher-${this.booking.id}.pdf`; // filename
              a.click();
              window.URL.revokeObjectURL(downloadUrl);
            },
            error: (err) => {
              console.error(`Error downloading voucher for bookingId ${this.booking.id}:`, err);
            }
          });
        }
      },
      error: (err) => {
        console.error(`Error generating voucher for bookingId ${this.booking.id}:`, err);
      }
    });
}
getTrimmedDescription(description: string): string {
  if (!description) return '';

  const words = description.split(/\s+/); // split by spaces
  if (words.length <= 35) {
    return description;
  }

  return words.slice(0, 35).join(' ') + '...';
}
  async getpropertyByid(propertyId:number) {
    try {
      const response = await this.listingService.findByPropertyId(this.propertyId).toPromise();
      if (response.body != null) {
        this.businessUser = response.body;
        this.currency = this.businessUser.localCurrency.toUpperCase();
        this.storedPromo = localStorage.getItem('selectPromo');
        if(this.storedPromo == 'true'){
         const selectedPromoData = JSON.parse( localStorage.getItem('selectedPromoData'));
         this.selectedPromo = selectedPromoData
       }else{
         this.getOfferDetails();
       }
       if (this.businessUser.taxDetails.length > 0) {
        this.businessUser.taxDetails.forEach((element) => {
          if (element.name === 'GST') {
            this.booking.taxDetails = [];
            this.booking.taxDetails.push(element);
            this.taxPercentage = element.percentage;
            this.booking.taxPercentage = this.taxPercentage;

            if (element.taxSlabsList.length > 0) {
              element.taxSlabsList.forEach((element2) => {
                if (
                  element2.maxAmount > this.booking.roomPrice &&
                  element2.minAmount < this.booking.roomPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                } else if (
                  element2.maxAmount <
                  this.booking.roomPrice
                ) {
                  this.taxPercentage = element2.percentage;
                  this.booking.taxPercentage = this.taxPercentage;
                }
              });
            }
          }
        });

        // this.taxPercentage = this.booking.taxDetails[0].percentage;
      }

        this.calculateServiceHours();
        this.policies = this.businessUser.businessServiceDtoList.filter(
          (ele) => ele.name === 'Accommodation'
        );






        this.businessUser.propertyServicesList.forEach(ele => {


          if (ele.id != null && ele.id != undefined) {
            this.propertyServiceListData.push(ele)
          }
        });


      } else {
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }


  calculateServiceHours (){
    this.accommodationService = this.businessUser?.businessServiceDtoList.filter(service => service.name === "Accommodation");
  }


  toggleReadMore(index: number) {
    // Toggle the read more/less flag for the clicked policy
    this.isReadMore[index] = !this.isReadMore[index];
  }

  copyText() {

    // Find the element
    const textToCopy = document.getElementById('textToCopy')?.innerText.trim();

    if (textToCopy) {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;

      // Add to the document body
      document.body.appendChild(textarea);

      // Select and copy the content
      textarea.select();
      document.execCommand('copy');

      // Remove the textarea element
      document.body.removeChild(textarea);

      // Notify the user
      // alert('Enquiry ID copied to clipboard!');
      this.copyTextOne = true;
      setTimeout(() => {
        this.copyTextOne = false;
      }, 1000);
    } else {
      // alert('Failed to copy text.');
      this.copyTextOne = false;
    }
  }

  getOfferDetails() {
    this.hotelbooking
      .getOfferDetailsBySeoFriendlyName(this.businessUser.seoFriendlyName)
      .subscribe((data) => {
        this.businessOfferDto = data.body;
        this.promocodeListChip = this.checkValidCouponOrNot(data.body);
      });
  }

  checkValidCouponOrNot(couponList?){
    try{
      const currentDate = new Date();
      const validCoupons = [];
      couponList.forEach((coupon) => {
        if (coupon.startDate && coupon.endDate && coupon.discountPercentage) {
          const startDate = new Date(coupon.startDate);
          const endDate = new Date(coupon.endDate);
          // Check if the current date is within the start and end date
          if (currentDate >= startDate && currentDate <= endDate && coupon.discountPercentage != 100) {
            validCoupons.push(coupon);
          }
        }
      });
      return validCoupons;
    }
    catch(error){
      console.error("Error in checkValidCouponOrNot : ",error);
    }
  }

  // toggleView(): void {
  //   this.showMore = !this.showMore;
  // }

}
