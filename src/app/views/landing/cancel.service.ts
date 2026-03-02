import { Injectable } from '@angular/core';
import { API_URL, API_URL_LMS } from 'src/app/app.component';
import { Booking } from 'src/app/model/booking';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CancelService {


constructor(private http: HttpClient) { }


cancel(bookingId: number) {
  return this.http.get<Booking>(
    API_URL + "/api/booking/cancel/" + bookingId,
    { observe: "response" }
  );
}

enquiryStatusVoid(id : number) {
  return this.http.get<Booking>(API_URL_LMS + '/api/v1/accommodationEnquiry/enquiryId/'+id+'/status/Void', { observe: 'response' });
}

}
