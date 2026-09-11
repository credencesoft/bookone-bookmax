import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WPAPIService {
endpoint = 'https://blog.bookonepms.com/wp-json/wp/v2';
  constructor(private http: HttpClient) { }

  posts(query) {
    console.log('query ' + query);
    return this.http.get<Response>(`${this.endpoint}/posts?${query}&_embed=true`);
  }
  postDetails(query: string) {
    console.log('query ' + this.endpoint + '/posts?slug=' + query + '&_embed=true');
    return this.http.get<Response>(this.endpoint + '/posts?slug=' + query + '&_embed=true');
  }
  categories() {
    return this.http.get<Response>(this.endpoint + '/categories?');
  }
}
