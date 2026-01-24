import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { CallToActionComponent } from '../components/call-to-action/call-to-action.component';
import { AboutCredencesoftComponent } from '../components/about-credencesoft/about-credencesoft.component';
import { IntroEightComponent } from '../components/intro-eight/intro-eight.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, IntroEightComponent, AboutCredencesoftComponent, CallToActionComponent, FooterComponent]
})
export class CompanyComponent implements OnInit {


  pagename = 'Company';

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
