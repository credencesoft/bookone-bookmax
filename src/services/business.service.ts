import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { BusinessUser } from '../model/user';
import {
  API_URL_IN,
  API_URL_NZ,
  API_URL_PROMOTION,
} from 'src/app/app.component';
import { City } from '../model/address-setup/city';
import { TokenStorage } from '../token.storage';
import { BusinessUser } from 'src/app/model/user';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  API_URL: string = environment.nzAPIUrl;

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

  createUser(applicationUser: BusinessUser) {
    this.setApi();
    return this.http.post<BusinessUser>(
      this.API_URL + '/api/user/signup',
      applicationUser,
      { observe: 'response' }
    );
  }
  findAllSuburbByCities(city : string) {
    return this.http.get<any[]>(this.API_URL + '/api/website/allSuburbByCities?city='+city, { observe: 'response' });
  }
  updateuser(applicationUser: BusinessUser) {
    this.setApi();
    return this.http.post<BusinessUser>(
      this.API_URL + '/api/user/updateUser',
      applicationUser,
      { observe: 'response' }
    );
  }
  getBusinessBySearch(applicationUser: BusinessUser) {
    this.setApi();
    return this.http.post<BusinessUser>(
      this.API_URL + '/api/thm/findProperties',
      applicationUser,
      { observe: 'response' }
    );
  }
  getBusinessNameBySearch(search) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/findByPropertySearchName/' + search,
      { observe: 'response' }
    );
  }
  UpdateBusiness(applicationUser: BusinessUser) {
    this.setApi();
    return this.http.post<BusinessUser>(
      this.API_URL + '/api/website/user/update/property',
      applicationUser,
      { observe: 'response' }
    );
  }
  getBusinessTypeListGroup() {
    this.setApi();
    return this.http.get<any[]>(this.API_URL + '/api/website/businessGroup', {
      observe: 'response',
    });
  }
  getAllCityListByNameByBusinessType(businessType) {
    return this.http.get<City[]>(
      API_URL_IN + '/api/website/allCities?businessType=' + businessType,
      { observe: 'response' }
    );
  }
  getBusinessTypeByGroupName(businessGroupName) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/businessType/' + businessGroupName,
      { observe: 'response' }
    );
  }
  getBusinessTypeList() {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/businessTypeList',
      { observe: 'response' }
    );
  }
  getPropertyListByCity(city) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/property/city/' +city,
      { observe: 'response' }
    );
  }
  getPropertyListByState(city:string,pageNumber:number,pageSize:number,) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL + '/api/website/findPropertyByState/state/' +city +'?pageNumber='+pageNumber+'&pageSize='+pageSize,
      { observe: 'response' }
    );
  }
  getPropertyListByCityName(city:string,pageNumber:number,pageSize:number,businessType:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL + '/api/website/findPropertyByCity/city/' +city+'?pageNumber='+pageNumber+'&pageSize='+pageSize+'&businessType='+businessType,
      { observe: 'response' }
    );
  }
  getPropertyListByCityAndLocality(city:string,locality:string,pageNumber:number,pageSize:number,businessType:string) {
    this.setApi();
    return this.http.get<any>(
      this.API_URL + "/api/website/findPropertyByCityAndLocality?city="+city+"&locality="+locality+"&pageNumber="+pageNumber+"&pageSize="+pageSize +'&businessType='+businessType,
      { observe: 'response' }
    );
  }
  // getPropertyListByLocality(locality) {
  //   this.setApi();
  //   return this.http.get<any[]>(
  //     this.API_URL + '/api/website/getPropertiesByLocality/' +locality,
  //     { observe: 'response' }
  //   );
  // }
  getPropertiesByCity(city) {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/getPropertiesByCity/' + city,
      { observe: 'response' }
    );
  }
  getPropertiesCountByPropertyType() {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/getPropertiesCountByPropertyType',
      { observe: 'response' }
    );
  }
  getTotalRegisteredProperty() {
    this.setApi();
    return this.http.get<any[]>(
      this.API_URL + '/api/website/getTotalRegisteredProperty',
      { observe: 'response' }
    );
  }
  getOfferList() {
    this.setApi();
    return this.http.get<any[]>(
      API_URL_PROMOTION +
        '/api/offer/organisationId/' +
        environment.parentOrganisationId,
      { observe: 'response' }
    );
  }
  getOfferListFindBySeoFriendlyName(seoFriendlyName) {
    this.setApi();
    return this.http.get<any[]>(
      API_URL_PROMOTION +
        '/api/offer/findBySeofriendlyName/' +
        seoFriendlyName +
        '/',
      { observe: 'response' }
    );
  }
  getOfferById(offerId) {
    this.setApi();
    return this.http.get<any[]>(
      API_URL_PROMOTION + '/api/offer/findById/' + offerId,
      { observe: 'response' }
    );
  }
  getFeaturedBusinessList() {
    this.setApi();
    return this.http.get<any[]>(this.API_URL + '/api/website/findAllFeatured', {
      observe: 'response',
    });
  }
  getPropertyDetailsById(propertyId) {
    this.setApi();
    return this.http.get<any[]>(this.API_URL + '/api/website/' + propertyId, {
      observe: 'response',
    });
  }
}
