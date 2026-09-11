// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';

@Component({
  selector: 'app-intro-four',
  templateUrl: './intro-four.component.html',
  styleUrls: ['./intro-four.component.scss'],
  animations:[SharedAnimations]
})
export class IntroFourComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
