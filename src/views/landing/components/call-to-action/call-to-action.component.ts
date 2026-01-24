import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-call-to-action',
    templateUrl: './call-to-action.component.html',
    styleUrls: ['./call-to-action.component.scss'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class CallToActionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
