import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-intro-eight',
  templateUrl: './intro-eight.component.html',
  styleUrls: ['./intro-eight.component.scss']
})
export class IntroEightComponent implements OnInit {
  pageName: string;
  pageSubTitle: string;
  constructor( public titleService: Title) { }

  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    this.pageName = appTitle;
    this.pageSubTitle = '';
  }

}
