
export interface CurrencyListInterFace {
  
  name: string;
  rate: number;
  viewname: string;
  symbol: string;
}

export class CurrencyRate {

  currencys: CurrencyListInterFace[] = [
    { name: 'NZD', viewname: 'New Zeland', rate: 1.54607, symbol: '$' },
    { name: 'INR', viewname: 'India', rate: 71.53 , symbol: '₹' },
    { name: 'GBP', viewname: 'Africa', rate: 0.758283  , symbol: '$'},
    { name: 'AUD', viewname: 'Austrilia', rate: 1.49411, symbol: '$'  },
    { name: 'BDT', viewname: 'Bangladesh', rate: 84.95829 , symbol: '৳' },
    { name: 'EUR', viewname: 'United Kingdom', rate: 0.92, symbol: '€' },
  ];


  constructor() {
   }
}