// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro-seven',
    templateUrl: './intro-seven.component.html',
    styleUrls: ['./intro-seven.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class IntroSevenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
