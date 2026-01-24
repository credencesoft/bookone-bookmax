import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-landing-v3',
  templateUrl: './landing-v3.component.html',
  styleUrls: ['./landing-v3.component.scss'],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV3Component implements OnInit {


  backgroundColor = "landing-gradient-meridian"
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
