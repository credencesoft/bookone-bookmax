import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-landing-layout',
    templateUrl: './landing-layout.component.html',
    styleUrls: ['./landing-layout.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class LandingLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
