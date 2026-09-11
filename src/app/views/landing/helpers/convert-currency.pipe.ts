import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';

@Pipe({
  name: 'convertCurrency',
  pure: true
})
export class ConvertCurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(amount: number, fromCurrency: string, toCurrency: string, rates: any): number {
    if (!amount || isNaN(amount)) return 0;
    return this.currencyService.convertPrice(amount, fromCurrency, toCurrency, rates);
  }
}
