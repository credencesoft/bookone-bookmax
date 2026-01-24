import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-landing-v5',
  templateUrl: './landing-v5.component.html',
  styleUrls: ['./landing-v5.component.scss'],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV5Component implements OnInit {


  backgroundColor = "landing-gradient-slight-ocean"
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
