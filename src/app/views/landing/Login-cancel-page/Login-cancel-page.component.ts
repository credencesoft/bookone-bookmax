import { Component, Input, OnInit, Output } from '@angular/core';
import { BusinessUser } from 'src/app/model/user';
import { TokenStorage } from 'src/token.storage';

import {
  Router,
  ActivatedRoute,
  RouteConfigLoadStart,
  ResolveStart,
  ResolveEnd,
  RouteConfigLoadEnd,
  NavigationExtras,
} from "@angular/router";
// import { Location } from '@angular/common';
import { Property } from 'src/app/model/property';
import { CheckUserType } from 'src/app/model/checkUserType';
// import { HOME_ADDRESS } from 'src/app/app.component';
import { Logger } from 'src/services/logger.service';
import { Message } from 'src/app/model/message.model';
import { HTTPStatus } from 'src/app/app.interceptor';
import { Subscription } from "rxjs";
import { JwtAuthService } from 'src/app/auth/jwt-auth.service';
import { ApplicationUser } from './user';
import { Validators, UntypedFormControl, FormGroup, FormControl } from "@angular/forms";
import { UntypedFormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

const TOKEN_PREFIX = "Bearer ";

@Component({
  selector: 'app-Login-cancel-page',
  templateUrl: './Login-cancel-page.component.html',
  styleUrls: ['./Login-cancel-page.component.css']
})
export class LoginCancelPageComponent implements OnInit {
  emailt :UntypedFormControl = new UntypedFormControl();
  passwordd :UntypedFormControl = new UntypedFormControl();

  // email: string;
   returnUrl: string;

  emial:string;
  password: string;
  public isModuleLoading: Boolean = false;
  private moduleLoaderSub: Subscription;

  public model: ApplicationUser;
  msgs: Message[] = [];
  role: any = [];
  checkUserType: CheckUserType;
  headers: string[];
  loader = false;
  property: Property;
  // homeAddress: String;
  signinForm: FormGroup;
  businessUserdata:BusinessUser
  noOfRoomType: number = 0;
  contactEmail: string;
  contactMobile: string;
  // @Output()


  // businessUser : BusinessUser;

  @Input()
  businessUser:BusinessUser;
  showListingDetails: boolean = false;
  isdone: boolean=false;
  propertyname:string;
  businessEmail: string;


  toggleListingDetails() {
    this.showListingDetails = !this.showListingDetails;
    this.isdone = true;
    this.propertyname= this.propertyname;
    console.log('data is',this.businessUser);


  }
  constructor(
    // private location: Location,
 private router: Router,
    private jwtAuthService: JwtAuthService,

    private route: ActivatedRoute,

    private token: TokenStorage,
  ) {
    this.property = new Property();
    this.businessUserdata = new BusinessUser();
    this.model = new ApplicationUser();
    this.checkUserType = new CheckUserType();
    this.businessUserdata = this.token.getProperty();
    // this.homeAddress = HOME_ADDRESS;
   }

  ngOnInit() {
    // console.log('data is',JSON.stringify(this.businessUserdata));
    this.businessEmail = this.businessUserdata?.email;
    // console.log('data is one',this.businessEmail);

    // this.contactEmail = CONT_EMAIL;
    // this.contactMobile = const CONT_MOBILE;
    this.businessUser = history.state.businessUser;
// console.log("user is "+ JSON.stringify(this.businessUser))
    this.signinForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      rememberMe: new FormControl(true),
    });
    // FOR MODULE LOADER FLAG
    this.moduleLoaderSub = this.router.events.subscribe((event) => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof ResolveStart
      ) {
        this.isModuleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
    });
  }
  // goBack(): void {
  //   this.location.back();
  // }

  signIn() {
this.model.username = this.businessEmail;
    this.msgs = [];
    Logger.log("this.model : " + JSON.stringify(this.model));
    this.jwtAuthService.login(this.model).subscribe( response => {
      this.router.navigate([this.returnUrl || "/manage-property-details"],{ state: { businessUser: this.businessUser } });
    },
    (error) => {
        // Your existing error handling code
    });
}






