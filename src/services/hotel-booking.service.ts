import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL_BOOKONE, API_URL_IN, API_URL_IO, API_URL_NZ, API_URL_PROMOTION, APP_ID,API_URL_RECOMMEND } from "src/app/app.component";
import { MessageDto } from "src/app/model/MessageDto";
import { PropertyServiceDTO } from "src/app/model/PropertyServices";
import { Booking } from "src/app/model/booking";
import { Customer } from "src/app/model/customer";
import { EnquiryDto } from "src/app/model/enquiry";
import { externalReservationDtoList } from "src/app/model/externalReservation";
import { Msg } from "src/app/model/msg";
import { Payment } from "src/app/model/payment";
import { Room } from "src/app/model/room";
import { WhatsappDto } from "src/app/model/whatsappDto";
import { environment } from "src/environments/environment";
import { TokenStorage } from "src/token.storage";

export interface RecommendationPayload {
    noOfChildren: number;
    noOfAdults: number;
    noOfRooms: number;
    checkInDate: string;
    checkOutDate: string;
    roomList: Room[];
}
@Injectable({
  providedIn: 'root',
})

export class HotelBookingService {
  API_URL: string;
  apiUrlOne: string;
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
  getRecommendations(queryParams: {
    noOfChildren: number;
    noOfAdults: number;
    noOfRooms: number;
    checkInDate: string;
    checkOutDate: string;
  }, roomList: Room[]): Observable<any> {
    const params = new HttpParams()
      .set('noOfChildren', queryParams.noOfChildren)
      .set('noOfAdults', queryParams.noOfAdults)
      .set('noOfRooms', queryParams.noOfRooms)
      .set('checkInDate', queryParams.checkInDate)
      .set('checkOutDate', queryParams.checkOutDate);

    return this.http.post(API_URL_RECOMMEND + '/api/recommend', { roomList }, { params });
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
  getAllServicesByBooking(bookingId: number) {
    return this.http.get<PropertyServiceDTO[]>(
     this.API_URL + "/api/booking/findAllServices/" + bookingId,
      { observe: "response" }
    );
  }
  addServicesToBooking(services: PropertyServiceDTO[], bookingId: number) {
    this.setApi();
    return this.http.post<PropertyServiceDTO[]>(
      this.API_URL + '/api/thm/add/services/' + bookingId,
      services,
      { observe: 'response' }
    );
  }
  findAllSuburbByCities(city: string) {
    return this.http.get<any[]>(this.API_URL + '/api/thm/allSuburbByCities?city=' + city, { observe: 'response' });
  }
  getCustomerDetailsByEmail(email: string) {
    this.setApi();
    return this.http.get<Customer>(
      this.API_URL + '/api/thm/email/' + email + '/',
      { observe: 'response' }
    );
  }
  getCustomerDetailsByMobile(mobile: string) {
    this.setApi();
    return this.http.get<Customer>(
      this.API_URL + '/api/thm/mobile/' + mobile,
      { observe: 'response' }
    );
  }
  getBookingConfirmation(bookingId: string) {
    this.setApi();
    return this.http.get<Booking>(
      this.API_URL + '/api/thm/confirm?BookingId=' + bookingId,
      { observe: 'response' }
    );
  }
  getRoomDetailsByPropertyId(propertyId: number) {
    this.setApi();
    return this.http.get<Room[]>(
      this.API_URL + '/api/thm/findAllRoomsByPropertyId/' + propertyId,
      { observe: 'response' }
    );
  }
  createBooking(booking: Booking) {
    this.setApi();
    return this.http.post<Booking>(
      environment.apiUrl + '/api/thm/booking',
      booking,
      { observe: 'response' }
    );
  }

  saveBookingService(bookingId: number,planPropertyServicesList: PropertyServiceDTO[] ) {
    return this.http.post<Booking>(environment.apiUrl + "/api/booking/add/services/"+bookingId, planPropertyServicesList, {
      observe: "response",
    });
  }

  saveBookingServicePMS(bookingId: number,planPropertyServicesList: PropertyServiceDTO[] ) {
    return this.http.post<Booking>(environment.dashboardUrl + "/api/booking/add/services/"+bookingId, planPropertyServicesList, {
      observe: "response",
    });
  }

  externalReservation(externalReservation: externalReservationDtoList[]) {
    this.setApi();
    return this.http.post<any[]>(
      environment.channelIntegration+ '/api/external/reservation/',
      externalReservation,
      { observe: 'response' }
    );
  }

  findBooking(booking: Booking) {
    this.setApi();
    return this.http.post<Booking[]>(
      this.API_URL + '/api/website/findBookings',
      booking,
      { observe: 'response' }
    );
  }

  checkAvailability(booking: any) {
    return this.http.post<any>(
      this.API_URL + '/api/thm/checkAvailability',
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
      '/api/thm/checkAvailability/' +
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
      '/api/thm/getAllRoomsByDate?PropertyId=' +
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
      environment.apiUrlBookone + '/api/website/message/send',
      message,
      { observe: 'response' }
    );
  }
  getBookingDetails(bookingNumber: number, bookingEmail: string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
      '/api/thm/findBookingByIdAndEmail?BookingReferenceNumber=' +
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
      '/api/thm/findBookingByIdAndEmail?BookingReferenceNumber=' +
      RefferenceNumber,
      { observe: 'response' }
    );
  }
  getPlan(propertyId: string, roomId: string) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL +
      '/api/thm/property/' +
      propertyId +
      '/room/' +
      roomId +
      '/roomPlan',
      { observe: 'response' }
    );
  }
  paymentIntent(paymentDetails: Payment) {
    return this.http.post<Payment>(
      "https://api.thehotelmate.co" + '/api/thm/paymentIntent',
      paymentDetails,
      { observe: 'response' }
    );
  }
  paymentIntentHdfc(paymentDetails: Payment) {
    return this.http.post<Payment>(
      API_URL_IO  + '/hdfc/api/hdfc/paymentIntent',
      paymentDetails,
      { observe: 'response' }
    );
  }
  paymentIntentPhonepe(paymentDetails: Payment) {
    return this.http.post<Payment>(
      'https://phonepe.bookonepms.com/api/phonepe/paymentIntent',
      paymentDetails,
      { observe: 'response' }
    );
  }
  paymentIntentRayzorpay(paymentDetails: Payment) {
    return this.http.post<Payment>(
      'https://razorpay.bookonepms.com/api/razorpay/paymentIntentHotelmate',
      paymentDetails,
      { observe: 'response' }
    );
  }
  processPayment(paymentDetails: Payment) {
    this.setApi();
    return this.http.post<Payment>(
      "https://api.thehotelmate.co" + '/api/thm/processPayment',
      paymentDetails,
      { observe: 'response' }
    );
  }
  savePayment(paymentDetails: Payment) {
    this.setApi();
    return this.http.post<Payment>(
      this.API_URL + '/api/thm/savePayment',
      paymentDetails,
      { observe: 'response' }
    );
  }

  savePaymentOne(paymentDetails: Payment) {
    this.setApi();
    return this.http.post<Payment>(
      API_URL_BOOKONE + '/api/website/savePayment',
      paymentDetails,
      { observe: 'response' }
    );
  }


  getPaymentByReffId(ref: string) {
    this.setApi();
    return this.http.get<Payment[]>(
      this.API_URL +
      '/api/thm/findPaymentByReferenceNumber/' + ref,
      { observe: 'response' }
    );
  }

  getPaymentByReffIdOne(ref: any) {
    this.setApi();
    return this.http.get<any>(
      API_URL_BOOKONE +
      '/api/website/findByExternalBookingID?ExternalBookingId='+ ref,
      { observe: 'response' }
    );
  }


  getPaymentByReffIdTwo(ref: string) {
    this.setApi();
    return this.http.get<Payment[]>(
      API_URL_BOOKONE +
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
      environment.apiUrlBookone + '/api/email/enquire',
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

  checkOutStandingAmountByBookingId(bookingId) {
    return this.http.get<any>(
      environment.apiUrl + "/api/booking/calculateOutstandingAmount/" + bookingId,
      { observe: "response" }
    );
  }
  getSubscriptions(propertyId:number){
    return this.http.get<Booking[]>(
      environment.inAPIUrl + "/api/thm/" + propertyId + "/subscriptions",
      { observe: "response" }
    )
  }
}
