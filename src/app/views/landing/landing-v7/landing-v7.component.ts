import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-landing-v7',
  templateUrl: './landing-v7.component.html',
  styleUrls: ['./landing-v7.component.scss'],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV7Component implements OnInit {


  backgroundColor = "landing-gradient-purple-indigo"
  showCustomizer = false;
  constructor() { }

  ngOnInit() {
  }

  changeBg(colorName) {
    this.backgroundColor = "landing-" + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }

}
