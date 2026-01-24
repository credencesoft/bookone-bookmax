import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { FaqsComponent } from '../components/faqs/faqs.component';
import { TestimonialCauroselComponent } from '../components/testimonial-caurosel/testimonial-caurosel.component';
import { TeamComponent } from '../components/team/team.component';
import { PricingOneComponent } from '../components/pricing-one/pricing-one.component';
import { RightImageComponent } from '../components/right-image/right-image.component';
import { LeftImageComponent } from '../components/left-image/left-image.component';
import { BestComponent } from '../components/best/best.component';
import { Works1Component } from '../components/works1/works1.component';
import { ServicesCauroselComponent } from '../components/services-caurosel/services-caurosel.component';
import { FeaturesTwoComponent } from '../components/features-two/features-two.component';
import { IntroFiveComponent } from '../components/intro-five/intro-five.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-landing-v5',
    templateUrl: './landing-v5.component.html',
    styleUrls: ['./landing-v5.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, IntroFiveComponent, FeaturesTwoComponent, ServicesCauroselComponent, Works1Component, BestComponent, LeftImageComponent, RightImageComponent, PricingOneComponent, TeamComponent, TestimonialCauroselComponent, FaqsComponent, ContactFormComponent, FooterComponent]
})
export class LandingV5Component implements OnInit {


  backgroundColor = "landing-gradient-slight-ocean"
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
