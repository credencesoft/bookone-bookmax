import { LandingLayoutComponent } from './components/layouts/landing-layout/landing-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';



import { ScrollToDirective } from './directives/scroll-to.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NguCarouselModule } from '@ngu/carousel';
import { SubscribeEmailComponent } from 'src/views/landing/components/subscribe-email/subscribe-email.component';
import { Intro2Component } from 'src/views/landing/components/intro2/intro2.component';
import { WhyBookoneComponent } from 'src/views/landing/components/why-bookone/why-bookone.component';
import { ServicesComponent } from 'src/views/landing/components/services/services.component';
import { FeaturesComponent } from 'src/views/landing/components/features/features.component';
import { OurFeaturesComponent } from 'src/views/landing/components/our-features/our-features.component';
import { IntroElevenComponent } from 'src/views/landing/components/intro-eleven/intro-eleven.component';
import { WorksCarouselComponent } from 'src/views/landing/components/works-carousel/works-carousel.component';
import { BestComponent } from 'src/views/landing/components/best/best.component';
import { LeftImageComponent } from 'src/views/landing/components/left-image/left-image.component';
import { RightImageComponent } from 'src/views/landing/components/right-image/right-image.component';
import { PricingOneComponent } from 'src/views/landing/components/pricing-one/pricing-one.component';
import { TeamComponent } from 'src/views/landing/components/team/team.component';
import { TestimonialCauroselComponent } from 'src/views/landing/components/testimonial-caurosel/testimonial-caurosel.component';
import { NewsTwoComponent } from 'src/views/landing/components/news-two/news-two.component';
import { FaqsComponent } from '../views/landing/components/faqs/faqs.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { TestimonialComponent } from '../views/landing/components/testimonial/testimonial.component';
import { IntroSixComponent } from 'src/views/landing/components/intro-six/intro-six.component';
import { IntroFourComponent } from 'src/views/landing/components/intro-four/intro-four.component';
import { Works1Component } from 'src/views/landing/components/works1/works1.component';
import { ServicesCauroselComponent } from 'src/views/landing/components/services-caurosel/services-caurosel.component';
import { FeaturesTwoComponent } from 'src/views/landing/components/features-two/features-two.component';
import { IntroTenComponent } from 'src/views/landing/components/intro-ten/intro-ten.component';
import { IntroSevenComponent } from 'src/views/landing/components/intro-seven/intro-seven.component';
import { IntroFiveComponent } from 'src/views/landing/components/intro-five/intro-five.component';
import { IntroThreeComponent } from 'src/views/landing/components/intro-three/intro-three.component';
import { IntroNineComponent } from 'src/views/landing/components/intro-nine/intro-nine.component';
import { Intro1Component } from 'src/views/landing/components/intro1/intro1.component';
import { ContactDetailsComponent } from 'src/views/landing/components/contact-details/contact-details.component';
import { AboutCredencesoftComponent } from 'src/views/landing/components/about-credencesoft/about-credencesoft.component';
import { CheckoutModule } from 'paytm-blink-checkout-angular';
import { NewsComponent } from 'src/views/landing/components/news/news.component';


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
IntroElevenComponent,
WorksCarouselComponent,
BestComponent,
LeftImageComponent,
RightImageComponent,
PricingOneComponent,
TeamComponent,
TestimonialCauroselComponent,
NewsTwoComponent,
FaqsComponent,
TestimonialComponent,
IntroSixComponent,
IntroFourComponent,
Works1Component,
ServicesCauroselComponent,
FeaturesTwoComponent,
IntroTenComponent,
IntroSevenComponent,
IntroFiveComponent,
IntroThreeComponent,
IntroNineComponent,
Intro1Component,
ContactDetailsComponent,
AboutCredencesoftComponent,
NewsComponent
];


@NgModule({
    imports: [CommonModule,FormsModule, NguCarouselModule ,
      DialogModule,
    ToastModule,
      CheckoutModule,
    CalendarModule,ReactiveFormsModule, NgbModule, RouterModule, ...exportedClasses],
    exports:[
    ...exportedClasses,
    CommonModule, // <--- Add this! This exports the 'number' pipe to everyone
    NgbModule,
          DialogModule,
    ToastModule,
      NguCarouselModule,
    CalendarModule,
    RouterModule
  ]
})
export class SharedModule {}
