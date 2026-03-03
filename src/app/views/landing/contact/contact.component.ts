import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  pagename = 'Contact';
  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor(private meta:Meta) {
   this.updateTag();


  }


  ngOnInit() {
  }

  updateTag(){
    this.meta.updateTag({name: 'description', content: "Indulge in a remarkable stay at BookOne PMS where exceptional comfort meets affordability."});



    // Facebook metadata
    this.meta.updateTag({property: 'og:title', content: 'Get in Touch with BookOnePMS | BookonePMS'});
    this.meta.updateTag({property: 'og:site', content: '@AngularUniv'});
    this.meta.updateTag({property: 'og:title', content: "Get in Touch with BookOnePMS | BookonePMS"});
    this.meta.updateTag({property: 'og:description', content: "Have questions or need assistance? Contact the BookOnePMS team for expert support and solutions tailored to your property management needs."});
    this.meta.updateTag({property: 'og:text:description', content:"dfghjkl"});
    this.meta.updateTag({property: 'og:image:width', content: '1200'}),
    this.meta.updateTag({property: 'og:image:height', content: '630'}),
   this.meta.updateTag({property: 'og:image', content: 'https://bookonepms.com/assets/images/contactlogo.png'})



    // Twitter metadata
    this.meta.updateTag({name: 'twitter:card', content: 'subha'});
    this.meta.updateTag({name: 'twitter:site', content: '@AngularUniv'});
    this.meta.updateTag({name: 'twitter:title', content: "Get in Touch with BookOnePMS | BookonePMS"});
    this.meta.updateTag({name: 'twitter:description', content: "Have questions or need assistance? Contact the BookOnePMS team for expert support and solutions tailored to your property management needs."});
    this.meta.updateTag({name: 'twitter:text:description', content:"dfghjkl"});
    this.meta.updateTag({name: 'twitter:image', content: 'https://bookonepms.com/assets/images/contactlogo.png'});

  }
  changeBg(colorName) {
    this.backgroundColor = 'landing-' + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }
}
