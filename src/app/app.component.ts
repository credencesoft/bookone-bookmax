import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  token = null;
  title = 'BookOne PMS';
  constructor(private router: Router,
    public titleService: Title,
    private activatedRoute: ActivatedRoute,
   ) {}

  ngOnInit() {

    // this.course = this.route.snapshot.data['course'];
    // ....
    // SEO metadata
    // this.title.setTitle(this.course.description);


    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }
  // onActivate(event) {
  //   window.scroll(0, 0);
  // }
}
export const PARENTS_ORGANIZATION_ID = environment.parentOrganisationId;
// export const HOME_ADDRESS = environment.homeAddress;
export const API_URL = environment.apiUrl;
export const API_URL_LMS = environment.apiLms;


export const BUSINESS_TYPE_SOFTWARE_CONSULTING = "Software Consulting Services";
export const SUPER_ADMIN = "SUPER_ADMIN";
export const USER = "USER";
export const ORG_ADMIN = "ORG_ADMIN";
export const ORG_FINANCE = "ORG_FINANCE";
export const ORG_SALES = "ORG_SALES";
export const ORG_CUST_SUPPORT = "ORG_CUST_SUPPORT";
export const CUST_SUPPORT = "CUST_SUPPORT";
export const HOTEL_ADMIN = "PROP_ADMIN";
export const PROP_FO_EXECUTIVE = "PROP_FO_EXECUTIVE";
export const PROP_SERVICE_EXECUTIVE = "PROP_SERVICE_EXECUTIVE";
export const HOTEL_MANAGER = "PROP_MANAGER";
export const HOTEL_FRONTDESK = "PROP_FRONTDESK";
export const HOTEL_SERVICE = "PROP_SERVICE";
export const HOTEL_FINANCE = "PROP_FINANCE";
export const HOUSE_KEEPING = "PROP_HOUSEKEEPING";
export const HOTEL_MARKETING = "PROP_MARKETING";
export const SMS_SUBSCRIPTION = "SMS Subscription";
export const API_URL_NZ = environment.nzAPIUrl;
export const API_URL_IN = environment.inAPIUrl;
export const API_URL_PROMOTION = environment.apiUrlPromotion;
export const API_URL_ADDRESS = environment.apiUrlAddress;
export const APP_ID = environment.appId;
export const dashboardUrl = environment.dashboardUrl;
export const ANDROID_APP_URL = environment.androidAppUrl;
export const IOS_APP_URL = environment.iosAppUrl;
export const API_URL_IO  = environment.hdfcAPIUrl;
export const SMS_NUMBER = '+1 956 903 2629';
export const SMS_HOST = "SMS Host";
export const PAYMENT_LINK = "Payment Link";


// export const Version = environment.appVersion;
export const SESSION_APP_ID = environment.sessionAppId;
export const APP_ID_CUSTOMER = environment.appIdCustomer;

// Validations
export const PhoneNumberEXP = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
export const PasswordValidationEXP = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/;
export const EmailValidationEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NumberValidationEXP = /^\d+$/;
export const EMAIL_Expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
