import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { CallToActionComponent } from '../components/call-to-action/call-to-action.component';
import { PrivacyComponent } from '../components/privacy/privacy.component';
import { IntroEightComponent } from '../components/intro-eight/intro-eight.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, IntroEightComponent, PrivacyComponent, CallToActionComponent, FooterComponent]
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
