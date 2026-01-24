import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro2',
    templateUrl: './intro2.component.html',
    styleUrls: ['./intro2.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class Intro2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
