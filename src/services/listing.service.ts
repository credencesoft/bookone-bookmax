import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL_IN, API_URL_LMS, API_URL_NZ } from "src/app/app.component";
import { Booking } from "src/app/model/booking";
import { GoogleReview } from "src/app/model/googleReview";
import { BusinessUser } from "src/app/model/user";
import { environment } from "src/environments/environment";
import { City } from "src/model/address-setup/city";
import { BusinessLineDTO } from "src/model/businessLeadsDto";
import { TokenStorage } from "src/token.storage";


@Injectable({
  providedIn: 'root',
})
export class ListingService {
  API_URL: string;

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
  findProperties(applicationUser: BusinessUser) {
    this.setApi();
    return this.http.post<BusinessUser[]>(
      this.API_URL + '/api/thm/findProperties',
      applicationUser,
      { observe: 'response' }
    );
  }
  findAllSuburbByCities(city : string) {
    return this.http.get<any[]>(this.API_URL + '/api/thm/allSuburbByCities?city='+city, { observe: 'response' });
  }
  runCampaign(campaignId:number,businessServiceId:string) {
    return this.http.get<any>(environment.apiUrlPromotion+ '/api/campaign/runCampaign/'+campaignId+'/businessLeadId/'+businessServiceId , { observe: 'response' });
   }
  // findProductsByBusinessServiceId(businessServiceId: number) {
  //   return this.http.get<ProductGroup[]>(this.API_URL + '/api/thm/getProductList/' + businessServiceId, { observe: 'response' });
  // }
  saveBusinessLeads(businessLeads: BusinessLineDTO) {
    return this.http.post<BusinessLineDTO>(environment.apiLms + '/api/v1/businessLead',businessLeads, { observe: 'response' });
  }
  getAllCityListByNameByBusinessType(businessType) {
    return this.http.get<City[]>(
      API_URL_IN + '/api/thm/allCities?businessType=' + businessType,
      { observe: 'response' }
    );
  }
  // Not Working
  findByPropertyNameAndSuburb(suburb: string, propertyName: string) {
    this.setApi();
    return this.http.get<BusinessUser>(
      this.API_URL +
        '/api/thm/findByPropertyNameAndSuburb/' +
        suburb +
        '/' +
        propertyName,
      { observe: 'response' }
    );
  }
  findByPropertyByCityAndDate(
    city: string,
    checkInDate: string,
    checkOutDate: string,
    noOfRoom: number,
    noOfGuest: number,
    pageNumber:number,
    pageSize:number
  ) {
    this.setApi();

    return this.http.get<any>(
      this.API_URL +
        '/api/thm/checkAvailability?city=' +
        city +
        '&fromDate=' +
        checkInDate +
        '&toDate=' +
        checkOutDate +
        '&noOfRooms=' +
        noOfRoom +
        '&noOfPersons=' +
        noOfGuest +'&pageNumber=' +
        pageNumber+ '&pageSize=' +
        pageSize,
      { observe: 'response' }
    );
  }
  findPropertyBySEOName(seoFriendlyName: string) {
    this.setApi();
    return this.http.get<BusinessUser>(
      this.API_URL +
        '/api/thm/findByPropertyBySEOFriendlyName/' +
        seoFriendlyName,
      { observe: 'response' }
    );
  }
  findPropertyByBusinessSubType(businessSubType: string,pageNumber:number,pageSize:number) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
        '/api/thm/findPropertyByBusinessSubtype/' +
        businessSubType +'?pageNumber='+pageNumber + '&pageSize=' +pageSize ,
      { observe: 'response' }
    );
  }
  findPropertiesByMobilenumberenquiry(mobileNumber:string,bookingStatus:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
        '/api/thm/findBookings/' +
        mobileNumber+'?bookingStatus='+bookingStatus,
      { observe: 'response' }
    );
  }

  findPropertiesByemailenquiry(email:string,bookingStatus:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
        '/api/thm/findBookingsByEmail' +
        '?bookingStatus='+bookingStatus +'&email=' + email,
      { observe: 'response' }
    );
  }

  findPropertiesByemailenquirylms(email) {
    this.setApi();
    return this.http.get<any>(
      API_URL_LMS +
      '/api/v1/accommodationEnquiry/getBySearchCriteriaFromCurrentDate' + '?email=' + email,
      { observe: 'response' }
    );
  }


  findPropertiesByMobilenumberenquiryLms(phone) {
    this.setApi();
    return this.http.get<any>(
      API_URL_LMS +
      '/api/v1/accommodationEnquiry/getBySearchCriteriaFromCurrentDate' + '?phone=' + phone,
      { observe: 'response' }
    );
  }

  findPropertiesBybookingIdLms(enquiryId: number){
    return this.http.get<any>(
      API_URL_LMS + "/api/v1/accommodationEnquiry/getBySearchCriteriaFromCurrentDate" + '?enquiryId=' + enquiryId,
      {
        observe: "response",
      }
    );
  }


  findPropertiesBybookingIdenquiry(bookingId:string,bookingStatus:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
        '/api/thm/findBookingById?BookingId=' +
        bookingId,
      { observe: 'response' }
    );
  }

  findPropertiesByMobilenumber(mobileNumber:string) {
    // this.setApi();
    return this.http.get<Booking[]>(
      this.API_URL +
        '/api/thm/findBookings/' +
        mobileNumber,
      { observe: 'response' }
    );
  }

  findPropertiesByemail(email:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
        "/api/thm/findBookingsByEmail?email=" +
        email,
      { observe: 'response' }
    );
  }

  findPropertiesBybookingId(bookingId:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL +
        "/api/thm/findBookingById?BookingId=" +
        bookingId,
      { observe: 'response' }
    );
  }



  findByPropertyId(id: number) {
    this.setApi();
    return this.http.get<BusinessUser>(
    this.API_URL+ '/api/thm/findByPropertyId/' + id,
      { observe: 'response' }
    );
  }
  getBusinessLeadByBusinessLeadId(businessLeadsId : string) {
    return this.http.get<BusinessLineDTO>(environment.apiLms + '/api/v1/businessLead/'+businessLeadsId, { observe: 'response' });
  }


  getBusinessBranch(id) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/thm/' + id + '/branches',
      { observe: 'response' }
    );
  }

  getAllReview(propertyId: number) {
    this.setApi();
    return this.http.get<GoogleReview[]>(
      this.API_URL + '/api/thm/getGoogleReviews?PropertyId=' + propertyId,
      { observe: 'response' }
    );
  }

  getPropertiesByLocality(locality: String) {
    this.setApi();
    return this.http.get<BusinessUser[]>(
      this.API_URL + '/api/thm/getPropertiesByLocality/' + locality,
      { observe: 'response' }
    );
  }
}
