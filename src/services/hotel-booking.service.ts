import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL_BOOKONE, API_URL_IN, API_URL_IO, API_URL_NZ, API_URL_PROMOTION, APP_ID,API_URL_RECOMMEND, PAYU_URL } from "src/app/app.component";
import { MessageDto } from "src/app/model/MessageDto";
import { BookingCommand } from "src/app/model/booking-command";
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

    return this.http.post(API_URL_RECOMMEND + '/api/recommendation', { roomList }, { params });
  }
sendBookingEmailToCustomer(bookingId: number): Observable<any> {
  const url = this.API_URL + `/api/thm/bookingEmailToCustomer?bookingId=${bookingId}`;
  return this.http.get(url);
}

  send(message: MessageDto) {
    this.setApi();
    return this.http.post<MessageDto[]>(
      this.API_URL + '/api/message/send',
      message,
      { observe: 'response' }
    );
  }
    saveEnquireTHM(booking: Booking) {
    return this.http.post<Booking>(this.API_URL + "/api/booking/enquire", booking, {
      observe: "response",
    });
  }
generateBookingVoucher(bookingId: number): Observable<any> {
  return this.http.get<any>(`${this.API_URL}/api/thm/generateBookingVoucher?bookingId=${bookingId}`);
}
downloadVoucher(fileUrl: string) {
  const apiUrl = `${this.API_URL}/api/thm/downloadPdf?fileUrl=${encodeURIComponent(fileUrl)}`;
  return this.http.get(apiUrl, { responseType: 'blob' });
}
fetchBookingById(bookingId: number) {
  const url = `${environment.apiUrl}/api/booking/findById?BookingId=${bookingId}`;
    return this.http.get<any>(url);
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

  createBookingCommand(command: BookingCommand) {
    this.setApi();
    return this.http.post<Booking>(
      environment.apiUrl + '/api/thm/booking/command',
      command,
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
      environment.apiUrl + '/api/thm/paymentIntent',
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
      environment.phonepeUrl + '/api/phonepe/paymentIntent',
      paymentDetails,
      { observe: 'response' }
    );
  }
  paymentIntentRayzorpay(paymentDetails: Payment) {
    return this.http.post<Payment>(
      environment.razorPay + '/api/razorpay/paymentIntentHotelmate',
      paymentDetails,
      { observe: 'response' }
    );
  }
  processPayment(paymentDetails: Payment) {
    this.setApi();
    return this.http.post<Payment>(
      environment.apiUrl + '/api/thm/processPayment',
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
    const enrichedEnquiry = this.enrichEnquiryWithServiceSnapshot(enquiry);
    return this.http.post<EnquiryDto>(
      environment.apiLms + '/api/v1/accommodationEnquiry',
      enrichedEnquiry,
      { observe: 'response' }
    );
  }

  private enrichEnquiryWithServiceSnapshot(enquiry: EnquiryDto): EnquiryDto {
    const selectedServices = this.getPersistedSelectedServices();
    if (!selectedServices || selectedServices.length === 0) {
      enquiry.selectedServiceCount = 0;
      enquiry.selectedServiceTotal = 0;
      enquiry.serviceQuoteSummary = '[]';
      enquiry.quotedGrandTotal = enquiry.totalAmount || 0;
      enquiry.quotedPayableAmount = enquiry.payableAmount || enquiry.totalAmount || 0;
      return enquiry;
    }

    const selectedServiceTotal = selectedServices.reduce((total, service) => {
      const serviceAmount =
        service?.afterTaxAmount ?? service?.netAmount ?? service?.servicePrice ?? 0;
      return total + Number(serviceAmount || 0);
    }, 0);

    enquiry.selectedServiceCount = selectedServices.length;
    enquiry.selectedServiceTotal = Number(selectedServiceTotal.toFixed(2));
    enquiry.serviceQuoteSummary = JSON.stringify(
      selectedServices.map((service) => ({
        id: service?.id ?? null,
        organisationId: service?.organisationId ?? null,
        productId: service?.productId ?? null,
        productVariationId: service?.productVariationId ?? null,
        name: service?.name ?? null,
        description: service?.description ?? null,
        serviceType: service?.serviceType ?? null,
        quantity: service?.quantity ?? service?.count ?? 1,
        count: service?.count ?? service?.quantity ?? 1,
        quantityApplied: service?.quantityApplied ?? service?.quantity ?? service?.count ?? 1,
        capacityPerUnitApplied: service?.capacityPerUnitApplied ?? null,
        chargeBasis: service?.chargeBasis ?? null,
        bookingStage: service?.bookingStage ?? null,
        servicePrice: service?.servicePrice ?? null,
        unitPrice: service?.unitPrice ?? service?.servicePrice ?? null,
        grossAmount: service?.grossAmount ?? null,
        beforeTaxAmount: service?.beforeTaxAmount ?? null,
        taxBaseAmount: service?.taxBaseAmount ?? null,
        taxAmount: service?.taxAmount ?? null,
        taxPercentage: service?.taxPercentage ?? null,
        discountAmount: service?.discountAmountApplied ?? service?.discountValueApplied ?? null,
        discountType: service?.discountTypeApplied ?? null,
        discountValue: service?.discountValueApplied ?? null,
        discountCode: service?.discountCodeApplied ?? null,
        netAmount: service?.netAmount ?? null,
        amount:
          service?.afterTaxAmount ?? service?.netAmount ?? service?.servicePrice ?? 0,
        afterTaxAmount: service?.afterTaxAmount ?? null,
        paymentCollectionMode: service?.paymentCollectionMode ?? null,
        paymentStatus: service?.paymentStatus ?? null,
        paymentReference: service?.paymentReference ?? null,
        paidAmount: service?.paidAmount ?? null,
        balanceAmount: service?.balanceAmount ?? null,
        date: service?.date ?? null,
        imageUrl: service?.imageUrl ?? null,
        logoUrl: service?.logoUrl ?? null,
        sourceChannel: service?.sourceChannel ?? enquiry.externalSite ?? null,
      }))
    );

    enquiry.quotedGrandTotal = Number(
      ((enquiry.totalAmount || 0) + enquiry.selectedServiceTotal).toFixed(2)
    );
    enquiry.quotedPayableAmount = Number(
      ((enquiry.payableAmount || enquiry.totalAmount || 0) + enquiry.selectedServiceTotal).toFixed(2)
    );

    return enquiry;
  }

  private getPersistedSelectedServices(): PropertyServiceDTO[] {
    const selectedServices = this.token.getSelectedServices();
    if (Array.isArray(selectedServices) && selectedServices.length > 0) {
      return selectedServices;
    }

    const sessionAddOns = this.getSessionAddOnServices();
    if (sessionAddOns.length > 0) {
      return sessionAddOns;
    }

    const serviceData = this.token.getServiceData();
    if (Array.isArray(serviceData) && serviceData.length > 0) {
      return serviceData;
    }

    return [];
  }

  private getSessionAddOnServices(): PropertyServiceDTO[] {
    try {
      const storedAddOns = sessionStorage.getItem('addOnServices');
      if (!storedAddOns) {
        return [];
      }

      const parsedAddOns = JSON.parse(storedAddOns);
      return Array.isArray(parsedAddOns) ? parsedAddOns : [];
    } catch (error) {
      return [];
    }
  }

  emailEnquire(enquiry: EnquiryDto) {
    this.setApi();
    return this.http.post<EnquiryDto>(
      environment.apiUrlBookone + '/api/email/enquire',
      enquiry,
      { observe: 'response' }
    );
  }

   emailEnquireToMail(enquiry: EnquiryDto) {
    this.setApi();
    return this.http.post<EnquiryDto>(
      API_URL_IN + '/api/email/enquire',
      enquiry,
      { observe: 'response' }
    );
  }
    checkPaymentStatus(
    propertyId: number,
    transactionId: string
  ): Observable<any> {

    const url =
      PAYU_URL + `/api/payu/checkPaymentStatus/THM` +
      `?propertyId=${propertyId}` +
      `&transactionId=${transactionId}`;

    return this.http.get<any>(url);
  }
  checkPaymentStatusRazorPay(
    propertyId: number,
    orderId : string
  ): Observable<any> {
    const url =
      environment.razorPay + `/api/razorpay/hotelmate/order-status/` + orderId +
      `?propertyId=${propertyId}`;

    return this.http.get<any>(url);
  }
   convertEnquiryToPMS(payload: any): Observable<HttpResponse<any>> {
    const url = PAYU_URL + '/api/payu/convert-to-pms';

    return this.http.post<any>(
      url,
      payload,
      { observe: 'response' }
    );
  }

   checkBookingStatus(enquiryId: number): Observable<any> {
    const url =
     environment.apiLms + `/api/v1/accommodationEnquiry/${enquiryId}`;

    return this.http.get<any>(url);
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
