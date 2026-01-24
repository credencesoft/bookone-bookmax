import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-blog-details-page',
  templateUrl: './blog-details-page.component.html',
  styleUrls: ['./blog-details-page.component.scss'],
  standalone:true,
  imports:[SharedModule]
})
export class BlogDetailsPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
