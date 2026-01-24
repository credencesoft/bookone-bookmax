import { LandingLayoutComponent } from './components/layouts/landing-layout/landing-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';



import { ScrollToDirective } from './directives/scroll-to.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderListingdetailsoneComponent } from '../views/landing/Header-Listingdetailsone/Header-Listingdetailsone.component';
import { FooterComponent } from '../views/landing/components/footer/footer.component';
import { HeaderComponent } from '../views/landing/components/header/header.component';
import { CallToActionComponent } from 'src/views/landing/components/call-to-action/call-to-action.component';
import { PrivacyComponent } from 'src/views/landing/components/privacy/privacy.component';
import { IntroEightComponent } from '../views/landing/components/intro-eight/intro-eight.component';
import { ContactFormComponent } from '../views/landing/components/contact-form/contact-form.component';
import { DynamicPricingComponent } from '../views/landing/components/dynamic-pricing/dynamic-pricing.component';
import { PricingFilterComponent } from '../views/landing/components/pricing-filter/pricing-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NguCarouselModule } from '@ngu/carousel';
import { SubscribeEmailComponent } from 'src/views/landing/components/subscribe-email/subscribe-email.component';
import { Intro2Component } from 'src/views/landing/components/intro2/intro2.component';
import { WhyBookoneComponent } from 'src/views/landing/components/why-bookone/why-bookone.component';
import { ServicesComponent } from 'src/views/landing/components/services/services.component';
import { FeaturesComponent } from 'src/views/landing/components/features/features.component';
import { OurFeaturesComponent } from 'src/views/landing/components/our-features/our-features.component';


const exportedClasses = [
  AuthLayoutComponent,
  HeaderListingdetailsoneComponent,
FooterComponent,
  HeaderComponent,
  CallToActionComponent,
  ScrollToDirective,
PrivacyComponent,
  LandingLayoutComponent,
IntroEightComponent,
ContactFormComponent,
DynamicPricingComponent,
PricingFilterComponent,
SubscribeEmailComponent,
Intro2Component,
WhyBookoneComponent,
ServicesComponent,
FeaturesComponent,
OurFeaturesComponent,

];


@NgModule({
    imports: [CommonModule,FormsModule, NguCarouselModule ,GooglePlaceModule,ReactiveFormsModule, NgbModule, RouterModule, ...exportedClasses],
    exports:[
    ...exportedClasses,
    CommonModule, // <--- Add this! This exports the 'number' pipe to everyone
    NgbModule,
    RouterModule
  ]
})
export class SharedModule {}
