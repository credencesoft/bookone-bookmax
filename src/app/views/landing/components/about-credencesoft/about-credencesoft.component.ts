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
    if (this.projectcount == 2500) {
      clearInterval(this.projectcountstop);
    }
  }, 20);
  accuratecountstop: any = setInterval(() => {
    this.accuratecount++;
    if (this.accuratecount == 200) {
      clearInterval(this.accuratecountstop);
    }
  }, 20);
  clientcountstop: any = setInterval(() => {
    this.clientcount++;
    if (this.clientcount == 12) {
      clearInterval(this.clientcountstop);
    }
  }, 10);
  customerfeedbackstop: any = setInterval(() => {
    this.customerfeedback++;
    if (this.customerfeedback == 2000) {
      clearInterval(this.customerfeedbackstop);
    }
  }, 20);
  constructor() {}

  ngOnInit() {}
}
