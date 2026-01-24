import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-landing-v11',
  templateUrl: './landing-v11.component.html',
  styleUrls: ['./landing-v11.component.scss'],
  standalone:true,
  imports:[SharedModule]
})
export class LandingV11Component implements OnInit {


  backgroundColor = "landing-gradient-steel-gray"
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
