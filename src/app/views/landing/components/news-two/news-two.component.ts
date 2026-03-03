import { Component, OnInit, Input } from '@angular/core';
import { WpApiPosts } from 'wp-api-angular';
import { WPAPIService } from 'src/app/services/wpapi.service';

@Component({
  selector: 'app-news-two',
  templateUrl: './news-two.component.html',
  styleUrls: ['./news-two.component.scss']
})
export class NewsTwoComponent implements OnInit {
  @Input() token;

  posts: any = null;

  constructor(private wpApiService: WPAPIService) {
    // this.getPosts();
  }
  ngOnInit() {
    this.wpApiService.posts('per_page=3').subscribe(posts => {this.posts = posts;
      // console.log(this.posts);
    });
  }
  // getPosts() {
  //   this.wpApiPosts.getList()
  //   .toPromise()
  //   .then( response => {
  //     let json: any = response.json();
  //     this.posts = json;
  //     console.log(this.posts);
  //   });
  // }
  
}
