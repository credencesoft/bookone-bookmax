import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-credencesoft',
  templateUrl: './about-credencesoft.component.html',
  styleUrls: ['./about-credencesoft.component.scss'],
})
export class AboutCredencesoftComponent implements OnInit {
  projectcount: number = 0;
  accuratecount: number = 0;
  clientcount: number = 0;
  customerfeedback: number = 0;

  projectcountstop: any = setInterval(() => {
    this.projectcount++;
    if (this.projectcount == 1000) {
      clearInterval(this.projectcountstop);
    }
  }, 20);
  accuratecountstop: any = setInterval(() => {
    this.accuratecount++;
    if (this.accuratecount == 500) {
      clearInterval(this.accuratecountstop);
    }
  }, 20);
  clientcountstop: any = setInterval(() => {
    this.clientcount++;
    if (this.clientcount == 4) {
      clearInterval(this.clientcountstop);
    }
  }, 10);
  customerfeedbackstop: any = setInterval(() => {
    this.customerfeedback++;
    if (this.customerfeedback == 20) {
      clearInterval(this.customerfeedbackstop);
    }
  }, 20);
  constructor() {}

  ngOnInit() {}
}
