import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly instance$ = new ReplaySubject<unknown>(1);
  readonly checkoutJsInstance$: Observable<unknown> = this.instance$.asObservable();

  init(config: unknown): void {
    this.instance$.next(config);
  }
}
