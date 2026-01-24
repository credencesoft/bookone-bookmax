import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';
import { RouterLink } from '@angular/router';
// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
    selector: 'app-intro-nine',
    templateUrl: './intro-nine.component.html',
    styleUrls: ['./intro-nine.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class IntroNineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
