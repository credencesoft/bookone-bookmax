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
import { OnboardingCouponcodeFormComponent } from 'src/app/views/landing/onboarding-couponcode-form/onboarding-couponcode-form.component';
import { OnboardingThankyouFormComponent } from 'src/app/views/landing/onboarding-thankyou-form/onboarding-thankyou-form.component';
import { OnboardingRoomdetailsFormComponent } from 'src/app/views/landing/onboarding-roomdetails-form/onboarding-roomdetails-form.component';
import { BookOneConnectComponent } from 'src/app/views/landing/book-one-connect/book-one-connect.component';
// import { BookingComponent } from 'src/app/views/landing/Booking/Booking.component';
// import { BookingComponent } from 'src/app/views/landing/Booking/Booking.component';

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
    component: OnboardingCouponcodeFormComponent,data: {title: 'Onboard | Bookone PMS'} },
  {
  path: 'onboardingCouponcode-form',component: OnboardingCouponcodeFormComponent,},
  {
    path: 'onboardingThankyou-form',component: OnboardingThankyouFormComponent,},
    {path: 'onboardingRoomdetails-form',component: OnboardingRoomdetailsFormComponent,},

  {
    path: 'pricing',
    component: PricingComponent, data: {title: 'Pricing | Bookone PMS'}
  },
  {
    path: 'company',
    component: CompanyComponent, data: {title: 'About Us | Bookone PMS'}
  },
  {
    path: 'blog',
    component: BlogComponent, data: {title: 'Blog | Bookone PMS'}
  },
  {
    path: 'blog/:id',
    component: BlogDetailsPageComponent
  },

  {
    path: 'contact',
    component: ContactComponent, data: {title: 'Contact Us | Bookone PMS'}
  },
  {
    path: 'faqs',
    component: FaqComponent, data: {title: 'FAQs | Bookone PMS'}
  },
  {
    path: 'book-one-connect',
    component: BookOneConnectComponent, data: {title: 'BookOne Connect | Bookone PMS'}
  },


  {
    path: 'privacy',
    component: PrivacyPolicyComponent, data: {title: 'Privacy Policy | Bookone PMS'}
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class LandingRoutingModule { }
