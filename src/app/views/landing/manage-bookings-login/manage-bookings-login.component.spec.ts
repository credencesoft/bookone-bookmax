/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageBookingsLoginComponent } from './manage-bookings-login.component';

describe('ManageBookingsLoginComponent', () => {
  let component: ManageBookingsLoginComponent;
  let fixture: ComponentFixture<ManageBookingsLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBookingsLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBookingsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
