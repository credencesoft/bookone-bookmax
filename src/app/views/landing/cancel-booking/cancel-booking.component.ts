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
import { CancelServiceService } from '../cancel-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.css']
})
export class CancelBookingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) itemTable: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  bookings: Booking[] = [];
  bookingFilter: any;
  bookPaginator: MatPaginator;
  isOrgAdmin:boolean = false;
  
  dataSource = new MatTableDataSource();
  propertyId: number;
  @Input()
  businessUser:BusinessUser;
  bookingService: any;
  loader: boolean;
  dialogRef: any;
  


  

  constructor(private loginService:LandingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private token: TokenStorage,
    private route: ActivatedRoute,
  ) { }

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
    { externalSiteName: "Brevistay", logo: "https://bookonelocal.in/cdn/2024-06-04-054210675-download.jpg" },
    { externalSiteName: "EGlobe", logo: "https://bookonelocal.in/cdn/2024-06-04-060002163-eglobesolutions_logo.jpg" },
    { externalSiteName: "Yatradham", logo: "https://bookonelocal.in/cdn/2024-06-04-060704195-images.png" },
    { externalSiteName: "Trip.com", logo: "https://bookonelocal.in/cdn/2024-06-04-065129659-png-transparent-trip-com-train-travel-hotel-train-blue-text-service-removebg-preview.png" },
    { externalSiteName: "Thrillophilia", logo: "https://bookonelocal.in/cdn/2024-06-04-073813011-0x0.png" },


  ]


  ngOnInit() {
    this.businessUser = history.state.businessUser;
    
    this.propertyId = this.token.getProperty().id;
    this.bookingList();
    
  }

 
    bookingList(){
      this.bookings = [];
    this.loginService
      .getCurrentAndFutureBookings(this.propertyId)
      .subscribe((data) => {
        this.bookings = data.body;
        this.bookings.forEach((booking) => {
        console.log('booking is',this.bookings);
        });
        this.dataSource = new MatTableDataSource(this.bookings);
        this.dataSource.paginator = this.bookPaginator;
        this.dataSource.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
      });
    }



    cancel(row) {
      this.bookingService.cancel(row.id).subscribe(
        (response) => {
          if (response.status === 200) {
  
            this.openSuccessSnackBar(
              "Booking cancelled succcessfully"
            );
            // if (row.roomDetails != null && row.roomDetails != undefined && row.roomDetails.length > 0)
            // {
            //   this.roomRealese(row);
            // }
            this.createAuditReport(row);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 417) {
              this.loader = false;
              // this.openErrorSnackBar(
              //   'Cancellation Error,Please check booking status ,only confirmed booking can be cancelled'
              // );
  
              this.dialogRef.close({ event: "417" });
            }
          }
        }
      );
  

  

    
  
}createAuditReport(row: any) {
    throw new Error('Method not implemented.');
  }
  openSuccessSnackBar(arg0: string) {
    throw new Error('Method not implemented.');
  }}
