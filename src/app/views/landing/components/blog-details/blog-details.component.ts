import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import {map, take} from 'rxjs/operators';
import { WPAPIService } from 'src/app/services/wpapi.service';
// import { butterService } from 'src/app/services/butter-cms.service';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  @Input() token;
  posts: any = null;
  categories: any = null;

  // id: number;

  constructor(
    protected route: ActivatedRoute,
    private wpApi: WPAPIService
    ) {
      let id = this.route.snapshot.params['id'];
      this.route.params.subscribe(params => {
        id = params['id']; // (+) converts string 'id' to a number
       console.log('list detail page: ' + id);
      });
      this.get(id);
    }



  ngOnInit() {

    this.wpApi.categories().subscribe(categories => {this.categories = categories; console.log(this.categories); });

}
 get(id) {
    this.wpApi.postDetails(id).subscribe(posts =>  {this.posts = posts; });
  }
}
