import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../views/landing/components/dynamic-pricing/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  dataURL = 'http://api.currencylayer.com/live?access_key=cdbf2fb00f8585f98b57a68069cdf97d';
  currency: Currency;
  Currency: any;
  constructor(private http: HttpClient) { }

  getCurrencyRate() {
    return this.http.get<Currency>(this.dataURL, {observe: 'response'});
  }


}
