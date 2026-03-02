/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookingCompleteComponent } from './booking-complete.component';

describe('BookingCompleteComponent', () => {
  let component: BookingCompleteComponent;
  let fixture: ComponentFixture<BookingCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