cancel() {

  this.msgs = [];
  Logger.log("this.model : " + JSON.stringify(this.model));
  this.jwtAuthService.login(this.model).subscribe( response => {
    this.router.navigate([this.returnUrl || "/cancel-booking"],{ state: { businessUser: this.businessUser } });
  },
  (error) => {
      // Your existing error handling code
  });
}

  //       this.loader = false;
  //       if (
  //         response.body.property !== undefined &&
  //         response.body.property !== null &&
  //         response.body.property.propertyStatus != null &&
  //         response.body.property.propertyStatus != undefined &&
  //         response.body.property.propertyStatus === "INACTIVE"
  //       ) {
  //         this.msgs = [];
  //         this.msgs.push({
  //           severity: "error",
  //           summary:
  //             "Your current subscription has expired, please pay your subscription fee to reactive your account.",
  //         });
  //       } else {
  //         if (response.body && response.body.token && response.body.userId) {

  //           this.token.saveUserName(this.model.username);

  //           this.token.saveToken(TOKEN_PREFIX + response.body.token);
  //           this.token.saveUserId(response.body.userId);
  //           this.token.saveBusinessService(response.body.businessServiceDtos);
  //           this.token.saveRole(response.body.roles);
  //           if (response.body.organisationId != null) {
  //             this.token.saveOrganizationId(response.body.organisationId);
  //           } else {
  //             this.token.saveOrganizationId(0);
  //           }

  //           if (
  //             response.body.property !== undefined &&
  //             response.body.property !== null
  //           ) {

  //             this.token.saveRoomTypes(response.body.rooms);
  //             if (response.body.roles.length > 0) {
  //               response.body.roles.forEach((item, index) => {
  //                 if (this.checkUserType.isAdmin(item) == true) {
  //                   this.property.name = "ADMIN";
  //                   // this.property.imageUrl = DEFAULT_LOGO;
  //                   // this.token.saveProperty(this.property);

  //                   if (this.checkUserType.isHotelAdmin(item) == true) {
  //                     //   this.token.saveOnBoardingUserId(resp.body.userId);
  //                     this.token.savePropertyId(response.body.property.id);
  //                     this.token.saveProperty(response.body.property);
  //                   }
  //                 } else {
  //                   //    this.token.saveOnBoardingUserId(resp.body.userId);
  //                   this.token.savePropertyId(response.body.property.id);
  //                   this.token.saveProperty(response.body.property);
  //                 }
  //               });
  //             } else {
  //               //   this.token.saveOnBoardingUserId(resp.body.userId);
  //               this.token.saveProperty(response.body.property);
  //               this.token.savePropertyId(response.body.property.id);
  //             }
  //           } else {
  //             if (response.body.roles.length > 0) {
  //               response.body.roles.forEach((item, index) => {
  //                 if (this.checkUserType.isAdmin(item) == true) {
  //                   this.property.name = "ADMIN";
  //                 }
  //               });
  //             }
  //             // this.property.imageUrl = DEFAULT_LOGO;
  //             // this.token.saveProperty(this.property);
  //           }
  //           if (this.token.getRole() == "ORG_ADMIN") {
  //             this.router.navigate(["/bookone/su-dashboard"]);
  //           }
  //           this.loader = false;
  //         }
  //         const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
  //         this.router.navigate([returnUrl || "/login-details"]);


  //         if (
  //           this.token.getProperty().noOfRoomType != null &&
  //           this.token.getProperty().noOfRoomType != undefined
  //         ) {
  //           this.noOfRoomType = this.token.getProperty().noOfRoomType;
  //         } else {
  //           this.noOfRoomType = 1;
  //         }

  //         if (
  //           this.token.getProperty() != null &&
  //           this.token.getProperty().businessType !== undefined &&
  //           this.token.getProperty().businessType.toLocaleLowerCase() !==
  //             "accommodation"
  //         ) {
  //           if (this.token.getProperty().propertyStatus != "COMPLETED") {
  //             this.router.navigate([
  //               returnUrl || "/onboarding/on-boarding-property/0/0/0",
  //             ]);
  //           } else {
  //             if (this.token.getProperty().plan === "Business Starter") {
  //               this.router.navigate([
  //                 returnUrl || "/master-service/business-dashboard/profile",
  //               ]);
  //             } else {
  //               if(this.token.getProperty() != null &&
  //               this.token.getProperty().businessType !== undefined &&
  //               this.token.getProperty().businessType.toLocaleLowerCase() ==
  //                 "cafes" ||
  //                 this.token.getProperty() != null &&
  //                 this.token.getProperty().businessType !== undefined &&
  //                 this.token.getProperty().businessType.toLocaleLowerCase() ==
  //                   "restaurants")
  //               {
  //                 this.router.navigate([returnUrl || "/order/order-dashboard"]);
  //               }
  //               else
  //               {
  //                 this.router.navigate([returnUrl || "/master-service/home"]);
  //               }
  //             }
  //           }
  //         } else if (
  //           this.token.getProperty() != null &&
  //           this.token.getProperty().businessType !== undefined &&
  //           this.token.getProperty().businessType.toLocaleLowerCase() ==
  //             "accommodation"
  //         ) {
  //           if (this.token.getProperty().propertyStatus != "COMPLETED") {
  //             this.router.navigate([
  //               returnUrl || "/onboarding/on-boarding-property/0/0/0",
  //             ]);
  //           }
  //           // &&  this.token.getRoomTypes() != undefined &&  this.token.getRoomTypes().length < this.noOfRoomType
  //           else if (
  //             this.token.getProperty().propertyStatus === "COMPLETED" &&
  //             this.token.getRoomTypes() == null
  //           ) {
  //             this.router.navigate([returnUrl || "/onboarding/room"]);
  //           } else {
  //             this.router.navigate([returnUrl || "/bookone/dashboard"]);
  //           }
  //         } else {
  //           if (this.token.getRole() === "ORG_ADMIN") {
  //             this.router.navigate([returnUrl || "/bookone/org-dashboard"]);
  //           } else {
  //             this.router.navigate([returnUrl || "/bookone/su-dashboard"]);
  //           }
  //         }
  //       }
  //     },
  //     (error) => {
  //       if (error.status === 401) {
  //         this.msgs = [];
  //         this.msgs.push({
  //           severity: "error",
  //           summary: "Invalid Username or Password.",
  //         });
  //       } else {
  //         this.msgs.push({
  //           severity: "error",
  //           summary: "Please try again later.",
  //         });
  //       }
  //     }
  //   );
  // }


}


