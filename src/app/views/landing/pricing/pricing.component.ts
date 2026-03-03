import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {


  pagename = 'Pricing';
  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor(private meta:Meta) {
    this.meta.updateTag({name: 'description', content: "Indulge in a remarkable stay at BookOne PMS where exceptional comfort meets affordability."});



    // Facebook metadata
    this.meta.updateTag({property: 'og:title', content: 'Affordable Pricing Plans for BookOnePMS | BookonePMS'});
    this.meta.updateTag({property: 'og:site', content: '@AngularUniv'});
    this.meta.updateTag({property: 'og:title', content: "Affordable Pricing Plans for BookOnePMS | BookonePMS"});
    this.meta.updateTag({property: 'og:description', content: "Explore our range of flexible and budget-friendly pricing plans for BookOnePMS, tailored to suit your specific needs."});
    this.meta.updateTag({property: 'og:text:description', content:"dfghjkl"});
    this.meta.updateTag({property: 'og:image', content: 'https://bookonepms.com/assets/images/pricing.png'})



    // Twitter metadata
    this.meta.updateTag({name: 'twitter:card', content: 'subha'});
    this.meta.updateTag({name: 'twitter:site', content: '@AngularUniv'});
    this.meta.updateTag({name: 'twitter:title', content: "Affordable Pricing Plans for BookOnePMS | BookonePMS"});
    this.meta.updateTag({name: 'twitter:description', content: "Explore our range of flexible and budget-friendly pricing plans for BookOnePMS, tailored to suit your specific needs."});
    this.meta.updateTag({name: 'twitter:text:description', content:"dfghjkl"});
    this.meta.updateTag({name: 'twitter:image', content: 'https://bookonepms.com/assets/images/pricing.png'});



  }

  ngOnInit() {

  }

  changeBg(colorName) {
    this.backgroundColor = 'landing-' + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }

}
