import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
// import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root',
})
export class TriggerEventService {
  private _subject = new Subject<any>();

  newEvent(event) {
    this._subject.next(event);
  }

  get events$() {
    return this._subject.asObservable();
  }

  constructor() {}
}
