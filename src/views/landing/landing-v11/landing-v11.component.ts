import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { FaqsComponent } from '../components/faqs/faqs.component';
import { TestimonialComponent } from '../components/testimonial/testimonial.component';
import { TeamComponent } from '../components/team/team.component';
import { PricingOneComponent } from '../components/pricing-one/pricing-one.component';
import { RightImageComponent } from '../components/right-image/right-image.component';
import { LeftImageComponent } from '../components/left-image/left-image.component';
import { BestComponent } from '../components/best/best.component';
import { WorksCarouselComponent } from '../components/works-carousel/works-carousel.component';
import { ServicesComponent } from '../components/services/services.component';
import { FeaturesComponent } from '../components/features/features.component';
import { IntroElevenComponent } from '../components/intro-eleven/intro-eleven.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-landing-v11',
    templateUrl: './landing-v11.component.html',
    styleUrls: ['./landing-v11.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, IntroElevenComponent, FeaturesComponent, ServicesComponent, WorksCarouselComponent, BestComponent, LeftImageComponent, RightImageComponent, PricingOneComponent, TeamComponent, TestimonialComponent, FaqsComponent, ContactFormComponent, FooterComponent]
})
export class LandingV11Component implements OnInit {


  backgroundColor = "landing-gradient-steel-gray"
  showCustomizer = false;
  constructor() { }

  ngOnInit() {
  }

  changeBg(colorName) {
    this.backgroundColor = "landing-" + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }

}
