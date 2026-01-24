// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro-ten',
    templateUrl: './intro-ten.component.html',
    styleUrls: ['./intro-ten.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class IntroTenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
