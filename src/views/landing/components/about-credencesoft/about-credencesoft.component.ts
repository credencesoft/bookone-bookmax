import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-credencesoft',
  templateUrl: './about-credencesoft.component.html',
  styleUrls: ['./about-credencesoft.component.scss']
})
export class AboutCredencesoftComponent implements OnInit {

  numberOfProperties: number = 100; // Replace with your actual data
  numberOfOTAs: number = 10; // Replace with your actual data
  numberOfRooms: number = 500; // Replace with your actual data
  numberOfSubscriptions: number = 50; // Replace with your actual data
  numberOfSpecialFeatures: number = 25; // Replace with your actual data
  constructor() { }

  ngOnInit() {
  }

}
