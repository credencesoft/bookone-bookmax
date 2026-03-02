import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  pagename = 'Blog';

  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;
  constructor( private meta:Meta) {
    this.updatetag();

   }

  ngOnInit() {
  }
  updatetag(){
    this.meta.updateTag({name: 'description', content: "Escape to Bookone PMS, where modern comfort meets traditional hospitality. Experience cozy rooms, local cuisine, and a welcoming atmosphere in the heart of Bhubaneswar."});

    // Facebook metadata
    this.meta.updateTag({property: 'og:title', content: 'Insights, Tips, and News from BookOnePMS | BookonePMS'});
    this.meta.updateTag({property: 'og:site', content: '@AngularUniv'});
    this.meta.updateTag({property: 'og:title', content: "Insights, Tips, and News from BookOnePMS | BookonePMS"});
    this.meta.updateTag({property: 'og:description', content: "Stay updated with the latest industry insights, valuable tips, and news related to property management. Explore our informative blog articles from BookOnePMS."});
    this.meta.updateTag({property: 'og:text:description', content:"dfghjkl"});
    this.meta.updateTag({property: 'og:image', content: 'https://bookonepms.com/assets/images/bloglogo.png'})



    // Twitter metadata
    this.meta.updateTag({name: 'twitter:card', content: 'BookonePMS Blog'});
    this.meta.updateTag({name: 'twitter:site', content: '@AngularUniv'});
    this.meta.updateTag({name: 'twitter:title', content: "Insights, Tips, and News from BookOnePMS | BookonePMS"});
    this.meta.updateTag({name: 'twitter:description', content: "Stay updated with the latest industry insights, valuable tips, and news related to property management. Explore our informative blog articles from BookOnePMS."});
    this.meta.updateTag({name: 'twitter:text:description', content:"dfghjkl"});
    this.meta.updateTag({name: 'twitter:image', content: 'https://bookonepms.com/assets/images/bloglogo.png'});
  }

  changeBg(colorName) {
    this.backgroundColor = 'landing-' + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }

}
