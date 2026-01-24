import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { CallToActionComponent } from '../components/call-to-action/call-to-action.component';
import { IntroEightComponent } from '../components/intro-eight/intro-eight.component';
import { HeaderComponent } from '../components/header/header.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    standalone: true,
    imports: [NgClass, HeaderComponent, IntroEightComponent, CallToActionComponent, FooterComponent]
})
export class BlogComponent implements OnInit {


  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor() {
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
