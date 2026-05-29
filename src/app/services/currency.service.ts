import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  // Free public API with no key required
  private apiURL = 'https://open.er-api.com/v6/latest/USD';
  
  // Cache duration in milliseconds (12 hours)
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  /**
   * Fetches latest exchange rates with Server-side (Node) and Client-side (Browser) caching
   */
  getLatestRates(): Observable<any> {
    const now = Date.now();

    // SERVER-SIDE SSR CACHING (Node global memory)
    if (isPlatformServer(this.platformId)) {
      const globalObj = global as any;
      if (globalObj.cachedRates && (now - globalObj.cachedRatesTimestamp < this.CACHE_DURATION)) {
        return of(globalObj.cachedRates);
      }

      return this.http.get<any>(this.apiURL).pipe(
        tap(data => {
          globalObj.cachedRates = data;
          globalObj.cachedRatesTimestamp = now;
        })
      );
    }

    // CLIENT-SIDE BROWSER CACHING (localStorage)
    try {
      const cached = localStorage.getItem('currency_rates');
      const cachedTime = localStorage.getItem('currency_rates_timestamp');

      if (cached && cachedTime && (now - Number(cachedTime) < this.CACHE_DURATION)) {
        return of(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Error reading localStorage cache:', e);
    }

    // If cache missed, fetch fresh rates
    return this.http.get<any>(this.apiURL).pipe(
      tap(data => {
        try {
          localStorage.setItem('currency_rates', JSON.stringify(data));
          localStorage.setItem('currency_rates_timestamp', now.toString());
        } catch (e) {
          console.error('Error writing to localStorage cache:', e);
        }
      })
    );
  }

  /**
   * Performs dynamic conversion from one currency to another using the cached rates
   */
  convertPrice(amount: number, fromCurrency: string, toCurrency: string, rates: any): number {
    if (!amount || fromCurrency === toCurrency || !rates) return amount;

    const rateToINR = rates[fromCurrency]; // e.g., rates['INR']
    const rateToTarget = rates[toCurrency]; // e.g., rates['USD']

    if (rateToINR && rateToTarget) {
      // Math: Convert local currency to USD, then USD to target currency
      return (amount / rateToINR) * rateToTarget;
    }
    return amount;
  }

  /**
   * Legacy backward-compatible method for old pages (e.g. dynamic pricing component)
   */
  getCurrencyRate(): Observable<any> {
    return of({ body: { quotes: {} } });
  }
}
