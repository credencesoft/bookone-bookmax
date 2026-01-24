import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-intro-eleven',
  templateUrl: './intro-eleven.component.html',
  styleUrls: ['./intro-eleven.component.scss'],
  standalone:true,
  imports:[SharedModule]
})
export class IntroElevenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  submitForm(form: NgForm){

  }

}
