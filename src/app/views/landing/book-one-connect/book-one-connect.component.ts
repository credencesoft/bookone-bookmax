import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { BlogPostService } from 'src/services/blog-post.service';

@Component({
  selector: 'app-book-one-connect',
  templateUrl: './book-one-connect.component.html',
  styleUrls: ['./book-one-connect.component.scss']
})
export class BookOneConnectComponent {
  backgroundColor: string;
  showCustomizer: boolean;
  constructor(private contentfulService: BlogPostService,
    private meta:Meta){
    this.meta.updateTag({name: 'description', content: "Indulge in a remarkable stay at BookOne PMS where exceptional comfort meets affordability."});



    // Facebook metadata
    this.meta.updateTag({property: 'og:title', content: 'BookOne Connect | BookonePMS'});
    this.meta.updateTag({property: 'og:site', content: '@AngularUniv'});
    this.meta.updateTag({property: 'og:title', content: "BookOne Connect | BookonePMS"});
    this.meta.updateTag({property: 'og:description', content: "BookOne connect a connectivity partner for hoteliers."});
    this.meta.updateTag({property: 'og:text:description', content:"dfghjkl"});
    this.meta.updateTag({property: 'og:image', content: 'https://bookonepms.com/assets/images/connect.jpg'})



    // Twitter metadata
    this.meta.updateTag({name: 'twitter:card', content: 'subha'});
    this.meta.updateTag({name: 'twitter:site', content: '@AngularUniv'});
    this.meta.updateTag({name: 'twitter:title', content: "BookOne Connect | BookonePMS"});
    this.meta.updateTag({name: 'twitter:description', content: "BookOne connect a connectivity partner for hoteliers."});
    this.meta.updateTag({name: 'twitter:text:description', content:"dfghjkl"});
    this.meta.updateTag({name: 'twitter:image', content: 'https://bookonepms.com/assets/images/connect.jpg'});
  }
  blogPosts$ : Observable<any> | undefined;

  ngOnInit() {
    this.blogPosts$ = this.contentfulService.getAllEntries();
    // console.log("xcvb"+JSON.stringify(this.blogPosts$ ))
  }

  changeBg(colorName) {
    this.backgroundColor = 'landing-' + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }

}
