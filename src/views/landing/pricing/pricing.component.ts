import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { DynamicPricingComponent } from '../components/dynamic-pricing/dynamic-pricing.component';
import { PricingFilterComponent } from '../components/pricing-filter/pricing-filter.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, PricingFilterComponent, DynamicPricingComponent, ContactFormComponent, FooterComponent]
})
export class PricingComponent implements OnInit {


  pagename = 'Pricing';
  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor() { }

  ngOnInit() {
  }

  changeBg(colorName) {
    this.backgroundColor = 'landing-' + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }

}
