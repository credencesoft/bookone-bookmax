import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BusinessUser } from '../model/user';
// import { ProductGroup } from '../model/productGroup';
// import { GoogleReview } from '../model/googleReview';
// import { API_URL_NZ, API_URL_IN } from '../app.component';
import { TokenStorage } from '../token.storage';
import { environment } from 'src/environments/environment';
// import { ProductGroup } from '../model/productGroup';
import { BusinessLineDTO } from '../model/businessLeadsDto';
import { API_URL_IN, API_URL_NZ } from 'src/app/app.component';
import { City } from 'src/model/address-setup/city';
import { BusinessUser } from 'src/app/model/user';
import { GoogleReview } from 'src/app/model/googleReview';
// import { City } from 'src/model/city';

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
  findPropertyBySEOName(seoFriendlyName: string) {
    this.setApi();
    return this.http.get<BusinessUser>(
      this.API_URL +
        '/api/website/findByPropertyBySEOFriendlyName/' +
        seoFriendlyName,
      { observe: 'response' }
    );
  }
  getAllReview(propertyId: number) {
    this.setApi();
    return this.http.get<GoogleReview[]>(
      this.API_URL + '/api/website/getGoogleReviews?PropertyId=' + propertyId,
      { observe: 'response' }
    );
  }
  findByPropertyId(id: number) {
    this.setApi();
    return this.http.get<BusinessUser>(
      this.API_URL + '/api/website/findByPropertyId/' + id,
      { observe: 'response' }
    );
  }
  runCampaign(campaignId:number,businessServiceId:string) {
    return this.http.get<any>(environment.apiUrlPromotion+ '/api/campaign/runCampaign/'+campaignId+'/businessLeadId/'+businessServiceId , { observe: 'response' });
   }
  // findProductsByBusinessServiceId(businessServiceId: number) {
  //   return this.http.get<ProductGroup[]>(this.API_URL + '/api/website/getProductList/' + businessServiceId, { observe: 'response' });
  // }
  saveBusinessLeads(businessLeads: BusinessLineDTO) {
    return this.http.post<BusinessLineDTO>(environment.apiLms + '/api/v1/businessLead',businessLeads, { observe: 'response' });
  }
  findAllSuburbByCities(city : string) {
    return this.http.get<any[]>(this.API_URL + '/api/website/allSuburbByCities?city='+city, { observe: 'response' });
  }
  getAllCityListByNameByBusinessType(businessType) {
    return this.http.get<City[]>(
      API_URL_IN + '/api/website/allCities?businessType=' + businessType,
      { observe: 'response' }
    );
  }
  // Not Working

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
        '/api/website/checkAvailability?city=' +
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



  getBusinessLeadByBusinessLeadId(businessLeadsId : string) {
    return this.http.get<BusinessLineDTO>(environment.apiLms + '/api/v1/businessLead/'+businessLeadsId, { observe: 'response' });
  }


  getBusinessBranch(id) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/' + id + '/branches',
      { observe: 'response' }
    );
  }




}
