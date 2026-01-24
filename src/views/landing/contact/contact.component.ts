import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { ContactDetailsComponent } from '../components/contact-details/contact-details.component';
import { IntroEightComponent } from '../components/intro-eight/intro-eight.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, IntroEightComponent, ContactDetailsComponent, ContactFormComponent, FooterComponent]
})
export class ContactComponent implements OnInit {

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
