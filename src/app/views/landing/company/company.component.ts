import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {


  pagename = 'Company';

  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor( private meta:Meta) {
    this.meta.updateTag({name: 'description', content: "Escape to Bookone PMS, where modern comfort meets traditional hospitality. Experience cozy rooms, local cuisine, and a welcoming atmosphere in the heart of Bhubaneswar."});




    // Facebook metadata
    this.meta.updateTag({property: 'og:title', content: 'About BookOnePMS - Your Trusted Property Management Solution | BookonePMS'});
    this.meta.updateTag({property: 'og:site', content: '@AngularUniv'});
    this.meta.updateTag({property: 'og:title', content: "About BookOnePMS - Your Trusted Property Management Solution | BookonePMS"});
    this.meta.updateTag({property: 'og:description', content: "Learn about BookOnePMS, a leading property management solution provider, dedicated to streamlining operations and maximizing profits for property owners and managers."});
    this.meta.updateTag({property: 'og:text:description', content:"dfghjkl"});
    this.meta.updateTag({property: 'og:image', content: 'https://bookonepms.com/assets/images/landing/lOGO_d/logo_white.png'})


    // Twitter metadata
    this.meta.updateTag({name: 'twitter:card', content: 'About BookOnePMS - Your Trusted Property Management Solution | BookonePMS'});
    this.meta.updateTag({name: 'twitter:site', content: '@AngularUniv'});
    this.meta.updateTag({name: 'twitter:title', content: "About BookOnePMS - Your Trusted Property Management Solution | BookonePMS"});
    this.meta.updateTag({name: 'twitter:description', content: "Learn about BookOnePMS, a leading property management solution provider, dedicated to streamlining operations and maximizing profits for property owners and managers."});
    this.meta.updateTag({name: 'twitter:text:description', content:"dfghjkl"});
    this.meta.updateTag({name: 'twitter:image', content: 'https://bookonepms.com/assets/images/landing/lOGO_d/logo_white.png'});

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
