import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone:true,
  imports:[SharedModule]
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
