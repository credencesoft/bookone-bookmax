import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-call-to-action',
  imports: [CommonModule] ,
  standalone: true,
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.scss']
})
export class CallToActionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
