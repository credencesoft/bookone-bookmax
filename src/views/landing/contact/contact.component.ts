// import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactDetailsComponent } from 'src/app/views/landing/components/contact-details/contact-details.component';
import { ContactFormComponent } from 'src/app/views/landing/components/contact-form/contact-form.component';
import { FooterComponent } from 'src/app/views/landing/components/footer/footer.component';
import { HeaderComponent } from 'src/app/views/landing/components/header/header.component';
import { IntroEightComponent } from 'src/app/views/landing/components/intro-eight/intro-eight.component';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,FooterComponent,ContactFormComponent,ContactDetailsComponent,IntroEightComponent,HeaderComponent] ,
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
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
