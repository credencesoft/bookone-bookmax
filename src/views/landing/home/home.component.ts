import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { SubscribeEmailComponent } from '../components/subscribe-email/subscribe-email.component';
import { CallToActionComponent } from '../components/call-to-action/call-to-action.component';
import { ServicesComponent } from '../components/services/services.component';
import { OurFeaturesComponent } from '../components/our-features/our-features.component';
import { FeaturesComponent } from '../components/features/features.component';
import { WhyBookoneComponent } from '../components/why-bookone/why-bookone.component';
import { Intro2Component } from '../components/intro2/intro2.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, Intro2Component, WhyBookoneComponent, FeaturesComponent, OurFeaturesComponent, ServicesComponent, CallToActionComponent, SubscribeEmailComponent, FooterComponent]
})
export class HomeComponent implements OnInit {


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
