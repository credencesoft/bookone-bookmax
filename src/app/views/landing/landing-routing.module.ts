import { NgModule } from '@angular/core';
import { BlogDetailsPageComponent } from './blog-details-page/blog-details-page.component';
import { LandingV4Component } from './landing-v4/landing-v4.component';
import { LandingV2Component } from './landing-v2/landing-v2.component';

import { Routes, RouterModule } from '@angular/router';
import { LandingV1Component } from './landing-v1/landing-v1.component';
import { LandingV3Component } from './landing-v3/landing-v3.component';
import { LandingV5Component } from './landing-v5/landing-v5.component';
import { LandingV6Component } from './landing-v6/landing-v6.component';
import { LandingV7Component } from './landing-v7/landing-v7.component';
import { LandingV8Component } from './landing-v8/landing-v8.component';
import { LandingV9Component } from './landing-v9/landing-v9.component';
import { LandingV10Component } from './landing-v10/landing-v10.component';
import { DemosComponent } from './components/demos/demos.component';
import { LandingV11Component } from './landing-v11/landing-v11.component';
import { HomeComponent } from './home/home.component';
import { PricingComponent } from './pricing/pricing.component';
import { CompanyComponent } from './company/company.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { OnboardingCouponcodeFormComponent } from './onboarding-couponcode-form/onboarding-couponcode-form.component';
import { OnboardingThankyouFormComponent } from './onboarding-thankyou-form/onboarding-thankyou-form.component';
import { OnboardingRoomdetailsFormComponent } from './onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { OnboardingformSubmittedFormComponent } from './onboardingform-submitted-form/onboardingform-submitted-form.component';
import { BookOneConnectComponent } from './book-one-connect/book-one-connect.component';
import { ListingDetailOneComponent } from './ListingDetailOne/ListingDetailOne.component';
import { BookingComponent } from './Booking/Booking.component';
import { LoginCancelPageComponent } from './Login-cancel-page/Login-cancel-page.component';
import { LoginDetailsComponent } from './login-details/login-details.component';
import { ManageBookingsComponent } from './Manage-Bookings/Manage-Bookings.component';
import { ManageEnquiryComponent } from './manage-enquiry/manage-enquiry.component';
import { ConfirmBookingComponent } from './Confirm-Booking/Confirm-Booking.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';
import { NotificationHandlingComponent } from './notification-handling/notification-handling.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BookingCompleteComponent } from './booking-complete/booking-complete.component';
// import { BookingComponent } from './Booking/Booking.component';
const routes: Routes = [
  {
    path: 'v1',
    component: LandingV1Component
  },
  {
    path: 'v2',
    component: LandingV2Component
  },
  {
    path: 'v3',
    component: LandingV3Component
  },
  {
    path: 'v4',
    component: LandingV4Component
  },
  {
    path: 'v5',
    component: LandingV5Component
  },
  {
    path: 'v6',
    component: LandingV6Component
  }
  ,
  {
    path: 'v7',
    component: LandingV7Component
  },

   {
    path: 'v8',
    component: LandingV8Component
  },

  {
    path: 'v9',
    component: LandingV9Component
  },

  {
    path: 'v10',
    component: LandingV10Component
  },
  {
    path: 'v11',
    component: LandingV11Component
  },
  {
    path: 'manage-property',
    component: LoginCancelPageComponent
  },
  {
    path:'manage-property-details',
    component:LoginDetailsComponent
  },
  {
    path:'cancel-booking',
    component:CancelBookingComponent
  },
  {
    path:'manage-bookings',
    component:ManageBookingsComponent
  },
  {
    path:'manage-enuiry',
    component:ManageEnquiryComponent
  },
  {
    path:'Confirm-Booking',
    component:ConfirmBookingComponent
  },

  // {
  //   path: 'blog-details',
  //   component: BlogDetailsPageComponent
  // },
   {
    path: 'demos',
    component: DemosComponent
  }
  ,
  {
    path: 'home',
    component: HomeComponent, data: {title: 'Home | Bookone PMS'}
  },
  {
    path: 'onboard',
    component: OnboardingCouponcodeFormComponent, data: {title: 'onboard'}
  },
  {
    path: 'history',component: NotificationHandlingComponent,},
    {
      path: 'booking-complete',
      component: BookingCompleteComponent,
    },
    {
      path: 'manage-enquiry',component: EnquiryComponent,},
      {
        path: 'checkout',component: CheckoutComponent,},
  {
  path: 'onboardingCouponcode-form',component: OnboardingCouponcodeFormComponent,},
  {
    path: 'onboardingThankyou-form',component: OnboardingThankyouFormComponent,},
    {path: 'onboardingRoomdetails-form',component: OnboardingRoomdetailsFormComponent,},
  {
    path: 'pricing',
    component: PricingComponent, data: {title: 'Pricing'}
  },
  {
    path: 'submitted-form',
    component: OnboardingformSubmittedFormComponent,
  },
  {
    path: 'company',
    component: CompanyComponent, data: {title: 'About Us'}
  },
  {
    path: 'blog',
    component: BlogComponent, data: {title: 'Blog'}
  },
  {
    path: 'blog/:id',
    component: BlogDetailsPageComponent
  },
  {
    path: 'contact',
    component: ContactComponent, data: {title: 'Contact Us'}
  },
  {
    path: 'faqs',
    component: FaqComponent, data: {title: 'FAQs'}
  },
  {
    path: 'bookoneconnect',
    component: BookOneConnectComponent, data: {title: 'BookOne Connect'}
  },
  {
    path: 'booking',
    component: BookingComponent, data: {title: 'booking'}
  },
  {
    path: ":detail",
    component: ListingDetailOneComponent,
  },
  {
    path: "detail/bookingSource/:id",
    component: ListingDetailOneComponent,
  },

  {
    path: 'detail',
    component: ListingDetailOneComponent, data: {title: 'detail'}
  },

  {
    path: 'listing-one',
    component: ListingDetailOneComponent, data: {title: 'BookOne Connect'}
  },


  {
    path: 'privacy',
    component: PrivacyPolicyComponent, data: {title: 'Privacy Policy'}
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
