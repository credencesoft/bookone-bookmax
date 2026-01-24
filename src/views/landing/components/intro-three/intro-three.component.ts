// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro-three',
    templateUrl: './intro-three.component.html',
    styleUrls: ['./intro-three.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class IntroThreeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
