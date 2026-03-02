import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  static info(value: any, ...rest: any[]): void {
    if (!environment.production) {
      console.log(value, rest);
    }
  }

  static log(value: any, ...rest: any[]): void {
    if (!environment.production) {
      console.log(value, rest);
    }
  }

  static warn(value: any, ...rest: any[]): void {
    if (!environment.production) {
      console.warn(value, rest);
    }
  }

  static error(value: any, ...rest: any[]): void {
    if (!environment.production) {
      console.error(value, rest);
    }
  }
}
