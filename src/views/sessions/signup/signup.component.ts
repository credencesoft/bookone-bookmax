import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';
import { RouterLink } from '@angular/router';
// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
