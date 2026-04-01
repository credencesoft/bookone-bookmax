import { ChangeDetectorRef, Component, NgZone ,OnInit} from '@angular/core';
import { API_URL_IN, API_URL_NZ } from 'src/app/app.component';
import { BusinessOfferDto } from 'src/app/model/businessOfferDto';
import { HotelBookingService } from 'src/services/hotel-booking.service';
import { TokenStorage } from 'src/token.storage';
import { EnquiryForm } from '../onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { EnquiryDto } from 'src/app/model/enquiry';
import { BusinessUser } from 'src/app/model/user';
import { Booking } from 'src/app/model/booking';
import { Payment } from 'src/app/model/payment';
import { Location, DatePipe } from '@angular/common';


import { externalReservationDtoList } from 'src/app/model/externalReservation';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';
import { BusinessServiceDtoList } from 'src/app/model/businessServiceDtoList';
import { RoomDetail } from 'src/app/model/RoomDetail';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'src/services/listing.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'src/services/logger.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { WhatsappDto } from 'src/app/model/whatsappDto';
import { Template } from 'src/app/model/template';
import { Language } from 'src/app/model/language';
import { Components } from 'src/app/model/components';
import { Para } from 'src/app/model/parameters';
import { Images } from 'src/app/model/image';
import { OrderService } from 'src/app/services/order.service';
@Component({
  selector: 'app-whatsapp-redirect-page',
  templateUrl: './whatsapp-redirect-page.component.html',
  styleUrls: ['./whatsapp-redirect-page.component.css']
})
export class WhatsappRedirectPageComponent implements OnInit {
  businessUser: BusinessUser;
  booking: Booking;
  payment: Payment;
  PropertyUrl: string;
  paymentLoader: boolean;
  bookingData: any;
  isSuccess: boolean;
  headerTitle: string;
  externalReservationdto: any;
  bodyMessage: string;
  storedPromo: string;
  businessOfferDto: BusinessOfferDto;
  selectedPromo: any;
  externalReservationDtoList:externalReservationDtoList[];
  showAlert: boolean = false;
  alertType: string;
  bookingConfirmed = false;
  fromDate: any;
  copyTextOne:boolean=false;


  toDate: any;
  adults: number;
  children: number;
  children3to5: number;
  noOfrooms: number;
  currency: string;
  payment2: Payment;
  totalExtraAmount: number = 0;
  totalTaxAmount: number = 0;
  totalBeforeTaxAmount: number = 0;
  addServiceList: any[];
  enquiryForm: any;
  textToCopy: string = 'This is some text to copy';
textToCopyOne: string = 'This is some text to copy';
  showMore:boolean =false;
  enquiryResponse: EnquiryForm;
  successMessage: boolean;
  reservationRoomDetails:RoomDetail[];
  propertyServices:PropertyServiceDTO[];
  API_URL: string;
  accommodationService: any;
  enquirySent: boolean = false;
  submitButtonDisable: boolean;
  savedServices: any[] = [];
  businessServiceDtoList: any[] = [];
  getDetailsData: any;
  dueAmount: number;
  businessServiceDto: BusinessServiceDtoList;
  bookingRoomPrice: any;
  socialmedialist:any;
  promocodeListChip : any[] = [];
  taxAmountOne: number;
  bookinddata: Booking;
  fromTimeDate: string = '';
  toTimeDate: string = '';
  combinedDateFromTime: number;
  combinedDateToTime: number;
  percentage1: number;
  percentage2: number;
  totalPercentage: number;
  isReadMore: boolean[] = [];
  policies = [];
  whatsappForm:WhatsappDto;
  template :Template;
  language:Language;
  componentstype:Components;
  parametertype:Para;
  parameterss:Para[];
  components:Components[];
  parametertype2:Para;
  parameterss2:Para[];
  componentstype2:Components;
  componentstype9:Components;
  componentstype10:Components;
  parametertype20:Para;
  parameterss15:Para[];
  images:Images;
  parametertype3:Para;
  parameterss3:Para[];
  parameterss1:Para[];
  bookingId: string;
bookingdetails: any;
calculatedServices: any[];
totalServiceCost: number = 0;
bookingroomPrice: string;
taxPercentage: number;
  roomLabel: string = 'Room';
  roomLabelValue: string;

