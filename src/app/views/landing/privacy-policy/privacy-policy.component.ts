// import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CallToActionComponent } from 'src/views/landing/components/call-to-action/call-to-action.component';
import { FooterComponent } from 'src/views/landing/components/footer/footer.component';
import { HeaderComponent } from 'src/views/landing/components/header/header.component';
import { IntroEightComponent } from 'src/views/landing/components/intro-eight/intro-eight.component';
import { PrivacyComponent } from 'src/views/landing/components/privacy/privacy.component';


@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule,FooterComponent,CallToActionComponent,PrivacyComponent,IntroEightComponent,HeaderComponent] ,
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  pagename = 'Privacy Policy';
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
