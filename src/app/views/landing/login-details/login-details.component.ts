import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Booking } from 'src/app/model/booking';
import { API_URL } from 'src/app/app.component';
import { TokenStorage } from 'src/token.storage';
import { LandingService } from '../landing.service';
import { Console } from 'console';
import { BusinessUser } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';
import { Route } from '@angular/router';
import { MatTable , MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CancelService } from '../cancel.service';
import { Cancel } from '../cancel';
import { ListingService } from 'src/services/listing.service';
import { CountryList } from 'src/model/country';

@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.css']
})
export class LoginDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) itemTable: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  bookings: Booking[] = [];
  bookingFilter: any;
  bookPaginator: MatPaginator;
  isOrgAdmin:boolean = false;

  dataSource = new MatTableDataSource();
  propertyId: number;

  phoneNumber: string = '';

  cancelBookingId: any;

  selectedOption: string = 'EmailRadio';
  selectedOptionenquiry: string = 'emailRadio1';

  selectedTabdefault: boolean = true;
  cancelId: any;
  currentPage = 1;
  pageSize = 6;
  nodatafound: boolean = false;

  fromdate: any;
  Todate: any;

  fromDate: Date;
toDate: Date;


  email: string = '';
  mobile: string = '';
  bookingId: string = '';
  pageNumber: number;
  totalPagess: number;

  verificationSuccess: boolean = false;
  verificationSuccess2: boolean = false;

  bookingdata: any;
  paginatedData: any[] = [];

  @Input()
  businessUser:BusinessUser;
  id: any;
  CodeNumber: string;
  countryCode: CountryList;
  propertyDetails:BusinessUser;

  isInvalidStatus(status: string): boolean {
    const invalidStatuses = ['CANCELLED', 'CHECKEDOUT', 'VOID', 'NO_SHOW', 'CHECKEDIN'];
    return invalidStatuses.includes(status.toUpperCase()); // Ensure case-insensitive check
  }



  constructor(private loginService:LandingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private token: TokenStorage,
    private route: ActivatedRoute,
    private listing:ListingService,
    private cancelService:CancelService,
  ) {
    this.countryCode = new CountryList();
    this.propertyDetails = this.token.getProperty();
    this.cancelId = new Cancel();
    this.checkDefaultCountryCode();
   }


   search() {
    this.resetBookings();
    if (this.selectedOption === 'email') {

      //console.log(`Searching for email: ${this.email}`);
    } else if (this.selectedOption === 'mobile') {

      //console.log(`Searching for mobile number: ${this.mobile}`);
    }
    else if (this.selectedOption === 'bookingId') {

      //console.log(`Searching for Booking ID: ${this.bookingId}`);
    }
  }




  searchenquiry() {
    if (this.selectedOptionenquiry === 'email') {

      //console.log(`Searching for email: ${this.email}`);
    } else if (this.selectedOptionenquiry === 'mobile') {

      //console.log(`Searching for mobile number: ${this.mobile}`);
    }
    else if (this.selectedOptionenquiry === 'bookingId') {

      //console.log(`Searching for Booking ID: ${this.bookingId}`);
    }
  }


  resetBookings() {
    this.bookings = null;
    this.paginatedData = null;
    this.bookingdata = null;
    this.currentPage = 1 ;
    //console.log('Searching for Bookings:' + this.bookings);

  if (this.bookings?.length === 0 || this.bookings === null ) {
    //console.log(`Searching for Bookings: ${this.bookings}`);
      this.nodatafound = false;
    }
    this.phoneNumber ='';
    this.email ='',
    this.bookingId = ''
  }

  externalSites:any[] = [
    { externalSiteName: "The Hotel Mate", logo: "https://bookonelocal.in/cdn/2023-12-12-111128535-The_Hotel_Mate_Logo (2).png" },
    { externalSiteName: "Easemytrip", logo: "https://bookonelocal.in/cdn/2023-12-01-080647948-emt-logo.png" },
    { externalSiteName: "GOBIBO,MMT", logo: "https://bookonelocal.in/cdn/2023-12-01-063051657-Makemytrip_logo (1).png" },
    { externalSiteName: "Agoda", logo: "https://bookonelocal.in/cdn/2023-12-01-072538528-agoda_logo_new.png" },
    { externalSiteName: "Yatra", logo: "https://bookonelocal.in/cdn/2023-12-01-075907997-yatra-removebg-preview.png" },
    { externalSiteName: "Booking.com", logo: "https://bookonelocal.in/cdn/2023-12-01-081659323-booking.com_logo.png" },
    { externalSiteName: "Expedia", logo: "https://bookonelocal.in/cdn/2023-12-12-104013814-expedia_logo_new (2).png" },
    { externalSiteName: "SiteMinder", logo: "https://bookonelocal.in/cdn/2023-12-01-123046823-siteminder_logo.png" },
    { externalSiteName: "BookOne Connect", logo: "https://bookonelocal.in/cdn/2023-12-12-110404816-Logo_Bookone_local.png" },
    { externalSiteName: "Google Hotel Ads", logo: "https://bookonelocal.in/cdn/2023-12-12-111128535-The_Hotel_Mate_Logo (2).png" },
    { externalSiteName: "Airbnb", logo: "https://bookonelocal.in/cdn/2023-12-13-082950342-Airbnb-logo.png" },
    { externalSiteName: "Trivago", logo: "https://bookonelocal.in/cdn/2023-12-13-083356894-Trivago-logo.png" },
    { externalSiteName: "Clear trip", logo: "https://bookonelocal.in/cdn/2023-12-13-084555101-cleartrip_logo.png" },
    { externalSiteName: "OYO", logo: "https://bookonelocal.in/cdn/2024-01-04-081037581-oyo_logo.png" },
    { externalSiteName: "Via.com", logo: "https://bookonelocal.in/cdn/2024-01-09-092714198-via.com_logo.png" },
    { externalSiteName: "Travel Guru", logo: "https://bookonelocal.in/cdn/2024-01-09-101557113-travelguru_logo (2).png" },
    { externalSiteName: "IRCTC", logo: "https://bookonelocal.in/cdn/2024-01-09-094852627-IRCTC-Symbol.png" },
    { externalSiteName: "Hotels.com", logo: "https://bookonelocal.in/cdn/2024-01-09-095428572-Hotels.com_logo.png" },
    { externalSiteName: "BookingJini", logo: "https://bookonelocal.in/cdn/2024-01-09-100813946-bookingjini_logo.png" },
    { externalSiteName: "Fab", logo: "https://bookonelocal.in/cdn/2024-01-18-065632560-fab_hotels_logo (3).png" },
    { externalSiteName: "Treebo", logo: "https://bookonelocal.in/cdn/2024-01-18-092540471-Treebo-Hotels-logo.png" },
    { externalSiteName: "Go Room Go", logo: "https://bookonelocal.in/cdn/2024-01-27-131106600-goroomgo_logo.png" },
    { externalSiteName: "Pie Rooms", logo: "https://bookonelocal.in/cdn/2024-04-26-064814509-pielogo.png" },


  ]



  ngOnInit() {
    this.propertyDetails = this.token.getProperty();
    this.businessUser = history.state.businessUser;

    this.propertyId = this.token.getProperty().id;
    this.bookingList();
  }

    bookingList(){
      this.bookings = [];
      this.paginatedData = [];
    this.loginService
      .getCurrentAndFutureBookings(this.propertyId)
      .subscribe((data) => {
        this.bookings = data.body;
        this.pageNumber = (this.bookings.length), (_, i) => `Item  ${i + 1}`;
      this.totalPagess = this.bookings.length;
      //console.log('page is',this.pageNumber);
      //console.log('total page is',this.totalPagess);
      this.updatePaginatedData();
        this.bookings.forEach(ele=>{
          this.cancelId = ele;

          //console.log('cancel is',this.cancelId);
        })
        // this.dataSource = new MatTableDataSource(this.bookings);
        // this.dataSource.paginator = this.bookPaginator;
        // this.dataSource.sort = this.sort;
        // this.changeDetectorRefs.detectChanges();
      });
    }

    updatePaginatedData(){
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      //console.log('starting index',startIndex)
      //console.log('endIndex index',endIndex)
      this.paginatedData = this.bookings.slice(startIndex, endIndex);
      // //console.log('total Data is',this.paginatedData);
    }
    validatePhoneNumber(){

    }

    changePage(page: number) {
      if (page > 0 && page <= this.totalPages()) {
        this.currentPage = page;
        this.updatePaginatedData();
      }
    }

    checkDefaultCountryCode () {
      if (
          this.propertyDetails?.address != undefined &&
          this.propertyDetails?.address != null &&
          this.propertyDetails?.address.country != null &&
          this.propertyDetails?.address.country != undefined
      ) {
          let code = this.countryCode?.countries.find(
              (data) =>
                  data.value.toLowerCase() ===
                  this.propertyDetails?.address?.country.toLowerCase()
          ).countryCode;

          if (code != undefined) {
              this.CodeNumber = code;
          }
      }
    }


    totalPages(): number {
      return Math.ceil(this.totalPagess / this.pageSize);
    }

    async getbookingsbybookingId() {

      try {
        const data = await this.listing.findPropertiesBybookingId(this.bookingId).toPromise();

        this.bookingdata = data.body;

        if (this.bookingdata !== null && this.bookingdata !== undefined && this.bookingdata.length !== 0) {
          this.verificationSuccess2 = true;


            this.fromdate =  this.bookingdata.fromDate;
            const date = new Date(this.fromdate);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;
            //console.log(formattedDate);
            this.bookingdata.fromDate = formattedDate;

            if ( this.bookingdata.toDate !== null &&  this.bookingdata.toDate !== undefined) {
              this.Todate =  this.bookingdata.toDate;
              const date1 = new Date(this.Todate);
              const day1 = date1.getDate();
              const month1 = date1.toLocaleString('default', { month: 'long' });
              const year1 = date1.getFullYear();
              const formattedDate1 = `${day1} ${month1} ${year1}`;
              this.bookingdata.toDate = formattedDate1;
            }

        }

        if (this.bookingdata === null || this.bookingdata.bookingStatus === 'ENQUIRY') {
          this.nodatafound = true;
        } else {
          this.nodatafound = false;
          // Handle the case when bookings are found
        }

        //console.log("Bookings: " + JSON.stringify(this.bookingdata));
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }



    async getbookingsbyemail() {
      this.currentPage = 1;
      try {
        const data = await this.listing.findPropertiesByemail(this.email).toPromise();

        this.bookings = data.body;
        this.bookings.reverse();
        this.pageNumber = (this.bookings.length), (_, i) => `Item  ${i + 1}`;
        this.totalPagess = this.bookings.length;
        //console.log('page is',this.pageNumber);
        //console.log('total page is',this.totalPagess);
        this.updatePaginatedData();
        this.bookings.forEach(ele=>{
          this.cancelId = ele;
          //console.log('cancel is',this.cancelId);
        })


        if (this.bookings !== null && this.bookings !== undefined && this.bookings.length > 0) {
          this.verificationSuccess = true;

          this.bookings.forEach(async (element) => {
            this.fromdate = element.fromDate;
            const date = new Date(this.fromdate);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;
            //console.log(formattedDate);
            element.fromDate = formattedDate;

            if (element.toDate !== null && element.toDate !== undefined) {
              this.Todate = element.toDate;
              const date1 = new Date(this.Todate);
              const day1 = date1.getDate();
              const month1 = date1.toLocaleString('default', { month: 'long' });
              const year1 = date1.getFullYear();
              const formattedDate1 = `${day1} ${month1} ${year1}`;
              element.toDate = formattedDate1;
            }
          });
        }

        if (this.bookings.length === 0) {
          this.nodatafound = true;
        } else {
          this.nodatafound = false;
          // Handle the case when bookings are found
        }

        //console.log("Bookings: " + JSON.stringify(this.bookings));
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }


    async getbookingsbymobileNumber() {
      this.currentPage = 1
      try {
        const data = await this.listing.findPropertiesByMobilenumber( this.phoneNumber).toPromise();

        this.bookings = data.body;
        this.bookings.reverse();
        this.pageNumber = (this.bookings.length), (_, i) => `Item  ${i + 1}`;
        this.totalPagess = this.bookings.length;
        //console.log('page is',this.pageNumber);
        //console.log('total page is',this.totalPagess);
        this.updatePaginatedData();

        if (this.bookings !== null && this.bookings !== undefined && this.bookings.length > 0) {
          this.verificationSuccess = true;

          this.bookings.forEach(async (element) => {
            this.fromdate = element.fromDate;
            const date = new Date(this.fromdate);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;
            //console.log(formattedDate);
            element.fromDate = formattedDate;

            if (element.toDate !== null && element.toDate !== undefined) {
              this.Todate = element.toDate;
              const date1 = new Date(this.Todate);
              const day1 = date1.getDate();
              const month1 = date1.toLocaleString('default', { month: 'long' });
              const year1 = date1.getFullYear();
              const formattedDate1 = `${day1} ${month1} ${year1}`;
              element.toDate = formattedDate1;
            }
          });
        }

        if (this.bookings.length === 0) {
          this.nodatafound = true;
        } else {
          this.nodatafound = false;
          // Handle the case when bookings are found
        }

        //console.log("Bookings: " + JSON.stringify(this.bookings));
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }


    cancelBooking(id:number){
      this.cancelService.cancel(id).subscribe(res =>{
          //console.log('cancel is',res)
          this.bookingList();
              })
    }

    cancelBookings(id:number){
      this.cancelService.cancel(id).subscribe(res =>{
        //console.log('cancel is',res);
        this.getbookingsbybookingId();
            })
    }
}
