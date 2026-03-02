import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/app.component';
import { Booking } from 'src/app/model/booking';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

constructor(private http: HttpClient) { }

getCurrentAndFutureBookings(propertyId: number) {
  return this.http.get<Booking[]>(
    API_URL + "/api/booking/getCurrentAndFutureBookings/" + propertyId,
    { observe: "response" }
  );
}

findByPropertyId(id: string) {
  return this.http.get<any>(API_URL + "/api/thm/findByPropertyId/" + id, {
    observe: "response",
  });
}

}
