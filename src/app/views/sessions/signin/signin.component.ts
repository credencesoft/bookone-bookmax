import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class SigninComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