  constructor(
    private http: HttpClient,
    private token: TokenStorage,
    private acRoute: ActivatedRoute,
    private hotelBookingService: HotelBookingService,
    private ngZone: NgZone,
    private changeDetectorRefs: ChangeDetectorRef,
    private location: Location,
    private router: Router,
    private listingService: ListingService,
    private datePipe:DatePipe,
    private hotelbooking:HotelBookingService,
    private orderservice:OrderService

  ) {
    this.businessUser = new BusinessUser();
    this.booking = new Booking();
    this.payment = new Payment();
    this.whatsappForm = new WhatsappDto();
    this.template =new Template();
    this.language = new Language();
    this.componentstype = new Components();
    this.parametertype = new Para();
    this.parametertype2 = new Para();
    this.componentstype2 = new Components();
    this.componentstype9 = new Components();
    this.componentstype10 = new Components();
    this.parametertype20 = new Para();
    this.parametertype3 = new Para()
    this.parameterss =[];
    this.components = [];
    this.parameterss2 =[];
    this.parameterss3 = [];
    this.parameterss1 = [];


    this.parameterss15 = [];
    this.images = new Images();
    this.externalReservationDtoList =[]
    this.PropertyUrl = this.token.getPropertyUrl();
    this.isReadMore = this.policies.map(() => false);


    if(this.token.saveRoomPrice(this.booking.roomPrice) !== null){
      this.bookingroomPrice = this.token.getRoomPrice();
}

this.storedPromo = localStorage.getItem('selectPromo');
    if(this.storedPromo == 'true'){
     const selectedPromoData = JSON.parse( localStorage.getItem('selectedPromoData'));
     this.selectedPromo = selectedPromoData
     // this.businessOfferDto = selectedPromoData
   console.log(selectedPromoData)
   }else{
     this.getOfferDetails();
   }
//      const savedLabel = localStorage.getItem('savedBookingLabel');

// if (savedLabel) {
//   try {
//     const parsedData = JSON.parse(savedLabel);    
//     this.roomLabel = parsedData.fullLabel || parsedData.label || 'Room';
    
//   } catch (e) {
//     this.roomLabel = savedLabel || 'Room';
//     console.error("Error parsing label, using raw value instead", e);
//   }
// } else {
//   this.roomLabel = 'Room';
// }

this.roomLabelValue = localStorage.getItem('selectedplan is');
console.log(' this.roomLabelValue is', this.roomLabelValue);
  }

  ngOnInit() {
      this.roomLabelValue = localStorage?.getItem('selectedplan');
 console.log('roomLabelValue is',this.roomLabelValue);
    this.acRoute.queryParams.subscribe((params) => {
      if (params["bookingId"] !== undefined) {
        this.bookingId = params["bookingId"];
      }
    });
    this.getBookingByid(this.bookingId);
  }


  async getBookingByid(bookingId:string) {


    try {
      const response = await this.hotelbooking.getBookingDetailsone(this.bookingId)?.toPromise();


      if (response.body) {
        this.bookingdetails = response.body;
        this.booking = this.bookingdetails.bookingDetails;
        this.savedServices = this.bookingdetails.serviceDetails;

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


        await this.getpropertyByid(this.bookingdetails.bookingDetails.propertyId);
        await this.getPropertyDetailsById(this.bookingdetails.bookingDetails.propertyId);
      } else {
        // Handle the case when the response body is empty or missing
      }
    } catch (error) {
      // Handle errors, such as network errors or invalid responses
      console.error("An error occurred:", error);
    }
  }


  async getpropertyByid(id:number) {


    try {
      const response = await this.listingService.findByPropertyId(id).toPromise();
      if (response.body != null) {
        this.businessUser = response.body;

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
      } else {
        // Handle the case when the response body is empty or missing
      }
    } catch (error) {
      // Handle errors, such as network errors or invalid responses
      console.error("An error occurred:", error);
    }
  }


  calculateServiceHours (){
    this.accommodationService = this.businessUser.businessServiceDtoList.filter(service => service.name === "Accommodation");
  }


  addServiceToBooking(bookingId, savedServices: any[]) {
    this.savedServices?.forEach(element => {
      element.count = element.quantity;
      element.afterTaxAmount = element.quantity * element.servicePrice
      element.date = new Date();
    });
          this.hotelBookingService.saveBookingService(bookingId, savedServices).subscribe(
            (data) => {


              this.changeDetectorRefs.detectChanges();
              // Logger.log(JSON.stringify( this.businessServices));
            },
            (error) => {


            }
          );
        }


        calculateserviceprice(){
          this.calculatedServices =[]
        if (this.savedServices != null && this.savedServices != undefined) {


           this.savedServices?.forEach(element => {
             let serviceCost = element.afterTaxAmount * element.quantity;
             this.calculatedServices.push(serviceCost);
             this.totalServiceCost += serviceCost; // Accumulating the total cost
           });
         }
       }




  toggleReadMore(index: number) {
    this.isReadMore[index] = !this.isReadMore[index];
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


            this.businessServiceDto = this.businessUser?.businessServiceDtoList.find(
              (data) => data.name === this.businessUser.businessType
            );


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
 getTrimmedDescription(description: string): string {
  if (!description) return '';

  const words = description.split(/\s+/); // split by spaces
  if (words.length <= 35) {
    return description;
  }

  return words.slice(0, 35).join(' ') + '...';
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
callNow() {
    window.location.href = 'tel:' + 7326079861;
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

}
