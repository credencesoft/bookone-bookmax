// import { OrderDto } from './../model/orderDto';
import { Injectable } from '@angular/core';
import { API_URL, API_URL_PROMOTION, APP_ID } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageDto } from '../model/MessageDto';
import { Payment } from '../model/payment';
import { Customer } from '../model/customer';
// import { DeliveryOption } from '../model/deliveryOption';
import { Slots } from '../model/slots';
// import { KOT } from '../model/KOT';
// import { Audit } from './audit';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  authorisationToken(message: MessageDto) {
    let headers = new HttpHeaders({
      'APP_ID': APP_ID
  });
    return this.http.post< MessageDto[]>(API_URL + '/api/message/authorisationToken', message, { headers: headers });
  }
  send(message: MessageDto) {
    return this.http.post< MessageDto[]>(API_URL + '/api/message/send', message, { observe: 'response' });
  }
  verifyAuthorisationToken(message: MessageDto) {
    let headers = new HttpHeaders({
      'APP_ID': APP_ID
  });
    return this.http.post< MessageDto[]>(API_URL + '/api/message/verifyAuthorisationToken', message, { headers: headers });
  }

  getSlotDataByDate(slot: Slots, serviceTypeId: string) {
    return this.http.get<Slots>(API_URL + '/api/website/' + serviceTypeId + '/slots?Date=' + slot.date, { observe: 'response' });
  }

  // createKots(kot:KOT[]) {
  //   return this.http.post<KOT[]>(
  //     API_URL + "/api/kot/createKots" , kot,
  //     { observe: "response" }
  //   );
  // }

  // createAuditReport(audit: Audit) {
  //   // Logger.log(booking);
  //   return this.http.post<Audit>(
  //     API_URL  + "/api/auditReports/",
  //     audit,
  //     { observe: "response" }
  //   );
  // }

//   createKot(kot: KOT) {
//     return this.http.post<KOT>(
//       API_URL + "/api/kot/create",
//         kot,
//         { observe: "response" }
//     );
// }

  // order(order: OrderDto){
  //   return this.http.post<OrderDto>(API_URL + '/api/order', order, { observe: 'response' });
  // }
  // processPayPalPayment(payment: Payment) {
  //   return this.http.post(API_URL + '/api/payment/create', payment, { observe: 'response' });
  // }
  paymentIntent(paymentDetails: Payment) {
    return this.http.post<Payment>(API_URL + '/api/website/paymentIntent', paymentDetails, { observe: 'response' });
}
paymentIntentPhonepe(paymentDetails: Payment) {
  return this.http.post<Payment>(
    'https://phonepe.bookonepms.com/api/phonepe/paymentIntentBookone',
    paymentDetails,
    { observe: 'response' }
  );
}

  processPayment(paymentDetails: Payment) {
    return this.http.post<Payment>(API_URL + '/api/website/processPayment', paymentDetails, { observe: 'response' });
}
  savePayment(paymentDetails: Payment) {
    return this.http.post<Payment>(API_URL + '/api/website/savePayment', paymentDetails, { observe: 'response' });
}

getAllResources(serviceId) {
  return this.http.get<any>(API_URL + '/api/website/' + serviceId + '/resources', { observe: 'response' });
}

getAllLocations(serviceId) {
  return this.http.get<any>(API_URL + '/api/website/' + serviceId + '/locations', { observe: 'response' });
}

getCustomerDetailsByEmail(email: string) {
  return this.http.get<Customer>(API_URL + '/api/website/email/' + email + '/', { observe: 'response' });
}
getCustomerDetailsByMobile(mobile: string) {
  return this.http.get<Customer>(API_URL + '/api/website/mobile/' + mobile, { observe: 'response' });
}
getOfferDetailsBySeoFriendlyName( seoName: string) {
  return this.http.get<any>(API_URL_PROMOTION + '/api/offer/findBySeofriendlyName/'+seoName+'/',{ observe: 'response' });
}
// getDeliveryOption(businessServiceId : number){
//   return this.http.get<DeliveryOption[]>(API_URL + '/api/website/'+businessServiceId+'/deliveryOptions' , { observe: 'response' });
// }
}
