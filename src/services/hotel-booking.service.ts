// import { TokenStorage } from 'src/app/token.storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { API_URL_IN, API_URL_NZ, API_URL_PROMOTION, APP_ID } from 'src/app/app.component';
import { MessageDto } from 'src/app/model/MessageDto';
import { PropertyServiceDTO } from 'src/app/model/PropertyServices';
import { Booking } from 'src/app/model/booking';
import { Customer } from 'src/app/model/customer';
import { EnquiryDto } from 'src/app/model/enquiry';
import { Msg } from 'src/app/model/msg';
import { Payment } from 'src/app/model/payment';
import { Room } from 'src/app/model/room';
import { WhatsappDto } from 'src/app/model/whatsappDto';
import { environment } from 'src/environments/environment';
import { TokenStorage } from 'src/token.storage';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {
//   APP_ID,
//   API_URL_NZ,
//   API_URL_IN,
//   API_URL_PROMOTION,
// } from '../app.component';
// import { Room } from '../model/room';
// import { Booking } from '../model/booking';
// import { Msg } from '../model/msg';
// import { Payment } from '../model/payment';
// import { MessageDto } from '../model/MessageDto';
// import { Customer } from '../model/customer';
// import { PropertyServiceDTO } from '../model/PropertyServices';
// import { EnquiryDto } from '../model/enquiry';
// import { environment } from 'src/environments/environment';
// import { WhatsappDto } from '../model/whatsappDto';

@Injectable({
  providedIn: 'root',
})
export class HotelBookingService {
  API_URL: string;
  constructor(private http: HttpClient, private token: TokenStorage) {
    this.setApi();
    // this.API ="https://testapi.bookonelocal.co.nz/bookone-scheduler"
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
  authorisationToken(message: MessageDto) {
    this.setApi();
    let headers = new HttpHeaders({
      'APP_ID': APP_ID,
    });
    return this.http.post<MessageDto[]>(
      this.API_URL + '/api/message/authorisationToken',
      message,
      { headers: headers }
    );
  }
  send(message: MessageDto) {
    this.setApi();
    return this.http.post<MessageDto[]>(
      this.API_URL + '/api/message/send',
      message,
      { observe: 'response' }
    );
  }
  verifyAuthorisationToken(message: MessageDto) {
    this.setApi();
    let headers = new HttpHeaders({
      'APP_ID': APP_ID,
    });
    return this.http.post<MessageDto[]>(
      this.API_URL + '/api/message/verifyAuthorisationToken',
      message,
      { headers: headers }
    );
  }

  addServicesToBooking(services: PropertyServiceDTO[], bookingId: number) {
    this.setApi();
    return this.http.post<PropertyServiceDTO[]>(
      this.API_URL + '/api/website/add/services/' + bookingId,
      services,
      { observe: 'response' }
    );
  }
  findAllSuburbByCities(city: string) {
    return this.http.get<any[]>(this.API_URL + '/api/website/allSuburbByCities?city=' + city, { observe: 'response' });
  }
  getCustomerDetailsByEmail(email: string) {
    this.setApi();
    return this.http.get<Customer>(
      this.API_URL + '/api/website/email/' + email + '/',
      { observe: 'response' }
    );
  }
  getCustomerDetailsByMobile(mobile: string) {
    this.setApi();
    return this.http.get<Customer>(
      this.API_URL + '/api/website/mobile/' + mobile,
      { observe: 'response' }
    );
  }
  getBookingConfirmation(bookingId: string) {
    this.setApi();
    return this.http.get<Booking>(
      this.API_URL + '/api/website/confirm?BookingId=' + bookingId,
      { observe: 'response' }
    );
  }
  getRoomDetailsByPropertyId(propertyId: number) {
    this.setApi();
    return this.http.get<Room[]>(
      this.API_URL + '/api/website/findAllRoomsByPropertyId/' + propertyId,
      { observe: 'response' }
    );
  }
  createBooking(booking: Booking) {
    this.setApi();
    return this.http.post<Booking>(
      this.API_URL + '/api/website/booking',
      booking,
      { observe: 'response' }
    );
  }
  checkAvailability(booking: any) {
    return this.http.post<any>(
      this.API_URL + '/api/website/checkAvailability',
      booking,
      { observe: 'response' }
    );
  }
  checkAvailabilityByProperty(
    fromDate,
    toDate,
    noOfRooms,
    noOfPersons,
    propertyId
  ) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
      '/api/website/checkAvailability/' +
      propertyId +
      '?fromDate=' +
      fromDate +
      '&toDate=' +
      toDate +
      '&noOfRooms=' +
      noOfRooms +
      '&noOfPersons=' +
      noOfPersons,
      { observe: 'response' }
    );
  }
  getRoomDetailsByPropertyIdAndDate(
    propertyId: number,
    fromDate: string,
    toDate: string
  ) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL +
      '/api/website/getAllRoomsByDate?PropertyId=' +
      propertyId +
      '&FromDate=' +
      fromDate +
      '&ToDate=' +
      toDate,
      { observe: 'response' }
    );
  }
  sendTextMessage(message: Msg) {
    this.setApi();
    return this.http.post<Msg>(
      this.API_URL + '/api/website/message/send',
      message,
      { observe: 'response' }
    );
  }
  getBookingDetails(bookingNumber: number, bookingEmail: string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
      '/api/website/findBookingByIdAndEmail?BookingReferenceNumber=' +
      bookingNumber +
      '&BookingEmail=' +
      bookingEmail,
      { observe: 'response' }
    );
  }
  getBookingDetailsone(RefferenceNumber: string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
      '/api/website/findBookingByIdAndEmail?BookingReferenceNumber=' +
      RefferenceNumber,
      { observe: 'response' }
    );
  }
  getPlan(propertyId: string, roomId: string) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL +
      '/api/website/property/' +
      propertyId +
      '/room/' +
      roomId +
      '/roomPlan',
      { observe: 'response' }
    );
  }
  paymentIntent(paymentDetails: Payment) {
    return this.http.post<Payment>(
      this.API_URL + '/api/website/paymentIntent',
      paymentDetails,
      { observe: 'response' }
    );
  }
  processPayment(paymentDetails: Payment) {
    this.setApi();
    return this.http.post<Payment>(
      this.API_URL + '/api/website/processPayment',
      paymentDetails,
      { observe: 'response' }
    );
  }
  savePayment(paymentDetails: Payment) {
    this.setApi();
    return this.http.post<Payment>(
      this.API_URL + '/api/website/savePayment',
      paymentDetails,
      { observe: 'response' }
    );
  }
  getPaymentByReffId(ref: string) {
    this.setApi();
    return this.http.get<Payment[]>(
      this.API_URL +
      '/api/website/findPaymentByReferenceNumber/' + ref,
      { observe: 'response' }
    );
  }
  getOfferDetailsBySeoFriendlyName(seoName: string) {
    this.setApi();
    return this.http.get<any>(
      API_URL_PROMOTION + '/api/offer/findBySeofriendlyName/' + seoName + '/',
      { observe: 'response' }
    );
  }

  accommodationEnquiry(enquiry: EnquiryDto) {
    this.setApi();
    return this.http.post<EnquiryDto>(
      environment.apiLms + '/api/v1/accommodationEnquiry',
      enquiry,
      { observe: 'response' }
    );
  }

  emailEnquire(enquiry: EnquiryDto) {
    this.setApi();
    return this.http.post<EnquiryDto>(
      this.API_URL + '/api/email/enquire',
      enquiry,
      { observe: 'response' }
    );
  }
  whatsAppMsg(whatsappmsg: WhatsappDto) {
    this.setApi();
    return this.http.post<WhatsappDto>(
      environment.apiScheduler + '/api/whatsapp/sendMessage',
      whatsappmsg,
      { observe: 'response' }
    );
  }
}
