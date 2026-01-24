import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-intro-eleven',
    templateUrl: './intro-eleven.component.html',
    styleUrls: ['./intro-eleven.component.scss'],
    standalone: true,
    imports: [FormsModule]
})
export class IntroElevenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  submitForm(form: NgForm){

  }

}
