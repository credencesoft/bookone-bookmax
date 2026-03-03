import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {


  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor(private meta:Meta) {
    this.meta.updateTag({name: 'description', content: "Indulge in a remarkable stay at BookOne PMS where exceptional comfort meets affordability."});



    // Facebook metadata
    this.meta.updateTag({property: 'og:title', content: 'Frequently Asked Questions | BookOnePMS'});
    this.meta.updateTag({property: 'og:site', content: '@AngularUniv'});
    this.meta.updateTag({property: 'og:title', content: "Frequently Asked Questions | BookOnePMS"});
    this.meta.updateTag({property: 'og:description', content: "Find answers to the most commonly asked questions about BookOnePMS. Get detailed information on features, pricing, support, and more."});
    this.meta.updateTag({property: 'og:text:description', content:"dfghjkl"});
    this.meta.updateTag({property: 'og:image', content: 'https://bookonepms.com/assets/images/faqlogo.png'})



    // Twitter metadata
    this.meta.updateTag({name: 'twitter:card', content: 'subha'});
    this.meta.updateTag({name: 'twitter:site', content: '@AngularUniv'});
    this.meta.updateTag({name: 'twitter:title', content: "Frequently Asked Questions | BookOnePMS"});
    this.meta.updateTag({name: 'twitter:description', content: "Find answers to the most commonly asked questions about BookOnePMS. Get detailed information on features, pricing, support, and more."});
    this.meta.updateTag({name: 'twitter:text:description', content:"dfghjkl"});
    this.meta.updateTag({name: 'twitter:image', content: 'https://bookonepms.com/assets/images/faqlogo.png'});



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
