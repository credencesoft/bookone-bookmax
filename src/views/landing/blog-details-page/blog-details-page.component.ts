import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { CallToActionComponent } from '../components/call-to-action/call-to-action.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
    selector: 'app-blog-details-page',
    templateUrl: './blog-details-page.component.html',
    styleUrls: ['./blog-details-page.component.scss'],
    standalone: true,
    imports: [HeaderComponent, CallToActionComponent, FooterComponent]
})
export class BlogDetailsPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
