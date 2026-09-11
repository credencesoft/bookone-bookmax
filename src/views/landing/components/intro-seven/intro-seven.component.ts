// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';

@Component({
  selector: 'app-intro-seven',
  templateUrl: './intro-seven.component.html',
  styleUrls: ['./intro-seven.component.scss'],
  animations:[SharedAnimations]
})
export class IntroSevenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
