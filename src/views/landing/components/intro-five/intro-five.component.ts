import { SharedAnimations } from './../../../../shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro-five',
    templateUrl: './intro-five.component.html',
    styleUrls: ['./intro-five.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class IntroFiveComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
