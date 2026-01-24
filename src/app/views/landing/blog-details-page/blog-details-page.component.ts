import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDetailsComponent } from 'src/views/landing/components/blog-details/blog-details.component';

@Component({
  selector: 'app-blog-details-page',
  templateUrl: './blog-details-page.component.html',
  styleUrls: ['./blog-details-page.component.scss'],
  standalone:true,
  imports:[SharedModule,BlogDetailsComponent]
})
export class BlogDetailsPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
