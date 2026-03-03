// import { Review } from './../model/review';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { API_URL_IN, API_URL_NZ } from '../app.component';
import { TokenStorage } from '../token.storage';
import { environment } from 'src/environments/environment';
import { Review } from 'src/app/model/review';
import { GoogleReview } from 'src/app/model/googleReview';
import { API_URL_IN, API_URL_NZ } from 'src/app/app.component';
import { CustomerReview } from 'src/app/model/CustomerReview';
// import { GoogleReview } from '../model/googleReview';
// import { CustomerReview } from './CustomerReview';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  API_URL: string = environment.inAPIUrl;

  constructor(private http: HttpClient, private token: TokenStorage) {
    this.setApi();
  }

  setApi() {
    if (this.token.getCountry() === 'New Zealand') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'Fiji') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'Australia') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'Samoa') {
      this.API_URL = API_URL_NZ;
    } else if (this.token.getCountry() === 'India') {
      this.API_URL = API_URL_IN;
    } else {
      this.API_URL = API_URL_IN;
    }
  }
  getReviewFindByPropertyId(propertyId) {
    this.setApi();
    return this.http.get<Review[]>(
      this.API_URL + '/api/review/findByPropertyId/' + propertyId,
      { observe: 'response' }
    );
  }
  getReviewFindByPropertyIdAndReviewStatus(propertyId, reviewStatus) {
    this.setApi();
    return this.http.get<Review[]>(
      this.API_URL +
        '/api/review/findByPropertyId/' +
        propertyId +
        '/reviewStatus/' +
        reviewStatus,
      { observe: 'response' }
    );
  }
  getReviewFindByReviewStatus(reviewStatus) {
    this.setApi();
    return this.http.get<Review[]>(
      this.API_URL + '/api/review/findByReviewStatus/' + reviewStatus,
      { observe: 'response' }
    );
  }
  getAllReview(propertyId: number) {
    return this.http.get<GoogleReview[]>(this.API_URL+ '/api/property/getGoogleReviews?PropertyId=' + propertyId, { observe: 'response' });
  }

  postReview(review: CustomerReview) {
    return this.http.post<CustomerReview>(this.API_URL + '/api/review', review, { observe: 'response' });
  }

}
